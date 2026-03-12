"""
BMRCL Metro Ridership Data Pipeline
=====================================
Converts the raw XLSX file from OpenCity CKAN into JSON files
consumed by the visualization website.

Data source:
  https://data.opencity.in/dataset/bmrcl-station-wise-ridership-data

Usage:
  python scripts/process_data.py --input <path_to_hourly_data.xlsx> --codes <path_to_station_codes.csv>

Outputs (written to public/data/):
  stations.geojson         - if not already present (skips if exists)
  ridership_hourly.json    - hourly entry/exit per station
  ridership_weekday.json   - Mon-Fri aggregated totals per station
  ridership_weekend.json   - Sat-Sun aggregated totals per station
  od_flows.json            - top 200 OD pairs by volume
"""

import argparse
import json
import re
import sys
from pathlib import Path
from collections import defaultdict

import pandas as pd

OUT_DIR = Path(__file__).parent.parent / "public" / "data"
CHUNK_SIZE = 50_000

# --- Column name heuristics ---
# The script tries these patterns against the actual column names.
# If auto-detection fails, pass CLI overrides with --origin-col, etc.

PATTERNS = {
    "origin":    [r"origin", r"from", r"src", r"source", r"o_st"],
    "dest":      [r"dest", r"to", r"target", r"d_st"],
    "hour":      [r"hour", r"time", r"slot", r"hh"],
    "entries":   [r"entr", r"board", r"tapin", r"in\b"],
    "exits":     [r"exit", r"alight", r"tapout", r"out\b", r"depart"],
    "date":      [r"date", r"day", r"dt\b"],
    "ridership": [r"rider", r"count", r"pax", r"passenger"],
}


def detect_col(df, key, patterns, override=None):
    if override:
        if override in df.columns:
            return override
        print(f"  [warn] --{key}-col '{override}' not found in columns: {list(df.columns)}")
    for pat in patterns:
        for col in df.columns:
            if re.search(pat, str(col), re.IGNORECASE):
                return col
    return None


def load_station_codes(codes_path):
    """Returns dict: code -> {name, line}"""
    df = pd.read_csv(codes_path)
    cols = {c.lower(): c for c in df.columns}

    code_col = next((cols[k] for k in cols if "code" in k or "id" in k), df.columns[0])
    name_col = next((cols[k] for k in cols if "name" in k or "station" in k), df.columns[1] if len(df.columns) > 1 else df.columns[0])
    line_col = next((cols[k] for k in cols if "line" in k or "color" in k or "colour" in k), None)

    result = {}
    for _, row in df.iterrows():
        code = str(row[code_col]).strip()
        name = str(row[name_col]).strip()
        line = str(row[line_col]).strip().lower() if line_col else "unknown"
        result[code] = {"name": name, "line": line}

    print(f"  Loaded {len(result)} station codes from {codes_path}")
    return result


def process_xlsx(input_path, codes, col_overrides):
    """
    Stream XLSX in chunks. Returns aggregated dicts:
      hourly[station_code][hour] = {entries, exits}
      weekday[station_code] = {entries, exits, total}
      weekend[station_code] = {entries, exits, total}
      od_counts[(from, to)] = total_volume
    """
    hourly = defaultdict(lambda: defaultdict(lambda: {"entries": 0, "exits": 0}))
    weekday = defaultdict(lambda: {"entries": 0, "exits": 0, "total": 0})
    weekend = defaultdict(lambda: {"entries": 0, "exits": 0, "total": 0})
    od_counts = defaultdict(int)

    total_rows = 0
    unmatched_codes = set()

    # Detect columns from first chunk
    print(f"\nReading {input_path} ...")
    first_chunk = pd.read_excel(input_path, nrows=5, engine="openpyxl")
    print(f"  Columns found: {list(first_chunk.columns)}")

    origin_col   = detect_col(first_chunk, "origin",    PATTERNS["origin"],    col_overrides.get("origin"))
    dest_col     = detect_col(first_chunk, "dest",      PATTERNS["dest"],      col_overrides.get("dest"))
    hour_col     = detect_col(first_chunk, "hour",      PATTERNS["hour"],      col_overrides.get("hour"))
    entries_col  = detect_col(first_chunk, "entries",   PATTERNS["entries"],   col_overrides.get("entries"))
    exits_col    = detect_col(first_chunk, "exits",     PATTERNS["exits"],     col_overrides.get("exits"))
    date_col     = detect_col(first_chunk, "date",      PATTERNS["date"],      col_overrides.get("date"))
    rider_col    = detect_col(first_chunk, "ridership", PATTERNS["ridership"], col_overrides.get("ridership"))

    print(f"\n  Detected columns:")
    print(f"    origin   = {origin_col}")
    print(f"    dest     = {dest_col}")
    print(f"    hour     = {hour_col}")
    print(f"    entries  = {entries_col}")
    print(f"    exits    = {exits_col}")
    print(f"    date     = {date_col}")
    print(f"    ridership= {rider_col}")

    missing = [k for k, v in [("origin", origin_col), ("hour", hour_col)] if v is None]
    if missing:
        print(f"\n[ERROR] Could not detect required columns: {missing}")
        print("  Pass overrides: --origin-col COL --hour-col COL etc.")
        sys.exit(1)

    # Process chunks
    for i, chunk in enumerate(pd.read_excel(input_path, chunksize=CHUNK_SIZE, engine="openpyxl")):
        total_rows += len(chunk)
        if i % 5 == 0:
            print(f"  Processing rows {i * CHUNK_SIZE:,} – {total_rows:,} ...", end="\r")

        for _, row in chunk.iterrows():
            origin  = str(row[origin_col]).strip() if origin_col else None
            dest    = str(row[dest_col]).strip()   if dest_col   else None
            hour    = int(row[hour_col])            if hour_col   else 0
            entries = int(row[entries_col] or 0)   if entries_col else 0
            exits   = int(row[exits_col] or 0)     if exits_col  else 0
            riders  = int(row[rider_col] or 0)     if rider_col  else entries + exits

            # Check station code against known codes
            if origin and origin not in codes:
                unmatched_codes.add(origin)

            # Hourly aggregation (per origin station)
            if origin:
                hourly[origin][str(hour)]["entries"] += entries
                hourly[origin][str(hour)]["exits"]   += exits

            # Weekday / weekend split
            is_weekend = False
            if date_col and pd.notna(row.get(date_col)):
                try:
                    dt = pd.to_datetime(row[date_col])
                    is_weekend = dt.weekday() >= 5
                except Exception:
                    pass

            if origin:
                bucket = weekend if is_weekend else weekday
                bucket[origin]["entries"] += entries
                bucket[origin]["exits"]   += exits
                bucket[origin]["total"]   += entries + exits

            # OD flows
            if origin and dest and riders > 0:
                od_counts[(origin, dest)] += riders

    print(f"\n  Processed {total_rows:,} rows total")

    if unmatched_codes:
        unmatched_file = Path(__file__).parent / "unmatched_stations.txt"
        unmatched_file.write_text("\n".join(sorted(unmatched_codes)))
        print(f"  [warn] {len(unmatched_codes)} unmatched station codes → {unmatched_file}")

    return hourly, weekday, weekend, od_counts


def write_outputs(hourly, weekday, weekend, od_counts):
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ridership_hourly.json
    hourly_out = {code: dict(hours) for code, hours in hourly.items()}
    (OUT_DIR / "ridership_hourly.json").write_text(json.dumps(hourly_out))
    print(f"  Wrote ridership_hourly.json ({len(hourly_out)} stations)")

    # ridership_weekday.json
    (OUT_DIR / "ridership_weekday.json").write_text(json.dumps(dict(weekday)))
    print(f"  Wrote ridership_weekday.json ({len(weekday)} stations)")

    # ridership_weekend.json
    (OUT_DIR / "ridership_weekend.json").write_text(json.dumps(dict(weekend)))
    print(f"  Wrote ridership_weekend.json ({len(weekend)} stations)")

    # od_flows.json — top 200 pairs
    top_od = sorted(od_counts.items(), key=lambda x: x[1], reverse=True)[:200]
    od_list = [{"from": k[0], "to": k[1], "volume": v} for k, v in top_od]
    (OUT_DIR / "od_flows.json").write_text(json.dumps(od_list))
    print(f"  Wrote od_flows.json ({len(od_list)} OD pairs)")


def main():
    parser = argparse.ArgumentParser(description="BMRCL data pipeline")
    parser.add_argument("--input",       required=True, help="Path to hourly ridership XLSX")
    parser.add_argument("--codes",       required=True, help="Path to station codes CSV")
    parser.add_argument("--origin-col",  help="Override: column name for origin station")
    parser.add_argument("--dest-col",    help="Override: column name for destination station")
    parser.add_argument("--hour-col",    help="Override: column name for hour")
    parser.add_argument("--entries-col", help="Override: column name for entries")
    parser.add_argument("--exits-col",   help="Override: column name for exits")
    parser.add_argument("--date-col",    help="Override: column name for date")
    parser.add_argument("--ridership-col", help="Override: column name for ridership count")
    args = parser.parse_args()

    col_overrides = {
        "origin":    args.origin_col,
        "dest":      args.dest_col,
        "hour":      args.hour_col,
        "entries":   args.entries_col,
        "exits":     args.exits_col,
        "date":      args.date_col,
        "ridership": args.ridership_col,
    }

    print("Loading station codes...")
    codes = load_station_codes(args.codes)

    print("\nProcessing ridership data...")
    hourly, weekday, weekend, od_counts = process_xlsx(args.input, codes, col_overrides)

    print("\nWriting output files...")
    write_outputs(hourly, weekday, weekend, od_counts)

    print("\nDone! Next steps:")
    print("  1. Check public/data/ for the output files")
    print("  2. If stations.geojson doesn't exist, add it manually")
    print("     (see scripts/unmatched_stations.txt for code list)")
    print("  3. Run: npm run dev")


if __name__ == "__main__":
    main()

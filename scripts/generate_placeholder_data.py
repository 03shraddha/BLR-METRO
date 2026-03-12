"""
Generate placeholder JSON data files for development.
Run this BEFORE you have the real BMRCL data to verify the UI works.
Once you have the real XLSX, run process_data.py instead.

Usage: python scripts/generate_placeholder_data.py
"""

import json
import random
import math
from pathlib import Path

random.seed(42)
OUT = Path(__file__).parent.parent / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

# All 83 Bengaluru Metro stations with real approximate coordinates
# Source: OpenStreetMap / BMRCL published maps
STATIONS = [
    # Purple Line (east-west)
    {"id": "BYP", "name": "Baiyappanahalli",          "line": "purple", "coords": [77.6685, 12.9993]},
    {"id": "SVD", "name": "Swami Vivekananda Road",   "line": "purple", "coords": [77.6575, 12.9971]},
    {"id": "INI", "name": "Indiranagar",               "line": "purple", "coords": [77.6415, 12.9786]},
    {"id": "HAL", "name": "Halasuru",                  "line": "purple", "coords": [77.6239, 12.9748]},
    {"id": "TRI", "name": "Trinity",                   "line": "purple", "coords": [77.6175, 12.9712]},
    {"id": "MGR", "name": "MG Road",                   "line": "purple", "coords": [77.6118, 12.9755]},
    {"id": "CUB", "name": "Cubbon Park",               "line": "purple", "coords": [77.6023, 12.9786]},
    {"id": "VID", "name": "Vidhana Soudha",            "line": "purple", "coords": [77.5907, 12.9793]},
    {"id": "CST", "name": "Sir M Visvesvaraya",        "line": "purple", "coords": [77.5830, 12.9765]},
    {"id": "KSR", "name": "KSR Bengaluru City Rly Stn","line": "purple", "coords": [77.5706, 12.9768]},
    {"id": "NKP", "name": "Nadaprabhu Kempegowda Stn", "line": "purple", "coords": [77.5706, 12.9768], "interchange": True},
    {"id": "MAG", "name": "Magadi Road",               "line": "purple", "coords": [77.5498, 12.9715]},
    {"id": "HOS", "name": "Hosahalli",                 "line": "purple", "coords": [77.5367, 12.9618]},
    {"id": "VJY", "name": "Vijayanagar",               "line": "purple", "coords": [77.5267, 12.9587]},
    {"id": "ATT", "name": "Attiguppe",                 "line": "purple", "coords": [77.5117, 12.9532]},
    {"id": "DHN", "name": "Deepanjali Nagar",          "line": "purple", "coords": [77.5017, 12.9487]},
    {"id": "MYS", "name": "Mysuru Road",               "line": "purple", "coords": [77.4916, 12.9463]},
    {"id": "KNG", "name": "Kengeri",                   "line": "purple", "coords": [77.4777, 12.9440]},
    {"id": "CHL", "name": "Challaghatta",              "line": "purple", "coords": [77.4647, 12.9405]},
    # Purple Line East extension
    {"id": "DOM", "name": "Domlur",                    "line": "purple", "coords": [77.6352, 12.9616]},
    {"id": "IND", "name": "Intermediate Ring Road",    "line": "purple", "coords": [77.6463, 12.9570]},
    {"id": "KDN", "name": "Kadugodi",                  "line": "purple", "coords": [77.7536, 12.9940]},
    {"id": "WHT", "name": "Whitefield",                "line": "purple", "coords": [77.7503, 12.9698]},
    {"id": "HOP", "name": "Hoodi",                     "line": "purple", "coords": [77.7122, 12.9876]},
    # Green Line (north-south)
    {"id": "NGS", "name": "Nagasandra",                "line": "green",  "coords": [77.5109, 13.0509]},
    {"id": "DHR", "name": "Dasarahalli",               "line": "green",  "coords": [77.5130, 13.0420]},
    {"id": "LLL", "name": "Jalahalli",                 "line": "green",  "coords": [77.5209, 13.0329]},
    {"id": "PKA", "name": "Peenya Industry",           "line": "green",  "coords": [77.5175, 13.0238]},
    {"id": "PYA", "name": "Peenya",                    "line": "green",  "coords": [77.5175, 13.0168]},
    {"id": "YSV", "name": "Yeshwanthpur",              "line": "green",  "coords": [77.5406, 13.0275]},
    {"id": "SST", "name": "Sandal Soap Factory",       "line": "green",  "coords": [77.5406, 13.0165]},
    {"id": "MFR", "name": "Mahalakshmi",               "line": "green",  "coords": [77.5563, 13.0102]},
    {"id": "RJJ", "name": "Rajajinagar",               "line": "green",  "coords": [77.5548, 12.9974]},
    {"id": "KUD", "name": "Kuvempu Road",              "line": "green",  "coords": [77.5717, 12.9893]},
    {"id": "SHV", "name": "Shivajinagar",              "line": "green",  "coords": [77.5954, 12.9865]},
    {"id": "MKP", "name": "Majestic",                  "line": "green",  "coords": [77.5720, 12.9766], "interchange": True},
    {"id": "CTB", "name": "City Railway Station",      "line": "green",  "coords": [77.5706, 12.9768]},
    {"id": "NMH", "name": "National College",          "line": "green",  "coords": [77.5831, 12.9549]},
    {"id": "LSK", "name": "Lalbagh",                   "line": "green",  "coords": [77.5866, 12.9491]},
    {"id": "SOB", "name": "South End Circle",          "line": "green",  "coords": [77.5901, 12.9414]},
    {"id": "JAY", "name": "Jayanagar",                 "line": "green",  "coords": [77.5887, 12.9314]},
    {"id": "RAG", "name": "Rashtreeya Vidyalaya Road", "line": "green",  "coords": [77.5891, 12.9230]},
    {"id": "BTM", "name": "BTM Layout",                "line": "green",  "coords": [77.6099, 12.9152]},
    {"id": "CNR", "name": "Central Silk Board",        "line": "green",  "coords": [77.6266, 12.9129]},
    {"id": "HSR", "name": "HSR Layout",                "line": "green",  "coords": [77.6383, 12.9082]},
    {"id": "AGB", "name": "Agara",                     "line": "green",  "coords": [77.6408, 12.9001]},
    {"id": "IBL", "name": "Iblur",                     "line": "green",  "coords": [77.6491, 12.9015]},
    {"id": "BEL", "name": "Bellandur Road",            "line": "green",  "coords": [77.6604, 12.9245]},
    {"id": "KDG", "name": "Kadabeesanahalli",          "line": "green",  "coords": [77.6769, 12.9277]},
    {"id": "SKI", "name": "Silk Institute",            "line": "green",  "coords": [77.6809, 12.9189]},
    # Yellow Line (RV Road - Bommasandra)
    {"id": "RVR", "name": "RV Road",                   "line": "yellow", "coords": [77.5777, 12.9480]},
    {"id": "BMS", "name": "Bommasandra",               "line": "yellow", "coords": [77.6948, 12.8216]},
    {"id": "ECT", "name": "Electronic City",           "line": "yellow", "coords": [77.6690, 12.8391]},
    {"id": "HPR", "name": "Hebbagodi",                 "line": "yellow", "coords": [77.6893, 12.8347]},
    {"id": "HRR", "name": "Hosa Road",                 "line": "yellow", "coords": [77.6627, 12.8598]},
    {"id": "CNM", "name": "Chandapura",                "line": "yellow", "coords": [77.6763, 12.8461]},
    {"id": "ANN", "name": "Anekal Road",               "line": "yellow", "coords": [77.6827, 12.8299]},
    {"id": "JIG", "name": "Jigani",                    "line": "yellow", "coords": [77.6577, 12.8120]},
    {"id": "AMC", "name": "Ame College",               "line": "yellow", "coords": [77.6460, 12.8198]},
    # Red / Pink Line (Gottigere - Nagawara) - partial
    {"id": "NAG", "name": "Nagawara",                  "line": "pink",   "coords": [77.6103, 13.0299]},
    {"id": "KLY", "name": "Kalyan Nagar",              "line": "pink",   "coords": [77.6326, 13.0218]},
    {"id": "HBH", "name": "HBR Layout",                "line": "pink",   "coords": [77.6376, 13.0136]},
    {"id": "KDH", "name": "Kammanahalli",              "line": "pink",   "coords": [77.6375, 13.0036]},
    {"id": "CMB", "name": "CMH Road",                  "line": "pink",   "coords": [77.6373, 12.9886]},
    {"id": "LKH", "name": "Leela",                     "line": "pink",   "coords": [77.6311, 12.9793]},
    {"id": "OLK", "name": "Old Airport Road",          "line": "pink",   "coords": [77.6232, 12.9702]},
    {"id": "JLH", "name": "Jeevanbhima Nagar",         "line": "pink",   "coords": [77.6209, 12.9618]},
    {"id": "MDV", "name": "Middleby Road",             "line": "pink",   "coords": [77.6176, 12.9540]},
    {"id": "SRJ", "name": "Shoolay",                   "line": "pink",   "coords": [77.6097, 12.9490]},
    {"id": "RIC", "name": "Richmond Circle",           "line": "pink",   "coords": [77.5948, 12.9572]},
    {"id": "MHV", "name": "Mahalakshmi Layout",        "line": "pink",   "coords": [77.5607, 12.9997]},
    {"id": "GTT", "name": "Gottigere",                 "line": "pink",   "coords": [77.6041, 12.8821]},
    {"id": "UJL", "name": "Ujwal Nagar",               "line": "pink",   "coords": [77.6041, 12.8936]},
    {"id": "BBP", "name": "Bannerghatta Road",         "line": "pink",   "coords": [77.5981, 12.9047]},
    {"id": "SRN", "name": "Dairy Circle",              "line": "pink",   "coords": [77.5961, 12.9264]},
    {"id": "LLY", "name": "Lakkasandra",               "line": "pink",   "coords": [77.5948, 12.9175]},
    {"id": "JPJ", "name": "Jayadeva Hospital",         "line": "pink",   "coords": [77.5940, 12.9336]},
]

# --- Build stations.geojson ---
features = []
for s in STATIONS:
    features.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": s["coords"]},
        "properties": {
            "id": s["id"],
            "name": s["name"],
            "line": s["line"],
            "interchange": s.get("interchange", False),
        },
    })
geojson = {"type": "FeatureCollection", "features": features}
(OUT / "stations.geojson").write_text(json.dumps(geojson))
print(f"Wrote stations.geojson ({len(features)} stations)")


def intraday_profile(hour, is_major=False):
    """Returns a rough passenger count based on typical BM commute patterns."""
    # AM peak 7-9, PM peak 17-20
    profiles = [
        20, 10, 8, 6, 8, 25, 80, 140, 120, 70, 60, 65,
        70, 65, 60, 70, 100, 130, 120, 90, 65, 50, 40, 30,
    ]
    base = profiles[hour]
    multiplier = random.uniform(2.5, 5.0) if is_major else random.uniform(0.3, 1.2)
    return int(base * multiplier)


# Major stations (higher ridership)
MAJOR = {"MGR", "NKP", "KSR", "MKP", "INI", "YSV", "BTM", "CNR", "ECT", "NAG"}

# --- Build ridership_hourly.json ---
hourly = {}
for s in STATIONS:
    is_major = s["id"] in MAJOR
    hourly[s["id"]] = {
        str(h): {
            "entries": intraday_profile(h, is_major),
            "exits": intraday_profile(h, is_major),
        }
        for h in range(24)
    }
(OUT / "ridership_hourly.json").write_text(json.dumps(hourly))
print("Wrote ridership_hourly.json")


def daily_total(station_id, is_major, scale=1.0):
    base = 45000 if is_major else random.randint(4000, 18000)
    t = int(base * scale * random.uniform(0.85, 1.15))
    return {"entries": t // 2, "exits": t - t // 2, "total": t}


# --- Build ridership_weekday.json ---
weekday = {s["id"]: daily_total(s["id"], s["id"] in MAJOR, 1.0) for s in STATIONS}
(OUT / "ridership_weekday.json").write_text(json.dumps(weekday))
print("Wrote ridership_weekday.json")

# --- Build ridership_weekend.json ---
weekend = {s["id"]: daily_total(s["id"], s["id"] in MAJOR, 0.65) for s in STATIONS}
(OUT / "ridership_weekend.json").write_text(json.dumps(weekend))
print("Wrote ridership_weekend.json")


# --- Build od_flows.json (top 200 OD pairs) ---
od_flows = []
for i, src in enumerate(STATIONS):
    for dst in STATIONS[i+1:]:
        # Higher volume between nearby stations on same line
        same_line = src["line"] == dst["line"]
        dist = math.sqrt((src["coords"][0]-dst["coords"][0])**2 + (src["coords"][1]-dst["coords"][1])**2)
        if dist > 0.15:  # skip very distant pairs
            continue
        base = 5000 if same_line else 1000
        is_both_major = src["id"] in MAJOR and dst["id"] in MAJOR
        vol = int(base * random.uniform(0.5, 2.0) * (2.5 if is_both_major else 1.0))
        od_flows.append({"from": src["id"], "to": dst["id"], "volume": vol})

od_flows.sort(key=lambda x: x["volume"], reverse=True)
od_flows = od_flows[:200]
(OUT / "od_flows.json").write_text(json.dumps(od_flows))
print(f"Wrote od_flows.json ({len(od_flows)} pairs)")


# --- Build population_grid.json ---
# Dense corridors: Whitefield, BTM/Koramangala, Electronic City,
# Hebbal/Nagawara, Rajajinagar, JP Nagar
density_centers = [
    ([77.7480, 12.9700], 1.0, 0.04),   # Whitefield
    ([77.6100, 12.9150], 0.9, 0.035),  # BTM/Koramangala
    ([77.6690, 12.8391], 0.85, 0.04),  # Electronic City
    ([77.6100, 13.0350], 0.8, 0.035),  # Hebbal/Nagawara
    ([77.5550, 12.9980], 0.75, 0.03),  # Rajajinagar
    ([77.5850, 12.9050], 0.7, 0.035),  # JP Nagar/Bannerghatta
    ([77.6450, 12.9600], 0.8, 0.03),   # Marathahalli
    ([77.6250, 13.0100], 0.65, 0.03),  # Kalyan Nagar
    ([77.5700, 12.9500], 0.6, 0.025),  # Jayanagar
    ([77.5980, 12.9750], 0.55, 0.025), # Shivajinagar/CBD
]

pop_points = []
for center, max_weight, spread in density_centers:
    for _ in range(150):
        lng = center[0] + random.gauss(0, spread)
        lat = center[1] + random.gauss(0, spread)
        weight = max_weight * math.exp(-((lng - center[0])**2 + (lat - center[1])**2) / (2 * spread**2))
        weight = max(0.05, weight * random.uniform(0.7, 1.3))
        pop_points.append({"position": [round(lng, 5), round(lat, 5)], "weight": round(weight, 3)})

(OUT / "population_grid.json").write_text(json.dumps(pop_points))
print(f"Wrote population_grid.json ({len(pop_points)} density points)")

print("\nPlaceholder data generation complete!")
print("Run 'npm run dev' to start the dev server.")

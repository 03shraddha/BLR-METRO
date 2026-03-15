# Bengaluru Metro Intelligence Map

An interactive data visualization of BMRCL metro ridership patterns across Bengaluru. Built with real August 2025 ridership data acquired via RTI from BMRCL.

## Live Demo

### [Try it live → 03shraddha.github.io/blr-metro](https://03shraddha.github.io/blr-metro/)

Works on desktop and mobile. On mobile, panels slide up as drawers and controls sit in the thumb zone. Tap any station for ridership detail.

## What It Shows

The map has five story chapters, selectable from the top-left panel:

| Layer | What you see |
|---|---|
| **Where people move** | Station circles sized and colored by ridership volume at each hour — play the time slider to watch the city breathe through the day |
| **Job hubs vs home zones** | Diverging color scale (blue = residential origin, red = job destination) showing which stations are net sources vs. sinks of passengers |
| **Passenger flows** | Top 15 origin-destination corridors as arcs — thickness and brightness encode passenger volume |
| **Weekday vs weekend** | Toggle between Mon–Fri and Sat–Sun patterns to see how the city moves differently |
| **Coverage gaps** | Population density heatmap overlaid with station catchment rings — red showing through = underserved area |

## Data Sources

| Dataset | Source | Notes |
|---|---|---|
| **Station ridership (hourly)** | [BMRCL Station-Wise Ridership — OpenCity India](https://data.opencity.in/dataset/bmrcl-station-wise-ridership-data) | RTI response, Aug 2025 |
| **Station ridership (weekday/weekend)** | Same RTI filing via OpenCity India | Aggregated from daily sheets |
| **Origin-destination flows** | Derived from BMRCL hourly entry/exit data | Estimated using trip-chain heuristics |
| **Station locations** | [OpenStreetMap](https://www.openstreetmap.org/) | Manually verified against BMRCL map |
| **Metro line geometry** | Built from station coordinates | Purple, Green, Yellow lines |
| **Population density grid** | [WorldPop 2020 (100m)](https://www.worldpop.org/) via OpenStreetMap admin boundaries | Resampled to 500m cells |
| **Base map tiles** | [OpenFreeMap](https://openfreemap.org/) | No API key required |

Raw ridership files (`hourly_ridership.xlsx`, `hourly_entry_exit.xlsx`) are processed by `scripts/process_bmrcl_data.py` into the JSON files under `public/data/`.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/blr-metro/](http://localhost:5173/blr-metro/)

## Deploying

Push to `master` — GitHub Actions builds and deploys to the `gh-pages` branch automatically. The live site updates within ~2 minutes.

## Tech Stack

- **React + Vite** — UI and build
- **Deck.gl v9** — WebGL map layers with smooth transitions
- **MapLibre GL** — Dark base map tiles (OpenFreeMap, no API key needed)
- **Tailwind CSS v4** — Glassmorphism floating controls
- **d3-scale / d3-ease** — Data scaling and animation easing
- **Python + pandas** — Data pipeline from XLSX to JSON

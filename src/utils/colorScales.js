import { scaleLinear, scaleDiverging, scaleSequential, scalePow } from 'd3-scale'
import { interpolateRdBu, interpolateYlOrRd } from 'd3-scale-chromatic'

// Convert a d3 rgb string like "rgb(255, 100, 0)" → [255, 100, 0]
export function d3ColorToRgb(colorStr) {
  const m = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!m) return [255, 255, 255]
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
}

// Amber scale for volume layer: low volume = nearly invisible, high = vivid amber
export function makeVolumeColorScale(maxVolume) {
  // sqrt scale: dramatic falloff so small stations don't clutter
  return scalePow().exponent(0.6).domain([0, maxVolume]).range([25, 200]).clamp(true)
}

// sqrt radius scale: large range gives clear visual hierarchy without overplotting
export function makeRadiusScale(maxVolume) {
  return scalePow().exponent(0.5).domain([0, maxVolume]).range([80, 900]).clamp(true)
}

// Diverging RdBu scale for entry/exit ratio
// ratio > 1 = more exits = job hub = warm (red end)
// ratio < 1 = more entries = residential = cool (blue end)
const entryExitScale = scaleDiverging(interpolateRdBu).domain([0.3, 1.0, 3.0])

export function entryExitColor(ratio) {
  return d3ColorToRgb(entryExitScale(ratio))
}

// Sequential for heatmap reference
export const populationColorRange = [
  [255, 255, 178, 0],
  [254, 217, 118, 100],
  [254, 178, 76, 160],
  [253, 141, 60, 200],
  [240, 59, 32, 230],
  [189, 0, 38, 255],
]

// Layer legend configs
export const LAYER_LEGENDS = {
  volume: {
    label: 'Station ridership',
    gradient: 'linear-gradient(to right, rgba(255,140,0,0.2), rgba(255,140,0,1))',
    minLabel: 'Low',
    maxLabel: 'High',
  },
  entryExit: {
    label: 'Entry / Exit ratio',
    gradient: 'linear-gradient(to right, #4575b4, #ffffbf, #d73027)',
    minLabel: 'Residential origin',
    maxLabel: 'Job hub',
  },
  odFlow: {
    label: 'Passenger flow volume',
    gradient: 'linear-gradient(to right, rgba(255,100,20,0.3), rgba(160,40,255,0.8))',
    minLabel: 'Low flow',
    maxLabel: 'High flow',
  },
  weekdayWeekend: {
    label: 'Ridership intensity',
    gradient: 'linear-gradient(to right, rgba(30,100,220,0.2), rgba(30,100,220,1))',
    minLabel: 'Low',
    maxLabel: 'High',
    weekendGradient: 'linear-gradient(to right, rgba(180,30,200,0.2), rgba(180,30,200,1))',
  },
  coverageGap: {
    label: 'Population density',
    gradient: 'linear-gradient(to right, rgba(255,255,178,0.3), #bd0026)',
    minLabel: 'Low density',
    maxLabel: 'High density',
    note: 'Green rings = 500m metro catchment',
  },
}

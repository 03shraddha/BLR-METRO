import { ScatterplotLayer } from '@deck.gl/layers'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { populationColorRange } from '../utils/colorScales'

export function buildCoverageGapLayers(stations, populationGrid, isActive) {
  const catchmentLayer = new ScatterplotLayer({
    id: 'coverage-catchment',
    data: stations,
    opacity: isActive ? 0.8 : 0,
    transitions: { opacity: { duration: 600 } },
    getPosition: d => d.geometry.coordinates,
    getRadius: 500, // 500m walkable catchment
    getFillColor: [0, 200, 100, 35],
    getLineColor: [0, 220, 110, 180],
    stroked: true,
    filled: true,
    radiusUnits: 'meters',
    lineWidthMinPixels: 1,
    pickable: false,
  })

  const heatmapLayer = new HeatmapLayer({
    id: 'population-heatmap',
    data: populationGrid,
    opacity: isActive ? 0.75 : 0,
    transitions: { opacity: { duration: 600 } },
    getPosition: d => d.position,
    getWeight: d => d.weight,
    radiusPixels: 50,
    intensity: 1.2,
    threshold: 0.04,
    colorRange: populationColorRange,
  })

  // Return heatmap first so it renders under catchment rings
  return [heatmapLayer, catchmentLayer]
}

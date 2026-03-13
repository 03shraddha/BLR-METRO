import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers'
import { scaleLinear, scalePow } from 'd3-scale'

// Returns [anchorLayer, corridorArcLayer, regularArcLayer]
export function buildOdFlowLayer(stations, odFlows, isActive, flowOffset = 0, topN = 15) {
  const posMap = {}
  const stationMap = {}
  for (const s of stations) {
    posMap[s.properties.id] = s.geometry.coordinates
    stationMap[s.properties.id] = s
  }

  const validFlows = odFlows
    .filter(f => posMap[f.from] && posMap[f.to])
    .slice(0, topN)

  const maxVol = Math.max(...validFlows.map(f => f.volume), 1)

  const widthScale = scalePow().exponent(0.6).domain([0, maxVol]).range([1.5, 14]).clamp(true)
  const heightScale = scaleLinear().domain([0, maxVol]).range([0.04, 0.18]).clamp(true)
  const opacityScale = scalePow().exponent(0.7).domain([0, maxVol]).range([50, 220]).clamp(true)

  // Top 3 flows by volume are "corridors" — rendered distinctly in gold
  const corridorSet = new Set(
    [...validFlows]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 3)
      .map((_, i) => i) // indices within validFlows after sort
  )
  // Instead mark by volume threshold: top-3 volumes
  const sortedVols = [...validFlows].sort((a, b) => b.volume - a.volume).map(f => f.volume)
  const corridorThreshold = sortedVols[Math.min(2, sortedVols.length - 1)] ?? 0

  const corridorFlows = validFlows.filter(f => f.volume >= corridorThreshold)
  const regularFlows  = validFlows.filter(f => f.volume < corridorThreshold)

  // Collect unique station IDs that appear in all flows
  const anchorIds = new Set()
  for (const f of validFlows) {
    anchorIds.add(f.from)
    anchorIds.add(f.to)
  }
  const anchorStations = [...anchorIds]
    .map(id => stationMap[id])
    .filter(Boolean)

  // Count how many flows pass through each station (for anchor sizing)
  const flowCount = {}
  for (const f of validFlows) {
    flowCount[f.from] = (flowCount[f.from] || 0) + 1
    flowCount[f.to] = (flowCount[f.to] || 0) + 1
  }

  // Station anchor dots — clear origin/destination markers
  const anchorLayer = new ScatterplotLayer({
    id: 'od-anchors',
    data: anchorStations,
    opacity: isActive ? 1.0 : 0,
    transitions: { opacity: { duration: 600 } },
    getPosition: d => d.geometry.coordinates,
    getRadius: d => 120 + (flowCount[d.properties.id] || 1) * 60,
    getFillColor: [255, 255, 255, 220],
    stroked: true,
    getLineColor: [255, 200, 100, 160],
    lineWidthMinPixels: 1,
    radiusUnits: 'meters',
    pickable: true,
  })

  // Corridor arcs — top-3 flows in bright gold to highlight dominant routes
  const corridorArcLayer = new ArcLayer({
    id: 'od-corridors',
    data: corridorFlows,
    opacity: isActive ? 1.0 : 0,
    transitions: { opacity: { duration: 600 } },
    getSourcePosition: d => posMap[d.from],
    getTargetPosition: d => posMap[d.to],
    getSourceColor: d => {
      const a = Math.min(opacityScale(d.volume) + 30, 255)
      const pulse = Math.round(flowOffset) % 2 === 0 ? 20 : 0
      return [255, Math.min(215 + pulse, 255), Math.min(0 + pulse, 60), a]
    },
    getTargetColor: d => {
      const a = Math.min(opacityScale(d.volume) + 30, 255)
      const pulse = Math.round(flowOffset) % 2 === 1 ? 20 : 0
      return [255, Math.min(255, 255), Math.min(120 + pulse, 200), a]
    },
    // Corridors are 40% wider than regular flows for visual dominance
    getWidth: d => widthScale(d.volume) * 1.4,
    getHeight: d => heightScale(d.volume),
    widthUnits: 'pixels',
    widthMinPixels: 2,
    widthMaxPixels: 20,
    greatCircle: false,
    pickable: true,
    updateTriggers: {
      getSourceColor: [flowOffset],
      getTargetColor: [flowOffset],
    },
  })

  // Regular flow arcs — amber palette, lower visual weight
  const regularArcLayer = new ArcLayer({
    id: 'od-flows-rest',
    data: regularFlows,
    opacity: isActive ? 1.0 : 0,
    transitions: { opacity: { duration: 600 } },
    getSourcePosition: d => posMap[d.from],
    getTargetPosition: d => posMap[d.to],
    getSourceColor: d => {
      const a = opacityScale(d.volume)
      const pulse = Math.round(flowOffset) % 2 === 0 ? 30 : 0
      return [255, Math.min(160 + pulse, 255), 40, a]
    },
    getTargetColor: d => {
      const a = opacityScale(d.volume)
      const pulse = Math.round(flowOffset) % 2 === 1 ? 30 : 0
      return [255, Math.min(220 + pulse, 255), Math.min(120 + pulse, 255), a]
    },
    getWidth: d => widthScale(d.volume),
    getHeight: d => heightScale(d.volume),
    widthUnits: 'pixels',
    widthMinPixels: 1.5,
    widthMaxPixels: 14,
    greatCircle: false,
    pickable: true,
    updateTriggers: {
      getSourceColor: [flowOffset],
      getTargetColor: [flowOffset],
    },
  })

  return [anchorLayer, corridorArcLayer, regularArcLayer]
}

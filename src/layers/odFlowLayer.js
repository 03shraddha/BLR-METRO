import { ArcLayer } from '@deck.gl/layers'
import { scaleLinear, scalePow } from 'd3-scale'

export function buildOdFlowLayer(stations, odFlows, isActive, flowOffset = 0) {
  const posMap = {}
  for (const s of stations) {
    posMap[s.properties.id] = s.geometry.coordinates
  }

  // Limit to top 30 — enough to show dominant corridors without visual clutter
  const validFlows = odFlows
    .filter(f => posMap[f.from] && posMap[f.to])
    .slice(0, 30)

  const maxVol = Math.max(...validFlows.map(f => f.volume), 1)

  // sqrt width: reduces dominance of top pair, keeps thin arcs for mid-volume
  const widthScale = scalePow().exponent(0.5).domain([0, maxVol]).range([1, 8]).clamp(true)

  // Height varies by rank so arcs separate visually instead of collapsing
  // Top flows get higher arcs; lower flows stay flatter
  const heightScale = scaleLinear().domain([0, maxVol]).range([0.05, 0.5]).clamp(true)

  // Progressive opacity: top flows are vivid, lower-volume arcs fade back
  const opacityScale = scaleLinear().domain([0, maxVol]).range([60, 200]).clamp(true)

  return new ArcLayer({
    id: 'od-flows',
    data: validFlows,
    opacity: isActive ? 1.0 : 0,
    transitions: { opacity: { duration: 600 } },
    getSourcePosition: d => posMap[d.from],
    getTargetPosition: d => posMap[d.to],
    // Directional gradient: during playback flowOffset shifts the color midpoint
    // to give the impression of movement along the arc
    getSourceColor: d => {
      const a = opacityScale(d.volume)
      // When animated, source end brightens on even frames to suggest departure
      const boost = Math.round(flowOffset) % 2 === 0 ? 40 : 0
      return [255, Math.min(100 + boost, 255), 20, a]
    },
    getTargetColor: d => {
      const a = opacityScale(d.volume)
      const boost = Math.round(flowOffset) % 2 === 1 ? 40 : 0
      return [160, 40, Math.min(255 + boost, 255), a]
    },
    getWidth: d => widthScale(d.volume),
    getHeight: d => heightScale(d.volume),
    widthUnits: 'pixels',
    widthMinPixels: 0.8,
    widthMaxPixels: 8,
    greatCircle: false,
    pickable: true,
    updateTriggers: {
      getSourceColor: [flowOffset],
      getTargetColor: [flowOffset],
    },
  })
}

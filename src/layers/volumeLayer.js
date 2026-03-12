import { ScatterplotLayer } from '@deck.gl/layers'
import { easeCubicInOut } from 'd3-ease'
import { getRidershipAtHour } from '../utils/dataTransforms'
import { makeRadiusScale, makeVolumeColorScale } from '../utils/colorScales'

// Returns [glowLayer, mainLayer]
export function buildVolumeLayers(stations, hour, isActive, maxRidership) {
  const radiusScale  = makeRadiusScale(maxRidership)
  const opacityScale = makeVolumeColorScale(maxRidership)

  // Identify top-5 busiest stations at current hour for glow effect
  const top5Ids = new Set(
    [...stations]
      .map(d => ({ id: d.properties.id, total: getRidershipAtHour(d, hour).total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(x => x.id)
  )

  // Soft ambient glow behind the top-5 busiest hubs
  const glowLayer = new ScatterplotLayer({
    id: 'volume-glow',
    data: stations.filter(d => top5Ids.has(d.properties.id)),
    opacity: isActive ? 0.4 : 0,
    transitions: {
      opacity: { duration: 600 },
      getRadius: { duration: 700, easing: easeCubicInOut },
    },
    getPosition: d => d.geometry.coordinates,
    getRadius: d => radiusScale(getRidershipAtHour(d, hour).total) * 2.0,
    getFillColor: [255, 150, 30, 12],
    radiusUnits: 'meters',
    pickable: false,
    stroked: false,
    updateTriggers: { getRadius: [hour] },
  })

  // Main station circles — sqrt-scaled, thin outline for visual separation
  const mainLayer = new ScatterplotLayer({
    id: 'volume',
    data: stations,
    opacity: isActive ? 0.75 : 0,
    transitions: {
      opacity: { duration: 600 },
      getRadius: { duration: 700, easing: easeCubicInOut },
      getFillColor: { duration: 700, easing: easeCubicInOut },
    },
    getPosition: d => d.geometry.coordinates,
    getRadius: d => radiusScale(getRidershipAtHour(d, hour).total),
    getFillColor: d => {
      const a = opacityScale(getRidershipAtHour(d, hour).total)
      // Interpolate from dark red-orange (low) → bright amber-yellow (high)
      // so busy stations stand out in color, not just size
      const t = a / 200
      return [
        Math.round(180 + 75 * t),   // 180 → 255
        Math.round(60 + 130 * t),   // 60  → 190
        Math.round(0 + 50 * t),     // 0   → 50
        a,
      ]
    },
    stroked: true,
    getLineColor: [255, 200, 80, 50],
    lineWidthMinPixels: 0.5,
    radiusUnits: 'meters',
    pickable: true,
    updateTriggers: {
      getRadius: [hour],
      getFillColor: [hour],
    },
  })

  return [glowLayer, mainLayer]
}

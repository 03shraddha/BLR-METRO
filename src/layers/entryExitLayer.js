import { ScatterplotLayer } from '@deck.gl/layers'
import { easeCubicInOut } from 'd3-ease'
import { getRidershipAtHour } from '../utils/dataTransforms'
import { entryExitColor } from '../utils/colorScales'

export function buildEntryExitLayer(stations, hour, isActive) {
  return new ScatterplotLayer({
    id: 'entry-exit',
    data: stations,
    opacity: isActive ? 0.8 : 0,
    transitions: {
      opacity: { duration: 600 },
      getFillColor: { duration: 700, easing: easeCubicInOut },
    },
    getPosition: d => d.geometry.coordinates,
    getRadius: 600,
    getFillColor: d => {
      const { entries, exits } = getRidershipAtHour(d, hour)
      // Avoid division by zero; neutral color if no data
      if (entries + exits === 0) return [100, 100, 100, 60]
      const ratio = exits / Math.max(entries, 1)
      const [r, g, b] = entryExitColor(ratio)
      return [r, g, b, 200]
    },
    radiusUnits: 'meters',
    pickable: true,
    stroked: false,
    updateTriggers: {
      getFillColor: [hour],
    },
  })
}

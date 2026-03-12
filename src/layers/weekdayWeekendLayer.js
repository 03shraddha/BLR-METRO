import { ScatterplotLayer } from '@deck.gl/layers'
import { easeCubicInOut } from 'd3-ease'
import { scaleLinear } from 'd3-scale'
import { getDailyRidership } from '../utils/dataTransforms'

export function buildWeekdayWeekendLayer(stations, weekdayData, weekendData, mode, isActive) {
  const data = mode === 'weekday' ? weekdayData : weekendData
  // Blue for weekday, purple for weekend
  const palette = mode === 'weekday' ? [30, 100, 220] : [180, 30, 200]

  // Find max total for this mode
  let maxTotal = 1
  for (const s of stations) {
    const d = getDailyRidership(data, s.properties.id)
    if (d.total > maxTotal) maxTotal = d.total
  }

  const radiusScale = scaleLinear().domain([0, maxTotal]).range([200, 4500]).clamp(true)
  const alphaScale = scaleLinear().domain([0, maxTotal]).range([50, 220]).clamp(true)

  return new ScatterplotLayer({
    id: 'weekday-weekend',
    data: stations,
    opacity: isActive ? 0.85 : 0,
    transitions: {
      opacity: { duration: 600 },
      getRadius: { duration: 700, easing: easeCubicInOut },
      getFillColor: { duration: 700, easing: easeCubicInOut },
    },
    getPosition: d => d.geometry.coordinates,
    getRadius: d => {
      const { total } = getDailyRidership(data, d.properties.id)
      return radiusScale(total)
    },
    getFillColor: d => {
      const { total } = getDailyRidership(data, d.properties.id)
      return [...palette, alphaScale(total)]
    },
    radiusUnits: 'meters',
    pickable: true,
    stroked: false,
    updateTriggers: {
      getRadius: [mode],
      getFillColor: [mode],
    },
  })
}

// Join ridership JSON data onto station GeoJSON features.
// Returns enriched station array with ridership attached as properties.
export function enrichStations(stations, hourlyData) {
  if (!stations || !hourlyData) return []
  return stations.features.map(f => ({
    ...f,
    ridership: hourlyData[f.properties.id] || null,
  }))
}

// Get total ridership for a station at a given hour
export function getRidershipAtHour(station, hour) {
  if (!station.ridership) return { entries: 0, exits: 0, total: 0 }
  const h = station.ridership[String(hour)]
  if (!h) return { entries: 0, exits: 0, total: 0 }
  return {
    entries: h.entries || 0,
    exits: h.exits || 0,
    total: (h.entries || 0) + (h.exits || 0),
  }
}

// Get daily ridership total for a station (from weekday/weekend JSON)
export function getDailyRidership(dailyData, stationId) {
  if (!dailyData || !dailyData[stationId]) return { entries: 0, exits: 0, total: 0 }
  return dailyData[stationId]
}

// Build 24-hour sparkline data array for a station
export function buildSparkline(station) {
  if (!station.ridership) return Array(24).fill(0)
  return Array.from({ length: 24 }, (_, h) => {
    const d = station.ridership[String(h)]
    return d ? (d.entries || 0) + (d.exits || 0) : 0
  })
}

// Format hour as readable label
export function formatHour(h) {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

// Find max total ridership across all stations and hours
export function findMaxRidership(stations) {
  let max = 0
  for (const s of stations) {
    if (!s.ridership) continue
    for (const h of Object.values(s.ridership)) {
      const t = (h.entries || 0) + (h.exits || 0)
      if (t > max) max = t
    }
  }
  return max || 1
}

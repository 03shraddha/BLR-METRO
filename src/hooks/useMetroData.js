import { useState, useEffect } from 'react'
import { enrichStations } from '../utils/dataTransforms'

const BASE = import.meta.env.BASE_URL

export function useMetroData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [stationsRes, hourlyRes, weekdayRes, weekendRes, odRes, popRes, linesRes] =
          await Promise.all([
            fetch(`${BASE}data/stations.geojson`),
            fetch(`${BASE}data/ridership_hourly.json`),
            fetch(`${BASE}data/ridership_weekday.json`),
            fetch(`${BASE}data/ridership_weekend.json`),
            fetch(`${BASE}data/od_flows.json`),
            fetch(`${BASE}data/population_grid.json`),
            fetch(`${BASE}data/metro_lines.json`),
          ])

        const [stationsGeo, hourly, weekday, weekend, odFlows, populationGrid, metroLines] =
          await Promise.all([
            stationsRes.json(),
            hourlyRes.json(),
            weekdayRes.json(),
            weekendRes.json(),
            odRes.json(),
            popRes.json(),
            linesRes.json(),
          ])

        const stations = enrichStations(stationsGeo, hourly)

        setData({ stations, stationsGeo, hourly, weekday, weekend, odFlows, populationGrid, metroLines })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading, error }
}

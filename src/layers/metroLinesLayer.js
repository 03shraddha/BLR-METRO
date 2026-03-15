import { PathLayer } from '@deck.gl/layers'

// Line data is loaded from public/data/metro_lines.json (real OSM geometry)
// lineStats: optional object like { purple: 0.85, green: 0.6, yellow: 0.25 }
// with normalized ridership per line (0–1). When provided, line width encodes
// relative passenger volume so busier lines are visually heavier.
export function buildMetroLinesLayer(metroLines, isAnyDataLayerActive, isMobile = false, lineStats = null) {
  if (!metroLines || metroLines.length === 0) return null

  // On mobile, bump up minimum line width so metro lines stay legible on high-DPI screens
  const mobileScale = isMobile ? 1.5 : 1

  // Width accessor: per-line when lineStats available, fixed otherwise
  const getWidth = lineStats
    ? d => {
        const stat = lineStats[d.id] ?? 0.5
        return (isMobile ? 3 : 4) + stat * (isMobile ? 5 : 8)
      }
    : 6

  return new PathLayer({
    id: 'metro-lines',
    data: metroLines,
    // Always visible as the structural backbone of the network
    opacity: isAnyDataLayerActive ? 0.80 : 1.0,
    transitions: { opacity: { duration: 400 } },
    getPath: d => d.path,
    getColor: d => [...d.color, 255],
    getWidth,
    widthUnits: 'pixels',
    widthMinPixels: lineStats
      ? (isMobile ? 2 : 3)   // base minimum; stat-driven width handles the rest
      : 3.5 * mobileScale,
    widthMaxPixels: lineStats
      ? (isMobile ? 12 : 16)
      : 10 * mobileScale,
    capRounded: true,
    jointRounded: true,
    pickable: false,
    updateTriggers: { getWidth: [lineStats, isMobile] },
  })
}

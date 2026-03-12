import { formatHour } from '../utils/dataTransforms'

export default function Tooltip({ info, hour }) {
  if (!info || !info.object) return null

  const { x, y, object } = info
  const props = object.properties || {}

  // Get ridership for current hour if available
  const hr = object.ridership?.[String(hour)]
  const entries = hr?.entries ?? null
  const exits = hr?.exits ?? null

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ left: x + 12, top: y - 10 }}
    >
      <div
        className="px-4 py-3 rounded-xl border border-white/15 text-white text-base min-w-48"
        style={{ backdropFilter: 'blur(14px)', background: 'rgba(0,0,0,0.75)' }}
      >
        <div className="font-semibold text-white/90 mb-1.5 truncate max-w-64 text-lg">
          {props.name || 'Station'}
        </div>
        <div className="text-white/50 mb-1.5">
          {props.line ? (
            <span
              className="px-2 py-0.5 rounded text-sm font-medium"
              style={{ background: lineColor(props.line) }}
            >
              {capitalize(props.line)} Line
            </span>
          ) : null}
        </div>
        {entries !== null && (
          <div className="flex gap-3 text-base">
            <span className="text-blue-300">↑ {fmt(entries)} in</span>
            <span className="text-orange-300">↓ {fmt(exits)} out</span>
          </div>
        )}
        <div className="text-white/30 text-sm mt-1">{formatHour(hour)}</div>
      </div>
    </div>
  )
}

function fmt(n) {
  if (n === null || n === undefined) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

function lineColor(line) {
  const map = {
    purple: 'rgba(128,0,128,0.6)',
    green: 'rgba(0,140,70,0.6)',
    yellow: 'rgba(200,160,0,0.6)',
    pink: 'rgba(200,50,100,0.6)',
    red: 'rgba(180,30,30,0.6)',
    blue: 'rgba(30,80,200,0.6)',
  }
  return map[line?.toLowerCase()] || 'rgba(80,80,80,0.5)'
}

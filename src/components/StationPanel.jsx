import { buildSparkline, formatHour } from '../utils/dataTransforms'

export default function StationPanel({ station, onClose }) {
  const visible = !!station

  if (!station && !visible) return null

  const props = station?.properties || {}
  const sparkline = station ? buildSparkline(station) : []
  const maxVal = Math.max(...sparkline, 1)

  const W = 200
  const H = 56

  // Build SVG polyline points
  const points = sparkline.map((v, i) => {
    const px = (i / 23) * W
    const py = H - (v / maxVal) * H
    return `${px},${py}`
  }).join(' ')

  // Find peak hour
  const peakHour = sparkline.indexOf(Math.max(...sparkline))

  return (
    <div
      className={`station-panel absolute top-0 right-0 h-full z-20 w-72 border-l border-white/10 flex flex-col ${visible ? 'visible' : 'hidden'}`}
      style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.65)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-6 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-white font-semibold text-xl leading-tight">
            {props.name || 'Station'}
          </h2>
          {props.line && (
            <span className="text-white/40 text-base mt-1 block">
              {capitalize(props.line)} Line
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 transition-colors mt-0.5 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Sparkline */}
      <div className="px-5 pt-5">
        <div className="text-white/40 text-sm uppercase tracking-wide mb-3">
          Daily ridership pattern
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 56 }}
        >
          {/* Subtle grid lines */}
          {[0.25, 0.5, 0.75].map(f => (
            <line
              key={f}
              x1={0} y1={H * (1 - f)} x2={W} y2={H * (1 - f)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          ))}
          {/* Fill area */}
          <polyline
            points={`0,${H} ${points} ${W},${H}`}
            fill="rgba(255,140,0,0.12)"
            stroke="none"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="rgba(255,140,0,0.8)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          {/* Peak dot */}
          {sparkline.length > 0 && (
            <circle
              cx={(peakHour / 23) * W}
              cy={H - (sparkline[peakHour] / maxVal) * H}
              r={3}
              fill="rgba(255,140,0,1)"
            />
          )}
        </svg>
        {/* Hour labels */}
        <div className="flex justify-between text-xs text-white/25 mt-1">
          {[0, 6, 12, 18, 23].map(h => (
            <span key={h}>{formatHour(h)}</span>
          ))}
        </div>
        {sparkline.length > 0 && (
          <div className="text-white/40 text-base mt-3">
            Peak: <span className="text-orange-400">{formatHour(peakHour)}</span>
          </div>
        )}
      </div>

      {/* Stats grid */}
      {station?.ridership && (
        <div className="px-5 pt-5">
          <div className="text-white/40 text-sm uppercase tracking-wide mb-3">
            Daily totals
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total boardings', value: sparkline.reduce((a, b) => a + b, 0) },
              { label: 'Peak hour', value: formatHour(peakHour) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3">
                <div className="text-white/30 text-sm mb-1">{label}</div>
                <div className="text-white text-lg font-medium">
                  {typeof value === 'number' ? fmt(value) : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data note */}
      <div className="mt-auto px-5 pb-5 text-white/20 text-sm border-t border-white/10 pt-4">
        Data: BMRCL August 2025 (RTI)
      </div>
    </div>
  )
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

function fmt(n) {
  if (!n) return '0'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

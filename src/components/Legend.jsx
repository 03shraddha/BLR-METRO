import { LAYER_LEGENDS } from '../utils/colorScales'

export default function Legend({ activeLayer, weekdayWeekendMode }) {
  const config = LAYER_LEGENDS[activeLayer]
  if (!config) return null

  const gradient = activeLayer === 'weekdayWeekend' && weekdayWeekendMode === 'weekend'
    ? config.weekendGradient || config.gradient
    : config.gradient

  return (
    <div
      className="absolute bottom-8 right-4 z-10 px-4 py-3 rounded-2xl border border-white/10 min-w-40"
      style={{ backdropFilter: 'blur(14px)', background: 'rgba(0,0,0,0.45)' }}
    >
      <div className="text-white/50 text-sm tracking-wide uppercase mb-2">
        {config.label}
      </div>
      <div
        className="h-2 rounded-full mb-1.5"
        style={{ background: gradient }}
      />
      <div className="flex justify-between text-sm text-white/40">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
      {config.note && (
        <div className="text-white/30 text-sm mt-2 border-t border-white/10 pt-2">
          {config.note}
        </div>
      )}
    </div>
  )
}

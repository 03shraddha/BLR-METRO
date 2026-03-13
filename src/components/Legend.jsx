import { LAYER_LEGENDS } from '../utils/colorScales'

const IOS_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"

const PANEL_STYLE = {
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  background: 'rgba(18,18,22,0.78)',
  boxShadow: '0 2px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.08)',
  fontFamily: IOS_FONT,
}

export default function Legend({ activeLayer, weekdayWeekendMode }) {
  const config = LAYER_LEGENDS[activeLayer]
  if (!config) return null

  if (activeLayer === 'weekdayWeekend' && weekdayWeekendMode === 'compare') {
    return (
      <div
        className="absolute bottom-6 right-4 z-10"
        style={{ ...PANEL_STYLE, borderRadius: 18, padding: '16px 20px', minWidth: 200 }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: 12 }}>
          Ridership intensity
        </p>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'rgba(59,130,246,0.85)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Weekday (filled)</span>
        </div>
        <div style={{ height: 5, borderRadius: 4, background: config.gradient, marginBottom: 12 }} />
        <div className="flex items-center gap-2.5 mb-2.5">
          <div style={{ width: 11, height: 11, borderRadius: '50%', border: '1.5px solid rgba(167,139,250,0.85)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Weekend (ring)</span>
        </div>
        <div style={{ height: 5, borderRadius: 4, background: config.weekendGradient, marginBottom: 8 }} />
        <div className="flex justify-between">
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>Low</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>High</span>
        </div>
      </div>
    )
  }

  let gradient = config.gradient
  if (activeLayer === 'weekdayWeekend') {
    if (weekdayWeekendMode === 'weekend') gradient = config.weekendGradient || config.gradient
    else if (weekdayWeekendMode === 'delta') gradient = config.deltaGradient || config.gradient
  }

  const minLabel = activeLayer === 'weekdayWeekend' && weekdayWeekendMode === 'delta' ? 'Weekday' : config.minLabel
  const maxLabel = activeLayer === 'weekdayWeekend' && weekdayWeekendMode === 'delta' ? 'Weekend' : config.maxLabel
  const title    = activeLayer === 'weekdayWeekend' && weekdayWeekendMode === 'delta' ? 'Weekday vs Weekend' : config.label

  return (
    <div
      className="absolute bottom-6 right-4 z-10"
      style={{ ...PANEL_STYLE, borderRadius: 18, padding: '16px 20px', minWidth: 190 }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: 12 }}>
        {title}
      </p>
      <div style={{ height: 5, borderRadius: 4, background: gradient, marginBottom: 8 }} />
      <div className="flex justify-between">
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)' }}>{minLabel}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)' }}>{maxLabel}</span>
      </div>
      {config.note && (
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)', marginTop: 12, paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          {config.note}
        </p>
      )}
    </div>
  )
}

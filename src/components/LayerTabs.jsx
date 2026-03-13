const LAYERS = [
  { id: 'volume',          label: 'Where people move' },
  { id: 'entryExit',       label: 'Job hubs vs home zones' },
  { id: 'odFlow',          label: 'Passenger flows' },
  { id: 'weekdayWeekend',  label: 'Weekday vs weekend' },
  { id: 'coverageGap',     label: 'Coverage gaps' },
]

const IOS_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"

export default function LayerTabs({ activeLayer, setActiveLayer }) {
  return (
    <div
      className="absolute top-4 left-4 z-10 rounded-2xl overflow-hidden"
      style={{
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        background: 'rgba(18,18,22,0.78)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.08)',
        fontFamily: IOS_FONT,
        minWidth: 220,
      }}
    >
      {LAYERS.map(({ id, label }, idx) => (
        <button
          key={id}
          onClick={() => setActiveLayer(id)}
          className="relative w-full text-left transition-all duration-150 cursor-pointer flex items-center gap-3"
          style={{
            padding: '13px 20px',
            borderTop: idx > 0 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
            background: activeLayer === id ? 'rgba(255,255,255,0.10)' : 'transparent',
            outline: 'none',
            border: 'none',
          }}
        >
          {activeLayer === id && (
            <div
              className="absolute left-0 top-2.5 bottom-2.5 rounded-full"
              style={{ width: 3, background: 'rgba(255,255,255,0.55)' }}
            />
          )}
          <span
            style={{
              fontSize: 17,
              fontWeight: activeLayer === id ? 600 : 400,
              letterSpacing: '-0.01em',
              color: activeLayer === id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.42)',
              transition: 'color 150ms ease',
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

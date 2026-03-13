import { formatHour } from '../utils/dataTransforms'

const IOS_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"

export default function TimeSlider({ hour, playing, togglePlay, setHourManual, activeLayer }) {
  const hourlyLayers = ['volume', 'entryExit']
  if (!hourlyLayers.includes(activeLayer)) return null

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-5"
      style={{
        padding: '12px 22px',
        borderRadius: 28,
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        background: 'rgba(18,18,22,0.78)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.08)',
        fontFamily: IOS_FONT,
      }}
    >
      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="transition-colors cursor-pointer flex items-center justify-center"
        style={{ width: 38, height: 38, color: playing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)' }}
        title={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width={26} height={26}>
            <rect x="6" y="4" width="4" height="16" rx="1.5" />
            <rect x="14" y="4" width="4" height="16" rx="1.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width={26} height={26}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Hour label */}
      <span
        className="tabular-nums select-none"
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.80)',
          width: 70,
          textAlign: 'right',
        }}
      >
        {formatHour(hour)}
      </span>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={e => setHourManual(e.target.value)}
        className="accent-orange-400 cursor-pointer"
        style={{ width: 240 }}
      />

      {/* Attribution */}
      <span
        className="select-none hidden sm:block"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.01em' }}
      >
        BMRCL Aug 2025
      </span>
    </div>
  )
}

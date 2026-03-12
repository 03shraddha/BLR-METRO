import { formatHour } from '../utils/dataTransforms'

export default function TimeSlider({ hour, playing, togglePlay, setHourManual, activeLayer }) {
  // Only show for layers that use hourly data
  const hourlyLayers = ['volume', 'entryExit']
  if (!hourlyLayers.includes(activeLayer)) return null

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/10"
      style={{ backdropFilter: 'blur(14px)', background: 'rgba(0,0,0,0.45)' }}
    >
      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        className="text-white/80 hover:text-white transition-colors cursor-pointer w-9 h-9 flex items-center justify-center"
        title={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          // Pause icon
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Hour label */}
      <span className="text-white/60 text-lg font-mono w-20 text-right select-none">
        {formatHour(hour)}
      </span>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={e => setHourManual(e.target.value)}
        className="w-64 accent-orange-400 cursor-pointer"
      />

      {/* Data attribution */}
      <span className="text-white/25 text-base ml-2 select-none hidden sm:block">
        BMRCL Aug 2025
      </span>
    </div>
  )
}

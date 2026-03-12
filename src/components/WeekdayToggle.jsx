export default function WeekdayToggle({ mode, setMode, activeLayer }) {
  if (activeLayer !== 'weekdayWeekend') return null

  return (
    <div
      className="absolute top-4 right-4 z-10 flex rounded-xl overflow-hidden border border-white/15"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.4)' }}
    >
      {['weekday', 'weekend'].map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={[
            'px-5 py-2.5 text-lg font-medium tracking-wide transition-all duration-200 cursor-pointer',
            mode === m
              ? m === 'weekday'
                ? 'bg-blue-500/30 text-blue-200'
                : 'bg-purple-500/30 text-purple-200'
              : 'text-white/40 hover:text-white/70',
          ].join(' ')}
        >
          {m === 'weekday' ? 'Weekday' : 'Weekend'}
        </button>
      ))}
    </div>
  )
}

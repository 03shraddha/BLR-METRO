const LAYERS = [
  { id: 'volume',          label: 'Where people move' },
  { id: 'entryExit',       label: 'Job hubs vs home zones' },
  { id: 'odFlow',          label: 'Passenger flows' },
  { id: 'weekdayWeekend',  label: 'Weekday vs weekend' },
  { id: 'coverageGap',     label: 'Coverage gaps' },
]

export default function LayerTabs({ activeLayer, setActiveLayer }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
      {LAYERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveLayer(id)}
          className={[
            'px-4 py-2.5 text-lg font-medium tracking-wide rounded-lg text-left',
            'border transition-all duration-200 cursor-pointer',
            activeLayer === id
              ? 'bg-white/10 border-white/30 text-white'
              : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80',
          ].join(' ')}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

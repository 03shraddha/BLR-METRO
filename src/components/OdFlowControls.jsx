const IOS_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"

export default function OdFlowControls({ topN, setTopN, activeLayer }) {
  if (activeLayer !== 'odFlow') return null

  return (
    <div
      className="absolute bottom-6 left-4 z-10"
      style={{
        padding: '14px 18px',
        borderRadius: 20,
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        background: 'rgba(18,18,22,0.78)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.08)',
        fontFamily: IOS_FONT,
        minWidth: 220,
      }}
    >
      <div className="flex justify-between items-baseline mb-3">
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase' }}>
          Flows shown
        </span>
        <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(251,191,36,0.95)' }}>
          {topN}
        </span>
      </div>
      <input
        type="range"
        min={5}
        max={50}
        step={5}
        value={topN}
        onChange={e => setTopN(Number(e.target.value))}
        className="w-full accent-amber-400 cursor-pointer"
      />
      <div className="flex justify-between mt-2">
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>5</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>50</span>
      </div>
    </div>
  )
}

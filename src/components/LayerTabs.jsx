import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'

const LAYERS = [
  { id: 'volume',         label: 'Where people move',      sub: 'Hourly ridership by station' },
  { id: 'entryExit',      label: 'Job hubs vs home zones',  sub: 'Entry vs exit ratio per station' },
  { id: 'odFlow',         label: 'Passenger flows',         sub: 'Top origin-destination pairs' },
  { id: 'weekdayWeekend', label: 'Weekday vs weekend',      sub: 'How Saturday differs from Monday' },
  { id: 'coverageGap',    label: 'Coverage gaps',           sub: 'Who lives outside 500m access' },
]

const IOS_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"

export default function LayerTabs({ activeLayer, setActiveLayer, onBusyOpen }) {
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  // Default collapsed on mobile, expanded on desktop
  const [isExpanded, setIsExpanded] = useState(!isMobile)

  // Lock / unlock body scroll while the mobile drawer is open
  useEffect(() => {
    if (isMobile && isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    // Clean up on unmount
    return () => { document.body.style.overflow = '' }
  }, [isMobile, isExpanded])

  function open()  { setIsExpanded(true) }
  function close() { setIsExpanded(false) }

  // ── Desktop: always-visible static panel ────────────────────────────────────
  if (!isMobile) {
    return (
      <div
        className="absolute top-4 left-4 z-10 rounded-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          background: 'var(--panel-bg)',
          boxShadow: 'var(--panel-shadow-sm)',
          fontFamily: IOS_FONT,
          minWidth: 240,
        }}
      >
        {renderLayerList()}
      </div>
    )
  }

  // ── Mobile: hamburger + slide-in drawer ──────────────────────────────────────
  return (
    <>
      {/* Hamburger button — always visible on mobile when drawer is closed */}
      {!isExpanded && (
        <button
          onClick={open}
          aria-label="Open layer menu"
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 30,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            backdropFilter: 'blur(28px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            background: 'var(--panel-bg)',
            boxShadow: 'var(--panel-shadow-sm)',
            fontFamily: IOS_FONT,
            color: 'var(--tab-active-text)',
          }}
        >
          ☰
        </button>
      )}

      {/* Semi-transparent backdrop — only rendered while drawer is open */}
      {isExpanded && (
        <div
          onClick={close}
          aria-label="Close layer menu"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 29,
          }}
        />
      )}

      {/* Drawer panel — slides in from the left */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Layer menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 'min(280px, 85vw)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          background: 'var(--panel-bg)',
          boxShadow: 'var(--panel-shadow-sm)',
          fontFamily: IOS_FONT,
          overflowY: 'auto',
          // Slide in/out via CSS transform
          transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Close button row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px 0' }}>
          <button
            onClick={close}
            aria-label="Close layer menu"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 15,
              color: 'var(--text-muted)',
              lineHeight: 1,
              padding: '4px 6px',
            }}
          >
            ✕
          </button>
        </div>

        {renderLayerList()}
      </div>
    </>
  )

  // Shared list of layer buttons + theme toggle
  // "How busy is it?" is injected at position 3 (4th item, after Weekday vs weekend)
  function renderLayerList() {
    const itemStyle = (isActive, idx) => ({
      position: 'relative',
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '13px 20px',
      cursor: 'pointer',
      background: isActive ? 'var(--tab-active-bg)' : 'transparent',
      borderTop: idx > 0 ? `0.5px solid var(--tab-divider)` : 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      outline: 'none',
      fontFamily: IOS_FONT,
      transition: 'background 150ms ease',
    })

    return (
      <>
        {LAYERS.map(({ id, label, sub }, idx) => (
          <>
            <button
              key={id}
              type="button"
              onClick={() => { setActiveLayer(id); if (isMobile) close() }}
              style={itemStyle(activeLayer === id, idx)}
            >
              {activeLayer === id && (
                <div style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 99, background: 'var(--tab-active-bar)' }} />
              )}
              <span style={{ fontSize: 15, fontWeight: activeLayer === id ? 600 : 400, letterSpacing: '-0.01em', color: activeLayer === id ? 'var(--tab-active-text)' : 'var(--tab-inactive-text)', display: 'block' }}>
                {label}
              </span>
              <span style={{ fontSize: 11, color: activeLayer === id ? 'var(--text-muted)' : 'var(--text-micro)', display: 'block', marginTop: 1 }}>
                {sub}
              </span>
            </button>

            {/* Inject "How busy is it?" after the 4th layer (index 3 = weekdayWeekend) */}
            {idx === 3 && onBusyOpen && (
              <button
                key="busy"
                type="button"
                onClick={() => { onBusyOpen(); if (isMobile) close() }}
                style={itemStyle(false, 1)}
              >
                <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--tab-inactive-text)', display: 'block' }}>
                  How busy is it?
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-micro)', display: 'block', marginTop: 1 }}>
                  Live station crowding
                </span>
              </button>
            )}
          </>
        ))}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{ ...itemStyle(false, 1), display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <span style={{ fontSize: 12, lineHeight: 1 }}>{theme === 'dark' ? '☀' : '☾'}</span>
          <span style={{ fontSize: 15, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </>
    )
  }
}

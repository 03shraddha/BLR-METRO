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

export default function LayerTabs({ activeLayer, setActiveLayer }) {
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
            fontSize: 20,
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
              fontSize: 18,
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
  function renderLayerList() {
    return (
      <>
        {LAYERS.map(({ id, label, sub }, idx) => (
          <button
            key={id}
            onClick={() => {
              setActiveLayer(id)
              // Auto-close after selection on mobile
              if (isMobile) close()
            }}
            className="relative w-full text-left transition-all duration-150 cursor-pointer flex items-center gap-3"
            style={{
              padding: '13px 20px',
              borderTop: idx > 0 ? `0.5px solid var(--tab-divider)` : 'none',
              background: activeLayer === id ? 'var(--tab-active-bg)' : 'transparent',
              outline: 'none',
              border: 'none',
            }}
          >
            {activeLayer === id && (
              <div
                className="absolute left-0 top-2.5 bottom-2.5 rounded-full"
                style={{ width: 3, background: 'var(--tab-active-bar)' }}
              />
            )}
            <div>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: activeLayer === id ? 600 : 400,
                  letterSpacing: '-0.01em',
                  color: activeLayer === id ? 'var(--tab-active-text)' : 'var(--tab-inactive-text)',
                  display: 'block',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: activeLayer === id ? 'var(--text-muted)' : 'var(--text-micro)',
                  display: 'block',
                  marginTop: 1,
                  transition: 'color 150ms ease',
                }}
              >
                {sub}
              </span>
            </div>
          </button>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 cursor-pointer transition-all duration-150"
          style={{
            padding: '11px 20px',
            borderTop: `0.5px solid var(--tab-divider)`,
            background: 'transparent',
            outline: 'none',
            border: 'none',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>{theme === 'dark' ? '☀' : '☾'}</span>
          <span style={{ fontSize: 17, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </>
    )
  }
}

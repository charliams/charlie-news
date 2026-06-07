import React from 'react'

export function TopicNav({ T, topics, affinity = {}, active, onPick }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 8, background: T.bg,
      borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div
        className="chiprow"
        style={{
          display: 'flex', gap: 8, overflowX: 'auto', padding: '11px 20px 12px',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}
      >
        {topics.map(tp => {
          const aff = affinity[tp.id] || 0
          const isActive = active === tp.id
          const liked = aff > 0
          const round = T.card === 'list' ? 6 : 999
          return (
            <button key={tp.id} onClick={() => onPick(tp.id)} style={{
              flexShrink: 0, height: 34, padding: '0 14px', borderRadius: round,
              border: `1px solid ${isActive ? 'transparent' : T.hairline}`,
              background: isActive ? T.ink : (liked ? T.chipBg : 'transparent'),
              color: isActive ? T.bg : T.ink,
              fontFamily: T.labelFont,
              fontSize: T.labelStyle === 'mono-caps' ? 11.5 : 13.5,
              fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
              textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
              letterSpacing: T.labelStyle === 'mono-caps' ? '0.06em' : 0,
              fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
              cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background .2s, color .2s, border-color .2s',
            }}>
              {tp.label}
              {liked && !isActive && (
                <span style={{ display: 'inline-flex', gap: 2 }}>
                  {Array.from({ length: Math.min(3, aff) }).map((_, i) => (
                    <span key={i} style={{ width: 4, height: 4, borderRadius: 999, background: T.accent }} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

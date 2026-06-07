import React from 'react'
import { GearIcon, SparkIcon } from './icons.jsx'

export function TuningHeader({ T, dateStr, articleCount, scrolled, onOpenSources, onOpenSettings }) {
  return (
    <div style={{
      padding: '8px 20px 14px',
      background: T.bg,
      borderBottom: scrolled ? `1px solid ${T.hairline}` : '1px solid transparent',
      transition: 'border-color .25s',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{
            fontFamily: T.labelFont, fontSize: 11.5, color: T.faint, whiteSpace: 'nowrap',
            textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
            letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : '0.04em',
            fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
            fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400,
            marginBottom: 3,
          }}>{dateStr}</div>
          <div style={{
            fontFamily: T.wordmarkFont, fontWeight: T.wordmarkWeight,
            fontSize: 25, color: T.ink, lineHeight: 1.05,
            letterSpacing: T.id === 'minimal' ? '-0.03em' : '-0.01em',
          }}>Charlie's Daily Digest</div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* Sources */}
          <button onClick={onOpenSources} aria-label="Manage sources" style={{
            width: 40, height: 40, borderRadius: T.card === 'list' ? 8 : 999, flexShrink: 0,
            border: `1px solid ${T.hairline}`, background: T.surface, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink,
            transition: 'transform .15s',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M4 8h10M18 8h2M4 16h2M10 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2.4" fill={T.surface} stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="8" cy="16" r="2.4" fill={T.surface} stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </button>

          {/* Settings */}
          <button onClick={onOpenSettings} aria-label="Settings" style={{
            width: 40, height: 40, borderRadius: T.card === 'list' ? 8 : 999, flexShrink: 0,
            border: `1px solid ${T.hairline}`, background: T.surface, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink,
            transition: 'transform .15s',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            <GearIcon size={18} color="currentColor" />
          </button>
        </div>
      </div>

      {/* Article count indicator */}
      {articleCount > 0 && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SparkIcon size={13} color={T.accent} />
          <span style={{
            fontFamily: T.labelFont, fontSize: 12, color: T.sub,
            textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
            letterSpacing: T.labelStyle === 'mono-caps' ? '0.08em' : '0.01em',
            fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
            fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400,
          }}>
            {articleCount} stories selected for you today
          </span>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { SOURCES, SOURCE_GROUPS } from '../data.js'

function Switch({ T, on, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle source" style={{
      width: 48, height: 29, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? T.accent : T.chipBg, position: 'relative',
      transition: 'background .22s', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 23, height: 23, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
        transition: 'left .22s cubic-bezier(.34,1.4,.64,1)',
      }} />
    </button>
  )
}

function SourceRow({ T, s, on, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 22px',
      opacity: on ? 1 : 0.55, transition: 'opacity .2s' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: s.tone, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.headlineFont, fontWeight: 700, fontSize: 15 }}>{s.name[0]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.bodyFont, fontSize: 16, fontWeight: 600, color: T.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: T.faint,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.domain}</div>
      </div>
      <Switch T={T} on={on} onToggle={onToggle} />
    </div>
  )
}

function GroupLabel({ T, children }) {
  return (
    <div style={{ padding: '16px 22px 8px', display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{
        fontFamily: T.labelFont,
        fontSize: T.labelStyle === 'serif-italic' ? 14 : 11.5,
        color: T.sub, fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : '0.02em',
        fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  )
}

export function SourcesSheet({ T, open, enabled, onToggle, onAll, onClose }) {
  const allIds = SOURCE_GROUPS.flatMap(g => g.ids)
  const onCount = allIds.filter(id => enabled[id] !== false).length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 72, pointerEvents: open ? 'auto' : 'none',
      maxWidth: 480, margin: '0 auto' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0, transition: 'opacity .3s',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: T.surface, borderRadius: '18px 18px 0 0',
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform .4s cubic-bezier(.32,.72,0,1)',
        display: 'flex', flexDirection: 'column', maxHeight: 'calc(100% - 70px)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.28)', overflow: 'hidden',
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 99, background: T.hairline, margin: '10px auto 4px', flexShrink: 0 }} />
        <div style={{ padding: '8px 22px 14px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
              fontSize: 24, color: T.ink, letterSpacing: T.headlineTracking }}>Sources</h2>
            <p style={{ margin: '3px 0 0', fontFamily: T.bodyFont, fontSize: 13, color: T.faint }}>
              {onCount} of {allIds.length} feeding your digest
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 16, fontWeight: 600, color: T.accent }}>Done</button>
        </div>

        <div style={{ overflow: 'auto', padding: '4px 0 26px' }}>
          {SOURCE_GROUPS.map(g => (
            <div key={g.label}>
              <GroupLabel T={T}>{g.label}</GroupLabel>
              {g.ids.map(id => (
                <SourceRow key={id} T={T} s={SOURCES[id]} on={enabled[id] !== false}
                  onToggle={() => onToggle(id)} />
              ))}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, padding: '18px 22px 0' }}>
            <button onClick={() => onAll(true)} style={{ flex: 1, height: 42, borderRadius: T.radius > 10 ? 12 : 6,
              border: `1px solid ${T.hairline}`, background: 'transparent', cursor: 'pointer',
              fontFamily: T.bodyFont, fontWeight: 600, fontSize: 14, color: T.ink }}>Enable all</button>
            <button onClick={() => onAll(false)} style={{ flex: 1, height: 42, borderRadius: T.radius > 10 ? 12 : 6,
              border: `1px solid ${T.hairline}`, background: 'transparent', cursor: 'pointer',
              fontFamily: T.bodyFont, fontWeight: 600, fontSize: 14, color: T.sub }}>Mute all</button>
          </div>
        </div>
      </div>
    </div>
  )
}

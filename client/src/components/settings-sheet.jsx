import React from 'react'
import { ACCENT_OPTIONS } from '../themes.js'

function Switch({ T, on, onToggle, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
      <span style={{ fontFamily: T.bodyFont, fontSize: 16, color: T.ink }}>{label}</span>
      <button onClick={onToggle} style={{
        width: 48, height: 29, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: on ? T.accent : T.chipBg, position: 'relative', transition: 'background .22s', padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: 3, left: on ? 22 : 3, width: 23, height: 23, borderRadius: 999,
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
          transition: 'left .22s cubic-bezier(.34,1.4,.64,1)',
        }} />
      </button>
    </div>
  )
}

function SectionLabel({ T, children }) {
  return (
    <div style={{ padding: '16px 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: T.labelFont, fontSize: T.labelStyle === 'serif-italic' ? 14 : 11.5,
        color: T.sub, fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : '0.02em',
        fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  )
}

export function SettingsSheet({ T, open, settings, setSetting, onClose }) {
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
          <h2 style={{ margin: 0, fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
            fontSize: 24, color: T.ink, letterSpacing: T.headlineTracking }}>Appearance</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 16, fontWeight: 600, color: T.accent }}>Done</button>
        </div>

        <div style={{ overflow: 'auto', padding: '4px 22px 32px' }}>
          <SectionLabel T={T}>Accent colour</SectionLabel>
          <div style={{ display: 'flex', gap: 10, padding: '4px 0 12px' }}>
            {ACCENT_OPTIONS.map(opt => {
              const active = settings.accent === opt.light
              return (
                <button key={opt.name} onClick={() => setSetting('accent', opt.light)} style={{
                  width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: settings.dark ? opt.dark : opt.light,
                  outline: active ? `3px solid ${settings.dark ? opt.dark : opt.light}` : 'none',
                  outlineOffset: 3,
                  boxShadow: active ? `0 0 0 5px ${T.surface}` : 'none',
                  transition: 'transform .15s',
                  transform: active ? 'scale(1.15)' : 'scale(1)',
                }} aria-label={opt.name} />
              )
            })}
          </div>

          <SectionLabel T={T}>Mode</SectionLabel>
          <Switch T={T} label="Dark mode" on={settings.dark} onToggle={() => setSetting('dark', !settings.dark)} />
        </div>
      </div>
    </div>
  )
}

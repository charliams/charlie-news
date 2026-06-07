import React from 'react'

export function Toast({ T, toast }) {
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 46, zIndex: 65,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      maxWidth: 480, margin: '0 auto',
    }}>
      <div style={{
        background: T.dark ? 'rgba(40,40,42,0.94)' : 'rgba(20,20,22,0.92)',
        backdropFilter: 'blur(8px)', color: '#fff',
        padding: '10px 16px', borderRadius: 999,
        fontFamily: '-apple-system, system-ui', fontSize: 13.5, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity .25s, transform .25s',
      }}>
        {toast && toast.icon}
        {toast && toast.text}
      </div>
    </div>
  )
}

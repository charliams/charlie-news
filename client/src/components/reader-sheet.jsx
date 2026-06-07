import React from 'react'
import { ExternalIcon } from './icons.jsx'
import { timeAgo } from './meta-row.jsx'
import { SOURCES } from '../data.js'

export function ReaderSheet({ T, article, onClose, sources = SOURCES }) {
  const open = !!article
  const src = article ? sources[article.sourceId || article.source] : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70, pointerEvents: open ? 'auto' : 'none',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0, transition: 'opacity .3s',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 52,
        background: T.dark ? '#000' : '#fff', borderRadius: '14px 14px 0 0',
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform .38s cubic-bezier(.32,.72,0,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
      }}>
        {/* mock safari bar */}
        <div style={{ padding: '10px 14px 12px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0 }}>
          <div style={{ width: 36, height: 5, borderRadius: 99, background: T.hairline, margin: '0 auto 11px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              flex: 1, height: 36, borderRadius: 10, background: T.chipBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: '-apple-system, system-ui', fontSize: 13.5, color: T.sub,
            }}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                <path d="M2 6V4a3.5 3.5 0 117 0v2" stroke={T.faint} strokeWidth="1.4"/>
                <rect x="1" y="6" width="9" height="6.5" rx="1.5" fill={T.faint}/>
              </svg>
              {src?.domain}
            </div>
            <button onClick={onClose} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: '-apple-system, system-ui', fontSize: 16, color: T.accent, fontWeight: 600,
            }}>Done</button>
          </div>
        </div>

        {/* article body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 40px' }}>
          {article && (
            <>
              <div style={{
                fontFamily: '-apple-system, system-ui', fontSize: 12, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: src?.tone, fontWeight: 700,
              }}>{src?.name}</div>

              <h1 style={{
                margin: '10px 0 6px', fontFamily: 'Georgia, "Newsreader", serif',
                fontSize: 26, lineHeight: 1.18, color: T.dark ? '#fff' : '#111',
                letterSpacing: '-0.01em',
              }}>{article.headline}</h1>

              <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 13, color: T.faint, marginBottom: 18 }}>
                {timeAgo(article.mins)} · {article.read} min read
              </div>

              {/* Hero image — real from RSS */}
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt=""
                  style={{
                    width: '100%', height: 190, objectFit: 'cover',
                    borderRadius: 10, marginBottom: 18, display: 'block',
                  }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}

              {/* LLM summary */}
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: 16.5, lineHeight: 1.6,
                color: T.dark ? 'rgba(255,255,255,0.85)' : '#333', margin: '0 0 24px',
              }}>{article.summary}</p>

              {/* CTA */}
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 20px', borderRadius: T.radius > 10 ? 14 : 8,
                    background: T.accent, color: '#fff', textDecoration: 'none',
                    fontFamily: T.bodyFont, fontWeight: 700, fontSize: 16,
                  }}
                >
                  Read at {src?.name} <ExternalIcon size={13} color="#fff" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

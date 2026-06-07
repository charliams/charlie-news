import React from 'react'
import { MetaRow } from './meta-row.jsx'
import { ThumbUp, ThumbDown, SparkIcon } from './icons.jsx'
import { SOURCES } from '../data.js'

function RateNudge({ T, rating }) {
  if (!rating) return null
  const txt = rating === 1 ? 'Got it ✓' : 'Got it ✓'
  return (
    <span style={{
      marginLeft: 6, fontFamily: T.labelFont,
      fontSize: T.labelStyle === 'mono-caps' ? 11 : 12.5,
      letterSpacing: T.labelStyle === 'mono-caps' ? '0.06em' : 0,
      textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
      fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
      fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400,
      color: rating === 1 ? T.accent : T.faint,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      animation: 'nudgeIn .3s ease',
    }}>{txt}</span>
  )
}

export function ArticleCard({ T, article, rating, onRate, onOpen, clamp = 3, sources = SOURCES }) {
  const src = sources[article.sourceId || article.source]
  const up = rating === 1, down = rating === -1

  const RateBtn = ({ dir }) => {
    const active = dir === 1 ? up : down
    const Icon = dir === 1 ? ThumbUp : ThumbDown
    return (
      <button
        onClick={e => { e.stopPropagation(); onRate(dir === 1 ? (up ? 0 : 1) : (down ? 0 : -1)) }}
        aria-label={dir === 1 ? 'More like this' : 'Less like this'}
        style={{
          width: 44, height: 44, borderRadius: T.card === 'list' ? 8 : 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', flexShrink: 0,
          background: active ? (dir === 1 ? T.accent : T.chipBg) : 'transparent',
          color: active ? (dir === 1 ? '#fff' : T.sub) : T.faint,
          transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), background .2s, color .2s',
          transform: active ? 'scale(1.06)' : 'scale(1)',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
        onMouseUp={e => e.currentTarget.style.transform = active ? 'scale(1.06)' : 'scale(1)'}
      >
        <Icon size={21} fill={active && dir === 1 ? '#fff' : 'none'} color="currentColor" sw={1.8} />
      </button>
    )
  }

  const isList = T.card === 'list'
  const isSoft = T.card === 'soft'
  const containerBase = {
    position: 'relative',
    background: isList ? 'transparent' : T.surface,
    borderRadius: isList ? 0 : T.radius,
    padding: isList ? '20px 20px 16px' : isSoft ? '18px 18px 12px' : '17px 18px 12px',
    boxShadow: isSoft && !T.dark ? '0 1px 2px rgba(44,36,25,0.04), 0 6px 18px rgba(44,36,25,0.05)' : 'none',
    border: isSoft ? `1px solid ${T.hairline}` : 'none',
    borderTop: isList ? `1px solid ${T.hairline}` : 'none',
    opacity: down ? 0.5 : 1,
    transition: 'opacity .3s ease',
  }
  const accentEdge = up ? {
    boxShadow: isList ? 'none' : (containerBase.boxShadow === 'none' ? `inset 3px 0 0 ${T.accent}` : `${containerBase.boxShadow}, inset 3px 0 0 ${T.accent}`),
    borderLeft: isList ? `2px solid ${T.accent}` : undefined,
  } : {}

  // Multi-source bar
  const allSrcs = article.allSources || [article.sourceId || article.source]
  const showMultiSource = allSrcs.length > 1

  return (
    <div style={{ ...containerBase, ...accentEdge }}>
      <MetaRow T={T} src={src} mins={article.mins} read={article.read} />
      {showMultiSource && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          {allSrcs.map(sid => {
            const s = sources[sid]
            if (!s || sid === (article.sourceId || article.source)) return null
            return (
              <span key={sid} style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                fontFamily: T.labelFont, fontSize: 11, color: T.faint,
                textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
                letterSpacing: T.labelStyle === 'mono-caps' ? '0.06em' : 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: s.tone }} />
                {s.name}
              </span>
            )
          })}
        </div>
      )}
      <h3
        onClick={() => onOpen(article)}
        style={{
          margin: '9px 0 0', cursor: 'pointer',
          fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
          fontSize: isList ? 21 : 20, lineHeight: T.headlineLine,
          letterSpacing: T.headlineTracking, color: T.ink,
          textWrap: 'pretty',
        }}
      >{article.headline}</h3>
      <p style={{
        margin: '8px 0 0', fontFamily: T.bodyFont,
        fontSize: 14.5, lineHeight: 1.5, color: T.sub, textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{article.summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, marginLeft: -8 }}>
        <RateBtn dir={1} />
        <RateBtn dir={-1} />
        <RateNudge T={T} rating={rating} />
      </div>
    </div>
  )
}

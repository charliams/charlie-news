import React, { useState, useRef } from 'react'
import { MetaRow } from './meta-row.jsx'
import { ThumbUp, ThumbDown, BookmarkIcon, FlagIcon } from './icons.jsx'
import { SOURCES } from '../data.js'

function decodeHtml(str) {
  if (!str) return str
  return str
    .replace(/&#(\d+);?/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
}

function RateNudge({ T, rating }) {
  if (!rating) return null
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
    }}>Got it ✓</span>
  )
}

export function ArticleCard({ T, article, rating, onRate, onSave, onFlag, saved = false, flagged = false, sources = SOURCES }) {
  const src = sources[article.sourceId || article.source] || {
    name: article.sourceId || article.source || 'Unknown',
    tone: '#888888',
  }
  const up = rating === 1, down = rating === -1

  const [flagOpen, setFlagOpen] = useState(false)
  const [flagText, setFlagText] = useState('')
  const [flagSubmitting, setFlagSubmitting] = useState(false)
  const textareaRef = useRef(null)

  const handleFlagClick = () => {
    if (flagged) return
    setFlagOpen(v => !v)
    if (!flagOpen) setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleFlagSubmit = async () => {
    if (!flagText.trim() || flagSubmitting) return
    setFlagSubmitting(true)
    await onFlag(flagText.trim())
    setFlagText('')
    setFlagOpen(false)
    setFlagSubmitting(false)
  }

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
        onClick={() => window.open(article.url, '_blank', 'noreferrer')}
        style={{
          margin: '9px 0 0', cursor: 'pointer',
          fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
          fontSize: isList ? 21 : 20, lineHeight: T.headlineLine,
          letterSpacing: T.headlineTracking, color: T.ink,
          textWrap: 'pretty',
        }}
      >{decodeHtml(article.headline)}</h3>
      <p style={{
        margin: '8px 0 0', fontFamily: T.bodyFont,
        fontSize: 14.5, lineHeight: 1.5, color: T.sub, textWrap: 'pretty',
      }}>{decodeHtml(article.summary)}</p>

      {/* Action row */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, marginLeft: -8 }}>
        <RateBtn dir={1} />
        <RateBtn dir={-1} />
        <RateNudge T={T} rating={rating} />
        <div style={{ flex: 1 }} />
        {/* Save button */}
        <button
          onClick={e => { e.stopPropagation(); onSave?.() }}
          aria-label={saved ? 'Unsave article' : 'Save article'}
          title={saved ? 'Unsave' : 'Save for later'}
          style={{
            width: 36, height: 36, borderRadius: T.card === 'list' ? 8 : 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            background: 'transparent',
            color: saved ? T.accent : T.faint,
            transition: 'color .2s, transform .18s cubic-bezier(.34,1.56,.64,1)',
            transform: saved ? 'scale(1.06)' : 'scale(1)',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
          onMouseUp={e => e.currentTarget.style.transform = saved ? 'scale(1.06)' : 'scale(1)'}
        >
          <BookmarkIcon size={18} color="currentColor" fill={saved ? 'currentColor' : 'none'} sw={1.8} />
        </button>
        {/* Flag button */}
        <button
          onClick={e => { e.stopPropagation(); handleFlagClick() }}
          aria-label={flagged ? 'Already flagged' : 'Flag an issue'}
          title={flagged ? 'Flagged' : 'Flag an issue'}
          style={{
            width: 36, height: 36, borderRadius: T.card === 'list' ? 8 : 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: flagged ? 'default' : 'pointer', flexShrink: 0,
            background: 'transparent',
            color: flagged ? T.accent : (flagOpen ? T.ink : T.faint),
            transition: 'color .2s',
          }}
        >
          <FlagIcon size={17} color="currentColor" fill={flagged ? 'currentColor' : 'none'} sw={1.8} />
        </button>
      </div>

      {/* Flag textarea — inline, expands below the action row */}
      {flagOpen && !flagged && (
        <div style={{ marginTop: 10 }}>
          <textarea
            ref={textareaRef}
            value={flagText}
            onChange={e => setFlagText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleFlagSubmit() }}
            placeholder="Describe the issue with this article…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              fontFamily: T.bodyFont, fontSize: 13.5, lineHeight: 1.5,
              color: T.ink, background: T.chipBg,
              border: `1px solid ${T.hairline}`, borderRadius: 8,
              padding: '8px 10px', resize: 'none', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 6, justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setFlagOpen(false); setFlagText('') }}
              style={{
                fontFamily: T.labelFont, fontSize: 12.5, color: T.faint,
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px',
              }}
            >Cancel</button>
            <button
              onClick={handleFlagSubmit}
              disabled={!flagText.trim() || flagSubmitting}
              style={{
                fontFamily: T.labelFont, fontSize: 12.5, fontWeight: 600,
                color: !flagText.trim() ? T.faint : '#fff',
                background: !flagText.trim() ? T.chipBg : T.accent,
                border: 'none', borderRadius: 6, cursor: flagText.trim() ? 'pointer' : 'default',
                padding: '5px 12px', transition: 'background .2s, color .2s',
              }}
            >{flagSubmitting ? 'Sending…' : 'Submit flag'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

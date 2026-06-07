import React from 'react'
import { ThumbUp, ThumbDown, SparkIcon, ShuffleIcon } from './icons.jsx'
import { SOURCES } from '../data.js'

function RescueRow({ T, article, rating, onRate, onOpen, sources }) {
  const src = sources[article.sourceId || article.source]
  const up = rating === 1, down = rating === -1

  const SmallBtn = ({ dir }) => {
    const active = dir === 1 ? up : down
    const Icon = dir === 1 ? ThumbUp : ThumbDown
    return (
      <button
        onClick={e => { e.stopPropagation(); onRate(dir === 1 ? (up ? 0 : 1) : (down ? 0 : -1)) }}
        aria-label={dir === 1 ? 'Add to feed' : 'Keep hidden'}
        style={{
          width: 38, height: 38, borderRadius: T.card === 'list' ? 7 : 999, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: active ? (dir === 1 ? T.accent : T.chipBg) : 'transparent',
          color: active ? (dir === 1 ? '#fff' : T.sub) : T.faint,
          transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), background .2s, color .2s',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
        <Icon size={17} fill={active && dir === 1 ? '#fff' : 'none'} color="currentColor" sw={1.8} />
      </button>
    )
  }

  const stateLabel = up ? 'Added to your feed' : (down ? 'Kept hidden' : null)

  return (
    <div style={{
      padding: '14px 20px',
      borderTop: `1px solid ${T.hairline}`,
      opacity: down ? 0.4 : 1, transition: 'opacity .3s ease',
    }}>
      {src && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5,
          fontFamily: T.labelFont, fontSize: 11, color: T.faint,
          textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
          letterSpacing: T.labelStyle === 'mono-caps' ? '0.07em' : 0,
          fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
          fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400 }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, background: src.tone, flexShrink: 0 }} />
          <span>{src.name}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h4 onClick={() => onOpen(article)} style={{
          flex: 1, margin: 0, cursor: 'pointer',
          fontFamily: T.headlineFont,
          fontWeight: T.card === 'paper' ? 500 : (T.id === 'minimal' ? 600 : 700),
          fontSize: 15.5, lineHeight: 1.3, letterSpacing: T.headlineTracking,
          color: up ? T.ink : T.sub, textWrap: 'pretty',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{article.headline}</h4>
        <div style={{ display: 'flex', gap: 2, marginRight: -6, flexShrink: 0 }}>
          <SmallBtn dir={1} />
          <SmallBtn dir={-1} />
        </div>
      </div>
      {stateLabel && (
        <div style={{ marginTop: 4, fontFamily: T.labelFont, fontSize: 11.5,
          color: up ? T.accent : T.faint,
          fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
          fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
          textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
          letterSpacing: T.labelStyle === 'mono-caps' ? '0.05em' : 0,
          display: 'inline-flex', alignItems: 'center', gap: 4, animation: 'nudgeIn .3s ease' }}>
          {up && <SparkIcon size={11} color={T.accent} />}{stateLabel}
        </div>
      )}
    </div>
  )
}

export function RescueSection({ T, articles, ratings, onRate, onOpen, onShuffle, sources = SOURCES }) {
  const [expanded, setExpanded] = React.useState(false)
  if (!articles.length) return null

  return (
    <div style={{ marginTop: 28, marginBottom: 8 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <h2 style={{
            margin: 0,
            fontFamily: T.labelStyle === 'serif-italic' ? T.headlineFont : T.labelFont,
            fontWeight: T.labelStyle === 'mono-caps' ? 600 : (T.labelStyle === 'soft-caps' ? 800 : 600),
            fontSize: T.labelStyle === 'serif-italic' ? 19 : 13,
            textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
            letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : (T.labelStyle === 'serif-italic' ? '-0.01em' : '0.01em'),
            color: T.ink,
          }}>Things you might have missed</h2>
          <div style={{ flex: 1, height: 1, background: T.hairline }} />
          <button onClick={onShuffle} aria-label="Shuffle" style={{
            width: 32, height: 32, borderRadius: T.card === 'list' ? 6 : 999,
            border: `1px solid ${T.hairline}`, background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.sub,
            flexShrink: 0,
          }}>
            <ShuffleIcon size={15} color="currentColor" />
          </button>
        </div>
        <p style={{ margin: '5px 0 0', fontFamily: T.bodyFont, fontSize: 12.5, color: T.faint, lineHeight: 1.4 }}>
          Charlie filtered these out. Thumb up if it got one wrong.
        </p>
      </div>
      <div style={{ marginTop: 8 }}>
        {articles.map(item => (
          <RescueRow key={item.id} T={T} article={item}
            rating={ratings[item.id] || 0}
            onRate={v => onRate(item, v)}
            onOpen={onOpen}
            sources={sources} />
        ))}
      </div>
      {!expanded && (
        <div style={{ padding: '8px 20px 0' }}>
          <button onClick={onShuffle} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 0',
            fontFamily: T.bodyFont, fontWeight: 600, fontSize: 13, color: T.accent,
          }}>Show different stories</button>
        </div>
      )}
    </div>
  )
}

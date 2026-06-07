import React from 'react'

function timeAgo(mins) {
  if (mins < 60) return mins + 'm ago'
  const h = Math.floor(mins / 60)
  if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

export { timeAgo }

export function MetaRow({ T, src, mins, read }) {
  if (!src || !src.name) return null
  const style = T.labelStyle
  let labelCss = { color: T.sub, fontFamily: T.labelFont, fontSize: 12.5 }
  let nameCss = {}
  if (style === 'mono-caps') {
    labelCss = { ...labelCss, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }
    nameCss = { color: T.ink, fontWeight: 500 }
  } else if (style === 'serif-italic') {
    labelCss = { ...labelCss, fontSize: 14 }
    nameCss = { fontStyle: 'italic', color: T.ink }
  } else {
    labelCss = { ...labelCss, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em' }
    nameCss = { color: T.ink }
  }
  const dot = <span style={{ opacity: 0.5, margin: '0 5px' }}>·</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap', ...labelCss }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: src.tone, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ ...nameCss, whiteSpace: 'nowrap' }}>{src.name}</span>
      </span>
      {dot}
      <span>{timeAgo(mins)}</span>
      {dot}
      <span>{read} min read</span>
    </div>
  )
}

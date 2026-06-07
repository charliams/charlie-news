// Charlie News — feed components (icons, meta, ArticleCard, TopicNav).
// Loaded as Babel JSX. Shares globals via window at the end.

// ─────────────────────────────────────────────────────────────
// Icons (stroke-based, inherit color)
// ─────────────────────────────────────────────────────────────
function ThumbUp({ size = 22, color = 'currentColor', fill = 'none', sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 10.5v9.5H4.6c-.9 0-1.6-.7-1.6-1.6v-6.3c0-.9.7-1.6 1.6-1.6H7zM7 10.5l4-7.2c.2-.4.6-.6 1-.6 1.1 0 2 .9 2 2v3.3h4.6c1.2 0 2.1 1.1 1.8 2.3l-1.6 6.5c-.2.9-1 1.5-1.9 1.5H7"
        stroke={color} strokeWidth={sw} fill={fill} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}
function ThumbDown({ size = 22, color = 'currentColor', fill = 'none', sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleY(-1)' }}>
      <path d="M7 10.5v9.5H4.6c-.9 0-1.6-.7-1.6-1.6v-6.3c0-.9.7-1.6 1.6-1.6H7zM7 10.5l4-7.2c.2-.4.6-.6 1-.6 1.1 0 2 .9 2 2v3.3h4.6c1.2 0 2.1 1.1 1.8 2.3l-1.6 6.5c-.2.9-1 1.5-1.9 1.5H7"
        stroke={color} strokeWidth={sw} fill={fill} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}
function BookmarkIcon({ size = 20, color = 'currentColor', fill = 'none', sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 4.5C6 3.7 6.7 3 7.5 3h9c.8 0 1.5.7 1.5 1.5V21l-6-3.6L6 21V4.5z"
        stroke={color} strokeWidth={sw} fill={fill} strokeLinejoin="round"/>
    </svg>
  );
}
function ExternalIcon({ size = 13, color = 'currentColor', sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 3H3.5C2.7 3 2 3.7 2 4.5v8C2 13.3 2.7 14 3.5 14h8c.8 0 1.5-.7 1.5-1.5V10" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M9.5 2.5H14V7M14 2.5L7.5 9" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function SparkIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" fill={color}/>
    </svg>
  );
}

function timeAgo(mins) {
  if (mins < 60) return mins + 'm ago';
  const h = Math.floor(mins / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

// ─────────────────────────────────────────────────────────────
// Meta label row — source · time · read time, themed
// ─────────────────────────────────────────────────────────────
function MetaRow({ T, src, mins, read, topicLabel }) {
  const style = T.labelStyle;
  let labelCss = { color: T.sub, fontFamily: T.labelFont, fontSize: 12.5 };
  let nameCss = {};
  let topicCss = {};
  if (style === 'mono-caps') {
    labelCss = { ...labelCss, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' };
    topicCss = { color: T.accent };
    nameCss = { color: T.ink, fontWeight: 500 };
  } else if (style === 'serif-italic') {
    labelCss = { ...labelCss, fontSize: 14 };
    nameCss = { fontStyle: 'italic', color: T.ink };
    topicCss = { fontStyle: 'italic', color: T.accent };
  } else { // soft-caps
    labelCss = { ...labelCss, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em' };
    nameCss = { color: T.ink };
    topicCss = { color: T.accent };
  }
  const dot = <span style={{ opacity: 0.5, margin: '0 5px' }}>·</span>;
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
  );
}

// ─────────────────────────────────────────────────────────────
// Article card — switches container by theme.card (paper/list/soft)
// ─────────────────────────────────────────────────────────────
function ArticleCard({ T, article, rating, onRate, saved, onSave, onOpen, clamp = 3 }) {
  const src = window.SOURCES[article.source];
  const up = rating === 1, down = rating === -1;

  // rating affordance button
  const RateBtn = ({ dir }) => {
    const active = dir === 1 ? up : down;
    const Icon = dir === 1 ? ThumbUp : ThumbDown;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onRate(dir === 1 ? (up ? 0 : 1) : (down ? 0 : -1)); }}
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
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.88)'}
        onMouseUp={(e) => e.currentTarget.style.transform = active ? 'scale(1.06)' : 'scale(1)'}
      >
        <Icon size={21} fill={active && dir === 1 ? '#fff' : 'none'} color="currentColor" sw={1.8} />
      </button>
    );
  };

  // container styling per theme
  const isList = T.card === 'list';
  const isSoft = T.card === 'soft';
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
  };
  // up-voted: subtle accent edge
  const accentEdge = up ? {
    boxShadow: isList ? 'none' : `${containerBase.boxShadow === 'none' ? '' : containerBase.boxShadow + ', '}inset 3px 0 0 ${T.accent}`,
    borderLeft: isList ? `2px solid ${T.accent}` : undefined,
  } : {};

  return (
    <div style={{ ...containerBase, ...accentEdge }}>
      <MetaRow T={T} src={src} mins={article.mins} read={article.read} topicLabel={article.topic} />
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

      {/* footer: rating + nudge + save */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, marginLeft: -8 }}>
        <RateBtn dir={1} />
        <RateBtn dir={-1} />
        <RateNudge T={T} rating={rating} />
        <div style={{ flex: 1 }} />
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          aria-label="Save"
          style={{
            width: 44, height: 44, borderRadius: isList ? 8 : 999, border: 'none',
            background: 'transparent', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: saved ? T.accent : T.faint, transition: 'color .2s, transform .15s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <BookmarkIcon size={19} fill={saved ? T.accent : 'none'} color="currentColor" />
        </button>
      </div>
    </div>
  );
}

function RateNudge({ T, rating }) {
  if (!rating) return null;
  const txt = rating === 1 ? 'More like this' : 'Less like this';
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
  );
}

Object.assign(window, { ArticleCard, MetaRow, RateNudge, timeAgo, ThumbUp, ThumbDown, BookmarkIcon, ExternalIcon, SparkIcon });

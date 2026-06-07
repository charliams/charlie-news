// Charlie News — chrome: TuningHeader, TopicNav, ReaderSheet, Toast.

// ─────────────────────────────────────────────────────────────
// Header — wordmark + date + live "feed tuning" meter
// ─────────────────────────────────────────────────────────────
function TuningHeader({ T, dateStr, tuned, signals, scrolled, onOpenSources }) {
  return (
    <div style={{
      padding: '8px 20px 14px',
      background: T.bg,
      borderBottom: scrolled ? `1px solid ${T.hairline}` : '1px solid transparent',
      transition: 'border-color .25s',
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
        }}>{'Charlie\u2019s Daily Digest'}</div>
        </div>
        <button onClick={onOpenSources} aria-label="Manage sources" style={{
          width: 40, height: 40, borderRadius: T.card === 'list' ? 8 : 999, flexShrink: 0,
          border: `1px solid ${T.hairline}`, background: T.surface, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink,
          transition: 'transform .15s',
        }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M4 8h10M18 8h2M4 16h2M10 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="16" cy="8" r="2.4" fill={T.surface} stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="8" cy="16" r="2.4" fill={T.surface} stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      {/* tuning meter */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <SparkIcon size={14} color={T.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
            <span style={{
              fontFamily: T.labelFont, fontSize: 11, color: T.sub, whiteSpace: 'nowrap',
              textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
              letterSpacing: T.labelStyle === 'mono-caps' ? '0.08em' : '0.01em',
              fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
              fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400,
            }}>Your feed is {Math.round(tuned)}% tuned</span>
            <span style={{ fontFamily: T.labelFont, fontSize: 10.5, color: T.faint, whiteSpace: 'nowrap',
              textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
              letterSpacing: T.labelStyle === 'mono-caps' ? '0.06em' : 0 }}>
              {signals} signal{signals === 1 ? '' : 's'}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 999, background: T.chipBg, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${Math.max(3, tuned)}%`, borderRadius: 999,
              background: T.accent, transition: 'width .5s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Topic nav — sticky chips, accent intensity reflects affinity
// ─────────────────────────────────────────────────────────────
function TopicNav({ T, topics, affinity, active, onPick }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 8, background: T.bg,
      borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '11px 20px 12px',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }} className="chiprow">
        {topics.map((tp) => {
          const aff = affinity[tp.id] || 0;
          const isActive = active === tp.id;
          const liked = aff > 0;
          const round = T.card === 'list' ? 6 : 999;
          return (
            <button key={tp.id} onClick={() => onPick(tp.id)} style={{
              flexShrink: 0, height: 34, padding: '0 14px', borderRadius: round,
              border: `1px solid ${isActive ? 'transparent' : T.hairline}`,
              background: isActive ? T.ink : (liked ? T.chipBg : 'transparent'),
              color: isActive ? T.bg : T.ink,
              fontFamily: T.labelFont,
              fontSize: T.labelStyle === 'mono-caps' ? 11.5 : 13.5,
              fontWeight: T.labelStyle === 'soft-caps' ? 700 : (T.labelStyle === 'mono-caps' ? 500 : 500),
              textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
              letterSpacing: T.labelStyle === 'mono-caps' ? '0.06em' : 0,
              fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
              cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background .2s, color .2s, border-color .2s',
            }}>
              {tp.label}
              {liked && !isActive && (
                <span style={{ display: 'inline-flex', gap: 2 }}>
                  {Array.from({ length: Math.min(3, aff) }).map((_, i) => (
                    <span key={i} style={{ width: 4, height: 4, borderRadius: 999, background: T.accent }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reader sheet — simulates opening the original source externally
// ─────────────────────────────────────────────────────────────
function ReaderSheet({ T, article, onClose }) {
  const open = !!article;
  const src = article ? window.SOURCES[article.source] : null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70, pointerEvents: open ? 'auto' : 'none',
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
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M2 6V4a3.5 3.5 0 117 0v2" stroke={T.faint} strokeWidth="1.4"/><rect x="1" y="6" width="9" height="6.5" rx="1.5" fill={T.faint}/></svg>
              {src && src.domain}
            </div>
            <button onClick={onClose} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: '-apple-system, system-ui', fontSize: 16, color: T.accent, fontWeight: 600,
            }}>Done</button>
          </div>
        </div>
        {/* mock article body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 40px' }}>
          {article && <>
            <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 12, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: src.tone, fontWeight: 700 }}>{src.name}</div>
            <h1 style={{ margin: '10px 0 6px', fontFamily: 'Georgia, "Newsreader", serif',
              fontSize: 26, lineHeight: 1.18, color: T.dark ? '#fff' : '#111', letterSpacing: '-0.01em' }}>
              {article.headline}</h1>
            <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 13, color: T.faint, marginBottom: 18 }}>
              By Staff Reporter · {window.timeAgo(article.mins)}</div>
            {/* placeholder hero image */}
            <div style={{
              height: 170, borderRadius: 10, marginBottom: 18,
              background: `repeating-linear-gradient(135deg, ${T.chipBg}, ${T.chipBg} 11px, ${T.surface} 11px, ${T.surface} 22px)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: T.faint,
              border: `1px solid ${T.hairline}`,
            }}>article image</div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 16.5, lineHeight: 1.6,
              color: T.dark ? 'rgba(255,255,255,0.85)' : '#333', margin: '0 0 14px' }}>{article.summary}</p>
            {[0,1,2].map(i => (
              <div key={i} style={{ marginBottom: 10 }}>
                {[92, 97, 88, 60].map((w, j) => (
                  <div key={j} style={{ height: 11, width: w + '%', borderRadius: 3,
                    background: T.chipBg, marginBottom: 7 }} />
                ))}
              </div>
            ))}
          </>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Toast — micro feedback after rating
// ─────────────────────────────────────────────────────────────
function Toast({ T, toast }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 46, zIndex: 65,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
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
  );
}

Object.assign(window, { TuningHeader, TopicNav, ReaderSheet, Toast, FilteredList, SourcesSheet });

// ─────────────────────────────────────────────────────────────
// Toggle switch + Sources manager sheet
// ─────────────────────────────────────────────────────────────
function Switch({ T, on, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle source" style={{
      width: 48, height: 29, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? T.accent : T.chipBg, position: 'relative',
      transition: 'background .22s', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 23, height: 23, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.28)', transition: 'left .22s cubic-bezier(.34,1.4,.64,1)',
      }} />
    </button>
  );
}

function SourceRow({ T, s, on, onToggle, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 22px',
      opacity: on ? 1 : 0.55, transition: 'opacity .2s' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: s.tone, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.headlineFont, fontWeight: 700, fontSize: 15 }}>{s.name[0].toUpperCase()}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.bodyFont, fontSize: 16, fontWeight: 600, color: T.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: T.faint,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.domain}</div>
      </div>
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove source" style={{
          width: 30, height: 30, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer',
          color: T.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </button>
      )}
      <Switch T={T} on={on} onToggle={onToggle} />
    </div>
  );
}

function GroupLabel({ T, children }) {
  return (
    <div style={{ padding: '16px 22px 8px', display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ fontFamily: T.labelFont, fontSize: T.labelStyle === 'serif-italic' ? 14 : 11.5,
        color: T.sub, fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : '0.02em',
        fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  );
}

function SourcesSheet({ T, open, enabled, custom = [], onToggle, onAll, onAdd, onRemove, onClose }) {
  const [draft, setDraft] = React.useState('');
  const builtinIds = window.SOURCE_GROUPS.flatMap((g) => g.ids);
  const allIds = [...builtinIds, ...custom.map((s) => s.id)];
  const total = allIds.length;
  const onCount = allIds.filter((id) => enabled[id] !== false).length;
  const submit = () => { const v = draft.trim(); if (!v) return; onAdd(v); setDraft(''); };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 72, pointerEvents: open ? 'auto' : 'none' }}>
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
        {/* header */}
        <div style={{ padding: '8px 22px 14px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
              fontSize: 24, color: T.ink, letterSpacing: T.headlineTracking }}>Sources</h2>
            <p style={{ margin: '3px 0 0', fontFamily: T.bodyFont, fontSize: 13, color: T.faint }}>
              {onCount} of {total} feeding your digest
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 16, fontWeight: 600, color: T.accent }}>Done</button>
        </div>
        {/* scroll body */}
        <div style={{ overflow: 'auto', padding: '4px 0 26px' }}>
          {/* add a source */}
          <GroupLabel T={T}>Add a source</GroupLabel>
          <div style={{ display: 'flex', gap: 9, padding: '2px 22px 4px' }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="Name or website, e.g. Stuff or stuff.co.nz"
              style={{ flex: 1, minWidth: 0, height: 44, borderRadius: T.radius > 10 ? 12 : 6,
                border: `1px solid ${T.hairline}`, background: T.bg, padding: '0 14px',
                fontFamily: T.bodyFont, fontSize: 14.5, color: T.ink, outline: 'none' }} />
            <button onClick={submit} disabled={!draft.trim()} style={{
              height: 44, padding: '0 18px', borderRadius: T.radius > 10 ? 12 : 6, border: 'none',
              cursor: draft.trim() ? 'pointer' : 'default', flexShrink: 0,
              background: draft.trim() ? T.accent : T.chipBg, color: draft.trim() ? '#fff' : T.faint,
              fontFamily: T.bodyFont, fontWeight: 700, fontSize: 14.5, transition: 'background .2s' }}>Add</button>
          </div>

          {/* added by you */}
          {custom.length > 0 && (
            <div>
              <GroupLabel T={T}>Added by you</GroupLabel>
              {custom.map((s) => (
                <SourceRow key={s.id} T={T} s={s} on={enabled[s.id] !== false}
                  onToggle={() => onToggle(s.id)} onRemove={() => onRemove(s.id)} />
              ))}
            </div>
          )}

          {/* built-in groups */}
          {window.SOURCE_GROUPS.map((g) => (
            <div key={g.label}>
              <GroupLabel T={T}>{g.label}</GroupLabel>
              {g.ids.map((id) => (
                <SourceRow key={id} T={T} s={window.SOURCES[id]} on={enabled[id] !== false}
                  onToggle={() => onToggle(id)} />
              ))}
            </div>
          ))}

          {/* bulk actions */}
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
  );
}

// ─────────────────────────────────────────────────────────────
// Filtered-out list — headline-only rows Charlie hid, still rateable
// ─────────────────────────────────────────────────────────────
function FilteredRow({ T, item, rating, onRate, onOpen, isLast }) {
  const src = window.SOURCES[item.source];
  const up = rating === 1, down = rating === -1;
  const SmallBtn = ({ dir }) => {
    const active = dir === 1 ? up : down;
    const Icon = dir === 1 ? window.ThumbUp : window.ThumbDown;
    return (
      <button onClick={(e) => { e.stopPropagation(); onRate(dir === 1 ? (up ? 0 : 1) : (down ? 0 : -1)); }}
        aria-label={dir === 1 ? 'Show me this' : 'Keep hidden'}
        style={{
          width: 38, height: 38, borderRadius: T.card === 'list' ? 7 : 999, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: active ? (dir === 1 ? T.accent : T.chipBg) : 'transparent',
          color: active ? (dir === 1 ? '#fff' : T.sub) : T.faint,
          transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), background .2s, color .2s',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <Icon size={17} fill={active && dir === 1 ? '#fff' : 'none'} color="currentColor" sw={1.8} />
      </button>
    );
  };
  const stateLabel = up ? 'Added to your feed' : (down ? 'Kept hidden' : null);
  return (
    <div style={{
      padding: '14px 20px', borderTop: isLast ? 'none' : `1px solid ${T.hairline}`,
      opacity: down ? 0.4 : 1, transition: 'opacity .3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5,
        fontFamily: T.labelFont, fontSize: 11, color: T.faint,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.07em' : 0,
        fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
        fontWeight: T.labelStyle === 'soft-caps' ? 700 : 400 }}>
        <span style={{ width: 6, height: 6, borderRadius: 2, background: src.tone, flexShrink: 0 }} />
        <span>{src.name}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{item.kind}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h4 onClick={() => onOpen(item)} style={{
          flex: 1, margin: 0, cursor: 'pointer',
          fontFamily: T.headlineFont, fontWeight: T.card === 'paper' ? 500 : (T.id === 'minimal' ? 600 : 700),
          fontSize: 15.5, lineHeight: 1.3, letterSpacing: T.headlineTracking,
          color: up ? T.ink : T.sub, textWrap: 'pretty',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.headline}</h4>
        <div style={{ display: 'flex', gap: 2, marginRight: -6, flexShrink: 0 }}>
          <SmallBtn dir={1} />
          <SmallBtn dir={-1} />
        </div>
      </div>
      {stateLabel && (
        <div style={{ marginTop: 4, fontFamily: T.labelFont, fontSize: 11.5,
          color: up ? T.accent : T.faint, fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
          fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
          textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
          letterSpacing: T.labelStyle === 'mono-caps' ? '0.05em' : 0,
          display: 'inline-flex', alignItems: 'center', gap: 4, animation: 'nudgeIn .3s ease' }}>
          {up && <window.SparkIcon size={11} color={T.accent} />}{stateLabel}
        </div>
      )}
    </div>
  );
}

function FilteredList({ T, items, ratings, onRate, onOpen }) {
  const [expanded, setExpanded] = React.useState(false);
  const shown = expanded ? items : items.slice(0, 3);
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <h2 style={{
            margin: 0, fontFamily: T.labelStyle === 'serif-italic' ? T.headlineFont : T.labelFont,
            fontWeight: T.labelStyle === 'mono-caps' ? 600 : (T.labelStyle === 'soft-caps' ? 800 : 600),
            fontSize: T.labelStyle === 'serif-italic' ? 19 : 13,
            textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
            letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : (T.labelStyle === 'serif-italic' ? '-0.01em' : '0.01em'),
            color: T.ink,
          }}>Filtered out</h2>
          <div style={{ flex: 1, height: 1, background: T.hairline }} />
        </div>
        <p style={{ margin: '5px 0 0', fontFamily: T.bodyFont, fontSize: 12.5, color: T.faint, lineHeight: 1.4 }}>
          Charlie hid these from your feed. Tap a thumb if it got one wrong.
        </p>
      </div>
      <div style={{ marginTop: 8 }}>
        {shown.map((item, i) => (
          <FilteredRow key={item.id} T={T} item={item}
            rating={ratings[item.id] || 0}
            onRate={(v) => onRate(item, v)} onOpen={onOpen} isLast={i === 0} />
        ))}
      </div>
      {items.length > 3 && (
        <div style={{ padding: '8px 20px 0' }}>
          <button onClick={() => setExpanded((e) => !e)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 0',
            fontFamily: T.bodyFont, fontWeight: 600, fontSize: 13, color: T.accent,
          }}>{expanded ? 'Show fewer' : `Show ${items.length - 3} more`}</button>
        </div>
      )}
    </div>
  );
}

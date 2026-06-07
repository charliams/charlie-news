// Charlie News — main app. State, tuning logic, feed reorder, tweaks, iOS frame.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "accent": "oklch(0.58 0.14 150)",
  "dark": false,
  "summaryLines": 3
}/*EDITMODE-END*/;

const LS_KEY = 'charlie_news_v1';
function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
}
function saveState(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const persisted = React.useMemo(loadState, []);
  const [ratings, setRatings] = React.useState(persisted.ratings || {});
  const [saved, setSaved] = React.useState(persisted.saved || {});
  const [reader, setReader] = React.useState(null);
  const [sourcesOpen, setSourcesOpen] = React.useState(false);
  const [enabledSources, setEnabledSources] = React.useState(persisted.enabledSources || {});
  const [customSources, setCustomSources] = React.useState(persisted.customSources || []);
  const [customArticles, setCustomArticles] = React.useState(persisted.customArticles || []);
  // keep window.SOURCES in sync so meta/labels resolve custom sources
  customSources.forEach((s) => { window.SOURCES[s.id] = s; });
  const [toast, setToast] = React.useState(null);
  const [active, setActive] = React.useState('top');
  const [scrolled, setScrolled] = React.useState(false);
  const [order, setOrder] = React.useState(window.TOPICS.map((tp) => tp.id));
  const [reflowing, setReflowing] = React.useState(false);

  const scrollRef = React.useRef(null);
  const sectionRefs = React.useRef({});
  const toastTimer = React.useRef(null);

  React.useEffect(() => { saveState({ ratings, saved, enabledSources, customSources, customArticles }); }, [ratings, saved, enabledSources, customSources, customArticles]);

  const T = window.buildTheme(t.theme, window.resolveAccent(t.accent, t.dark), t.dark);
  const dateStr = new Date(2026, 5, 7).toLocaleDateString('en-NZ', { weekday: 'long', month: 'long', day: 'numeric' });

  // ── derived: affinity per topic, signals, tuned % ──
  const lookupArticles = window.ARTICLES.concat(customArticles, window.FILTERED);
  const feedArticles = window.ARTICLES.concat(customArticles);
  const affinity = {};
  window.TOPICS.forEach((tp) => { affinity[tp.id] = 0; });
  Object.entries(ratings).forEach(([id, r]) => {
    const art = lookupArticles.find((a) => a.id === id);
    if (art) affinity[art.topic] += r;
  });
  const signals = Object.keys(ratings).length;
  const tuned = Math.min(97, 9 + signals * 6.5);

  // optimal order = topics by affinity desc, stable
  const optimalOrder = React.useMemo(() => {
    const base = window.TOPICS.map((tp) => tp.id);
    return [...base].sort((a, b) => (affinity[b] || 0) - (affinity[a] || 0));
  }, [JSON.stringify(affinity)]);
  const canRerank = signals > 0 && optimalOrder.join() !== order.join();

  const flashToast = (text, icon) => {
    setToast({ text, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  };

  const rate = (article, value) => {
    setRatings((prev) => {
      const next = { ...prev };
      if (value === 0) delete next[article.id]; else next[article.id] = value;
      return next;
    });
    if (article.filtered) {
      if (value === 1) flashToast('Added to your feed ↑', <window.SparkIcon size={13} color="#fff" />);
      else if (value === -1) flashToast('Kept hidden ✓');
      return;
    }
    const tp = window.TOPICS.find((x) => x.id === article.topic);
    const topicLabel = tp ? tp.label : 'this';
    if (value === 1) flashToast(`More ${topicLabel} ↑`, <window.SparkIcon size={13} color="#fff" />);
    else if (value === -1) flashToast(`Less like this ↓`);
  };

  const toggleSave = (article) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[article.id]) { delete next[article.id]; }
      else { next[article.id] = true; flashToast('Saved for later', <window.BookmarkIcon size={13} color="#fff" fill="#fff" />); }
      return next;
    });
  };

  const reRank = () => {
    setReflowing(true);
    setTimeout(() => {
      setOrder(optimalOrder);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => setReflowing(false), 60);
    }, 240);
  };

  // ── scroll tracking: active chip + header shadow ──
  const onScroll = () => {
    const sc = scrollRef.current;
    if (!sc) return;
    setScrolled(sc.scrollTop > 6);
    const top = sc.scrollTop + 120;
    let cur = 'top';
    for (const tid of order) {
      const el = sectionRefs.current[tid];
      if (el && el.offsetTop <= top) cur = tid;
    }
    setActive(sc.scrollTop < 40 ? 'top' : cur);
  };

  const scrollToTopic = (tid) => {
    const sc = scrollRef.current;
    if (!sc) return;
    if (tid === 'top') { sc.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = sectionRefs.current[tid];
    if (el) sc.scrollTo({ top: Math.max(0, el.offsetTop - 8), behavior: 'smooth' });
  };

  const srcOn = (id) => enabledSources[id] !== false;
  const toggleSource = (id) => setEnabledSources((p) => ({ ...p, [id]: p[id] === false }));
  const setAllSources = (on) => {
    const next = {}; Object.keys(window.SOURCES).forEach((k) => { next[k] = on; }); setEnabledSources(next);
  };

  const onAddSource = (raw) => {
    const cleaned = raw.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim();
    let name, domain;
    if (cleaned.includes('.')) {
      domain = cleaned.toLowerCase();
      const base = domain.split('.')[0];
      name = base.charAt(0).toUpperCase() + base.slice(1);
    } else {
      name = raw.trim();
      domain = name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';
    }
    const id = 'cs_' + Date.now();
    const tones = ['#6b4e9e', '#b5632a', '#2f7d5b', '#9e2b4e', '#3a6ea5', '#7a6320'];
    const tone = tones[customSources.length % tones.length];
    const src = { id, name, domain, tone };
    window.SOURCES[id] = src;
    setCustomSources((p) => [...p, src]);
    setEnabledSources((p) => ({ ...p, [id]: true }));
    const pool = window.SOURCE_TEMPLATES;
    const start = (customSources.length * 2) % pool.length;
    const picks = [pool[start % pool.length], pool[(start + 1) % pool.length]];
    const arts = picks.map((tpl, i) => ({ ...tpl, id: id + '_a' + i, source: id }));
    setCustomArticles((p) => [...arts, ...p]);
    flashToast('Added ' + name + ' \u2191', <window.SparkIcon size={13} color="#fff" />);
  };

  const onRemoveSource = (id) => {
    delete window.SOURCES[id];
    setCustomSources((p) => p.filter((s) => s.id !== id));
    setCustomArticles((p) => p.filter((a) => a.source !== id));
    setEnabledSources((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  const navTopics = [{ id: 'top', label: 'For You' }, ...order.map((id) => window.TOPICS.find((tp) => tp.id === id))];

  return (
    <IOSDevice dark={t.dark}>
    <div style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      {/* clear the status bar / dynamic island */}
      <div style={{ height: 56, background: T.bg }} />

      <div style={{ height: 'calc(100% - 56px)', display: 'flex', flexDirection: 'column' }}>
        <TuningHeader T={T} dateStr={dateStr} tuned={tuned} signals={signals} scrolled={scrolled} onOpenSources={() => setSourcesOpen(true)} />

        <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {/* sticky topic nav with re-rank */}
          <div style={{ position: 'sticky', top: 0, zIndex: 8 }}>
            <TopicNav T={T} topics={navTopics} affinity={affinity} active={active} onPick={scrollToTopic} />
            {canRerank && (
              <button onClick={reRank} style={{
                position: 'absolute', right: 14, top: 9, height: 34, padding: '0 13px',
                borderRadius: T.card === 'list' ? 6 : 999, border: 'none', cursor: 'pointer',
                background: T.accent, color: '#fff', fontFamily: T.bodyFont, fontWeight: 600,
                fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 5,
                boxShadow: `0 2px 10px ${T.dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'}`,
                animation: 'nudgeIn .3s ease',
              }}>
                <window.SparkIcon size={12} color="#fff" /> Re-rank
              </button>
            )}
          </div>

          {/* feed: topic sections */}
          <div style={{ opacity: reflowing ? 0 : 1, transition: 'opacity .24s ease', paddingBottom: 40 }}>
            {order.map((tid) => {
              const tp = window.TOPICS.find((x) => x.id === tid);
              const arts = feedArticles.filter((a) => a.topic === tid && srcOn(a.source));
              if (arts.length === 0) return null;
              return (
                <section key={tid} ref={(el) => (sectionRefs.current[tid] = el)} style={{ marginTop: 6 }}>
                  <SectionHeader T={T} label={tp.label} affinity={affinity[tid] || 0} />
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    gap: T.card === 'soft' ? 12 : 0,
                    padding: T.card === 'soft' ? '0 14px' : (T.card === 'paper' ? '0 14px' : '0'),
                  }}>
                    {arts.map((a) => (
                      <ArticleCard key={a.id} T={T} article={a} clamp={t.summaryLines}
                        rating={ratings[a.id] || 0} onRate={(v) => rate(a, v)}
                        saved={!!saved[a.id]} onSave={() => toggleSave(a)}
                        onOpen={setReader} />
                    ))}
                  </div>
                </section>
              );
            })}
            <FilteredList T={T} items={window.FILTERED.filter((f) => srcOn(f.source))} ratings={ratings} onRate={rate} onOpen={setReader} />
            <FeedFooter T={T} signals={signals} />
          </div>
        </div>
      </div>

      <ReaderSheet T={T} article={reader} onClose={() => setReader(null)} />
      <SourcesSheet T={T} open={sourcesOpen} enabled={enabledSources} custom={customSources}
        onToggle={toggleSource} onAll={setAllSources} onAdd={onAddSource} onRemove={onRemoveSource} onClose={() => setSourcesOpen(false)} />
      <Toast T={T} toast={toast} />
    </div>

      {/* ── Tweaks ── */}
      <TweaksPanel>
        <TweakSection label="Aesthetic" />
        <TweakRadio label="Theme" value={t.theme}
          options={window.THEME_LIST.map((x) => x.id)}
          onChange={(v) => setTweak('theme', v)} />
        <TweakColor label="Accent" value={t.accent}
          options={window.ACCENT_OPTIONS.map((o) => o.light)}
          onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakSection label="Feed" />
        <TweakRadio label="Summary length" value={String(t.summaryLines)}
          options={['2', '3', '5']}
          onChange={(v) => setTweak('summaryLines', Number(v))} />
        <TweakButton label="Reset my ratings" onClick={() => { setRatings({}); setSaved({}); setOrder(window.TOPICS.map((tp) => tp.id)); }} />
      </TweaksPanel>

      <style>{`
        .chiprow::-webkit-scrollbar { display: none; }
        @keyframes nudgeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
        h3 { -webkit-tap-highlight-color: transparent; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </IOSDevice>
  );
}

function SectionHeader({ T, label, affinity }) {
  const liked = affinity > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 20px 8px' }}>
      <h2 style={{
        margin: 0, fontFamily: T.labelStyle === 'serif-italic' ? T.headlineFont : T.labelFont,
        fontWeight: T.labelStyle === 'mono-caps' ? 600 : (T.labelStyle === 'soft-caps' ? 800 : 600),
        fontSize: T.labelStyle === 'serif-italic' ? 19 : 13,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : (T.labelStyle === 'serif-italic' ? '-0.01em' : '0.01em'),
        color: T.ink,
      }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
      {liked && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: T.accent,
          fontFamily: T.labelFont, fontSize: 10.5, fontWeight: 600,
          textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none', letterSpacing: '0.04em' }}>
          <window.SparkIcon size={11} color={T.accent} /> following
        </span>
      )}
    </div>
  );
}

function FeedFooter({ T, signals }) {
  return (
    <div style={{ textAlign: 'center', padding: '30px 30px 10px', fontFamily: T.bodyFont,
      fontSize: 13, color: T.faint, lineHeight: 1.5 }}>
      {'You\u2019re all caught up.'}<br />
      {signals > 0
        ? `Charlie is learning from your ${signals} signal${signals === 1 ? '' : 's'}.`
        : 'Rate a few stories to start tuning your feed.'}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

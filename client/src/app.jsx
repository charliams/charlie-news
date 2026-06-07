import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'

import { SOURCES, SOURCE_GROUPS, TOPICS } from './data.js'
import { buildTheme, resolveAccent } from './themes.js'
import { useSettings } from './hooks/useSettings.js'
import { useFeed } from './hooks/useFeed.js'

import { SparkIcon } from './components/icons.jsx'
import { TuningHeader } from './components/tuning-header.jsx'
import { TopicNav } from './components/topic-nav.jsx'
import { ArticleCard } from './components/article-card.jsx'
import { SourcesSheet } from './components/sources-sheet.jsx'
import { SettingsSheet } from './components/settings-sheet.jsx'
import { RescueSection } from './components/rescue-section.jsx'
import { Toast } from './components/toast.jsx'

const LS_STATE = 'charlie_app_v2'
function loadAppState() { try { return JSON.parse(localStorage.getItem(LS_STATE)) || {} } catch { return {} } }
function saveAppState(s) { try { localStorage.setItem(LS_STATE, JSON.stringify(s)) } catch {} }

function SectionHeader({ T, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 20px 8px' }}>
      <h2 style={{
        margin: 0,
        fontFamily: T.labelStyle === 'serif-italic' ? T.headlineFont : T.labelFont,
        fontWeight: T.labelStyle === 'mono-caps' ? 600 : (T.labelStyle === 'soft-caps' ? 800 : 600),
        fontSize: T.labelStyle === 'serif-italic' ? 19 : 13,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : (T.labelStyle === 'serif-italic' ? '-0.01em' : '0.01em'),
        color: T.ink,
      }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  )
}

function FeedFooter({ T, feedCount }) {
  return (
    <div style={{ textAlign: 'center', padding: '30px 30px 10px', fontFamily: T.bodyFont,
      fontSize: 13, color: T.faint, lineHeight: 1.5 }}>
      {feedCount > 0 ? 'You\'re all caught up.' : 'No stories yet — check back soon.'}
    </div>
  )
}

function LoadingState({ T }) {
  const bars = [85, 70, 90, 60, 80]
  return (
    <div style={{ padding: '20px 20px 0' }}>
      {bars.map((w, i) => (
        <div key={i} style={{ marginBottom: 28 }}>
          <div style={{ height: 10, width: '40%', borderRadius: 4, background: T.chipBg, marginBottom: 10 }} />
          <div style={{ height: 20, width: w + '%', borderRadius: 4, background: T.chipBg, marginBottom: 7 }} />
          <div style={{ height: 14, width: '90%', borderRadius: 4, background: T.chipBg, marginBottom: 5 }} />
          <div style={{ height: 14, width: '75%', borderRadius: 4, background: T.chipBg }} />
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [settings, setSetting] = useSettings()
  const T = buildTheme(settings.theme, resolveAccent(settings.accent, settings.dark), settings.dark)

  const { feedArticles, rescueArticles, loading, error, refreshRescue, submitFeedback } = useFeed()

  // Persisted state
  const persisted = useMemo(loadAppState, [])
  const [ratings, setRatings] = useState(persisted.ratings || {})
  const [enabledSources, setEnabledSources] = useState(persisted.enabledSources || {})
  const [savedIds, setSavedIds] = useState(() => persisted.savedIds || [])
  const [savedData, setSavedData] = useState(() => persisted.savedData || {})
  const [flaggedIds, setFlaggedIds] = useState(() => new Set(persisted.flaggedIds || []))

  useEffect(() => {
    saveAppState({
      ratings, enabledSources, savedIds, savedData,
      flaggedIds: Array.from(flaggedIds),
    })
  }, [ratings, enabledSources, savedIds, savedData, flaggedIds])

  // UI state
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [toast, setToast] = useState(null)

  const scrollRef = useRef(null)
  const sectionRefs = useRef({})
  const toastTimer = useRef(null)

  const dateStr = new Date().toLocaleDateString('en-NZ', { weekday: 'long', month: 'long', day: 'numeric' })

  // Affinity from local ratings (for TopicNav dots)
  const affinity = useMemo(() => {
    const aff = {}
    TOPICS.forEach(tp => { aff[tp.id] = 0 })
    const allArticles = [...feedArticles, ...rescueArticles]
    Object.entries(ratings).forEach(([id, r]) => {
      const art = allArticles.find(a => a.id === id)
      if (art) aff[art.topic] = (aff[art.topic] || 0) + r
    })
    return aff
  }, [ratings, feedArticles, rescueArticles])

  const flashToast = useCallback((text, icon) => {
    setToast({ text, icon })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1900)
  }, [])

  const srcOn = id => enabledSources[id] !== false

  // Filter feed by enabled sources
  const visibleFeed = feedArticles.filter(a => srcOn(a.sourceId || a.source))

  const handleRate = useCallback((article, value, isRescue = false) => {
    setRatings(prev => {
      const next = { ...prev }
      if (value === 0) delete next[article.id]
      else next[article.id] = value
      return next
    })
    submitFeedback(article.id, value, isRescue)
    if (isRescue) {
      if (value === 1) flashToast('Added to your feed', <SparkIcon size={13} color="#fff" />)
      else if (value === -1) flashToast('Kept hidden ✓')
    } else {
      if (value === 1) flashToast('Got it ✓', <SparkIcon size={13} color="#fff" />)
      else if (value === -1) flashToast('Got it ✓')
    }
  }, [submitFeedback, flashToast])

  const handleSave = useCallback((article) => {
    const id = article.id
    setSavedIds(prev => {
      if (prev.includes(id)) {
        flashToast('Removed from saved')
        return prev.filter(x => x !== id)
      } else {
        flashToast('Saved ✓')
        return [id, ...prev]
      }
    })
    setSavedData(prev => {
      if (prev[id]) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: article }
    })
  }, [flashToast])

  const handleFlag = useCallback(async (article, note) => {
    try {
      await fetch('/api/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, headline: article.headline, note }),
      })
      setFlaggedIds(prev => new Set([...prev, article.id]))
      flashToast('Flagged ✓')
    } catch {
      flashToast('Could not submit flag')
    }
  }, [flashToast])

  const onScroll = useCallback(() => {
    const sc = scrollRef.current
    if (!sc) return
    setScrolled(sc.scrollTop > 6)
    const top = sc.scrollTop + 120
    let cur = 'top'
    for (const { id } of TOPICS) {
      const el = sectionRefs.current[id]
      if (el && el.offsetTop <= top) cur = id
    }
    setActive(sc.scrollTop < 40 ? 'top' : cur)
  }, [])

  const scrollToTopic = useCallback(tid => {
    const sc = scrollRef.current
    if (!sc) return
    if (tid === 'top' || tid === 'saved') { sc.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const el = sectionRefs.current[tid]
    if (el) sc.scrollTo({ top: Math.max(0, el.offsetTop - 8), behavior: 'smooth' })
  }, [])

  const handleNavPick = useCallback(tid => {
    setActive(tid)
    scrollToTopic(tid)
  }, [scrollToTopic])

  const toggleSource = id => setEnabledSources(p => ({ ...p, [id]: p[id] === false }))
  const setAllSources = on => {
    const next = {}
    Object.keys(SOURCES).forEach(k => { next[k] = on })
    setEnabledSources(next)
  }

  const navTopics = [{ id: 'top', label: 'For You' }, ...TOPICS, { id: 'saved', label: 'Saved' }]

  // Body background matches theme
  useEffect(() => {
    document.body.style.background = T.bg
  }, [T.bg])

  // Saved articles view — flat list from savedData, ordered by savedIds
  const savedArticles = savedIds.map(id => savedData[id]).filter(Boolean)

  return (
    <div style={{
      width: '100%', maxWidth: 480, height: '100%',
      background: T.bg, position: 'relative',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 0 60px rgba(0,0,0,0.1)',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}
      >
        {/* Header scrolls away with content */}
        <TuningHeader
          T={T}
          dateStr={dateStr}
          articleCount={visibleFeed.length}
          onOpenSources={() => setSourcesOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Nav sticks once header scrolls off-screen */}
        <TopicNav
          T={T}
          topics={navTopics}
          affinity={affinity}
          active={active}
          onPick={handleNavPick}
          scrolled={scrolled}
          savedCount={savedIds.length}
        />

        {/* Saved articles view */}
        {active === 'saved' && (
          <div style={{ paddingBottom: 40 }}>
            {savedArticles.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', fontFamily: T.bodyFont, color: T.faint, fontSize: 14 }}>
                No saved articles yet. Tap the bookmark icon on any story.
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column',
                gap: T.card === 'soft' ? 12 : 0,
                padding: T.card === 'soft' ? '14px 14px' : (T.card === 'paper' ? '0 14px' : '0'),
                marginTop: T.card === 'soft' ? 0 : 8,
              }}>
                {savedArticles.map(a => (
                  <ArticleCard key={a.id} T={T} article={a}
                    rating={ratings[a.id] || 0}
                    saved={savedIds.includes(a.id)}
                    flagged={flaggedIds.has(a.id)}
                    onRate={v => handleRate(a, v, false)}
                    onSave={() => handleSave(a)}
                    onFlag={note => handleFlag(a, note)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main feed view */}
        {active !== 'saved' && (
          <>
            {loading && <LoadingState T={T} />}
            {error && !loading && (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: T.bodyFont, color: T.faint, fontSize: 14 }}>
                Could not load feed. Check back soon.
              </div>
            )}

            {!loading && (
              <div style={{ paddingBottom: 40 }}>
                {TOPICS.map(tp => {
                  const arts = visibleFeed.filter(a => a.topic === tp.id)
                  if (!arts.length) return null
                  return (
                    <section key={tp.id} ref={el => sectionRefs.current[tp.id] = el} style={{ marginTop: 6 }}>
                      <SectionHeader T={T} label={tp.label} />
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        gap: T.card === 'soft' ? 12 : 0,
                        padding: T.card === 'soft' ? '0 14px' : (T.card === 'paper' ? '0 14px' : '0'),
                      }}>
                        {arts.map(a => (
                          <ArticleCard key={a.id} T={T} article={a}
                            rating={ratings[a.id] || 0}
                            saved={savedIds.includes(a.id)}
                            flagged={flaggedIds.has(a.id)}
                            onRate={v => handleRate(a, v, false)}
                            onSave={() => handleSave(a)}
                            onFlag={note => handleFlag(a, note)}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}

                <RescueSection
                  T={T}
                  articles={rescueArticles}
                  ratings={ratings}
                  onRate={(article, v) => handleRate(article, v, true)}
                  onShuffle={refreshRescue}
                />

                <FeedFooter T={T} feedCount={visibleFeed.length} />
              </div>
            )}
          </>
        )}
      </div>

      <SourcesSheet T={T} open={sourcesOpen} enabled={enabledSources}
        onToggle={toggleSource} onAll={setAllSources} onClose={() => setSourcesOpen(false)} />
      <SettingsSheet T={T} open={settingsOpen} settings={settings} setSetting={setSetting} onClose={() => setSettingsOpen(false)} />
      <Toast T={T} toast={toast} />
    </div>
  )
}

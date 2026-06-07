import React, { useState, useEffect, useCallback } from 'react'
import { SOURCES, SOURCE_GROUPS } from '../data.js'

const TOPIC_OPTIONS = [
  { id: 'nz', label: 'New Zealand' },
  { id: 'world', label: 'World' },
  { id: 'politics', label: 'Politics' },
  { id: 'tech', label: 'Tech' },
  { id: 'business', label: 'Business' },
  { id: 'climate', label: 'Climate' },
  { id: 'sport', label: 'Sport' },
]

function Switch({ T, on, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle source" style={{
      width: 48, height: 29, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? T.accent : T.chipBg, position: 'relative',
      transition: 'background .22s', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 23, height: 23, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
        transition: 'left .22s cubic-bezier(.34,1.4,.64,1)',
      }} />
    </button>
  )
}

function SourceRow({ T, s, on, onToggle, onDelete }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 22px',
      opacity: on ? 1 : 0.55, transition: 'opacity .2s' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: s.tone, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.headlineFont, fontWeight: 700, fontSize: 15 }}>{s.name[0]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.bodyFont, fontSize: 16, fontWeight: 600, color: T.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: T.faint,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.domain || s.url}</div>
      </div>
      {onDelete ? (
        <button onClick={onDelete} aria-label="Remove source" style={{
          width: 28, height: 28, borderRadius: 999, border: `1px solid ${T.hairline}`,
          background: 'transparent', cursor: 'pointer', color: T.faint,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1,
        }}>×</button>
      ) : (
        <Switch T={T} on={on} onToggle={onToggle} />
      )}
    </div>
  )
}

function GroupLabel({ T, children }) {
  return (
    <div style={{ padding: '16px 22px 8px', display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{
        fontFamily: T.labelFont,
        fontSize: T.labelStyle === 'serif-italic' ? 14 : 11.5,
        color: T.sub, fontWeight: T.labelStyle === 'soft-caps' ? 700 : 500,
        textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
        letterSpacing: T.labelStyle === 'mono-caps' ? '0.1em' : '0.02em',
        fontStyle: T.labelStyle === 'serif-italic' ? 'italic' : 'normal',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  )
}

function AddSourceForm({ T, onAdded }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [topics, setTopics] = useState(['world'])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const toggleTopic = (id) => setTopics(prev =>
    prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id]
  )

  const submit = async () => {
    if (!name.trim() || !url.trim()) return setErr('Name and URL are required')
    setSaving(true); setErr(null)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), url: url.trim(), topics }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setName(''); setUrl(''); setTopics(['world'])
      onAdded(data.source)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    height: 42, borderRadius: T.radius > 10 ? 10 : 6,
    border: `1px solid ${T.hairline}`, background: T.bg,
    color: T.ink, fontFamily: T.bodyFont, fontSize: 15, padding: '0 12px',
    outline: 'none',
  }

  return (
    <div style={{ padding: '16px 22px 0' }}>
      <GroupLabel T={T}>Add a source</GroupLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Source name (e.g. Stuff)"
          style={inputStyle}
        />
        <input
          value={url} onChange={e => setUrl(e.target.value)}
          placeholder="RSS feed URL"
          style={inputStyle}
          type="url"
        />
        <div>
          <div style={{ fontFamily: T.labelFont, fontSize: 11.5, color: T.sub, marginBottom: 6,
            textTransform: T.labelStyle === 'mono-caps' ? 'uppercase' : 'none',
            letterSpacing: T.labelStyle === 'mono-caps' ? '0.08em' : 0 }}>Topics</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TOPIC_OPTIONS.map(tp => {
              const on = topics.includes(tp.id)
              return (
                <button key={tp.id} onClick={() => toggleTopic(tp.id)} style={{
                  height: 30, padding: '0 12px', borderRadius: 999,
                  border: `1px solid ${on ? T.accent : T.hairline}`,
                  background: on ? T.accent : 'transparent',
                  color: on ? '#fff' : T.sub,
                  fontFamily: T.bodyFont, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  transition: 'background .15s, color .15s',
                }}>{tp.label}</button>
              )
            })}
          </div>
        </div>
        {err && (
          <div style={{ fontFamily: T.bodyFont, fontSize: 13, color: '#c0392b' }}>{err}</div>
        )}
        <button onClick={submit} disabled={saving} style={{
          height: 42, borderRadius: T.radius > 10 ? 10 : 6,
          border: 'none', background: T.accent, color: '#fff',
          fontFamily: T.bodyFont, fontWeight: 600, fontSize: 15, cursor: 'pointer',
          opacity: saving ? 0.6 : 1, transition: 'opacity .2s',
        }}>{saving ? 'Adding…' : 'Add source'}</button>
      </div>
    </div>
  )
}

function ProfileEditor({ T }) {
  const [text, setText] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => { setText(d.content || ''); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const save = async () => {
    setSaving(true); setSaved(false)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return (
    <div style={{ padding: '16px 22px', fontFamily: T.bodyFont, fontSize: 14, color: T.faint }}>Loading…</div>
  )

  return (
    <div style={{ padding: '8px 22px 0' }}>
      <GroupLabel T={T}>Your interests</GroupLabel>
      <p style={{ margin: '0 0 10px', fontFamily: T.bodyFont, fontSize: 13, color: T.faint, lineHeight: 1.4 }}>
        Charlie uses this to score and rank articles for you.
      </p>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false) }}
        rows={8}
        style={{
          width: '100%', boxSizing: 'border-box',
          borderRadius: T.radius > 10 ? 10 : 6,
          border: `1px solid ${T.hairline}`, background: T.bg,
          color: T.ink, fontFamily: T.bodyFont, fontSize: 14,
          lineHeight: 1.5, padding: '10px 12px', resize: 'vertical',
          outline: 'none',
        }}
      />
      <button onClick={save} disabled={saving} style={{
        marginTop: 8, height: 42, width: '100%',
        borderRadius: T.radius > 10 ? 10 : 6,
        border: 'none',
        background: saved ? (T.dark ? '#1e4a2e' : '#e8f5ec') : T.accent,
        color: saved ? (T.dark ? '#5cb87a' : '#1a7a3a') : '#fff',
        fontFamily: T.bodyFont, fontWeight: 600, fontSize: 15, cursor: 'pointer',
        opacity: saving ? 0.6 : 1, transition: 'background .3s, color .3s',
      }}>
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save preferences'}
      </button>
    </div>
  )
}

export function SourcesSheet({ T, open, enabled, onToggle, onAll, onClose }) {
  const [customSources, setCustomSources] = useState([])

  useEffect(() => {
    if (!open) return
    fetch('/api/sources')
      .then(r => r.json())
      .then(d => setCustomSources(d.sources || []))
      .catch(() => {})
  }, [open])

  const handleDelete = useCallback(async (id) => {
    await fetch(`/api/sources/${id}`, { method: 'DELETE' })
    setCustomSources(prev => prev.filter(s => s.id !== id))
  }, [])

  const handleAdded = useCallback((source) => {
    setCustomSources(prev => [...prev.filter(s => s.id !== source.id), source])
  }, [])

  const allStaticIds = SOURCE_GROUPS.flatMap(g => g.ids)
  const onCount = allStaticIds.filter(id => enabled[id] !== false).length + customSources.length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 72, pointerEvents: open ? 'auto' : 'none',
      maxWidth: 480, margin: '0 auto' }}>
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
        <div style={{ padding: '8px 22px 14px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: T.headlineFont, fontWeight: T.headlineWeight,
              fontSize: 24, color: T.ink, letterSpacing: T.headlineTracking }}>Sources</h2>
            <p style={{ margin: '3px 0 0', fontFamily: T.bodyFont, fontSize: 13, color: T.faint }}>
              {onCount} source{onCount !== 1 ? 's' : ''} feeding your digest
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 16, fontWeight: 600, color: T.accent }}>Done</button>
        </div>

        <div style={{ overflow: 'auto', padding: '4px 0 32px' }}>
          {/* Static sources */}
          {SOURCE_GROUPS.map(g => (
            <div key={g.label}>
              <GroupLabel T={T}>{g.label}</GroupLabel>
              {g.ids.map(id => (
                <SourceRow key={id} T={T} s={SOURCES[id]} on={enabled[id] !== false}
                  onToggle={() => onToggle(id)} />
              ))}
            </div>
          ))}

          {/* Custom sources */}
          {customSources.length > 0 && (
            <div>
              <GroupLabel T={T}>Custom</GroupLabel>
              {customSources.map(s => (
                <SourceRow key={s.id} T={T}
                  s={{ name: s.name, url: s.url, tone: '#6b7280' }}
                  on={true}
                  onDelete={() => handleDelete(s.id)} />
              ))}
            </div>
          )}

          {/* Enable/mute all */}
          <div style={{ display: 'flex', gap: 10, padding: '18px 22px 0' }}>
            <button onClick={() => onAll(true)} style={{ flex: 1, height: 42, borderRadius: T.radius > 10 ? 12 : 6,
              border: `1px solid ${T.hairline}`, background: 'transparent', cursor: 'pointer',
              fontFamily: T.bodyFont, fontWeight: 600, fontSize: 14, color: T.ink }}>Enable all</button>
            <button onClick={() => onAll(false)} style={{ flex: 1, height: 42, borderRadius: T.radius > 10 ? 12 : 6,
              border: `1px solid ${T.hairline}`, background: 'transparent', cursor: 'pointer',
              fontFamily: T.bodyFont, fontWeight: 600, fontSize: 14, color: T.sub }}>Mute all</button>
          </div>

          {/* Add source form */}
          <AddSourceForm T={T} onAdded={handleAdded} />

          {/* Profile / interests editor */}
          <div style={{ marginTop: 16, borderTop: `1px solid ${T.hairline}`, paddingTop: 8 }}>
            <ProfileEditor T={T} />
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  )
}

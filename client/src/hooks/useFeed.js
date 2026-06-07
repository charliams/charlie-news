import { useState, useEffect, useRef, useCallback } from 'react'

function minsAgo(isoStr) {
  if (!isoStr) return 999
  return Math.max(0, Math.floor((Date.now() - new Date(isoStr)) / 60000))
}

function estimateRead(headline, summary) {
  const words = ((headline || '') + ' ' + (summary || '')).split(/\s+/).length
  return Math.max(2, Math.min(10, Math.round(words / 180) + 2))
}

function normaliseArticle(a) {
  return {
    ...a,
    source: a.sourceId,  // alias so existing components work
    mins: minsAgo(a.publishedAt),
    read: estimateRead(a.headline, a.summary),
  }
}

export function useFeed() {
  const [feedArticles, setFeedArticles] = useState([])
  const [rescueArticles, setRescueArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const pollRef = useRef(null)

  const loadFeed = useCallback(async () => {
    try {
      const [feedRes, rescueRes] = await Promise.all([
        fetch('/api/feed'),
        fetch('/api/rescue'),
      ])
      if (!feedRes.ok) throw new Error(`Feed: HTTP ${feedRes.status}`)
      const feedData = await feedRes.json()
      setFeedArticles((feedData.articles || []).map(normaliseArticle))
      setMeta(feedData.meta || null)
      setError(null)

      if (rescueRes.ok) {
        const rescueData = await rescueRes.json()
        setRescueArticles((rescueData.articles || []).map(normaliseArticle))
      }
    } catch (err) {
      console.warn('[useFeed] Load error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRescue = useCallback(async () => {
    try {
      const res = await fetch('/api/rescue')
      if (!res.ok) return
      const data = await res.json()
      setRescueArticles((data.articles || []).map(normaliseArticle))
    } catch {}
  }, [])

  useEffect(() => {
    loadFeed()
    // Re-poll every 30 minutes
    pollRef.current = setInterval(loadFeed, 30 * 60 * 1000)
    return () => clearInterval(pollRef.current)
  }, [loadFeed])

  const submitFeedback = useCallback(async (articleId, rating, isRescue = false) => {
    try {
      await fetch(`/api/feedback/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, isRescue }),
      })
      // If rescue thumbs-up: move article from rescue list to feed
      if (isRescue && rating === 1) {
        setRescueArticles(prev => prev.filter(a => a.id !== articleId))
        const promoted = rescueArticles.find(a => a.id === articleId)
        if (promoted) {
          setFeedArticles(prev => [{ ...promoted, score: 30 }, ...prev])
        }
      }
      // If rescue thumbs-down: just remove from rescue
      if (isRescue && rating === -1) {
        setRescueArticles(prev => prev.filter(a => a.id !== articleId))
      }
    } catch (err) {
      console.warn('[useFeed] Feedback error:', err.message)
    }
  }, [rescueArticles])

  return { feedArticles, rescueArticles, loading, error, meta, loadFeed, refreshRescue, submitFeedback }
}

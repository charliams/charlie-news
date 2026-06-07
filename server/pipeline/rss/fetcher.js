import { FEED_MAP } from './feeds.js'
import { parseRSSXML } from './parser.js'

async function fetchFeed({ url, sourceId, topics }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Charlie-News/1.0 (personal news digest)' },
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    const items = parseRSSXML(xml, sourceId, topics)
    console.log(`[RSS] ${sourceId} ${url.split('/').pop() || ''}: ${items.length} items`)
    return items
  } catch (err) {
    clearTimeout(timeout)
    console.warn(`[RSS] Failed ${url}: ${err.message}`)
    return []
  }
}

export async function fetchAllFeeds(extraFeeds = []) {
  const results = await Promise.all([...FEED_MAP, ...extraFeeds].map(fetchFeed))
  const all = results.flat()

  // Deduplicate by URL
  const seen = new Set()
  const deduped = all.filter(a => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })

  // Sort newest-first (nulls last)
  deduped.sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0
    if (!a.publishedAt) return 1
    if (!b.publishedAt) return -1
    return new Date(b.publishedAt) - new Date(a.publishedAt)
  })

  console.log(`[RSS] Total: ${deduped.length} unique articles across all feeds`)
  return deduped
}

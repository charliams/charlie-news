import { createHash } from 'crypto'

const TOPIC_KEYWORDS = {
  politics: ['parliament', 'minister', 'government', 'labour', 'national', 'coalition',
    'budget', 'policy', 'election', 'vote', 'party', 'senate', 'congress', 'prime minister'],
  business: ['economy', 'market', 'inflation', 'gdp', 'trade', 'bank', 'rate', 'shares',
    'profit', 'invest', 'stock', 'financial', 'economic', 'revenue', 'quarter'],
  climate: ['climate', 'emissions', 'carbon', 'environment', 'weather', 'flood', 'drought',
    'renewable', 'fossil', 'temperature', 'glacier', 'sea level', 'net zero'],
  tech: ['tech', 'ai', 'software', 'digital', 'cyber', 'data', 'startup', 'app', 'algorithm',
    'robot', 'chip', 'silicon', 'machine learning', 'artificial intelligence', 'cloud'],
  sport: ['sport', 'match', 'game', 'team', 'cup', 'league', 'rugby', 'cricket', 'football',
    'player', 'coach', 'tournament', 'championship', 'olympic'],
  nz: ['new zealand', 'nz', 'auckland', 'wellington', 'christchurch', 'māori', 'maori',
    'kiwi', 'dunedin', 'hamilton', 'tauranga', 'waikato', 'otago'],
  world: [],  // fallback
}

export function classifyTopic(title, desc, allowedTopics) {
  const text = `${title} ${desc}`.toLowerCase()
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (!allowedTopics.includes(topic)) continue
    if (keywords.some(kw => text.includes(kw))) return topic
  }
  return allowedTopics[0]
}

function getText(block, tag) {
  const r = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`,
    'i'
  )
  const m = r.exec(block)
  return m ? (m[1] ?? m[2] ?? '').trim() : ''
}

function decodeEntities(str) {
  return str
    // Named entities
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    // Numeric decimal entities (e.g. &#8216;)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    // Numeric hex entities (e.g. &#x2018;)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
}

function stripHtml(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function extractImage(block) {
  const media = /media:content[^/]*url="([^"]+)"/i.exec(block)
  if (media) return media[1]
  const enclosure = /enclosure[^>]*url="([^"]+)"/i.exec(block)
  if (enclosure) return enclosure[1]
  const img = /<img[^>]+src="([^"]+)"/i.exec(block)
  if (img) return img[1]
  return null
}

export function parseRSSXML(xml, sourceId, allowedTopics) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1]

    const title = stripHtml(getText(block, 'title'))
    const desc = getText(block, 'description') || getText(block, 'summary') || getText(block, 'content')
    const link = getText(block, 'link') || getText(block, 'guid')
    const pubDate = getText(block, 'pubDate') || getText(block, 'published') || getText(block, 'dc:date')
    const image = extractImage(block)

    if (!title || !link) continue

    // Skip BBC iPlayer — requires UK TV licence
    if (/bbc\.(co\.uk|com)\/iplayer/i.test(link)) continue

    const rawSummary = stripHtml(desc).slice(0, 500)
    const url = link.trim()

    let publishedAt = null
    try { publishedAt = pubDate ? new Date(pubDate).toISOString() : null } catch {}

    items.push({
      id: createHash('sha256').update(url).digest('hex').slice(0, 16),
      url,
      sourceId,
      topic: classifyTopic(title, rawSummary, allowedTopics),
      headline: title,
      rawSummary,
      imageUrl: image,
      publishedAt,
    })
  }

  return items
}

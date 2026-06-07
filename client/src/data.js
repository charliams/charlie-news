// Static config — sources and topics. Articles come from /api/feed.

export const SOURCES = {
  rnz:      { name: 'RNZ',          domain: 'rnz.co.nz',          tone: '#0a7d8c' },
  herald:   { name: 'NZ Herald',    domain: 'nzherald.co.nz',     tone: '#1f4b99' },
  newsroom: { name: 'Newsroom',     domain: 'newsroom.co.nz',     tone: '#c2362f' },
  guardian: { name: 'The Guardian', domain: 'theguardian.com',    tone: '#0a3d62' },
  bbc:      { name: 'BBC',          domain: 'bbc.com',            tone: '#1a1a1a' },
}

export const SOURCE_GROUPS = [
  { label: 'New Zealand', ids: ['rnz', 'herald', 'newsroom'] },
  { label: 'Global',      ids: ['guardian', 'bbc'] },
]

export const TOPICS = [
  { id: 'tech',     label: 'Tech' },
  { id: 'nz',       label: 'New Zealand' },
  { id: 'world',    label: 'World' },
  { id: 'politics', label: 'Politics' },
  { id: 'climate',  label: 'Climate' },
  { id: 'business', label: 'Business' },
  { id: 'sport',    label: 'Sport' },
]

export const FEED_MAP = [
  // Newsroom (NZ)
  { url: 'https://newsroom.co.nz/feed/', sourceId: 'newsroom', topics: ['nz', 'politics', 'business'] },

  // RNZ
  { url: 'https://www.rnz.co.nz/rss/news.xml', sourceId: 'rnz', topics: ['nz', 'world'] },
  { url: 'https://www.rnz.co.nz/rss/political.xml', sourceId: 'rnz', topics: ['politics', 'nz'] },

  // BBC
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', sourceId: 'bbc', topics: ['world'] },
  { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', sourceId: 'bbc', topics: ['tech'] },
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', sourceId: 'bbc', topics: ['business'] },
  { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', sourceId: 'bbc', topics: ['climate'] },
  { url: 'http://feeds.bbci.co.uk/sport/rss.xml', sourceId: 'bbc', topics: ['sport'] },

  // The Guardian
  { url: 'https://www.theguardian.com/world/rss', sourceId: 'guardian', topics: ['world'] },
  { url: 'https://www.theguardian.com/technology/rss', sourceId: 'guardian', topics: ['tech'] },
  { url: 'https://www.theguardian.com/business/rss', sourceId: 'guardian', topics: ['business'] },
  { url: 'https://www.theguardian.com/environment/rss', sourceId: 'guardian', topics: ['climate'] },
  { url: 'https://www.theguardian.com/politics/rss', sourceId: 'guardian', topics: ['politics'] },

  // NZ Herald
  { url: 'https://www.nzherald.co.nz/arc/outboundfeeds/rss/', sourceId: 'herald', topics: ['nz', 'business'] },
]

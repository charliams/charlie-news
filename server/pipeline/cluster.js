const STOPWORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'is', 'of', 'to', 'and', 'for',
  'as', 'by', 'with', 'that', 'this', 'it', 'its', 'new', 'zealand', 'nz',
  'says', 'say', 'said', 'after', 'over', 'amid', 'into', 'from', 'has',
  'have', 'been', 'was', 'were', 'are', 'but', 'not', 'be', 'had', 'his',
  'her', 'their', 'he', 'she', 'they', 'we', 'you', 'about', 'up', 'more',
  'out', 'what', 'than', 'now', 'how', 'will', 'can', 'could', 'would',
  'should', 'may', 'might', 'two', 'three', 'one', 'first', 'last',
])

export function clusterKey(headline) {
  if (!headline) return null
  const words = headline
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w))
    .sort()
    .slice(0, 5)

  return words.length >= 2 ? words.join('_') : null
}

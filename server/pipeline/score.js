import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10', 10)

export async function batchScore(articles, profileText) {
  if (!articles.length) return articles
  if (!profileText?.trim()) {
    console.warn('[Score] No profile text — assigning default score of 50')
    return articles.map(a => ({ ...a, score: 50 }))
  }

  const results = [...articles]
  const batches = []
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    batches.push(articles.slice(i, i + BATCH_SIZE))
  }

  for (const batch of batches) {
    const numbered = batch.map((a, i) =>
      `${i + 1}. Headline: ${a.headline}\nSummary: ${a.summary || a.rawSummary || '(none)'}`
    ).join('\n\n')

    const prompt = `My interest profile:
---
${profileText}
---

Rate each article 0-100 for how interesting it would be to me.
0 = completely irrelevant, 100 = highly relevant.
Consider topic, angle, depth, and whether it matches my stated interests.

Return a JSON array ONLY, no other text: [{"id": "1", "score": 75}, ...]

Articles:
${numbered}`

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].text.trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found in response')

      const parsed = JSON.parse(jsonMatch[0])
      parsed.forEach(({ id, score }) => {
        const idx = parseInt(id, 10) - 1
        const article = batch[idx]
        if (article && typeof score === 'number') {
          const i = results.findIndex(a => a.id === article.id)
          if (i >= 0) results[i] = { ...results[i], score: Math.round(Math.max(0, Math.min(100, score))) }
        }
      })
      console.log(`[Score] Scored batch of ${batch.length}`)
    } catch (err) {
      console.warn(`[Score] Batch failed: ${err.message}`)
      // Assign neutral score so articles aren't lost
      batch.forEach(a => {
        const i = results.findIndex(r => r.id === a.id)
        if (i >= 0 && results[i].score == null) {
          results[i] = { ...results[i], score: 40 }
        }
      })
    }
  }

  return results
}

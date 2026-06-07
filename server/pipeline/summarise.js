import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10', 10)

export async function batchSummarise(articles) {
  if (!articles.length) return articles

  const results = [...articles]
  const batches = []
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    batches.push(articles.slice(i, i + BATCH_SIZE))
  }

  for (const batch of batches) {
    const numbered = batch.map((a, i) =>
      `${i + 1}. Headline: ${a.headline}\nContent: ${a.rawSummary || '(no content available)'}`
    ).join('\n\n')

    const prompt = `For each article below, write a 2-3 sentence plain-English summary. Be factual and concise. Do not start with "This article" or repeat the headline.

Return a JSON array ONLY, no other text: [{"id": "1", "summary": "..."}, ...]

Articles:
${numbered}`

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].text.trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found in response')

      const parsed = JSON.parse(jsonMatch[0])
      parsed.forEach(({ id, summary }) => {
        const idx = parseInt(id, 10) - 1
        const article = batch[idx]
        if (article && summary) {
          const i = results.findIndex(a => a.id === article.id)
          if (i >= 0) results[i] = { ...results[i], summary }
        }
      })
      console.log(`[Summarise] Processed batch of ${batch.length}`)
    } catch (err) {
      console.warn(`[Summarise] Batch failed: ${err.message}`)
      // Fall back to rawSummary for this batch
      batch.forEach(a => {
        const i = results.findIndex(r => r.id === a.id)
        if (i >= 0 && !results[i].summary) {
          results[i] = { ...results[i], summary: a.rawSummary }
        }
      })
    }
  }

  return results
}

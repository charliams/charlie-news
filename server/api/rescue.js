import { Router } from 'express'
import { db } from '../db/client.js'

const router = Router()
const THRESHOLD = () => parseInt(process.env.SCORE_THRESHOLD || '30', 10)
const DAYS = () => parseInt(process.env.FEED_DAYS || '2', 10)

router.get('/', async (req, res) => {
  try {
    // Get 50 candidates from below-threshold pool, excluding clusters already in feed
    const { rows: candidates } = await db.query(`
      SELECT DISTINCT ON (COALESCE(cluster_key, id)) *
      FROM articles
      WHERE score < $1
        AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL
        AND summary IS NOT NULL
        AND (
          cluster_key IS NULL
          OR cluster_key NOT IN (
            SELECT cluster_key FROM articles
            WHERE score >= $1
              AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL
              AND cluster_key IS NOT NULL
          )
        )
      ORDER BY COALESCE(cluster_key, id), score DESC
      LIMIT 50
    `, [THRESHOLD(), DAYS()])

    // Shuffle and return 5
    const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 5)

    const articles = shuffled.map(a => ({
      id: a.id,
      url: a.url,
      sourceId: a.source_id,
      topic: a.topic,
      headline: a.headline,
      summary: a.summary,
      score: a.score,
      imageUrl: a.image_url,
      publishedAt: a.published_at,
      allSources: [a.source_id],
    }))

    res.json({ articles })
  } catch (err) {
    console.error('[API /rescue]', err)
    res.status(500).json({ error: err.message, articles: [] })
  }
})

export default router

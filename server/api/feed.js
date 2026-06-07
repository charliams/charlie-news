import { Router } from 'express'
import { db } from '../db/client.js'

const router = Router()

const THRESHOLD = () => parseInt(process.env.SCORE_THRESHOLD || '30', 10)
const DAYS = () => parseInt(process.env.FEED_DAYS || '2', 10)

router.get('/', async (req, res) => {
  try {
    // Pick the highest-scoring article per story cluster
    const { rows: articles } = await db.query(`
      SELECT DISTINCT ON (COALESCE(cluster_key, id)) *
      FROM articles
      WHERE score >= $1
        AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL
        AND summary IS NOT NULL
      ORDER BY COALESCE(cluster_key, id), score DESC
      LIMIT 20
    `, [THRESHOLD(), DAYS()])

    if (!articles.length) {
      return res.json({ articles: [], meta: { total: 0, threshold: THRESHOLD(), feedDays: DAYS(), fetchedAt: new Date().toISOString() } })
    }

    // For clustered articles, collect all source names
    const clusterKeys = articles.filter(a => a.cluster_key).map(a => a.cluster_key)
    let clusterSources = {}
    if (clusterKeys.length) {
      const { rows: sourceRows } = await db.query(`
        SELECT cluster_key, array_agg(DISTINCT source_id) as source_ids
        FROM articles
        WHERE cluster_key = ANY($1)
          AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL
        GROUP BY cluster_key
      `, [clusterKeys, DAYS()])
      sourceRows.forEach(r => { clusterSources[r.cluster_key] = r.source_ids })
    }

    const enriched = articles.map(a => ({
      id: a.id,
      url: a.url,
      sourceId: a.source_id,
      topic: a.topic,
      headline: a.headline,
      summary: a.summary,
      score: a.score,
      imageUrl: a.image_url,
      publishedAt: a.published_at,
      ingestedAt: a.ingested_at,
      allSources: a.cluster_key ? (clusterSources[a.cluster_key] || [a.source_id]) : [a.source_id],
    }))

    res.json({
      articles: enriched,
      meta: { total: enriched.length, threshold: THRESHOLD(), feedDays: DAYS(), fetchedAt: new Date().toISOString() },
    })
  } catch (err) {
    console.error('[API /feed]', err)
    res.status(500).json({ error: err.message, articles: [] })
  }
})

export default router

import { db } from '../db/client.js'
import { fetchAllFeeds } from './rss/fetcher.js'
import { clusterKey } from './cluster.js'
import { batchSummarise } from './summarise.js'
import { batchScore } from './score.js'

let isRunning = false

export async function runIngestion() {
  if (isRunning) {
    console.log('[Ingest] Already running — skipping')
    return { skipped: true }
  }
  isRunning = true

  // Create ingestion run record
  const { rows: [run] } = await db.query(
    `INSERT INTO ingestion_runs DEFAULT VALUES RETURNING id`
  )
  const runId = run.id
  console.log(`[Ingest] Starting run #${runId}`)

  try {
    // 1. Fetch all RSS feeds (static + custom sources from DB)
    const { rows: customRows } = await db.query('SELECT url, source_id, topics FROM custom_sources')
    const extraFeeds = customRows.map(r => ({ url: r.url, sourceId: r.source_id, topics: r.topics }))
    const rawArticles = await fetchAllFeeds(extraFeeds)

    // 2. Add cluster keys
    const withKeys = rawArticles.map(a => ({ ...a, cluster_key: clusterKey(a.headline) }))

    // 3. Filter out articles already in DB
    const urls = withKeys.map(a => a.url)
    const { rows: existing } = await db.query(
      'SELECT url FROM articles WHERE url = ANY($1)',
      [urls]
    )
    const existingUrls = new Set(existing.map(r => r.url))
    const newArticles = withKeys.filter(a => !existingUrls.has(a.url))

    console.log(`[Ingest] ${rawArticles.length} fetched, ${newArticles.length} new`)

    await db.query(
      `UPDATE ingestion_runs SET articles_fetched = $1, articles_new = $2 WHERE id = $3`,
      [rawArticles.length, newArticles.length, runId]
    )

    if (!newArticles.length) {
      await db.query(
        `UPDATE ingestion_runs SET finished_at = NOW(), status = 'success' WHERE id = $1`,
        [runId]
      )
      isRunning = false
      return { runId, fetched: rawArticles.length, new: 0, scored: 0 }
    }

    // 4. Insert new articles (without summary/score yet)
    for (const a of newArticles) {
      await db.query(`
        INSERT INTO articles (id, url, source_id, topic, headline, raw_summary, image_url, published_at, cluster_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (url) DO NOTHING
      `, [a.id, a.url, a.sourceId, a.topic, a.headline, a.rawSummary, a.imageUrl, a.publishedAt, a.cluster_key])
    }

    // 5. Get current profile
    const { rows: profileRows } = await db.query('SELECT content FROM profile WHERE id = 1')
    const profileText = profileRows[0]?.content || ''

    // 6. Summarise
    const summarised = await batchSummarise(newArticles)

    // 7. Score
    const scored = await batchScore(summarised, profileText)

    // 8. Update articles with summary + score
    let scoredCount = 0
    for (const a of scored) {
      if (a.summary != null || a.score != null) {
        await db.query(
          'UPDATE articles SET summary = $1, score = $2 WHERE id = $3',
          [a.summary, a.score, a.id]
        )
        scoredCount++
      }
    }

    // 9. Finalise run
    await db.query(`
      UPDATE ingestion_runs
      SET finished_at = NOW(), status = 'success', articles_scored = $1
      WHERE id = $2
    `, [scoredCount, runId])

    console.log(`[Ingest] Run #${runId} complete: ${newArticles.length} new, ${scoredCount} scored`)
    isRunning = false
    return { runId, fetched: rawArticles.length, new: newArticles.length, scored: scoredCount }

  } catch (err) {
    console.error(`[Ingest] Run #${runId} failed:`, err.message)
    await db.query(
      `UPDATE ingestion_runs SET finished_at = NOW(), status = 'error', error_message = $1 WHERE id = $2`,
      [err.message, runId]
    )
    isRunning = false
    throw err
  }
}

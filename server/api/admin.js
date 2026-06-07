import { Router } from 'express'
import { db } from '../db/client.js'
import { runIngestion } from '../pipeline/ingest.js'
import { updateProfile } from '../pipeline/update-profile.js'

const router = Router()

function checkToken(req, res) {
  const token = process.env.ADMIN_TOKEN
  if (token && req.headers['x-admin-token'] !== token) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

// GET /api/status — last run info + counts
router.get('/status', async (req, res) => {
  try {
    const { rows: [lastRun] } = await db.query(
      'SELECT * FROM ingestion_runs ORDER BY started_at DESC LIMIT 1'
    )
    const { rows: [counts] } = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE score IS NOT NULL) AS scored,
        COUNT(*) FILTER (WHERE score >= $1 AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL) AS in_feed,
        COUNT(*) FILTER (WHERE score < $1 AND ingested_at >= NOW() - ($2 || ' days')::INTERVAL AND score IS NOT NULL) AS in_rescue_pool,
        COUNT(*) AS total
      FROM articles
    `, [
      parseInt(process.env.SCORE_THRESHOLD || '30', 10),
      parseInt(process.env.FEED_DAYS || '2', 10),
    ])
    const { rows: [profile] } = await db.query('SELECT updated_at FROM profile WHERE id = 1')

    res.json({ lastRun, counts, profileUpdatedAt: profile?.updated_at })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/profile
router.get('/profile', async (req, res) => {
  try {
    const { rows: [row] } = await db.query('SELECT content, updated_at FROM profile WHERE id = 1')
    res.json({ content: row?.content || '', updatedAt: row?.updated_at })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ingest — manual trigger
router.post('/ingest', async (req, res) => {
  if (!checkToken(req, res)) return
  res.json({ started: true, message: 'Ingestion started — check /api/status for progress' })
  // Run after response is sent
  runIngestion().catch(err => console.error('[Admin] Ingest error:', err.message))
})

// PUT /api/profile — save profile text directly
router.put('/profile', async (req, res) => {
  const { content } = req.body
  if (typeof content !== 'string') return res.status(400).json({ error: 'content required' })
  try {
    await db.query(
      'UPDATE profile SET content = $1, updated_at = NOW() WHERE id = 1',
      [content.trim()]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/update-profile — manual trigger (AI rewrite from feedback)
router.post('/update-profile', async (req, res) => {
  if (!checkToken(req, res)) return
  try {
    const result = await updateProfile()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router

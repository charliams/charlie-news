import { Router } from 'express'
import { db } from '../db/client.js'

const router = Router()

const VALID_TOPICS = ['nz', 'world', 'politics', 'tech', 'business', 'climate', 'sport']

// GET /api/sources — all custom sources
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM custom_sources ORDER BY added_at ASC')
    res.json({ sources: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/sources — add a custom source
router.post('/', async (req, res) => {
  const { name, url, topics } = req.body
  if (!name || !url) return res.status(400).json({ error: 'name and url required' })

  // Validate URL
  try { new URL(url) } catch { return res.status(400).json({ error: 'invalid url' }) }

  const topicsArr = Array.isArray(topics) && topics.length
    ? topics.filter(t => VALID_TOPICS.includes(t))
    : ['world']
  if (!topicsArr.length) return res.status(400).json({ error: 'invalid topics' })

  // Generate a slug-style source_id
  const sourceId = 'custom_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 24)

  try {
    const { rows: [row] } = await db.query(
      `INSERT INTO custom_sources (name, url, source_id, topics)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (url) DO UPDATE SET name = EXCLUDED.name, topics = EXCLUDED.topics
       RETURNING *`,
      [name.trim(), url.trim(), sourceId, topicsArr]
    )
    res.json({ source: row })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/sources/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM custom_sources WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router

import { Router } from 'express'
import { db } from '../db/client.js'

const router = Router()

router.post('/', async (req, res) => {
  const { articleId, headline, note } = req.body
  if (!articleId || !note?.trim()) {
    return res.status(400).json({ error: 'articleId and note are required' })
  }
  try {
    const { rows: [flag] } = await db.query(
      `INSERT INTO article_flags (article_id, headline, note) VALUES ($1, $2, $3) RETURNING id`,
      [articleId, headline || null, note.trim()]
    )
    res.json({ ok: true, id: flag.id })
    // Fire-and-forget: trigger Claude pipeline review
    const webhookUrl = process.env.CLAUDE_FLAG_WEBHOOK_URL
    const routineToken = process.env.CLAUDE_ROUTINE_TOKEN
    if (webhookUrl && routineToken) fetch(webhookUrl, {
      method: 'POST',
      headers: { 'x-api-key': routineToken },
    }).catch(() => {})
  } catch (err) {
    console.error('[API /flags POST]', err)
    res.status(500).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, article_id, headline, note, resolved, created_at
       FROM article_flags
       WHERE resolved = false
       ORDER BY created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('[API /flags GET]', err)
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/resolve', async (req, res) => {
  try {
    await db.query(
      `UPDATE article_flags SET resolved = true WHERE id = $1`,
      [req.params.id]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('[API /flags PATCH]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router

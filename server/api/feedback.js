import { Router } from 'express'
import { db } from '../db/client.js'

const router = Router()
const THRESHOLD = () => parseInt(process.env.SCORE_THRESHOLD || '30', 10)

router.post('/:id', async (req, res) => {
  const { id } = req.params
  const { rating, isRescue = false } = req.body

  if (rating !== 1 && rating !== -1) {
    return res.status(400).json({ error: 'rating must be 1 or -1' })
  }

  try {
    // Upsert feedback (one rating per article)
    await db.query(`
      INSERT INTO feedback (article_id, rating, is_rescue)
      VALUES ($1, $2, $3)
      ON CONFLICT (article_id) DO UPDATE
        SET rating = EXCLUDED.rating, is_rescue = EXCLUDED.is_rescue, created_at = NOW()
    `, [id, rating, isRescue])

    // If rescued + liked: promote to feed threshold so it appears immediately
    if (isRescue && rating === 1) {
      await db.query(
        'UPDATE articles SET score = $1 WHERE id = $2 AND score < $1',
        [THRESHOLD(), id]
      )
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('[API /feedback]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router

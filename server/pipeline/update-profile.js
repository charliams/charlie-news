import Anthropic from '@anthropic-ai/sdk'
import { db } from '../db/client.js'

const client = new Anthropic()

export async function updateProfile() {
  // Fetch current profile
  const { rows: profileRows } = await db.query('SELECT content FROM profile WHERE id = 1')
  const currentProfile = profileRows[0]?.content || ''

  // Fetch last 7 days of feedback with article context
  const { rows: feedbackRows } = await db.query(`
    SELECT f.rating, f.is_rescue, a.headline, a.source_id
    FROM feedback f
    JOIN articles a ON a.id = f.article_id
    WHERE f.created_at >= NOW() - INTERVAL '7 days'
    ORDER BY f.created_at DESC
  `)

  if (!feedbackRows.length) {
    console.log('[Profile] No recent feedback — skipping update')
    return { updated: false, reason: 'No feedback in last 7 days' }
  }

  const liked = feedbackRows.filter(r => r.rating === 1 && !r.is_rescue)
  const disliked = feedbackRows.filter(r => r.rating === -1 && !r.is_rescue)
  const rescuedLiked = feedbackRows.filter(r => r.rating === 1 && r.is_rescue)
  const rescuedDisliked = feedbackRows.filter(r => r.rating === -1 && r.is_rescue)

  const fmt = rows => rows.length
    ? rows.map(r => `- "${r.headline}" (${r.source_id})`).join('\n')
    : '(none)'

  const prompt = `You are updating a reader's news preference profile based on recent feedback.

Current profile:
---
${currentProfile || '(no profile yet)'}
---

Recent feedback (last 7 days):

LIKED (main feed, thumbs up):
${fmt(liked)}

DISLIKED (main feed, thumbs down):
${fmt(disliked)}

RESCUED — model was wrong to filter these (reader rescued from filtered section):
${fmt(rescuedLiked)}

CONFIRMED FILTERED — model was right to filter (thumbs down in rescue section):
${fmt(rescuedDisliked)}

Rewrite the profile to reflect what you've learned. Keep it plain text, human-readable, 200-400 words. Be specific about topics, sources, angles, and depth preferences. If there is no feedback in a category, leave it unchanged or slightly refine based on the overall pattern.`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const newProfile = response.content[0].text.trim()
    await db.query(
      'UPDATE profile SET content = $1, updated_at = NOW() WHERE id = 1',
      [newProfile]
    )
    console.log('[Profile] Updated successfully')
    return { updated: true, newProfile }
  } catch (err) {
    console.error('[Profile] Update failed:', err.message)
    throw err
  }
}

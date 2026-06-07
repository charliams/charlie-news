import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import cron from 'node-cron'

import { initDb } from './db/client.js'
import feedRouter from './api/feed.js'
import rescueRouter from './api/rescue.js'
import feedbackRouter from './api/feedback.js'
import adminRouter from './api/admin.js'
import { runIngestion } from './pipeline/ingest.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// API routes
app.use('/api/feed', feedRouter)
app.use('/api/rescue', rescueRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api', adminRouter)

// Serve Vite build
const distDir = join(__dirname, '../dist')
app.use(express.static(distDir))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(distDir, 'index.html'))
})

async function start() {
  try {
    await initDb()
    app.listen(PORT, () => {
      console.log(`Charlie News running on :${PORT}`)
    })

    // Schedule ingestion at midnight NZ time (12:00 UTC)
    cron.schedule('0 12 * * *', () => {
      console.log('[Cron] Scheduled ingestion starting')
      runIngestion().catch(err => console.error('[Cron] Error:', err.message))
    })

    // Warm on startup — catches up if server was restarted
    console.log('[Startup] Running initial ingestion...')
    runIngestion().catch(err => console.warn('[Startup] Ingestion error:', err.message))
  } catch (err) {
    console.error('[Startup] Fatal error:', err)
    process.exit(1)
  }
}

start()

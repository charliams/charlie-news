import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const { Pool } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') || process.env.DATABASE_URL?.includes('amazonaws')
    ? { rejectUnauthorized: false }
    : false,
})

export async function initDb() {
  // Run schema migrations
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  await db.query(schema)
  console.log('[DB] Schema ready')

  // Seed profile from file if empty
  const { rows } = await db.query('SELECT content FROM profile WHERE id = 1')
  if (rows[0] && !rows[0].content.trim()) {
    try {
      const seedPath = join(__dirname, '../seed-profile.txt')
      const seed = readFileSync(seedPath, 'utf8').trim()
      await db.query('UPDATE profile SET content = $1, updated_at = NOW() WHERE id = 1', [seed])
      console.log('[DB] Seeded preference profile')
    } catch {
      console.log('[DB] No seed profile found — profile left empty')
    }
  }
}

CREATE TABLE IF NOT EXISTS articles (
  id           TEXT PRIMARY KEY,
  url          TEXT UNIQUE NOT NULL,
  source_id    TEXT NOT NULL,
  topic        TEXT NOT NULL,
  headline     TEXT NOT NULL,
  raw_summary  TEXT,
  summary      TEXT,
  score        INTEGER,
  image_url    TEXT,
  published_at TIMESTAMPTZ,
  ingested_at  TIMESTAMPTZ DEFAULT NOW(),
  cluster_key  TEXT
);

CREATE INDEX IF NOT EXISTS articles_ingested_at ON articles (ingested_at DESC);
CREATE INDEX IF NOT EXISTS articles_score ON articles (score DESC);
CREATE INDEX IF NOT EXISTS articles_cluster_key ON articles (cluster_key) WHERE cluster_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS feedback (
  id          SERIAL PRIMARY KEY,
  article_id  TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating IN (1, -1)),
  is_rescue   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (article_id)
);

CREATE TABLE IF NOT EXISTS profile (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id               SERIAL PRIMARY KEY,
  started_at       TIMESTAMPTZ DEFAULT NOW(),
  finished_at      TIMESTAMPTZ,
  articles_fetched INTEGER DEFAULT 0,
  articles_new     INTEGER DEFAULT 0,
  articles_scored  INTEGER DEFAULT 0,
  status           TEXT DEFAULT 'running',
  error_message    TEXT
);

INSERT INTO profile (id, content) VALUES (1, '') ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS article_flags (
  id          SERIAL PRIMARY KEY,
  article_id  TEXT NOT NULL,
  headline    TEXT,
  note        TEXT NOT NULL,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS custom_sources (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  url       TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL,
  topics    TEXT[] NOT NULL DEFAULT ARRAY['world']::TEXT[],
  added_at  TIMESTAMPTZ DEFAULT NOW()
);

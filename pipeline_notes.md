# Pipeline Notes

## 2026-06-19

### Flags reviewed

Routine run was unable to access the flags API. Two separate attempts failed:

- `curl https://notes.charliejmwilliams.com/api/flags` — blocked by the Claude Code remote environment's network allowlist (`notes.charliejmwilliams.com` is not in the egress allowlist).
- `WebFetch` fallback — reached the server but received HTTP 403 Forbidden.

**Action required from user:**

To allow future scheduled runs to fetch and resolve flags, one of the following must be configured:

1. **Add the host to the network allowlist** in the environment's egress settings so that `curl` (and other outbound connections) can reach `notes.charliejmwilliams.com`. See: https://code.claude.com/docs/en/claude-code-on-the-web
2. **Investigate the 403** — the `/api/flags` GET route in `server/api/flags.js` has no auth middleware, so the 403 likely comes from a reverse proxy (nginx/caddy) in front of the app that restricts `/api/` access to internal IPs only. If so, a proxy rule or API key header may need to be added.

No flags were reviewed, resolved, or changed. No code was modified.

---

## 2026-06-08

### Flags reviewed

| Flag ID | Headline | Category | Action |
|---------|----------|----------|--------|
| 1 | "Paramedics will soon be able to prescribe certain medicines" | Misconfigured feed URL | Fixed |

### Changes made

**RNZ general news feed URL corrected** (`server/pipeline/rss/feeds.js`)

- `https://www.rnz.co.nz/rss` returns an HTML page (a feed listing page), not RSS XML. The parser found no `<item>` elements so `rawSummary` was always empty.
- Fixed to: `https://www.rnz.co.nz/rss/news.xml`, which returns valid RSS 2.0 with CDATA-wrapped descriptions.
- The political feed (`rss/political.xml`) was already correct and unaffected.

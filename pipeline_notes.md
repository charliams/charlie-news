# Pipeline Notes

## 2026-06-16

### Flags reviewed

Routine could not run: `notes.charliejmwilliams.com` is not in the environment's network egress allowlist. Both direct `curl` and the WebFetch fallback failed (403). No `DATABASE_URL` is set in this container either, so the DB cannot be queried directly.

**Action required (user):** Add `notes.charliejmwilliams.com` to the network egress allowlist in your Code on the Web environment settings, or expose the `DATABASE_URL` as a session environment variable so the routine can query flags directly.

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

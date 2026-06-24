# Pipeline Notes

## 2026-06-24

### Routine run — blocked

Scheduled flag review could not complete. The remote execution environment's network policy blocks outbound HTTPS to `notes.charliejmwilliams.com` (proxy returns 403 on CONNECT). No flags were fetched, no changes were made.

**Action required:** The `notes.charliejmwilliams.com` domain needs to be added to the environment's network allowlist before this routine can run. See `/root/.ccr/README.md` for how to configure outbound policy, or update the environment's network policy in [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web).

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

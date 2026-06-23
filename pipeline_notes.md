# Pipeline Notes

## 2026-06-23

### Flags reviewed

Routine could not run — network blocked.

**Blocker:** The remote execution environment's egress policy does not allow outbound connections to `notes.charliejmwilliams.com`. Both `curl` and `WebFetch` were attempted; `curl` returned "Host not in allowlist" and `WebFetch` returned HTTP 403.

**Action required:** Add `notes.charliejmwilliams.com` to the network egress allowlist in the Claude Code on the web environment settings, then re-run this routine. See: https://code.claude.com/docs/en/claude-code-on-the-web

No flags were reviewed, resolved, or changed.

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

# Pipeline Notes

## 2026-06-20

### Routine run — flags API unreachable

The scheduled flag-review routine could not complete because `notes.charliejmwilliams.com` was inaccessible from the remote execution environment:

- `curl` → blocked by network egress policy ("Host not in allowlist: notes.charliejmwilliams.com")
- `WebFetch` → HTTP 403 Forbidden from the server

No flags were fetched, categorised, or resolved. No pipeline code was changed.

**Action required:** Add `notes.charliejmwilliams.com` to the network egress allowlist in the Claude Code on the web environment settings, or investigate why the server returns 403 to the WebFetch proxy IP. Once access is restored the routine will run normally on its next scheduled invocation.

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

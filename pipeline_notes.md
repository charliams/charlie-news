# Pipeline Notes

## 2026-06-22

### Flags reviewed

| Flag ID | Headline | Category | Action |
|---------|----------|----------|--------|
| — | — | Routine blocked | Could not reach `notes.charliejmwilliams.com` API |

### Changes made

**Routine could not run — network egress blocked**

- Bash `curl` rejected with "Host not in allowlist: notes.charliejmwilliams.com"
- WebFetch returned HTTP 403 (likely Cloudflare)
- No flags were fetched, reviewed, or resolved this run

**Action required:** Add `notes.charliejmwilliams.com` to the network egress allowlist in the remote execution environment settings at https://code.claude.com/docs/en/claude-code-on-the-web so the scheduled routine can reach the flags API.

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

# Pipeline Notes

## 2026-06-11

### Flag review — blocked: network access unavailable

**Question for user:** The remote execution environment's network policy does not permit outbound connections to `notes.charliejmwilliams.com`, so the flag review could not be completed. `curl https://notes.charliejmwilliams.com/api/flags` returns `Host not in allowlist`.

To fix this, add `notes.charliejmwilliams.com` to the allowed hosts in the environment's network policy (see https://code.claude.com/docs/en/claude-code-on-the-web for environment configuration). Once the host is allowlisted, re-run the flag review task.

No flags were reviewed and no changes were made this session.

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

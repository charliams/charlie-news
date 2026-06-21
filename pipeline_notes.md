# Pipeline Notes

## 2026-06-21

### Flags reviewed

Routine ran but **could not access the flags API**.

- `curl https://notes.charliejmwilliams.com/api/flags` — blocked by network egress policy (host not in allowlist for this Claude Code remote environment).
- `WebFetch` — reached the host but received HTTP 403 Forbidden on all paths, including `/`. This indicates platform-level authentication (e.g. Cloudflare Access or Railway private networking), not an application-level issue.
- No `ADMIN_TOKEN` or equivalent credential is present in the session environment.

**Action needed from user:** Add the required credential (e.g. a Cloudflare Access service token, or configure network egress to allow `notes.charliejmwilliams.com`) so that the scheduled routine can reach the flags API.

---

## 2026-06-08

### Flags reviewed

| Flag ID | Headline | Category | Action |
|---------|----------|----------|---------|
| 1 | "Paramedics will soon be able to prescribe certain medicines" | Misconfigured feed URL | Fixed |

### Changes made

**RNZ general news feed URL corrected** (`server/pipeline/rss/feeds.js`)

- `https://www.rnz.co.nz/rss` returns an HTML page (a feed listing page), not RSS XML. The parser found no `<item>` elements so `rawSummary` was always empty.
- Fixed to: `https://www.rnz.co.nz/rss/news.xml`, which returns valid RSS 2.0 with CDATA-wrapped descriptions.
- The political feed (`rss/political.xml`) was already correct and unaffected.

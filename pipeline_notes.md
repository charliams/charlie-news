# Pipeline Notes

## 2026-06-10

### Flags reviewed

_None reviewed — API not accessible from cloud environment (see blocker below)._

### Blocker: flags API returns 403 from Claude Code cloud environment

`GET https://notes.charliejmwilliams.com/api/flags` returns HTTP 403 Forbidden
when called from the Anthropic-hosted remote execution environment. The local
server code has no auth guard on that route, so the 403 is coming from a
reverse-proxy / hosting-layer allowlist (Railway, Cloudflare, etc.) that
blocks requests from cloud IPs.

**Current webhook payload** (`server/api/flags.js`): the webhook fires a
bare POST with only `x-api-key` and no body, so the routine can't receive
flag data even if it's triggered successfully.

**Recommended fix** — include the flag payload in the webhook body so the
routine doesn't need to call back to the API:

```js
if (webhookUrl && routineToken) fetch(webhookUrl, {
  method: 'POST',
  headers: { 'x-api-key': routineToken, 'Content-Type': 'application/json' },
  body: JSON.stringify({ flagId: flag.id, articleId, headline, note }),
}).catch(() => {})
```

Then update this task's instructions to read the flag from the incoming
webhook body rather than calling `GET /api/flags`.

**Alternative fix** — add the Claude Code environment's IP range to the
production allowlist (or expose the flags endpoint behind its own
`x-admin-token` check so it can be authenticated).

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

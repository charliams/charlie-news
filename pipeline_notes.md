# Pipeline Notes

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

---

## 2026-06-09

### Flags reviewed

_None reviewed — flags API unreachable from remote execution environment (see blocker below)._

### Blocker: flags API returns HTTP 403 from cloud environment

When this session was triggered by the webhook, all attempts to fetch `https://notes.charliejmwilliams.com/api/flags` failed:

- `curl` via bash: blocked at network level ("Host not in allowlist" — the Claude Code cloud sandbox restricts outbound TCP to an allowlist that does not include `notes.charliejmwilliams.com`)
- `WebFetch` tool: reached the server but received HTTP 403 Forbidden for **every** path on the domain (including `/`), which means the 403 comes from a reverse-proxy / CDN layer (likely Cloudflare Access), not from the Express app itself (the `GET /api/flags` route has no auth check)

**No flag data could be read, so no fixes were applied and no flags were resolved.**

### Action required from user

To unblock future webhook-triggered review sessions, one of the following must be configured:

1. **Cloudflare Access service token** (preferred if the site is behind Cloudflare Access): create a Service Token in the Cloudflare Access dashboard for `notes.charliejmwilliams.com`, then set the two resulting environment variables in this project's Claude Code environment:
   - `CF_ACCESS_CLIENT_ID=<client-id>`
   - `CF_ACCESS_CLIENT_SECRET=<client-secret>`
   Then update the flag-review script/prompt to pass `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers when calling the API.

2. **Allowlist the Claude Code cloud egress IPs** at the CDN/firewall level so requests from this environment reach the Express app directly.

3. **Pass flag data in the webhook payload**: modify `server/api/flags.js` to include the new flag's `id`, `headline`, and `note` in the POST body sent to `CLAUDE_FLAG_WEBHOOK_URL`. The session can then act on the triggering flag directly without needing to call back to the API.

Option 3 is the lightest change and avoids needing any credential plumbing in the cloud environment.

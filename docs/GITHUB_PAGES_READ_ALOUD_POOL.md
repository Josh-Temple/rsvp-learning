# GitHub Pages / Chrome Read Aloud pool

Date: 2026-10-08

RSVP Learning keeps Vercel unchanged and adds a GitHub Pages publishing path.

## Fixed URL pool

- Capacity: 100
- Public path: `/listen/chrome/001.html` ... `100.html`
- Public label: **Chromeで聴く**
- Registry: `listen/chrome/registry.json`
- Management CLI: `scripts/read-aloud-slots.mjs`

A saved page uses `pinned: true` and tags. Pinned pages are never selected for automatic replacement.

Ordinary replacement is fail-closed:
1. only `read_aloud_status=confirmed`
2. only `pinned=false`
3. oldest `last_replaced_at`, then `updated_at`, then id

Commands:

```bash
node scripts/read-aloud-slots.mjs confirm 001
node scripts/read-aloud-slots.mjs pin 001 --tags "保存,AI"
node scripts/read-aloud-slots.mjs next
node scripts/read-aloud-slots.mjs replace /path/to/payload.json
```

Replacement payload:

```json
{
  "title": "読み上げたいタイトル",
  "body": "十分な長さの本文...",
  "tags": ["AI", "research"],
  "pin": false
}
```

Public pages are public. Never put secrets, credentials, personal data, confidential work, or sensitive text into the pool.

## GitHub Pages

The source application remains Vercel-compatible. `scripts/build-github-pages.mjs` creates a Pages-only artifact and rewrites only the PWA root paths for the project subpath `/rsvp-learning/`.

The repository is currently private. GitHub Pages for private repositories requires GitHub Pro, Team, Enterprise Cloud, or Enterprise Server. On GitHub Free the repository would need to be public. Do not change repository visibility just to enable Pages.

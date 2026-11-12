# God Focus smart links

Branded acquisition links live under:

`https://godfocus.puzdev.com/go/`

No separate subdomain. No third-party shortener. Static HTML + JS on GitHub Pages.

## What `/go/` does

1. Looks up the source code (if any) in `go/links.json`.
2. Sends **every device** (iPhone, iPad, Android, desktop, Instagram in-app browser, unknown) to that link’s App Store destination.
3. God Focus is iOS-only, so `/go/` marketing links never fall back to the website homepage.
4. Emits a lightweight PostHog event `god_focus_short_link_click` (cookie-free beacon). Analytics failure never blocks redirect.

Default App Store URL: `https://apps.apple.com/app/id6791024734`

## Source codes

Public URLs use neutral codes only. Internal labels stay in `go/links.json` / this file.

| Public URL | Internal label | Channel | Notes |
|---|---|---|---|
| `/go/` | Root | direct | Main smart link |
| `/go/a1/` | Source A | personal | Personal / private source A |
| `/go/a2/` | Source B | personal | Personal / private source B |
| `/go/y1/` | YouTube | youtube | YouTube campaign |
| `/go/i1/` | Instagram | instagram | Instagram campaign |
| `/go/q1/` | QR 1 | qr | Print / offline QR |

Do **not** put personal names in public paths.

## How to add another code (≈1 minute)

1. Add an entry to `go/links.json` under `links`.
2. Copy `go/a1/` to `go/<code>/` (keep `index.html`).
3. Update the canonical URL in that `index.html` to `/go/<code>/`.
4. Commit and push to `main` (GitHub Pages).

Example `links.json` entry:

```json
"t1": {
  "label": "TikTok",
  "channel": "tiktok",
  "placement": "bio",
  "ios_destination": "https://apps.apple.com/app/id6791024734",
  "enabled": true,
  "is_qr": false
}
```

## How to change a destination

Edit `ios_destination` for that code in `go/links.json`.

All devices use that destination.

## Apple Campaign Links

Keep the public URL the same (`/go/a1/`, etc.).

Replace only `ios_destination` with the exact Apple Campaign Link (may include `pt`, `ct`, `mt`).

Current examples:

- `a1` → `ct=GF-A1`
- `a2` → `ct=GF-A2`

Do not invent new tokens.

## QR codes

QR Campaign 1 encodes the branded short URL (not the App Store):

`https://godfocus.puzdev.com/go/q1/`

Asset:

- `qr/god-focus-q1.png`
- `qr/god-focus-q1.svg`

Generate / regenerate locally (no third-party QR service):

```bash
node scripts/generate-qr.mjs
```

Or for a new code:

```bash
node scripts/generate-qr.mjs q2
```

## Invalid sources

Unknown paths like `/go/xyz/` are handled by the site `404.html`, which soft-redirects **only** `/go/…` misses to `/go/`.

Unrelated missing website URLs (for example `/does-not-exist/`) show a normal “Page not found” page with a link home — they are **not** treated as marketing redirects.

Known-but-disabled codes in `links.json` (`"enabled": false`) also send visitors to `/go/` when a `/go/<code>/` page loads `go.js`.

## Local testing

```bash
# from repo root
python3 -m http.server 8080
```

Open:

- http://localhost:8080/go/
- http://localhost:8080/go/a1/
- http://localhost:8080/go/q1/
- http://localhost:8080/go/xyz/  (should land on /go/ via 404.html when served by GitHub Pages; local python may show a raw 404 unless you use a Pages-like server)

Any UA (iPhone, Android, desktop, Instagram): expect the App Store / campaign destination.

To simulate analytics failure, temporarily break `POSTHOG_TOKEN` in `go/go.js` — redirect must still work.

## Deploy

Push to `main` on `puzzleknows/god-focus-website`. GitHub Pages publishes from `/` on that branch. Domain stays `godfocus.puzdev.com` (do not change `CNAME`).

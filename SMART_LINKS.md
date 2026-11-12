# God Focus Smart Links — Source of Truth

Canonical internal documentation for the God Focus branded smart-link and attribution system.

Repository: `puzzleknows/god-focus-website`  
Live site: `https://godfocus.puzdev.com`  
Registry: `go/links.json`  
Redirect logic: `go/go.js`

No separate subdomain. No Dub / Bitly / third-party shortener. Static HTML + JS on GitHub Pages.

---

## Brand identity

| Role | Value |
|---|---|
| Product | **God Focus** |
| Legal company | **Puzzle Tech Studios LLC** |
| Website | `https://godfocus.puzdev.com` |
| Support | `godfocus@puzdev.com` |

`puzdev.com` is only the domain namespace. Do **not** present PUZDEV as the God Focus product brand.

---

## Public smart links

### Main universal link

`https://godfocus.puzdev.com/go/`

Use when attribution does not matter.

### Source links

Public paths stay neutral. Do **not** put personal names in public URLs. Internal docs may describe who currently uses a source.

| Public URL | Internal purpose | Recommended usage |
|---|---|---|
| `https://godfocus.puzdev.com/go/` | Generic / unattributed | Generic link when attribution does not matter |
| `https://godfocus.puzdev.com/go/a1/` | Personal source A / primary personal sharing | Primary personal sharing |
| `https://godfocus.puzdev.com/go/a2/` | Personal source B / secondary personal sharing | Secondary personal sharing |
| `https://godfocus.puzdev.com/go/y1/` | YouTube | YouTube descriptions, pinned comments, channel/profile links |
| `https://godfocus.puzdev.com/go/i1/` | Instagram | Instagram bio, Stories, Reels |
| `https://godfocus.puzdev.com/go/q1/` | QR campaign 1 | Physical / digital QR placements |

Users should receive the branded `/go/.../` URLs, not long App Store campaign URLs.

---

## Current production routing

God Focus is currently **iOS-only**.

All **valid** `/go/` marketing links send **every device** (iPhone, iPad, Android, desktop, Instagram in-app browser, unknown) to that link’s App Store destination.

They do **not** fall back to the God Focus website homepage.

| Public link | Current iOS / App Store destination |
|---|---|
| `/go/` | `https://apps.apple.com/app/id6791024734` |
| `/go/a1/` | Apple Campaign Link `GF-A1` (see below) |
| `/go/a2/` | Apple Campaign Link `GF-A2` (see below) |
| `/go/y1/` | `https://apps.apple.com/app/id6791024734` |
| `/go/i1/` | `https://apps.apple.com/app/id6791024734` |
| `/go/q1/` | `https://apps.apple.com/app/id6791024734` |

`y1`, `i1`, and `q1` use the standard App Store ID URL until individual Apple Campaign Links are created for them.

### Invalid `/go/` paths

Unknown paths such as `/go/xyz/` are handled by site `404.html`, which soft-redirects **only** `/go/…` misses to `/go/` (then to the App Store).

Unrelated missing website URLs show a normal “Page not found” page with a link home. They are not marketing redirects.

### Future Android note (documentation only — not implemented)

When Android launches later, the intended model is:

- iOS → App Store (including per-source Apple Campaign Links where configured)
- Android → Google Play

Do not implement Android routing until that product ships.

---

## Apple Campaign Links

A1 and A2 already have real Apple Campaign Links in App Store Connect.

Keep public URLs unchanged. Only `ios_destination` in `go/links.json` holds the long Apple URL.

Do **not** expose these long Apple URLs publicly unless needed for debugging. Share branded `/go/.../` links instead.

### A1 — campaign `GF-A1`

- Public: `https://godfocus.puzdev.com/go/a1/`
- Apple destination: `https://apps.apple.com/app/apple-store/id6791024734?pt=128735731&ct=GF-A1&mt=8`
- Parameters: `pt=128735731`, `ct=GF-A1`, `mt=8`

### A2 — campaign `GF-A2`

- Public: `https://godfocus.puzdev.com/go/a2/`
- Apple destination: `https://apps.apple.com/app/apple-store/id6791024734?pt=128735731&ct=GF-A2&mt=8`
- Parameters: `pt=128735731`, `ct=GF-A2`, `mt=8`

To attach a campaign later for `y1` / `i1` / `q1` / a new code: create the campaign in App Store Connect, then replace only that source’s `ios_destination`. Do not invent `pt` / `ct` / `mt` values.

---

## Tracking

### Click analytics (our site)

Event: `god_focus_short_link_click`

Implementation: cookie-free `sendBeacon` / `fetch` to the God Focus PostHog project (public `phc_` project key). No PostHog JS SDK. Analytics failure never blocks redirect.

Attribution properties:

| Property | Meaning |
|---|---|
| `source_id` | Public code (`root`, `a1`, `a2`, `y1`, `i1`, `q1`, …) |
| `channel` | Internal channel (`direct`, `personal`, `youtube`, `instagram`, `qr`, …) |
| `placement` | Internal placement (`go_root`, `direct`, `video`, `bio`, `print`, …) |
| `is_qr` | Whether this source is a QR campaign |
| `destination` | Final redirect URL used for this click |
| `link_version` | Registry version from `go/links.json` |

Additional technical fields may also be sent (for example `valid_source`, `device_class`). They are not part of the marketing attribution contract above.

Do **not** collect names, emails, Firebase UIDs, God Focus account IDs, or Scripture / progress data on these links.

### App Store attribution (Apple)

Apple Campaign analytics can report App Store attribution such as first-time downloads and later conversion metrics when enough data exists.

Our PostHog event tracks **clicks**.  
Apple Campaign reports track **App Store attribution**.

Do not claim exact end-to-end attribution beyond what Apple reports.

---

## QR

### Current assets

- `qr/god-focus-q1.png`
- `qr/god-focus-q1.svg`

They encode exactly:

`https://godfocus.puzdev.com/go/q1/`

### Rule

QR codes must always encode the branded God Focus `/go/<code>/` URL.

Do **not** encode the direct App Store URL (or Apple Campaign URL) into a QR.

Reason: the destination in `go/links.json` can change later while printed / distributed QR codes remain valid.

### Generation

Generate locally (no third-party QR website):

```bash
# default: q1
node scripts/generate-qr.mjs

# future campaigns
node scripts/generate-qr.mjs q2
node scripts/generate-qr.mjs q3
```

Output:

- `qr/god-focus-<code>.png`
- `qr/god-focus-<code>.svg`

Also add / enable the matching `/go/<code>/` source in `go/links.json` before distributing the QR.

---

## Canonical source registry

File: `go/links.json`

Current internal mapping:

| Code | Label | Channel | Placement | QR | Destination type |
|---|---|---|---|---|---|
| `a1` | Source A | personal | direct | no | Apple Campaign `GF-A1` |
| `a2` | Source B | personal | direct | no | Apple Campaign `GF-A2` |
| `y1` | YouTube | youtube | video | no | Standard App Store ID URL |
| `i1` | Instagram | instagram | bio | no | Standard App Store ID URL |
| `q1` | QR 1 | qr | print | yes | Standard App Store ID URL |

Root `/go/` uses `defaults.ios_destination` (standard App Store ID URL).

---

## Rules for adding a new source

1. Choose a short **neutral** public code (no personal names).
2. Add it to `go/links.json` with internal `label`, `channel`, `placement`, `ios_destination`, `enabled`, `is_qr`.
3. Copy `go/a1/` → `go/<code>/` and update that page’s canonical URL.
4. Initially point `ios_destination` to `https://apps.apple.com/app/id6791024734`.
5. If the source is important, create an Apple Campaign Link in App Store Connect.
6. Replace **only** that source’s `ios_destination` with the exact Apple URL (`pt` / `ct` / `mt` from Apple — do not invent them).
7. If QR is needed, run `node scripts/generate-qr.mjs <code>` so the QR encodes `https://godfocus.puzdev.com/go/<code>/`.
8. Commit, push to `main`, and test the live redirect.
9. Update **this Source of Truth**.

Example registry entry:

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

---

## Local testing

```bash
# from repo root
python3 -m http.server 8080
```

Check:

- http://localhost:8080/go/
- http://localhost:8080/go/a1/
- http://localhost:8080/go/q1/
- http://localhost:8080/go/xyz/ (GitHub Pages serves `404.html` → `/go/`; plain `python3 -m http.server` may show a raw 404)

Any UA should resolve valid sources to the App Store / campaign destination.

To simulate analytics failure: temporarily break `POSTHOG_TOKEN` in `go/go.js` — redirect must still work. Do not leave that change in production.

---

## Deploy

Push to `main` on `puzzleknows/god-focus-website`.

GitHub Pages publishes from `/` on that branch.

Custom domain remains `godfocus.puzdev.com` (do not change `CNAME` for smart-link work).

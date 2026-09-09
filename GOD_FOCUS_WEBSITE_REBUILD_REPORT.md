# God Focus website rebuild report

Static GitHub Pages rebuild of the public site for the iOS app now called God Focus. No framework, build system, or iOS app repository changes.

## Files changed

- `index.html` — full homepage rewrite
- `privacy.html` — God Focus Privacy Policy rewrite
- `terms.html` — God Focus Terms of Use rewrite
- `support.html` — God Focus Support rewrite
- `styles.css` — shared God Focus design system
- `SETUP.txt` — factual current-repo notes
- `GOD_FOCUS_WEBSITE_REBUILD_REPORT.md` — this report

Paths preserved: `/`, `privacy.html`, `terms.html`, `support.html`.

## Major design changes

- Public brand is God Focus. Tagline: Scripture before social media.
- Palette: `#FAF8F2` background, `#FFFDF9` surfaces, `#25231F` text, `#716D65` secondary, `#C99B45` gold, sage, charcoal.
- Editorial Georgia serif for brand and headlines; Apple/system sans-serif for body, nav, and buttons.
- Shared header: God Focus, How It Works, Bible, Privacy, Support, Download.
- CSS-only mobile menu (checkbox + label). No JavaScript.
- Homepage sections: hero, editorial statement, Faith Pause sequence, Bible experience, 90 Days, privacy, no-account, final App Store CTA.
- Legal/support pages use the same navigation and quieter long-form layout.
- Support FAQs use native `<details>` accordions.

## Public old-brand references removed

Removed from public-facing copy, titles, nav, and footers:

- Unlock with Prayer
- Prayer Locks
- Every App Open
- Emergency Unlock
- Shortcuts / One Sec
- old “pray before every app open” marketing
- fixed public subscription prices
- claims that deleting the app cancels an Apple subscription

No public HTML/CSS file contains the phrase “Unlock with Prayer”.

## Old-brand infrastructure intentionally retained

- GitHub repository: `unlockwithprayer/unlockwithprayer.github.io`
- Current host: `https://unlockwithprayer.github.io/`
- Canonical App Store URL: `https://apps.apple.com/us/app/unlock-with-prayer-god-focus/id6791024734`

These were not renamed.

## Support email status

Official support email: `puzdevelop@gmail.com`

Public label and mailto subject are **God Focus Support**.

## All outbound links

- https://apps.apple.com/us/app/unlock-with-prayer-god-focus/id6791024734
- https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
- https://posthog.com/
- https://posthog.com/privacy
- https://superwall.com/legal/privacy-policy
- mailto:puzdevelop@gmail.com?subject=God%20Focus%20Support

Internal links are relative: `./`, `./#how-it-works`, `./#bible`, `privacy.html`, `terms.html`, `support.html`.

## Unresolved factual / legal issues

- The live App Store listing title is still “Unlock with Prayer - God Focus”. This site does not repeat that name.
- Superwall is disclosed at the verified level (paywall / subscription attributes). The previous policy’s specific Superwall field names were not restated unless still confirmed.
- Onboarding is described as “onboarding and setup state,” not the older demographic list.
- Custom background photo, Emergency Unlock, and “every app open” mode were removed because they are not in the current verified product facts.
- Subscription plans and any free trial are deferred to Apple / StoreKit at purchase time. The App Store page may still show specific prices; this site does not.
- Website Open Graph tags have no share image.
- Privacy/Terms dates are September 2026. They are not a legal review.

## Validation result

Checked locally:

- All four HTML pages and `styles.css` serve over a local static server.
- Navigation and footer links resolve on every page.
- Homepage anchors `#how-it-works` and `#bible` exist.
- App Store, Privacy, Terms, and Support links are present and not broken internally.
- No `<script>` tags, analytics pixels, cookies, or tracking on the website.
- No JavaScript, so no JS console errors from site code.
- Outbound App Store, Apple EULA, PostHog, and Superwall URLs returned HTTP 200 when fetched.

Chrome headless screenshots were checked at desktop (1280) and iPhone (390) widths. Desktop nav, hero, legal pages, and support FAQ layout rendered as intended. After deploy, confirm the CSS-only Menu control and mailto button on a real iPhone Safari window. GitHub Pages is not updated until these files are committed and pushed.

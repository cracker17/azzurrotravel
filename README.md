# Azzurro Travel — Multi-Page Website

An 11-page + 404 SEO-optimized static site.

## Build step

The pages load **minified** assets (`main.min.css`, `main.min.js`, `icons.min.js`).
The `.min.` files are generated — never hand-edit them. After changing anything in
`assets/css/` or `assets/js/`:

```bash
npm install   # first time only
npm run build
```

Then commit both the source and the regenerated `.min.` file.

## Performance notes (v3)

The v2 round of "optimizations" scored 75 on mobile with a **0.83 CLS**. Most of
that came from things that read as optimizations but were not:

- **The stylesheet is now render-blocking again.** It was loaded async via a
  `rel="preload"` + `onload` swap, which meant the page painted unstyled and then
  reflowed. The inlined "critical CSS" that was supposed to cover the gap
  targeted selectors (`.hh`, `.hh-tit`) that do not exist in the markup
  (`#hh`, `.hh-h1`), so it reserved no hero height at all. One 10 KB blocking
  stylesheet is far cheaper than the shift it was causing.
- **The hero video is no longer in the markup.** It is a 14 MB MP4 and it was
  loading with `preload="auto"` on every device, phones included. `main.js` now
  promotes `data-src` to `src` only after the `load` event, only on an idle main
  thread, only above 1024px, only on a fast unmetered connection, and only if the
  hero is still on screen. Everywhere else the hero still is the hero.
- **Viewport-height units are `svh`.** `100vh` re-measured when the mobile URL bar
  collapsed, resizing the hero mid-scroll.
- **Background images load lazily** via IntersectionObserver (500px vertical /
  600px horizontal margin), instead of all of them firing during init. Anything
  already on screen is fetched immediately, so above-the-fold heroes are unaffected.
- **One hero image, not four.** The preload, the CSS rule and the (removed) video
  poster used to request three or four different sizes of the same photograph.
  There is now one `<link rel=preload>` per breakpoint whose `media` queries mirror
  the `.hh-photo` rules exactly.
- **Every Unsplash URL was re-tuned** to `q=58` and a sensible width. They all sit
  behind gradient overlays, so they tolerate hard compression.
- **Four dead `wp-content` image URLs were removed** from the home page cards. The
  loader fetched each one, waited for the 404, then fell back — a wasted request
  and a visible delay per card. The working fallback is now the primary source.
- **Analytics waits for `load` then an idle slot** rather than a flat 3s timer.
- **The nav CTA pulse animates opacity on a pseudo-element** instead of animating
  `box-shadow`, which repainted the nav every frame for the life of the page.
- **Eyebrow text uses `--gold-txt` (#7d5612)** on light backgrounds. The brand gold
  `#c4923a` is about 2.6:1 on the off-white and cream sections, which fails WCAG AA.

Measured locally across all 11 pages after the change: **CLS 0.000** on both mobile
and desktop; home page **~918 KB on mobile** and **~3.3 MB on desktop**, down from
~15.9 MB on both.

### The hero video

`assets/video/Azzurro-Travel.mp4` was **14.4 MB** (1920×1080, 30fps, 2.7 Mbps,
plus a silent AAC track nobody could hear). It is now **3.2 MB** — 1280×720,
24fps, video-only, `+faststart`. All 42 seconds and all 14 destinations are
intact; nothing was trimmed.

The exact encode, if it ever needs redoing (the 14.4 MB master is recoverable
from git at commit `2f8b0a7`):

```bash
ffmpeg -i MASTER.mp4 -an -vf "hqdn3d=4:3:6:6,scale=1280:-2,fps=24" -c:v libx264 -crf 34 -preset veryslow -profile:v high -level 4.0 -pix_fmt yuv420p -movflags +faststart assets/video/Azzurro-Travel.mp4
```

The `hqdn3d` pass matters more than it looks: the footage is grainy, and denoising
before encoding is worth roughly a third of the file size on its own.

AV1 (`libsvtav1 -crf 50 -preset 4`) was tested and came out at 2.9 MB — only ~7%
better, because the reel hard-cuts to a new scene every ~3 seconds and every cut
forces a keyframe, which blunts AV1's temporal advantage. Not worth a second file
and a second `<source>`. The `<source type="video/webm">` that used to 404 on
every page load has been removed; re-add it only if a WebM file actually exists.

The deferral logic in `main.js` stays as-is even at 3.2 MB — it is still not a
reasonable thing to push at a phone on cellular for a decorative background.

## File Structure

```
azzurro/
├── index.html, services.html, production.html, lifestyle.html,
├── groups.html, about.html, contact.html, 404.html,
├── privacy.html, terms.html, accessibility.html, cookies.html
├── robots.txt, sitemap.xml
├── build.mjs, package.json
└── assets/
    ├── css/main.css → main.min.css
    ├── js/main.js → main.min.js, icons.js → icons.min.js
    ├── img/{favicon.png, og-image.jpg, partners/*.svg}
    └── video/Azzurro-Travel.mp4
```

## Shared elements (edit one, update all pages)

Three placeholders in each page body:
```html
<div id="site-nav"></div>
<div class="site-partners"></div>
<footer class="site-footer"></footer>
```
All filled at runtime by `assets/js/main.js`. To change nav, partner logos, or
footer text site-wide, edit only `main.js`. The partners and footer placeholders
have reserved heights in CSS so the page does not grow underneath a reader who has
already scrolled.

The cookie bar needs no placeholder — it is appended to `<body>` by
`buildConsent()` and is `position:fixed`, so it reserves nothing and shifts
nothing.

## Google Analytics

GA4 tag `G-X274SBTEZV` is **consent-gated first, deferred second**:
- Nothing is requested from Google until the visitor accepts analytics. The
  inline `<head>` block on every page sets Consent Mode v2 to `denied` and only
  exposes `window.azAnalyticsOn()`, which the consent banner calls on Accept.
- Once consent exists the tag still waits for the first user interaction
  (`scroll`, `mousemove`, `touchstart`, `keydown`, `click`), or for `load` then
  `requestIdleCallback` with a 4s timeout.
- Page view fires once the tag has loaded.
- Custom events: `generate_lead` (form submit), `page_not_found` (404 hits).

Trade-offs, both accepted deliberately: GA misses bounces that end before the
page goes idle with no interaction at all, and it misses every visitor who
refuses or ignores the banner. See below.

## Cookie consent

`buildConsent()` in `main.js` renders the bottom bar and the preferences panel;
`main.css` holds the `cc-` styles; `cookies.html` is the policy page. Between
them they implement GDPR + ePrivacy consent, applied to **every** visitor rather
than only to detected EU traffic:

- **Prior opt-in.** The GA4 tag is never fetched pre-consent, so there is no
  "blocked but already loaded" grey area. The gate lives in the `<head>` of each
  page because it has to run before any hit can be queued — that block is
  identical in all 12 pages, so patch them together.
- **Equal prominence.** Accept and Reject are the same size, weight and shape;
  the only difference is colour. Nothing is pre-ticked, and there is no cookie
  wall — every page behaves identically either way.
- **Silence is refusal.** Ignoring the bar, closing the panel, pressing Escape
  or clicking the backdrop all store nothing and leave analytics denied.
- **Withdrawal.** A "Cookie Settings" button sits in the footer of every page
  and on `cookies.html`; choosing Reject after an Accept also expires the `_ga`
  cookies rather than merely stopping new ones.
- **Storage.** One first-party cookie, `az_consent`, value
  `v1-analytics{0|1}-{epoch ms}`, `path=/`, `SameSite=Lax`, `Secure` on HTTPS,
  180 days (the CNIL's recommended re-ask interval).
- **Versioning.** Bump `CC_VERSION` in `main.js` whenever the cookie inventory
  changes. A stored answer carrying an older version is treated as undecided, so
  visitors are re-asked instead of being held to consent for a different set of
  cookies. Update the table in `cookies.html` and the version in its
  `.legal-meta` line at the same time.

Both the bar and the modal are `position:fixed`, so the feature adds 0.000 CLS.
The back-to-top button is hidden while the bar is up (`body.cc-open #stb`) —
offsetting it would need a JS-measured height that goes stale on resize.

## Contact form (Web3Forms)

Posts to `https://api.web3forms.com/submit` using the access key in `contact.html`.
Includes a honeypot, real success/error handling, and a GA4 `generate_lead` event on
confirmed submission.

## Contact info

- Phone: (800) 835-8234
- Email: hello@azzurrotravel.com
- Office: 578 Washington Blvd, Suite 421, Marina Del Rey, CA 90292
- Footer: © 2026 Azzurro Travel, Inc. All rights reserved. | WBE Certified | CST# 2094339-40

## Deployment

Static site. Run `npm run build`, then upload everything except `node_modules/`.

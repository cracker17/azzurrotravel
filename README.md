# Azzurro Travel — Multi-Page Website

A 10-page + 404 SEO-optimized static site.

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
and desktop; home page mobile weight **~918 KB** (down from ~15.9 MB).

### Still outstanding

`assets/video/Azzurro-Travel.mp4` is **14 MB**. Deferring it keeps it off the
critical path and off phones entirely, but desktop visitors who stay on the hero
still download it. It should be re-encoded — a 1280px, ~8s silent loop belongs
around 1.5–2.5 MB:

```bash
ffmpeg -i Azzurro-Travel.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 30 -preset slow -movflags +faststart Azzurro-Travel-web.mp4
```

A WebM/AV1 sibling would help further. Note the `<source type="video/webm">` that
used to 404 on every load has been removed; re-add it only once the file exists.

## File Structure

```
azzurro/
├── index.html, services.html, production.html, lifestyle.html,
├── groups.html, about.html, contact.html, 404.html,
├── privacy.html, terms.html, accessibility.html
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

## Google Analytics

GA4 tag `G-X274SBTEZV` is deferred:
- Loads on first user interaction (`scroll`, `mousemove`, `touchstart`, `keydown`, `click`)
- Otherwise on `load`, then `requestIdleCallback` with a 4s timeout
- Page view fires once the tag has loaded
- Custom events: `generate_lead` (form submit), `page_not_found` (404 hits)

Trade-off: GA misses bounces that end before the page goes idle and involve no
interaction at all.

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

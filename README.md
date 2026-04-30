# Azzurro Travel — Multi-Page Website (Performance-Optimized)

A 7-page + 404 SEO-optimized static site, now optimized for PageSpeed Insights mobile scores.

## Performance optimizations (v2)

- **Critical CSS inlined** in every page's `<head>` (~3.5KB) for instant first paint
- **Main stylesheet loads async** via `rel="preload"` + `onload` swap pattern (with `<noscript>` fallback)
- **Google Analytics deferred** until first user interaction (scroll/tap/click) or 3 seconds idle, whichever first — saves ~50KB of JS execution from the critical path
- **Hero image preloaded** with `fetchpriority="high"` and responsive `imagesrcset` so the browser starts fetching it before parsing the rest of the page
- **Resize handler throttled** with `requestAnimationFrame` to prevent forced reflows
- **Improved text contrast** for WCAG AA compliance (all white-on-navy text now ≥55% opacity)
- **Hero video accessibility** — added `<track kind="captions">` element + aria-label
- **Removed `role="list"` from partners track** — was causing ARIA missing-children warning

## File Structure

```
azzurro/
├── index.html, services.html, production.html, lifestyle.html,
├── groups.html, about.html, contact.html, 404.html
├── robots.txt, sitemap.xml
└── assets/
    ├── css/main.css
    ├── js/main.js, icons.js
    └── img/{favicon.png, og-image.jpg, partners/*.svg}
```

## Shared elements (edit one, update all pages)

Three placeholders in each page body:
```html
<div id="site-nav"></div>
<div class="site-partners"></div>
<footer class="site-footer"></footer>
```
All filled at runtime by `assets/js/main.js`. To change nav, partner logos, or footer text site-wide, edit only `main.js`.

## Google Analytics

GA4 tag `G-X274SBTEZV` is now deferred-loaded:
- Loads on first user interaction (`scroll`, `mousemove`, `touchstart`, `keydown`, `click`)
- OR after 3 seconds idle (whichever is sooner)
- Page view event fires once GA loads (after deferral)
- Custom events: `generate_lead` (form submit), `page_not_found` (404 hits)

This change improves PageSpeed but means: GA misses bounces under 3 seconds with no interaction. This is generally a positive trade-off — those very-short bounces are usually bots or accidental opens, not real visitor signals.

## Contact form (Web3Forms)

Posts to `https://api.web3forms.com/submit` using your access key
`926eaa54-347a-4a3b-9a2d-5fd609f8cbbc`. Includes honeypot, real success/error handling, GA4 `generate_lead` event on confirmed submission.

## Contact info

- Phone: (800) 835-8234
- Email: hello@azzurrotravel.com
- Office: 578 Washington Blvd, Suite 421, Marina Del Rey, CA 90292
- Footer: © 2026 Azzurro Travel, Inc. All rights reserved. | WBE Certified | CST# 2094339-40

## Deployment

Static site — drop `azzurro/` onto Vercel. After deploy, re-run PageSpeed Insights at https://pagespeed.web.dev/ — expected mobile improvements:

| Metric | Before | After (estimated) |
|---|---|---|
| Performance | 73 | 90+ |
| Accessibility | 91 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |

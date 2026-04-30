# Azzurro Travel — Multi-Page Website

A 7-page + 404 SEO-optimized static site with shared header/partners/footer JS for easy maintenance.

## File Structure

```
azzurro/
├── index.html, services.html, production.html, lifestyle.html,
├── groups.html, about.html, contact.html
├── 404.html                    # Custom error page (auto-served by Vercel)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/main.css
    ├── js/main.js, icons.js
    └── img/
        ├── favicon.png, og-image.jpg
        └── partners/wbenc.svg, aicp.svg, tzell.svg, virtuoso.svg
```

## Shared elements (edit one, update all pages)

Three placeholders in each page body:
```html
<div id="site-nav"></div>
<div class="site-partners"></div>
<footer class="site-footer"></footer>
```
All filled at runtime by `assets/js/main.js`. To change nav links, partner logos, or footer text site-wide, edit only `main.js` (`buildNav`, `buildPartners`, `buildFooter` functions).

## 404 page

`404.html` is automatically served by Vercel for any unmatched route, returning a proper HTTP 404 status (good for SEO — avoids "soft 404" flags from Google).

Features:
- Same dark navy/gold luxury design as the rest of the site
- Travel-themed messaging ("This Route Doesn't Exist on Our Map")
- Two CTAs: Return Home (gold) and Contact a Travel Consultant (ghost)
- Helpful internal links to all main service pages — recovers lost users and helps Google's crawler discover indexable URLs from the 404
- `noindex,follow` robots meta — tells Google not to index the 404 page itself but to still follow internal links
- GA4 event `page_not_found` fires automatically — filter in GA4 to find broken URLs people are hitting (catches stale backlinks, typos, etc.)
- NOT included in `sitemap.xml` (correct SEO practice)

## Partners marquee

- Pure-CSS animation (no JS animation loop) — zero PageSpeed cost
- Logos rendered white at 72% opacity; restore brand colors on hover
- Pauses on hover; mobile-responsive sizing; honors `prefers-reduced-motion`
- Logo sizes: 84px desktop / 68px tablet / 56px mobile (max-height)
- Edge fade gradient prevents visual clipping at viewport edges
- Add/remove partners by editing the `partners` array in `buildPartners()`

## Contact form (Web3Forms)

The contact form posts to `https://api.web3forms.com/submit` using your access key
`926eaa54-347a-4a3b-9a2d-5fd609f8cbbc`. Submissions land in the inbox you registered with Web3Forms.

Features:
- Honeypot field (`botcheck`) for spam blocking
- Hidden subject line includes the selected travel type for easy triage
- Real success/error/network handling — no fake confirmations
- GA4 `generate_lead` event fires on confirmed Web3Forms success only
- `dns-prefetch` for `api.web3forms.com` for faster first submit

## SEO per page

Unique title, description, OG image, canonical, JSON-LD schema, single H1.
Geo meta (Marina Del Rey), breadcrumb schema, semantic HTML throughout.

## PageSpeed

External CSS/JS (cached cross-page), `defer` on main.js, async GA tag,
preconnect/dns-prefetch hints, lazy image loading, system fonts only,
inlined SVG icon sprite.

## Google Analytics

GA4 tag `G-X274SBTEZV` installed in `<head>` of every page including 404.
Custom events:
- `generate_lead` — fires on confirmed contact form submission (with `travel_type` parameter)
- `page_not_found` — fires on every 404 hit (with referrer + URL — useful for finding stale backlinks)

## Contact info

- Phone: (800) 835-8234
- Email: hello@azzurrotravel.com
- Office: 578 Washington Blvd, Suite 421, Marina Del Rey, CA 90292
- Footer: © 2026 Azzurro Travel, Inc. All rights reserved. | WBE Certified | CST# 2094339-40

## Deployment

Static site — drop the `azzurro/` folder onto Vercel, Netlify, or any static host.

**Vercel-specific**: `404.html` is served automatically with proper HTTP 404 status for unmatched routes.

**Netlify-specific**: Same — `404.html` works automatically.

After deploy, submit `https://azzurrotravel.com/sitemap.xml` to Google Search Console.

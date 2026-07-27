/* ═════════════════════════════════════════════════════════════════════
   Azzurro Travel — Shared site behavior
   Renders global nav + footer, handles mobile menu, scroll, reveals,
   lazy image loading, contact form, responsive grids.

   SOURCE FILE. The pages load main.min.js, so after editing this file
   you must run:  npm run build
═════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Detect current page from <body data-page="..."> ────────────────────────
  var CURRENT_PAGE = (document.body && document.body.getAttribute('data-page')) || 'home';

  // ── Global Nav HTML ────────────────────────────────────────────────────────
  function buildNav() {
    var links = [
      { id: 'services',   href: 'services.html',   label: 'Services' },
      { id: 'production', href: 'production.html', label: 'Production' },
      { id: 'lifestyle',  href: 'lifestyle.html',  label: 'Lifestyle' },
      { id: 'groups',     href: 'groups.html',     label: 'Groups' },
      { id: 'about',      href: 'about.html',      label: 'About' },
      { id: 'contact',    href: 'contact.html',    label: 'Get in Touch', cta: true }
    ];

    var navLinksHtml = links.map(function (l) {
      var classes = [];
      if (l.cta) classes.push('n-cta');
      if (l.id === CURRENT_PAGE) classes.push('cur');
      var cls = classes.length ? ' class="' + classes.join(' ') + '"' : '';
      return '<li><a href="' + l.href + '" data-pg="' + l.id + '"' + cls + '>' + l.label + '</a></li>';
    }).join('');

    var mobLinksHtml = '<a href="index.html"' + (CURRENT_PAGE === 'home' ? ' class="cur"' : '') + '>Home</a>'
      + links.map(function (l) {
          var style = l.cta ? ' style="color:var(--glt)"' : '';
          var cur = l.id === CURRENT_PAGE ? ' class="cur"' : '';
          return '<a href="' + l.href + '"' + cur + style + '>' + l.label + '</a>';
        }).join('');

    var nav = '<nav id="nav" role="navigation" aria-label="Primary">'
      + '<a href="index.html" class="nav-logo" aria-label="Azzurro Travel — Home">'
      + '<img src="assets/img/Azzurro-Travel-Logo-White-2.svg?v=13"'
      + ' alt="Azzurro Travel — Luxury Production Travel Agency" class="logo-svg"'
      + ' width="330" height="46"'
      + ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"/>'
      + '<svg class="logo-svg" viewBox="0 0 210 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">'
      + '<text x="0" y="28" font-family="Georgia,serif" font-size="26" fill="white" letter-spacing="3">AZZURRO</text>'
      + '<line x1="0" y1="34" x2="208" y2="34" stroke="#c4923a" stroke-width="0.8" opacity="0.55"/>'
      + '<text x="1" y="44" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="rgba(255,255,255,0.58)" letter-spacing="7">TRAVEL</text>'
      + '</svg></a>'
      + '<ul class="nav-links" id="navLinks">' + navLinksHtml + '</ul>'
      + '<button class="ham" id="ham" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>'
      + '</nav>'
      + '<div class="mob-menu" id="mobMenu" aria-hidden="true">'
      + '<button class="mob-x" id="mobX" aria-label="Close menu">&#x2715;</button>'
      + mobLinksHtml
      + '</div>';

    var slot = document.getElementById('site-nav');
    if (slot) {
      slot.outerHTML = nav;
    } else {
      document.body.insertAdjacentHTML('afterbegin', nav);
    }
  }

  // ── Global Partners Marquee (above footer on every page) ───────────────────
  function buildPartners() {
    // Source list — easy to add/remove a partner: edit this array only.
    var partners = [
      { name: 'AICP — Association of Independent Commercial Producers',
        src: 'assets/img/partners/aicp.svg',
        href: 'https://www.aicp.com/' },
      { name: 'Tzell Travel Group',
        src: 'assets/img/partners/tzell.svg',
        href: 'https://www.tzell.com/' },
      { name: 'Virtuoso — Specialists in the Art of Travel',
        src: 'assets/img/partners/virtuoso.svg',
        href: 'https://www.virtuoso.com/' }
    ];

    function logoItem(p) {
      // rel=external/noopener for outbound links; loading=lazy for perf
      return '<a href="' + p.href + '" target="_blank" rel="noopener noreferrer external"'
           + ' class="partner-item" aria-label="' + p.name + '">'
           + '<img src="' + p.src + '" alt="' + p.name + '" loading="lazy" decoding="async"/>'
           + '</a>';
    }

    // Render the list TWICE inside the track for a seamless loop:
    // animation translates -50% so duplicate slides into view exactly where original started.
    var oneSet = partners.map(logoItem).join('');
    var html = '<aside class="partners" aria-label="Trusted partners and certifications">'
      + '<div class="partners-head">'
      + '<div class="ey">Azzurro Travel</div>'
      + '<h2 class="partners-title">Partnered with <em>Excellence</em></h2>'
      + '<hr class="partners-divider" aria-hidden="true"/>'
      + '</div>'
      + '<div class="partners-track-wrap">'
      + '<div class="partners-track">'
      + oneSet + oneSet  // duplicate for seamless infinite scroll
      + '</div></div>'
      + '</aside>';

    document.querySelectorAll('.site-partners').forEach(function (slot) {
      slot.outerHTML = html;
    });
  }


  function buildFooter() {
    var year = new Date().getFullYear();
    var ft = '<div class="ft-grid"><div>'
      + '<a href="index.html" aria-label="Azzurro Travel — Home" style="display:inline-block">'
      + '<img src="assets/img/Azzurro-Travel-Logo-White-2.svg?v=13"'
      + ' alt="Azzurro Travel — Luxury Travel Agency" style="height:34px;width:auto;display:block"'
      + ' width="244" height="34" loading="lazy"'
      + ' onerror="this.style.display=\'none\'" /></a>'
      + '<p class="ft-about">A premium concierge travel agency offering exceptional personalized service for production, business, group, and leisure travelers since 2008.</p>'
      + '<div class="ft-soc">'
      + '<a href="#" class="soc" aria-label="Azzurro Travel on Instagram"><svg aria-hidden="true"><use href="#i-ig"/></svg></a>'
      + '<a href="#" class="soc" aria-label="Azzurro Travel on LinkedIn"><svg aria-hidden="true"><use href="#i-li"/></svg></a>'
      + '<a href="#" class="soc" aria-label="Azzurro Travel on Facebook"><svg aria-hidden="true"><use href="#i-fb"/></svg></a>'
      + '</div></div>'
      + '<div><div class="fc-t">Services</div><ul class="fl-links">'
      + '<li><a href="production.html">Production Travel</a></li>'
      + '<li><a href="services.html">Business Travel</a></li>'
      + '<li><a href="lifestyle.html">Leisure Travel</a></li>'
      + '<li><a href="groups.html">Group Travel</a></li>'
      + '</ul></div>'
      + '<div><div class="fc-t">Company</div><ul class="fl-links">'
      + '<li><a href="about.html">About Us</a></li>'
      + '<li><a href="services.html">Why Azzurro</a></li>'
      + '<li><a href="contact.html">Contact</a></li>'
      + '</ul></div>'
      + '<div><div class="fc-t">Contact</div><ul class="fl-links">'
      + '<li><a href="tel:+18008358234">(800) 835-8234</a></li>'
      + '<li><a href="mailto:hello@azzurrotravel.com">hello@azzurrotravel.com</a></li>'
      + '<li style="color:rgba(255,255,255,.62);font-size:13px;line-height:1.6">578 Washington Blvd, Suite 421<br>Marina Del Rey, CA 90292</li>'
      + '</ul></div>'
      + '</div><div class="ft-bot">'
      + '<p class="ft-cp">&copy; ' + year + ' Azzurro Travel, Inc. All rights reserved. | WBE Certified | CST# 2094339-40</p>'
      + '<nav class="ft-leg" aria-label="Legal">'
      + '<a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="accessibility.html">Accessibility</a>'
      + '</nav></div>';

    document.querySelectorAll('.site-footer').forEach(function (f) { f.innerHTML = ft; });
  }

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  var rvio;
  function watchRv() {
    if (!('IntersectionObserver' in window)) {
      // fallback — just reveal everything
      document.querySelectorAll('.rv:not(.on)').forEach(function (el) { el.classList.add('on'); });
      return;
    }
    if (!rvio) {
      rvio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            rvio.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
    }
    document.querySelectorAll('.rv:not(.on)').forEach(function (el) { rvio.observe(el); });
  }

  // ── Lazy image background loader (with optional fallback URL) ──────────────
  // Previously every [data-bg] on the page was fetched during init, which meant
  // a dozen full-size photos competing with the hero for bandwidth before the
  // visitor had scrolled a pixel. Now each one waits until it is within 500px
  // of the viewport.
  var bgio;
  function fetchBg(el) {
    if (el._pld) return;
    el._pld = true;
    var fb = el.getAttribute('data-fb') || '';
    function applyBg(url) {
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = "url('" + url + "')";
        el.classList.add('in');
        // Several .card-ph heroes carry an inline `opacity:0`, which outranks
        // the .card-ph.in rule. Clear it explicitly or they stay invisible.
        if (el.style.opacity === '0') el.style.opacity = '1';
      };
      img.onerror = function () { if (url !== fb && fb) applyBg(fb); };
      img.src = url;
    }
    applyBg(el.getAttribute('data-bg'));
  }

  function loadPhotos() {
    var els = document.querySelectorAll('[data-bg]:not([data-bg=""])');
    if (!('IntersectionObserver' in window)) {
      els.forEach(fetchBg);
      return;
    }
    if (!bgio) {
      bgio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          bgio.unobserve(e.target);
          fetchBg(e.target);
        });
      // Horizontal margin matters for .gallery-reel, whose tiles sit off to the
      // right of the viewport until the reel is swiped.
      }, { rootMargin: '500px 600px' });
    }
    var vh = window.innerHeight || 800;
    els.forEach(function (el) {
      if (el._pld) return;
      // Anything already on screen (the .ph-bg page heroes, for instance) is
      // fetched straight away rather than waiting a frame for the observer.
      // This also covers tabs restored in the background, where the observer
      // never fires at all because the document is not being composited.
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > -vh) fetchBg(el);
      else bgio.observe(el);
    });
  }

  // ── Responsive grid fixes ──────────────────────────────────────────────────
  // Bail out unless the breakpoint bucket actually changed. Without this the
  // resize handler rewrote a dozen inline grid-template-columns values on every
  // frame, each one invalidating layout for the whole document.
  var gridBucket = null;
  function fixGrids() {
    var w = window.innerWidth;
    var bucket = w <= 768 ? 'sm' : w <= 1024 ? 'md' : 'lg';
    if (bucket === gridBucket) return;
    gridBucket = bucket;
    var sg = document.getElementById('homeSvcGrid');
    if (sg) sg.style.gridTemplateColumns = w <= 768 ? '1fr' : w <= 1024 ? '1fr 1fr' : '1fr 1fr 1fr';
    ['homeWhyGrid', 'svcWhyGrid', 'lifeGrid', 'grpGrid', 'aboutValGrid', 'aboutCertGrid'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.gridTemplateColumns = w <= 768 ? '1fr' : w <= 1024 ? '1fr 1fr' : 'repeat(3,1fr)';
    });
    document.querySelectorAll('.two-col').forEach(function (el) {
      el.style.gridTemplateColumns = w <= 1024 ? '1fr' : '1fr 1fr';
      el.style.gap = w <= 1024 ? '32px' : '64px';
    });
    var tg = document.getElementById('homeTesti');
    if (tg) tg.style.gridTemplateColumns = w <= 768 ? '1fr' : w <= 1024 ? '1fr 1fr' : 'repeat(3,1fr)';
  }

  // ── Nav scroll behavior + back-to-top ──────────────────────────────────────
  function bindScroll() {
    var nav = document.getElementById('nav');
    var stb = document.getElementById('stb');
    window.addEventListener('scroll', function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
      if (stb) stb.classList.toggle('on', window.scrollY > 340);
    }, { passive: true });
    if (stb) {
      stb.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ── Mobile menu ────────────────────────────────────────────────────────────
  function bindMobileMenu() {
    var ham = document.getElementById('ham');
    var mob = document.getElementById('mobMenu');
    var mobX = document.getElementById('mobX');
    if (!ham || !mob) return;
    function open() {
      mob.classList.add('open');
      mob.setAttribute('aria-hidden', 'false');
      ham.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      mob.classList.remove('open');
      mob.setAttribute('aria-hidden', 'true');
      ham.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    ham.addEventListener('click', open);
    if (mobX) mobX.addEventListener('click', close);
    // close on link click (handled via real navigation, but clean up state)
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  // ── Hero photo + video (home only) ─────────────────────────────────────────
  // The still (.hh-photo) is the hero. main.css picks a per-breakpoint Unsplash
  // URL that the <link rel=preload> tags in the page head have already started
  // fetching, so it paints as soon as the stylesheet applies — nothing here has
  // to run first.
  //
  // The MP4 is 14 MB, so it is treated as a pure enhancement: fetched only after
  // the load event, only once the main thread is idle, and only on a wide screen
  // with a fast, unmetered connection. Everyone else keeps the still, which is
  // what the gradient overlay was designed to sit on top of anyway.
  function bindHero() {
    var hp = document.getElementById('hhPhoto');
    if (hp) hp.classList.add('in');

    var hv = document.getElementById('hhVideo');
    if (!hv || hv.tagName !== 'VIDEO') return;
    var src = hv.getAttribute('data-src');
    if (!src) return;

    function wantsVideo() {
      // Called through window — some engines reject a detached matchMedia.
      var mm = window.matchMedia ? function (q) { return window.matchMedia(q); } : null;
      // Explicit "don't animate things at me" preference
      if (mm && mm('(prefers-reduced-motion: reduce)').matches) return false;
      // Phones and tablets keep the still. A 14 MB autoplay loop over cellular
      // is not a trade worth making for a decorative background.
      if (mm && !mm('(min-width: 1025px)').matches) return false;
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (c) {
        if (c.saveData) return false;
        if (/2g|slow-2g|3g/.test(c.effectiveType || '')) return false;
      }
      return true;
    }

    if (!wantsVideo()) {
      // Remove it outright so no request is ever made for the MP4.
      if (hv.parentNode) hv.parentNode.removeChild(hv);
      return;
    }

    function drop() {
      if (hv.parentNode) hv.parentNode.removeChild(hv);
      if (hp) hp.classList.remove('dim');
    }

    hv.addEventListener('playing', function () {
      hv.style.opacity = '1';
      // Real frames are painting now, so the still can fall back to a wash.
      if (hp) hp.classList.add('dim');
    }, { once: true });

    // Fires when the source 404s, the codec is unsupported, or the network dies.
    hv.addEventListener('error', drop);

    function play() {
      var p;
      try {
        hv.muted = true;   // belt and braces for the autoplay policy
        p = hv.play();
      } catch (err) { return; }
      if (p && typeof p.then === 'function') {
        p['catch'](function () {
          // Autoplay refused (iOS Low Power Mode and similar). Try again on the
          // first gesture; if that never comes, the still simply stays.
          window.addEventListener('touchstart', play, { once: true, passive: true });
          window.addEventListener('click', play, { once: true });
        });
      }
    }

    function start() {
      // If the visitor has already scrolled past the hero, there is nothing to
      // show — don't spend 14 MB of their bandwidth on it.
      var hero = document.getElementById('hh');
      if (hero && hero.getBoundingClientRect().bottom <= 0) {
        window.addEventListener('scroll', function once() {
          if (hero.getBoundingClientRect().bottom > 0) {
            window.removeEventListener('scroll', once);
            start();
          }
        }, { passive: true });
        return;
      }
      hv.src = src;
      play();
    }

    // Everything above the fold is done by 'load'; wait for an idle slot after
    // that so the download never competes with the rest of the page.
    function schedule() {
      if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 3000 });
      else setTimeout(start, 1500);
    }
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  }


  // ── Contact form — submits to Web3Forms (real backend) ─────────────────────
  function bindContactForm() {
    var form = document.getElementById('cForm');
    if (!form) return;

    var BTN_DEFAULT_HTML = '<svg width="13" height="13" aria-hidden="true"><use href="#i-send"/></svg>Send My Inquiry';

    function setBtn(btn, html, bg, disabled) {
      btn.innerHTML = html;
      btn.style.background = bg || '';
      btn.disabled = !!disabled;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('fsb');

      // Honeypot — silent ignore for bots
      var hp = document.getElementById('botcheck');
      if (hp && hp.checked) return;

      // Lightweight client-side validation
      var fn = (document.getElementById('fn') || {}).value || '';
      var em = (document.getElementById('em') || {}).value || '';
      var tt = (document.getElementById('tt') || {}).value || '';
      if (!fn.trim() || !em.trim() || !tt) {
        setBtn(btn, '<svg width="13" height="13" aria-hidden="true"><use href="#i-warn"/></svg> Fill required fields', '#c0392b', false);
        setTimeout(function () { setBtn(btn, BTN_DEFAULT_HTML, '', false); }, 2400);
        return;
      }

      // Loading state
      setBtn(btn, 'Sending…', '', true);

      // Add a friendly subject line that includes the travel type
      var subjectField = form.querySelector('input[name="subject"]');
      if (subjectField) {
        subjectField.value = 'New inquiry from azzurrotravel.com — ' + tt;
      }

      // POST to Web3Forms as JSON
      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
      .then(function (result) {
        if (result.ok && result.json && result.json.success) {
          // Success — fire GA event, show confirmation, reset form
          if (typeof gtag === 'function') {
            try { gtag('event', 'generate_lead', { method: 'contact_form', travel_type: tt }); } catch (gaErr) {}
          }
          setBtn(btn, '<svg width="13" height="13" aria-hidden="true"><use href="#i-check"/></svg> Sent! We\'ll be in touch soon.', '#27ae60', true);
          form.reset();
          setTimeout(function () { setBtn(btn, BTN_DEFAULT_HTML, '', false); }, 5000);
        } else {
          // API responded with an error
          var msg = (result.json && result.json.message) ? result.json.message : 'Submission failed. Please try again.';
          if (window.console) console.warn('Web3Forms error:', msg);
          setBtn(btn, '<svg width="13" height="13" aria-hidden="true"><use href="#i-warn"/></svg> Something went wrong — please retry', '#c0392b', false);
          setTimeout(function () { setBtn(btn, BTN_DEFAULT_HTML, '', false); }, 4200);
        }
      })
      .catch(function (err) {
        // Network error — show retry
        if (window.console) console.warn('Network error submitting form:', err);
        setBtn(btn, '<svg width="13" height="13" aria-hidden="true"><use href="#i-warn"/></svg> Connection issue — please retry', '#c0392b', false);
        setTimeout(function () { setBtn(btn, BTN_DEFAULT_HTML, '', false); }, 4200);
      });
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function init() {
    try {
      buildNav();
      buildPartners();
      buildFooter();
      bindScroll();
      bindMobileMenu();
      bindHero();
      bindContactForm();
      fixGrids();
      // Throttle resize calls — prevents forced layout reflows during continuous resize
      var rafId = null;
      window.addEventListener('resize', function () {
        if (rafId) return;
        rafId = requestAnimationFrame(function () {
          fixGrids();
          rafId = null;
        });
      }, { passive: true });
      loadPhotos();
      watchRv();
    } catch (err) {
      // Fallback: ensure content is visible
      document.querySelectorAll('.rv').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      if (window.console) console.warn('Azzurro Travel init error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

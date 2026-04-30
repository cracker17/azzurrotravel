/* ═════════════════════════════════════════════════════════════════════
   Azzurro Travel — Shared site behavior
   Renders global nav + footer, handles mobile menu, scroll, reveals,
   lazy image loading, contact form, responsive grids.
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
      + '<img src="https://azzurrotravel.com/wp-content/uploads/2025/10/Azzurro-Travel-Logo-White.svg"'
      + ' alt="Azzurro Travel — Luxury Production Travel Agency" class="logo-svg"'
      + ' width="210" height="46"'
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
      { name: 'WBENC — Women\'s Business Enterprise National Council',
        src: 'assets/img/partners/wbenc.svg',
        href: 'https://www.wbenc.org/' },
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
      + '<div class="partners-track" role="list">'
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
      + '<img src="https://azzurrotravel.com/wp-content/uploads/2025/10/Azzurro-Travel-Logo-White.svg"'
      + ' alt="Azzurro Travel — Luxury Travel Agency" style="height:34px;width:auto;display:block"'
      + ' width="210" height="34" loading="lazy"'
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
      + '<li style="color:rgba(255,255,255,.38);font-size:13px;line-height:1.6">578 Washington Blvd, Suite 421<br>Marina Del Rey, CA 90292</li>'
      + '</ul></div>'
      + '</div><div class="ft-bot">'
      + '<p class="ft-cp">&copy; ' + year + ' Azzurro Travel, Inc. All rights reserved. | WBE Certified | CST# 2094339-40</p>'
      + '<nav class="ft-leg" aria-label="Legal">'
      + '<a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a>'
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
  function loadPhotos() {
    document.querySelectorAll('[data-bg]').forEach(function (el) {
      if (el._pld) return;
      var src = el.getAttribute('data-bg');
      var fb = el.getAttribute('data-fb') || '';
      if (!src) return;
      function applyBg(url) {
        el.style.backgroundImage = "url('" + url + "')";
        var img = new Image();
        img.onload = function () { el.classList.add('in'); el._pld = true; };
        img.onerror = function () {
          if (url !== fb && fb) applyBg(fb); else el._pld = true;
        };
        img.src = url;
      }
      applyBg(src);
    });
    // Inline-styled url() heroes
    document.querySelectorAll('.card-ph[style*="url"]').forEach(function (el) {
      if (el._pld) return;
      var m = el.style.backgroundImage.match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (!m) return;
      var img = new Image();
      img.onload = function () { el.style.opacity = '1'; el._pld = true; };
      img.onerror = function () { el._pld = true; };
      img.src = m[1];
    });
  }

  // ── Responsive grid fixes ──────────────────────────────────────────────────
  function fixGrids() {
    var w = window.innerWidth;
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
  function bindHero() {
    var hp = document.getElementById('hhPhoto');
    if (hp) {
      var hi = new Image();
      hi.onload = function () { hp.classList.add('in'); };
      hi.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80';
    }
    var hv = document.getElementById('hhVideo');
    if (hv) {
      hv.addEventListener('canplay', function () {
        hv.style.opacity = '1';
        var ph = document.getElementById('hhPhoto');
        if (ph) ph.style.opacity = '0';
      });
      hv.load();
    }
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
      window.addEventListener('resize', fixGrids);
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

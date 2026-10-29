/* Pure Reflections – site behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid background once scrolled ---------- */
  var header = document.querySelector('[data-header]');
  var mobileBar = document.querySelector('[data-mobile-bar]');
  var contact = document.getElementById('contact');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (mobileBar) {
      var nearForm = false;
      if (contact) {
        var r = contact.getBoundingClientRect();
        nearForm = r.top < window.innerHeight * 0.6 && r.bottom > 0;
      }
      mobileBar.classList.toggle('is-shown', y > window.innerHeight * 0.5 && !nearForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-menu]');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    if (open) header.classList.add('is-scrolled'); else onScroll();
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-ring]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Services explorer (tabs + clickable house) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var panels = document.querySelectorAll('[data-panel]');
  var house = document.querySelector('[data-house]');

  function selectService(key, focusTab) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) {
        if (focusTab) t.focus();
        // keep the active chip visible in the horizontal scroller on phones
        var list = t.parentElement;
        if (list.scrollWidth > list.clientWidth) {
          list.scrollTo({ left: t.offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
    panels.forEach(function (p) {
      var on = p.getAttribute('data-panel') === key;
      if (on && p.hidden) {
        p.hidden = false;
        // restart the entrance animation
        p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
      } else if (!on) {
        p.hidden = true;
      }
    });
    if (house) {
      house.querySelectorAll('[data-part]').forEach(function (g) {
        g.classList.toggle('is-active', g.getAttribute('data-part') === key);
      });
      house.querySelectorAll('[data-pin]').forEach(function (g) {
        g.classList.toggle('is-active', g.getAttribute('data-pin') === key);
      });
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectService(tab.getAttribute('data-tab')); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectService(next.getAttribute('data-tab'), true); }
    });
  });

  if (house) {
    house.addEventListener('click', function (e) {
      var target = e.target.closest('[data-pin], [data-part]');
      if (!target) return;
      selectService(target.getAttribute('data-pin') || target.getAttribute('data-part'));
      // on phones, bring the details into view
      if (window.innerWidth < 1024) {
        var panel = document.querySelector('[data-panel]:not([hidden])');
        if (panel) {
          var top = panel.getBoundingClientRect().top;
          if (top > window.innerHeight * 0.75) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
      }
    });
  }
  if (tabs.length) selectService('windows');

  /* ---------- "Get a quote for…" buttons pre-select the service ---------- */
  var serviceSelect = document.getElementById('f-service');
  document.querySelectorAll('[data-quote]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!serviceSelect) return;
      var want = btn.getAttribute('data-quote');
      Array.prototype.forEach.call(serviceSelect.options, function (o) {
        if (o.text === want) serviceSelect.value = o.value || o.text;
      });
    });
  });

  /* ---------- Before / after sliders ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var input = ba.querySelector('input[type="range"]');
    function set(v) { ba.style.setProperty('--pos', v + '%'); }
    input.addEventListener('input', function () { set(input.value); });
    set(input.value);

    // let people drag from anywhere, with pointer capture, without fighting vertical scroll on touch
    var dragging = false;
    function fromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      input.value = Math.round(pct);
      set(pct);
    }
    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) {
      ba.addEventListener(ev, function () { dragging = false; });
    });

    // a small hint sweep the first time each slider comes into view
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var hinted = false;
      var obs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || hinted) return;
        hinted = true; obs.disconnect();
        var start = null, from = 50;
        function step(ts) {
          if (dragging) return;
          if (!start) start = ts;
          var t = (ts - start) / 1600;
          if (t >= 1) { set(50); input.value = 50; return; }
          var v = from + Math.sin(t * Math.PI * 2) * 16 * (1 - t);
          set(v);
          requestAnimationFrame(step);
        }
        setTimeout(function () { requestAnimationFrame(step); }, 500);
      }, { threshold: 0.6 });
      obs.observe(ba);
    }
  });

  /* ---------- Gallery lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-gallery] [data-full]'));
  var lb = document.querySelector('[data-lightbox]');
  if (lb && items.length) {
    var lbImg = lb.querySelector('[data-lb-img]');
    var lbCap = lb.querySelector('[data-lb-cap]');
    var closeBtn = lb.querySelector('[data-lb-close]');
    var current = 0;
    var lastFocus = null;

    function show(i) {
      current = (i + items.length) % items.length;
      var it = items[current];
      var thumb = it.querySelector('img');
      lbImg.style.opacity = '0';
      var img = new Image();
      img.onload = function () {
        lbImg.src = img.src;
        lbImg.alt = thumb ? thumb.alt : '';
        lbImg.style.opacity = '1';
      };
      img.src = it.getAttribute('data-full');
      lbCap.textContent = it.getAttribute('data-caption') + '  ·  ' + (current + 1) + ' / ' + items.length;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (it, i) { it.addEventListener('click', function () { open(i); }); });
    closeBtn.addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') {
        // keep focus inside the viewer
        var f = lb.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // swipe on touch screens
    var sx = null, sy = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      sx = sy = null;
    });
  }

  /* ---------- Quote form: inline validation + submit state ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length > 1; },
      phone: function (v) { return /^[0-9 +()\-]{7,}$/.test(v.trim()); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      service: function (v) { return v !== ''; }
    };
    function check(el) {
      var rule = rules[el.name];
      if (!rule) return true;
      var ok = rule(el.value);
      var field = el.closest('.field');
      field.classList.toggle('has-error', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      var err = field.querySelector('.err');
      if (err) el.setAttribute('aria-describedby', err.id);
      return ok;
    }
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) check(el); });
      el.addEventListener('change', function () { check(el); });
    });
    form.addEventListener('submit', function (e) {
      var firstBad = null;
      Object.keys(rules).forEach(function (name) {
        var el = form.elements[name];
        if (!check(el) && !firstBad) firstBad = el;
      });
      if (firstBad) { e.preventDefault(); firstBad.focus(); return; }
      var btn = form.querySelector('[data-submit]');
      btn.disabled = true;
      btn.classList.add('opacity-80');
      btn.querySelector('[data-label]').textContent = 'Sending…';
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();

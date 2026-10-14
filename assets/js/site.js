/* ==========================================================================
   Creative Inkers — prototype behaviour
   MOCKED: cart state is localStorage only. No server, no payment, no auth.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'ci_cart_v1';

  /* ---------- cart (MOCKED — localStorage) -------------------------------- */
  function readCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    paintCount(items);
  }
  function paintCount(items) {
    items = items || readCart();
    var n = items.length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }
  function addToCart(item) {
    var items = readCart();
    if (items.some(function (i) { return i.sku === item.sku; })) {
      toast('Already in your cart');
      return;
    }
    items.push(item);
    writeCart(items);
    toast('Added — ' + item.title);
  }

  /* ---------- toast ------------------------------------------------------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- delegated clicks -------------------------------------------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      addToCart({
        sku: add.getAttribute('data-sku') || add.getAttribute('data-add'),
        title: add.getAttribute('data-title') || 'Design',
        price: parseFloat(add.getAttribute('data-price') || '0')
      });
      return;
    }

    /* touch equivalent of the desktop hover crossfade */
    var peek = e.target.closest('[data-peek]');
    if (peek) {
      e.preventDefault();
      var art = peek.closest('.card-art');
      if (art) {
        var on = art.classList.toggle('show-printed');
        peek.textContent = on ? 'See the file' : 'See it printed';
        peek.setAttribute('aria-pressed', String(on));
      }
      return;
    }

    /* product preview tabs */
    var tab = e.target.closest('[data-view]');
    if (tab) {
      e.preventDefault();
      var name = tab.getAttribute('data-view');
      var scope = tab.closest('[data-viewer]') || document;
      scope.querySelectorAll('[data-view]').forEach(function (t) {
        var active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      scope.querySelectorAll('[data-pane]').forEach(function (p) {
        p.hidden = p.getAttribute('data-pane') !== name;
      });
      var readout = scope.querySelector('[data-view-readout]');
      if (readout) readout.textContent = 'VIEW: ' + name.toUpperCase().replace(/-/g, '_');
      return;
    }

    /* filter + sort chips */
    var chip = e.target.closest('[data-chip]');
    if (chip) {
      e.preventDefault();
      var pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!pressed));
      return;
    }

    /* removable active-filter tags */
    var drop = e.target.closest('[data-drop-filter]');
    if (drop) {
      e.preventDefault();
      drop.remove();
      return;
    }

    /* mobile nav */
    var mt = e.target.closest('[data-menu-toggle]');
    if (mt) {
      e.preventDefault();
      var panel = document.getElementById('mobile-nav');
      if (panel) {
        var open = panel.hasAttribute('hidden');
        if (open) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); }
        mt.setAttribute('aria-expanded', String(open));
      }
      return;
    }

    /* click-to-inspect zoom on the flat-file pane */
    var zoomPane = e.target.closest('.pane-flat');
    if (zoomPane && !e.target.closest('a,button')) {
      zoomPane.classList.toggle('zoomed');
      return;
    }

    /* demo-safe CTAs: toast, never touch the label */
    var demo = e.target.closest('[data-demo]');
    if (demo) {
      e.preventDefault();
      toast(demo.getAttribute('data-demo') || 'Prototype — not connected');
      return;
    }

    /* checkout: remove a line item and recalc totals from the remaining rows */
    var rm = e.target.closest('[data-remove-row]');
    if (rm) {
      e.preventDefault();
      var row = rm.closest('.cart-row');
      var sku = row.getAttribute('data-sku');
      if (sku) {
        writeCart(readCart().filter(function (i) { return i.sku !== sku; }));
      }
      var nextFocus = row.nextElementSibling && row.nextElementSibling.querySelector &&
                      row.nextElementSibling.querySelector('[data-remove-row]');
      row.remove();
      recalcCheckout();
      var target = nextFocus || document.querySelector('[data-remove-row]') || document.querySelector('[data-paybtn]');
      if (target) target.focus();
      var live = document.querySelector('[data-cart-announce]');
      if (live) {
        var n = document.querySelectorAll('[data-cart-list] .cart-row').length;
        live.textContent = 'Item removed. ' + n + ' item' + (n === 1 ? '' : 's') + ' remaining.';
      }
      return;
    }

    /* coupon reveal: swap to input, keep focus */
    var cp = e.target.closest('[data-coupon]');
    if (cp) {
      e.preventDefault();
      var inp = document.createElement('input');
      inp.className = 'input';
      inp.placeholder = 'Coupon code';
      inp.setAttribute('aria-label', 'Coupon code');
      cp.replaceWith(inp);
      inp.focus();
      return;
    }

    /* cookie bar */
    var ck = e.target.closest('[data-cookie]');
    if (ck) {
      e.preventDefault();
      try { localStorage.setItem('ci_cookie', ck.getAttribute('data-cookie')); } catch (err) {}
      var bar = document.getElementById('cookiebar');
      if (bar) bar.setAttribute('hidden', '');
      document.body.classList.remove('cookie-open');
      document.body.style.removeProperty('--cookie-h');
      return;
    }
  });

  /* ---------- cookie bar: show only if undecided --------------------------- */
  function initCookie() {
    var bar = document.getElementById('cookiebar');
    if (!bar) return;
    var decided = null;
    try { decided = localStorage.getItem('ci_cookie'); } catch (e) {}
    if (!decided) {
      bar.removeAttribute('hidden');
      document.body.classList.add('cookie-open');
      var setH = function () {
        document.body.style.setProperty('--cookie-h', bar.offsetHeight + 'px');
      };
      setH();
      window.addEventListener('resize', setH);
    }
  }

  /* ---------- bundle counter (bundles page) -------------------------------- */
  function initBundleMath() {
    var out = document.querySelector('[data-bundle-total]');
    if (!out) return;
    var boxes = document.querySelectorAll('[data-bundle-item]');
    function recalc() {
      var chosen = [].filter.call(boxes, function (b) { return b.checked; });
      var n = chosen.length;
      var single = chosen.reduce(function (s, b) { return s + parseFloat(b.getAttribute('data-price')); }, 0);
      var bundle = n >= 5 ? 15 : single;
      out.textContent = n + ' selected — ' + (n >= 5 ? '$15.00 as a bundle' : '$' + single.toFixed(2));
      var save = document.querySelector('[data-bundle-save]');
      if (save) {
        save.textContent = n >= 5
          ? 'You save $' + (single - bundle).toFixed(2)
          : 'Pick ' + (5 - n) + ' more for the $15 bundle price';
      }
    }
    boxes.forEach(function (b) { b.addEventListener('change', recalc); });
    recalc();
  }

  /* ---------- checkout totals from whatever rows remain -------------------- */
  function recalcCheckout() {
    var rows = document.querySelectorAll('[data-cart-list] .cart-row');
    var subtotal = 0;
    rows.forEach(function (r) {
      var p = r.querySelector('.price');
      if (p) subtotal += parseFloat(p.textContent.replace('$', '')) || 0;
    });
    document.querySelectorAll('[data-subtotal]').forEach(function (el) {
      el.textContent = '$' + subtotal.toFixed(2);
    });
    document.querySelectorAll('[data-paybtn]').forEach(function (el) {
      el.textContent = subtotal > 0 ? 'Pay $' + subtotal.toFixed(2) + ' and download' : 'Cart is empty';
      el.disabled = subtotal <= 0;
      el.style.opacity = subtotal > 0 ? '' : '.45';
    });
    var count = document.querySelector('[data-cart-items-label]');
    if (count) count.textContent = 'YOUR FILES · ' + rows.length + ' ITEM' + (rows.length === 1 ? '' : 'S');
    var list = document.querySelector('[data-cart-list]');
    if (list && !rows.length) {
      list.innerHTML = '<p style="color:var(--dim);padding:16px 0">Your cart is empty. <a href="category.html">Browse designs</a>.</p>';
    }
  }

  /* ---------- checkout summary reads the mocked cart ----------------------- */
  function initCheckout() {
    var list = document.querySelector('[data-cart-list]');
    if (!list) return;
    var items = readCart();
    if (!items.length) return; /* leave the authored sample rows in place */
    list.innerHTML = '';
    var subtotal = 0;
    items.forEach(function (i) {
      subtotal += i.price;
      var row = document.createElement('div');
      row.className = 'cart-row';
      row.setAttribute('data-sku', i.sku);
      row.innerHTML =
        '<div class="cart-thumb alpha alpha-sm"></div>' +
        '<div><div class="cart-name">' + escapeHtml(i.title) + '</div>' +
        '<div class="mono">PNG · 300 DPI · COMMERCIAL</div></div>' +
        '<div class="price">$' + i.price.toFixed(2) + '</div>' +
        '<button class="sq" type="button" data-remove-row aria-label="Remove ' + escapeHtml(i.title) + '">✕</button>';
      list.appendChild(row);
    });
    document.querySelectorAll('[data-subtotal]').forEach(function (el) {
      el.textContent = '$' + subtotal.toFixed(2);
    });
    document.querySelectorAll('[data-paybtn]').forEach(function (el) {
      el.textContent = 'Pay $' + subtotal.toFixed(2) + ' and download';
    });
    var count = document.querySelector('[data-cart-items-label]');
    if (count) count.textContent = 'YOUR FILES · ' + items.length + ' ITEM' + (items.length === 1 ? '' : 'S');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- forms are inert in the prototype ----------------------------- */
  function initInertForms() {
    document.querySelectorAll('form[data-inert]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var pay = f.querySelector('[data-paybtn]');
        if (pay && !pay.disabled) {
          /* the real submit pattern: disable + progress, then the honest outcome */
          var label = pay.textContent;
          pay.disabled = true;
          pay.textContent = 'Processing…';
          setTimeout(function () {
            pay.disabled = false;
            pay.textContent = label;
            toast(f.getAttribute('data-inert-msg') || 'Prototype — not connected');
          }, 700);
          return;
        }
        toast(f.getAttribute('data-inert-msg') || 'Prototype — not connected');
      });
    });
  }

  /* ---------- viewer tabs: arrow-key navigation ---------------------------- */
  function initTablists() {
    document.querySelectorAll('[role="tablist"]').forEach(function (list) {
      list.addEventListener('keydown', function (e) {
        var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (keys.indexOf(e.key) === -1) return;
        var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
        var i = tabs.indexOf(document.activeElement);
        if (i === -1) return;
        e.preventDefault();
        var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length
                 : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
                 : e.key === 'Home' ? 0 : tabs.length - 1;
        tabs[next].focus();
        tabs[next].click();
      });
    });
  }

  /* ---------- accordions: one eased motion in every browser ----------------- */
  function initAccordions() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('details.acc, details.filter-group').forEach(function (d) {
      var s = d.querySelector('summary');
      var body = d.querySelector('.acc-body, .filter-body');
      if (!s || !body || !body.animate) return;
      s.addEventListener('click', function (e) {
        e.preventDefault();
        var ease = { duration: 180, easing: 'cubic-bezier(.77,0,.175,1)' };
        /* interruptible: capture mid-flight height, cancel, reverse from there */
        var running = body.getAnimations();
        var from;
        if (running.length) {
          from = body.getBoundingClientRect().height;
          running.forEach(function (a) { a.cancel(); });
        }
        var tgt = d.dataset.tgt
          ? (d.dataset.tgt === 'open' ? 'closed' : 'open')
          : (d.open ? 'closed' : 'open');
        d.dataset.tgt = tgt;
        body.style.overflow = 'hidden';
        if (tgt === 'open') {
          d.open = true;
          var full = body.offsetHeight;
          body.animate([{ height: (from === undefined ? 0 : from) + 'px' }, { height: full + 'px' }], ease)
            .onfinish = function () { body.style.overflow = ''; };
        } else {
          if (from === undefined) from = body.offsetHeight;
          body.animate([{ height: from + 'px' }, { height: '0px' }], ease)
            .onfinish = function () { d.open = false; body.style.overflow = ''; };
        }
      });
    });
  }

  /* ---------- search placeholder that fits narrow screens ------------------- */
  function initPlaceholders() {
    if (window.innerWidth >= 420) return;
    document.querySelectorAll('.search-field input').forEach(function (i) {
      i.placeholder = 'Search 215 designs';
    });
  }

  /* ---------- library empty state (demo via ?empty=1) ----------------------- */
  function initLibraryEmpty() {
    if (!/[?&]empty=1/.test(location.search)) return;
    var grid = document.querySelector('.lib-grid');
    if (!grid) return;
    grid.outerHTML =
      '<div class="panel" style="padding:var(--s6) var(--s4);text-align:center">' +
      '<div class="alpha" style="width:96px;height:96px;margin:0 auto var(--s4);border:1px solid var(--rule)"></div>' +
      '<h3 style="margin-bottom:var(--s2)">Nothing here yet</h3>' +
      '<p style="color:var(--muted);max-width:38ch;margin:0 auto var(--s4)">Every design you buy lands here, forever. Start with this week\u2019s drop.</p>' +
      '<a class="btn" href="category.html">Browse 215 designs</a></div>';
    document.querySelectorAll('.badge-line').forEach(function (b) {
      b.textContent = b.textContent.replace(/^8 designs$/, '0 designs');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLibraryEmpty();
    initTablists();
    initAccordions();
    initPlaceholders();
    paintCount();
    initCookie();
    initBundleMath();
    initCheckout();
    initInertForms();
  });
})();

// SENSA · lógica compartida: pedido (carrito), panel lateral, avisos y favoritos.
(function () {
  var D = window.SENSA;
  var CART_KEY = 'sensa-pedido';
  var FAV_KEY = 'sensa-favoritos';
  var MAX_QTY = 20;

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado: queda solo en memoria */ }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Estado del pedido ---------- */
  // Cada línea = producto + (versión) + (color) + cantidad. La clave identifica la combinación.
  function keyOf(slug, o) {
    o = o || {};
    return [slug, o.variant || '', o.color || ''].join('|');
  }
  // Una línea es válida si las opciones que exige el producto están elegidas.
  function validOptions(p, o) {
    o = o || {};
    if (D.hasVariants(p) && !D.variant(p, o.variant)) return false;
    var avail = D.colorsFor(p, o.variant);
    if (avail.length && !avail.some(function (c) { return c.id === o.color; })) return false;
    return true;
  }
  var items = (function () {
    var saved = readJSON(CART_KEY, []);
    if (!Array.isArray(saved)) return [];
    return saved.filter(function (it) {
      var p = it && D.find(it.slug);
      return p && p.price != null && it.qty > 0 && validOptions(p, it);
    }).map(function (it) {
      var line = { slug: it.slug, qty: Math.min(MAX_QTY, Math.floor(it.qty)) };
      if (it.variant) line.variant = it.variant;
      if (it.color) line.color = it.color;
      return line;
    });
  })();
  var listeners = [];

  function commit() {
    writeJSON(CART_KEY, items);
    listeners.forEach(function (fn) { fn(); });
  }
  function indexOf(key) {
    for (var i = 0; i < items.length; i++) if (keyOf(items[i].slug, items[i]) === key) return i;
    return -1;
  }

  var Cart = {
    items: function () { return items.slice(); },
    count: function () { return items.reduce(function (n, it) { return n + it.qty; }, 0); },
    total: function () {
      return items.reduce(function (sum, it) { return sum + D.find(it.slug).price * it.qty; }, 0);
    },
    // opts = { variant, color }. Devuelve false si falta una opción obligatoria o no hay precio.
    add: function (slug, qty, opts) {
      var p = D.find(slug);
      opts = opts || {};
      if (!p || p.price == null || !validOptions(p, opts)) return false;
      if (D.isSoldOut && D.isSoldOut(p, opts.color)) return false; // agotado
      var i = indexOf(keyOf(slug, opts));
      var add = Math.max(1, qty || 1);
      if (i === -1) {
        var line = { slug: slug, qty: Math.min(MAX_QTY, add) };
        if (opts.variant) line.variant = opts.variant;
        if (opts.color) line.color = opts.color;
        items.push(line);
      } else {
        items[i].qty = Math.min(MAX_QTY, items[i].qty + add);
      }
      commit();
      return true;
    },
    setQty: function (key, qty) {
      var i = indexOf(key);
      if (i === -1) return;
      if (qty <= 0) items.splice(i, 1);
      else items[i].qty = Math.min(MAX_QTY, qty);
      commit();
    },
    remove: function (key) {
      var i = indexOf(key);
      if (i !== -1) { items.splice(i, 1); commit(); }
    },
    clear: function () { items = []; commit(); },
    onChange: function (fn) { listeners.push(fn); },
    message: function () {
      var lines = ['Hola SENSA! Quiero hacer este pedido:'];
      items.forEach(function (it) {
        var p = D.find(it.slug);
        var label = D.optionLabel(p, it);
        lines.push('• ' + it.qty + 'x ' + p.name + (label ? ' (' + label + ')' : '') + ' - ' + D.money(p.price * it.qty));
      });
      lines.push('Total: ' + D.money(Cart.total()));
      lines.push('Quedo atento/a para coordinar el pago y la entrega.');
      return lines.join('\n');
    }
  };

  /* ---------- Avisos ---------- */
  var toastEl, toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.querySelector('[data-toast-text]').textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  /* ---------- Favoritos ---------- */
  var favs = readJSON(FAV_KEY, []);
  if (!Array.isArray(favs)) favs = [];
  var Favs = {
    has: function (slug) { return favs.indexOf(slug) !== -1; },
    toggle: function (slug) {
      var i = favs.indexOf(slug);
      if (i === -1) favs.push(slug); else favs.splice(i, 1);
      writeJSON(FAV_KEY, favs);
      return i === -1;
    }
  };

  /* ---------- Panel lateral del pedido ---------- */
  var root, lastFocus;

  function buildDrawer() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="cart-root" id="cart-root">' +
        '<div class="cart-scrim" data-cart-close></div>' +
        '<aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
          '<div class="px-space-md pt-space-md pb-space-sm flex items-center justify-between bg-surface-container-lowest/80">' +
            '<div class="flex items-center gap-space-xs">' +
              '<h2 id="cart-title" class="font-headline-sm text-headline-sm text-on-surface">Tu pedido</h2>' +
              '<span data-cart-count-badge class="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold">0</span>' +
            '</div>' +
            '<button type="button" data-cart-close aria-label="Cerrar panel" class="squish-btn w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center shadow-sm">' +
              '<span class="material-symbols-outlined text-[18px]">close</span>' +
            '</button>' +
          '</div>' +
          '<div class="px-space-md py-2 bg-surface-container-low flex items-center gap-2">' +
            '<div class="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[16px]">chat</span></div>' +
            '<span class="font-label-sm text-label-sm text-on-surface-variant leading-tight">Coordinamos tu compra y la entrega por Instagram ' + D.handle + '</span>' +
          '</div>' +
          '<div id="cart-filled" class="flex-1 min-h-0">' +
            '<div class="h-full flex flex-col">' +
              '<div id="cart-list" class="p-space-md flex flex-col gap-space-sm overflow-y-auto flex-1"></div>' +
              '<div class="p-space-md bg-surface-container-lowest shadow-[0_-8px_24px_-4px_rgba(42,40,51,0.06)] flex flex-col gap-3 rounded-t-lg">' +
                '<div class="flex flex-col gap-1.5">' +
                  '<div class="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm"><span>Subtotal</span><span class="font-bold text-on-surface" data-cart-subtotal>$0</span></div>' +
                  '<div class="flex items-start justify-between gap-3 text-on-surface-variant font-body-sm text-[12px] leading-tight"><span>Envío</span><span class="text-right text-primary font-semibold">Se coordina por Instagram</span></div>' +
                  '<div class="flex items-center justify-between pt-1"><span class="font-headline-sm text-headline-sm text-on-surface">Total</span><span class="font-headline-sm text-headline-sm text-on-surface font-bold" data-cart-total>$0</span></div>' +
                '</div>' +
                '<button type="button" id="cart-send" class="squish-btn w-full py-3.5 px-4 rounded-full bg-graphite text-surface hover:bg-inverse-surface flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(42,40,51,0.18)]">' +
                  '<span class="material-symbols-outlined text-[18px] text-primary-fixed">content_copy</span>' +
                  '<span class="font-label-lg text-label-lg font-bold">Copiar pedido y abrir Instagram</span>' +
                  '<span class="material-symbols-outlined text-[18px]">north_east</span>' +
                '</button>' +
                '<button type="button" id="cart-clear" class="w-full py-1 text-center font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors">Vaciar pedido</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div id="cart-empty" class="hidden flex-1">' +
            '<div class="h-full flex flex-col items-center justify-center p-space-lg text-center">' +
              '<div class="relative w-36 h-36 mb-space-md flex items-center justify-center">' +
                '<div class="absolute inset-0 bg-primary-container/25 rounded-full blur-xl animate-pulse"></div>' +
                '<div class="relative w-32 h-32 rounded-[1.75rem] bg-surface-container flex flex-col items-center justify-center p-3 shadow-inner">' +
                  '<svg class="w-20 h-20" viewBox="0 0 100 80" aria-hidden="true">' +
                    '<path d="M 20 60 C 10 60 5 45 15 35 C 10 20 28 10 40 18 C 50 8 70 10 75 22 C 88 18 96 32 90 45 C 98 55 90 68 78 68 C 65 72 35 70 20 60 Z" fill="#e5e0ef"></path>' +
                    '<ellipse cx="40" cy="38" rx="2" ry="3" fill="#1c1a25"></ellipse><ellipse cx="60" cy="38" rx="2" ry="3" fill="#1c1a25"></ellipse>' +
                    '<ellipse cx="34" cy="44" rx="4" ry="2" fill="#ffdad6"></ellipse><ellipse cx="66" cy="44" rx="4" ry="2" fill="#ffdad6"></ellipse>' +
                    '<path d="M 46 44 Q 50 48 54 44" fill="none" stroke="#1c1a25" stroke-linecap="round" stroke-width="2"></path>' +
                  '</svg>' +
                  '<span class="mt-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">Zzz... en calma</span>' +
                '</div>' +
              '</div>' +
              '<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Tu pedido está vacío</h3>' +
              '<p class="font-body-sm text-body-sm text-on-surface-variant max-w-[260px] mb-space-lg leading-relaxed">Aún no has agregado productos. Explora el catálogo y elige tu favorito.</p>' +
              '<a href="/#productos" data-cart-close class="squish-btn w-full max-w-[240px] py-3.5 px-6 rounded-full bg-graphite text-surface hover:bg-inverse-surface flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(42,40,51,0.15)]">' +
                '<span class="material-symbols-outlined text-[18px] text-tertiary-fixed">spa</span><span class="font-label-lg text-label-lg font-bold">Ver productos</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</aside>' +
      '</div>' +
      '<div class="toast" id="toast" role="status" aria-live="polite">' +
        '<span class="material-symbols-outlined text-primary-fixed-dim text-[20px]">check_circle</span>' +
        '<span class="font-label-lg text-label-lg font-bold" data-toast-text></span>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    root = document.getElementById('cart-root');
    toastEl = document.getElementById('toast');
  }

  function renderCart() {
    var list = document.getElementById('cart-list');
    var filled = document.getElementById('cart-filled');
    var empty = document.getElementById('cart-empty');
    var n = Cart.count();
    var has = items.length > 0;

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.classList.toggle('hidden', n === 0);
    });
    document.querySelectorAll('[data-cart-count-badge]').forEach(function (el) { el.textContent = n; });
    filled.classList.toggle('hidden', !has);
    empty.classList.toggle('hidden', has);
    if (!has) { list.innerHTML = ''; return; }

    list.innerHTML = items.map(function (it) {
      var p = D.find(it.slug);
      return '' +
        '<div class="p-3 rounded-lg bg-surface-container-lowest shadow-soft flex items-center gap-3" data-key="' + esc(keyOf(it.slug, it)) + '">' +
          '<a href="/producto/' + p.slug + '" class="w-20 h-20 rounded-DEFAULT bg-surface-container shrink-0 overflow-hidden flex items-center justify-center p-1">' +
            '<img src="' + p.image + '" alt="' + esc(p.alt) + '" class="w-full h-full object-contain' + (p.blend ? ' tray-img blend' : '') + '" loading="lazy">' +
          '</a>' +
          '<div class="flex flex-col flex-1 min-w-0">' +
            '<div class="flex items-start justify-between gap-1">' +
              '<a href="/producto/' + p.slug + '" class="font-headline-sm text-[16px] text-on-surface leading-snug truncate">' + esc(p.name) + '</a>' +
              '<span class="font-headline-sm text-[15px] text-on-surface font-bold shrink-0">' + D.money(p.price * it.qty) + '</span>' +
            '</div>' +
            '<span class="font-body-sm text-body-sm text-on-surface-variant truncate mb-2">' + esc(D.optionLabel(p, it)) + '</span>' +
            '<div class="flex items-center justify-between">' +
              '<div class="inline-flex items-center bg-surface-container-high rounded-full p-0.5 shadow-inner">' +
                '<button type="button" data-act="dec" aria-label="Disminuir cantidad" class="squish-btn w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center"><span class="material-symbols-outlined text-[14px]">remove</span></button>' +
                '<span class="px-2.5 font-label-sm text-label-sm text-on-surface font-bold">' + it.qty + '</span>' +
                '<button type="button" data-act="inc" aria-label="Aumentar cantidad" class="squish-btn w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center"><span class="material-symbols-outlined text-[14px]">add</span></button>' +
              '</div>' +
              '<button type="button" data-act="rm" class="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors p-1"><span class="material-symbols-outlined text-[16px]">delete</span><span>Quitar</span></button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    var total = D.money(Cart.total());
    document.querySelectorAll('[data-cart-subtotal],[data-cart-total]').forEach(function (el) { el.textContent = total; });
  }

  function open() {
    lastFocus = document.activeElement;
    root.classList.add('open');
    document.documentElement.classList.add('no-scroll');
    var closeBtn = root.querySelector('button[data-cart-close]');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }
  function close() {
    root.classList.remove('open');
    document.documentElement.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Copia el texto y abre directo el chat privado (DM) de @sensa.usm con el mensaje.
  // Instagram no permite prellenar el mensaje desde un link, por eso se copia al portapapeles.
  function sendToInstagram(text, okMsg) {
    var p = copyText(text);
    // Se intenta dejar el mensaje escrito en el chat (?text=); si Instagram lo ignora, queda copiado para pegarlo.
    var url = D.instagramDM ? D.instagramDM + '?text=' + encodeURIComponent(text) : D.instagram;
    window.open(url, '_blank', 'noopener');
    p.then(function () { toast(okMsg || ('¡Mensaje copiado! Pégalo en el chat de ' + D.handle)); })
     .catch(function () { toast('No se pudo copiar. Escríbenos en ' + D.handle); });
  }
  function send() {
    if (!items.length) return;
    sendToInstagram(Cart.message(), '¡Pedido listo! Si no aparece escrito en el chat, pégalo: ya está copiado');
  }

  function init() {
    buildDrawer();
    renderCart();
    Cart.onChange(renderCart);

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cart-open],[data-cart-close],[data-add],[data-fav],[data-act]');
      if (!t) return;
      if (t.hasAttribute('data-cart-open')) { e.preventDefault(); open(); return; }
      if (t.hasAttribute('data-cart-close')) { close(); return; }
      if (t.hasAttribute('data-add')) {
        if (Cart.add(t.getAttribute('data-add'), 1)) toast('¡Agregado al pedido con calma!');
        return;
      }
      if (t.hasAttribute('data-fav')) {
        var slugF = t.getAttribute('data-fav');
        var on = Favs.toggle(slugF);
        t.classList.toggle('fav-on', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
        return;
      }
      var act = t.getAttribute('data-act');
      var row = t.closest('[data-key]');
      if (row) {
        var k = row.getAttribute('data-key');
        var cur = items[indexOf(k)];
        if (!cur) return;
        if (act === 'inc') Cart.setQty(k, cur.qty + 1);
        else if (act === 'dec') Cart.setQty(k, cur.qty - 1);
        else if (act === 'rm') Cart.remove(k);
      }
    });

    document.getElementById('cart-send').addEventListener('click', send);
    document.getElementById('cart-clear').addEventListener('click', function () { Cart.clear(); });

    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = root.querySelectorAll('.cart-panel button, .cart-panel a[href]');
        var vis = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
        if (!vis.length) return;
        var first = vis[0], last = vis[vis.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('pagehide', function () { document.documentElement.classList.remove('no-scroll'); });
  }

  /* ---------- Plantillas compartidas ---------- */
  function dotsHTML(p, size) {
    var dots = D.cardDots(p);
    if (!dots.length) return '';
    return '<div class="flex -space-x-1 shrink-0">' + dots.map(function (c) {
      return '<span class="' + size + ' rounded-full shadow-sm border border-white/70" style="background:' + c + '"></span>';
    }).join('') + '</div>';
  }
  function priceHTML(p, big) {
    if (p.price == null) {
      return '<span class="font-headline-sm text-[15px] leading-snug text-primary font-bold ' + (big ? 'mt-1' : '') + '">Consultar precio</span>';
    }
    return '<span class="font-headline-sm text-headline-sm text-on-surface font-bold ' + (big ? 'mt-1' : '') + '">' + D.money(p.price) + '</span>';
  }

  function cardHTML(p) {
    var note = D.cardNote(p);
    var sold = D.isSoldOut && D.isSoldOut(p);
    return '' +
      '<div class="reveal-up h-full" data-category="' + p.category + '" data-price="' + p.price + '">' +
        '<article class="sensory-card h-full flex flex-col justify-between p-2.5 rounded-lg bg-surface-container-lowest shadow-rest hover:shadow-raised">' +
          '<div class="flex flex-col">' +
            '<div class="relative w-full aspect-square rounded-DEFAULT bg-surface-container overflow-hidden">' +
              '<a href="/producto/' + p.slug + '" class="absolute inset-0 flex items-center justify-center p-2" aria-label="Ver ' + esc(p.name) + '">' +
                '<img class="tray-img' + (p.blend ? ' blend' : '') + ' w-full h-full object-contain' + (sold ? ' opacity-50 grayscale' : '') + '" loading="lazy" src="' + p.image + '" alt="' + esc(p.alt) + '">' +
              '</a>' +
              (sold
                ? '<span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-graphite text-surface font-label-sm text-label-sm font-bold shadow-sm pointer-events-none">Agotado</span>'
                : '<span class="absolute top-2 left-2 px-2 py-0.5 rounded-full ' + p.badgeClass + ' font-label-sm text-label-sm font-bold shadow-sm pointer-events-none">' + esc(p.badge) + '</span>') +
              '<button type="button" data-fav="' + p.slug + '" aria-pressed="false" aria-label="Guardar ' + esc(p.name) + ' en favoritos" class="fav-btn squish-btn absolute top-2 right-2 w-7 h-7 rounded-full bg-surface/90 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-error shadow-sm">' +
                '<span class="material-symbols-outlined text-[16px]">favorite</span>' +
              '</button>' +
            '</div>' +
            '<div class="flex flex-col mt-2.5 px-0.5">' +
              '<span class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">' + esc(p.kicker) + '</span>' +
              '<h3 class="mt-0.5"><a href="/producto/' + p.slug + '" class="font-title-md text-title-md text-on-surface tracking-tight line-clamp-2">' + esc(p.name) + '</a></h3>' +
              priceHTML(p, true) +
            '</div>' +
          '</div>' +
          '<div class="mt-3 pt-2 flex items-center justify-between gap-2 px-0.5">' +
            '<div class="flex items-center gap-1.5 min-w-0">' + dotsHTML(p, 'w-2.5 h-2.5') +
              '<span class="font-label-sm text-on-surface-variant text-[10px] leading-tight">' + esc(note) + '</span></div>' +
            (D.canQuickAdd(p)
              ? '<button type="button" data-add="' + p.slug + '" aria-label="Añadir ' + esc(p.name) + ' al pedido" class="squish-btn w-8 h-8 shrink-0 rounded-full bg-graphite text-inverse-on-surface flex items-center justify-center hover:bg-primary shadow-sm">' +
                  '<span class="material-symbols-outlined text-[16px]">add</span>' +
                '</button>'
              : '<a href="/producto/' + p.slug + '" aria-label="' + (D.needsOptions(p) ? 'Elegir opciones de ' : 'Ver ') + esc(p.name) + '" class="squish-btn w-8 h-8 shrink-0 rounded-full bg-graphite text-inverse-on-surface flex items-center justify-center hover:bg-primary shadow-sm">' +
                  '<span class="material-symbols-outlined text-[16px]">arrow_forward</span>' +
                '</a>') +
          '</div>' +
        '</article>' +
      '</div>';
  }

  function relatedHTML(p) {
    return '' +
      '<a class="group flex flex-col rounded-lg bg-surface-container-lowest p-space-sm shadow-rest hover:shadow-raised hover:-translate-y-1 transition-all" href="/producto/' + p.slug + '">' +
        '<div class="aspect-square w-full rounded-DEFAULT bg-surface-container overflow-hidden mb-2 relative flex items-center justify-center p-2">' +
          '<img alt="' + esc(p.alt) + '" class="tray-img' + (p.blend ? ' blend' : '') + ' w-full h-full object-contain group-hover:scale-105' + (D.isSoldOut && D.isSoldOut(p) ? ' opacity-50 grayscale' : '') + '" loading="lazy" src="' + p.image + '">' +
          '<span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm font-label-sm text-label-sm font-bold text-on-surface">' + (D.isSoldOut && D.isSoldOut(p) ? 'Agotado' : esc(p.badge)) + '</span>' +
        '</div>' +
        '<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold line-clamp-1">' + esc(p.kicker) + '</span>' +
        '<h4 class="font-title-md text-title-md text-on-surface font-bold mt-0.5 line-clamp-2">' + esc(p.name) + '</h4>' +
        '<div class="flex items-center justify-between mt-2">' +
          priceHTML(p, false) +
          '<span class="w-8 h-8 shrink-0 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors"><span class="material-symbols-outlined text-[18px]">arrow_forward</span></span>' +
        '</div>' +
      '</a>';
  }

  window.Sensa = {
    Cart: Cart, Favs: Favs, toast: toast, copyText: copyText, esc: esc, sendToInstagram: sendToInstagram,
    cardHTML: cardHTML, relatedHTML: relatedHTML,
    applyFavs: function (scope) {
      (scope || document).querySelectorAll('[data-fav]').forEach(function (b) {
        var on = Favs.has(b.getAttribute('data-fav'));
        b.classList.toggle('fav-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

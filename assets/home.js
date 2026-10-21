// SENSA · página de inicio: catálogo (filtros/orden/vista), aparición al scroll, navegación activa y mascota.
(function () {
  var D = window.SENSA;
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  var state = { category: 'all', sort: 'default', list: false, need: null, query: '' };

  /* ---------- Intenciones, packs y guía (editable) ---------- */
  var TAGS = {
    'butter-squishy': ['estudio', 'llevar'],
    'butter-espuma': ['estudio', 'regalar'],
    'cubo-gel': ['estres', 'estudio'],
    'cubo-gel-cinta': ['estres', 'regalar'],
    'cubo-gel-glitter': ['regalar', 'estres'],
    'cubo-antiestres-sensorial': ['estudio', 'llevar'],
    'dumplings': ['regalar', 'estres', 'llevar']
  };
  var NEEDS = [
    { id: 'estudio', ico: 'menu_book', t: 'Para estudiar', d: 'Manos ocupadas, mente enfocada.', cls: 'bg-secondary-container text-secondary' },
    { id: 'estres', ico: 'self_improvement', t: 'Para soltar el estrés', d: 'Apretar, rebotar y respirar.', cls: 'bg-tertiary-container/30 text-tertiary' },
    { id: 'llevar', ico: 'backpack', t: 'Para llevar', d: 'Chicos y listos para la mochila.', cls: 'bg-primary-container/25 text-primary' },
    { id: 'regalar', ico: 'redeem', t: 'Para regalar', d: 'Un detalle diferente y entretenido.', cls: 'bg-secondary-fixed-dim/20 text-secondary-fixed' }
  ];
  var RECO = { // [cuándo][sensación] -> producto
    estudio: { blando: 'butter-squishy', gel: 'cubo-gel', mecanico: 'cubo-antiestres-sensorial' },
    descanso: { blando: 'butter-espuma', gel: 'cubo-gel-cinta', mecanico: 'cubo-antiestres-sensorial' },
    regalo: { blando: 'dumplings', gel: 'cubo-gel-glitter', mecanico: 'cubo-antiestres-sensorial' }
  };
  var WHY = {
    'butter-squishy': 'Blandito, con efecto slow rising: perfecto para apretar mientras estudias.',
    'butter-espuma': 'De espuma y en tres colores: suavidad total para tus descansos.',
    'cubo-gel': 'Gel súper sólido y transparente para liberar tensión en tu escritorio.',
    'cubo-gel-cinta': 'Gel con cinta holográfica: relajante y muy lindo para mirar.',
    'cubo-gel-glitter': 'Gel con glitter en seis colores: un regalo que luce y se siente increíble.',
    'cubo-antiestres-sensorial': 'Seis lados con botones, palanca y clics para mantener las manos ocupadas.',
    'dumplings': 'Kawaii, esponjoso y sorpresa de color: ideal para regalar.'
  };
  var S = window.Sensa;
  var esc = S.esc;
  function openCart() { var b = document.querySelector('[data-cart-open]'); if (b) b.click(); }
  // Primer color que no esté agotado (para agregar rápido un producto con colores)
  function firstColor(p) {
    if (!D.hasColors(p)) return null;
    var ok = p.colors.filter(function (c) { return !(D.stockState && D.stockState(p, c.id) === 'out'); });
    return ok.length ? ok[0].id : null;
  }
  function quickAdd(slug) {
    var p = D.find(slug);
    if (!p || p.price == null || (D.isSoldOut && D.isSoldOut(p))) return false;
    var opts = D.hasColors(p) ? { color: firstColor(p) } : {};
    if (D.hasColors(p) && !opts.color) return false;
    return S.Cart.add(slug, 1, opts);
  }

  /* ---------- Catálogo ---------- */
  function visibleProducts() {
    var list = D.products.filter(function (p) {
      return (state.category === 'all' || p.category === state.category) &&
        (!state.need || (TAGS[p.slug] || []).indexOf(state.need) !== -1) &&
        (!state.query || (p.name + ' ' + p.kicker).toLowerCase().indexOf(state.query) !== -1);
    });
    // Los productos sin precio ("Consultar precio") quedan siempre al final.
    var priced = function (p) { return p.price == null ? Infinity : p.price; };
    var byAsc = function (a, b) {
      if (priced(a) === Infinity || priced(b) === Infinity) return priced(a) === priced(b) ? 0 : (priced(a) === Infinity ? 1 : -1);
      return a.price - b.price;
    };
    if (state.sort === 'asc') list = list.slice().sort(byAsc);
    if (state.sort === 'desc') list = list.slice().sort(function (a, b) {
      if (priced(a) === Infinity || priced(b) === Infinity) return byAsc(a, b);
      return b.price - a.price;
    });
    return list;
  }

  function renderGrid() {
    var list = visibleProducts();
    grid.innerHTML = list.map(window.Sensa.cardHTML).join('');
    grid.className = 'stagger-group grid gap-3 pt-space-xs pb-space-lg ' +
      (state.list ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4');
    var n = list.length;
    document.getElementById('count-pill').textContent = n + (n === 1 ? ' producto' : ' productos');
    var an = document.getElementById('active-need');
    an.classList.toggle('hidden', !state.need); an.classList.toggle('inline-flex', !!state.need);
    if (state.need) document.getElementById('active-need-txt').textContent = NEEDS.filter(function (x) { return x.id === state.need; })[0].t;

    document.getElementById('empty-note').classList.toggle('hidden', n !== 0);
    window.Sensa.applyFavs(grid);
  }

  // Cuando llega (o cambia) el stock se repinta el catálogo con los "Agotado".
  document.addEventListener('sensa:stock', renderGrid);

  document.querySelectorAll('[data-cat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.category = btn.getAttribute('data-cat');
      document.querySelectorAll('[data-cat]').forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('bg-tertiary-container', on);
        b.classList.toggle('text-on-tertiary-container', on);
        b.classList.toggle('shadow-[0_0_14px_rgba(132,193,171,0.35)]', on);
        b.classList.toggle('bg-surface-container-high', !on);
        b.classList.toggle('text-on-surface-variant', !on);
      });
      renderGrid();
    });
  });

  document.getElementById('sort-select').addEventListener('change', function (e) {
    state.sort = e.target.value;
    renderGrid();
  });

  document.getElementById('view-toggle').addEventListener('click', function () {
    state.list = !state.list;
    this.setAttribute('aria-pressed', state.list ? 'true' : 'false');
    this.querySelector('.material-symbols-outlined').textContent = state.list ? 'grid_view' : 'view_agenda';
    renderGrid();
  });

  renderGrid();

  /* ---------- Aparición al hacer scroll ----------
     Se observan las <section> (.reveal-trigger): no cambian de tamaño ni posición, así
     el movimiento de las tarjetas no puede volver a disparar el observer. */
  var sections = document.querySelectorAll('.reveal-trigger');
  if ('IntersectionObserver' in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('is-visible', entry.isIntersecting); });
    }, { threshold: 0.12 });
    sections.forEach(function (el) { reveal.observe(el); });
  } else {
    sections.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Navegación activa (barra superior e inferior) ---------- */
  var navTargets = ['inicio', 'productos', 'conocenos'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function setActive(id) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    navTargets.forEach(function (el) { spy.observe(el); });
  }
  setActive('inicio');

  /* ---------- Portada: producto protagonista que rota ----------
     Un solo producto grande dentro del arco; cambia con fundido cada ~4 s y se puede elegir con los puntos. */
  (function heroArch() {
    var img = document.getElementById('hero-img');
    if (!img) return;
    var link = document.getElementById('hero-link'), nameEl = document.getElementById('hero-name'), priceEl = document.getElementById('hero-price'), dotsEl = document.getElementById('hero-dots');
    var order = ['butter-espuma', 'cubo-gel-glitter', 'dumplings', 'cubo-gel', 'cubo-gel-cinta', 'cubo-antiestres-sensorial', 'butter-squishy'];
    var list = order.map(function (slug) { return D.find(slug); }).filter(Boolean);
    D.products.forEach(function (p) { if (p.price != null && list.indexOf(p) === -1) list.push(p); });
    list.forEach(function (p) { var pre = new Image(); pre.src = p.image; }); // precarga: sin parpadeo
    var cur = 0, timer = null;
    dotsEl.innerHTML = list.map(function (p, k) { return '<button type="button" class="hero-dot' + (k === 0 ? ' on' : '') + '" data-k="' + k + '" aria-label="Ver ' + p.name + '"></button>'; }).join('');
    function show(k) {
      if (k === cur) return;
      var p = list[k]; cur = k;
      img.classList.add('is-out');
      setTimeout(function () {
        img.src = p.image; img.alt = p.name;
        link.href = '/producto/' + p.slug; nameEl.textContent = p.name; priceEl.textContent = D.priceText(p);
        Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.classList.toggle('on', i === cur); });
        img.classList.remove('is-out');
      }, 380);
    }
    function start() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer);
      timer = setInterval(function () { if (!document.hidden) show((cur + 1) % list.length); }, 4200);
    }
    dotsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) { show(+b.getAttribute('data-k')); start(); } });
    start();
    // etiquetas de precio: llevan al catálogo de esa categoría
    Array.prototype.forEach.call(document.querySelectorAll('[data-hero-cat]'), function (a) {
      a.addEventListener('click', function () {
        var c = a.getAttribute('data-hero-cat');
        Array.prototype.forEach.call(document.querySelectorAll('[data-cat]'), function (b) { if (b.getAttribute('data-cat') === c) b.click(); });
      });
    });
  })();

  /* ---------- Caldero de pausas ---------- */
  var needsEl = document.getElementById('needs');
  var LIQUID = { estudio: '#b9a7e8', estres: '#84c1ab', llevar: '#ff9e44', regalar: '#f06ea8' };
  needsEl.innerHTML = NEEDS.map(function (n) {
    return '<button type="button" data-need="' + n.id + '" aria-pressed="false" class="orb orb-' + n.id + '"><span class="material-symbols-outlined">' + n.ico + '</span><b>' + n.t + '</b></button>';
  }).join('');
  var pot = document.getElementById('brew-pot'), out = document.getElementById('brew-out'), brewTimer = null, brewing = null;
  function brew(id) {
    var n = NEEDS.filter(function (x) { return x.id === id; })[0];
    brewing = id;
    Array.prototype.forEach.call(needsEl.children, function (b) { var on = b.getAttribute('data-need') === id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    pot.style.setProperty('--liquid', LIQUID[id]);
    pot.classList.add('is-brewing');
    out.innerHTML = '<p class="brew-hint"><span class="material-symbols-outlined">auto_fix_high</span>Preparando tu pausa…</p>';
    clearTimeout(brewTimer);
    brewTimer = setTimeout(function () {
      pot.classList.remove('is-brewing');
      var list = D.products.filter(function (p) { return p.price != null && (TAGS[p.slug] || []).indexOf(id) !== -1; }).slice(0, 4);
      out.innerHTML = '<p class="brew-title"><b>' + n.t + '</b><span>' + n.d + '</span></p>' +
        '<div class="brew-list">' + list.map(function (p, i) {
          var sold = D.isSoldOut && D.isSoldOut(p);
          return '<div class="brew-row" style="animation-delay:' + (i * 90) + 'ms"><a href="/producto/' + p.slug + '" class="brew-img"><img src="' + p.image + '" alt=""></a>' +
            '<a href="/producto/' + p.slug + '" class="brew-name"><b>' + esc(p.name) + '</b><small>' + (sold ? 'Agotado' : D.priceText(p)) + '</small></a>' +
            (sold ? '' : '<button type="button" data-brew-add="' + p.slug + '" class="brew-add" aria-label="Agregar ' + esc(p.name) + ' al pedido"><span class="material-symbols-outlined">add</span></button>') + '</div>';
        }).join('') + '</div>' +
        '<button type="button" id="brew-cat" class="brew-cta">Ver los ' + list.length + ' en el catálogo<span class="material-symbols-outlined">arrow_forward</span></button>';
    }, 1100);
  }
  needsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-need]'); if (b) brew(b.getAttribute('data-need')); });
  out.addEventListener('click', function (e) {
    var a = e.target.closest('[data-brew-add]');
    if (a) { if (quickAdd(a.getAttribute('data-brew-add'))) S.toast('¡Agregado al pedido con calma!'); else S.toast('Elige el color en la página del producto'); return; }
    if (e.target.closest('#brew-cat')) {
      state.need = brewing; state.category = 'all';
      Array.prototype.forEach.call(document.querySelectorAll('[data-cat]'), function (x) { if (x.getAttribute('data-cat') === 'all') x.click(); });
      renderGrid();
      document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.getElementById('clear-need').addEventListener('click', function () { state.need = null; renderGrid(); });
  document.getElementById('search').addEventListener('input', function (e) { state.query = e.target.value.trim().toLowerCase(); renderGrid(); });

  /* ---------- Arma tu pack ---------- */
  var pack = [];
  function renderPack() {
    var avail = D.products.filter(function (p) { return p.price != null; });
    document.getElementById('pick').innerHTML = avail.map(function (p) {
      var sold = D.isSoldOut && D.isSoldOut(p), on = pack.indexOf(p.slug) !== -1;
      return '<button type="button" data-p="' + p.slug + '" class="pick-chip squish-btn' + (on ? ' on' : '') + '"' + (sold ? ' disabled style="opacity:.45;cursor:not-allowed"' : '') + '><img src="' + p.image + '" alt="">' + esc(p.name) + (sold ? ' · Agotado' : '') + '</button>';
    }).join('');
    var slots = '';
    for (var i = 0; i < 4; i++) {
      var p = pack[i] && D.find(pack[i]);
      slots += p ? '<div class="pack-slot on"><img src="' + p.image + '" alt="' + esc(p.name) + '"></div>' : '<div class="pack-slot"><span class="material-symbols-outlined">add</span></div>';
    }
    document.getElementById('slots').innerHTML = slots;
    var t = pack.reduce(function (sum, sl) { return sum + D.find(sl).price; }, 0);
    document.getElementById('pack-total').textContent = D.money(t);
    document.getElementById('pack-count').textContent = pack.length + ' de 4 elegidos';
    document.getElementById('pack-add').disabled = !pack.length;
  }
  document.getElementById('pick').addEventListener('click', function (e) {
    var b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
    var i = pack.indexOf(b.getAttribute('data-p'));
    if (i !== -1) pack.splice(i, 1);
    else if (pack.length < 4) pack.push(b.getAttribute('data-p'));
    else S.toast('Tu pack ya tiene 4 productos');
    renderPack();
  });
  document.getElementById('pack-add').addEventListener('click', function () {
    var added = 0;
    pack.forEach(function (sl) { if (quickAdd(sl)) added++; });
    if (added) { S.toast('Pack agregado al pedido'); pack = []; renderPack(); openCart(); }
    else S.toast('No se pudo agregar: revisa el stock');
  });
  document.addEventListener('sensa:stock', renderPack);
  renderPack();

  /* ---------- Guía táctil ---------- */
  var ans = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-q]'), function (g) {
    g.addEventListener('click', function (e) {
      var o = e.target.closest('.opt'); if (!o) return;
      Array.prototype.forEach.call(g.querySelectorAll('.opt'), function (x) { x.classList.toggle('on', x === o); });
      ans[g.getAttribute('data-q')] = o.getAttribute('data-v');
      if (!ans.when || !ans.feel) return;
      var p = D.find(RECO[ans.when][ans.feel]); if (!p) return;
      document.getElementById('reco').innerHTML = '<img class="reco-img" src="' + p.image + '" alt="' + esc(p.name) + '"><h3 class="mt-3 font-headline-sm text-headline-sm text-on-surface">' + esc(p.name) + '</h3><p class="mt-1 mb-4 font-body-md text-body-md text-on-surface-variant max-w-xs">' + esc(WHY[p.slug] || p.description) + '</p>' +
        '<div class="flex flex-wrap justify-center gap-2"><a href="/producto/' + p.slug + '" class="squish-btn px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">Ver producto</a>' +
        '<button type="button" id="reco-add" class="squish-btn px-5 py-2.5 rounded-full bg-graphite text-surface font-label-md text-label-md shadow-squish inline-flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>Agregar · ' + D.money(p.price) + '</button></div>';
      document.getElementById('reco-add').addEventListener('click', function () {
        if (quickAdd(p.slug)) S.toast('¡Agregado al pedido con calma!'); else S.toast('Elige el color en la página del producto');
      });
    });
  });

  /* ---------- Preguntas frecuentes e Instagram ---------- */
  document.getElementById('faq-list').addEventListener('click', function (e) {
    var b = e.target.closest('.faq-q'); if (b) b.parentNode.classList.toggle('on');
  });
  var igPics = ['butter-estudio', 'cubo-gel-cinta-colores-sf', 'dumplings-glitter-colores-sf', 'fidget-cubos-12-colores-sf', 'butter-espuma-estudio', 'cubo-gel-glitter-cajas'];
  document.getElementById('ig-strip').innerHTML = igPics.map(function (n) {
    return '<a href="https://www.instagram.com/sensa.usm" target="_blank" rel="noopener" aria-label="Ver en Instagram" class="ig-tile"><img src="/images/opt/' + n + '.webp" alt="" loading="lazy"></a>';
  }).join('');

  /* ---------- Mascota Dumpling (easter egg) ----------
     Rueda desde el Hero hasta el título del catálogo mientras se baja y se queda posada ahí.
     Se desactiva en móvil y con "reducir movimiento". Solo lee window.scrollY y escribe transform. */
  var mascotBuilt = false;
  function initMascot() {
    if (mascotBuilt) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var hero = document.getElementById('inicio');
    var productos = document.getElementById('productos');
    var dock = document.getElementById('dumpling-dock');
    if (!hero || !productos || !dock) return;
    mascotBuilt = true;

    var mascot = document.createElement('div');
    mascot.id = 'sensa-mascot';
    mascot.setAttribute('aria-hidden', 'true');
    mascot.innerHTML = '<div class="mascot-inner breathe"><img src="/images/opt/dumpling-mascot.webp" alt="" width="88" height="78"></div>';
    document.body.appendChild(mascot);
    var inner = mascot.querySelector('.mascot-inner');

    var state = 'idle'; // idle -> transit -> landed
    var rafId = null;
    var lastY = window.scrollY;
    var curStretch = 1, curSquash = 1;
    var range = { start: 0, end: 1 };
    var SIZE = 88;

    function computeRange() {
      range.start = hero.offsetTop + hero.offsetHeight * 0.35;
      range.end = Math.max(range.start + 200, productos.offsetTop - 120);
    }
    function idlePosition() {
      mascot.style.transform = 'translate3d(' + (window.innerWidth * 0.84) + 'px,' + (window.innerHeight * 0.2) + 'px,0)';
    }
    function resetToIdle() {
      state = 'idle';
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      mascot.classList.remove('landed');
      if (mascot.parentNode !== document.body) document.body.appendChild(mascot);
      inner.classList.add('breathe');
      inner.style.transform = '';
      curStretch = 1; curSquash = 1;
      idlePosition();
    }
    function dockMascot() {
      state = 'landed';
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      mascot.classList.add('landed');
      mascot.style.transform = '';
      inner.style.transform = '';
      inner.classList.add('breathe');
      dock.appendChild(mascot);
    }
    function frame() {
      var y = window.scrollY;
      var t = Math.max(0, Math.min(1, (y - range.start) / (range.end - range.start)));
      if (t >= 1) { dockMascot(); return; }

      var zig = Math.sin(t * Math.PI * 2.4) * (window.innerWidth * 0.1);
      var x = window.innerWidth * (0.78 + 0.02 * t) + zig;
      var yPos = window.innerHeight * 0.2 + (100 - window.innerHeight * 0.2) * t + Math.abs(Math.sin(t * Math.PI * 2.4)) * 24;
      var m = 12;
      x = Math.max(m, Math.min(window.innerWidth - SIZE - m, x));
      yPos = Math.max(m, Math.min(window.innerHeight - SIZE - m, yPos));

      var deltaY = y - lastY;
      lastY = y;
      var targetStretch = 1 + Math.min(Math.abs(deltaY) * 0.012, 0.16);
      curStretch += (targetStretch - curStretch) * 0.22;
      curSquash += ((2 - curStretch) - curSquash) * 0.22;

      mascot.style.transform = 'translate3d(' + x + 'px,' + yPos + 'px,0) rotate(' + (t * 360) + 'deg)';
      inner.style.transform = 'scale(' + curStretch.toFixed(3) + ',' + curSquash.toFixed(3) + ')';
      rafId = requestAnimationFrame(frame);
    }
    function evaluate() {
      if (state === 'landed') return;
      computeRange();
      var y = window.scrollY;
      if (y >= range.end) { dockMascot(); return; }
      if (y > range.start) {
        if (state === 'idle') { state = 'transit'; inner.classList.remove('breathe'); }
        if (!rafId) rafId = requestAnimationFrame(frame);
      } else if (state === 'transit') {
        resetToIdle();
      }
    }

    computeRange();
    idlePosition();
    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', function () { computeRange(); if (state === 'idle') idlePosition(); });
    evaluate();
  }

  // Se intenta en 'load' y también al cambiar el tamaño: al parsear, window.innerWidth puede leerse
  // como 0 y, sin este reintento, la mascota quedaría descartada como 'móvil' para siempre.
  window.addEventListener('resize', initMascot);
  if (document.readyState === 'complete') initMascot();
  else window.addEventListener('load', initMascot);
})();

// SENSA · página de inicio: catálogo (filtros/orden/vista), aparición al scroll, navegación activa y mascota.
(function () {
  var D = window.SENSA;
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  var state = { category: 'all', sort: 'default', list: false };

  /* ---------- Catálogo ---------- */
  function visibleProducts() {
    var list = D.products.filter(function (p) { return state.category === 'all' || p.category === state.category; });
    if (state.sort === 'asc') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (state.sort === 'desc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    return list;
  }

  function renderGrid() {
    var list = visibleProducts();
    grid.innerHTML = list.map(window.Sensa.cardHTML).join('');
    grid.className = 'stagger-group grid gap-3 pt-space-xs pb-space-lg ' +
      (state.list ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4');
    var n = list.length;
    document.getElementById('count-pill').textContent = n + (n === 1 ? ' disponible' : ' disponibles');
    document.getElementById('empty-note').classList.toggle('hidden', n !== 0);
    window.Sensa.applyFavs(grid);
  }

  document.querySelectorAll('[data-cat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.category = btn.getAttribute('data-cat');
      document.querySelectorAll('[data-cat]').forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('bg-inverse-surface', on);
        b.classList.toggle('text-inverse-on-surface', on);
        b.classList.toggle('shadow-[0_4px_12px_rgba(42,40,51,0.12)]', on);
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

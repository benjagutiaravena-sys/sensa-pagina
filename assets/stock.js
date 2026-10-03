// SENSA · stock en vivo. Consulta /api/stock y expone el estado de cada producto/color.
// Estados: 'ok' (disponible) · 'low' (¡Últimas unidades!) · 'out' (Agotado) · 'unknown' (sin datos: no bloquea nada).
// Nunca se muestra la cantidad exacta.
(function () {
  var D = window.SENSA;
  if (!D) return;
  var MAP = window.SENSA_STOCK_MAP || { products: {}, colors: {} };

  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').map(function (w) {
        return w.length > 3 && w.slice(-1) === 's' ? w.slice(0, -1) : w;
      }).join(' ');
  }

  // Nombre normalizado → slug / id de color.
  var prodIndex = {};
  D.products.forEach(function (p) {
    prodIndex[norm(p.name)] = p.slug;
    prodIndex[norm(p.slug.replace(/-/g, ' '))] = p.slug;
  });
  Object.keys(MAP.products || {}).forEach(function (k) { prodIndex[norm(k)] = MAP.products[k]; });

  function colorIndex(p) {
    var idx = {};
    (p.colors || p.randomColors || []).forEach(function (c) { idx[norm(c.name)] = c.id; });
    var extra = (MAP.colors || {})[p.slug] || {};
    Object.keys(extra).forEach(function (k) { idx[norm(k)] = extra[k]; });
    return idx;
  }

  D.stock = { status: 'unknown', byProduct: {} };

  function apply(data) {
    var by = {};
    (data.totals || []).forEach(function (t) {
      var slug = prodIndex[norm(t.product)];
      if (slug) (by[slug] = by[slug] || { colors: {} }).total = t.state;
    });
    (data.items || []).forEach(function (it) {
      var slug = prodIndex[norm(it.product)];
      if (!slug || !it.color) return;
      var id = colorIndex(D.find(slug))[norm(it.color)];
      if (id) (by[slug] = by[slug] || { colors: {} }).colors[id] = it.state;
    });
    D.stock = { status: data.status, byProduct: by };
  }

  // Estado de un producto (sin color) o de un color concreto.
  D.stockState = function (p, colorId) {
    var s = D.stock.byProduct[p.slug];
    if (!s) return 'unknown';
    if (colorId) return s.colors[colorId] || 'unknown';
    if (D.hasColors(p)) {
      // Con colores elegibles: agotado solo si TODOS están agotados.
      var states = p.colors.map(function (c) { return s.colors[c.id]; });
      if (states.every(function (x) { return x === 'out'; })) return 'out';
      if (states.every(function (x) { return x === 'out' || x === 'low'; })) return 'low';
      if (states.some(function (x) { return x === 'ok'; })) return 'ok';
      return s.total || 'unknown';
    }
    return s.total || 'unknown';
  };
  D.isSoldOut = function (p, colorId) { return D.stockState(p, colorId) === 'out'; };
  D.stockLabel = function (state) {
    return state === 'out' ? 'Agotado' : state === 'low' ? '¡Últimas unidades!' : '';
  };

  var lastJSON = '';
  function load() {
    if (!window.fetch) return;
    fetch('/api/stock', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        // Si falla o no hay datos, se conserva lo último que se sabía (o todo normal).
        if (!data || (data.status !== 'ok' && data.status !== 'stale')) return;
        var json = JSON.stringify(data.items) + JSON.stringify(data.totals);
        if (json === lastJSON) return;
        lastJSON = json;
        apply(data);
        document.dispatchEvent(new CustomEvent('sensa:stock'));
      })
      .catch(function () { /* sin stock: la página sigue normal */ });
  }
  load();
  // Refresco mientras la página está abierta (el servidor guarda ~60 s en caché).
  setInterval(function () { if (!document.hidden) load(); }, 90000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) load(); });
})();

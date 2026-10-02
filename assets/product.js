// SENSA · página de detalle: /producto/<slug>
(function () {
  var D = window.SENSA;
  var S = window.Sensa;
  var root = document.getElementById('product-root');
  if (!root) return;

  var match = location.pathname.match(/\/producto\/([^\/?#]+)/);
  var slug = match ? decodeURIComponent(match[1]) : (new URLSearchParams(location.search).get('p') || '');
  var p = D.find(slug);

  // Volver: si venimos del propio sitio, regresa a la posición anterior del catálogo.
  document.getElementById('back-link').addEventListener('click', function (e) {
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    } catch (err) { /* usa el href por defecto */ }
  });

  if (!p) {
    document.title = 'Producto no encontrado | SENSA';
    root.innerHTML =
      '<div class="py-space-xl text-center flex flex-col items-center gap-space-sm">' +
        '<h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">No encontramos ese producto</h1>' +
        '<p class="text-on-surface-variant">Puede que el enlace esté incompleto. Mira el catálogo completo.</p>' +
        '<a href="/#productos" class="squish-btn mt-2 px-7 py-3.5 rounded-full bg-graphite text-surface font-label-lg text-label-lg">Ver productos</a>' +
      '</div>';
    return;
  }

  document.title = p.name + ' | SENSA';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', p.name + ' - ' + p.description + ' Pídelo por Instagram ' + D.handle + '.');
  var og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', p.name + ' | SENSA');

  var catLabel = D.categoryLabel(p.category);
  var others = D.products.filter(function (x) { return x.slug !== p.slug; });

  var highlights = p.highlights ? (
    '<ul class="flex flex-col gap-2 mt-3">' + p.highlights.map(function (h) {
      return '<li class="flex items-center gap-2.5"><span class="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>' + S.esc(h) + '</li>';
    }).join('') + '</ul>') : '';

  var steps = D.steps.map(function (s, i) {
    var txt = S.esc(s).replace(S.esc(D.handle), '<a class="font-bold text-primary underline" href="' + D.instagram + '" target="_blank" rel="noopener">' + D.handle + '</a>');
    return '<p><strong class="text-on-surface">' + (i + 1) + '.</strong> ' + txt + '</p>';
  }).join('');

  function row(label, value, shaded) {
    return '<div class="grid grid-cols-2 gap-3 py-2 px-3 rounded-lg font-body-sm text-body-sm ' + (shaded ? 'bg-surface-container-low/60' : '') + '">' +
      '<span class="text-on-surface-variant font-semibold">' + label + '</span>' +
      '<span class="text-on-surface font-bold">' + value + '</span></div>';
  }

  function accordion(id, title, body, open) {
    return '' +
      '<div class="acc rounded-lg bg-surface-container-lowest overflow-hidden shadow-[0_8px_24px_-4px_rgba(42,40,51,0.04)]' + (open ? ' acc-open' : '') + '">' +
        '<button type="button" class="w-full px-space-md py-4 flex items-center justify-between text-left active:bg-surface-container-low transition-colors" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="' + id + '" data-acc>' +
          '<span class="font-title-md text-title-md text-on-surface font-bold">' + title + '</span>' +
          '<span class="acc-icon material-symbols-outlined text-on-surface-variant text-[20px]">' + (open ? 'remove' : 'add') + '</span>' +
        '</button>' +
        '<div id="' + id + '" class="acc-panel px-space-md pb-5 pt-1 text-on-surface-variant font-body-md text-body-md leading-relaxed">' + body + '</div>' +
      '</div>';
  }

  root.innerHTML =
    '<nav aria-label="Breadcrumb" class="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant pt-4 flex-wrap">' +
      '<a class="hover:text-primary transition-colors" href="/">Inicio</a><span class="text-outline-variant font-bold">›</span>' +
      '<a class="hover:text-primary transition-colors" href="/#productos">' + catLabel + '</a><span class="text-outline-variant font-bold">›</span>' +
      '<span class="text-on-surface font-semibold">' + S.esc(p.name) + '</span>' +
    '</nav>' +

    '<div class="mt-space-sm lg:grid lg:grid-cols-2 lg:gap-margin-lg lg:items-start">' +
      '<section aria-label="Foto del producto" class="lg:sticky lg:top-24">' +
        '<div class="relative w-full aspect-square bg-surface-container rounded-lg overflow-hidden shadow-rest flex items-center justify-center p-space-md">' +
          '<img id="main-img" src="' + p.image + '" alt="' + S.esc(p.alt) + '" class="tray-img' + (p.blend ? ' blend' : '') + ' w-full h-full object-contain rounded-xl">' +
        '</div>' +
      '</section>' +

      '<div class="flex flex-col gap-space-md mt-space-md lg:mt-0">' +
        '<section class="flex flex-col gap-space-xs">' +
          '<div class="flex items-center justify-between gap-3">' +
            '<span class="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-bold">' + S.esc(p.kicker) + '</span>' +
            '<span class="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold text-on-surface"><span class="w-2 h-2 rounded-full bg-tertiary"></span>En stock</span>' +
          '</div>' +
          '<h1 class="font-display-lg-mobile text-display-lg-mobile lg:font-display-lg lg:text-display-lg text-on-surface tracking-tight mt-0.5">' + S.esc(p.name) + '</h1>' +
          '<div class="flex items-center gap-3 flex-wrap my-1">' +
            '<span class="font-headline-md text-headline-md font-bold text-on-surface leading-none">' + D.money(p.price) + '</span>' +
            '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>' + S.esc(p.badge) + '</span>' +
          '</div>' +
          '<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">' + S.esc(p.description) + '</p>' +
        '</section>' +

        '<section class="flex flex-col gap-space-xs" aria-label="Color">' +
          '<div class="font-label-lg text-label-lg text-on-surface">Color: <strong class="text-primary font-bold">' + S.esc(p.colorLabel) + '</strong></div>' +
          '<div class="flex items-center">' + p.dots.map(function (c) {
            return '<span class="w-8 h-8 rounded-full -ml-2 first:ml-0 border-2 border-surface shadow-sm" style="background:' + c + '"></span>';
          }).join('') + '</div>' +
        '</section>' +

        '<section class="flex flex-col gap-space-sm">' +
          '<div class="flex items-center gap-3">' +
            '<div class="h-14 px-2 rounded-full bg-surface-container-high flex items-center gap-2 shadow-inner">' +
              '<button type="button" id="qty-dec" aria-label="Disminuir cantidad" class="squish-btn w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center font-bold text-title-md hover:bg-surface-dim">−</button>' +
              '<span id="qty-val" aria-live="polite" class="font-headline-sm text-headline-sm text-on-surface w-6 text-center">1</span>' +
              '<button type="button" id="qty-inc" aria-label="Aumentar cantidad" class="squish-btn w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center font-bold text-title-md hover:bg-surface-dim">+</button>' +
            '</div>' +
            '<button type="button" id="add-btn" class="squish-btn flex-1 h-14 rounded-full bg-graphite text-surface hover:bg-inverse-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(42,40,51,0.2)]">' +
              '<span class="material-symbols-outlined text-[22px]">add_shopping_cart</span><span>Agregar al pedido</span>' +
            '</button>' +
          '</div>' +
          '<a href="' + D.instagram + '" target="_blank" rel="noopener" class="squish-btn w-full py-3.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center gap-2.5 font-label-lg text-label-lg font-bold shadow-[0_2px_6px_-1px_rgba(185,167,232,0.18)]">' +
            '<span class="material-symbols-outlined text-primary text-[20px]">send</span><span>Pedir ahora por Instagram</span>' +
          '</a>' +
          '<div class="flex items-center justify-center pt-1">' +
            '<button type="button" id="copy-link" class="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">' +
              '<span class="material-symbols-outlined text-[16px]">link</span><span id="copy-link-text">Copiar link de este producto</span>' +
            '</button>' +
          '</div>' +
        '</section>' +

        '<section class="flex flex-col gap-2" id="accordions">' +
          accordion('acc-desc', 'Descripción y experiencia táctil', '<p>' + S.esc(p.description) + '</p>' + highlights + '<p class="mt-3 font-semibold text-on-surface">' + S.esc(p.colorNote) + '</p>', false) +
          accordion('acc-det', 'Detalles',
            '<div class="flex flex-col gap-1">' +
              row('Precio', D.money(p.price), true) +
              row('Disponibilidad', 'En stock', false) +
              row('Color', S.esc(p.colorLabel), true) +
              row('Compra', 'Por Instagram ' + D.handle, false) +
            '</div>', true) +
          accordion('acc-buy', 'Cómo comprar por Instagram', '<div class="flex flex-col gap-2">' + steps + '</div>', false) +
        '</section>' +
      '</div>' +
    '</div>' +

    '<section class="flex flex-col gap-space-sm pt-space-lg" aria-labelledby="related-title">' +
      '<div class="flex items-center justify-between">' +
        '<h2 id="related-title" class="font-headline-sm text-headline-sm text-on-surface tracking-tight">También te puede gustar</h2>' +
        '<a class="font-label-md text-label-md text-primary font-bold hover:underline" href="/#productos">Ver catálogo</a>' +
      '</div>' +
      '<div class="grid grid-cols-2 lg:grid-cols-3 gap-3">' + others.map(S.relatedHTML).join('') + '</div>' +
    '</section>';

  /* ---------- Interacciones ---------- */
  var qty = 1;
  var qtyVal = document.getElementById('qty-val');
  function setQty(n) { qty = Math.max(1, Math.min(20, n)); qtyVal.textContent = qty; }
  document.getElementById('qty-dec').addEventListener('click', function () { setQty(qty - 1); });
  document.getElementById('qty-inc').addEventListener('click', function () { setQty(qty + 1); });
  document.getElementById('add-btn').addEventListener('click', function () {
    S.Cart.add(p.slug, qty);
    S.toast('¡Agregado al pedido con calma!');
    setQty(1);
  });

  var copyBtnText = document.getElementById('copy-link-text');
  document.getElementById('copy-link').addEventListener('click', function () {
    S.copyText(location.origin + '/producto/' + p.slug).then(function () {
      copyBtnText.textContent = '¡Link copiado!';
      setTimeout(function () { copyBtnText.textContent = 'Copiar link de este producto'; }, 2000);
    }).catch(function () { S.toast('No se pudo copiar el link'); });
  });

  document.getElementById('accordions').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-acc]');
    if (!btn) return;
    var box = btn.closest('.acc');
    var open = box.classList.toggle('acc-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.acc-icon').textContent = open ? 'remove' : 'add';
  });
})();

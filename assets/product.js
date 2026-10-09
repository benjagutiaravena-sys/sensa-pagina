// SENSA · página de detalle: /producto/<slug>
(function () {
  var D = window.SENSA;
  var S = window.Sensa;
  var root = document.getElementById('product-root');
  if (!root) return;

  var match = location.pathname.match(/\/producto\/([^\/?#]+)/);
  var slug = match ? decodeURIComponent(match[1]) : (new URLSearchParams(location.search).get('p') || '');
  // Si el link es de un producto que se fusionó con otro, lleva al producto vigente.
  if (D.aliases[slug]) { location.replace('/producto/' + D.aliases[slug] + location.search + location.hash); return; }
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
  var hasPrice = p.price != null;
  var inStock = p.stock === 'En stock';
  // Relacionados: primero los de la misma categoría, luego el resto (máx. 4).
  var others = D.products.filter(function (x) { return x.slug !== p.slug; });
  others.sort(function (a, b) { return (b.category === p.category) - (a.category === p.category); });
  others = others.slice(0, 4);

  // Galería: la foto principal primero y las secundarias después.
  var gallery = [{ src: p.image, alt: p.alt }].concat(p.moreImages || []);
  var multi = gallery.length > 1;
  var arrowBtn = function (id, side, icon, label) {
    return '<button type="button" id="' + id + '" aria-label="' + label + '" class="squish-btn absolute ' + side + '-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-container-lowest/90 text-on-surface shadow-rest flex items-center justify-center">' +
      '<span class="material-symbols-outlined text-[20px]">' + icon + '</span></button>';
  };
  var thumbsHTML = multi ?
    '<div id="thumbs" class="flex items-center gap-3 overflow-x-auto no-scrollbar p-1" role="group" aria-label="Fotos del producto">' +
      gallery.map(function (g, i) {
        return '<button type="button" data-thumb="' + i + '" aria-label="Ver foto ' + (i + 1) + ' de ' + gallery.length + '" class="thumb shrink-0 w-20 h-20 rounded-DEFAULT overflow-hidden bg-surface-container p-1 transition-all">' +
          '<img src="' + g.src + '" alt="' + S.esc(g.alt) + '" loading="lazy" class="w-full h-full object-contain rounded-[12px]"></button>';
      }).join('') +
    '</div>' : '';

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

  /* ---------- Selectores (solo si el producto tiene datos) ---------- */
  var variantHTML = D.hasVariants(p) ?
    '<section id="sel-variant" class="flex flex-col gap-space-xs rounded-lg" aria-label="Versión">' +
      '<div class="font-label-lg text-label-lg text-on-surface">Versión: <strong id="variant-label" class="text-primary font-bold">Elige una versión</strong></div>' +
      '<div role="radiogroup" aria-label="Versión" class="grid grid-cols-2 gap-2 pt-1">' +
        p.variants.map(function (v) {
          return '<button type="button" role="radio" aria-checked="false" data-variant="' + v.id + '" class="opt-pill squish-btn h-12 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-md text-label-md">' + S.esc(v.name) + '</button>';
        }).join('') +
      '</div>' +
    '</section>' : '';

  var colorHTML = D.hasColors(p) ?
    '<section id="sel-color" class="flex flex-col gap-space-xs rounded-lg" aria-label="Color">' +
      '<div class="flex items-center justify-between font-label-lg text-label-lg">' +
        '<span class="text-on-surface">Color: <strong id="color-label" class="text-primary font-bold">Elige un color</strong><span id="color-status" class="ml-2 font-label-md text-label-md font-bold"></span></span>' +
        '<span id="color-count" class="font-label-sm text-label-sm text-on-surface-variant"></span>' +
      '</div>' +
      '<div id="swatch-row" role="radiogroup" aria-label="Colores" class="swatch-row pt-5 pb-1"></div>' +
    '</section>' : '';

  // Color al azar: se muestran los colores que pueden salir, sin selección.
  function chipList(list) {
    return '<ul class="flex flex-wrap gap-2 pt-1" aria-label="Colores que pueden salir">' +
      list.map(function (c) {
        return '<li class="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-surface-container-low font-label-md text-label-md text-on-surface">' +
          '<span class="w-5 h-5 rounded-full" style="background:' + D.swatchBg(c) + ';box-shadow:inset 0 0 0 1px rgba(28,26,37,0.18)"></span>' + S.esc(c.name) + '</li>';
      }).join('') + '</ul>';
  }
  // Grupos (p. ej. Glitter / Mate) en el orden en que aparecen; sin grupos, una sola lista.
  function randomGroups() {
    var groups = [];
    p.randomColors.forEach(function (c) {
      var name = c.group || '';
      var g = groups.filter(function (x) { return x.name === name; })[0];
      if (!g) { g = { name: name, colors: [] }; groups.push(g); }
      g.colors.push(c);
    });
    return groups;
  }
  var randomChips = p.randomColors ?
    '<p class="font-body-sm text-body-sm text-on-surface-variant pt-1">Pueden salirte estos tipos y colores:</p>' +
    randomGroups().map(function (g) {
      return (g.name ? '<p class="font-label-md text-label-md font-bold text-on-surface pt-2">' + S.esc(g.name) + '</p>' : '') + chipList(g.colors);
    }).join('') : '';
  var staticColor = (!D.hasColors(p) && p.colorLabel) ?
    '<section class="flex flex-col gap-space-xs" aria-label="Color"><div class="font-label-lg text-label-lg text-on-surface">Color: <strong class="text-primary font-bold">' + S.esc(p.colorLabel) + '</strong></div>' + randomChips + '</section>' : '';

  /* ---------- Compra ---------- */
  var buyHTML = hasPrice ?
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
    '<button type="button" id="ig-btn" class="squish-btn w-full py-3.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center gap-2.5 font-label-lg text-label-lg font-bold shadow-[0_2px_6px_-1px_rgba(185,167,232,0.18)]">' +
      '<span class="material-symbols-outlined text-primary text-[20px]">send</span><span>Pedir ahora por Instagram</span>' +
    '</button>'
  :
    '<button type="button" id="ig-btn" class="squish-btn w-full h-14 rounded-full bg-graphite text-surface hover:bg-inverse-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(42,40,51,0.2)]">' +
      '<span class="material-symbols-outlined text-[22px]">send</span><span>Consultar precio por Instagram</span>' +
    '</button>';

  /* ---------- Detalles ---------- */
  function names(list) { return list.map(function (c) { return c.name; }).join(', '); }
  // "Glitter: Dorado, Vino · Mate: Rosado, Celeste" para los colores al azar agrupados por tipo.
  function randomSummary() {
    return randomGroups().map(function (g) { return (g.name ? g.name + ': ' : '') + names(g.colors); }).join(' · ');
  }
  // "Glitter: Dorado, Vino · Mate: Rosado, Celeste" si los colores dependen de la versión; si no, lista simple.
  function colorsSummary() {
    if (D.hasVariants(p) && p.colors.some(function (c) { return c.variants; })) {
      return p.variants.map(function (v) { return v.name + ': ' + names(D.colorsFor(p, v.id)); }).join(' · ');
    }
    return names(p.colors);
  }
  var detailRows = [row('Precio', D.priceText(p), true), row('Disponibilidad', S.esc(p.stock), false)];
  var shade = true;
  if (D.hasVariants(p)) { detailRows.push(row('Versiones', S.esc(p.variants.map(function (v) { return v.name; }).join(' y ')), shade)); shade = !shade; }
  if (D.hasColors(p)) { detailRows.push(row('Colores', S.esc(colorsSummary()), shade)); shade = !shade; }
  else if (p.randomColors) { detailRows.push(row('Tipo y color al azar', S.esc(randomSummary()), shade)); shade = !shade; }
  else if (p.colorLabel) { detailRows.push(row('Color', S.esc(p.colorLabel), shade)); shade = !shade; }
  detailRows.push(row('Compra', 'Por Instagram ' + D.handle, shade));

  var descExtra = D.hasColors(p)
    ? '<p class="mt-3 font-semibold text-on-surface">Colores: ' + S.esc(colorsSummary()) + '.</p>'
    : p.randomColors ? '<p class="mt-3 font-semibold text-on-surface">Tipo y color al azar: ' + S.esc(randomSummary()) + '.</p>'
    : (p.colorNote ? '<p class="mt-3 font-semibold text-on-surface">' + S.esc(p.colorNote) + '</p>' : '');

  root.innerHTML =
    '<nav aria-label="Breadcrumb" class="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant pt-4 flex-wrap">' +
      '<a class="hover:text-primary transition-colors" href="/">Inicio</a><span class="text-outline-variant font-bold">›</span>' +
      '<a class="hover:text-primary transition-colors" href="/#productos">' + catLabel + '</a><span class="text-outline-variant font-bold">›</span>' +
      '<span class="text-on-surface font-semibold">' + S.esc(p.name) + '</span>' +
    '</nav>' +

    '<div class="mt-space-sm lg:grid lg:grid-cols-2 lg:gap-margin-lg lg:items-start">' +
      '<section aria-label="Fotos del producto" class="lg:sticky lg:top-24 flex flex-col gap-space-sm">' +
        '<div class="relative w-full aspect-square bg-surface-container rounded-lg overflow-hidden shadow-rest flex items-center justify-center p-space-md">' +
          '<img id="main-img" src="' + p.image + '" alt="' + S.esc(p.alt) + '" class="tray-img' + (p.blend ? ' blend' : '') + ' w-full h-full object-contain rounded-xl transition-opacity duration-200">' +
          (multi ? arrowBtn('img-prev', 'left', 'arrow_back', 'Foto anterior') + arrowBtn('img-next', 'right', 'arrow_forward', 'Foto siguiente') : '') +
        '</div>' +
        thumbsHTML +
      '</section>' +

      '<div class="flex flex-col gap-space-md mt-space-md lg:mt-0">' +
        '<section class="flex flex-col gap-space-xs">' +
          '<div class="flex items-center justify-between gap-3">' +
            '<span class="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-bold">' + S.esc(p.kicker) + '</span>' +
            '<span id="stock-pill" class="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold text-on-surface"><span id="stock-dot" class="w-2 h-2 rounded-full ' + (inStock ? 'bg-tertiary' : 'bg-secondary') + '"></span><span id="stock-text">' + S.esc(p.stock) + '</span></span>' +
          '</div>' +
          '<h1 class="font-display-lg-mobile text-display-lg-mobile lg:font-display-lg lg:text-display-lg text-on-surface tracking-tight mt-0.5">' + S.esc(p.name) + '</h1>' +
          '<div class="flex items-center gap-3 flex-wrap my-1">' +
            '<span class="font-headline-md text-headline-md font-bold leading-none ' + (hasPrice ? 'text-on-surface' : 'text-primary') + '">' + D.priceText(p) + '</span>' +
            '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>' + S.esc(p.badge) + '</span>' +
          '</div>' +
          '<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">' + S.esc(p.description) + '</p>' +
        '</section>' +

        variantHTML + colorHTML + staticColor +

        '<section class="flex flex-col gap-space-sm" id="opciones">' +
          buyHTML +
          '<div class="flex items-center justify-center pt-1">' +
            '<button type="button" id="copy-link" class="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">' +
              '<span class="material-symbols-outlined text-[16px]">link</span><span id="copy-link-text">Copiar link de este producto</span>' +
            '</button>' +
          '</div>' +
        '</section>' +

        '<section class="flex flex-col gap-2" id="accordions">' +
          accordion('acc-desc', 'Descripción y experiencia táctil', '<p>' + S.esc(p.description) + '</p>' + highlights + descExtra, false) +
          accordion('acc-det', 'Detalles', '<div class="flex flex-col gap-1">' + detailRows.join('') + '</div>', true) +
          accordion('acc-buy', 'Cómo comprar por Instagram', '<div class="flex flex-col gap-2">' + steps + '</div>', false) +
        '</section>' +
      '</div>' +
    '</div>' +

    '<section class="flex flex-col gap-space-sm pt-space-lg" aria-labelledby="related-title">' +
      '<div class="flex items-center justify-between">' +
        '<h2 id="related-title" class="font-headline-sm text-headline-sm text-on-surface tracking-tight">También te puede gustar</h2>' +
        '<a class="font-label-md text-label-md text-primary font-bold hover:underline" href="/#productos">Ver catálogo</a>' +
      '</div>' +
      '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">' + others.map(S.relatedHTML).join('') + '</div>' +
    '</section>';

  /* ---------- Selección de versión / color ---------- */
  var state = { variant: null, color: null };
  var mainImg = document.getElementById('main-img');
  var current = 0;

  function show(i, srcOverride) {
    current = (i + gallery.length) % gallery.length;
    var g = gallery[current];
    mainImg.style.opacity = '0.4';
    setTimeout(function () {
      mainImg.src = srcOverride || g.src;
      mainImg.alt = g.alt;
      mainImg.style.opacity = '1';
    }, 120);
    document.querySelectorAll('[data-thumb]').forEach(function (b) {
      var on = Number(b.getAttribute('data-thumb')) === current;
      b.classList.toggle('shadow-[0_0_0_2.5px_#2A2833]', on);
      b.classList.toggle('opacity-70', !on);
    });
  }
  if (multi) {
    show(0);
    document.getElementById('img-prev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('img-next').addEventListener('click', function () { show(current + 1); });
    document.getElementById('thumbs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-thumb]');
      if (b) show(Number(b.getAttribute('data-thumb')));
    });
    // Las fotos se alternan solas con fundido hasta que la persona toque la galería (salvo las marcadas "still").
    var loop = gallery.map(function (g, i) { return g.still ? -1 : i; }).filter(function (i) { return i !== -1; });
    if (loop.length > 1 && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var auto = setInterval(function () {
        if (document.hidden) return;
        var at = loop.indexOf(current);
        show(loop[(at + 1) % loop.length]);
      }, 3800);
      ['img-prev', 'img-next', 'thumbs'].forEach(function (id) {
        document.getElementById(id).addEventListener('click', function () { clearInterval(auto); });
      });
    }
  }

  function markChecked(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      var on = el.getAttribute(attr) === value;
      el.setAttribute('aria-checked', on ? 'true' : 'false');
      if (el.classList.contains('opt-pill')) {
        el.classList.toggle('bg-graphite', on);
        el.classList.toggle('text-surface', on);
        el.classList.toggle('bg-surface-container-high', !on);
        el.classList.toggle('text-on-surface', !on);
      }
    });
  }

  // Pinta los colores disponibles para la versión elegida (todos, si el producto no tiene versiones).
  var swatchRow = document.getElementById('swatch-row');
  function renderColors() {
    if (!swatchRow) return;
    var needVariant = D.hasVariants(p) && !state.variant && p.colors.some(function (c) { return c.variants; });
    var list = needVariant ? [] : D.colorsFor(p, state.variant);
    document.getElementById('color-count').textContent = needVariant ? '' : list.length + ' colores';
    if (needVariant) {
      swatchRow.className = 'pt-2 pb-1 font-body-sm text-body-sm text-on-surface-variant';
      swatchRow.innerHTML = 'Elige primero una versión para ver sus colores.';
      return;
    }
    swatchRow.className = 'swatch-row pt-5 pb-1';
    swatchRow.innerHTML = list.map(function (c) {
      var on = c.id === state.color;
      var st = D.stockState(p, c.id), tag = D.stockLabel(st);
      var full = c.name + (tag ? ' · ' + tag : '');
      return '<button type="button" role="radio" aria-checked="' + on + '" aria-label="' + S.esc(full) + '" data-color="' + c.id + '" data-name="' + S.esc(full) + '" class="swatch' + (st === 'out' ? ' is-out' : st === 'low' ? ' is-low' : '') + '"><span style="background:' + D.swatchBg(c) + '"></span></button>';
    }).join('');
  }
  function setColorLabel() {
    var el = document.getElementById('color-label');
    if (el) el.textContent = state.color ? D.color(p, state.color).name : 'Elige un color';
  }
  renderColors();

  document.querySelectorAll('[data-variant]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.variant = btn.getAttribute('data-variant');
      markChecked('[data-variant]', 'data-variant', state.variant);
      var v = D.variant(p, state.variant);
      document.getElementById('variant-label').textContent = v.name;
      // Si el color elegido no existe en esta versión, se limpia.
      if (state.color && !D.colorsFor(p, state.variant).some(function (c) { return c.id === state.color; })) state.color = null;
      renderColors();
      setColorLabel();
      // Muestra la foto de esa versión si la hay.
      if (multi && v.photo != null && v.photo < gallery.length) show(v.photo);
      updateBuy();
    });
  });
  if (swatchRow) swatchRow.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-color]');
    if (!btn) return;
    state.color = btn.getAttribute('data-color');
    var c = D.color(p, state.color);
    markChecked('[data-color]', 'data-color', state.color);
    setColorLabel();
    // Foto propia del color si existe; si no, queda la foto que se está viendo.
    show(current, c.image || null);
    updateBuy();
  });

  // Devuelve el id de la sección que falta elegir (o '' si todo está elegido).
  function missingSection() {
    if (D.hasVariants(p) && !state.variant) return 'sel-variant';
    if (D.colorsFor(p, state.variant).length && !state.color) return 'sel-color';
    return '';
  }
  function warnMissing(sectionId) {
    var el = document.getElementById(sectionId);
    S.toast(sectionId === 'sel-variant' ? 'Elige una versión primero' : 'Elige un color primero');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('need-pick');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('need-pick');
    setTimeout(function () { el.classList.remove('need-pick'); }, 1800);
  }

  /* ---------- Stock en vivo ---------- */
  var addBtn = document.getElementById('add-btn');
  var igBtn = document.getElementById('ig-btn');
  [addBtn, igBtn].forEach(function (b) {
    if (b) b.setAttribute('data-label', b.querySelector('span:last-child').textContent);
  });
  // Estado de lo elegido: el color seleccionado o, si no hay color, el del producto.
  function currentStock() {
    var hasCol = D.colorsFor(p, state.variant).length > 0;
    return hasCol && state.color ? D.stockState(p, state.color) : D.stockState(p);
  }
  function updateBuy() {
    var prod = D.stockState(p);
    var pillText = prod === 'out' ? 'Agotado' : prod === 'low' ? '¡Últimas unidades!' : p.stock;
    document.getElementById('stock-text').textContent = pillText;
    document.getElementById('stock-dot').className = 'w-2 h-2 rounded-full ' + (prod === 'out' ? 'bg-error' : prod === 'low' ? 'bg-secondary' : (inStock ? 'bg-tertiary' : 'bg-secondary'));
    var st = currentStock();
    var status = document.getElementById('color-status');
    if (status) {
      var sel = state.color ? D.stockState(p, state.color) : 'unknown';
      status.textContent = D.stockLabel(sel);
      status.className = 'ml-2 font-label-md text-label-md font-bold ' + (sel === 'out' ? 'text-error' : 'text-secondary');
    }
    var blocked = st === 'out';
    [addBtn, igBtn].forEach(function (b) {
      if (!b) return;
      b.disabled = blocked;
      b.classList.toggle('buy-disabled', blocked);
      b.querySelector('span:last-child').textContent = blocked ? 'Agotado' : b.getAttribute('data-label');
    });
  }
  document.addEventListener('sensa:stock', function () {
    renderColors();
    setColorLabel();
    updateBuy();
  });
  updateBuy();

  /* ---------- Compra ---------- */
  var qty = 1;
  var qtyVal = document.getElementById('qty-val');
  function setQty(n) { qty = Math.max(1, Math.min(20, n)); if (qtyVal) qtyVal.textContent = qty; }
  if (qtyVal) {
    document.getElementById('qty-dec').addEventListener('click', function () { setQty(qty - 1); });
    document.getElementById('qty-inc').addEventListener('click', function () { setQty(qty + 1); });
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var miss = missingSection();
      if (miss) { warnMissing(miss); return; }
      if (S.Cart.add(p.slug, qty, { variant: state.variant, color: state.color })) {
        S.toast('¡Agregado al pedido con calma!');
        setQty(1);
      }
    });
  }

  // Texto listo para pegar en el chat de Instagram, con producto, versión y color.
  function igMessage() {
    var label = D.optionLabel({ colors: p.colors, variants: p.variants, colorLabel: '' }, { variant: state.variant, color: state.color });
    if (!label && p.randomColors) label = 'color al azar';
    var what = p.name + (label ? ' – ' + label : '');
    if (!hasPrice) return 'Hola SENSA! Quiero consultar el precio del ' + what + '.';
    return qty > 1
      ? 'Hola SENSA! Quiero ' + qty + ' unidades del ' + what + '.'
      : 'Hola SENSA! Quiero el ' + what + '.';
  }
  document.getElementById('ig-btn').addEventListener('click', function () {
    var miss = missingSection();
    if (miss) { warnMissing(miss); return; }
    S.sendToInstagram(igMessage(), '¡Mensaje copiado! Pégalo en el chat de ' + D.handle);
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

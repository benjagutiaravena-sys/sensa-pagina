// Datos reales del catálogo SENSA (única fuente de verdad para home, detalle y pedido).
//
// Campos de cada producto:
//   price       número en CLP, o null si aún no hay precio (se muestra "Consultar precio").
//   colors      lista de colores elegibles [{ id, name, hex | swatch, image? }]. Si está vacía NO se muestra selector.
//               `image` (opcional) = foto propia de ese color; si falta se usa la foto principal.
//   randomColors colores que pueden salir cuando el color es al azar [{ id, name, hex }]; solo informativos, no se eligen.
//   variants    versiones elegibles [{ id, name }] (ej. Glitter / Mate). Si no hay, no se muestra selector.
//   colorLabel  texto informativo cuando el producto no tiene selector de color.
//   cycle       (opcional) N = las primeras N fotos se alternan solas con fundido, en el catálogo y en la página del producto.
//   stock       texto de disponibilidad.
//   soldOut     true = agotado a mano (tiene prioridad sobre la hoja de stock). Quitar la línea para volver a venderlo.
(function () {
  // Tonos de los swatches (se reutilizan entre productos).
  var C = {
    naranjo:  { id: 'naranjo',  name: 'Naranjo',  hex: '#F28C28' },
    morado:   { id: 'morado',   name: 'Morado',   hex: '#8E5BC4' },
    verde:    { id: 'verde',    name: 'Verde',    hex: '#62BE4A' },
    verdeAgua:{ id: 'verde-agua', name: 'Verde agua', hex: '#35C4B3' },
    azul:     { id: 'azul',     name: 'Azul',     hex: '#2F80E0' },
    rosado:   { id: 'rosado',   name: 'Rosado',   hex: '#F05DA0' },
    celeste:  { id: 'celeste',  name: 'Celeste',  hex: '#7CCBF2' },
    amarillo: { id: 'amarillo', name: 'Amarillo', hex: '#F7D84A' },
    // Rosa muy pálido y semitransparente (sobre un damero para que se note la transparencia)
    rosadoClaroTransp: {
      id: 'rosado-claro-transparente',
      name: 'Rosado claro transparente',
      hex: '#F8C6DC',
      swatch: 'linear-gradient(rgba(250,176,208,0.42), rgba(250,176,208,0.42)), conic-gradient(#ffffff 25%, #e6e0ee 0 50%, #ffffff 0 75%, #e6e0ee 0) 0 0 / 10px 10px'
    }
  };

  // Fidget cube: cada combinación es cuerpo + detalles (swatch dividido en dos tonos).
  function duo(id, name, body, accent) {
    return { id: id, name: name, hex: body, swatch: 'linear-gradient(135deg, ' + body + ' 0 50%, ' + accent + ' 50% 100%)' };
  }
  var FIDGET_COLORS = [
    duo('celeste-negro',   'Celeste y negro',    '#3FA9E6', '#1F1F24'),
    duo('negro-azul',      'Negro y azul',       '#1F1F24', '#2F6FE0'),
    duo('morado-negro',    'Morado y negro',     '#8E7BD1', '#1F1F24'),
    duo('blanco-negro',    'Blanco y negro',     '#F6F4F0', '#1F1F24'),
    duo('rosado-negro',    'Rosado y negro',     '#EF6F9E', '#1F1F24'),
    duo('blanco-amarillo', 'Blanco y amarillo',  '#F6F4F0', '#F2C94C'),
    duo('blanco-verde',    'Blanco y verde',     '#F6F4F0', '#5ECB8B'),
    duo('blanco-naranjo',  'Blanco y naranjo',   '#F6F4F0', '#F28C28'),
    duo('gris-negro',      'Gris y negro',       '#7B7F85', '#1F1F24'),
    duo('gris-rojo',       'Gris y rojo',        '#7B7F85', '#C0153F'),
    duo('negro-verde',     'Negro y verde',      '#1F1F24', '#4DBE7A'),
    duo('verde-lima-negro','Verde lima y negro', '#8FE06F', '#1F1F24')
  ];
  // Dumplings: colores que pueden salir en cada tipo (todo es al azar).
  var DUMPLING_COLORS = {
    glitter: [
      { id: 'glitter-dorado',   name: 'Dorado',   hex: '#B98A2E' },
      { id: 'glitter-vino',     name: 'Vino',     hex: '#8C2A4B' },
      { id: 'glitter-naranjo',  name: 'Naranjo',  hex: '#F28C28' },
      { id: 'glitter-rosado',   name: 'Rosado',   hex: '#F2607F' },
      { id: 'glitter-turquesa', name: 'Turquesa', hex: '#3AAFB9' }
    ],
    mate: [
      { id: 'mate-rosado',   name: 'Rosado',   hex: '#F4A3C0' },
      { id: 'mate-amarillo', name: 'Amarillo', hex: '#F7D84A' },
      { id: 'mate-celeste',  name: 'Celeste',  hex: '#7CCBF2' },
      { id: 'mate-blanco',   name: 'Blanco',   hex: '#FFFFFF' }
    ]
  };

  function tag(list, group) {
    return list.map(function (c) { return { id: c.id, name: c.name, hex: c.hex, group: group }; });
  }

  window.SENSA = {
    handle: '@sensa.usm',
    instagram: 'https://www.instagram.com/sensa.usm',
    categories: [
      { id: 'squishies', label: 'Squishies' },
      { id: 'gel', label: 'Gel' },
      { id: 'fidgets', label: 'Fidgets' }
    ],
    products: [
      {
        slug: 'butter-squishy',
        name: 'Butter Squishy',
        price: 3500,
        category: 'squishies',
        kicker: 'Squishies slow rising',
        badge: 'Slow rising',
        badgeClass: 'bg-primary-fixed text-on-primary-fixed',
        image: '/images/opt/butter.webp',
        alt: 'Butter Squishy, squishy con forma de barra de mantequilla',
        blend: false,
        stock: 'En stock',
        colors: [],
        colorLabel: 'Color único',
        colorNote: 'Color único.',
        dots: ['#F6DC8C'],
        description: 'Suave, blandito y satisfactorio de apretar. Su efecto slow rising hace que recupere lentamente su forma.',
        highlights: ['Suave al tacto', 'Efecto slow rising', 'Fácil de llevar', 'Perfecto para tus pausas SENSA']
      },
      {
        // Cubo gel liso (caja "Cube Squeeze"). Se mantiene el slug original para no romper links ya compartidos.
        slug: 'cubo-gel',
        name: 'Cubo Gel Liso',
        price: 3000,
        category: 'gel',
        kicker: 'Gel liso · Cube Squeeze',
        badge: 'Gel translúcido',
        badgeClass: 'bg-surface-container-highest text-on-surface',
        image: '/images/opt/gel-cube.webp',
        alt: 'Cubo gel liso verde translúcido junto a su caja Cube Squeeze',
        // Fotos secundarias (galería de la página de producto)
        moreImages: [
          { src: '/images/opt/cubo-gel-liso-6-colores-sf.webp', alt: 'Seis cubos gel lisos en sus cajas Cube Squeeze: azul, verde agua, verde, morado, rosado y naranjo' }
        ],
        blend: false,
        stock: 'En stock',
        colors: [C.naranjo, C.morado, C.verde, C.verdeAgua, C.azul, C.rosado],
        description: 'Cubo de gel súper sólido, transparente y colorido. Ideal para apretar y liberar tensión.'
      },
      {
        slug: 'cubo-gel-cinta',
        name: 'Cubo Gel con Cinta',
        price: 3000, // mismo precio que el Cubo Gel Liso
        category: 'gel',
        kicker: 'Gel con cinta holográfica',
        badge: 'Cinta holográfica',
        badgeClass: 'bg-surface-container-highest text-on-surface',
        image: '/images/opt/cubo-gel-cinta-colores-sf.webp',
        alt: 'Cubos gel con cinta holográfica en sus cajas Cube Squeeze: celeste, rosado, amarillo y morado, con uno amarillo fuera de la caja',
        // cycle: las primeras N fotos (la principal + las siguientes) se van alternando solas con un fundido
        cycle: 2,
        moreImages: [
          { src: '/images/opt/cubo-gel-cinta.webp', alt: 'Cubo gel transparente con cinta holográfica en su interior junto a su caja Squish Cube' },
          { src: '/images/opt/cubo-gel-cinta-colores-1.webp', alt: 'Cubos gel con cinta holográfica en sus cajas Cube Squeeze: celeste, rosado, amarillo y morado' },
          { src: '/images/opt/cubo-gel-cinta-colores-2.webp', alt: 'Cuatro cubos gel con cinta holográfica en sus cajas Cube Squeeze' }
        ],
        blend: false,
        stock: 'En stock',
        colors: [C.rosadoClaroTransp, C.morado, C.celeste, C.amarillo],
        description: 'Cubo de gel transparente con cinta holográfica en su interior, para apretar y liberar tensión.'
      },
      {
        slug: 'cubo-antiestres-sensorial',
        name: 'Cubo Antiestrés Sensorial',
        price: 2300,
        category: 'fidgets',
        kicker: 'Fidget táctil',
        badge: '6 lados',
        badgeClass: 'bg-surface-container-highest text-on-surface',
        image: '/images/opt/fidget-cube.webp',
        alt: 'Cubo Antiestrés Sensorial con botones, palanca y bola metálica, junto a su caja',
        // Fotos secundarias (galería de la página de producto)
        moreImages: [
          { src: '/images/opt/fidget-cube-colores.webp', alt: 'Cubos antiestrés sensoriales en blanco con fucsia, morado y rosado, junto a su caja' },
          { src: '/images/opt/fidget-cubos-12-colores-sf.webp', alt: 'Doce cubos antiestrés sensoriales de distintos colores dispuestos en círculo' },
          { src: '/images/opt/fidget-cubos-colores-2.webp', alt: 'Seis cubos antiestrés sensoriales en fila de distintos colores' }
        ],
        blend: false,
        stock: 'En stock',
        colors: FIDGET_COLORS,
        description: '6 lados con diferentes texturas y mecanismos sensoriales para mantener tus manos ocupadas y tu mente enfocada.'
      },
      {
        slug: 'dumplings',
        name: 'Dumplings',
        price: 3200,
        category: 'squishies',
        kicker: 'Squishy suave y esponjoso',
        badge: 'Kawaii',
        badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        image: '/images/opt/dumpling.webp',
        alt: 'Dumpling squishy morado con glitter y carita kawaii, junto a su caja de bambú',
        // Fotos secundarias (galería de la página de producto)
        moreImages: [
          { src: '/images/opt/dumplings-glitter-colores-sf.webp', alt: 'Cinco dumplings squishy con glitter en sus cajas de bambú: dorado, vino, naranjo, rosado y turquesa' },
          { src: '/images/opt/dumplings-mate-colores-sf.webp', alt: 'Cuatro dumplings squishy mate en sus cajas de bambú: amarillo, celeste, rosado y blanco' }
        ],
        blend: false,
        stock: 'En stock',
        // El tipo (glitter o mate) y el color salen al azar: se muestran como referencia, no se eligen.
        randomColors: tag(DUMPLING_COLORS.glitter, 'Glitter').concat(tag(DUMPLING_COLORS.mate, 'Mate')),
        colorLabel: 'Tipo y color al azar',
        description: 'Adorable dumpling squishy con carita kawaii. Textura suave y esponjosa. Puede salirte en versión glitter o mate, y el tipo y el color se entregan al azar.'
      }
    ],
    steps: [
      'Elige tu producto favorito.',
      'Escríbenos por Instagram @sensa.usm.',
      'Coordina tu compra con nosotros.',
      '¡Disfruta tu momento SENSA!'
    ]
  };

  var D = window.SENSA;

  // Links antiguos de productos que se fusionaron con otro.
  D.aliases = {
    'dumplings-glitter': 'dumplings',
    'dumplings-mate': 'dumplings',
    'bao-squishy': 'dumplings',
    'fidget-cube': 'cubo-antiestres-sensorial'
  };

  D.find = function (slug) {
    return D.products.find(function (p) { return p.slug === slug; });
  };
  D.money = function (n) {
    return '$' + Number(n).toLocaleString('es-CL');
  };
  // Texto de precio: "$3.500" o "Consultar precio" si aún no hay precio.
  D.priceText = function (p) {
    return p.price == null ? 'Consultar precio' : D.money(p.price);
  };
  D.categoryLabel = function (id) {
    var c = D.categories.find(function (x) { return x.id === id; });
    return c ? c.label : '';
  };
  D.hasColors = function (p) { return !!(p.colors && p.colors.length); };
  D.hasVariants = function (p) { return !!(p.variants && p.variants.length); };
  D.needsOptions = function (p) { return D.hasColors(p) || D.hasVariants(p); };
  // Se puede agregar directo al pedido (con precio y sin opciones por elegir).
  D.canQuickAdd = function (p) { return p.price != null && !D.needsOptions(p) && !(D.isSoldOut && D.isSoldOut(p)); };
  D.color = function (p, id) {
    return (p.colors || []).find(function (c) { return c.id === id; });
  };
  // Colores disponibles según la versión elegida (si un color no define versiones, vale para todas).
  D.colorsFor = function (p, variantId) {
    return (p.colors || []).filter(function (c) {
      return !c.variants || (variantId && c.variants.indexOf(variantId) !== -1);
    });
  };
  D.variant = function (p, id) {
    return (p.variants || []).find(function (v) { return v.id === id; });
  };
  // "Glitter · Rosado" a partir de las opciones elegidas (o el texto informativo si no hay opciones).
  D.optionLabel = function (p, opts) {
    opts = opts || {};
    var parts = [];
    var v = opts.variant && D.variant(p, opts.variant);
    var c = opts.color && D.color(p, opts.color);
    if (v) parts.push(v.name);
    if (c) parts.push(c.name);
    return parts.length ? parts.join(' · ') : (p.colorLabel || '');
  };
  // Fondo CSS de un swatch.
  D.swatchBg = function (c) { return c.swatch || c.hex; };
  // Nota corta bajo la tarjeta del catálogo.
  D.cardNote = function (p) {
    if (D.hasVariants(p)) return p.variants.map(function (v) { return v.name; }).join(' y ');
    if (D.hasColors(p)) return p.colors.length + ' colores';
    return (p.colorLabel || '').split(',')[0];
  };
  // Colores de los puntitos de la tarjeta.
  D.cardDots = function (p) {
    if (D.hasColors(p)) return p.colors.slice(0, 6).map(function (c) { return D.swatchBg(c); });
    if (p.randomColors) return p.randomColors.map(function (c) { return D.swatchBg(c); });
    return p.dots || [];
  };
})();

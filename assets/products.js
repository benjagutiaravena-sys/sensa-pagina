// Datos reales del catálogo SENSA (única fuente de verdad para home, detalle y pedido).
//
// Campos de cada producto:
//   price       número en CLP, o null si aún no hay precio (se muestra "Consultar precio").
//   colors      lista de colores elegibles [{ id, name, hex | swatch, image? }]. Si está vacía NO se muestra selector.
//               `image` (opcional) = foto propia de ese color; si falta se usa la foto principal.
//   variants    versiones elegibles [{ id, name }] (ej. Glitter / Mate). Si no hay, no se muestra selector.
//   colorLabel  texto informativo cuando el producto no tiene selector de color.
//   stock       texto de disponibilidad.
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
        blend: false,
        stock: 'En stock',
        colors: [C.naranjo, C.morado, C.verde, C.verdeAgua, C.azul, C.rosado],
        description: 'Cubo de gel súper sólido, transparente y colorido. Ideal para apretar y liberar tensión.'
      },
      {
        slug: 'cubo-gel-forma',
        name: 'Cubo Gel con Forma',
        price: 3000, // mismo precio que el Cubo Gel Liso
        category: 'gel',
        kicker: 'Gel con forma de burbujas',
        badge: 'Forma de burbujas',
        badgeClass: 'bg-surface-container-highest text-on-surface',
        image: '/images/opt/cubo-gel-forma.webp',
        alt: 'Cubo gel rosado con forma de burbujas junto a su caja Squish Cube',
        blend: false,
        stock: 'En stock',
        colors: [C.rosado, C.azul, C.morado, C.naranjo],
        description: 'Cubo de gel con forma de burbujas, para apretar y liberar tensión.'
      },
      {
        slug: 'cubo-gel-cinta',
        name: 'Cubo Gel con Cinta',
        price: 3000, // mismo precio que el Cubo Gel Liso
        category: 'gel',
        kicker: 'Gel con cinta holográfica',
        badge: 'Cinta holográfica',
        badgeClass: 'bg-surface-container-highest text-on-surface',
        image: '/images/opt/cubo-gel-cinta.webp',
        alt: 'Cubo gel transparente con cinta holográfica en su interior junto a su caja Squish Cube',
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
          { src: '/images/opt/fidget-cube-colores.webp', alt: 'Cubos antiestrés sensoriales en blanco con fucsia, morado y rosado, junto a su caja' }
        ],
        blend: false,
        stock: 'En stock',
        colors: [],
        colorLabel: 'Color al azar',
        colorNote: 'Color al azar.',
        dots: ['#B9A7E8', '#F6DC8C', '#A8DDB5'],
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
        alt: 'Dumpling squishy morado con carita kawaii, junto a su caja de bambú',
        // Fotos secundarias (galería de la página de producto)
        moreImages: [
          { src: '/images/opt/bao-squishy.webp', alt: 'Dos bao squishy rosados con carita kawaii: uno con glitter y otro mate' }
        ],
        blend: false,
        stock: 'En stock',
        variants: [
          { id: 'glitter', name: 'Glitter' },
          { id: 'mate', name: 'Mate' }
        ],
        colors: [],
        colorLabel: 'Colores al azar',
        colorNote: 'Colores al azar.',
        dots: ['#B9A7E8', '#F6DC8C', '#A8DDB5'],
        description: 'Adorable dumpling squishy con carita kawaii. Textura suave y esponjosa. Disponible en versión glitter y versión mate.'
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
  D.canQuickAdd = function (p) { return p.price != null && !D.needsOptions(p); };
  D.color = function (p, id) {
    return (p.colors || []).find(function (c) { return c.id === id; });
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
    if (D.hasColors(p)) return p.colors.length + ' colores';
    if (D.hasVariants(p)) return p.variants.map(function (v) { return v.name; }).join(' y ');
    return (p.colorLabel || '').split(',')[0];
  };
  // Colores de los puntitos de la tarjeta.
  D.cardDots = function (p) {
    if (D.hasColors(p)) return p.colors.map(function (c) { return D.swatchBg(c); });
    return p.dots || [];
  };
})();

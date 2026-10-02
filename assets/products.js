// Datos reales del catálogo SENSA (única fuente de verdad para home, detalle y pedido).
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
      colorLabel: 'Color único',
      colorNote: 'Color único.',
      dots: ['#F6DC8C'],
      description: 'Suave, blandito y satisfactorio de apretar. Su efecto slow rising hace que recupere lentamente su forma.',
      highlights: ['Suave al tacto', 'Efecto slow rising', 'Fácil de llevar', 'Perfecto para tus pausas SENSA']
    },
    {
      slug: 'cubo-gel',
      name: 'Cubo Gel',
      price: 3000,
      category: 'gel',
      kicker: 'Textura sensorial',
      badge: 'Gel translúcido',
      badgeClass: 'bg-surface-container-highest text-on-surface',
      image: '/images/opt/gel-cube.webp',
      alt: 'Cubo Gel Cube Squeeze, cubo de gel translúcido con su caja',
      blend: false,
      colorLabel: 'Color al azar',
      colorNote: 'Color al azar.',
      dots: ['#B9A7E8', '#F6DC8C', '#A8DDB5'],
      description: 'Cubo de gel súper sólido, transparente y colorido. Ideal para apretar y liberar tensión.'
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
      blend: false,
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
      blend: false,
      colorLabel: 'Colores al azar, con brillos o lisos',
      colorNote: 'Colores al azar, con brillos o lisos.',
      dots: ['#B9A7E8', '#F6DC8C', '#A8DDB5'],
      description: 'Adorable dumpling squishy con carita kawaii. Textura suave y esponjosa.'
    }
  ],
  steps: [
    'Elige tu producto favorito.',
    'Escríbenos por Instagram @sensa.usm.',
    'Coordina tu compra con nosotros.',
    '¡Disfruta tu momento SENSA!'
  ]
};

window.SENSA.find = function (slug) {
  return window.SENSA.products.find(function (p) { return p.slug === slug; });
};
window.SENSA.money = function (n) {
  return '$' + Number(n).toLocaleString('es-CL');
};
window.SENSA.categoryLabel = function (id) {
  var c = window.SENSA.categories.find(function (x) { return x.id === id; });
  return c ? c.label : '';
};

// Tokens del diseño "Cozy Spooky Squish" (Halloween): colores, tipografía, radios, espaciados y sombras.
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-primary': '#4d2700', 'on-secondary-container': '#bdabed', 'secondary-fixed': '#e9ddff',
        'outline': '#a28d7d', 'on-tertiary-fixed': '#002118', 'on-secondary': '#36265e',
        'primary-fixed': '#ffdcc2', 'surface-container-lowest': '#100c1a', 'inverse-primary': '#904d00',
        'surface-container-low': '#1d1928', 'on-tertiary-container': '#0d503f', 'inverse-surface': '#e7dff4',
        'secondary': '#cfbcff', 'surface-container': '#211d2c', 'on-error-container': '#ffdad6',
        'on-tertiary-fixed-variant': '#0d503f', 'surface-container-high': '#2c2837', 'surface': '#151120',
        'on-primary-fixed-variant': '#6d3900', 'primary': '#ffc597', 'surface-variant': '#373242',
        'secondary-fixed-dim': '#cfbcff', 'error-container': '#93000a', 'on-tertiary': '#00382b',
        'background': '#151120', 'surface-bright': '#3b3747', 'surface-dim': '#151120',
        'primary-container': '#ff9e44', 'error': '#ffb4ab', 'secondary-container': '#4d3d76',
        'on-background': '#e7dff4', 'on-primary-fixed': '#2e1500', 'on-surface': '#e7dff4',
        'tertiary-fixed-dim': '#96d3bd', 'primary-fixed-dim': '#ffb77c', 'tertiary-fixed': '#b1efd8',
        'on-error': '#690005', 'on-secondary-fixed': '#200f48', 'surface-tint': '#ffb77c',
        'inverse-on-surface': '#322e3e', 'on-primary-container': '#6d3900', 'tertiary': '#9fddc6',
        'surface-container-highest': '#373242', 'on-secondary-fixed-variant': '#4d3d76',
        'tertiary-container': '#84c1ab', 'on-surface-variant': '#dac2b1', 'outline-variant': '#544337',
        // Botón principal "calabaza" (se mantiene el nombre graphite que ya usan las páginas)
        'graphite': '#ff9e44'
      },
      borderRadius: { DEFAULT: '1rem', lg: '2rem', xl: '3rem', full: '9999px' },
      spacing: {
        'space-lg': '2rem', 'space-xs': '0.375rem', 'gutter-sm': '1rem', 'gutter-lg': '2rem',
        'margin-lg': '3rem', 'margin': '1.5rem', 'space-xl': '3rem', 'margin-sm': '1rem',
        'gutter': '1.5rem', 'space-sm': '0.75rem', 'space-md': '1.25rem'
      },
      // Profundidad "squishy": sombra exterior suave + brillo superior y borde inferior (relieve de espuma).
      boxShadow: {
        rest: '0 8px 24px -4px rgba(10,8,16,0.45), inset 0 2px 2px 0 rgba(253,248,242,0.10), inset 0 -3px 4px 0 rgba(10,8,16,0.30)',
        raised: '0 14px 32px -6px rgba(10,8,16,0.55), inset 0 2px 2px 0 rgba(253,248,242,0.12), inset 0 -3px 4px 0 rgba(10,8,16,0.35)',
        float: '0 24px 48px -8px rgba(10,8,16,0.6), 0 8px 20px -4px rgba(185,167,232,0.18)',
        soft: '0 4px 16px -2px rgba(10,8,16,0.4)',
        squish: '0 10px 28px -6px rgba(255,158,68,0.35), inset 0 3px 3px 0 rgba(255,255,255,0.35), inset 0 -4px 6px 0 rgba(175,78,10,0.5)',
        well: 'inset 0 4px 10px rgba(10,8,16,0.6), inset 0 -1px 2px rgba(253,248,242,0.08)'
      },
      fontFamily: {
        'label-sm': ['Comfortaa'], 'headline-lg-mobile': ['Comfortaa'], 'display-lg-mobile': ['Comfortaa'],
        'body-lg': ['Comfortaa'], 'label-md': ['Comfortaa'], 'body-md': ['Comfortaa'],
        'body-sm': ['Comfortaa'], 'title-md': ['Comfortaa'], 'headline-lg': ['Comfortaa'],
        'label-lg': ['Comfortaa'], 'headline-sm': ['Comfortaa'], 'headline-md': ['Comfortaa'],
        'display-lg': ['Comfortaa']
      },
      fontSize: {
        'label-sm': ['10px', { lineHeight: '14px', letterSpacing: '0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['26px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-lg-mobile': ['34px', { lineHeight: '42px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'title-md': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }]
      }
    }
  }
};

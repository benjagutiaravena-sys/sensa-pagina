// Tokens del diseño "Tactile Calm" (colores, tipografías, radios, espaciados, sombras).
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'on-error': '#ffffff', 'surface-container': '#f1ebfb', 'on-background': '#1c1a25',
        'primary': '#655590', 'on-primary-container': '#493a73', 'error-container': '#ffdad6',
        'surface-container-highest': '#e5e0ef', 'primary-fixed-dim': '#cfbcff',
        'surface-container-high': '#ebe6f5', 'tertiary': '#386848', 'secondary': '#6f5d1a',
        'surface-variant': '#e5e0ef', 'on-secondary-fixed': '#231b00', 'tertiary-container': '#89bd97',
        'on-surface': '#1c1a25', 'primary-fixed': '#e9ddff', 'on-primary-fixed': '#200f48',
        'surface-dim': '#ddd8e7', 'on-primary': '#ffffff', 'inverse-surface': '#312f3a',
        'tertiary-fixed-dim': '#9ed3ab', 'background': '#fdf8ff', 'on-secondary': '#ffffff',
        'on-secondary-fixed-variant': '#564501', 'on-tertiary-fixed-variant': '#1f5032',
        'surface-tint': '#655590', 'on-secondary-container': '#766320', 'outline': '#7a7580',
        'secondary-container': '#fbe190', 'inverse-on-surface': '#f4eefe', 'secondary-fixed': '#fbe190',
        'tertiary-fixed': '#b9efc6', 'outline-variant': '#cac4d0', 'surface-container-lowest': '#ffffff',
        'on-tertiary-container': '#1b4d2f', 'surface-bright': '#fdf8ff', 'inverse-primary': '#cfbcff',
        'on-tertiary-fixed': '#00210e', 'on-surface-variant': '#49454f', 'error': '#ba1a1a',
        'on-tertiary': '#ffffff', 'primary-container': '#b9a7e8', 'on-error-container': '#93000a',
        'surface-container-low': '#f7f1ff', 'surface': '#fdf8ff', 'on-primary-fixed-variant': '#4d3d76',
        'secondary-fixed-dim': '#dec577',
        'graphite': '#2A2833'
      },
      borderRadius: { DEFAULT: '1rem', lg: '2rem', xl: '3rem', full: '9999px' },
      spacing: {
        'space-lg': '2rem', 'space-xs': '0.375rem', 'gutter-sm': '1rem', 'gutter-lg': '2rem',
        'margin-lg': '3rem', 'margin': '1.5rem', 'space-xl': '3rem', 'margin-sm': '1rem',
        'gutter': '1.5rem', 'space-sm': '0.75rem', 'space-md': '1.25rem'
      },
      boxShadow: {
        rest: '0 8px 24px -4px rgba(42,40,51,0.06), 0 2px 6px -1px rgba(185,167,232,0.12)',
        raised: '0 16px 36px -6px rgba(42,40,51,0.08), 0 4px 12px -2px rgba(185,167,232,0.18)',
        float: '0 24px 48px -8px rgba(42,40,51,0.12), 0 8px 20px -4px rgba(185,167,232,0.2)',
        soft: '0 4px 16px -2px rgba(42,40,51,0.05)'
      },
      fontFamily: {
        'label-sm': ['Nunito Sans'], 'headline-lg-mobile': ['Comfortaa'], 'display-lg-mobile': ['Comfortaa'],
        'body-lg': ['Nunito Sans'], 'label-md': ['Nunito Sans'], 'body-md': ['Nunito Sans'],
        'body-sm': ['Nunito Sans'], 'title-md': ['Nunito Sans'], 'headline-lg': ['Comfortaa'],
        'label-lg': ['Nunito Sans'], 'headline-sm': ['Comfortaa'], 'headline-md': ['Comfortaa'],
        'display-lg': ['Comfortaa']
      },
      fontSize: {
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.03em', fontWeight: '600' }],
        'headline-lg-mobile': ['26px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-lg-mobile': ['34px', { lineHeight: '42px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['17px', { lineHeight: '26px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '700' }],
        'body-md': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'title-md': ['18px', { lineHeight: '26px', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }]
      }
    }
  }
};

---
name: Serene Tactility
colors:
  surface: '#fef9ef'
  surface-dim: '#dedad0'
  surface-bright: '#fef9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e9'
  surface-container: '#f2ede3'
  surface-container-high: '#ede8de'
  surface-container-highest: '#e7e2d8'
  on-surface: '#1d1c16'
  on-surface-variant: '#4f4446'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e6'
  outline: '#817476'
  outline-variant: '#d3c3c5'
  surface-tint: '#78555e'
  primary: '#78555e'
  on-primary: '#ffffff'
  primary-container: '#ffd1dc'
  on-primary-container: '#7a5761'
  inverse-primary: '#e7bbc6'
  secondary: '#47626e'
  on-secondary: '#ffffff'
  secondary-container: '#cae7f5'
  on-secondary-container: '#4d6874'
  tertiary: '#5c5d6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#dbdbef'
  on-tertiary-container: '#5e6070'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e2'
  primary-fixed-dim: '#e7bbc6'
  on-primary-fixed: '#2d141c'
  on-primary-fixed-variant: '#5e3e47'
  secondary-fixed: '#cae7f5'
  secondary-fixed-dim: '#aecbd8'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#2f4a56'
  tertiary-fixed: '#e1e1f5'
  tertiary-fixed-dim: '#c5c5d8'
  on-tertiary-fixed: '#191b29'
  on-tertiary-fixed-variant: '#444655'
  background: '#fef9ef'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d8'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Quicksand
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style

This design system embodies a "Premium Wellness" aesthetic, blending high-end minimalism with a soft, approachable character. The brand personality is calm, nurturing, and sophisticated—avoiding the clinical coldness of traditional health tech and the immaturity of "kawaii" styles.

The visual direction uses a **Minimalist-Tactile** hybrid approach. It leverages heavy whitespace and a restricted palette to maintain professional authority, while using "squishy" geometry and subtle depth to evoke the physical relief of anti-stress products. The goal is to make the interface feel like a deep breath: open, airy, and effortlessly organized.

## Colors

The palette is anchored in low-saturation "healing" tones. 
- **Base:** Use `#fdfbf7` (Cream) for page backgrounds to reduce eye strain compared to pure white. Use `#ffffff` (Pure White) exclusively for elevated cards and foreground containers to create a subtle "lift."
- **Primary (Pastel Pink):** Used for primary actions and brand moments. It represents warmth and human touch.
- **Secondary (Pastel Light Blue):** Used for calm states, info-conveyance, and cooling elements.
- **Tertiary (Subtle Lavender):** Used for accents, specialized categories, or "delight" features.
- **Neutral (Beige):** Used for borders, subtle dividers, and secondary button backgrounds to maintain a soft contrast profile.
- **Typography:** Avoid pure black. Use a deep, desaturated charcoal-grey for text to maintain the soft aesthetic.

## Typography

The typography system utilizes **Quicksand** for its rounded terminals and open apertures, which communicate friendliness without sacrificing legibility. 

- **Hierarchy:** Headlines should use tighter letter spacing and heavier weights to feel "plump" and confident.
- **Readability:** Body text uses a medium weight (500) rather than regular (400) where possible to ensure the rounded strokes remain clear against the soft cream backgrounds.
- **Labels:** Use uppercase for small labels with increased letter spacing to provide a premium, editorial feel that balances the inherent "cuteness" of the typeface.

## Layout & Spacing

The layout philosophy follows a **Fluid-Fixed hybrid**. Content is centered within a maximum width container (1200px) on desktop to prevent eye fatigue.

- **Rhythm:** Use an 8px base grid. 
- **Whitespace:** Embrace "excessive" margins. Sections should be separated by large gaps (`80px+`) to allow the UI to breathe, mimicking the feeling of a calm, uncluttered room.
- **Padding:** Internal element padding (e.g., inside cards or buttons) should be generous. For example, a standard card should have at least `32px` of internal padding to feel premium and spacious.

## Elevation & Depth

This design system avoids harsh shadows and dark overlays. Depth is achieved through **Soft Ambient Occlusion**.

- **Shadows:** Use extremely large blur radii (30px-50px) with very low opacity (5-8%) using a color-tinted shadow (e.g., a soft mauve or beige tint instead of grey). This creates a "floating" effect rather than a "heavy" one.
- **Tonal Layering:** Use the Cream-to-White transition to define hierarchy. The background is `#fdfbf7`, and interactive surfaces are `#ffffff`. 
- **Z-Index:** Limit elevation to two primary levels: the base floor and the floating surface. Modal overlays should use a high-blur backdrop filter (10px) to maintain the "glassy" but soft feel.

## Shapes

The shape language is defined by **organic, pill-shaped geometry**. 

- **Corners:** Buttons, input fields, and tags must use the maximum "pill" radius. 
- **Cards:** Use `rounded-xl` (1.5rem / 24px) or higher for large containers to ensure no "sharp" edges exist in the environment.
- **Icons:** Icons should have rounded caps and corners, maintaining a consistent 2px or 3px stroke weight to match the "friendly but premium" weight of the typography.

## Components

- **Buttons:** Primary buttons use a pill shape, the Pastel Pink background, and a subtle "squish" animation on click (scale: 0.96). They should not have borders, relying on their soft shadow for definition.
- **Input Fields:** Use the Cream background (`#fdfbf7`) for the field itself with a 1px Beige (`#f5f0e6`) border. When focused, the border transitions to a soft Pink or Blue.
- **Cards:** White background, `32px` padding, `24px` corner radius, and an ambient tinted shadow. No borders on cards.
- **Chips/Tags:** Small pill-shaped elements using the Tertiary Lavender or Secondary Blue with 10% opacity backgrounds and 100% opacity text for a "soft-label" look.
- **Lists:** Items should be separated by generous vertical space rather than horizontal lines. If a divider is necessary, use a short, centered Beige line with rounded ends.
- **Interactive States:** Hover states should involve a slight upward lift (y-axis shift) and a deepening of the ambient shadow, rather than a dramatic color change.
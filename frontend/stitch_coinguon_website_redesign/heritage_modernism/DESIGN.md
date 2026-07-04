---
name: Heritage Modernism
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#504443'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#827472'
  outline-variant: '#d4c3c1'
  surface-tint: '#795553'
  primary: '#321716'
  on-primary: '#ffffff'
  primary-container: '#4a2c2a'
  on-primary-container: '#bd928f'
  inverse-primary: '#eabcb8'
  secondary: '#944a00'
  on-secondary: '#ffffff'
  secondary-container: '#fc8f34'
  on-secondary-container: '#663100'
  tertiary: '#381400'
  on-tertiary: '#ffffff'
  tertiary-container: '#592500'
  on-tertiary-container: '#ee7f38'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#eabcb8'
  on-primary-fixed: '#2e1413'
  on-primary-fixed-variant: '#5f3e3c'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
  surface-paper: '#FAF7F2'
  surface-warm: '#FEF3C7'
  accent-sunset: '#E67E22'
  deep-wood: '#451A03'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system balances the profound reverence of Vietnamese genealogy with a contemporary, accessible interface. The brand personality is **ancestral, warm, and prestigious**. It seeks to bridge the gap between historical record-keeping and modern digital archiving, evoking an emotional response of belonging and continuity.

The design style is **Modern / Minimalist Card-based**. It utilizes generous whitespace and a "paper-and-ink" aesthetic, refined through clean lines and intentional layering. By moving away from cluttered traditional layouts, the system highlights the weight of familial history through premium typography and a warm, tactile feel.

## Colors

The palette is rooted in earth tones that symbolize the "Cội Nguồn" (The Source/Roots). 

- **Primary (Rich Chocolate):** Used for headers, prominent icons, and text hierarchies to establish authority and depth.
- **Secondary (Sunset Orange):** Reserved for high-priority Call to Actions (CTAs) and interactive states, providing a vibrant contrast to the grounded browns.
- **Background (Soft Cream):** Replaces harsh whites to reduce eye strain during long reading sessions of family records, mimicking the quality of high-end stationery.
- **Neutral (Warm Tints):** A range of off-whites and ambers used for secondary surfaces and structural containers.

## Typography

The typography strategy focuses on the contrast between the **traditional (Serif)** and the **modern (Sans-Serif)**.

- **Headlines:** Noto Serif is used to provide a sense of gravitas and literary quality. It is essential for names of ancestors and historical milestones.
- **Body & Interface:** Be Vietnam Pro provides a contemporary Vietnamese-centric sans-serif that is highly legible at small sizes. Its approachable nature balances the formality of the serif headers.
- **Hierarchy:** Use larger Serif displays for family tree nodes and section headers. Reserve the Sans-serif for data-heavy lists, metadata, and navigational elements.

## Layout & Spacing

The system uses a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). 

- **Layout Model:** Content is housed in structured cards that align to the grid. Spacing follows an 8px base unit.
- **Rhythm:** Generous vertical rhythm is prioritized to allow family histories to "breathe." Large margins on desktop ensure the focus remains on the central lineage data.
- **Reflow:** On mobile, side-by-side card elements stack vertically, and horizontal margins shrink to 16px to maximize reading area for text-heavy biographical entries.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** combined with **Ambient Shadows**.

- **Surfaces:** The primary background uses the Soft Cream color. Information cards sit one level above this, utilizing white backgrounds with very soft, diffused shadows (4% opacity, Deep Wood tint) to create a subtle lift.
- **Depth Hierarchy:** 
    - Level 0: Site background (Soft Cream).
    - Level 1: Main content cards (White).
    - Level 2: Interactive elements like hover-state cards or dropdown menus (Slightly more pronounced shadow).
- **Interactions:** Use subtle transitions in shadow spread rather than harsh color changes to denote interactivity, maintaining a calm and respectful atmosphere.

## Shapes

The shape language is defined by **Rounded (0.5rem)** corners. This choice softens the technical nature of a database-driven platform, making the family tree feel more organic and welcoming.

- **Large Components:** Cards and main containers use `rounded-lg` (1rem) to emphasize the containerized nature of the design.
- **Small Components:** Buttons and input fields use the base `rounded` (0.5rem) to maintain a crisp, professional look.
- **Profile Avatars:** Use circular masks for ancestor photos to contrast against the rectangular grid and evoke the feeling of traditional medallions.

## Components

- **Buttons:** CTAs use a subtle vertical gradient from the Secondary Orange to a slightly deeper shade. Primary buttons use white text for high contrast. Ghost buttons use Primary Brown outlines.
- **Cards:** Information cards are the core of the system. They feature a 1px border in a pale amber tint and a soft shadow. The header of the card should use Noto Serif.
- **Input Fields:** Use a solid white background with a subtle inset border. On focus, the border transitions to Primary Brown. Labels should always be visible above the field using `label-md`.
- **Chips/Tags:** Used for "Generation" or "Branch" markers. These should have a light amber background with deep brown text, using a `rounded-xl` pill shape.
- **Family Tree Nodes:** Special components that combine a circular avatar with Serif typography for names. Connections between nodes should be thin, 1px lines in Primary Brown with 50% opacity.
- **Lists:** Biographical lists should use alternating row tints (Soft Cream and White) to improve legibility in long records.
---
name: 'AegisCraft: Nature-Inspired Golden Rescue & Liquid Glass'
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#88929b'
  outline-variant: '#3e4850'
  surface-tint: '#89ceff'
  primary: '#89ceff'
  on-primary: '#00344d'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#006591'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#d88a00'
  on-tertiary-container: '#4a2c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  title-screen:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  title-section:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-card:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-medium:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0em
  label-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.005em
  microcopy:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  caption-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes a high-trust, responsive visual ecosystem engineered specifically for blue-collar dispatch, emergency home repairs, and tradesperson management. The design style combines **Dark Liquid Glassmorphism** with **Tactile Utility**—merging deep geological slate backdrops with luminous emerald organic indicators, warm amber rescue accents, and ultra-refined structural glass surfaces.

### Emotional Profile & Brand Values
- **Uncompromising Trust & Proven Integrity:** The UI must convey institutional security, safety, and operational legitimacy to alleviate customer anxiety during emergency breakdowns.
- **Organic Vitality & Resilience:** Grounded natural emeralds anchor verified credentials, operational readiness, and real-time technician telemetry.
- **Rescue Readiness:** Golden-amber accents signal dispatch speed, high-value bidding visibility, and decisive callouts without triggering panic.
- **Precision Utility:** Every UI surface feels engineered, translucent, and physically responsive, avoiding decorative fluff in favor of legibility under direct sunlight or low-light field conditions.

### Target Audience
- **Field Specialists & Tradespeople:** Plumbers, electricians, HVAC mechanics, and emergency structural workers operating single-handed on mobile devices on-site.
- **Residential & Enterprise Clients:** Property owners and facility managers in need of rapid verification, real-time technician radar tracking, and dispute-free escrow pricing.

## Colors

The system uses a dark-first visual foundation optimized for low eye-strain, high daylight contrast, and luminous spatial depth through physical layered light.

### Palette Architecture
- **Primary Interactive (#0EA5E9 - Clear Sky Blue):** Direct actions, primary interface drivers, interactive links, active tabs, and forward progress paths.
- **Secondary / Nature Trust (#10B981 - Luminous Emerald):** Verification badges, background safety confirmation, live GPS tracking pulses, accepted counteroffers, and positive escrow releases.
- **Tertiary / Rescue Gold (#F59E0B - Golden Amber):** Dynamic pricing focus, live bidding increments, urgent dispatch priority flags, and technician arrival countdown clocks.
- **Neutral Dark Canvas (#0F172A - Deep Slate):** Non-distracting foundation base absorbing glare and establishing contrast.
- **Destructive / SOS (#EF4444 - Signal Red):** Emergency trigger switches, critical hazard overrides, dispute escalations, and dispatch cancellations.

### Surface Tones & Alpha Translucencies
- **Surface Level 0 (Base Canvas):** `#0F172A` (Pure opaque backdrop).
- **Surface Level 1 (Frosted Glass Plate):** `rgba(30, 41, 59, 0.78)` backed by `backdrop-filter: blur(16px) saturate(180%)`.
- **Surface Level 2 (Floating Module/HUD):** `rgba(51, 65, 85, 0.65)` backed by `backdrop-filter: blur(24px)`.
- **Border Rim Light:** `rgba(255, 255, 255, 0.08)` across neutral boundaries; contextual `rgba(16, 185, 129, 0.25)` for verified zones and `rgba(245, 158, 11, 0.25)` for bidding items.

### Content Hierarchy Colors
- **High-Emphasis Text / Icons:** `#F1F5F9`
- **Medium-Emphasis Labels / Subtitles:** `#94A3B8`
- **Low-Emphasis Trackers / Microcopy:** `#64748B`

## Typography

The typography is built entirely on **Inter**, capitalizing on its tall x-height, open apertures, and specialized tabular numerals for mission-critical situational awareness.

### Hierarchy & Composition Rules
- **Tabular Numerals (`tnum`):** Enforce `font-variant-numeric: tabular-nums` across all counteroffer pricing calculations, live ETA readouts, and SOS countdown clocks to prevent jitter.
- **Letter Spacing Tiers:** Tighter tracking (`-0.025em` to `-0.01em`) on large headlines preserves geometric compactness, while positive tracking (`0.01em` to `0.06em`) on microcopy guarantees instant legibility in harsh environmental glare.
- **Label Capitalization:** `caption-caps` must always be rendered in full uppercase with `letterSpacing: 0.06em` when indicating hardware status (e.g., `GPS LOCK`, `ESCROW SECURED`, `ON ROUTE`).

## Layout & Spacing

Layout geometry follows an adaptable fluid-grid system structured around an **8-point operational cadence** (with an atomic 4px half-step for micro-indicators).

### Layout Archetypes
- **Mobile Handheld (360px - 599px):** Single-column fluid view. Edge margins set to `1rem` (`16px`) to maximize functional touch targets. Bottom sheets and navigation elements attach securely to screen perimeters.
- **Tablet / Split Dashboard (600px - 1023px):** 8-column layout. Split views partition active service requests on the left (40% width) and real-time mapping HUDs on the right (60% width).
- **Desktop Command Terminal (1024px+):** 12-column system capped at `1440px` maximum viewport width with `margin-desktop: 3rem`. Centered containers ensure technician dispatch monitors maintain compact scanning fields.

### Grid & Gap Rules
- Component layouts utilize `space-md` (`16px`) for primary separation of grouped interaction fields.
- Golden-ratio structural cards (such as technician credentials and live quote comparisons) employ `space-lg` (`24px`) interior padding on desktop and `space-md` (`16px`) on mobile devices.

## Elevation & Depth

Spatial layering relies on translucent glass optics, spectral rim-lighting, and ambient atmospheric depth rather than standard muddy drop shadows.

### Atmospheric Glass Architecture
- **Layer 0 (Canvas Depth):** Base tone `#0F172A` with ambient radial color flares:
  - Trust Glow: `radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)`
  - Rescue Glow: `radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.06) 0%, transparent 45%)`
- **Layer 1 (Card Glass - Ground Plates):** `background: rgba(30, 41, 59, 0.78); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35);`
- **Layer 2 (Floating Interactive Panels / Bidding Sliders):** `background: rgba(51, 65, 85, 0.65); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.45);`
- **Layer 3 (Overlays, Modals & Emergency HUDs):** `background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(32px); border: 1px solid rgba(255, 255, 255, 0.20); box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.65);`

### Glow Dynamics
Interactive elements receive ambient perimeter lighting:
- **Sky Active Glow:** `0 0 16px rgba(14, 165, 233, 0.35)`
- **Trust Green Glow:** `0 0 16px rgba(16, 185, 129, 0.40)`
- **Golden Urgency Glow:** `0 0 20px rgba(245, 158, 11, 0.45)`

## Shapes

The shape vocabulary uses structured, medium-rounded corners that balance fluid modern glass aesthetics with structural, heavy-duty durability.

### Geometry Specifications
- **Standard Cards, Panels & Modals:** `rounded-lg` (`1rem` / `16px`) creates ergonomic windowing while maximizing information area.
- **Buttons, Form Inputs & Bidding HUD Elements:** `rounded` (`0.5rem` / `8px`) maintains crisp tool-like precision.
- **Pill Elements (Status Badges, Role Toggles, Micro Indicators):** Fully circular endpoints (`rounded-full` / `9999px`) indicate fluid state, dynamic toggling, and live system metrics.
- **Borders:** Fixed hairline `1px` structural borders frame all liquid surfaces to prevent boundary bleed against dark canvas zones.

## Components

### Buttons
- **Primary Action (Sky Interactive):** Filled `#0EA5E9`, text `#F1F5F9` (`label-default`), `border-radius: 8px`. Hover generates `0 0 16px rgba(14, 165, 233, 0.4)`. Minimum touch height: 48px.
- **Emergency Rescue Action (SOS):** Filled `#EF4444`, text `#FFFFFF`. Pulsing animation with dynamic outer wave `box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7)`.
- **Secondary Glass Utility:** `rgba(30, 41, 59, 0.8)` with `border: 1px solid rgba(255, 255, 255, 0.12)`, text `#F1F5F9`. Hover state shifts border to `rgba(255, 255, 255, 0.25)`.

### Role Toggles (Customer ↔ Verified Pro)
- Segmented pill track `rgba(15, 23, 42, 0.8)` enclosed by a `1px` border (`rgba(255, 255, 255, 0.08)`).
- Active thumb floats using a glass surface (`rgba(30, 41, 59, 0.95)` with `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4)`) carrying an Emerald Trust micro-indicator for the verified pro state.

### Verified Badges & Two-Way Rating Chips
- **Verified Pro Badge:** Pill shaped, background `rgba(16, 185, 129, 0.12)`, border `1px solid rgba(16, 185, 129, 0.35)`, text `#10B981` (`caption-caps`), prepended with a solid emerald verification shield icon.
- **Two-Way Rating Module:** Compact glass badge displaying bidirectional review scores (e.g., `★ 4.96 Pro | ★ 5.0 Client`) paired with micro-counts in `#94A3B8`.

### Live Radar Matching HUD
- Layer 2 glass housing with an embedded radial grid coordinate overlay (`rgba(255, 255, 255, 0.05)` rings).
- Concentric pulse animations emitted from user origin in `#0EA5E9` rings. Nearby verified pros marked with `#10B981` radar blips featuring glowing proximity vectors and estimated arrival durations.

### Interactive Bidding Slider & Counteroffer Input
- **Slider Track:** 6px rail, filled side uses an amber gradient (`linear-gradient(90deg, #F59E0B, #FBBF24)`), unfilled side uses `rgba(255, 255, 255, 0.10)`.
- **Slider Handle:** 24px circular glass disc with a `#F59E0B` illuminated core ring.
- **Counteroffer Dynamic Display:** Golden-ratio price header rendered in `display` (`32px` Inter tabular-nums), highlighted in `#F59E0B`. Quick adjustment chips (`+$15`, `+$25`, `Custom`) arrayed below using frosted pill surfaces.

### Form Inputs & Text Fields
- Base background `rgba(15, 23, 42, 0.60)` with a subtle `1px solid rgba(255, 255, 255, 0.10)`.
- Active focus mode transforms border to `#0EA5E9` accompanied by `box-shadow: 0 0 12px rgba(14, 165, 233, 0.25)`. Text colored `#F1F5F9` with placeholder text in `#64748B`.

### Emergency SOS Countdown Indicators
- High-visibility circular ring buffer displaying a continuous SVG progress stroke in `#EF4444`.
- Center count tracks seconds remaining (`3... 2... 1...`) in bold tabular numerals, accompanied by an instant `Cancel Drag` dead-man slider to prevent false emergency dispatches.
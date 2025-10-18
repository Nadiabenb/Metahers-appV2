# MetaHers Mind Spa - Design Guidelines

## Design Approach
**Reference-Based + Luxury Spa Fusion**: Blend Airbnb's card aesthetics with luxury spa visual language, creating a unique "calm tech-lux" experience that makes Web3/AI education feel serene and accessible.

## Core Design Principles
1. **Luxury Accessibility**: High-end spa aesthetics that invite rather than intimidate
2. **Calm Technology**: Tech education without overwhelm - soft, guided, ritualistic
3. **Sensory Digital**: Evoke spa sensations through color, motion, and space
4. **Mobile Sanctuary**: Mobile-first as a personal retreat device

## Color Palette

**Primary Colors:**
- Blush: 345 60% 94% (backgrounds, soft accents)
- Champagne: 40 50% 92% (neutral backgrounds, cards)
- Mint: 155 45% 93% (accents, success states)
- Onyx: 0 0% 5% (text, headers, depth)

**Accent:**
- Gold: 51 100% 50% at 60% opacity (premium badges, highlights, ritual completion)

**Gradients:**
- Hero backgrounds: Blush to Champagne (vertical)
- Card overlays: Mint to Champagne (diagonal)
- Ritual cards: Champagne with mint edge glow
- Shop cards: Blush to Champagne with gold shimmer

## Typography

**Fonts:**
- Headings: Playfair Display (serif, elegant, luxe)
  - H1: 48px/56px (mobile: 36px/44px), font-weight 600
  - H2: 36px/44px (mobile: 28px/36px), font-weight 600
  - H3: 24px/32px (mobile: 20px/28px), font-weight 500
- Body: Inter (sans-serif, clean, readable)
  - Large: 18px/28px, font-weight 400
  - Regular: 16px/24px, font-weight 400
  - Small: 14px/20px, font-weight 400
  - Labels: 12px/16px, font-weight 500, uppercase tracking

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 24, 32 for consistency
- Mobile: py-12 section spacing, px-4 container
- Desktop: py-24 section spacing, px-8 container, max-w-7xl centered

**Grid Patterns:**
- Rituals: 1 column mobile, 2 columns tablet, 3 columns desktop
- Shop: 1 column mobile, 2 columns tablet, 3 columns desktop (4th for bundle)
- Content max-width: 640px for text readability

## Component Library

### Cards (MenuCard for Rituals/Shop)
- Background: white/70 backdrop-blur-md (glassmorphism)
- Border: rounded-2xl, 1px solid white/40
- Shadow: soft multi-layer (0 4px 16px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04))
- Padding: p-6 mobile, p-8 desktop
- Hover: transform scale(1.02), shadow intensifies, 200ms ease

### Buttons (CTAButton)
- Primary: Onyx background, white text, rounded-full, px-8 py-4
- Hover: scale(1.05) with subtle gold glow
- Over images: backdrop-blur-md, white/20 background, white text, no additional hover states
- Secondary: border-2 onyx, onyx text, rounded-full

### Badges (PlanBadge)
- Free tier: Mint background, onyx text, rounded-full px-3 py-1, text-xs uppercase
- Pro tier: Gold background with shimmer, onyx text, rounded-full px-3 py-1

### Progress Elements
- ProgressRing: Circular SVG, mint stroke for complete, champagne for incomplete, 4px width
- Stepper: Numbered circles (onyx background when active, champagne when pending), connecting lines

### Paywall Overlay
- Blur filter on locked content: blur(8px)
- Overlay: gradient from transparent to blush/90
- Unlock button: centered, gold accent, pulsing subtle animation

### Forms (JournalEditor)
- Textarea: white/40 background, rounded-2xl, p-6, border mint on focus
- Autosave indicator: mint dot, "Saved" text, fade in/out

### Install Prompt
- Bottom sheet on mobile: slide up animation, backdrop blur, white/90 background
- Desktop: Top banner, dismiss-able, champagne background with onyx text

## Page-Specific Layouts

### Homepage Hero
- Full viewport height on desktop (min-h-screen), 80vh on mobile
- Centered content over gradient background (blush to champagne)
- H1 + subtitle stacked, max-width 640px
- CTA button prominent below, 250ms slide-up entrance
- Soft floating animation on decorative elements

### Rituals Grid
- Header: "Rituals" (Playfair, H1), subtitle explaining tiers
- Grid of 5 ritual cards with tier badges, duration, summary preview
- Each card: ritual title, tier badge top-right, duration with clock icon, 2-line summary
- Free tier cards slightly brighter to encourage entry

### Ritual Detail
- Hero section: Ritual title, tier badge, duration, full summary
- Stepper: Vertical list of numbered steps with completion checkboxes
- Pro rituals: Steps 1-2 visible, steps 3-5 blurred with overlay at 60% scroll
- Completion celebration: Confetti-like gold particles (subtle)

### Shop Page
- Hero: "Unwrap your ritual" headline over blush/champagne gradient
- 4-card grid: 3 Ritual Bags + 1 Bundle (larger/featured)
- Each bag card: Product name, scent list (elegant italic Inter), price, image placeholder
- Bundle card: Gold border accent, "Save $98" badge, trio images
- All cards link to Gumroad with smooth hover scale

### Journal
- Clean writing surface: white/50 glassmorphic container, max-width 768px centered
- Streak counter at top (placeholder): gold number, "day streak" label
- Large textarea with generous padding
- Autosave toast: mint background, bottom-right, 150ms fade

### MetaMuse Page
- Centered content, illustration/icon placeholder for AI assistant
- Large "Open MetaMuse" button with external link icon
- Soft description of what MetaMuse offers

### Events (Calendly)
- Full-width iframe embed, min-height 700px
- Champagne background padding around iframe
- Header: "Book your discovery call" (Playfair)

## Animations

**Motion Timing:** 150-250ms for all transitions (calm, not jarring)
- Card hovers: 200ms ease-in-out
- Page transitions: 250ms fade
- Button interactions: 150ms scale/color
- Toast notifications: 200ms slide-in from bottom

**Entrance Animations:**
- Hero content: 250ms fade + slide up, staggered 50ms per element
- Card grids: 150ms fade-in, stagger 30ms per card
- Ritual steps: reveal one-by-one on scroll (100ms each)

## Images

### Hero Section (Homepage)
- Large background image (1920x1080): Spa-inspired abstract with tech elements - soft rose petals floating in mint water with subtle geometric overlays suggesting digital connection. Soft focus, dreamy, calming.
- Position: cover, center, with gradient overlay (blush/60 to transparent)

### Ritual Cards
- Small icon images (64x64): Simple line-art icons representing each ritual (face, blockchain symbol, bath, NFT frame, VR headset) in onyx color
- Position: top-left of card

### Shop Page
- Product images (400x400): Each Ritual Bag photographed on champagne background with soft shadows. Crown candle prominently displayed.
- Bundle card: Composite of all three bags arranged artfully
- All images have subtle gold glow effect on hover

### MetaMuse Page  
- Decorative illustration (500x500): Abstract AI brain made of flowing mint/blush particles, centered above button
- Style: Minimal, modern, calming

### Events Page
- No additional images needed (Calendly provides its own interface)

## Accessibility & Dark Mode
- Maintain all color palettes as specified (no dark mode toggle needed - spa aesthetic is inherently light)
- Ensure text contrast: Onyx on light backgrounds always exceeds WCAG AA
- Focus states: 2px mint outline on all interactive elements
- Reduced motion: Respect prefers-reduced-motion for all animations

## Special Effects
- Glassmorphism: backdrop-blur-md on all cards with white/70 backgrounds
- Subtle shimmer on gold accents: linear gradient animation (3s infinite)
- Floating elements: Gentle 3s ease-in-out transform translateY animation
- Particle effects: Only on ritual completion (gold dots, 1s duration, then fade)

## Responsive Breakpoints
- Mobile: <768px (single column, larger touch targets, simplified navigation)
- Tablet: 768-1024px (2 columns, balanced layouts)
- Desktop: >1024px (3-4 columns, full visual treatment, hover states active)
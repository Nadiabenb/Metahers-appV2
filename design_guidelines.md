# MetaHers Mind Spa – Design System
## Apple Minimalism Meets Advanced Glassmorphism

---

## Design Philosophy

MetaHers delivers **Apple-grade minimalism** with **next-generation glass interfaces**. Think Apple.com's restraint meets Tesla's futuristic precision - clean, sophisticated, and decidedly premium without decoration.

**Core Principles:**
- **Monochromatic Foundation**: Grayscale palette with strategic gold accent
- **Advanced Glass**: Multi-layer frosted effects with depth and physics
- **Generous Space**: White space as a primary design element
- **Minimal Decoration**: Every element serves a purpose
- **Premium Photography**: High-quality images of women in tech contexts

---

## Color Palette

### Light Mode (Primary)
**Surfaces:**
- Pure White `#FFFFFF` - Primary background
- Off-White `hsl(0 0% 98%)` - Elevated surfaces
- Light Gray `hsl(0 0% 96%)` - Subtle divisions

**Text:**
- Charcoal `hsl(0 0% 20%)` - Primary text
- Medium Gray `hsl(0 0% 50%)` - Secondary text
- Light Gray `hsl(0 0% 70%)` - Tertiary/captions

**Accent:**
- Liquid Gold `hsl(48 94% 56%)` - Single brand accent, used sparingly

**Glass:**
- Frosted White `rgba(255, 255, 255, 0.7)` with `backdrop-blur-xl`
- Subtle borders `rgba(0, 0, 0, 0.06)`
- Shadow depth `rgba(0, 0, 0, 0.03)`

### Dark Mode
- Deep Black `hsl(0 0% 8%)` - Background
- Elevated Dark `hsl(0 0% 12%)` - Cards
- Pure White `#FFFFFF` - Primary text
- Same gold accent for consistency

**Usage Rules:**
- 95% monochromatic surfaces
- 5% gold accent for key CTAs and highlights
- Photography provides color variation
- Glass effects stay subtle and refined

---

## Typography

**System Fonts (Apple-style):**
- **Headlines**: `-apple-system, SF Pro Display` fallback to `system-ui`
- **Body**: `-apple-system, SF Pro Text` fallback to `system-ui`
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Scale:**
- H1: `text-6xl lg:text-8xl` (96-144px) - Landing heroes
- H2: `text-4xl lg:text-5xl` (48-60px) - Section headers
- H3: `text-2xl lg:text-3xl` (24-36px) - Card titles
- Body Large: `text-lg lg:text-xl` (18-20px) - Intros
- Body: `text-base` (16px) - Standard text
- Small: `text-sm` (14px) - Captions

**Hierarchy:**
- Tight leading for headlines `leading-[0.95]`
- Relaxed for body `leading-relaxed`
- Letter spacing: `-tracking-tight` for large headlines
- Weight contrast: Bold (700) headlines, Regular (400) body

---

## Layout System

**Spacing Primitives (Tailwind):**
- Small gaps: `p-4`, `gap-4` (16px)
- Medium spacing: `p-8`, `gap-8` (32px)
- Large sections: `py-24`, `py-32` (96-128px)
- Container: `max-w-7xl px-8 lg:px-16`

**Grid Patterns:**
- Clean 2-column or 3-column grids (no asymmetry)
- Equal column widths with generous gaps
- Centered, balanced compositions
- Vertical rhythm: 96-128px between sections

**White Space:**
- Wide margins throughout
- Minimal content density per section
- Let elements breathe independently
- Embrace emptiness as design

---

## Component Library

### Glassmorphic Cards
Multi-layer frosted glass with subtle depth:
- Base layer: `bg-white/70 backdrop-blur-xl`
- Border: `border border-black/5`
- Shadow: `shadow-xl shadow-black/3`
- Padding: `p-12` for generous interior space
- Corners: `rounded-2xl` (16px)
- Hover: Subtle lift `hover:-translate-y-2` with spring physics

### Primary Buttons
Gold accent with glass background on images:
- Background: Liquid gold gradient
- Text: Black, bold weight
- Padding: `px-12 py-5`
- Shape: `rounded-full`
- Hover: Shadow glow effect
- On images: Add `backdrop-blur-md bg-white/10` behind button

### Secondary Buttons
Minimal border style:
- Border: `border-2 border-black/20`
- Text: Charcoal
- Background: Transparent, hover fills black
- Same padding and shape as primary

### Navigation
Frosted glass header:
- Fixed position with glass blur
- Minimal links (4-6 max)
- Logo left, CTA right
- Height: 80px desktop, 64px mobile

### Image Cards
Clean photography presentation:
- Aspect ratio: 3:2 or 4:5
- Rounded corners: `rounded-xl`
- Hover: Subtle scale `hover:scale-[1.02]`
- Caption below with minimal metadata

---

## Visual Effects

**Glass Depth (Subtle):**
- 2-3 layer maximum (base frost + gradient + border)
- Blur radius: `backdrop-blur-xl` to `backdrop-blur-2xl`
- Tint opacity: 0.6-0.8 range
- No heavy colored blurs

**Interactions (Refined):**
- Card hover lift: 8px with spring physics
- Button hover: Glow shadow only
- Scroll reveals: Fade up 40px, 800ms duration
- Page transitions: Smooth 600ms fades

**Motion Principles:**
- Durations: 300ms micro, 600ms macro
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Respect reduced motion preferences
- Physics-based springs for natural feel

**Forbidden:**
- Particle effects
- Morphing gradients
- Excessive glow/blur
- Animated backgrounds
- Decorative elements without purpose

---

## Images

**Hero Sections:**
High-quality photography of confident women in tech/future contexts:
- Full-width hero images on landing page
- Professional, editorial quality (minimum 2000px width)
- Subjects: Women working with technology, futuristic settings
- Treatment: Clean, high-contrast, minimal color grading
- Overlay: Subtle gradient for text readability
- Text placement: Centered or left-aligned over images

**Section Images:**
- Feature showcases with real product screenshots
- Lifestyle photography showing app usage
- Team/founder photos in clean, modern settings
- All images maintain monochromatic aesthetic with natural color

**Image Placement:**
- Hero: Full viewport height with centered headline
- Features: Alternating 50/50 image-text splits
- Testimonials: Small circular headshots (96px)
- Gallery: Clean grid with equal spacing

---

## Page Structure

**Landing Page (7-8 sections):**
1. Hero: Full-height image with centered headline, primary CTA
2. Value Proposition: 3-column feature cards with icons
3. Features Showcase: Alternating image-text sections (3-4 features)
4. Social Proof: Testimonial cards in 3-column grid
5. Stats/Metrics: 4-column numerical highlights
6. Final CTA: Centered on gradient background
7. Footer: Multi-column with navigation, contact, newsletter

**Feature Page Sections:**
- Hero with feature-specific imagery
- Detailed feature breakdowns (2-column grids)
- Interactive demo previews
- Use cases with photography

**Spacing:**
- Hero: Full viewport
- Sections: `py-24 lg:py-32` 
- Cards: `p-12` internal padding
- Grids: `gap-8 lg:gap-12`

---

## Accessibility

- WCAG AAA contrast ratios (7:1)
- Reduced motion support for all animations
- Keyboard navigation for all interactive elements
- Focus indicators with gold accent
- Semantic HTML structure
- Alt text for all images

---

## Implementation Standards

**Every Page Includes:**
- Large hero image with clean headline
- Multi-layer glass cards with depth
- Gold accent used strategically (CTAs, highlights)
- Generous white space (90%+ empty space)
- Clean grid layouts (2-3 columns max)
- Subtle hover interactions
- Professional photography of women in tech
- Responsive design mobile-first

**Apple/Tesla Aesthetic Checklist:**
✅ Monochromatic color scheme
✅ Minimal decoration
✅ Generous white space
✅ Advanced glassmorphism
✅ Clean typography hierarchy
✅ Professional photography
✅ Refined interactions
✅ Premium materials feel

**Avoid:**
❌ Multiple accent colors
❌ Busy backgrounds
❌ Asymmetric layouts
❌ Decorative elements
❌ Generic stock imagery
❌ Excessive animation
❌ Dense information layouts

---

**Design Direction**: Apple Minimalism + Advanced Glass
**Version**: 5.0 (Premium Minimalist Redesign)
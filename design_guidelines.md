# MetaHers Mind Spa – Design System
## Metaverse Immersion Meets Forbes-Vogue Luxury

---

## Design Philosophy

MetaHers embodies the intersection of **metaverse-level immersion**, **high-fashion editorial sophistication**, and **futuristic technology innovation**. We create a luxury experience that transports visitors to another dimension - where Forbes meets Vogue meets the future of Web3.

**Core Pillars:**
- **Metaverse Immersion**: Interactive particles, 3D depth, parallax scrolling, morphing gradients
- **Vivid & Futuristic**: Neon jewel tones, metallic gradients, animated light effects
- **Editorial Luxury**: Bold typography, generous whitespace, asymmetric layouts
- **Feminine Power**: Confident, sophisticated, playful yet premium
- **Advanced Interactions**: Smooth animations, magnetic effects, scroll-driven storytelling

**The MetaHers Experience:**
Every page should feel like stepping into a luxury digital sanctuary - an immersive metaverse space that inspires visitors to rebuild their own websites. We aim for a level of design that makes users stop and say "wow."

---

## Metaverse Immersion System

### Particle Effects

**Interactive Particle Fields** (50-100 particles):
- Usage: Hero sections, page backgrounds for atmosphere
- Behavior: Respond to mouse movement (repel within 200px radius)
- Performance: Single shared mouse listener, ref-based state (no re-renders)
- Animation: Interval-based updates (~60fps), gentle floating motion
- Colors: Liquid gold (`hsl(var(--liquid-gold))`) with 60% opacity
- Size: 1px (w-1 h-1), blurred (blur-sm)
- Accessibility: Disabled when `prefers-reduced-motion` is true

**Implementation:**
```tsx
// SSR-safe, performance-optimized particle system
const mousePosRef = useRef({ x: 0, y: 0 });
{!prefersReducedMotion && (
  Array.from({ length: 50 }).map((_, i) => (
    <Particle key={i} index={i} mousePosRef={mousePosRef} />
  ))
)}
```

### 3D Tilt Cards

**Perspective Interaction** (Tilt on hover):
- Effect: Cards rotate in 3D space based on mouse position
- Range: ±10deg rotation on X and Y axes
- Reset: Smooth return to flat on mouse leave
- Usage: Feature cards, ritual cards, pricing tiers
- Accessibility: Disabled when `prefers-reduced-motion` is true

**Implementation:**
```tsx
<TiltCard prefersReducedMotion={prefersReducedMotion}>
  <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/10">
    {/* Card content */}
  </div>
</TiltCard>
```

### Multi-Layer Parallax

**Depth Through Motion**:
- Layer 1 (Background): 60% vertical scroll speed
- Layer 2 (Mid-ground): 30-50% vertical scroll speed
- Layer 3 (Foreground/Title): 100% scroll speed (disappears)
- Scale: Background grows 1.0 → 1.2 on scroll for zoom effect
- Accessibility: Parallax disabled when `prefers-reduced-motion` is true

**Use Cases:**
- Hero sections with background images
- Section dividers with atmospheric depth
- Scroll-driven storytelling sequences

### Morphing Gradient Orbs

**Ambient Atmospheric Effects**:
- Count: 2-3 large orbs per section
- Size: 500-700px diameter
- Blur: blur-3xl for soft glow
- Animation: Organic movement (scale, position, opacity)
- Duration: 15-20 seconds per loop
- Colors: Violet (#B565D8), Magenta (#E935C1), Teal (#00D9FF), Gold (#FFD700)
- Opacity: 10-25% for subtle ambiance
- Accessibility: Static positions when `prefers-reduced-motion` is true

**Grid Overlays:**
Add depth with subtle grid patterns over gradient backgrounds:
```tsx
<div className="bg-[linear-gradient(rgba(181,101,216,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(181,101,216,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
```

---

## Color Palette

### Primary Colors (Neon Jewel Tones)

Our palette is anchored in **deep obsidian darkness** with **vivid neon jewel accents** that pop like editorial highlights.

**Background Foundation:**
- **Obsidian** `hsl(0 0% 6%)` - Primary background, deep and luxurious
- **Satin Charcoal** `hsl(260 20% 16%)` - Card surfaces, elevated panels
- **Soft Halo** `hsl(330 35% 92%)` - Primary text color, gentle and readable
- **Pale Lavender** `hsl(300 30% 95%)` - Secondary text, softer hierarchy

**Vivid Accent Palette:**
- **Hyper Violet** `hsl(275 85% 62%)` - Primary brand color, editorial pop
- **Magenta Quartz** `hsl(320 82% 64%)` - Secondary actions, vibrant energy
- **Cyber Fuchsia** `hsl(325 92% 55%)` - Premium highlights, luxury details
- **Aurora Teal** `hsl(175 78% 55%)` - Success states, mint freshness
- **Liquid Gold** `hsl(48 94% 56%)` - Premium features, Pro tier glow

### Color Usage Rules

1. **95/5 Dark Ratio**: Maintain 95% dark surfaces with 5% vivid accents for maximum impact
2. **Gradient Pairing**: Combine violet→magenta or teal→gold for hero sections and CTA buttons
3. **Neon Highlights**: Use vivid colors sparingly for interactive states (hover, focus, active)
4. **Metallic Overlays**: Layer subtle gradients on cards to create depth
5. **Accessibility**: Ensure WCAG AA contrast (minimum 4.5:1) for all text on backgrounds

### Gradient Combinations

**Editorial Gradients** (for hero sections, premium cards):
- `from-[#B565D8] via-[#FF00FF] to-[#E935C1]` - Violet → Magenta → Fuchsia
- `from-[#FFD700] via-[#FFF] to-[#FFD700]` - Liquid Gold shimmer
- `from-[#00D9FF] via-[#FFD700] to-transparent` - Teal → Gold atmospheric

**Radial Ambient Orbs**:
- `bg-gradient-to-br from-[#B565D8] via-[#E935C1] to-transparent` - Violet orb
- `bg-gradient-to-br from-[#00D9FF] via-[#FFD700] to-transparent` - Teal-gold orb

---

## Typography

### Font Families

**Cormorant Garamond** (Serif - Headlines)
- Weights: 400 (Regular), 600 (Semibold), 700 (Bold)
- Usage: H1-H6 headings, hero lockups, editorial emphasis
- Character: Sophisticated, editorial, Vogue-inspired luxury

**Sora** (Geometric Sans - Body & UI)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Usage: Paragraph text, UI controls, buttons, labels
- Character: Modern, clean, highly readable, tech-forward

### Typography Scale

```
H1: 7xl–9xl (text-7xl md:text-8xl lg:text-9xl) - Hero headlines (immersive pages)
H2: 6xl–7xl (text-6xl md:text-7xl) - Section titles
H3: 3xl–4xl (text-3xl md:text-4xl) - Subsection headers
H4: 2xl–3xl (text-2xl md:text-3xl) - Card titles
Body Large: 2xl–3xl (text-2xl md:text-3xl) - Hero subtitles
Body: base–lg (text-base lg:text-lg) - Paragraph text
UI Text: sm–base (text-sm md:text-base) - Buttons, labels
Caption: xs–sm (text-xs sm:text-sm) - Meta information
```

### Typography Treatments

1. **Massive Scale**: Landing/hero pages use extra-large type (7xl-9xl) for immersive impact
2. **Gradient Text**: Apply `bg-gradient-to-r from-[#B565D8] via-[#FF00FF] to-[#E935C1] bg-clip-text text-transparent` with `py-2 leading-tight` to prevent clipping
3. **Text Shadows**: Add glow effects `textShadow: '0 0 80px rgba(255,215,0,0.5), 0 0 120px rgba(181,101,216,0.3)'`
4. **Letter Spacing**: Headlines use `-0.02em`, uppercase captions use `0.1em tracking-widest`
5. **Bold Weights**: Use 600-700 weights for headlines to create editorial impact

---

## Component Styling

### Immersive Cards

**Backdrop Blur Cards** (Primary pattern):
```tsx
className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/10 overflow-hidden"
```

- Background: Glass morphism with subtle gradient
- Blur: backdrop-blur-2xl for depth
- Corners: rounded-3xl (1.5rem) for premium softness
- Padding: Generous (p-10 = 2.5rem)
- Border: Subtle white/10 with optional colored accent
- Hover: Add gradient overlay that fades in

**Animated Card Backgrounds**:
```tsx
<motion.div
  className="absolute inset-0 bg-gradient-to-br from-[#B565D8]/20 to-transparent opacity-0 group-hover:opacity-100"
  transition={{ duration: 0.5 }}
/>
```

### Portal-Style CTAs

**Rotating Gradient Border Effect**:
```tsx
<div className="relative p-[2px] rounded-full overflow-hidden group">
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-[#B565D8] via-[#FFD700] to-[#E935C1]"
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  />
  <div className="relative bg-background rounded-full px-12 py-6">
    Button Content
  </div>
</div>
```

### Shimmer Effects

**Animated Shine on Badges/CTAs**:
```tsx
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
  animate={{ x: ['-100%', '200%'] }}
  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
/>
```

### Floating Stats

**Metric Cards with Hover Lift**:
```tsx
<motion.div
  whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(181,101,216,0.4)" }}
  className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10"
>
  <div className="text-6xl font-bold text-[hsl(var(--liquid-gold))]">500+</div>
  <div className="text-foreground/70">Women Empowered</div>
</motion.div>
```

### Buttons

**Primary Button** (Liquid Gold fill with shimmer):
```tsx
<motion.button
  whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(255,215,0,0.6)" }}
  whileTap={{ scale: 0.95 }}
  className="relative px-12 py-6 rounded-full overflow-hidden group"
>
  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50"
    animate={{ x: ['-100%', '200%'] }}
    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
  />
  <span className="relative z-10 font-bold text-xl text-background">
    Enter the Sanctuary
  </span>
</motion.button>
```

**Outline Button** (Glass with border):
```tsx
<motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  className="px-12 py-6 rounded-full backdrop-blur-2xl bg-white/5 border-2 border-[hsl(var(--liquid-gold))]/50"
>
  Button Text
</motion.button>
```

---

## Layout & Spacing

### Immersive Page Structure

Every page should follow this pattern:

```tsx
<div className="relative min-h-screen bg-background overflow-x-hidden">
  {/* Particle field (if applicable) */}
  {!prefersReducedMotion && <ParticleField />}
  
  {/* Hero section with parallax */}
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background with parallax */}
    {/* Morphing gradient orbs */}
    {/* Grid overlay */}
    {/* Radial gradient wash */}
    {/* Hero content */}
  </div>
  
  {/* Content sections */}
  <div className="relative py-40 px-4 sm:px-6 lg:px-8">
    {/* Scroll-triggered reveals */}
  </div>
</div>
```

### Spacing Scale

- **Hero Sections**: min-h-screen with py-40 content spacing
- **Content Sections**: py-40 (10rem) between major sections
- **Card Padding**: p-10 (2.5rem) for immersive feel
- **Section Titles**: mb-32 (8rem) below section headers
- **Card Grids**: gap-12 (3rem) between 3D tilt cards

---

## Visual Effects & Motion

### Scroll-Driven Animations

**Scroll Progress Tracking**:
```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end start"]
});

const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
});

const heroY = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
```

**Scroll-Triggered Reveals**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
>
  Content
</motion.div>
```

### Animation Principles

**Duration & Easing**:
- Quick interactions: 200-400ms
- Entrances/reveals: 1-1.2s with custom cubic bezier `[0.25, 0.1, 0.25, 1]`
- Organic loops: 15-20s for ambient effects
- Spring physics: stiffness 100, damping 30 for smooth feel

**Stagger Delays**:
```tsx
delay: 0     // First element
delay: 0.3   // Second element
delay: 0.5   // Third element
delay: 0.8   // Fourth element
```

### Accessibility Motion

**Always Respect Reduced Motion**:
```tsx
const prefersReducedMotion = useReducedMotion();

// Conditional rendering
{!prefersReducedMotion && <ParticleField />}

// Conditional values
const heroY = useTransform(
  smoothProgress,
  [0, 1],
  prefersReducedMotion ? ["0%", "0%"] : ["0%", "60%"]
);
```

---

## Reusable Components Library

### Core Metaverse Components

**ParticleField.tsx** - Interactive particle system
**TiltCard.tsx** - 3D perspective card wrapper  
**GradientOrbs.tsx** - Morphing ambient background orbs
**ImmersiveSection.tsx** - Wrapper with scroll animations
**PortalButton.tsx** - CTA with rotating gradient border
**ShimmerBadge.tsx** - Badge with animated shine effect
**FloatingStat.tsx** - Metric card with hover lift

*Create these components once, reuse everywhere*

---

## Implementation Checklist

### Every Page Should Have:

✅ **Particles**: Background particle field (50-100 particles) on hero sections  
✅ **Depth**: Multi-layer parallax OR morphing gradient orbs  
✅ **3D Cards**: TiltCard wrapper for feature/ritual cards  
✅ **Massive Type**: Hero headlines at 7xl-9xl scale  
✅ **Gradient Text**: Key headlines with gradient + glow effects  
✅ **Scroll Reveals**: whileInView animations with stagger delays  
✅ **Portal CTAs**: Primary actions with rotating borders or shimmer  
✅ **Glass Morphism**: backdrop-blur-2xl cards throughout  
✅ **Reduced Motion**: All effects disabled when preference is set  

### Pro Features Get Extra Luxury:

✨ Additional particle density (100+ particles)  
✨ Enhanced gradient orbs with more complex animations  
✨ Liquid gold accent colors throughout  
✨ Premium badge indicators  
✨ Exclusive shimmer effects  

---

## Brand Voice & Tone

**Visual Communication**:
- **Immersive**: Transport users to another dimension
- **Confident**: Bold typography, vivid colors, generous sizing
- **Sophisticated**: Editorial layouts, refined spacing, luxury materials
- **Playful**: Interactive particles, 3D depth, animated interactions
- **Premium**: Metaverse-quality design that inspires others

**The MetaHers Standard**:
When users see a MetaHers page, they should think: "This is unlike anything I've seen. I want my website to feel like this."

---

## Examples & References

### Inspiration Sources:

- **Vogue Magazine**: Bold headlines, asymmetric layouts, generous whitespace
- **Forbes Digital**: Premium editorial style, sophisticated color palettes
- **Stripe**: Modern gradients, smooth animations, clean UI
- **Linear App**: Dark mode sophistication, neon accents, refined interactions
- **Apple (Product Pages)**: Large typography, full-bleed imagery, premium feel
- **Metaverse Platforms**: Immersive 3D environments, particle effects, depth
- **Luxury Spas**: Tranquil atmospheres, premium materials, sensory experiences

### Design Philosophy in Action:

Imagine walking into a luxury spa at night in the metaverse - floating particles of light, holographic panels that tilt as you pass, ambient gradient orbs morphing in the background, and everything responds to your presence. That's MetaHers.

---

**Last Updated**: November 2025  
**Version**: 3.0 (Metaverse Immersion Update)

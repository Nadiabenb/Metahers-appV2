# MetaHers Mind Spa – Design System
## Editorial Vogue Meets Kinetic Glass

---

## Design Philosophy

MetaHers embodies **high-fashion editorial sophistication** meets **next-generation kinetic interfaces**. We create a luxury magazine experience that feels alive - where Vogue meets Apple product pages meets the future of interaction design.

**Core Pillars:**
- **Editorial First**: Magazine-quality layouts, asymmetric grids, large-scale photography
- **Kinetic Depth**: Multi-layer glass effects, physics-based movement, spotlight interactions
- **Refined Luxury**: Gold accents, generous white space, sophisticated restraint
- **Typography Hierarchy**: Massive serif headlines, elegant body copy, pull-quote moments
- **Human Photography**: Real women in tech/fashion contexts, not illustrations or abstract graphics

**The MetaHers Experience:**
Every page should feel like browsing a luxury fashion magazine about the future - clean, sophisticated, and decidedly NOT like another SaaS app. Less purple gradients, more editorial photography. Less busy backgrounds, more intentional composition.

---

## Color Palette

### **LIGHT MODE FIRST** - Editorial Foundation

**Background & Surfaces:**
- **Ivory Cream** `hsl(40 30% 97%)` - Primary background, like magazine paper
- **Warm White** `hsl(40 20% 99%)` - Elevated cards, subtle hierarchy
- **Soft Charcoal** `hsl(0 0% 20%)` - Primary text, high contrast
- **Graphite Gray** `hsl(0 0% 45%)` - Secondary text, editorial subtlety

**Accent Colors:**
- **Liquid Gold** `hsl(48 94% 56%)` - Primary brand color, luxury highlight
- **Rose Gold** `hsl(20 75% 70%)` - Warm metallic accent
- **Champagne** `hsl(45 50% 80%)` - Subtle premium details
- **Deep Charcoal** `hsl(0 0% 15%)` - Buttons, bold elements

**Glass Tints:**
- **Frosted White** `rgba(255, 255, 255, 0.7)` - Glass panels with backdrop-blur
- **Warm Tint** `rgba(255, 250, 245, 0.9)` - Slightly warm glass overlay
- **Shadow Depth** `rgba(0, 0, 0, 0.04)` - Subtle layering shadows

### **DARK MODE** - Sophisticated Alternative

**Background & Surfaces:**
- **Deep Obsidian** `hsl(0 0% 6%)` - Primary background
- **Elevated Charcoal** `hsl(260 10% 12%)` - Card surfaces
- **Soft Cream** `hsl(40 30% 95%)` - Primary text
- **Muted Ivory** `hsl(40 20% 75%)` - Secondary text

**Accent Colors:**
- **Liquid Gold** `hsl(48 94% 56%)` - Consistent across themes
- **Rose Gold** `hsl(20 75% 70%)` - Warm metallic
- Same accents but they pop more against dark

###Color Usage Rules

1. **90/10 White Ratio**: 90% ivory/white surfaces, 10% bold photography and gold accents
2. **Single Accent**: Gold is the primary accent - use sparingly for maximum impact
3. **Photography First**: Let hero images carry color, not backgrounds
4. **Subtle Glass**: Frosted effects with barely-there tints, not heavy colored blurs
5. **High Contrast Text**: Always ensure WCAG AAA (7:1) for body text

---

## Typography

### Font Families

**Cormorant Garamond** (Serif - Editorial Headlines)
- Weights: 400 (Regular), 600 (Semibold), 700 (Bold)
- Usage: All headlines H1-H6, pull quotes, editorial emphasis
- Character: Vogue-level sophistication, timeless elegance

**Sora** (Sans Serif - Body & UI)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)
- Usage: Paragraph text, UI elements, captions, metadata
- Character: Modern, readable, clean geometric forms

### Typography Scale & Hierarchy

```
H1: 8xl-9xl (text-8xl lg:text-9xl) - Magazine cover headlines, landing heroes
H2: 5xl-6xl (text-5xl lg:text-6xl) - Section dividers, major moments
H3: 3xl-4xl (text-3xl lg:text-4xl) - Subsection headers
H4: xl-2xl (text-xl lg:text-2xl) - Card titles, feature headers
Body Large: lg-xl (text-lg lg:text-xl) - Introductory paragraphs
Body: base (text-base) - Standard paragraph text (16px)
Small: sm (text-sm) - Captions, metadata, fine print
Tiny: xs (text-xs) - Legal, timestamps
```

### Editorial Typography Treatments

**Magazine-Style Pull Quotes:**
```tsx
<blockquote className="border-l-4 border-[hsl(var(--liquid-gold))] pl-8 py-4 my-12">
  <p className="font-serif text-3xl lg:text-4xl italic leading-tight text-foreground/90">
    "AI isn't replacing you - it's amplifying your genius."
  </p>
  <cite className="block mt-4 text-sm uppercase tracking-widest text-muted-foreground">
    — Nadia, Founder
  </cite>
</blockquote>
```

**Massive Editorial Headlines:**
```tsx
<h1 className="font-serif text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8">
  Master AI.<br />
  Own Web3.<br />
  <span className="text-[hsl(var(--liquid-gold))]">Build Empire.</span>
</h1>
```

**Editorial Spacing:**
- Large headlines: `leading-[0.9]` for tight, impactful stacking
- Body text: `leading-relaxed` (1.625) for comfortable reading
- Section spacing: Minimum 120px (`mb-32`) between major sections

---

## Layout & Composition

### Asymmetric Editorial Grids

**Break the Grid:**
- 2/3 + 1/3 column splits instead of 50/50
- Overlapping elements (images extending beyond containers)
- Text wrapping around images (magazine style)
- Intentional white space as a design element

**Example: Hero Layout**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
  {/* Text takes 2 columns */}
  <div className="lg:col-span-2 space-y-8">
    <h1>Massive Headline</h1>
    <p className="text-xl">Introductory copy...</p>
  </div>
  
  {/* Image takes 1 column but extends beyond */}
  <div className="relative lg:-mr-32">
    <img src="editorial-photo.jpg" className="w-full" />
  </div>
</div>
```

### Generous White Space

**Spacing Philosophy:**
- Let content breathe - don't fill every pixel
- Wide margins: `container max-w-7xl px-8 lg:px-16`
- Vertical rhythm: `space-y-24` or `space-y-32` between sections
- Card padding: `p-12` to `p-16` for premium feel

---

## Component Styling

### Kinetic Glass Cards

**Primary Card Pattern:**
```tsx
<div className="relative group">
  {/* Multi-layer glass effect */}
  <div className="absolute inset-0 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl" />
  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl" />
  
  {/* Card content */}
  <div className="relative p-12 rounded-2xl border border-black/5 dark:border-white/10">
    <h3 className="font-serif text-3xl font-bold mb-4">Card Title</h3>
    <p className="text-muted-foreground">Card content...</p>
  </div>
  
  {/* Hover spotlight effect */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="absolute inset-0 bg-gradient-radial from-[hsl(var(--liquid-gold))]/10 to-transparent" />
  </div>
</div>
```

**Depth Layers:**
1. Base layer: Frosted glass background
2. Gradient overlay: Subtle directional tint
3. Content layer: Text and images
4. Interactive layer: Spotlight/hover effects

### Editorial Photography Cards

**Image-First Cards:**
```tsx
<div className="group cursor-pointer">
  {/* Large editorial image */}
  <div className="aspect-[4/5] overflow-hidden rounded-lg mb-6">
    <img 
      src="woman-in-tech.jpg" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
  </div>
  
  {/* Minimal caption */}
  <div className="space-y-2">
    <h3 className="font-serif text-2xl font-semibold">Experience Title</h3>
    <p className="text-sm text-muted-foreground uppercase tracking-wider">25 minutes · Pro</p>
  </div>
</div>
```

### Gold Accent Buttons

**Primary CTA:**
```tsx
<button className="group relative px-12 py-5 rounded-full overflow-hidden bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--liquid-gold))]/80 text-black font-semibold text-lg hover:shadow-2xl hover:shadow-[hsl(var(--liquid-gold))]/20 transition-all duration-300">
  <span className="relative z-10">Start Learning</span>
  
  {/* Shimmer effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
</button>
```

**Secondary CTA:**
```tsx
<button className="px-12 py-5 rounded-full border-2 border-black dark:border-white/20 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300 font-semibold">
  Learn More
</button>
```

---

## Visual Effects & Interactions

### Physics-Based Movement

**Card Hover Lift:**
```tsx
<motion.div
  whileHover={{ 
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }}
  className="..."
>
  Card content
</motion.div>
```

**Smooth Parallax:**
```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

<motion.div style={{ y }} className="...">
  Background layer
</motion.div>
```

### Spotlight Following Cursor

**Luxury Showroom Effect:**
```tsx
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

<div 
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }}
  className="relative group"
>
  <div 
    className="absolute w-64 h-64 rounded-full bg-gradient-radial from-[hsl(var(--liquid-gold))]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    style={{
      left: mousePosition.x - 128,
      top: mousePosition.y - 128,
    }}
  />
  
  {/* Card content */}
</div>
```

### Refined Glass Depth

**Multi-Layer Frosting:**
```tsx
{/* Layer 1: Base frost */}
<div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-2xl" />

{/* Layer 2: Gradient tint */}
<div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />

{/* Layer 3: Border glow */}
<div className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5" />
```

### Scroll-Driven Reveals

**Editorial Fade-Up:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
>
  Content section
</motion.div>
```

**Stagger Children:**
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Image Guidelines

### Editorial Photography Standards

**Subject Matter:**
- Real women (diverse representation) in tech/fashion contexts
- Futuristic high-fashion settings
- Digital/tech environments with luxury aesthetic
- Confident, powerful feminine energy

**Quality Standards:**
- Vogue/Forbes magazine cover quality
- Sharp professional focus
- High-resolution (min 2000px width for heroes)
- Professional lighting and composition

**Treatment:**
- Minimal filters - let photography shine
- Slight color grading for consistency
- Gold/warm color grading when appropriate
- Never use generic stock photos or illustrations

### Image Layout Patterns

**Hero Images:**
```tsx
<div className="relative h-screen">
  <img 
    src="hero.jpg" 
    className="absolute inset-0 w-full h-full object-cover"
  />
  
  {/* Dark gradient wash for text readability */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
  
  {/* Text overlay */}
  <div className="relative z-10 h-full flex items-center justify-center text-white">
    <h1 className="text-9xl font-serif font-bold">Headline</h1>
  </div>
</div>
```

**Editorial Image Cards:**
- Aspect ratio: 4:5 (portrait) or 3:2 (landscape)
- Rounded corners: `rounded-lg` (8px) not too round
- Hover effect: Subtle scale (1.05) with long duration (700ms)

---

## Animation Principles

### Refined & Intentional

**Duration Guidelines:**
- Micro-interactions: 200-300ms
- Card hovers: 300-500ms  
- Page transitions: 600-800ms
- Scroll reveals: 800-1000ms
- Ambient effects: Remove or make extremely subtle

**Easing:**
- Default: `ease-out` for entrances
- Interactive: `cubic-bezier(0.25, 0.1, 0.25, 1)` for smooth feel
- Spring physics: `type: "spring", stiffness: 300, damping: 20`

**Less is More:**
- No particle fields
- No morphing gradient orbs
- No excessive glow effects
- Subtle, sophisticated, intentional movement only

---

## Accessibility

### Motion Respect

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
>
  Content
</motion.div>
```

### Color Contrast

- **AAA Standard**: 7:1 for body text
- **AA Large**: 4.5:1 for headings
- Test all color combinations
- Provide sufficient contrast in both themes

---

## Implementation Checklist

### Every Page Should Have:

✅ **Large Editorial Photography** - Hero images of real women in tech contexts
✅ **Asymmetric Layouts** - Break the grid, 2/3 + 1/3 splits
✅ **Massive Typography** - Headlines at 6xl-9xl scale
✅ **Generous White Space** - Wide margins, vertical rhythm
✅ **Kinetic Glass Cards** - Multi-layer frosted effects with depth
✅ **Gold Accents Only** - No purple/pink gradients
✅ **Refined Interactions** - Subtle hover lifts, spotlight effects
✅ **Editorial Spacing** - 120px+ between major sections
✅ **Reduced Motion Support** - All animations respect user preferences

### Avoid These "Generic AI App" Patterns:

❌ Purple/pink/blue gradient backgrounds
❌ Particle fields and floating orbs
❌ Bento grid layouts
❌ Generic illustrations or 3D renders
❌ Excessive glow effects
❌ Busy, cluttered backgrounds
❌ Cookie-cutter card grids
❌ Generic SaaS button styles

---

## Brand Voice & Visual Language

**Editorial Sophistication:**
- Clean, intentional, purposeful
- Let photography and typography lead
- White space as a design element
- Restraint over decoration

**Kinetic Luxury:**
- Subtle glass depth with physics
- Spotlight interactions feel premium
- Smooth, spring-based animations
- Everything responds with weight and purpose

**The MetaHers Standard:**
When users see MetaHers, they should think: "This looks like a luxury fashion magazine website, not another tech startup." It should feel distinctly different from every other AI/Web3 education platform.

---

**Design Direction**: Editorial Vogue + Kinetic Glass
**Last Updated**: November 2025
**Version**: 4.0 (Editorial Luxury Redesign)

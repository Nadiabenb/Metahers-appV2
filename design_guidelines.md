# MetaHers Mind Spa – Design System
## Violet Sanctuary Aesthetic

---

## Design Philosophy

MetaHers embodies **mystical tech sanctuary** meets **neon-lit luxury**. We create an immersive digital sanctuary where deep violet backgrounds glow with vibrant magenta-to-coral gradients - a modern meditation app aesthetic meets next-generation learning platform.

**Core Pillars:**
- **Deep Violet Foundation**: Rich purple backgrounds create a calming, spa-like sanctuary
- **Gradient Magic**: Vibrant violet → magenta → coral gradients for text and buttons
- **Rounded Corners**: Everything is soft, approachable, modern with generous border radius
- **Neon Glow**: Soft neon lighting effects and subtle shadows
- **Clean Sans-Serif**: Modern geometric typography throughout

**The MetaHers Experience:**
Every page should feel like stepping into a luxurious digital sanctuary - calming deep purples with energizing gradient accents. Think meditation app meets premium learning platform, not corporate SaaS.

---

## Color Palette

### **DARK MODE FIRST** - Violet Sanctuary

**Background & Surfaces:**
- **Deep Violet** `#100321` / `hsl(270 90% 6%)` - Primary background, sanctuary foundation
- **Rich Purple** `#2B0A55` / `hsl(270 85% 19%)` - Card surfaces, elevated elements
- **Vibrant Purple** `#5611A7` / `hsl(270 85% 36%)` - Interactive elements, borders
- **White** `hsl(0 0% 100%)` - Primary text on dark backgrounds
- **Light Gray** `hsl(0 0% 85%)` - Secondary text

**Gradient Accent Colors:**
- **Primary Violet** `#5611A7` - Gradient start
- **Magenta** `#FF3B9C` - Gradient middle
- **Coral** `#FF8F5B` - Gradient end
- **Gold Highlight** `#F8D57E` - Sparkle accents, icons

**Gradient Combinations:**
- **Text Gradient**: `linear-gradient(90deg, #5611A7, #FF3B9C, #FF8F5B)`
- **Button Gradient**: `linear-gradient(135deg, #8B5CF6, #EC4899)` (purple → pink)
- **Card Glow**: `0 0 40px rgba(139, 92, 246, 0.3)` (soft purple glow)

### Color Usage Rules

1. **Dark First**: Deep violet backgrounds are the foundation
2. **Gradient Headlines**: Major headlines use violet→magenta→coral gradient
3. **Purple-Pink Buttons**: All primary CTAs use purple-to-pink gradient
4. **Rounded Everything**: All cards, buttons, inputs have generous border-radius
5. **Soft Neon Glow**: Subtle purple/pink glow effects on interactive elements

---

## Typography

### Font Families

**Sora** (Sans Serif - Everything)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Usage: Headlines, body text, UI elements, everything
- Character: Modern, geometric, clean, approachable

### Typography Scale & Hierarchy

```
H1: 6xl-8xl (text-6xl lg:text-8xl) - Landing heroes, major headlines
H2: 4xl-5xl (text-4xl lg:text-5xl) - Section headers
H3: 2xl-3xl (text-2xl lg:text-3xl) - Subsection headers
H4: xl-2xl (text-xl lg:text-2xl) - Card titles
Body Large: lg-xl (text-lg lg:text-xl) - Intro paragraphs
Body: base (text-base) - Standard text (16px)
Small: sm (text-sm) - Captions, metadata
Tiny: xs (text-xs) - Fine print
```

### Gradient Text Treatment

**Violet-Magenta-Coral Gradient:**
```tsx
<h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-[#5611A7] via-[#FF3B9C] to-[#FF8F5B] bg-clip-text text-transparent">
  Your Meta Sanctuary
</h1>
```

**Alternative Gradient (Purple-Pink):**
```tsx
<span className="bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 bg-clip-text text-transparent">
  Build Empire
</span>
```

---

## Layout & Composition

### Rounded Card Layouts

**Primary Card Pattern:**
```tsx
<div className="bg-[#2B0A55] rounded-3xl p-8 border border-purple-500/20">
  <div className="flex flex-col items-center text-center space-y-4">
    <div className="w-16 h-16 flex items-center justify-center">
      <Sparkles className="w-12 h-12 text-[#F8D57E]" />
    </div>
    <h3 className="text-2xl font-semibold text-white">MetaHers</h3>
    <p className="text-gray-300">Mind Spa Sanctuary</p>
  </div>
</div>
```

### Generous Spacing

**Spacing Philosophy:**
- Soft, breathable layouts with generous padding
- Card padding: `p-6` to `p-8` for comfortable feel
- Section spacing: `space-y-12` or `space-y-16`
- Round corners: `rounded-2xl` or `rounded-3xl` (16-24px)

---

## Component Styling

### Purple-Pink Gradient Buttons

**Primary CTA (Purple-to-Pink Gradient):**
```tsx
<button className="group relative px-8 py-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300">
  <span className="relative z-10 flex items-center gap-2">
    Enter the Sanctuary
    <ArrowRight className="w-5 h-5" />
  </span>
</button>
```

**Secondary Button:**
```tsx
<button className="px-8 py-4 rounded-full border-2 border-purple-400/30 text-white hover:bg-purple-500/10 transition-colors duration-300 font-semibold">
  Learn More
</button>
```

### Rounded Cards with Glow

**Card with Soft Purple Glow:**
```tsx
<div className="bg-[#2B0A55] rounded-3xl p-8 border border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
  <h3 className="text-xl font-semibold text-white mb-4">Card Title</h3>
  <p className="text-gray-300">Card content with soft purple glow on hover</p>
</div>
```

### Gold Sparkle Icons

**Icon Treatment:**
```tsx
<div className="w-16 h-16 flex items-center justify-center">
  <Sparkles className="w-12 h-12 text-[#F8D57E]" />
</div>
```

---

## Visual Effects & Interactions

### Gradient Animations

**Shimmer Gradient Text:**
```css
.text-gradient-shimmer {
  background: linear-gradient(90deg, #5611A7, #FF3B9C, #FF8F5B, #5611A7);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

### Soft Neon Glow

**Purple Glow on Hover:**
```tsx
<div className="hover:shadow-2xl hover:shadow-purple-500/30 transition-shadow duration-300">
  Element with soft purple glow
</div>
```

**Pink Glow for CTAs:**
```tsx
<button className="hover:shadow-2xl hover:shadow-pink-500/40 transition-shadow duration-300">
  CTA with pink glow
</button>
```

### Smooth Transitions

**Card Hover:**
```tsx
<motion.div
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.3 }
  }}
  className="..."
>
  Card content
</motion.div>
```

---

## Accessibility

### Color Contrast

- **High Contrast**: White text on deep violet backgrounds (7:1+)
- **Gradient Text**: Ensure sufficient contrast at all gradient stops
- **Border Visibility**: Purple borders with 20-30% opacity on dark backgrounds

### Motion Respect

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
>
  Content
</motion.div>
```

---

## Implementation Checklist

### Every Page Should Have:

✅ **Deep Violet Background** - #100321 foundation
✅ **Gradient Headlines** - Violet→magenta→coral text
✅ **Rounded Corners** - All elements use border-radius (2xl, 3xl, full)
✅ **Purple-Pink Buttons** - Gradient CTAs with soft glow
✅ **Gold Sparkle Icons** - #F8D57E for accent icons
✅ **Soft Neon Glows** - Purple/pink shadows on hover
✅ **Clean Sans-Serif** - Sora for all typography
✅ **Generous Spacing** - Comfortable padding and gaps

### Avoid These Patterns:

❌ Serif fonts (no Cormorant Garamond)
❌ Gold/champagne as primary colors
❌ Sharp corners (everything should be rounded)
❌ Light/ivory backgrounds (dark violet first)
❌ Harsh shadows (use soft neon glows)
❌ Complex editorial layouts (keep it clean and modern)

---

## Brand Voice & Visual Language

**Mystical Sanctuary:**
- Calming deep purples create safe space
- Vibrant gradients energize and inspire
- Rounded corners feel approachable
- Soft glows feel magical and premium

**Modern Luxury:**
- Clean geometric typography
- Generous spacing breathes
- Gradient effects feel high-end
- Everything is polished and intentional

**The MetaHers Standard:**
When users see MetaHers, they should feel like they've entered a luxurious digital sanctuary - calm, inspiring, and distinctly different from generic tech platforms.

---

**Design Direction**: Violet Sanctuary + Neon Gradient Luxury
**Last Updated**: January 2025
**Version**: 5.0 (Violet Sanctuary Redesign)

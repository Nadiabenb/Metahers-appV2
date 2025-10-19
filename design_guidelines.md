# MetaHers Mind Spa – Design System
## Forbes Meets Vogue: Luxury Tech-Editorial Aesthetic

---

## Design Philosophy

MetaHers embodies the intersection of **high-fashion editorial sophistication** and **futuristic technology innovation**, creating a world-class luxury experience for women. Think Vogue's bold typography and editorial layouts colliding with Forbes' premium authority, all rendered in vivid neon jewel tones on deep obsidian surfaces.

**Core Pillars:**
- **Vivid & Futuristic**: Neon jewel tones, metallic gradients, animated light effects
- **Editorial Luxury**: Bold typography, generous whitespace, asymmetric layouts
- **Feminine Power**: Confident, sophisticated, playful yet premium
- **Advanced UI**: Smooth animations, magnetic interactions, gradient washes

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
- `gradient-violet-magenta`: Violet → Magenta (135deg)
- `gradient-magenta-fuchsia`: Magenta → Cyber Fuchsia (135deg)
- `gradient-teal-gold`: Aurora Teal → Liquid Gold (135deg)

**Radial Accents** (for ambient backgrounds):
- `gradient-radial-violet`: Radial violet glow from center

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
H1: 4xl–6xl (text-4xl md:text-5xl lg:text-6xl) - Hero headlines
H2: 3xl–5xl (text-3xl md:text-4xl lg:text-5xl) - Section titles
H3: 2xl–3xl (text-2xl md:text-3xl) - Subsection headers
Body: base–lg (text-base lg:text-lg) - Paragraph text
UI Text: sm–base (text-sm md:text-base) - Buttons, labels
Caption: xs–sm (text-xs sm:text-sm) - Meta information
```

### Typography Treatments

1. **Generous Letter Spacing**: Headlines use `-0.02em`, uppercase captions use `0.1em` (Vogue editorial style)
2. **Gradient Text Effects**: Apply `.text-gradient-violet` or `.text-gradient-gold` to premium headlines
3. **Bold Weights**: Use 600-700 weights for headlines to create editorial impact
4. **Optical Hierarchy**: Combine size, weight, and color to guide attention
5. **Asymmetric Layouts**: Break grid occasionally for editorial flair (offset headlines, wrapped text blocks)

---

## Component Styling

### Cards & Panels

**Editorial Cards** (`.editorial-card`):
- Background: Gradient from charcoal to deeper charcoal
- Border: Subtle card-border with neon top accent line
- Rounded corners: `rounded-xl` (0.75rem)
- Padding: Generous (`p-6 lg:p-8`)
- Shadow: Neon-tinted shadows with violet/magenta glow

**Glass Morphism** (`.glass-card`):
- Background: `bg-card/40` with `backdrop-blur-xl`
- Border: `border-primary/20` with neon glow
- Usage: Floating elements, overlays, modal dialogs

### Buttons

**Primary Button** (Liquid Gold fill):
- Background: `bg-[hsl(var(--liquid-gold))]`
- Text: `text-obsidian` (dark text on bright gold)
- Hover: Neon glow effect (`.neon-glow-violet`)
- Shadow: Metallic shadow with gold tint

**Secondary Button** (Magenta Quartz):
- Background: `bg-secondary`
- Border: Neon border with `.neon-border-violet`
- Hover: Gradient shift animation

**Outline Button**:
- Border: Neon violet or magenta outline
- Background: Transparent with hover fill
- Glow: Activate neon glow on hover

### Interactive States

1. **Hover**: Subtle neon glow + gradient shift (`.neon-glow-violet`, `.neon-glow-magenta`)
2. **Focus**: Bold neon ring (2px violet or magenta outline)
3. **Active/Pressed**: Increased brightness + scale(0.98)
4. **Disabled**: 40% opacity + grayscale filter

### Borders & Outlines

- **Standard Borders**: 1px solid with `border-card-border`
- **Neon Accents**: Use `.neon-border-violet` for premium elements
- **Gradient Borders**: Top accent lines with violet-magenta gradient
- **Rounded Corners**: Default `rounded-xl` (0.75rem) for modern luxury feel

---

## Layout & Spacing

### Grid System

**Editorial Asymmetry**:
- Break traditional grid with 60/40 or 70/30 splits for hero sections
- Use full-bleed images with text overlays (dark gradient wash)
- Offset headlines and body copy for magazine-style layouts

**Spacing Scale**:
- XS: 0.5rem (8px) - Tight spacing
- SM: 1rem (16px) - Compact groups
- MD: 1.5rem (24px) - Default spacing
- LG: 2rem (32px) - Section spacing
- XL: 3rem (48px) - Page section dividers
- 2XL: 4rem (64px) - Hero section padding

### Whitespace Philosophy

**Generous Breathing Room**:
- Use 1.5x–2x more padding than typical apps for luxury feel
- Let cards and content breathe with ample margins
- Avoid cramped layouts - space = sophistication

---

## Visual Effects & Motion

### Neon Glow Effects

Apply glows sparingly for premium interactive elements:

- `.neon-glow-violet`: Violet halo (20px + 40px radii)
- `.neon-glow-magenta`: Magenta halo for secondary elements
- `.neon-glow-teal`: Teal glow for success states

### Gradient Animations

**Shimmer Effect** (`.text-gradient-violet`, `.text-gradient-gold`):
- Animated background position shift
- 3s linear infinite loop
- Creates metallic sheen on text

### Transitions & Animations

**Animation Principles**:
- Duration: 200-400ms for interactions (smooth but swift)
- Easing: `ease-out` for entrances, `ease-in-out` for hovers
- Spring Physics: Use for magnetic buttons and card reveals
- Parallax: Subtle depth on scroll (hero sections)

**Recommended Animations**:
1. **Card Entrance**: Fade up + scale (0.95 → 1.0)
2. **Button Hover**: Neon glow fade-in + lift shadow
3. **Page Transitions**: Gradient wipe or diagonal slide
4. **Achievement Unlock**: Scale burst + confetti + glow pulse

### Accessibility Motion

Always respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Content Patterns

### Hero Sections

**Full-Bleed Editorial Heroes**:
- Background: Abstract light trail imagery with jewel tones
- Overlay: Dark gradient wash (black → transparent from bottom)
- Typography: Extra-large Cormorant headlines (H1 6xl-8xl)
- CTA: Liquid gold button with neon violet glow
- Layout: Asymmetric text placement (left 60%, image right 40%)

### Ritual Cards

- Background: Editorial card with gradient overlay
- Badge: Neon-bordered tier badge (FREE/PRO) in top-right
- Typography: Cormorant title + Sora description
- Hover: Lift effect + neon glow activation
- Progress: Circular ring with gradient fill (violet-magenta)

### Journal Interface

- Entry Cards: Dark charcoal with subtle top accent line
- Mood Indicators: Vivid color-coded pills (pink, blue, purple, amber, yellow)
- Tags: Neon-bordered chips with frequency-based sizing
- Calendar: 28-day grid with mood-based background colors
- AI Insights: Glass card with violet glow

### Analytics Visualizations

- Charts: Use chart color variables (5 jewel tones)
- Progress Bars: Gradient fills (violet-magenta)
- Stats Cards: Editorial cards with large numerals in Cormorant
- Tag Cloud: Variable font sizes (xs-xl) based on frequency

---

## Brand Voice & Tone

**Visual Communication**:
- **Confident**: Bold typography, vivid colors, generous sizing
- **Sophisticated**: Editorial layouts, refined spacing, luxury materials
- **Playful**: Gradient shimmers, neon glows, animated interactions
- **Premium**: Metallic accents, liquid gold CTAs, high-end imagery

**Avoid**:
- Overly bright backgrounds (stay dark for luxury)
- Too many neon glows (use sparingly for impact)
- Cramped layouts (breathing room = premium)
- Basic stock photography (use abstract futuristic visuals)

---

## Implementation Checklist

### Every Component Should Have:

✅ **Color**: Uses jewel-tone palette with dark backgrounds  
✅ **Typography**: Cormorant headlines + Sora body text  
✅ **Spacing**: Generous padding (p-6 or more)  
✅ **Borders**: Rounded corners (rounded-xl default)  
✅ **Hover States**: Neon glow or gradient shift  
✅ **Focus States**: Neon ring outline  
✅ **Motion**: Smooth transitions (200-400ms)  
✅ **Shadows**: Neon-tinted with color accents  
✅ **Accessibility**: WCAG AA contrast + reduced-motion support  

### Pro Features Get Extra Luxury:

✨ Liquid gold accents  
✨ Animated gradient backgrounds  
✨ Enhanced neon glows  
✨ Metallic text effects  
✨ Premium badge indicators  

---

## Examples & References

### Inspiration Sources:

- **Vogue Magazine**: Bold headlines, asymmetric layouts, generous whitespace
- **Forbes Digital**: Premium editorial style, sophisticated color palettes
- **Stripe**: Modern gradients, smooth animations, clean UI
- **Linear App**: Dark mode sophistication, neon accents, refined interactions
- **Apple (Product Pages)**: Large typography, full-bleed imagery, premium feel

### Color Mood Board:

Imagine a dark luxury boutique at night, illuminated by neon art installations - violet and magenta holograms, teal laser lights, liquid gold accents on black marble surfaces. That's the MetaHers aesthetic.

---

**Last Updated**: October 2025  
**Version**: 2.0 (Forbes Meets Vogue Redesign)

# MetaHers Mind Spa

## Overview
MetaHers Mind Spa is a Progressive Web App (PWA) designed to educate women in technology about AI and Web3 through guided learning "rituals" presented in a luxury spa aesthetic. The platform aims to provide an engaging and educational experience with a Forbes-meets-Vogue design. Key capabilities include an AI-Powered Personal Journal with mood tracking, Journal Analytics, a gamified Achievements System, an e-commerce Shop, and a "MetaHers Daily" blog. The app operates on a subscription model, with a Pro tier unlocking full content and premium features. The project's ambition is to offer a serene and empowering environment for women to master AI and Web3 concepts, uniquely positioned as a "human-powered AI app" where founder Nadia provides personal mentorship and direct access.

## User Preferences
Preferred communication style: Simple, everyday language.

### Image Aesthetic Guidelines
**CRITICAL: All images must feature women in the MetaHers aesthetic:**
- **Style**: Forbes-meets-Vogue editorial photography, world-class luxury quality
- **Subject**: Women (diverse representation) in futuristic, high-fashion settings
- **Aesthetic**: Feminine, bold, futuristic, high-end professional photography
- **Setting**: Digital world, tech-forward, luxury tech environments
- **Colors**: Jewel-toned neon palette (hyper violet, magenta quartz, cyber fuchsia, aurora teal, liquid gold)
- **Quality**: Vogue/Forbes magazine cover quality, sharp professional focus
- **Tone**: Confident, powerful, empowered feminine energy

**For blog articles specifically:**
- Feature diverse women in tech/digital environments
- High-fashion editorial quality (like Vogue covers)
- Incorporate tech elements (AI interfaces, blockchain visualizations, digital art, virtual spaces)
- Maintain luxury aesthetic with jewel-tone lighting
- Never use generic tech stock photos or images featuring men

## System Architecture

### Design Philosophy
The application adheres to a "Forbes-meets-Vogue" luxury editorial design, emphasizing a spa-inspired brand language. Typography uses Cormorant Garamond for headings and Sora for body text. The color system features a jewel-toned neon-on-onyx palette with deep obsidian backgrounds and vivid accents, incorporating neon glow, gradient animations, and metallic text. All images are optimized for performance and SEO. The application supports both light and dark modes with **dark mode as the default** (Web3 aesthetic preference), implemented with a `ThemeProvider` and `ThemeToggle` for smooth transitions and accessibility.

### Frontend
Developed as a React and TypeScript PWA, utilizing Wouter for routing, Vite for builds, and `localStorage` for state management. UI components are built with Radix UI primitives wrapped in custom components following the shadcn/ui pattern. Styling is managed with Tailwind CSS and custom CSS variables. Framer Motion is used for animations. The PWA includes a manifest and a service worker for caching.

### Backend
An Express.js server provides RESTful API routes for journal operations, analytics, achievements, subscriptions, thought leadership, and custom email/password authentication. Static content is defined as JSON. The backend includes an RSS service for aggregating tech news and an AI service using OpenAI GPT-4o.

#### 💰 OpenAI Prompt Caching Optimization
The application uses OpenAI's automatic prompt caching to reduce API costs by 30-50%:
- **How it works**: System prompts >1,024 tokens are automatically cached for 5-10 minutes, with 50% discount on cached tokens
- **Optimized functions**: `chatWithAppAtelierCoach`, `generateThoughtLeadershipContent` have expanded system prompts for maximum cache hits
- **Monitoring**: `/api/admin/cache-stats` endpoint tracks cache performance in real-time
- **Structure**: Static content (guidelines, examples, knowledge base) placed first in prompts for optimal caching
- **Estimated savings**: ~30-50% reduction in API costs for repeat operations

### Authentication
Custom email/password authentication uses bcrypt for password hashing and database-backed sessions with `connect-pg-simple`. Middleware functions `isAuthenticated` and `isProUser` protect routes based on user authentication and Pro subscription status.

### Data Storage
All user and application data, including `users`, `ritual_progress`, `journal_entries`, `achievements`, `subscriptions`, `thought_leadership_posts`, `thought_leadership_progress`, `spaces`, `transformational_experiences`, `experience_progress`, and `personalization_responses`, is persisted in a PostgreSQL database using Drizzle ORM. Zod is employed for client-side validation.

### 🔒 CRITICAL DATA PROTECTION SYSTEM
**The Harvard-style learning content in `transformational_experiences` is the CORE VALUE of MetaHers Mind Spa and is protected by a 5-layer safeguard system:**

**⚠️ ABSOLUTE RULE: NEVER remove or modify this content without explicit user approval and big warning.**

#### Protection Layers:

1. **Admin Confirmation Required**
   - `/api/admin/regenerate-content` requires date-based confirmation phrase: `APPROVE-REGENERATE-YYYY-MM-DD`
   - `/api/admin/populate-db` requires confirmation phrase: `APPROVE-POPULATE-YYYY-MM-DD`
   - Both endpoints detect existing Harvard-style content and warn before proceeding

2. **Pre-Operation Backup**
   - Automatic backup created before any content regeneration
   - Backups stored in `/backups` directory with timestamps
   - 30-day retention policy (auto-cleanup of older backups)

3. **Section Count Validation**
   - Rejects updates that reduce sections below minimum (5 for free tier, 7 for pro tier)
   - Skips invalid AI responses to prevent content degradation
   - Validation happens before database write

4. **Audit Logging**
   - All content modifications logged with timestamp, user, before/after counts
   - Console logs track who approved what operations and when
   - Provides accountability trail for all changes

5. **Backup & Restore Scripts**
   - `tsx server/backupTransformationalContent.ts` - Manual backup (630KB for 65 experiences)
   - `tsx server/restoreTransformationalContent.ts <filename>` - Restore from backup
   - All 65 experiences, 430 sections (avg 6.62 per experience) are backed up

#### Usage Examples:

**Regenerate Content (Protected):**
```bash
# Without confirmation - will show required phrase
POST /api/admin/regenerate-content
{ "batchSize": 10 }

# With confirmation - will backup then proceed
POST /api/admin/regenerate-content
{ 
  "confirmationPhrase": "APPROVE-REGENERATE-2025-11-14",
  "batchSize": 10
}
```

**Manual Backup:**
```bash
tsx server/backupTransformationalContent.ts
```

**Restore from Backup:**
```bash
# List available backups
tsx server/restoreTransformationalContent.ts

# Restore specific backup
tsx server/restoreTransformationalContent.ts transformational-experiences-2025-11-14T20-12-34-516Z.json
```

#### Content Specifications:
- **Free Tier**: 5 comprehensive sections (600-900 words each)
- **Pro Tier**: 7 comprehensive sections (600-900 words each)
- **Style**: Harvard Business School case study format, Forbes-meets-Vogue tone
- **Total**: 65 experiences across 9 learning spaces
- **Investment**: Significant OpenAI API costs (GPT-4o) to generate quality content

**⚠️ WARNING TO FUTURE DEVELOPERS:**
This content represents hours of AI generation work and is the primary value proposition of the platform. Treat it like production user data. Never delete, truncate, or downgrade without explicit approval from the founder.

### MetaHers World Architecture (Hub-and-Spoke Model)
The architecture pivots to a structured learning academy, **MetaHers World**, a central hub connecting 9 specialized learning spaces. Each space contains 6 AI-personalized transformational experiences. Key tables include `Spaces`, `Transformational Experiences`, `Experience Progress`, and `Personalization Responses`. A multi-tier gating strategy controls access to spaces based on subscription level. This architecture emphasizes outcome-driven skill mastery and measurable transformation.

**The 9 Learning Spaces:**
1. **Web3** - Decentralized technologies and blockchain fundamentals
2. **NFT/Blockchain/Crypto** - Digital assets, NFTs, and cryptocurrency
3. **AI** - AI tools, custom GPTs, and automation
4. **Metaverse** - Virtual worlds and digital ownership
5. **Branding** - Personal and professional brand building
6. **Moms** - Tech careers and entrepreneurship for mothers
7. **App Atelier** - Building apps with AI and no-code tools
8. **Founder's Club** - 12-week accelerator for turning ideas into reality
9. **Digital Boutique** - E-commerce workshop series for launching online stores in 3 days (Shopify, Instagram Shopping, TikTok Shop, email marketing, paid ads)

### Key Features
- **3-Day AI Retreat (Primary Lead Magnet)**: Free virtual retreat following Tony Robbins event model. Features "Cleanse, Nourish, Transform" Mind Spa framework with personal teaching from founder Nadia. WhatsApp-based registration and delivery. Includes countdown timer, spots-remaining urgency, VIP upgrade path ($297), and post-retreat conversion funnel to paid tiers.
- **Multi-Tier Pricing**: A 7-tier model (Free, Pro, AI Builder, VIP, Executive).
- **Specialized Landing Pages**: Dedicated high-conversion pages for VIP Retreat, Executive Suite, and AI Builder's Retreat.
- **30-Day Thought Leadership Journey** (Pro-Only): An AI-powered content generation feature for building authority, including gamification and streak tracking. Generates content in Substack, LinkedIn, and Twitter formats.
- **Testimonials System**: A reusable component for social proof.
- **Quiz Conversion Optimization**: Improved quiz funnel for signup and ritual unlocking.
- **Comprehensive SEO Infrastructure**: Includes 30 individual journey pages, 8 high-value blog articles, JSON-LD schema markup, optimized meta tags, and an updated sitemap.
- **MetaHers Daily**: A public news feed with bite-sized tech news, category filtering, and sharing.
- **Conversion Tracking**: Comprehensive GA4 tracking for key user actions.
- **Dynamic Cohort Capacity**: Real-time display of spots remaining for VIP and Executive tiers.

## External Dependencies
-   **OpenAI API**: For AI-powered journal insights, conversational AI coaching, AI-generated writing prompts, and thought leadership content generation (GPT-4o with automatic prompt caching for 30-50% cost savings).
-   **Stripe**: Payment processing for Pro tier subscriptions (integration pending).
-   **Resend** (Optional): Transactional email service for password reset emails.
-   **bcrypt**: For secure password hashing.
-   **Calendly**: Embedded via iframe for scheduling.
-   **MetaMuse GPT**: External link to a custom ChatGPT instance.
-   **React**: UI library.
-   **TypeScript**: Language.
-   **Vite**: Build tool.
-   **Express**: Server framework.
-   **Wouter**: Client-side routing.
-   **Tailwind CSS**: Styling framework.
-   **Radix UI**: UI primitives.
-   **Framer Motion**: Animations library.
-   **Drizzle ORM**: PostgreSQL Object-Relational Mapper.
-   **Zod**: Schema validation library.
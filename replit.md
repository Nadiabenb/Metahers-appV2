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

### Authentication
Custom email/password authentication uses bcrypt for password hashing and database-backed sessions with `connect-pg-simple`. Middleware functions `isAuthenticated` and `isProUser` protect routes based on user authentication and Pro subscription status.

### Data Storage
All user and application data, including `users`, `ritual_progress`, `journal_entries`, `achievements`, `subscriptions`, `thought_leadership_posts`, `thought_leadership_progress`, `spaces`, `transformational_experiences`, `experience_progress`, and `personalization_responses`, is persisted in a PostgreSQL database using Drizzle ORM. Zod is employed for client-side validation.

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
-   **OpenAI API**: For AI-powered journal insights, conversational AI coaching, AI-generated writing prompts, and thought leadership content generation (GPT-4o).
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
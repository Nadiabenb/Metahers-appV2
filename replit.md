# MetaHers Mind Spa

## Overview

MetaHers Mind Spa is a Progressive Web App (PWA) that merges luxury spa aesthetics with technology education, focusing on AI and Web3. It offers guided learning "rituals" covering AI prompting, blockchain, cryptocurrency, NFTs, and the metaverse in a serene, spa-like setting. The app operates on a subscription model, with a Pro tier ($19.99/month) unlocking all rituals and premium features. Key capabilities include an AI-Powered Personal Journal with mood tracking and AI-generated insights, comprehensive Journal Analytics, a gamified Achievements System, a Shop featuring Drop 001 limited edition handmade ritual bags (18 total: 6 Sheikha, 6 Serenity, 6 Floral), and a blog ("MetaHers Daily") featuring articles on Web3 and AI topics. The project aims to provide an engaging and educational experience for women in technology, presented with a Forbes-meets-Vogue luxury aesthetic.

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

### Frontend

The frontend is built with React and TypeScript, utilizing Wouter for client-side routing and Vite for builds. State management primarily uses `localStorage` for persistence. Radix UI primitives, wrapped in custom components following the shadcn/ui pattern, form the UI component library. Styling is handled with Tailwind CSS, custom CSS variables for a jewel-tone neon palette, and Framer Motion for animations. The application is implemented as a PWA with a manifest file and a service worker for basic caching.

### Backend

The backend is an Express.js server, serving the React application. It provides RESTful API routes for journal operations (CRUD, AI insights, AI coach chat), analytics, achievements, subscriptions, and custom email/password authentication. PostgreSQL is used for data persistence, storing user profiles, ritual progress, journal entries, achievements, and subscription data. Static content like ritual and shop product data is defined as JSON in `shared/schema.ts`.

### Authentication

The app uses custom email/password authentication (replaced Replit Auth for better ad campaign conversion):
- **Password Security**: Bcrypt hashing with 12 salt rounds
- **Session Management**: Database-backed sessions using connect-pg-simple
- **Validation**: Minimum 8 characters for passwords, email uniqueness checks
- **Endpoints**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/user`
- **Session Middleware**: `isAuthenticated` middleware protects all user-specific routes

### Data Storage

All user data is stored in a PostgreSQL database using Drizzle ORM for schema definition. This includes `users`, `ritual_progress`, `journal_entries`, `achievements`, and `subscriptions` tables. Zod is used for client-side validation of API requests and responses.

### Design System

The app features a "Forbes-meets-Vogue" luxury editorial design. Typography combines Cormorant Garamond for headings and Sora for body text. The color system uses a jewel-toned neon-on-onyx palette with deep obsidian backgrounds and vivid accents like Hyper Violet, Magenta Quartz, Cyber Fuchsia, Aurora Teal, and Liquid Gold. Visual effects include neon glow, gradient animations, and metallic text.

## External Dependencies

-   **OpenAI API**: For AI-powered journal insights, conversational AI coach, and AI-generated writing prompts.
-   **Stripe**: Payment processing for Pro tier subscriptions.
-   **bcrypt**: For secure password hashing in custom authentication system.
-   **Calendly**: Embedded via iframe for scheduling discovery calls.
-   **MetaMuse GPT**: External link to a custom ChatGPT instance for AI assistance.
-   **React**: UI library.
-   **TypeScript**: Language.
-   **Vite**: Build tool.
-   **Express**: Server framework.
-   **Wouter**: Client-side routing.
-   **Tailwind CSS**: Styling.
-   **Radix UI**: UI primitives.
-   **Framer Motion**: Animations.
-   **Drizzle ORM**: PostgreSQL ORM.
-   **Zod**: Schema validation.

## Recent Changes

### October 27, 2025 - UX/UI Scaling Improvements & Conversion Optimization
- **Mobile Navigation Enhancement**: Implemented Sheet-based hamburger menu making all public pages (Quiz, Rituals, Blog, Shop) accessible to unauthenticated users on mobile
  - Desktop navigation unchanged, mobile gets collapsible menu with all public pages
  - Auth buttons (Login/Signup) preserved in mobile menu for clear conversion paths
- **Quiz Conversion Funnel Fixes**: Eliminated leaks in the discovery-to-signup journey
  - Email now required before quiz starts (basic @ validation)
  - Quiz results store matched ritual in localStorage
  - Auto-redirects to signup page with pre-filled email and matched ritual
  - Backend accepts quizUnlockedRitual field during signup, auto-unlocks ritual
  - Signup page redirects to /rituals if user came from quiz
  - Added social proof to quiz results ("Join 500+ women learning AI & Web3")
- **Trust Signals**: Added conversion-boosting social proof throughout the app
  - Homepage testimonials section ("Trusted by 500+ Women") with 3 testimonials
  - Security messaging on signup page ("Your information is safe and secure")
  - Social proof badges integrated into quiz flow
- **Post-Signup Onboarding**: Improved new user experience
  - Signup page pre-fills email/name from quiz localStorage
  - Shows quiz match banner if coming from quiz ("Matched to: [Ritual Name]")
  - Backend stores quizUnlockedRitual in user profile for immediate access
- **Status**: 4 of 5 critical UX scaling blockers resolved. Image optimization (lazy loading, responsive srcset, compression) deferred - requires converting CSS background-images to proper <img> tags.

### October 26, 2025 - Expandable Ritual Steps & SEO Implementation
- **Ritual Steps Enhancement**: Transformed ritual steps from simple strings to rich educational content
  - Each of 25 steps (5 rituals × 5 steps) now includes: id, title, summary, detailed content, resources, proOnly flag
  - Implemented Collapsible accordion UI for expandable step content
  - Separate click handlers: checkbox toggles completion, header/chevron expands content
  - Updated paywall logic to use step.proOnly field instead of positional index
  - Added resource links display when steps are expanded
- **SEO Foundation**: Implemented comprehensive SEO strategy for Google rankings
  - Created robots.txt (/client/public/robots.txt) to guide search engines
  - Generated sitemap.xml with all public pages and proper priorities
  - Added SEO meta tags to all major pages: RitualsPage, RitualDetailPage, DiscoverPage
  - Dynamic SEO content on ritual pages based on ritual data
  - All pages now have unique titles, descriptions, Open Graph tags, and Twitter Cards
  - Fixed DiscoverPage bug: step.title rendering in quiz results
- **Documentation**: Created SEO_STRATEGY.md with complete implementation roadmap
  - Immediate actions: Google Search Console setup, Analytics integration
  - Content calendar for blog posts targeting high-intent keywords
  - Link building and backlink strategies
  - Performance optimization checklist
  - 6-12 month growth timeline with realistic traffic expectations

### October 24, 2025 - Blog Marketing & Shop Updates
- **New Blog Articles**: Added two articles to drive traffic to Drop 001:
  - "AI Agents: Your Digital Dream Team Is Here" - Covers autonomous AI agents for women in business
  - "Drop 001: When Luxury Self-Care Meets AI Mystery" - Features ritual bags with handmade products and AI unlocks
- **Blog Images**: Generated high-fashion Forbes-meets-Vogue editorial images for both articles
- **Shop Page Updates**:
  - Removed 3-bag bundle per user request
  - Fixed product image carousel display issues
  - Changed hover carousel speed from 1s to 2.5s for better UX
  - Updated purchase links to point to shop.metahers.ai (Shopify store)
  - Implemented proper image hosting in client/public/images folder
- **Product Carousel**: Uses useRef/useEffect for proper lifecycle cleanup preventing memory leaks


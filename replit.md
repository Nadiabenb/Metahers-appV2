# MetaHers Mind Spa

## Overview
MetaHers Mind Spa is a Progressive Web App (PWA) designed to educate women in technology about AI and Web3 through guided learning "rituals" presented in a luxury spa aesthetic. The platform aims to provide an engaging and educational experience with a Forbes-meets-Vogue design. Key features include an AI-Powered Personal Journal with mood tracking, Journal Analytics, a gamified Achievements System, an e-commerce Shop (Drop 001 ritual bags), and a "MetaHers Daily" blog. The app operates on a subscription model, with a Pro tier unlocking full content and premium features.

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
The frontend is a React and TypeScript PWA, using Wouter for routing, Vite for builds, and `localStorage` for state management. UI components are built with Radix UI primitives wrapped in custom components following the shadcn/ui pattern. Styling uses Tailwind CSS, custom CSS variables (jewel-tone neon palette), and Framer Motion for animations. The PWA includes a manifest file and a service worker for caching.

### Backend
The backend is an Express.js server providing RESTful API routes for journal operations (CRUD, AI insights, AI coach chat), analytics, achievements, subscriptions, and custom email/password authentication. Data is persisted in PostgreSQL. Static content like ritual and shop product data is defined as JSON.

### Authentication
Custom email/password authentication is implemented with bcrypt hashing (12 salt rounds) for passwords and database-backed sessions using `connect-pg-simple`. Password validation requires a minimum of 8 characters and email uniqueness. Authentication endpoints include `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/user`, with an `isAuthenticated` middleware protecting user-specific routes.

### Data Storage
All user data, including `users`, `ritual_progress`, `journal_entries`, `achievements`, and `subscriptions`, is stored in a PostgreSQL database using Drizzle ORM. Zod is used for client-side validation of API requests and responses.

### Design System
The application features a "Forbes-meets-Vogue" luxury editorial design. Typography combines Cormorant Garamond for headings and Sora for body text. The color system uses a jewel-toned neon-on-onyx palette with deep obsidian backgrounds and vivid accents (Hyper Violet, Magenta Quartz, Cyber Fuchsia, Aurora Teal, Liquid Gold). Visual effects include neon glow, gradient animations, and metallic text.

### Feature Specifications
- **Multi-Tier Pricing**: Expanded to a 5-tier subscription model (Free, Pro Monthly, Pro Annual, VIP Cohort, Executive Intensive).
- **VIP Cohort Landing Page**: High-conversion page at `/vip-cohort` with scarcity messaging and curriculum details.
- **Testimonials System**: Reusable component for social proof.
- **Quiz Conversion Optimization**: Improved quiz funnel to guide users to signup and unlock rituals.
- **SEO Foundation**: Implemented `robots.txt`, `sitemap.xml`, and dynamic meta tags for all major pages.
- **Optimized Images**: All images are optimized for performance and SEO using an `OptimizedImage` component with lazy loading.

## External Dependencies
-   **OpenAI API**: For AI-powered journal insights, conversational AI coach, and AI-generated writing prompts.
-   **Stripe**: Payment processing for Pro tier subscriptions (integration pending).
-   **bcrypt**: For secure password hashing.
-   **Calendly**: Embedded via iframe for scheduling.
-   **MetaMuse GPT**: External link to a custom ChatGPT instance.
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

### October 29, 2025 - Conversion Optimization for Paid Ads Campaign (PRODUCTION-READY)
- **Google Analytics 4 Infrastructure**: Complete GA4 tracking setup in index.html with global `trackEvent` function ready for measurement ID
- **Comprehensive Event Tracking System**: Created `analytics.ts` utility with full conversion funnel coverage:
  - **Page views**: Automatic tracking on all route changes via wouter
  - **Signup conversions**: Multi-tier attribution (VIP Cohort > Executive > Quiz > Direct) with localStorage flag management
  - **Quiz events**: Start, completion, AND restart tracking
  - **CTA clicks**: All major conversion touchpoints across landing, VIP, Executive, and discover pages
  - **Navigation tracking**: Desktop and mobile nav CTAs (Discover, VIP Cohort, Shop, Blog, Login, Signup)
  - **Future-ready**: Checkout initiations and ritual start tracking prepared for Stripe integration
- **Multi-Tier Signup Attribution System**:
  - Priority order: `vip_cohort_interest` → `executive_interest` → `quizRitual` → `direct`
  - All localStorage flags properly cleared after signup to prevent misattribution
  - Tracks both source (where they came from) and tier (what they're interested in) for accurate paid ad ROI
- **Dynamic Cohort Capacity System**:
  - Database table `cohort_capacity` tracking VIP Cohort and Executive tier availability
  - Public API endpoint `/api/cohort-capacity/:cohortName` returns real-time spots remaining
  - VIP Cohort and Executive pages fetch and display live capacity (e.g., "3 spots remaining")
  - Scarcity messaging updates automatically based on database state for conversion optimization
- **Executive Landing Page**: Created `/executive` route with premium 1:1 mentorship positioning at $499
- **Complete Conversion Funnel Tracking**:
  - Landing hero CTA → Signup (with source attribution) → Quiz start → Quiz complete → Ritual unlock
  - VIP Cohort: hero CTA + final CTA with tier tracking
  - Executive: hero CTA + final CTA with tier tracking
  - Navigation: all key conversion paths (desktop + mobile)
  - Quiz: start + completion + restart events
- **Architecture Review**: Architect-approved as production-ready for paid campaign launch
- **Status**: Fully functional, comprehensive tracking coverage, ready for GA4 measurement ID injection
- **Next Steps**: (1) User to add production GA4 measurement ID, (2) Run end-to-end staging verification, (3) Launch paid ads campaign with full conversion tracking

### October 28, 2025 - Live RSS News Integration
- **Major Update**: Replaced static sample news with live RSS feeds pulling from real sources
  - **Backend RSS Service**: Aggregates news from TechCrunch, CoinDesk, CoinTelegraph, NFT Plazas
  - **30-minute caching**: Prevents excessive RSS feed requests while keeping news current
  - **Category-specific feeds**: Separate RSS sources for AI, Crypto, NFT, Blockchain, Metaverse, Social
  - **API endpoint**: Public /api/news endpoint with optional category filtering
  - **Frontend updates**: Live data fetching with loading/error states, source attribution, "Read Full Article" links
  - **Share functionality**: Updated to share original article links with summaries
- **Why**: User reported sample news was outdated (showed "BTC ATH" when price was $115k) - now shows current, real-time tech news
- **Architecture**: RSS Parser library with in-memory caching, public API endpoint, React Query for frontend data fetching

### October 27, 2025 - MetaHers Daily News Feed Launch
- **New Feature**: Created "MetaHers Daily" - a public news feed at /daily for women in tech
  - Bite-sized tech news covering AI, Crypto, Blockchain, NFTs, Metaverse, and Social Media
  - Category filtering by topic (All, AI, Crypto, NFT, Blockchain, Metaverse, Social)
  - Share functionality: native Web Share API + WhatsApp share with canonical URLs
  - SEO-optimized for traffic generation with comprehensive meta tags
  - Highlighted in main navigation with Zap icon for visibility
- **Use Case**: User wanted daily news for their WhatsApp Business group - this provides shareable content

### October 27, 2025 - Blog Image Updates
- **Unique Topic-Specific Images**: Generated 3 new editorial images for recent blog posts
  - "10 ChatGPT Prompts Every Woman Boss Needs" - Woman entrepreneur with AI interface in luxury office
  - "Web3 Luxury: The New Status Symbol" - Elegant woman examining NFT gallery and digital collectibles
  - "From 9-to-5 to Web3" - Woman working remotely in tropical location with Web3 interfaces
- **Image Quality**: All images feature MetaHers aesthetic (Forbes-meets-Vogue, jewel-toned neon, feminine, futuristic)
- **No Reuse**: Each blog now has its own unique, contextually relevant hero image

### October 27, 2025 - PWA App Icon Update
- **Branded App Icon**: Replaced generic black "M" icon with luxury branded MetaHers icon
  - Features stylized M logo with jewel-toned neon gradient (hyper violet, magenta, fuchsia, teal, gold)
  - Deep obsidian background with metallic chrome finish and glowing neon effects
  - Matches Forbes-meets-Vogue luxury aesthetic
  - Professional brand identity for home screen installation
  - Updated both 192x192 and 512x512 icon sizes in PWA manifest

### October 27, 2025 - Production Deployment Fix
- **Health Check Endpoints**: Added multiple health check endpoints to resolve deployment failures
  - `/health` - JSON response with status and timestamp
  - `/api/health` - API-specific health check endpoint
  - Root `/` endpoint responds with 200 OK in production (Vite handles it in development)
  - All health check endpoints respond quickly without authentication requirements
- **Deployment Status**: App now passes Replit Autoscale Deployment health checks and is ready for publishing

### October 27, 2025 - VIP Cohort Hero Image Update
- **Brand Alignment**: Replaced VIP Cohort hero section background image
  - New image features diverse women in luxury tech environment with jewel-toned neon lighting
  - Matches MetaHers aesthetic: bold, vivid, futuristic, feminine
  - Forbes-meets-Vogue editorial quality

### October 27, 2025 - Glow-Up Program Bug Fix
- **Critical Bug Fixed**: Resolved day 2 (and all days) journal entry saving issue
  - Root cause: Race condition where form state was set before journal data finished loading
  - Solution: Added useEffect hook to automatically sync form state with loaded journal data
  - Form state now properly updates when switching between days or after saving
  - Added comprehensive logging (frontend + backend) to diagnose future issues
  - Added error handling with user-facing error messages for failed saves
- **State Management**: Improved synchronization between React Query cache and component state
- **User Experience**: Saved journal entries now consistently display when reopening days
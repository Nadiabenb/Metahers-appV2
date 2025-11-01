# MetaHers Mind Spa

## Overview
MetaHers Mind Spa is a Progressive Web App (PWA) designed to educate women in technology about AI and Web3 through guided learning "rituals" presented in a luxury spa aesthetic. The platform aims to provide an engaging and educational experience with a Forbes-meets-Vogue design. Key capabilities include an AI-Powered Personal Journal with mood tracking, Journal Analytics, a gamified Achievements System, an e-commerce Shop (Drop 001 ritual bags), and a "MetaHers Daily" blog. The app operates on a subscription model, with a Pro tier unlocking full content and premium features. The project's ambition is to offer a serene and empowering environment for women to master AI and Web3 concepts.

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
The application adheres to a "Forbes-meets-Vogue" luxury editorial design, emphasizing a spa-inspired brand language (e.g., "retreat," "journey," "sanctuary"). Typography uses Cormorant Garamond for headings and Sora for body text. The color system features a jewel-toned neon-on-onyx palette with deep obsidian backgrounds and vivid accents (Hyper Violet, Magenta Quartz, Cyber Fuchsia, Aurora Teal, Liquid Gold), incorporating neon glow, gradient animations, and metallic text. All images are optimized for performance and SEO via an `OptimizedImage` component with lazy loading.

### Frontend
Developed as a React and TypeScript PWA, utilizing Wouter for routing, Vite for builds, and `localStorage` for state management. UI components are built with Radix UI primitives wrapped in custom components following the shadcn/ui pattern. Styling is managed with Tailwind CSS and custom CSS variables. Framer Motion is used for animations. The PWA includes a manifest and a service worker for caching.

### Backend
An Express.js server provides RESTful API routes for journal operations (CRUD, AI insights, AI coach chat), analytics, achievements, subscriptions, thought leadership journey (Pro-only), and custom email/password authentication. Static content, such as ritual and shop product data, is defined as JSON. The backend includes an RSS service for aggregating tech news and an AI service using OpenAI GPT-4o for journal insights, coaching, and thought leadership content generation.

### Authentication
Custom email/password authentication uses bcrypt for password hashing (12 salt rounds) and database-backed sessions with `connect-pg-simple`. Password validation requires a minimum of 8 characters and email uniqueness. Two middleware functions protect routes: `isAuthenticated` for user-specific routes, and `isProUser` for Pro-only features (checks both authentication and Pro subscription status).

### Data Storage
All user and application data, including `users`, `ritual_progress`, `journal_entries`, `achievements`, `subscriptions`, `thought_leadership_posts`, and `thought_leadership_progress`, is persisted in a PostgreSQL database using Drizzle ORM. Zod is employed for client-side validation of API requests and responses. The thought leadership tables track 30-day journey progress with streak calculation, day completion tracking, and AI-generated multi-platform content.

### Key Features
- **Multi-Tier Pricing**: A 7-tier model (Free, Pro Monthly/Annual, AI Builder Group/Private, VIP Retreat, Executive Suite).
- **Specialized Landing Pages**: Dedicated high-conversion pages for VIP Retreat (`/vip-cohort`), Executive Suite (`/executive`), and AI Builder's Retreat (`/ai-builder`), the latter teaching "vibe coding" with AI tools.
- **30-Day Thought Leadership Journey** (Pro-Only): AI-powered content generation feature helping users build authority through consistent daily posting. Generates 30 days of content in 3 formats (Substack long-form 800-1200 words, LinkedIn medium 300-400 words, Twitter short 280 chars). Includes gamification via streak tracking, 30-day calendar visualization, and progress stats. Routes protected with `isProUser` middleware on backend and Pro-check upsell on frontend. Journey progression automatically advances currentDay, updates completedDays array, and calculates streaks (resets if >1 day gap). Posts can be published to MetaHers Insights feed (future public feature) or marked as published externally.
- **Testimonials System**: A reusable component for social proof.
- **Quiz Conversion Optimization**: Improved quiz funnel to guide users to signup and unlock rituals.
- **Comprehensive SEO Infrastructure**: 
  - **30 Individual Journey Pages**: Created dedicated SEO-optimized pages for each day of the 30-day thought leadership journey (`/journey/day-1` through `/journey/day-30`) with unique meta tags, descriptions, and Course schema markup targeting specific keywords like "thought leadership day 1", "personal branding foundation", etc.
  - **8 High-Value Blog Articles**: Added three 2,500+ word SEO-optimized blog posts targeting "women in AI training", "personal branding for women in tech", and "women in Web3 careers", plus five existing articles on AI learning, coaching, and productivity.
  - **Structured Data (Schema.org)**: Implemented JSON-LD schema markup across the site - Article schema for blog posts, Course schema for journey pages, and Organization schema for the homepage. The enhanced SEO component manages schema injection/removal during SPA navigation to prevent stale data.
  - **Optimized Meta Tags**: Enhanced all major pages (Landing, Thought Leadership, Blog, Journey) with targeted keywords, unique titles, and descriptions optimized for organic search visibility.
  - **Comprehensive Sitemap**: Updated `sitemap.xml` to include 30 journey pages + 8 blog articles (50+ indexed pages total) for Google discovery and crawling.
  - **Rich Snippets Ready**: All structured data configured for Google rich snippets including course ratings, article authors, and organization details.
- **MetaHers Daily**: A public news feed at `/daily` featuring bite-sized tech news with category filtering and sharing capabilities, pulling live RSS feeds.
- **Conversion Tracking**: Comprehensive GA4 tracking for page views, signups (multi-tier attribution), quiz events, and CTA clicks.
- **Dynamic Cohort Capacity**: Real-time display of spots remaining for VIP and Executive tiers, based on database records.

## External Dependencies
-   **OpenAI API**: For AI-powered journal insights, conversational AI coaching, AI-generated writing prompts, and thought leadership content generation (GPT-4o with Forbes-meets-Vogue tone, generating 800-1200 word articles, 300-400 word LinkedIn posts, and 280-char Twitter posts).
-   **Stripe**: Payment processing for Pro tier subscriptions (integration pending).
-   **Resend** (Optional): Transactional email service for sending password reset emails from help@metahers.ai. Emails use luxury spa-themed HTML templates with MetaHers branding (jewel-tone gradients, serif typography). Free tier provides 3,000 emails/month. The app gracefully degrades if RESEND_API_KEY is not configured - password reset tokens are still created and logged to console for development/testing.
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
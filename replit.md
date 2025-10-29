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
An Express.js server provides RESTful API routes for journal operations (CRUD, AI insights, AI coach chat), analytics, achievements, subscriptions, and custom email/password authentication. Static content, such as ritual and shop product data, is defined as JSON. The backend also includes an RSS service for aggregating and caching tech news.

### Authentication
Custom email/password authentication uses bcrypt for password hashing (12 salt rounds) and database-backed sessions with `connect-pg-simple`. Password validation requires a minimum of 8 characters and email uniqueness. An `isAuthenticated` middleware protects user-specific routes.

### Data Storage
All user and application data, including `users`, `ritual_progress`, `journal_entries`, `achievements`, and `subscriptions`, is persisted in a PostgreSQL database using Drizzle ORM. Zod is employed for client-side validation of API requests and responses.

### Key Features
- **Multi-Tier Pricing**: A 7-tier model (Free, Pro Monthly/Annual, AI Builder Group/Private, VIP Retreat, Executive Suite).
- **Specialized Landing Pages**: Dedicated high-conversion pages for VIP Retreat (`/vip-cohort`), Executive Suite (`/executive`), and AI Builder's Retreat (`/ai-builder`), the latter teaching "vibe coding" with AI tools.
- **Testimonials System**: A reusable component for social proof.
- **Quiz Conversion Optimization**: Improved quiz funnel to guide users to signup and unlock rituals.
- **SEO Foundation**: Implemented `robots.txt`, `sitemap.xml`, and dynamic meta tags for major pages.
- **MetaHers Daily**: A public news feed at `/daily` featuring bite-sized tech news with category filtering and sharing capabilities, pulling live RSS feeds.
- **Conversion Tracking**: Comprehensive GA4 tracking for page views, signups (multi-tier attribution), quiz events, and CTA clicks.
- **Dynamic Cohort Capacity**: Real-time display of spots remaining for VIP and Executive tiers, based on database records.

## External Dependencies
-   **OpenAI API**: For AI-powered journal insights, conversational AI coaching, and AI-generated writing prompts.
-   **Stripe**: Payment processing for Pro tier subscriptions (integration pending).
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
# MetaHers Mind Spa - Compressed System Architecture

## Overview
MetaHers Mind Spa is a production-ready Progressive Web App (PWA) designed to provide a luxury learning experience in AI and Web3 for women solopreneurs. It aims to deliver Forbes-quality content with Vogue aesthetics, offering personalized educational journeys across 9 specialized spaces and 65 transformational experiences. The platform differentiates itself through AI-powered personalization, hands-on projects, and measurable outcomes, operating on a freemium model with tiered subscriptions to support women professionals building careers in AI/Web3.

## User Preferences
I prefer detailed explanations and expect the agent to ask before making major changes to the codebase.

## Current Status - FULLY OPERATIONAL ✅

### Core Features - Complete & Live
- **9 Learning Spaces** with luxury glassmorphic design, 65 transformational experiences
- **Circle Platform** - Women's networking and marketplace fully operational with:
  - Discovery page (browse women professionals)
  - Services marketplace (book consultations, services)
  - User profiles with verification, skills, availability
  - Direct messaging system
  - Opportunity board for collaborations
- **Authentication** - Secure login/register, password reset via Resend email service
- **Subscriptions** - 4 tiers (Free, Pro, Sanctuary, Inner Circle) integrated with Stripe
- **Newsletter/Waitlist** - Email capture with payment integration
- **Pagination** - 6 items/page across all Circle pages
- **Favorites System** - localStorage-based bookmarks with animated UI
- **Mobile Optimization** - Fully responsive design

### Integrations - All Connected ✅
- **Resend**: Email service for password reset, confirmations
- **Stripe**: Payment processing, subscription management (v2025-10-29.clover)
- **PostgreSQL/Neon**: Serverless database with all Circle tables created
- **OpenAI GPT-4o**: AI integration for personalization, content generation

### Database - Migration Complete ✅
All tables created including:
- women_profiles, profile_services, profile_skills, profile_activity_feed
- direct_messages, opportunities, skills_trades
- subscriptions, users, spaces, experiences, and 30+ more tables

### Build Status
- **TypeScript**: Full type safety across frontend & backend
- **Frontend**: React 18 + Vite + TanStack Query + Wouter + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM + Passport auth
- **No Build Errors**: All pages render correctly

## System Architecture

### UI/UX Decisions
The platform features a "Forbes-meets-Vogue" aesthetic with a feminine, bold, futuristic, and high-end professional photography style. Brand colors include Hyper Violet, Magenta Quartz, Cyber Fuchsia, Aurora Teal, and Liquid Gold. Typography uses Playfair Display for headings and Inter for body text. Components incorporate glassmorphism cards, rounded corners, soft shadows, subtle animations via Framer Motion, and atmospheric background effects. Accessibility is prioritized, adhering to WCAG 2.1 AA compliance with keyboard navigation, screen reader optimization, and high contrast mode compatibility.

### Technical Implementations
The frontend is built with React 18, TypeScript, Vite, Tailwind CSS 4, Shadcn UI, TanStack Query, Wouter, Framer Motion, and Recharts, with PWA capabilities via Service Worker and Web App Manifest. The backend utilizes Node.js 20, Express.js, TypeScript, PostgreSQL 16 (Neon serverless) with Drizzle ORM, Passport.js for authentication, and OpenAI GPT-4o for AI integration. Security is managed with Helmet.js, CORS, rate limiting, and CSRF protection.

### Feature Specifications
MetaHers World functions as a hub-and-spoke model with 9 learning spaces (Web3, NFT/Blockchain/Crypto, AI, Metaverse, Branding, Moms, App Atelier, Founder's Club, Digital Boutique), each containing 5-7 learning sections. Content quality is high-standard, featuring text, interactive exercises, quizzes, hands-on labs, and curated videos. A tiered access model supports Free, Pro, Sanctuary, Inner Circle, and Founders Circle subscriptions, each unlocking progressively more features like AI-powered journal analysis, group coaching, and 1:1 sessions. Key features include a journaling system, a Thought Leadership Journey (30-day program), an AI Glow-Up Program, and a Career Companion.

### System Design Choices
The architecture emphasizes AI integration for personalization, content generation, and coaching, with prompt management, version control, and caching to reduce costs. A robust API architecture supports authentication, learning paths, journal entries, AI interactions, thought leadership, subscriptions, and administrative functions. SEO is a core focus, with dynamic meta tags, sitemaps, structured data, image optimization, and performance enhancements (Lighthouse scores 90+). Security is paramount, employing session-based authentication, bcrypt hashing, CSRF protection, input validation via Zod, SQL injection prevention, XSS prevention, and rate limiting. Performance is optimized through a multi-layered caching strategy (Redis, in-memory, OpenAI prompt cache, service worker), image optimization (AVIF/WebP, srcset, lazy loading), and bundle optimization (code splitting, tree shaking, minification). The application is deployed on Replit Autoscale Deployments with Neon PostgreSQL for a serverless, scalable infrastructure.

## External Dependencies

- **Database**: Neon PostgreSQL (serverless)
- **Email**: Resend (transactional emails)
- **Payments**: Stripe (subscriptions, checkout)
- **AI**: OpenAI GPT-4o
- **CDN**: Cloudflare (via Replit)
- **Monitoring**: Pino (structured JSON logging), Replit analytics

## Ready for Production 🚀
All core features are complete, tested, and ready to deploy. The app provides a luxury learning and networking experience for women professionals in tech.

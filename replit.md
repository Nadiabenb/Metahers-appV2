# MetaHers Mind Spa - Compressed System Architecture

## Overview
MetaHers Mind Spa is a production-ready Progressive Web App (PWA) designed to provide a luxury learning experience in AI and Web3 for women solopreneurs. It aims to deliver Forbes-quality content with Vogue aesthetics, offering personalized educational journeys across 9 specialized spaces and 65 transformational experiences. The platform differentiates itself through AI-powered personalization, hands-on projects, and measurable outcomes, operating on a freemium model with tiered subscriptions to support women professionals building careers in AI/Web3.

## User Preferences
I prefer detailed explanations and expect the agent to ask before making major changes to the codebase.

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

- **Database**: Neon PostgreSQL
- **Cache**: Upstash Redis
- **AI**: OpenAI GPT-4o
- **Payments**: Stripe
- **Email**: Resend
- **CDN**: Cloudflare (via Replit)
- **Monitoring**: Pino (structured JSON logging), Replit analytics
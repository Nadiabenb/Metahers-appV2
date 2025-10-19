# MetaHers Mind Spa

## Overview

MetaHers Mind Spa is a Progressive Web App (PWA) that combines luxury spa aesthetics with technology education, specifically focusing on AI and Web3 topics. The application provides guided learning experiences called "rituals" that teach users about AI prompting, blockchain, cryptocurrency, NFTs, and the metaverse in a calm, spa-like environment.

The app features a subscription model with Pro tier ($19.99/month) that unlocks all 5 rituals and premium features. Free users can access the first ritual. The app includes:
- **AI-Powered Personal Journal**: Write entries with mood tracking, AI-generated insights, and a conversational AI coach
- **Journal Analytics**: Comprehensive analytics dashboard with writing calendar (28-day mood visualization), tag cloud, mood distribution charts, and key metrics
- **Achievements System**: Gamified milestones with 9 different achievement types, animated badge unlocking, and progress tracking
- **Stripe Payment Integration**: Subscription processing for Pro tier access
- **External Integrations**: MetaMuse GPT (AI assistance) and Calendly (scheduling)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Wouter for client-side routing instead of Next.js (despite original planning documents mentioning Next.js).

**Build System**: Vite is used for development and production builds, with custom middleware integration for server-side rendering in development mode.

**State Management**: The application uses localStorage for persistence rather than a centralized state management solution. User progress, journal entries, and settings are stored client-side.

**UI Component Library**: The app uses Radix UI primitives wrapped in custom components following the shadcn/ui pattern. Components are located in `client/src/components/ui/` and implement the design system defined in Tailwind configuration.

**Styling Approach**: 
- Tailwind CSS for utility-first styling
- Custom CSS variables for jewel-tone neon palette
- Editorial card patterns with gradient overlays
- Neon glow effects and metallic text gradients
- Design system emphasizes Forbes-meets-Vogue luxury with bold typography, vivid accents, and sophisticated animations

**Animation**: Framer Motion is used for transitions and micro-interactions, with durations typically between 150-250ms for a calm, smooth experience.

**PWA Implementation**:
- Manifest file (`public/manifest.json`) defines app metadata and icons
- Service worker (`public/sw.js`) implements basic caching strategies
- Install prompt component detects `beforeinstallprompt` event and manages user dismissal state
- Service worker registration happens in the main App component on mount

### Backend Architecture

**Server Framework**: Express.js serves the application in production and development.

**Development Mode**: Vite middleware is integrated into Express during development for hot module replacement and fast refresh.

**Production Mode**: Static files are served from the `dist/public` directory after Vite builds the client application.

**API Structure**: RESTful API routes (prefixed with `/api`) implemented in `server/routes.ts`:
- Journal endpoints: CRUD operations, AI insights, AI coach chat
- Analytics endpoints: Journal stats with mood distribution, tag frequencies, entry history
- Achievements endpoints: Check/unlock achievements, fetch user progress
- Subscription endpoints: Stripe checkout, webhook handling
- Auth endpoints: Replit Auth login/logout

**Session Management**: The app includes `connect-pg-simple` for PostgreSQL session storage, though sessions are not currently utilized in the codebase.

### Data Storage

**Database Storage**: All user data is persisted in PostgreSQL database:
- **users table**: User profiles with Replit Auth integration (id, email, firstName, lastName, isPro status)
- **ritual_progress table**: Tracks completed steps per ritual per user
- **journal_entries table**: Stores journal content, mood, tags, AI insights, word count, and streak calculation
- **achievements table**: Tracks unlocked achievements with timestamps (first_entry, streak milestones, word counts, mood/tag exploration)
- **subscriptions table**: Stripe subscription data (customer ID, subscription ID, status, billing period)
- **sessions table**: Session storage for Replit Auth

**Data Models**: 
- **Database (Drizzle)**: TypeScript schema in `shared/schema.ts` with tables for users, rituals, journal, subscriptions
- **Client (Zod)**: Validation schemas for API requests/responses
  - `Ritual`: Defines learning experiences with steps, duration, and tier (free/pro)
  - `RitualProgress`: Tracks user completion of ritual steps (synced with database)
  - `JournalEntry`: Journal content and streak information (synced with database)

### Content Management

**Static Content**: Ritual and shop product data is defined as static JSON in `shared/schema.ts` rather than being stored in a database. This approach simplifies deployment but requires code changes to update content.

**Media Assets**: Product images and hero backgrounds are stored in `attached_assets/generated_images/` and imported directly into components.

### External Integrations

**Stripe**: Payment processing for Pro tier subscriptions ($19.99/month):
- Subscription creation endpoint: `POST /api/create-subscription`
- Webhook handler: `POST /api/webhooks/stripe` for subscription lifecycle events
- Frontend checkout flow: `/subscribe` page with Stripe Elements
- Automatic Pro status updates on subscription changes

**OpenAI**: Direct API integration using user's API key (OPENAI_API_KEY secret):
- AI-powered journal insights generation (3 personalized insights per entry)
- Conversational AI coach for journaling support
- Server-side API calls via `server/aiService.ts`
- Uses GPT-4 model for high-quality responses

**Replit Auth**: OpenID Connect authentication with PostgreSQL session storage:
- Login/logout endpoints with passport.js
- User profile stored in database
- Protected API routes using `isAuthenticated` middleware

**Calendly**: Events page embeds a Calendly widget using an iframe for scheduling discovery calls.

**MetaMuse GPT**: External link to a custom ChatGPT instance for AI-powered guidance. Opens in a new window.

### Routing Strategy

**Client-Side Routing**: Wouter provides declarative routing with URL pattern matching. Routes are defined in `App.tsx`:
- Public routes: home, rituals list, ritual detail, shop
- Member routes: journal, journal history (analytics), metamuse, events
- Account routes: account settings (stub), subscribe (Stripe checkout)

**Server-Side Routing**: Express catches all non-API routes and serves the React SPA, allowing client-side routing to take over.

### Build and Deployment

**Development**: `npm run dev` starts the Express server with Vite middleware, running on port 5000 (configured in vite.config.ts).

**Production Build**: 
1. `vite build` compiles the client to `dist/public`
2. `esbuild` bundles the server code to `dist/index.js`
3. `npm start` runs the production Express server

**Type Checking**: TypeScript is configured with strict mode, ESNext modules, and path aliases (`@/` for client, `@shared/` for shared code).

### Design System Implementation

**Typography**: Editorial font pairing for Forbes-meets-Vogue aesthetic:
- Cormorant Garamond for headings (serif, Vogue-inspired luxury)
- Sora for body text (geometric sans, modern readability)

**Color System**: Jewel-toned neon-on-onyx palette for futuristic luxury:
- Background: Obsidian (0 0% 6%), Satin Charcoal (260 20% 16%)
- Primary: Hyper Violet (275 85% 62%), Magenta Quartz (320 82% 64%)
- Accents: Cyber Fuchsia, Aurora Teal, Liquid Gold
- Text: Soft Halo (330 35% 92%) for premium contrast

**Component Patterns**:
- Cards use glassmorphism with `backdrop-blur-md`
- Buttons implement elevation changes on hover/active states
- Badges display tier indicators (free vs. pro) with distinct styling
- Progress rings visualize ritual completion percentage

### Performance Considerations

**Code Splitting**: Vite automatically splits code by route, loading only necessary JavaScript for each page.

**Asset Optimization**: Images are imported as static assets, allowing Vite to optimize and fingerprint them during build.

**Lazy Loading**: React components could be lazy-loaded, though this is not currently implemented.

## External Dependencies

### Core Framework Dependencies

- **React 18**: UI library for component-based architecture
- **TypeScript**: Type safety across client and server code
- **Vite**: Build tool and development server with HMR
- **Express**: Node.js web server framework
- **Wouter**: Lightweight client-side routing library

### UI and Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (accordion, dialog, dropdown, etc.)
- **Framer Motion**: Animation library for smooth transitions
- **class-variance-authority**: Utility for managing component variants
- **clsx / tailwind-merge**: Conditional className utilities

### Forms and Validation

- **React Hook Form**: Form state management
- **Zod**: Schema validation and TypeScript type inference
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching

- **@tanstack/react-query**: Server state management for API data fetching and caching
- **date-fns**: Date formatting and parsing for journal entries and analytics

### Database

- **Drizzle ORM**: TypeScript ORM for SQL databases with schema definitions in `shared/schema.ts`
- **@neondatabase/serverless**: PostgreSQL client for Neon serverless databases
- **drizzle-zod**: Generate Zod schemas from Drizzle tables for validation

### Development Tools

- **@replit/vite-plugin-runtime-error-modal**: Error overlay for Replit environment
- **@replit/vite-plugin-cartographer**: Code navigation for Replit
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development server

### PWA

- **Service Worker**: Custom implementation in `public/sw.js` for offline caching
- **Web App Manifest**: PWA configuration in `public/manifest.json`

### Third-Party Services

- **OpenAI API**: GPT-4 for journal insights and AI coach chat
- **Stripe**: Payment processing for Pro subscriptions ($19.99/month)
- **Gumroad**: E-commerce platform for product sales (external redirect)
- **Calendly**: Scheduling platform for discovery calls (iframe embed)
- **ChatGPT (MetaMuse)**: Custom GPT instance for AI assistance (external link)
- **Google Fonts**: Typography assets (Playfair Display, Inter)

## Recent Changes (October 2025)

### Journal Analytics & Achievements System
- **Database Migration**: Added achievements table for tracking user milestones
- **Analytics API**: New `/api/journal/stats` endpoint providing comprehensive journal analytics:
  - Total entries, word count, current streak, unique tags
  - Mood distribution with percentages
  - All journal entries with metadata for visualization
- **Achievements API**: `/api/achievements` and `/api/achievements/check` endpoints:
  - 9 achievement types: first_entry, streak_3/7/30, word_warrior_1k/5k, mood_master, tag_explorer, consistent_writer
  - Automatic achievement checking and unlocking
  - Progress tracking for each milestone

### Journal History Page (`/journal/history`)
- **Key Metrics Dashboard**: 4 stat cards showing entries, words, streak, tags
- **Writing Calendar**: 28-day grid with mood-based background colors (pink=joyful, blue=peaceful, purple=reflective, amber=challenged, yellow=energized)
- **Tag Cloud**: Frequency-based tag visualization with interactive filtering
- **Mood Distribution**: Percentage breakdown with progress bars
- **Entry Search & Filters**: Search by text, filter by mood, filter by tags
- **Achievements Display**: Animated badge reveals with framer-motion, toast notifications for new unlocks

### AI Integration
- Migrated from Replit AI to direct OpenAI API integration
- AI-powered journal insights (3 personalized insights per entry)
- Conversational AI coach for journaling support
- Server-side API calls via `server/aiService.ts`

### Forbes Meets Vogue Design Overhaul
- **Complete Design System Redesign**: Transformed from calm spa aesthetic to vivid luxury editorial
- **Jewel-Toned Neon Palette**: Deep obsidian backgrounds with vivid accents:
  - Hyper Violet (275 85% 62%) - Primary brand color
  - Magenta Quartz (320 82% 64%) - Secondary actions
  - Cyber Fuchsia (325 92% 55%) - Premium highlights
  - Aurora Teal (175 78% 55%) - Success states
  - Liquid Gold (48 94% 56%) - Pro tier features
- **Editorial Typography**: Cormorant Garamond (serifs) + Sora (geometric sans) for Vogue-inspired luxury
- **Visual Effects**: Neon glow effects, gradient animations, metallic text shimmers, editorial card patterns
- **New Hero Assets**: Generated 3 futuristic abstract images with jewel tones and light trails
- **Accessibility**: Added prefers-reduced-motion support for animations
- **Documentation**: Completely rewrote design_guidelines.md with new luxury aesthetic guidance
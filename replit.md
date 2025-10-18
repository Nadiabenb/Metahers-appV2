# MetaHers Mind Spa

## Overview

MetaHers Mind Spa is a Progressive Web App (PWA) that combines luxury spa aesthetics with technology education, specifically focusing on AI and Web3 topics. The application provides guided learning experiences called "rituals" that teach users about AI prompting, blockchain, cryptocurrency, NFTs, and the metaverse in a calm, spa-like environment.

The app features a subscription model with Pro tier ($19.99/month) that unlocks all 5 rituals and premium features. Free users can access the first ritual. The app includes a personal journal with streak tracking, Stripe payment processing, and integration with external services for AI assistance (MetaMuse GPT) and booking (Calendly).

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
- Custom CSS variables for theme colors (blush, champagne, mint, onyx, gold)
- Glassmorphism effects achieved through backdrop-blur utilities
- Design system emphasizes luxury spa aesthetics with rounded corners, soft shadows, and subtle animations

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

**API Structure**: The application is set up to support API routes (prefixed with `/api`), though currently no API endpoints are implemented. The routing infrastructure exists in `server/routes.ts`.

**Session Management**: The app includes `connect-pg-simple` for PostgreSQL session storage, though sessions are not currently utilized in the codebase.

### Data Storage

**Database Storage**: All user data is persisted in PostgreSQL database:
- **users table**: User profiles with Replit Auth integration (id, email, firstName, lastName, isPro status)
- **ritual_progress table**: Tracks completed steps per ritual per user
- **journal_entries table**: Stores journal content with streak calculation
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

**Replit Auth**: OpenID Connect authentication with PostgreSQL session storage:
- Login/logout endpoints with passport.js
- User profile stored in database
- Protected API routes using `isAuthenticated` middleware

**Calendly**: Events page embeds a Calendly widget using an iframe for scheduling discovery calls.

**MetaMuse GPT**: External link to a custom ChatGPT instance for AI-powered guidance. Opens in a new window.

### Routing Strategy

**Client-Side Routing**: Wouter provides declarative routing with URL pattern matching. Routes are defined in `App.tsx`:
- Public routes: home, rituals list, ritual detail, shop
- Member routes: journal, metamuse, events
- Account routes: account settings (stub)

**Server-Side Routing**: Express catches all non-API routes and serves the React SPA, allowing client-side routing to take over.

### Build and Deployment

**Development**: `npm run dev` starts the Express server with Vite middleware, running on port 5000 (configured in vite.config.ts).

**Production Build**: 
1. `vite build` compiles the client to `dist/public`
2. `esbuild` bundles the server code to `dist/index.js`
3. `npm start` runs the production Express server

**Type Checking**: TypeScript is configured with strict mode, ESNext modules, and path aliases (`@/` for client, `@shared/` for shared code).

### Design System Implementation

**Typography**: Two Google Fonts are loaded:
- Playfair Display for headings (serif, luxury aesthetic)
- Inter for body text (sans-serif, readability)

**Color System**: HSL-based color variables enable opacity modifications and theme flexibility:
- Primary palette: blush (soft pink), champagne (neutral beige), mint (success green)
- Accent: gold for premium elements and highlights
- Text: onyx (near-black) for high contrast

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

- **@tanstack/react-query**: Server state management (configured but not actively used)

### Database (Configured but Unused)

- **Drizzle ORM**: TypeScript ORM for SQL databases
- **@neondatabase/serverless**: PostgreSQL client for Neon serverless databases
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Development Tools

- **@replit/vite-plugin-runtime-error-modal**: Error overlay for Replit environment
- **@replit/vite-plugin-cartographer**: Code navigation for Replit
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development server

### PWA

- **Service Worker**: Custom implementation in `public/sw.js` for offline caching
- **Web App Manifest**: PWA configuration in `public/manifest.json`

### Third-Party Services

- **Gumroad**: E-commerce platform for product sales (external redirect)
- **Calendly**: Scheduling platform for discovery calls (iframe embed)
- **ChatGPT (MetaMuse)**: Custom GPT instance for AI assistance (external link)
- **Google Fonts**: Typography assets (Playfair Display, Inter)
# MetaHers Mind Spa

## Overview

MetaHers Mind Spa is a Progressive Web App (PWA) that merges luxury spa aesthetics with technology education, focusing on AI and Web3. It offers guided learning "rituals" covering AI prompting, blockchain, cryptocurrency, NFTs, and the metaverse in a serene, spa-like setting. The app operates on a subscription model, with a Pro tier ($19.99/month) unlocking all rituals and premium features. Key capabilities include an AI-Powered Personal Journal with mood tracking and AI-generated insights, comprehensive Journal Analytics, a gamified Achievements System, and a blog ("MetaHers Daily") featuring articles on Web3 and AI topics. The project aims to provide an engaging and educational experience for women in technology, presented with a Forbes-meets-Vogue luxury aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React and TypeScript, utilizing Wouter for client-side routing and Vite for builds. State management primarily uses `localStorage` for persistence. Radix UI primitives, wrapped in custom components following the shadcn/ui pattern, form the UI component library. Styling is handled with Tailwind CSS, custom CSS variables for a jewel-tone neon palette, and Framer Motion for animations. The application is implemented as a PWA with a manifest file and a service worker for basic caching.

### Backend

The backend is an Express.js server, serving the React application. It provides RESTful API routes for journal operations (CRUD, AI insights, AI coach chat), analytics, achievements, subscriptions, and Replit Auth. PostgreSQL is used for data persistence, storing user profiles, ritual progress, journal entries, achievements, and subscription data. Static content like ritual and shop product data is defined as JSON in `shared/schema.ts`.

### Data Storage

All user data is stored in a PostgreSQL database using Drizzle ORM for schema definition. This includes `users`, `ritual_progress`, `journal_entries`, `achievements`, and `subscriptions` tables. Zod is used for client-side validation of API requests and responses.

### Design System

The app features a "Forbes-meets-Vogue" luxury editorial design. Typography combines Cormorant Garamond for headings and Sora for body text. The color system uses a jewel-toned neon-on-onyx palette with deep obsidian backgrounds and vivid accents like Hyper Violet, Magenta Quartz, Cyber Fuchsia, Aurora Teal, and Liquid Gold. Visual effects include neon glow, gradient animations, and metallic text.

## External Dependencies

-   **OpenAI API**: For AI-powered journal insights, conversational AI coach, and AI-generated writing prompts.
-   **Stripe**: Payment processing for Pro tier subscriptions.
-   **Replit Auth**: For user authentication and session management.
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
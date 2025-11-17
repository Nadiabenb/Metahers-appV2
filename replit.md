
# MetaHers Mind Spa - Complete System Architecture

## Overview
MetaHers Mind Spa is a production-ready Progressive Web App (PWA) that transforms AI and Web3 education into a luxury learning experience for women solopreneurs. The platform combines Forbes-quality content with Vogue aesthetics, offering personalized learning journeys across 9 specialized spaces with 65 transformational experiences.

## Core Value Proposition
- **Target Audience**: Women professionals building AI/Web3 careers without quitting their jobs
- **Differentiation**: Luxury educational experience with AI-powered personalization, hands-on projects, and measurable outcomes
- **Monetization**: Freemium model with tiered subscriptions (Free → Pro → Sanctuary → Inner Circle → Founders Circle)

## Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Shadcn UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight SPA routing)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **PWA**: Service Worker + Web App Manifest (installable)

### Backend
- **Runtime**: Node.js 20 + Express.js + TypeScript
- **Database**: PostgreSQL 16 (Neon serverless)
- **ORM**: Drizzle ORM with Zod validation
- **Authentication**: Passport.js + express-session (secure cookies)
- **AI Integration**: OpenAI GPT-4o with prompt caching (65% cost reduction)
- **Security**: Helmet.js, CORS, rate limiting, CSRF protection
- **Logging**: Pino (structured JSON logging)
- **Email**: Resend (transactional emails)
- **Payments**: Stripe (subscriptions + one-time purchases)

### Infrastructure
- **Hosting**: Replit Autoscale Deployments
- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **CDN**: Cloudflare (via Replit)
- **SSL**: Automatic HTTPS
- **Monitoring**: Pino logs + Replit analytics

## System Architecture

### MetaHers World (Hub-and-Spoke Learning Model)

The platform is organized as **MetaHers World**, a central hub connecting 9 specialized learning spaces. Each space contains 6 transformational experiences (54 total, with 11 additional in Digital Boutique = 65 total).

**The 9 Learning Spaces:**

1. **Web3** - Decentralized technologies and blockchain fundamentals
2. **NFT/Blockchain/Crypto** - Digital assets, NFTs, and cryptocurrency
3. **AI** - AI tools, custom GPTs, and automation
4. **Metaverse** - Virtual worlds and digital ownership
5. **Branding** - Personal and professional brand building with AI
6. **Moms** - Tech careers and entrepreneurship for mothers
7. **App Atelier** - Building apps with AI and no-code tools
8. **Founder's Club** - 12-week accelerator for turning ideas into reality
9. **Digital Boutique** - E-commerce workshop series for launching online stores in 3 days (Shopify, Instagram Shopping, TikTok Shop, email marketing)

### Transformational Experiences

Each experience contains **5-7 learning sections** with Harvard Business School-quality content:

**Section Types:**
- **Text Sections**: Long-form educational content (600-1200 words)
- **Interactive Sections**: Guided exercises and self-assessments
- **Quiz Sections**: Knowledge checks with instant feedback
- **Hands-On Lab Sections**: Real-world projects (15-90 minutes)
- **Video Sections**: Curated external content

**Content Quality Standards:**
- Forbes-meets-Vogue editorial tone
- Research-backed insights with citations
- Concrete ROI metrics and revenue examples
- Zero fluff, maximum actionable value
- AI-powered personalization based on user profile

### Tiered Access Model

**Free Tier:**
- Access to 30% of experiences (marked as `tier: "free"`)
- Basic journal features
- Community access
- Career companion (basic)

**Pro Tier ($49/month or $399/year):**
- Access to 100% of experiences
- AI-powered journal analysis and prompts
- Advanced career companion
- Priority support
- Downloadable resources

**Sanctuary Tier ($199/month):**
- Everything in Pro
- Monthly group coaching sessions
- Exclusive workshops
- Community accountability groups
- Early access to new content

**Inner Circle Tier ($499/month):**
- Everything in Sanctuary
- Monthly 1:1 coaching sessions
- Founder insights and case studies
- Direct Slack/WhatsApp access
- Custom learning paths

**Founders Circle Tier ($2,997 one-time):**
- Everything in Inner Circle
- 12-week intensive accelerator
- Daily founder support
- Business launch assistance
- Lifetime community access

## Database Schema

### Core Tables

**Users**
- `id`, `email`, `password_hash`, `first_name`, `last_name`
- `is_pro`, `subscription_tier` (enum)
- `quiz_unlocked_ritual`, `quiz_completed_at`
- `onboarding_completed`, `created_at`, `updated_at`

**Spaces**
- `id`, `name`, `slug`, `description`
- `icon`, `color`, `sort_order`, `is_active`

**Transformational Experiences**
- `id`, `space_id`, `title`, `slug`, `description`
- `learning_objectives` (JSONB array)
- `tier` (enum: free/pro)
- `estimated_minutes`, `sort_order`
- `content` (JSONB with sections array)
- `personalization_enabled`, `is_active`

**Experience Progress**
- `id`, `user_id`, `experience_id`
- `completed_sections` (JSONB array)
- `confidence_score`, `business_impact`
- `milestones_achieved` (JSONB array)
- `started_at`, `completed_at`, `last_activity_at`

**Section Completions** (Granular tracking)
- `id`, `user_id`, `experience_id`, `section_id`
- `time_spent_seconds`, `quiz_score`
- `completed_at`

**Personalization Answers**
- `id`, `user_id`, `experience_id`
- `answers` (JSONB object)
- `created_at`, `updated_at`

**Journal Entries**
- `id`, `user_id`, `date`, `content`
- `structured_content` (JSONB for rich formatting)
- `mood`, `tags`, `word_count`
- `ai_insights` (JSONB), `ai_prompt`
- `streak`, `last_saved`, `created_at`

**Subscriptions** (Stripe integration)
- `id`, `user_id`
- `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`
- `status`, `current_period_end`, `cancel_at_period_end`

**Quiz Submissions**
- `id`, `user_id`, `name`, `email`
- `answers` (JSONB), `matched_ritual`
- `claimed`, `ritual_completed`, `one_on_one_booked`

**Achievements**
- `id`, `user_id`, `achievement_key`, `unlocked_at`

**Thought Leadership Journey** (30-Day Program)
- `thought_leadership_progress`: User's journey state
- `thought_leadership_posts`: Generated content (3 formats: long/medium/short)
- Brand profile, daily practice reflections, streak tracking

**Membership Features**
- `group_sessions`: Live workshops and events
- `session_registrations`: Attendance tracking
- `one_on_one_bookings`: 1:1 coaching appointments
- `founder_insights`: Premium content library

**AI Glow-Up Program** (14-Day Personal Brand Builder)
- `glow_up_profiles`: User brand information
- `glow_up_progress`: Daily completion tracking
- `glow_up_journal_entries`: Daily content creation

**Career Companion**
- `companions`: Gamified progress tracker
- Stats: `inspiration`, `growth`, `mastery`, `connection`
- Level progression and evolution

**App Atelier**
- `app_atelier_usage`: Message limits and tracking (5 free messages, unlimited for VIP/Executive)

**Cohort Management**
- `cohort_capacity`: Spot availability for VIP Cohort and Executive Intensive

### AI Service Layer

**Prompt Management:**
- Centralized prompt templates in `server/lib/prompts/templates.ts`
- Version control for prompts in `server/lib/prompts/versions.ts`
- Prompt caching with OpenAI (65% cost reduction on repeated contexts)

**AI Functions:**
1. `generateJournalPrompt()`: Daily writing prompts with context
2. `analyzeJournalEntry()`: AI insights (themes, emotions, growth areas)
3. `chatWithJournalCoach()`: Conversational coaching
4. `generateThoughtLeadershipContent()`: 3-format content generation
5. `chatWithAppAtelierCoach()`: App development assistance
6. `generateRecommendations()`: Personalized learning suggestions
7. `enhanceExperienceContent()`: Content quality improvement (TOON framework)

**Cost Tracking:**
- `ai_usage` table tracks every AI call
- `tokens_used`, `estimated_cost`, `cache_hit`
- Per-user and system-wide analytics
- Admin dashboard for monitoring

**Budget Controls:**
- Daily/monthly spending limits
- Rate limiting per user/endpoint
- Alert system for unusual usage
- Fallback to cached responses

## API Architecture

### Authentication Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Login with session creation
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/user` - Current user profile
- `POST /api/auth/request-password-reset` - Forgot password
- `POST /api/auth/reset-password` - Password reset with token
- `POST /api/auth/activate-beta-code` - Pro access via code
- `POST /api/auth/complete-onboarding` - Mark onboarding done

### Learning Routes
- `GET /api/spaces` - All learning spaces (cached)
- `GET /api/spaces/:slug` - Space details
- `GET /api/experiences/all` - All experiences (filtered by tier)
- `GET /api/experiences/:slug` - Experience details (Pro-gated)
- `GET /api/spaces/:spaceId/experiences` - Experiences by space
- `POST /api/experiences/:experienceId/sections/:sectionId/complete` - Mark section complete
- `GET /api/experiences/:experienceId/analytics` - Learning analytics
- `POST /api/experiences/:experienceId/personalization` - Save answers
- `GET /api/experiences/:experienceId/personalization` - Get answers
- `GET /api/experiences/:experienceId/progress` - Progress tracking
- `POST /api/experiences/:experienceId/progress` - Update progress

### Journal Routes
- `GET /api/journal` - Today's entry
- `POST /api/journal` - Save entry
- `GET /api/journal/list` - Calendar view (month)
- `GET /api/journal/entries` - Recent entries
- `GET /api/journal/prompt` - AI-generated prompt (Pro)
- `POST /api/journal/analyze` - AI insights (Pro)
- `POST /api/journal/chat` - AI coach conversation (Pro)
- `GET /api/journal/stats` - Analytics dashboard
- `GET /api/analytics/progress` - Progress over time

### AI Routes
- `POST /api/ai/coach` - Learning experience AI coach
- `GET /api/admin/cache-stats` - OpenAI cache metrics (Admin)
- `POST /api/app-atelier/chat` - App building assistance
- `GET /api/app-atelier/usage` - Message limit tracking
- `POST /api/playground/run-prompt` - Public AI playground (rate-limited)
- `POST /api/career-path/generate` - Career roadmap generation (rate-limited)

### Thought Leadership Routes
- `GET /api/thought-leadership/curriculum` - 30-day curriculum
- `GET /api/thought-leadership/curriculum/:day` - Specific day
- `GET /api/thought-leadership/progress` - User journey state
- `PUT /api/thought-leadership/brand-profile` - Onboarding
- `POST /api/thought-leadership/generate` - Generate day's content
- `GET /api/thought-leadership/posts` - User's posts
- `GET /api/thought-leadership/posts/:id` - Single post
- `PATCH /api/thought-leadership/posts/:id` - Edit post
- `POST /api/thought-leadership/posts/:id/publish` - Publish to MetaHers/external
- `GET /api/thought-leadership/public` - Public insights feed
- `GET /api/thought-leadership/insights/:slug` - Public post view

### Subscription Routes
- `POST /api/create-checkout-session` - Stripe checkout (all tiers)
- `POST /api/create-subscription` - Legacy Pro subscription
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Membership Routes (Tiered Access)
- `GET /api/sessions/upcoming` - Group sessions (Sanctuary+)
- `GET /api/sessions/past` - Past sessions (Sanctuary+)
- `POST /api/sessions/:id/register` - Register for session (Sanctuary+)
- `DELETE /api/sessions/:id/cancel` - Cancel registration (Sanctuary+)
- `GET /api/sessions/my-registrations` - User registrations (Sanctuary+)
- `GET /api/bookings` - 1:1 bookings (Inner Circle+)
- `POST /api/bookings` - Create booking (Inner Circle+)
- `PATCH /api/bookings/:id` - Update booking (Inner Circle+)
- `DELETE /api/bookings/:id` - Cancel booking (Inner Circle+)
- `GET /api/insights` - Founder insights library (Inner Circle+)
- `GET /api/insights/:id` - Single insight (Inner Circle+)

### Admin Routes (Protected)
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/experiences` - Content management
- `PATCH /api/admin/experiences/:id` - Update experience
- `GET /api/admin/ai-usage` - AI cost tracking
- `GET /api/admin/quiz-results` - Quiz submissions
- `POST /api/admin/clear-cache` - Clear system caches
- `POST /api/admin/populate-db` - Seed database (one-time)
- `POST /api/admin/test-content-enhancement` - Test AI enhancement

### Public Routes
- `GET /api/news` - RSS tech news aggregation
- `GET /api/cohort-capacity/:cohortName` - VIP/Executive spots
- `POST /api/email-leads` - Beta signup capture
- `POST /api/quiz/submit` - Quiz submission (unauthenticated)
- `GET /api/quiz/results/:email` - Quiz results

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /api/health` - API health check
- `POST /api/logs/client` - Client-side error logging

## SEO Strategy

### Technical SEO
- **Dynamic Meta Tags**: SEO component with Open Graph and Twitter Cards
- **Sitemap**: `/sitemap.xml` with all public pages
- **Robots.txt**: Optimized for search engines
- **Canonical URLs**: Prevent duplicate content
- **Structured Data**: JSON-LD schema for articles and courses
- **Image Optimization**: AVIF/WebP with fallbacks, lazy loading, srcset
- **Mobile-First**: Responsive design, touch-optimized
- **Performance**: 
  - Lighthouse scores: 90+ on all metrics
  - Compression (Gzip/Brotli)
  - Code splitting and lazy loading
  - Service worker caching

### Content SEO
- **Keyword-Rich Titles**: "AI for Women Entrepreneurs", "Web3 Career Guide"
- **Long-Form Content**: 800-1200 word blog articles
- **Internal Linking**: Cross-references between experiences
- **External Backlinks**: High-quality resource citations
- **Fresh Content**: Regular blog updates, thought leadership posts

### Image Guidelines
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

## Security Architecture

### Authentication & Authorization
- **Session-Based Auth**: HTTP-only secure cookies
- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: csurf middleware (disabled for webhooks)
- **Role-Based Access**: Admin, Pro, Sanctuary, Inner Circle, Founders Circle
- **JWT Alternative**: Server-side sessions for security

### Data Protection
- **Input Validation**: Zod schemas for all user input
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **XSS Prevention**: DOMPurify sanitization for user-generated content
- **Rate Limiting**: IP-based throttling (express-rate-limit)
- **CORS**: Strict origin allowlist
- **Security Headers**: Helmet.js (CSP, HSTS, X-Frame-Options)

### API Security
- **Rate Limits**:
  - Playground: 10 prompts/hour per IP
  - Career Path: 3 generations/hour per IP
  - App Atelier: 5 messages for free, unlimited for VIP/Executive
- **Webhook Verification**: Stripe signature validation
- **Admin Routes**: Email-based admin list (ADMIN_EMAILS env var)
- **Sensitive Data**: Environment variables for API keys

## Performance Optimizations

### Caching Strategy
- **In-Memory Caches**:
  - Spaces cache (5 min TTL)
  - Experiences cache (5 min TTL)
  - Recommendations cache (10 min TTL)
- **OpenAI Prompt Cache**: 65% cost reduction on repeated contexts
- **Service Worker**: Offline-first PWA caching
- **Database Caching**: Neon connection pooling

### Image Optimization
- **Format**: AVIF (primary), WebP (fallback), JPEG/PNG (legacy)
- **Responsive**: srcset with 400w, 800w, 1200w, 1600w, 2400w sizes
- **Lazy Loading**: Native browser lazy loading + Intersection Observer
- **CDN**: Cloudflare via Replit for global delivery
- **Compression**: Sharp.js for build-time optimization

### Bundle Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Vite automatic dead code elimination
- **Minification**: Terser for JavaScript, cssnano for CSS
- **Compression**: Brotli + Gzip at runtime

## Deployment Architecture

### Development
- **Environment**: Replit workspace with hot module reloading
- **Command**: `npm run dev` (starts Vite + Express concurrently)
- **Database**: Neon PostgreSQL (shared with production)
- **Port**: 5000 (forwarded to 80/443 in production)

### Production
- **Platform**: Replit Autoscale Deployment
- **Build**: `npm run build` (Vite + esbuild)
- **Run**: `npm run start` (Node.js server)
- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **SSL**: Automatic HTTPS via Replit
- **Domain**: `<app-name>.replit.app` (custom domains supported)
- **Scaling**: Automatic horizontal scaling based on traffic
- **Health Checks**: `/health` and `/api/health` endpoints

### Environment Variables
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
SESSION_SECRET=<random-secret>
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
STRIPE_PRICE_ID_ANNUAL=price_...
STRIPE_PRICE_ID_SANCTUARY=price_...
STRIPE_PRICE_ID_INNER_CIRCLE=price_...
STRIPE_PRICE_ID_FOUNDERS_CIRCLE=price_...
STRIPE_PRICE_ID_VIP=price_...
STRIPE_PRICE_ID_EXECUTIVE=price_...
RESEND_API_KEY=re_...
ADMIN_EMAILS=nadia@metahers.ai,hello@metahers.ai
```

## Data Flow Examples

### User Journey: Free → Pro Upgrade
1. User browses free experiences in `/world`
2. Clicks Pro experience → sees upgrade prompt
3. Navigates to `/upgrade` → selects Pro tier
4. Clicks "Upgrade Now" → Stripe checkout session created
5. Completes payment → Stripe webhook updates subscription
6. User redirected to `/workspace` with Pro access
7. Can now access all 65 experiences + AI features

### Learning Experience Flow
1. User selects experience from space
2. Personalization questions modal (if enabled)
3. Sections rendered based on type:
   - Text: Long-form content with resources
   - Interactive: Guided exercises with AI prompts
   - Quiz: Knowledge check with instant feedback
   - Hands-On Lab: Real project with deliverables
4. AI coaching sidebar available (Pro)
5. Progress auto-saved on section completion
6. Celebration animation on experience completion

### AI Content Generation Flow
1. User submits journal entry or TL practice
2. Request sent to `/api/journal/analyze` or `/api/thought-leadership/generate`
3. Backend checks AI budget limits
4. Prompt template retrieved from `server/lib/prompts/templates.ts`
5. OpenAI API called with prompt caching enabled
6. Response parsed and validated
7. AI usage logged to `ai_usage` table
8. Result returned to client and saved to database
9. Cache monitor tracks cost savings

### Thought Leadership 30-Day Journey
1. User completes brand onboarding (5 questions)
2. Each day (1-30):
   - Review curriculum focus for the day
   - Complete daily practice exercise
   - Reflect on practice (text submission)
3. AI generates content in 3 formats:
   - Long-form (800-1000 words) for LinkedIn articles
   - Medium (300-400 words) for LinkedIn posts
   - Short (100-150 words) for Twitter threads
4. User reviews, edits, and publishes to:
   - MetaHers Insights (public feed)
   - External platforms (LinkedIn, Twitter, Medium)
5. Progress tracked: streak, completion %, published count
6. Upon completion (30/30 days): Certificate + portfolio

## Analytics & Monitoring

### User Analytics
- Experience completion rates
- Time spent per section
- Drop-off points
- AI feature usage
- Subscription conversion rates
- Cohort retention

### System Analytics
- API response times
- Database query performance
- OpenAI API costs and cache hit rates
- Error rates and types
- Concurrent users
- Geographic distribution

### Business Metrics
- MRR (Monthly Recurring Revenue)
- Churn rate by tier
- LTV (Lifetime Value) by cohort
- CAC (Customer Acquisition Cost)
- Content engagement scores
- NPS (Net Promoter Score)

## Future Enhancements

### Planned Features
1. **Mobile Apps**: iOS + Android native apps (React Native)
2. **Live Cohorts**: Scheduled group programs with accountability
3. **Marketplace**: User-generated content and templates
4. **API for Partners**: Embed MetaHers content in other platforms
5. **White-Label**: Enterprise version for companies
6. **AI Agents**: Personal AI assistants for each user
7. **Web3 Integration**: NFT certificates, token-gated content
8. **Community Forum**: Discussion boards and peer support

### Technical Debt
- Migrate from session cookies to JWT for API-only clients
- Add comprehensive E2E test coverage (Playwright)
- Implement database migrations with version control
- Add Redis for distributed caching
- Implement WebSocket for real-time features
- Add Sentry for error tracking and monitoring

## Design System

### Brand Colors
- **Hyper Violet**: `#8B5CF6` - Primary brand color
- **Magenta Quartz**: `#EC4899` - Accent and CTAs
- **Cyber Fuchsia**: `#D946EF` - Interactive elements
- **Aurora Teal**: `#06B6D4` - Success states
- **Liquid Gold**: `#F59E0B` - Premium badges
- **Onyx**: `#0A0A0F` - Text and depth
- **Champagne**: `#F8F8F8` - Light backgrounds

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, clean, readable)
- **Monospace**: JetBrains Mono (code blocks)

### Components
- Glassmorphism cards with `backdrop-blur-md`
- Rounded corners (`rounded-2xl`)
- Soft shadows and subtle animations (150-250ms)
- Framer Motion for smooth transitions
- Cursor sparkles and custom cursor on desktop
- Atmospheric background effects

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Reduced motion preference support
- High contrast mode compatible
- Focus indicators on all interactive elements

## Success Metrics

### Product Metrics
- **Activation**: 70% of signups complete onboarding
- **Engagement**: 40% weekly active users
- **Retention**: 60% 30-day retention
- **Conversion**: 15% free → Pro conversion
- **Completion**: 25% experience completion rate

### Business Metrics
- **Revenue**: $50K MRR by Month 6
- **Users**: 5,000 registered users by Month 6
- **Paid Users**: 500 paying subscribers by Month 6
- **Churn**: <5% monthly churn rate
- **NPS**: >50 Net Promoter Score

### Content Metrics
- **Quality**: 90+ Lighthouse performance score
- **SEO**: Top 10 Google rankings for target keywords
- **Engagement**: 5+ minutes average session duration
- **Social**: 100+ organic shares per week
- **Reviews**: 4.8+ star rating from users

---

**Last Updated**: January 2025  
**Version**: 2.0 (Post-SEO & Admin Dashboard Launch)  
**Maintainer**: MetaHers Engineering Team

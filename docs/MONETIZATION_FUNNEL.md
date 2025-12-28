
# MetaHers Monetization Funnel

## Journey Map: Free → Core → Premium

### Stage 1: AWARENESS (Free Entry)
**Goal:** Capture email + demonstrate value

**Primary Path:**
```
Landing Page → Vision Board (Free) → Email Capture → Personalized Quiz
```

**Features to Prioritize:**
1. **Vision Board Builder** (`/vision-board`)
   - AI-powered 2026 vision creation
   - 7 life dimensions
   - Shareable results
   - Email required to save/access

2. **Free Resources Page** (`/free-resources`)
   - Lead magnet: "7 AI Prompts That Save 10+ Hours/Week"
   - Web3 Starter Kit
   - Beta access code

3. **Onboarding Quiz** (`/onboarding/quiz`)
   - Personalizes experience
   - Unlocks 1 free ritual match
   - Books FREE discovery call

**Key Metrics:**
- Email capture rate: Target 40%+
- Quiz completion: Target 70%+

---

### Stage 2: ACTIVATION (Trial/Freemium)
**Goal:** Demonstrate product value + build habit

**Primary Path:**
```
Quiz Result → Unlocked Ritual → Complete Experience → Journal Prompt → Upgrade CTA
```

**Features to Prioritize:**
1. **Quiz-Matched Free Ritual** (`/rituals/[matched-slug]`)
   - User gets 1 full ritual based on quiz
   - Completes all sections
   - Sees locked content preview

2. **Journal Integration** (`/journal`)
   - Auto-prompt after ritual completion
   - Streak tracking (gamification)
   - Daily check-ins

3. **MetaMuse Tease** (`/companion`)
   - Limited free interactions (3 questions)
   - Upgrade prompt to unlimited

**Key Metrics:**
- Ritual completion rate: Target 60%+
- Journal usage: Target 40%+
- Time to upgrade: Target <7 days

---

### Stage 3: CONVERSION (Paid Membership)
**Goal:** Convert to Core Membership ($79/mo)

**Primary Path:**
```
Upgrade Prompt → Pricing Page → Core Membership → Onboarding Flow
```

**Features to Prioritize:**
1. **Smart Upgrade Prompts** (Throughout app)
   - After quiz completion: "Unlock all 54 rituals"
   - After 1st ritual: "Continue your journey with 53 more"
   - Journal: "Upgrade for AI-powered insights"
   - MetaMuse: "Unlock unlimited coaching"

2. **Pricing Page** (`/upgrade`)
   - Clear 3-tier structure
   - Vision Discovery (Free) vs Core ($79) vs Cohort ($699)
   - Social proof testimonials
   - Money-back guarantee

3. **Sticky Lead Bar** (All pages)
   - Non-intrusive reminder
   - Clear value prop
   - Easy upgrade access

**Key Metrics:**
- Free → Paid conversion: Target 5-8%
- Average days to conversion: Target <14 days

---

### Stage 4: RETENTION (Engagement)
**Goal:** Keep members active and prevent churn

**Primary Path:**
```
Dashboard → Personalized Recommendations → Complete Experiences → Journal → Community
```

**Features to Prioritize:**
1. **Dashboard** (`/dashboard`)
   - Next recommended experience
   - Progress tracking
   - Streak display
   - Upcoming sessions (Sanctuary+)

2. **Learning Hub** (`/learning-hub`)
   - 9 Worlds with clear paths
   - Progress visualization
   - Completion certificates

3. **AI Recommendations** (RecommendationWidget)
   - Personalized based on quiz + behavior
   - Dynamic content suggestions
   - "For you" feed

**Key Metrics:**
- Monthly Active Users (MAU): Target 70%+
- Avg sessions/week: Target 3+
- Churn rate: Target <10%/month

---

### Stage 5: EXPANSION (Upsells)
**Goal:** Increase lifetime value through premium offerings

**Premium Path A: Voyages**
```
Dashboard → Voyages Page → Voyage Detail → Request Invitation → Booking
```

**Features to Prioritize:**
1. **Voyages Marketplace** (`/voyages`)
   - 12 luxury experiences
   - AI, Crypto, Web3, Branding categories
   - Newport Beach in-person events
   - $497-$997 price range

2. **Voyage Detail Pages** (`/voyages/[slug]`)
   - Immersive storytelling
   - Social proof (limited spots)
   - Invitation-only exclusivity
   - Countdown timers

**Premium Path B: Cohorts**
```
Dashboard → AI Mastery Page → Application → Cohort Enrollment
```

**Features to Prioritize:**
1. **AI Mastery Cohort** (`/ai-mastery`)
   - 12-week intensive program
   - Live weekly labs
   - App Atelier sprints
   - Direct founder access
   - $699 or 3×$233

**Key Metrics:**
- Voyage conversion rate: Target 10-15% of Core members
- Cohort conversion rate: Target 5-8% of Core members
- Average LTV increase: Target 3-5x

---

## 🎯 Implementation Priority

### WEEK 1: Fix Core Funnel
1. ✅ Vision Board → Email capture flow
2. ✅ Quiz → Personalized ritual unlock
3. ✅ Upgrade CTAs throughout app
4. ✅ Pricing page clarity

### WEEK 2: Improve Activation
1. ⏳ Enhanced onboarding for new members
2. ⏳ Journal prompts after ritual completion
3. ⏳ MetaMuse trial (3 free questions)
4. ⏳ Streak gamification

### WEEK 3: Premium Offerings
1. ⏳ Voyages booking flow optimization
2. ⏳ AI Mastery application process
3. ⏳ 1:1 session booking (Calendly integration)

### WEEK 4: Retention & Analytics
1. ⏳ Personalized dashboard
2. ⏳ Email automation (Mailchimp/ConvertKit)
3. ⏳ Analytics tracking (Segment/Mixpanel)
4. ⏳ Churn prediction

---

## 📊 Key Metrics Dashboard

Track these religiously:

### Acquisition
- **Traffic sources**
- **Landing page conversion rate**
- **Email capture rate**

### Activation
- **Quiz completion rate**
- **Free ritual completion rate**
- **Time to first journal entry**

### Revenue
- **Free → Paid conversion rate**
- **Average time to conversion**
- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**

### Retention
- **Monthly Active Users (MAU)**
- **Churn rate**
- **Avg sessions per user**
- **Feature usage rates**

### Expansion
- **Upsell conversion rates**
- **Average Revenue Per User (ARPU)**
- **Lifetime Value (LTV)**
- **LTV:CAC ratio** (Target: 3:1 minimum)

---

## 🚀 Quick Wins to Implement Now

1. **Add Email Capture Modal** - Already built (`EmailCaptureModal.tsx`)
2. **Sticky Lead Bar** - Already built (`StickyLeadBar.tsx`)
3. **Free Resources Page** - Already built (`/free-resources`)
4. **Vision Board** - Already built (`/vision-board`)
5. **Quiz Flow** - Already built (`/onboarding/quiz`)

### Missing Links to Add:

1. **Upgrade Prompts After Free Ritual**
2. **Email Automation Sequences**
3. **Calendly Integration for Discovery Calls**
4. **Voyage Booking Flow Completion**
5. **Analytics Event Tracking**

---

## 💡 Optimization Ideas

### A/B Test These:
- Vision Board headline: "Create Your 2026 Vision" vs "Design Your Dream Life"
- Pricing anchor: Show annual vs monthly first
- CTA copy: "Start Free" vs "Begin Transformation"
- Quiz length: 6 questions vs 10 questions
- Free ritual unlock: 1 vs 3 rituals

### Conversion Boosters:
- Money-back guarantee (30 days)
- Social proof widgets
- Limited-time offers (Cyber Monday banner)
- Progress bars (gamification)
- Community testimonials


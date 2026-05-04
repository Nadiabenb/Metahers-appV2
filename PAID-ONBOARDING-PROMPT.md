# Paid Tier Onboarding System — Full Implementation Prompt

## CONTEXT

MetaHers is a SaaS platform for women founders/creatives. It has 4 tiers: Free ("AI Starter Kit"), MetaHers Studio ($29/mo), Private Advisory ($149/mo), and The AI Blueprint ($997 one-time).

**The problem:** When a free user upgrades to Studio or Private Advisory, they get a single transactional welcome email and... nothing else. The existing 7-email drip sequence (for free users) STOPS on upgrade (see `processScheduledEmails()` in `server/routes.ts` line 864). So paid members go from being nurtured to silence. There's no in-app welcome experience after upgrading either — the Stripe checkout redirects to `/workspace?upgrade=success` but nothing in the frontend handles that query param.

**What we're building:** A complete post-upgrade onboarding system with:
1. A 10-email automated sequence over 30 days (same structure for both tiers, different content per tier)
2. An in-app welcome modal that appears on first login after upgrading
3. The email sequence is persona-aware (builder/creative/mom) and has an activity-based variant on Day 21

---

## TECH STACK

- **Backend:** Express.js + TypeScript, Drizzle ORM, PostgreSQL
- **Frontend:** React + TypeScript, Wouter (routing), TanStack Query, Framer Motion, Tailwind CSS, shadcn/ui
- **Email:** Resend (via `getUncachableResendClient()` — never cache, tokens expire)
- **Payments:** Stripe (webhooks for subscription lifecycle)
- **Key paths:**
  - Schema: `shared/schema.ts`
  - Pricing/tier definitions: `shared/pricing.ts`
  - Server routes (emails, webhooks, auth): `server/routes.ts`
  - Storage interface + implementation: `server/storage.ts`
  - Email cron startup: `server/index.ts` (lines 150-158)
  - Welcome modal (free tier): `client/src/components/WelcomeModal.tsx`
  - HomePage (shows WelcomeModal): `client/src/pages/HomePage.tsx`
  - Tier access utilities: `client/src/lib/tierAccess.ts`

---

## EXISTING SYSTEM — WHAT YOU MUST UNDERSTAND BEFORE CODING

### 1. Free Tier Email Sequence (DO NOT BREAK THIS)

Located in `server/routes.ts` lines 425-898. A 7-email drip campaign for FREE users only.

**Schedule:** day_1, day_2, day_3, day_5, day_8, day_10, day_14
**Personalization:** 3 personas (builder, creative, mom) determined by quiz response
**Activity variant:** Day 5 checks `storage.getAgentUsage()` for active vs inactive
**Upgrade detection:** Line 864 — if user is no longer free tier, email is marked "upgraded" and skipped

The function `sendSequenceEmail()` (line 433) receives emailKey, user, persona, variant, goalLabel and looks up content from a big `emails` Record object. The email HTML is wrapped in a base template (line 827-836) with Georgia/Playfair Display serif font, max-width 600px, MetaHers gold (#C9A96E) accent color.

### 2. How Emails Get Scheduled

`storage.scheduleEmailSequence(userId, signupDate)` in `server/storage.ts` line 2402:
- Checks if sequence already exists for user (prevents duplicates)
- Inserts 7 rows into `scheduled_emails` table with calculated dates
- Day 1 sends immediately; Days 2+ scheduled at 10:00 UTC

Called on free signup at `server/routes.ts` line 1434 (fire-and-forget).

### 3. How Emails Get Processed (Cron)

`processScheduledEmails()` exported from `server/routes.ts` line 849:
- Called every hour via `setInterval` in `server/index.ts` line 151
- Also called 30s after startup (line 156)
- Fetches due emails via `storage.getDueScheduledEmails()`
- For each: loads user, checks if upgraded (skips if so), resolves persona/variant, calls `sendSequenceEmail()`, marks sent

### 4. Stripe Webhook (Upgrade Trigger)

`server/routes.ts` lines 3751-3859:
- Listens for `customer.subscription.created` and `customer.subscription.updated`
- Maps Stripe price IDs to tiers via `priceTierMap` (line 3800):
  - `STRIPE_PRICE_ID_SIGNATURE` → `signature_monthly`
  - `STRIPE_PRICE_ID_PRIVATE` → `private_monthly`
- Updates user: `subscriptionTier`, `isPro = true`
- On `subscription.created` + active: sends welcome email via `sendMembershipEmails()` (line 3815)
- `sendMembershipEmails()` (line 164) sends tier-specific welcome to member + notification to nadia@metahers.ai

### 5. Scheduled Emails Schema

`shared/schema.ts` lines 3409-3421:
```typescript
export const scheduledEmails = pgTable("scheduled_emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailKey: varchar("email_key").notNull(), // "day_1", "day_2", etc.
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  persona: varchar("persona"), // resolved at send time
  variant: varchar("variant"), // resolved at send time
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_scheduled_emails_user").on(table.userId),
  index("idx_scheduled_emails_due").on(table.scheduledFor, table.sentAt),
]);
```

### 6. Users Schema (relevant fields)

`shared/schema.ts` lines 32-47:
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  isPro: boolean("is_pro").default(false).notNull(),
  subscriptionTier: varchar("subscription_tier").default("free").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  quizUnlockedRitual: varchar("quiz_unlocked_ritual"),
  quizCompletedAt: timestamp("quiz_completed_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### 7. Storage Interface

`server/storage.ts` lines 383-387:
```typescript
// Scheduled email operations
scheduleEmailSequence(userId: string, signupDate: Date): Promise<void>;
getDueScheduledEmails(): Promise<ScheduledEmailDB[]>;
markEmailSent(id: string, persona: string, variant: string | null): Promise<void>;
```

### 8. Existing Welcome Modal (Free Tier)

`client/src/components/WelcomeModal.tsx` — 3-step modal shown when `user.onboardingCompleted === false`. Steps: Welcome → AI Toolkit → Learn by doing. On complete, calls `POST /api/auth/complete-onboarding` and sets `onboardingCompleted = true`.

Triggered in `client/src/pages/HomePage.tsx` line 118:
```typescript
useEffect(() => {
  if (user && !user.onboardingCompleted) {
    setShowWelcome(true);
  }
}, [user]);
```

### 9. Brand / Email Design System

- Primary gold: `#C9A96E`
- Private Advisory accent: dark header `background: linear-gradient(135deg, #2d2520 0%, #3d2f28 100%)`
- Pink accent for callouts: `#D4537E` with `background: #fdf5f7`
- Font: Georgia, 'Playfair Display', serif
- Max width: 600px
- CTA button style: `background:#C9A96E; color:#1A1A2E; padding:10px 20px; border-radius:4px; font-weight:600`
- Feature lists use: `background:#f9f5f2; padding:16px 20px; border-radius:4px; list-style:none`
- Footer: `font-size:12px; color:#aaa` with link to app.metahers.ai
- Signed: "Nadia" or "Nadia, Founder, MetaHers"
- App URL: `https://app.metahers.ai`

### 10. Tier Features (for email content reference)

**MetaHers Studio ($29/mo):**
- Daily access to the MetaHers AI concierge team (ARIA + Bella, Nova, Luna, Sage, Noor) — 40 messages/day
- Monthly live implementation lab
- Monthly group Q&A or office hours
- Complete Learning Hub & AI Toolkit
- Prompt library
- MetaHers Signal archive
- Community access
- Early access to new features

**Private Advisory ($149/mo):**
- Everything in Studio
- Priority question support — 150 messages/day
- Monthly private strategy review
- Concierge onboarding
- Early access to private templates and workflows

---

## IMPLEMENTATION PLAN — BUILD THESE IN ORDER

### STEP 1: Schema Changes

**File: `shared/schema.ts`**

Add a `sequenceType` column to `scheduledEmails`:
```typescript
sequenceType: varchar("sequence_type").default("free_onboarding").notNull(), // "free_onboarding" | "paid_onboarding"
```

Add a `paidWelcomeShown` column to `users`:
```typescript
paidWelcomeShown: boolean("paid_welcome_shown").default(false).notNull(),
```

**IMPORTANT:** You'll need a database migration for both of these. Add the columns with defaults so existing rows aren't affected. Use `ALTER TABLE scheduled_emails ADD COLUMN sequence_type VARCHAR DEFAULT 'free_onboarding' NOT NULL;` and `ALTER TABLE users ADD COLUMN paid_welcome_shown BOOLEAN DEFAULT false NOT NULL;`

### STEP 2: Storage Layer

**File: `server/storage.ts`**

Add to the `IStorage` interface (near line 384):
```typescript
schedulePaidEmailSequence(userId: string, tier: string, upgradeDate: Date): Promise<void>;
markPaidWelcomeShown(userId: string): Promise<void>;
```

Implement `schedulePaidEmailSequence`:
- Similar structure to `scheduleEmailSequence` (line 2402)
- Check for existing paid sequence (prevent duplicates) — filter by `sequenceType = 'paid_onboarding'`
- Schedule 10 emails: paid_day_0, paid_day_1, paid_day_3, paid_day_5, paid_day_7, paid_day_10, paid_day_14, paid_day_17, paid_day_21, paid_day_25, paid_day_30
- Day 0 sends immediately; rest at 10:00 UTC on their scheduled day
- Store the tier in a new column OR encode it in the emailKey (e.g., `paid_studio_day_0` vs `paid_private_day_0`) — encoding in emailKey is simpler and doesn't require another schema change

Implement `markPaidWelcomeShown`:
- `UPDATE users SET paid_welcome_shown = true WHERE id = $1`

### STEP 3: Paid Email Templates

**File: `server/routes.ts`**

Create a new function `sendPaidSequenceEmail()` modeled after `sendSequenceEmail()` (line 433). Same pattern: receives emailKey, user, persona, tier, variant.

**10 emails, same structure for both tiers, different content:**

**PHASE 1 — WARM WELCOME (Days 0-3)**

| Day | Email Key | Subject Pattern | Purpose |
|-----|-----------|-----------------|---------|
| 0 | paid_day_0 | Welcome + immediate value | Warm celebration → first action CTA specific to tier |
| 1 | paid_day_1 | Meet your team, deeper | Re-introduce ARIA + 5 specialists with tier-specific depth (Studio: daily access emphasis; Private: priority + strategy review) |
| 3 | paid_day_3 | Your first win | Guided prompt based on persona → celebrate what they can produce |

**PHASE 2 — ACTIVATE (Days 5-10)**

| Day | Email Key | Subject Pattern | Purpose |
|-----|-----------|-----------------|---------|
| 5 | paid_day_5 | Deep dive feature | Studio: Toolkit walkthrough + prompt library; Private: Private templates + strategy review booking |
| 7 | paid_day_7 | Real member story | Persona-matched case study / transformation story |
| 10 | paid_day_10 | Power prompts | Advanced prompts for their tier — 3 prompts with deep-link CTAs to specific agents |

**PHASE 3 — BELONG (Days 14-17)**

| Day | Email Key | Subject Pattern | Purpose |
|-----|-----------|-----------------|---------|
| 14 | paid_day_14 | Community invitation | Studio: Implementation lab invite + office hours; Private: VIP circle, exclusive access |
| 17 | paid_day_17 | Hidden gems | Features they probably haven't tried yet — based on tier (Learning Hub modules, Signal archive, etc.) |

**PHASE 4 — RETAIN (Days 21-30)**

| Day | Email Key | Subject Pattern | Purpose |
|-----|-----------|-----------------|---------|
| 21 | paid_day_21 | Progress check-in | Activity-based variant: active users get "look what you've done" celebration; quiet users get gentle re-engagement |
| 25 | paid_day_25 | What's coming | Upcoming features, events, labs — builds anticipation for staying |
| 30 | paid_day_30 | Nadia's personal note | Founder letter — personal, warm, "I'm glad you're here", asks what they'd like to see next |

**CONTENT TONE:**
- Phase 1: Warm and exclusive — "you're part of something special now"
- Phase 2-3: Shift to action-oriented — "here's what to do, here's what you unlock"
- Phase 4: Back to warm — personal connection, retention

**CONTENT DIFFERENTIATION BY TIER:**
- Studio emails emphasize: Toolkit, Prompt Library, Implementation Lab, Office Hours, Learning Hub, community, daily concierge access
- Private emails emphasize: Strategy reviews with Nadia's team, priority support, private templates, concierge onboarding, VIP-exclusive content, 150 daily messages

**For Private Advisory emails specifically:**
- Use the darker header style (dark brown gradient) matching the existing private welcome email
- Tone should feel more intimate/exclusive — "your private advisory team", "your strategy review"
- Always mention the personal/human touch that makes Private different from Studio

**IMPORTANT PATTERN TO FOLLOW:**
- Each email must have 3 persona variants (builder, creative, mom) — just like the free sequence
- Day 21 must have active/inactive variants (check `storage.getAgentUsage()`)
- Each email should have at least one deep-link CTA to the app (e.g., `https://app.metahers.ai/concierge?agent=nova&prompt=...`)
- Use the same HTML base template wrapper as the free sequence (line 827-836)
- BUT change the footer text from "You're receiving this because you joined MetaHers AI Starter Kit" to "You're receiving this as a MetaHers Studio member" or "...Private Advisory member"

### STEP 4: Update `processScheduledEmails()` Cron

**File: `server/routes.ts`** (around line 849)

Modify the cron to handle both sequence types:

```
Current logic (line 864):
  if (user.subscriptionTier && user.subscriptionTier !== 'free') {
    // Skip — user upgraded, stop free sequence
  }
```

New logic:
```typescript
// Determine sequence type from emailKey prefix
const isPaidSequence = scheduled.emailKey.startsWith('paid_');

if (!isPaidSequence) {
  // FREE sequence: skip if user upgraded (existing behavior)
  if (user.subscriptionTier && user.subscriptionTier !== 'free') {
    await storage.markEmailSent(scheduled.id, 'upgraded', null);
    continue;
  }
  // ... existing sendSequenceEmail() call
} else {
  // PAID sequence: skip if user downgraded back to free
  if (!user.subscriptionTier || user.subscriptionTier === 'free') {
    await storage.markEmailSent(scheduled.id, 'downgraded', null);
    continue;
  }
  // Determine tier from emailKey (paid_studio_day_X or paid_private_day_X)
  // OR from user.subscriptionTier
  const tier = user.subscriptionTier; // Use current tier
  // ... call sendPaidSequenceEmail()
}
```

### STEP 5: Update Stripe Webhook

**File: `server/routes.ts`** (around line 3814)

In the `customer.subscription.created` handler, AFTER the existing `sendMembershipEmails()` call (which stays — it's the immediate transactional welcome), ADD:

```typescript
// Schedule paid onboarding email sequence
storage.schedulePaidEmailSequence(userId, tier, new Date())
  .catch(err => console.error('[EmailSequence] Failed to schedule paid sequence:', err));

// Set flag for in-app welcome modal
storage.markPaidWelcomeShown(userId) // Actually we want to RESET it so it shows
  // Wait — we need the OPPOSITE. We need to set paidWelcomeShown = false
  // so the frontend knows to show the modal. But it defaults to false already.
  // So actually we don't need to do anything here IF the user is new.
  // But if they're re-subscribing, we might need to reset it.
```

Actually, simpler approach: the `paidWelcomeShown` field defaults to `false`. On upgrade, it's already false (for new upgraders). The frontend checks this flag and shows the modal. When the user dismisses the modal, it calls an API to set it to `true`.

For re-subscribers, add to the webhook: `storage.resetPaidWelcomeShown(userId)` which sets it back to `false`.

### STEP 6: API Endpoint for Paid Welcome

**File: `server/routes.ts`**

Add a new endpoint (near the existing `/api/auth/complete-onboarding`):

```typescript
app.post('/api/auth/complete-paid-welcome', requireAuth, async (req, res) => {
  await storage.markPaidWelcomeShown(req.user.id);
  res.json({ success: true });
});
```

Also update the `/api/auth/user` response to include `paidWelcomeShown` so the frontend can read it.

### STEP 7: In-App PaidWelcomeModal Component

**File: `client/src/components/PaidWelcomeModal.tsx`** (NEW FILE)

Create a new component similar to `WelcomeModal.tsx` but for paid users. Key differences:

**Props:** `onComplete: () => void`, `userName?: string`, `tier: 'signature_monthly' | 'private_monthly'`

**Studio version (3 steps):**
1. "You're in the Studio, {name}" — celebration with confetti/sparkle energy
2. Quick-start checklist: "Here's what to do first" — Concierge (daily access), AI Toolkit, Book your first Lab
3. "Your team is ready" — link to concierge, prompt library, Learning Hub

**Private Advisory version (3 steps):**
1. "Your Private Advisory is live, {name}" — more intimate, exclusive tone
2. Quick-start: Book your strategy review, Meet the concierge team (150/day), Explore private templates
3. "A personal note" — mention that Nadia's team will reach out within 24h, link to concierge

**Design notes:**
- Same modal pattern as `WelcomeModal.tsx` (AnimatePresence, Card, progress dots, Framer Motion)
- Studio: gold (#C9A96E) accents, same as current
- Private: consider using the darker palette to differentiate
- Use Crown icon for Studio, Key or Shield icon for Private
- CTA button: same style as existing ("Take me in" / "Let's go")

### STEP 8: Wire Up PaidWelcomeModal in Frontend

**File: `client/src/pages/HomePage.tsx`** (or wherever the workspace/dashboard lives)

Add logic to show PaidWelcomeModal:

```typescript
const [showPaidWelcome, setShowPaidWelcome] = useState(false);

useEffect(() => {
  if (user && user.isPro && !user.paidWelcomeShown) {
    setShowPaidWelcome(true);
  }
}, [user]);

const handleCompletePaidWelcome = async () => {
  try {
    await apiRequest('POST', '/api/auth/complete-paid-welcome', {});
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    setShowPaidWelcome(false);
  } catch (error) {
    console.error('Error completing paid welcome:', error);
    setShowPaidWelcome(false);
  }
};
```

In the JSX:
```tsx
{showPaidWelcome && user && (
  <PaidWelcomeModal
    onComplete={handleCompletePaidWelcome}
    userName={user.firstName || undefined}
    tier={user.subscriptionTier as 'signature_monthly' | 'private_monthly'}
  />
)}
```

**IMPORTANT:** The paid welcome modal should take priority over the free welcome modal. If both flags are set, show the paid one. Add: `if (user && !user.onboardingCompleted && !user.isPro)` for the free modal condition.

---

## CRITICAL THINGS TO GET RIGHT

1. **Don't break the free sequence.** The free onboarding emails must continue working exactly as they do. The paid sequence is additive.

2. **Duplicate prevention.** Both `scheduleEmailSequence` and `schedulePaidEmailSequence` must check for existing sequences before inserting. Use the emailKey prefix (`paid_` vs `day_`) to distinguish.

3. **Downgrade handling.** If a paid user cancels and goes back to free, the paid sequence should stop (mirror the free→paid skip logic, but reversed).

4. **Re-subscription.** If someone cancels and re-subscribes, they should get the paid sequence again. Reset `paidWelcomeShown` to false in the webhook.

5. **Email content quality.** The free sequence emails are beautifully written with Nadia's personal voice — warm, direct, no corporate speak, no fluff. The paid emails MUST match this tone. They should feel like messages from a founder who genuinely cares, not automated marketing.

6. **Persona consistency.** Every email needs builder/creative/mom variants. The persona is determined by the onboarding quiz (`storage.getOnboardingQuizResponse()`). If no quiz response, default to "builder".

7. **The goal label.** The free sequence uses `goalLabel` (from quiz response) for personalization. The paid sequence should too. Goal labels are defined in a `GOAL_LABELS` record in routes.ts.

8. **Deep-link CTAs.** Every email should have at least one button that deep-links into the app with a pre-filled prompt. Pattern: `https://app.metahers.ai/concierge?agent={agentId}&prompt={urlEncodedPrompt}`

9. **The `from` email.** Always use `resend.fromEmail` from `getUncachableResendClient()`. Never hardcode.

10. **Database migration.** The two new columns need ALTER TABLE statements. Add them in the migration file or directly as SQL. Both have defaults so they're non-breaking.

---

## FILE CHANGE SUMMARY

| File | Changes |
|------|---------|
| `shared/schema.ts` | Add `sequenceType` to scheduledEmails, add `paidWelcomeShown` to users |
| `server/storage.ts` | Add `schedulePaidEmailSequence()`, `markPaidWelcomeShown()`, `resetPaidWelcomeShown()` to interface + implementation |
| `server/routes.ts` | Add `sendPaidSequenceEmail()` with all 10 email templates × 3 personas × 2 tiers; Update `processScheduledEmails()` to handle both sequences; Add `/api/auth/complete-paid-welcome` endpoint; Update webhook to schedule paid sequence + reset paidWelcomeShown |
| `server/index.ts` | No changes needed (cron already calls processScheduledEmails) |
| `client/src/components/PaidWelcomeModal.tsx` | NEW FILE — modal component |
| `client/src/pages/HomePage.tsx` | Add PaidWelcomeModal trigger logic, update free modal condition |
| Migration SQL | ALTER TABLE for new columns |

---

## TESTING CHECKLIST

- [ ] Free signup still schedules 7-email free sequence
- [ ] Free sequence still stops when user upgrades
- [ ] Stripe webhook for `subscription.created` now schedules 10-email paid sequence
- [ ] Paid sequence emails send on correct days with correct tier content
- [ ] Paid sequence stops if user downgrades to free
- [ ] Day 21 paid email checks agent activity for active/inactive variant
- [ ] Each paid email has builder/creative/mom persona variants
- [ ] PaidWelcomeModal shows on first login after upgrade
- [ ] PaidWelcomeModal does NOT show again after dismissal
- [ ] PaidWelcomeModal shows correct content for Studio vs Private
- [ ] Free WelcomeModal still works for new free signups
- [ ] Re-subscription triggers new paid sequence + resets modal
- [ ] No duplicate sequences on re-subscription (check existing)
- [ ] All email CTAs deep-link correctly to app
- [ ] Nadia notification still sent on new paid subscription

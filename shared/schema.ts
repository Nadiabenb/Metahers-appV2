import { z } from "zod";
import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// ===== DRIZZLE DATABASE TABLES =====

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  isPro: boolean("is_pro").default(false).notNull(),
  subscriptionTier: varchar("subscription_tier").default("free").notNull(), // free, pro_monthly, pro_annual, vip_cohort, executive
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  quizUnlockedRitual: varchar("quiz_unlocked_ritual"), // Ritual unlocked via quiz
  quizCompletedAt: timestamp("quiz_completed_at"), // When they completed the quiz
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_reset_token").on(table.token),
  index("idx_reset_user").on(table.userId),
]);

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetTokenDB = typeof passwordResetTokens.$inferSelect;

// Ritual progress tracking table
export const ritualProgress = pgTable("ritual_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ritualSlug: varchar("ritual_slug").notNull(),
  completedSteps: jsonb("completed_steps").$type<number[]>().notNull().default(sql`'[]'::jsonb`),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_ritual_progress_user").on(table.userId),
  index("idx_ritual_progress_slug").on(table.ritualSlug),
]);

export const insertRitualProgressSchema = createInsertSchema(ritualProgress).omit({ id: true, createdAt: true });
export type InsertRitualProgress = z.infer<typeof insertRitualProgressSchema>;
export type RitualProgressDB = typeof ritualProgress.$inferSelect;

// Structured journal entry types
export type JournalTodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type JournalEvent = {
  id: string;
  time?: string;
  title: string;
  notes?: string;
};

export type StructuredJournalContent = {
  todos?: JournalTodoItem[];
  gratitude?: string[];
  reminders?: string[];
  highlights?: string;
  wins?: string[];
  events?: JournalEvent[];
  waterIntake?: number; // glasses of water
  fitnessGoals?: string;
  fitnessTracking?: string;
  freeformNotes?: string; // For any additional thoughts
};

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date").notNull().default(sql`to_char(now(), 'YYYY-MM-DD')`), // Journal date in YYYY-MM-DD format
  content: text("content").notNull(), // Legacy field - kept for backwards compatibility
  structuredContent: jsonb("structured_content").$type<StructuredJournalContent>(),
  mood: varchar("mood"),
  tags: jsonb("tags").$type<string[]>().default(sql`'[]'::jsonb`),
  wordCount: integer("word_count").default(0).notNull(),
  aiInsights: jsonb("ai_insights").$type<{ summary?: string; sentiment?: string; themes?: string[]; encouragement?: string }>(),
  aiPrompt: text("ai_prompt"),
  streak: integer("streak").default(0).notNull(),
  lastSaved: timestamp("last_saved").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_journal_user").on(table.userId),
  index("idx_journal_created").on(table.createdAt),
  index("idx_journal_user_date").on(table.userId, table.date),
]);

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true });
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntryDB = typeof journalEntries.$inferSelect;

// Subscriptions table (for Pro tier and one-time payments)
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: varchar("stripe_customer_id").unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"), // For one-time payments
  stripePriceId: varchar("stripe_price_id"),
  paymentType: varchar("payment_type").notNull().default("subscription"), // subscription, one_time
  tier: varchar("tier").notNull().default("pro_monthly"), // pro_monthly, pro_annual, vip_cohort, executive
  status: varchar("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_subscription_user").on(table.userId),
  index("idx_subscription_stripe_customer").on(table.stripeCustomerId),
]);

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type SubscriptionDB = typeof subscriptions.$inferSelect;

// Achievements table (for gamification)
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementKey: varchar("achievement_key").notNull(), // e.g., "first_entry", "streak_7", etc.
  unlockedAt: timestamp("unlocked_at").defaultNow(),
}, (table) => [
  index("idx_achievement_user").on(table.userId),
  index("idx_achievement_key").on(table.achievementKey),
]);

export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, unlockedAt: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type AchievementDB = typeof achievements.$inferSelect;

// Email leads table (for marketing/beta signups)
export const emailLeads = pgTable("email_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  source: varchar("source").default("email_capture_modal"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_email_leads_email").on(table.email),
  index("idx_email_leads_created").on(table.createdAt),
]);

export const insertEmailLeadSchema = createInsertSchema(emailLeads).omit({ id: true, createdAt: true });
export type InsertEmailLead = z.infer<typeof insertEmailLeadSchema>;
export type EmailLeadDB = typeof emailLeads.$inferSelect;

// Glow-Up Program profile table (onboarding data)
export const glowUpProfiles = pgTable("glow_up_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  name: varchar("name").notNull(),
  brandType: varchar("brand_type").notNull(), // "personal" or "business"
  niche: text("niche").notNull(),
  platform: varchar("platform").notNull(), // "IG", "TikTok", "LinkedIn", "X"
  goal: varchar("goal").notNull(), // "rebrand" or "new"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_glowup_profile_user").on(table.userId),
]);

export const insertGlowUpProfileSchema = createInsertSchema(glowUpProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGlowUpProfile = z.infer<typeof insertGlowUpProfileSchema>;
export type GlowUpProfileDB = typeof glowUpProfiles.$inferSelect;

// Glow-Up Program progress table (tracks completed days)
export const glowUpProgress = pgTable("glow_up_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  completedDays: jsonb("completed_days").$type<number[]>().notNull().default(sql`'[]'::jsonb`), // [1, 2, 3, ...]
  currentDay: integer("current_day").default(1).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
  index("idx_glowup_progress_user").on(table.userId),
]);

export const insertGlowUpProgressSchema = createInsertSchema(glowUpProgress).omit({ id: true, startedAt: true, lastUpdated: true });
export type InsertGlowUpProgress = z.infer<typeof insertGlowUpProgressSchema>;
export type GlowUpProgressDB = typeof glowUpProgress.$inferSelect;

// Glow-Up Program journal table (stores GPT responses and drafts)
export const glowUpJournal = pgTable("glow_up_journal", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  day: integer("day").notNull(), // 1-14
  gptResponse: text("gpt_response"),
  publicPostDraft: text("public_post_draft"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_glowup_journal_user").on(table.userId),
  index("idx_glowup_journal_day").on(table.day),
  index("idx_glowup_journal_user_day").on(table.userId, table.day),
]);

export const insertGlowUpJournalSchema = createInsertSchema(glowUpJournal).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGlowUpJournal = z.infer<typeof insertGlowUpJournalSchema>;
export type GlowUpJournalDB = typeof glowUpJournal.$inferSelect;

// Quiz submissions table (tracks "Discover Your Ritual" quiz results)
export const quizSubmissions = pgTable("quiz_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }), // Null if not logged in yet
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(), // { q1: "answer", q2: "answer", ... }
  matchedRitual: varchar("matched_ritual").notNull(), // The ritual slug that was matched
  claimed: boolean("claimed").default(false).notNull(), // Whether they signed up to claim it
  ritualCompleted: boolean("ritual_completed").default(false).notNull(), // Whether they completed the ritual
  oneOnOneBooked: boolean("one_on_one_booked").default(false).notNull(), // Manual update by admin
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_quiz_submission_user").on(table.userId),
  index("idx_quiz_submission_email").on(table.email),
  index("idx_quiz_submission_created").on(table.createdAt),
]);

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).omit({ id: true, createdAt: true });
export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;
export type QuizSubmissionDB = typeof quizSubmissions.$inferSelect;

// VIP Cohort capacity tracking table
export const cohortCapacity = pgTable("cohort_capacity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cohortName: varchar("cohort_name").notNull().unique(), // "vip_cohort" or "executive"
  totalSpots: integer("total_spots").notNull().default(10),
  takenSpots: integer("taken_spots").notNull().default(0),
  nextCohortDate: timestamp("next_cohort_date"),
  isActive: boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_cohort_capacity_name").on(table.cohortName),
]);

export const insertCohortCapacitySchema = createInsertSchema(cohortCapacity).omit({ id: true, updatedAt: true });
export type InsertCohortCapacity = z.infer<typeof insertCohortCapacitySchema>;
export type CohortCapacityDB = typeof cohortCapacity.$inferSelect;

// Thought Leadership Journey - Posts table
export const thoughtLeadershipPosts = pgTable("thought_leadership_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(), // 1-30
  topic: text("topic").notNull(), // AI-generated topic suggestion
  dailyStory: text("daily_story"), // User's daily achievement/story input
  contentLong: text("content_long").notNull(), // Substack/Medium format
  contentMedium: text("content_medium").notNull(), // LinkedIn format
  contentShort: text("content_short").notNull(), // Twitter/X format
  status: varchar("status").notNull().default("draft"), // "draft", "published_metahers", "published_external", "published_both"
  publishedToMetaHers: boolean("published_to_metahers").default(false).notNull(),
  publishedToExternal: boolean("published_to_external").default(false).notNull(),
  externalPlatforms: jsonb("external_platforms").$type<string[]>().default(sql`'[]'::jsonb`), // ["substack", "linkedin", "twitter"]
  isPublic: boolean("is_public").default(false).notNull(), // Public on MetaHers Insights
  slug: varchar("slug"), // URL slug for public posts
  viewCount: integer("view_count").default(0).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_tlp_user").on(table.userId),
  index("idx_tlp_day").on(table.dayNumber),
  index("idx_tlp_status").on(table.status),
  index("idx_tlp_public").on(table.isPublic),
  index("idx_tlp_slug").on(table.slug),
  index("idx_tlp_created").on(table.createdAt),
]);

export const insertThoughtLeadershipPostSchema = createInsertSchema(thoughtLeadershipPosts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertThoughtLeadershipPost = z.infer<typeof insertThoughtLeadershipPostSchema>;
export type ThoughtLeadershipPostDB = typeof thoughtLeadershipPosts.$inferSelect;

// Thought Leadership Journey - Progress tracking table
export const thoughtLeadershipProgress = pgTable("thought_leadership_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  
  // Brand Profile (Personal Storytelling)
  brandExpertise: text("brand_expertise"), // What's your expertise/zone of genius?
  brandNiche: text("brand_niche"), // What specific niche/industry?
  problemSolved: text("problem_solved"), // What problem do you solve for clients?
  uniqueStory: text("unique_story"), // Your unique journey/background story
  currentGoals: text("current_goals"), // Current projects/goals
  brandOnboardingCompleted: boolean("brand_onboarding_completed").default(false).notNull(),
  
  // Journey Progress
  currentDay: integer("current_day").default(1).notNull(), // 1-30
  completedDays: jsonb("completed_days").$type<number[]>().notNull().default(sql`'[]'::jsonb`), // [1, 2, 3, ...]
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  totalPostsGenerated: integer("total_posts_generated").default(0).notNull(),
  totalPostsPublished: integer("total_posts_published").default(0).notNull(),
  lastActivityDate: varchar("last_activity_date"), // YYYY-MM-DD format
  journeyStatus: varchar("journey_status").default("active").notNull(), // "active", "paused", "completed"
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_tlprog_user").on(table.userId),
  index("idx_tlprog_status").on(table.journeyStatus),
]);

export const insertThoughtLeadershipProgressSchema = createInsertSchema(thoughtLeadershipProgress).omit({ id: true, startedAt: true, updatedAt: true });
export type InsertThoughtLeadershipProgress = z.infer<typeof insertThoughtLeadershipProgressSchema>;
export type ThoughtLeadershipProgressDB = typeof thoughtLeadershipProgress.$inferSelect;

// ===== ZOD SCHEMAS (for frontend/client data) =====

// Structured step with rich content
export const ritualStepSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(["tool", "article", "video", "guide"]),
  })).optional(),
  proOnly: z.boolean().default(false),
});

export type RitualStep = z.infer<typeof ritualStepSchema>;

export const ritualSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tier: z.enum(["free", "pro"]),
  duration_min: z.number(),
  summary: z.string(),
  steps: z.array(ritualStepSchema),
});

export type Ritual = z.infer<typeof ritualSchema>;

export const shopProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["bag", "bundle"]),
  price: z.number(),
  scents: z.array(z.string()).optional(),
  description: z.string(),
  image: z.string(),
  stock: z.number().optional(),
  theme: z.string().optional(),
});

export type ShopProduct = z.infer<typeof shopProductSchema>;

export const blogArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  category: z.enum(["AI", "Web3", "Crypto", "NFT", "Metaverse", "Blockchain"]),
  author: z.string(),
  publishDate: z.string(),
  readTime: z.number(),
  featured: z.boolean(),
  image: z.string(),
  content: z.array(z.object({
    type: z.enum(["paragraph", "heading", "quote", "list"]),
    text: z.string(),
    items: z.array(z.string()).optional(),
  })),
});

export type BlogArticle = z.infer<typeof blogArticleSchema>;

export const ritualProgressSchema = z.object({
  slug: z.string(),
  completedSteps: z.array(z.number()),
  lastUpdated: z.string(),
});

export type RitualProgress = z.infer<typeof ritualProgressSchema>;

export const journalEntrySchema = z.object({
  content: z.string(),
  mood: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  wordCount: z.number().optional(),
  aiInsights: z.object({
    summary: z.string().optional(),
    sentiment: z.string().optional(),
    themes: z.array(z.string()).optional(),
    encouragement: z.string().optional(),
  }).optional().nullable(),
  aiPrompt: z.string().optional().nullable(),
  streak: z.number().default(0),
  lastSaved: z.string(),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

// ===== STATIC DATA =====

export const rituals: Ritual[] = [
  {
    slug: "ai-glow-up-facial",
    title: "AI Glow-Up Facial",
    tier: "free",
    duration_min: 60,
    summary: "Prompting, daily automations, 1 task off your plate.",
    steps: [
      {
        id: 1,
        title: "Cleanse Your Intent",
        summary: "Set your mindful foundation for AI exploration",
        content: "Begin by creating sacred space—light a candle, take three deep breaths, and set an intention for this ritual. Ask yourself: What repetitive task drains my energy most? What would I do with 5 extra hours per week? Write this down. This isn't just about learning AI—it's about reclaiming your time and energy for what truly matters to you.",
        proOnly: false,
      },
      {
        id: 2,
        title: "AI Prompting 101",
        summary: "Master the art of communicating with AI",
        content: "Think of AI prompting like giving instructions to your most brilliant assistant. Instead of vague requests ('write an email'), try specific, context-rich prompts ('write a warm, professional email to a potential client introducing our wellness retreat, using a Forbes-meets-Vogue tone'). Practice the 3-part prompt formula: Context + Task + Style. Example: 'I'm a wellness coach (context) creating Instagram captions (task) that feel luxurious yet approachable (style).' Spend 15 minutes experimenting with ChatGPT or Claude using this framework.",
        resources: [
          { title: "ChatGPT", url: "https://chat.openai.com", type: "tool" },
          { title: "Claude AI", url: "https://claude.ai", type: "tool" },
        ],
        proOnly: false,
      },
      {
        id: 3,
        title: "Automate One Task",
        summary: "Transform theory into tangible time savings",
        content: "Choose ONE repetitive weekly task and automate it using AI. Popular options: email drafting (use ChatGPT to create templates), social media scheduling (Claude for caption writing), meeting prep (AI-generated agendas), or research summaries (paste articles, request key takeaways). Create a saved prompt you can reuse. The goal isn't perfection—it's progress. Even automating 30 minutes per week compounds to 26 hours per year.",
        resources: [
          { title: "Zapier AI", url: "https://zapier.com/ai", type: "tool" },
          { title: "Notion AI", url: "https://www.notion.so/product/ai", type: "tool" },
        ],
        proOnly: true,
      },
      {
        id: 4,
        title: "Reflect & Journal",
        summary: "Integrate your insights and celebrate progress",
        content: "Take 10 minutes to journal your experience. What surprised you about AI? What felt natural vs. challenging? What task did you automate, and how will this shift your daily routine? Most importantly: what will you do with your reclaimed time? This reflection anchors the learning and helps you track your evolution from AI-curious to AI-fluent.",
        proOnly: true,
      },
      {
        id: 5,
        title: "Set Your Weekly Trigger",
        summary: "Build sustainable AI habits through ritual",
        content: "Sustainability comes from systems. Choose a weekly 'AI ritual moment'—every Monday morning with coffee, every Friday afternoon planning next week, etc. Set a calendar reminder. Use this time to refine your prompts, explore new AI tools, or document what's working. Treat it like a spa appointment with yourself—non-negotiable, restorative, transformative. Your future self will thank you.",
        proOnly: true,
      }
    ]
  },
  {
    slug: "blockchain-detox-ritual",
    title: "Blockchain Detox Ritual",
    tier: "pro",
    duration_min: 60,
    summary: "Wallet setup, self-custody, safety.",
    steps: [
      {
        id: 1,
        title: "Visualize Decentralized Trust",
        summary: "Understand the philosophy before the technology",
        content: "Close your eyes and imagine a world where you don't need banks, intermediaries, or institutions to verify trust. Blockchain is a shared, transparent ledger that everyone can see but no single entity controls. Think of it like a group diary where everyone has a copy—if someone tries to change a page, everyone notices because their copies don't match. This is the foundation of Web3: trust through transparency, not through authority. Take 5 minutes to sit with this concept. How would your financial life change if you were your own bank?",
        proOnly: false,
      },
      {
        id: 2,
        title: "Create Your First Wallet",
        summary: "Set up your digital vault for crypto assets",
        content: "Download MetaMask (browser extension or mobile app). This is your 'hot wallet'—think everyday purse, not life savings vault. During setup, you'll receive a 12-word 'seed phrase.' This is EVERYTHING—whoever has these words controls your wallet. Write them down by hand on paper (never screenshot, never email). Store this paper somewhere fireproof and private. Create a strong password. Congratulations—you now have a self-custody wallet. You are your own bank.",
        resources: [
          { title: "MetaMask", url: "https://metamask.io", type: "tool" },
          { title: "Wallet Security Guide", url: "https://ethereum.org/en/wallets/", type: "guide" },
        ],
        proOnly: false,
      },
      {
        id: 3,
        title: "Self-Custody Essentials",
        summary: "Master the responsibility of being your own bank",
        content: "Self-custody means freedom—and responsibility. Your wallet has a public address (like your email—safe to share) and a private key (like your password—never share). No bank will help if you lose your seed phrase. No customer service can reverse transactions. This sounds scary, but it's empowering. Practice these safety rules: (1) Never share your seed phrase, (2) Double-check addresses before sending, (3) Start with small amounts, (4) Beware of phishing (MetaMask will never DM you), (5) For large holdings, upgrade to a hardware wallet (Ledger/Trezor).",
        resources: [
          { title: "Ledger Hardware Wallet", url: "https://www.ledger.com", type: "tool" },
        ],
        proOnly: true,
      },
      {
        id: 4,
        title: "Practice Transfer on Testnet",
        summary: "Learn without risk using practice networks",
        content: "Before using real money, practice on a testnet—a fake version of Ethereum where you can experiment safely. Switch your MetaMask to 'Sepolia Testnet' (Settings → Networks). Get free test ETH from a faucet (Google 'Sepolia faucet'). Practice sending test ETH to a friend or between two wallets you control. This builds muscle memory for: copying addresses correctly, paying gas fees, and confirming transactions. Mistakes here cost nothing. Mistakes on mainnet cost real money.",
        resources: [
          { title: "Sepolia Faucet", url: "https://sepoliafaucet.com", type: "tool" },
        ],
        proOnly: true,
      },
      {
        id: 5,
        title: "Journal Your Blockchain Journey",
        summary: "Document insights and next steps",
        content: "Reflect on what you learned. How does it feel to control your own wallet? What fears came up, and how did you navigate them? What questions remain? Write down your 'why'—why are you learning blockchain? Financial sovereignty? Career skills? Curiosity? This 'why' will guide your next steps. Celebrate this milestone: you now understand more about blockchain than 99% of the population.",
        proOnly: true,
      }
    ]
  },
  {
    slug: "crypto-confidence-bath",
    title: "Crypto Confidence Bath",
    tier: "pro",
    duration_min: 75,
    summary: "BTC/ETH/stablecoins in plain language.",
    steps: [
      {
        id: 1,
        title: "Prepare Your Tea Ritual",
        summary: "Ground yourself before exploring digital currency",
        content: "Brew your favorite tea. This ritual is about demystifying cryptocurrency, not rushing through jargon. As you steep your tea, set an intention: you're not here to become a day trader—you're here to understand the future of money. Crypto isn't just about getting rich; it's about financial access, innovation, and alternatives to traditional banking. Approach this with curiosity, not FOMO.",
        proOnly: false,
      },
      {
        id: 2,
        title: "Bitcoin & Ethereum Fundamentals",
        summary: "Understand the two pillars of crypto",
        content: "Bitcoin (BTC) is digital gold—limited supply (21 million coins), designed as a store of value and hedge against inflation. Think: digital scarcity. Ethereum (ETH) is a programmable blockchain—not just currency, but a platform for apps, contracts, NFTs, and DeFi. Think: digital infrastructure. BTC is 'save and hold.' ETH is 'build and create.' Both are volatile, both are revolutionary. Neither requires you to understand all the technical details—just like you can drive a car without being a mechanic.",
        resources: [
          { title: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf", type: "article" },
          { title: "Ethereum Explained", url: "https://ethereum.org/en/what-is-ethereum/", type: "guide" },
        ],
        proOnly: false,
      },
      {
        id: 3,
        title: "Stablecoins Decoded",
        summary: "The bridge between traditional money and crypto",
        content: "Stablecoins are cryptocurrencies pegged to real-world assets (usually $1 USD). Popular ones: USDC, USDT, DAI. They solve crypto's volatility problem—you can send money globally in minutes with minimal fees, without worrying about price swings. Use cases: international payments (faster/cheaper than banks), earning yield (higher interest than savings accounts), and stability while staying in crypto. Think of stablecoins as the calm, reliable friend in the chaotic crypto party.",
        resources: [
          { title: "Circle USDC", url: "https://www.circle.com/en/usdc", type: "guide" },
        ],
        proOnly: true,
      },
      {
        id: 4,
        title: "Real-World Use Cases",
        summary: "How crypto solves actual problems",
        content: "Crypto isn't just speculation—it's solving real problems. (1) Financial inclusion: 1.7 billion people lack bank access but have phones. (2) Cross-border payments: Send money internationally in minutes vs. days. (3) Creator economy: Artists receive royalties automatically via smart contracts. (4) Inflation protection: In countries with unstable currencies, crypto offers stability. (5) Ownership: Your crypto is yours—no bank can freeze it. Understanding these use cases transforms crypto from 'internet money' to 'financial revolution.'",
        proOnly: true,
      },
      {
        id: 5,
        title: "Reflection Journal",
        summary: "Process and integrate your learning",
        content: "Take 15 minutes to journal. Which cryptocurrency resonates with you most—BTC's scarcity, ETH's programmability, or stablecoin practicality? Can you imagine using crypto in your life? What questions remain? What feels exciting vs. overwhelming? Remember: you don't need to invest to understand crypto. Knowledge is the first investment. The goal today wasn't to buy—it was to build confidence through clarity.",
        proOnly: true,
      }
    ]
  },
  {
    slug: "nft-radiance-wrap",
    title: "NFT Radiance Wrap",
    tier: "pro",
    duration_min: 90,
    summary: "Design and mint a first NFT (testnet).",
    steps: [
      {
        id: 1,
        title: "Find Your Creative Inspiration",
        summary: "Connect with what you want to create",
        content: "NFTs are digital ownership certificates—art, music, writing, photography, anything unique. Before creating, ask: What story do I want to tell? What visual represents my brand or emotion right now? Browse NFT galleries (OpenSea, Foundation, Objkt) not to copy, but to spark inspiration. Notice what resonates. This isn't about technical perfection—it's about authentic expression. Your first NFT is a milestone, not a masterpiece. Give yourself permission to experiment.",
        resources: [
          { title: "OpenSea Gallery", url: "https://opensea.io/explore-collections", type: "guide" },
          { title: "Foundation", url: "https://foundation.app", type: "tool" },
        ],
        proOnly: false,
      },
      {
        id: 2,
        title: "Generate Art with AI Prompting",
        summary: "Use AI to bring your vision to life",
        content: "Use AI art tools to create your NFT image. Try Midjourney (Discord-based, $10/month), DALL-E (via ChatGPT Plus), or free alternatives like Playground AI. Apply your AI prompting skills: be specific about style, mood, colors, and composition. Example prompt: 'ethereal portrait of a woman surrounded by digital butterflies, neon purple and gold, cyberpunk aesthetic, high fashion photography style.' Generate several variations. Choose the one that resonates. Remember: AI is your collaborator, not your replacement. You're still the creative director.",
        resources: [
          { title: "Midjourney", url: "https://www.midjourney.com", type: "tool" },
          { title: "Playground AI", url: "https://playgroundai.com", type: "tool" },
        ],
        proOnly: false,
      },
      {
        id: 3,
        title: "Mint Your NFT on Testnet",
        summary: "Practice minting risk-free before going live",
        content: "Use OpenSea's testnet (testnets.opensea.io) to mint your first NFT for FREE. Switch MetaMask to Sepolia testnet. Upload your image, add a title and description. Understand gas fees (transaction costs)—on testnet they're fake, on mainnet they're real. Click 'Create' and sign the transaction. Congratulations—you just minted an NFT! The blockchain now has an immutable record that this digital creation belongs to you. Feel the power of that. When you're ready, repeat this process on mainnet (real Ethereum) for your official debut.",
        resources: [
          { title: "OpenSea Testnet", url: "https://testnets.opensea.io", type: "tool" },
        ],
        proOnly: true,
      },
      {
        id: 4,
        title: "Draft Your Listing Story",
        summary: "Craft compelling context for your creation",
        content: "NFTs with stories sell better than NFTs without. Write a description for your piece: What inspired it? What does it represent? What journey led you here? People don't just buy art—they buy meaning. Your first NFT isn't just pixels; it's proof you're a creator in the digital age. Even if you never list it for sale, writing this description clarifies your creative intention and builds skills for future drops. Practice pricing psychology: if you were to sell this, what feels aligned—accessible or exclusive?",
        proOnly: true,
      },
      {
        id: 5,
        title: "Share Your Story",
        summary: "Celebrate your creator milestone",
        content: "Screenshot your minted NFT. Share it—on social media, in your journal, with friends. Caption it with your journey: 'I just minted my first NFT.' Tag communities (#WomeninNFTs, #NFTCommunity). This isn't bragging; it's claiming your place in the creator economy. Reflect: How does it feel to own a piece of the blockchain? What creative possibilities excite you? Whether you mint 100 more NFTs or just this one, you've crossed a threshold. You're no longer just consuming digital culture—you're creating it.",
        proOnly: true,
      }
    ]
  },
  {
    slug: "metaverse-meditation",
    title: "Metaverse Meditation",
    tier: "pro",
    duration_min: 90,
    summary: "Avatar, space, brand presence.",
    steps: [
      {
        id: 1,
        title: "Visualize Your Digital Presence",
        summary: "Imagine your ideal virtual identity and space",
        content: "Close your eyes. Imagine a space that's entirely yours—designed to your exact vision, where geography doesn't exist and your community can gather instantly. What does it look like? A serene virtual garden? A neon-lit gallery? A futuristic conference room? The metaverse is your blank canvas. Before diving into technology, get clear on intention: Why do you want a presence here? Networking? Education? Community? Commerce? Your 'why' shapes your 'how.' Spend 10 minutes journaling your metaverse vision.",
        proOnly: false,
      },
      {
        id: 2,
        title: "Create Your Avatar Identity",
        summary: "Design your digital self-expression",
        content: "Your avatar is your metaverse identity—choose wisely and have fun. Explore avatar creation in platforms like Ready Player Me (cross-platform avatar), Spatial (professional), or Horizon Worlds (social). Decide: realistic representation of you, or creative fantasy version? There's no wrong answer. Some women choose aspirational avatars (how they want to be perceived), others choose fantastical (expressing hidden parts of themselves). Customize everything: appearance, style, accessories. This is identity play—liberating and empowering. Your avatar is YOU in digital spaces.",
        resources: [
          { title: "Ready Player Me", url: "https://readyplayer.me", type: "tool" },
          { title: "Spatial", url: "https://spatial.io", type: "tool" },
        ],
        proOnly: false,
      },
      {
        id: 3,
        title: "Design Your Virtual Space",
        summary: "Build your metaverse home or business",
        content: "Start simple: claim free space in Spatial or Decentraland. Upload images, add interactive elements, set the mood with lighting and music. Think of this like decorating a room—but with infinite possibilities and zero physical constraints. Use your space for: (1) Portfolio/gallery, (2) Meeting room for clients, (3) Event venue, (4) Private sanctuary. Many platforms offer templates—customize them to match your brand aesthetic. Luxury spa vibe? Neon cyberpunk? Minimalist modern? Your space should feel like YOU.",
        resources: [
          { title: "Decentraland", url: "https://decentraland.org", type: "tool" },
          { title: "Spatial Creator", url: "https://spatial.io/create", type: "guide" },
        ],
        proOnly: true,
      },
      {
        id: 4,
        title: "Craft Your Brand Ritual",
        summary: "Define how you'll show up in virtual worlds",
        content: "Just like you have rituals IRL (morning routine, client process, content schedule), create metaverse rituals. Examples: Host monthly virtual gatherings in your space, Create wearable NFTs for your avatar that reflect your brand, Join metaverse networking events every Friday, Build a virtual vision board you update quarterly. Consistency builds presence. Decide on ONE recurring metaverse ritual you'll commit to. Start small—even 30 minutes monthly in virtual spaces builds fluency. The metaverse rewards those who show up consistently, not perfectly.",
        proOnly: true,
      },
      {
        id: 5,
        title: "Integration Journal",
        summary: "Reflect on your metaverse journey",
        content: "Reflect deeply: How did it feel to create a virtual identity? What surprised you about the metaverse? Does your avatar feel like an extension of you, or a different version entirely? Where do you see yourself using virtual spaces in 6 months? 1 year? What opportunities excite you (events, networking, commerce, community)? What challenges remain (learning curve, time investment, tech barriers)? The metaverse isn't for everyone—but understanding it is essential for anyone building in the digital age. You now have the foundation.",
        proOnly: true,
      }
    ]
  }
];

export const shopProducts: ShopProduct[] = [
  {
    id: "sheikha-bag",
    name: "The Sheikha Bag",
    type: "bag",
    price: 199,
    scents: ["Oud", "Musk", "Amber"],
    description: "Powerful. Royal. Sensual. Handcrafted for the woman who commands attention. 6 handmade products + AI-guided ritual experience + reusable jute bag. Scan QR to unlock your mystery ritual.",
    image: "sheikha",
    stock: 6,
    theme: "Powerful, royal, sensual"
  },
  {
    id: "serenity-bag",
    name: "The Serenity Bag",
    type: "bag",
    price: 199,
    scents: ["Lavender", "Eucalyptus", "Lotus"],
    description: "Grounding. Calming. Fresh. Handcrafted for the woman seeking peace. 6 handmade products + AI-guided ritual experience + reusable jute bag. Scan QR to unlock your mystery ritual.",
    image: "serenity",
    stock: 6,
    theme: "Grounding, calming, fresh"
  },
  {
    id: "floral-bag",
    name: "The Floral Bag",
    type: "bag",
    price: 199,
    scents: ["White Rose", "Red Rose", "Jasmine"],
    description: "Romantic. Feminine. Soft. Handcrafted for the woman who embodies grace. 6 handmade products + AI-guided ritual experience + reusable jute bag. Scan QR to unlock your mystery ritual.",
    image: "floral",
    stock: 6,
    theme: "Romantic, feminine, soft"
  },
  {
    id: "trio-bundle",
    name: "Complete Drop 001",
    type: "bundle",
    price: 499,
    scents: [],
    description: "All three limited edition Ritual Bags. 18 handcrafted products. 3 AI ritual unlocks. The complete MetaHers Mind Spa experience.",
    image: "bundle",
    stock: 6,
    theme: "The complete collection"
  }
];

export const blogArticles: BlogArticle[] = [
  {
    slug: "ai-agents-women-workforce",
    title: "AI Agents: Your Digital Dream Team Is Here",
    subtitle: "What autonomous AI agents mean for women building businesses and careers in 2025",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-24",
    readTime: 6,
    featured: false,
    image: "ai-agents",
    content: [
      { type: "paragraph", text: "Imagine having a team of brilliant assistants who never sleep, never complain, and work 24/7 on your behalf. Not chatbots you have to prompt—actual autonomous agents making decisions, taking actions, and solving problems while you focus on what only you can do. That's the AI agent revolution happening right now." },
      { type: "paragraph", text: "AI agents are the next evolution beyond tools like ChatGPT. Instead of waiting for your instructions, they operate independently with goals you set. Think of them as the difference between a calculator (you input everything) and a financial advisor (they analyze, strategize, and execute on your behalf)." },
      { type: "heading", text: "What Makes AI Agents Different?" },
      { type: "paragraph", text: "Traditional AI tools are reactive—you ask, they answer. AI agents are proactive—they observe, plan, and act. They can manage your calendar, negotiate contracts, monitor markets, coordinate teams, and handle complex workflows without constant supervision." },
      { type: "paragraph", text: "It's like upgrading from a personal assistant who needs detailed instructions to a chief of staff who understands your vision and makes it happen." },
      { type: "heading", text: "Real-World Applications for Women Leaders" },
      { type: "list", text: "AI agents are already transforming how we work:", items: [
        "Business operations: Agents that manage invoicing, client communications, and project timelines",
        "Research and analysis: Agents that monitor industry trends and compile actionable insights",
        "Content creation: Agents that draft, edit, and schedule marketing across platforms",
        "Customer service: Agents that handle inquiries with empathy and escalate when needed",
        "Personal productivity: Agents that prioritize your tasks based on goals and deadlines"
      ]},
      { type: "paragraph", text: "The women who will dominate the next decade aren't the ones working harder—they're the ones leveraging AI agents to multiply their impact. One founder with the right agents can accomplish what used to require a team of ten." },
      { type: "heading", text: "The Empowerment Angle (And Why This Matters)" },
      { type: "paragraph", text: "For too long, women have been told to 'lean in' and work ourselves to exhaustion. AI agents flip that script. They handle the repetitive, time-consuming tasks that drain our energy, freeing us to focus on strategy, creativity, and leadership—the work that actually moves the needle." },
      { type: "paragraph", text: "This is especially powerful for women balancing multiple roles. AI agents don't care if it's 2 AM or if you're on maternity leave—they keep your business running smoothly while you're unavailable." },
      { type: "heading", text: "Getting Started: Your First AI Agent" },
      { type: "paragraph", text: "Start simple. Identify one repetitive workflow that drains your time—maybe email management, social media scheduling, or data entry. Then explore AI agent platforms like Zapier Central, Relay, or Microsoft Copilot to automate it." },
      { type: "paragraph", text: "You don't need to be technical. The best agent platforms are designed for business owners, not engineers. If you can describe what you want in plain language, you can deploy an AI agent." },
      { type: "quote", text: "AI agents aren't replacing women in the workforce—they're amplifying us. The question isn't whether to use them, but how strategically you'll deploy them to build the life and career you actually want." }
    ]
  },
  {
    slug: "drop-001-ritual-bags-unveiled",
    title: "Drop 001: When Luxury Self-Care Meets AI Mystery",
    subtitle: "Inside MetaHers' limited edition handmade ritual bags that unlock exclusive AI experiences",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-24",
    readTime: 5,
    featured: false,
    image: "ritual-bags",
    content: [
      { type: "paragraph", text: "There are exactly 18 ritual bags in existence. Each one handmade. Each one hiding a secret. Each one designed to merge the ancient art of self-care rituals with cutting-edge AI technology. Welcome to MetaHers Drop 001." },
      { type: "paragraph", text: "This isn't your typical luxury beauty box. These bags are intentional, soul-led wellness kits that bridge the physical and digital worlds in a way you've never experienced before." },
      { type: "heading", text: "What's Inside: Six Handcrafted Treasures" },
      { type: "paragraph", text: "Every bag contains six artisan products, each handmade with intention: a Mystery Reveal Ritual Candle that unveils a secret symbol, botanical bath tea for grounding, handmade loofah soap, whipped body butter, body and hair mist, and a perfume oil roll-on. Plus a reusable jute bag that's beautiful enough to carry everywhere." },
      { type: "paragraph", text: "But here's where it gets interesting: hidden inside each bag is a QR code that unlocks one of five exclusive AI-powered ritual experiences. You won't know which one until you scan it." },
      { type: "heading", text: "The AI Mystery: Five Possible Unlocks" },
      { type: "list", text: "Your bag might unlock:", items: [
        "Daily Glow AI: Personalized journaling prompts and vision board creation",
        "Cosmic Birth Chart: Custom GPT-powered astrology reading tailored to you",
        "Affirmation Sequences: AI-generated affirmations in your unique voice and tone",
        "Crown Unlock: Full access to the MetaHers AI Squad plus 1:1 time with the founder",
        "VIP Circle Access: Entry into the exclusive MetaHers community"
      ]},
      { type: "paragraph", text: "The mystery is part of the ritual. You're not just buying products—you're embarking on a journey of self-discovery guided by both ancient wisdom and future technology." },
      { type: "heading", text: "Why Handmade Matters in a Digital Age" },
      { type: "paragraph", text: "In a world of mass production and instant everything, handmade items carry energy. Someone spent hours crafting each candle, mixing each body butter, selecting each botanical. That intention transfers to you." },
      { type: "paragraph", text: "The MetaHers philosophy has always been about merging the best of both worlds: the grounding, sensory experience of physical rituals with the limitless possibilities of AI and Web3. Drop 001 is that philosophy made tangible." },
      { type: "heading", text: "Three Aesthetics, One Mission" },
      { type: "paragraph", text: "Choose your vibe: The Sheikha Bag (bold, powerful, regal with oud, musk, and amber), The Serenity Bag (calm, peaceful, grounded with lavender, chamomile, and eucalyptus), or The Floral Bag (romantic, feminine, soft with white rose, red rose, and jasmine)." },
      { type: "paragraph", text: "Each purchase includes instant MetaHers Pro membership—full access to all AI rituals, the advanced journal, and the complete learning library. You're not just buying a bag; you're joining a movement of women claiming both their wellness and their digital power." },
      { type: "heading", text: "Limited by Design" },
      { type: "paragraph", text: "Only 18 bags exist: 6 Sheikha, 6 Serenity, 6 Floral. When they're gone, they're gone. This is intentional scarcity—not artificial FOMO, but a commitment to quality, craft, and exclusivity." },
      { type: "paragraph", text: "The women who claim Drop 001 aren't just early adopters. They're founding members of a new paradigm where luxury wellness and AI innovation don't just coexist—they enhance each other." },
      { type: "quote", text: "In a world racing toward the future, the most revolutionary act is to slow down, create intentional rituals, and then use AI to amplify them. That's Drop 001." }
    ]
  },
  {
    slug: "ai-your-personal-stylist",
    title: "Think of AI as Your Personal Stylist—But for Everything",
    subtitle: "How generative AI is becoming the ultimate creative partner for modern women",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-19",
    readTime: 5,
    featured: true,
    image: "ai-stylist",
    content: [
      { type: "paragraph", text: "Remember the last time you had a personal stylist? Someone who just got you, understood your vibe, and could pull together the perfect look in minutes? Now imagine that same energy, but for your entire creative and professional life. That's generative AI in 2025." },
      { type: "paragraph", text: "Whether you're drafting emails, designing presentations, or brainstorming your next big idea, AI tools like ChatGPT, Claude, and Midjourney are like having a brilliant assistant who never sleeps, never judges, and always has fresh ideas." },
      { type: "heading", text: "The Secret Sauce: Prompting" },
      { type: "paragraph", text: "Here's the thing most people miss: AI is only as good as your conversation with it. Think of prompting like explaining your vision to a makeup artist—the more specific you are ('dewy skin, bold lip, soft eye') the better the result." },
      { type: "paragraph", text: "Instead of asking 'write me an email,' try 'write a warm but professional email to a potential client, introducing our new wellness retreat with a Forbes-meets-Vogue tone.' See the difference? Specificity is your superpower." },
      { type: "heading", text: "Your First AI Ritual" },
      { type: "list", text: "Start small and build from there:", items: [
        "Choose one repetitive task (scheduling, email responses, content creation)",
        "Spend 10 minutes crafting the perfect prompt",
        "Save your best prompts like recipes—you'll use them again",
        "Iterate and refine based on results"
      ]},
      { type: "paragraph", text: "The women who will thrive in this new era aren't the ones who resist AI—they're the ones who treat it like the powerful tool it is, using it to amplify their unique voice and vision, not replace it." },
      { type: "quote", text: "AI doesn't replace your creativity—it multiplies it. You're still the visionary; AI is just your incredibly efficient assistant." }
    ]
  },
  {
    slug: "crypto-wallet-closet-metaphor",
    title: "Your Crypto Wallet is Like a Designer Closet for Digital Assets",
    subtitle: "Understanding digital wallets without the tech jargon",
    category: "Crypto",
    author: "MetaHers Editorial",
    publishDate: "2025-10-18",
    readTime: 6,
    featured: true,
    image: "crypto-wallet",
    content: [
      { type: "paragraph", text: "Let's talk about crypto wallets the way we'd talk about organizing your closet. Because honestly? The concept is remarkably similar—and way less intimidating than the tech bros make it sound." },
      { type: "paragraph", text: "A crypto wallet is your personal vault for digital assets. Just like your closet holds your designer bags, vintage finds, and everyday essentials, your crypto wallet holds your Bitcoin, Ethereum, NFTs, and other digital treasures." },
      { type: "heading", text: "Hot Wallet vs. Cold Wallet: The Everyday Bag vs. The Safe" },
      { type: "paragraph", text: "Think of a hot wallet (like MetaMask or Coinbase Wallet) as your everyday bag—always accessible, perfect for daily transactions, but you wouldn't keep your entire life savings in it. It's connected to the internet, which makes it convenient but slightly more vulnerable." },
      { type: "paragraph", text: "A cold wallet (like Ledger or Trezor) is your home safe—offline, ultra-secure, perfect for storing significant value. You wouldn't carry it around, but you know your most precious items are protected." },
      { type: "heading", text: "Self-Custody: You Hold The Keys" },
      { type: "paragraph", text: "Here's where crypto gets revolutionary: self-custody means YOU control your assets. No bank. No middleman. You have the keys (literally, a 12-24 word phrase) that unlock your digital vault." },
      { type: "paragraph", text: "It's like having the only key to a safety deposit box. Empowering? Absolutely. Responsibility? Also absolutely. This is why writing down your seed phrase and storing it securely is non-negotiable—lose it, and even you can't access your assets." },
      { type: "heading", text: "Getting Started: Your First Wallet" },
      { type: "list", text: "Here's your simple action plan:", items: [
        "Download MetaMask (it's free and beginner-friendly)",
        "Create your wallet and write down your seed phrase BY HAND",
        "Store that phrase somewhere fire-proof and private (not on your computer!)",
        "Start with small amounts while you learn",
        "Practice sending and receiving on a testnet first"
      ]},
      { type: "quote", text: "Your wallet, your keys, your future. Financial independence looks different for everyone—crypto is one powerful path to explore." }
    ]
  },
  {
    slug: "nfts-digital-art-gallery",
    title: "NFTs Are Your Personal Digital Art Gallery—Here's Why That Matters",
    subtitle: "Moving beyond the hype to understand real ownership in the digital age",
    category: "NFT",
    author: "MetaHers Editorial",
    publishDate: "2025-10-17",
    readTime: 7,
    featured: false,
    image: "nft-gallery",
    content: [
      { type: "paragraph", text: "Forget the monkey jpegs drama. Let's talk about what NFTs actually are—and why they represent something profound for women building digital legacies." },
      { type: "paragraph", text: "An NFT (Non-Fungible Token) is proof of ownership for a unique digital item. Think of it as a certificate of authenticity for digital art, music, writing, or collectibles. It's blockchain technology saying 'this specific piece belongs to you.'" },
      { type: "heading", text: "Why This Changes Everything for Creators" },
      { type: "paragraph", text: "For generations, artists—especially women artists—have struggled with attribution and compensation. Their work gets shared, screenshot, and reproduced without credit or payment." },
      { type: "paragraph", text: "NFTs flip this script. When you create an NFT, you can program royalties directly into it—meaning every time your work is resold, you automatically receive a percentage. It's like getting a commission every time someone resells a painting you created, in perpetuity." },
      { type: "heading", text: "Real-World Applications Beyond Art" },
      { type: "list", text: "NFT technology is powering:", items: [
        "Event tickets (no more scalping, transferrable with proof)",
        "Digital fashion (dress your avatar in exclusive designer pieces)",
        "Membership passes (think exclusive communities with provable access)",
        "Certifications and credentials (immutable proof of your achievements)",
        "Music and royalties (artists keeping control of their work)"
      ]},
      { type: "paragraph", text: "The most exciting part? Women are leading innovation in this space. From digital fashion designers creating virtual couture to artists building supportive NFT communities, we're shaping this technology's future." },
      { type: "heading", text: "Start Exploring (No Investment Needed)" },
      { type: "paragraph", text: "You don't need to spend thousands to understand NFTs. Browse galleries like Foundation, Objkt, or OpenSea. Follow women NFT artists on Twitter. Join Discord communities. The education is free and invaluable." },
      { type: "quote", text: "NFTs aren't just about owning digital art—they're about creators finally controlling their narrative and their income." }
    ]
  },
  {
    slug: "metaverse-second-home",
    title: "The Metaverse: Your Second Home in the Digital Universe",
    subtitle: "Why virtual spaces are becoming the new frontier for community and commerce",
    category: "Metaverse",
    author: "MetaHers Editorial",
    publishDate: "2025-10-16",
    readTime: 6,
    featured: false,
    image: "metaverse-home",
    content: [
      { type: "paragraph", text: "Close your eyes and imagine: a space that's entirely yours, designed exactly to your vision, where distance doesn't exist and your community can gather instantly. Welcome to the metaverse." },
      { type: "paragraph", text: "The metaverse isn't one single place—it's a collection of interconnected virtual worlds where you can work, play, create, and connect. Think of it as the internet evolved from 2D screens to 3D immersive experiences." },
      { type: "heading", text: "Why Women Entrepreneurs Are Taking Notice" },
      { type: "paragraph", text: "Smart businesswomen are already staking claims in virtual real estate. Why? Because the metaverse removes traditional barriers to entry." },
      { type: "paragraph", text: "Want to host a global conference? No venue rental, no travel costs, no geographic limitations. Want to open a boutique showcasing your designs? No lease, no overhead, infinite inventory possibilities. Want to teach a wellness class to 1,000 people simultaneously? Simple." },
      { type: "heading", text: "Popular Metaverse Platforms Right Now" },
      { type: "list", text: "Each offers unique opportunities:", items: [
        "Decentraland: Own virtual land, build experiences, host events",
        "The Sandbox: Create games and interactive spaces",
        "Spatial: Professional meetings and gallery spaces",
        "Horizon Worlds: Social experiences and community building",
        "Roblox: Massive youth audience, creator economy"
      ]},
      { type: "paragraph", text: "The metaverse is still being built—which means right now is the frontier moment. Early adopters aren't just participating; they're shaping the culture and economy of these digital spaces." },
      { type: "heading", text: "Your Avatar: Digital Self-Expression" },
      { type: "paragraph", text: "Creating your avatar is like designing your ideal self-presentation. Some women choose realistic representations; others embrace creative freedom with fantastical designs. There's no wrong answer—it's YOUR digital identity." },
      { type: "quote", text: "The metaverse isn't about escaping reality—it's about expanding what's possible." }
    ]
  },
  {
    slug: "blockchain-trust-network",
    title: "Blockchain: The Trust Network That Doesn't Need Trust",
    subtitle: "Understanding the technology revolutionizing everything from finance to fashion",
    category: "Blockchain",
    author: "MetaHers Editorial",
    publishDate: "2025-10-15",
    readTime: 8,
    featured: false,
    image: "blockchain-network",
    content: [
      { type: "paragraph", text: "Imagine a notebook that everyone can read, but no one can erase. Every transaction, every agreement, every record is written in permanent ink, verified by thousands of witnesses. That's blockchain." },
      { type: "paragraph", text: "At its core, blockchain is a digital ledger—a record-keeping system that's distributed across many computers rather than controlled by one central authority. This simple shift creates something revolutionary: trust without intermediaries." },
      { type: "heading", text: "Why This Matters for Your Daily Life" },
      { type: "paragraph", text: "Right now, we trust banks to manage our money, governments to verify our identities, and corporations to honor their promises. Blockchain technology creates systems where the code itself enforces these guarantees—no trust required." },
      { type: "paragraph", text: "This isn't theoretical. Supply chains use blockchain to verify authentic luxury goods (goodbye, counterfeits). Healthcare systems use it to secure patient records. Artists use it to protect their intellectual property. Real estate transactions are being streamlined with smart contracts." },
      { type: "heading", text: "Smart Contracts: Agreements That Execute Themselves" },
      { type: "paragraph", text: "Think of a smart contract like a vending machine. You insert money (your condition), the machine verifies it, and automatically delivers your snack (the outcome). No cashier needed, no room for disputes." },
      { type: "paragraph", text: "Smart contracts on blockchain work the same way but for anything: rental agreements, freelance payments, royalty distributions, equity transfers. When conditions are met, the contract executes automatically—no lawyers, no delays, no arguing." },
      { type: "heading", text: "The Female-Friendly Revolution" },
      { type: "list", text: "Blockchain particularly empowers women by:", items: [
        "Enabling financial independence without traditional banking barriers",
        "Creating transparent supply chains for ethical fashion and beauty",
        "Protecting creative work and ensuring fair compensation",
        "Building decentralized communities governed by members, not corporations",
        "Providing immutable proof of credentials and achievements"
      ]},
      { type: "paragraph", text: "We're still in the early chapters of blockchain's story. The technology has rough edges, and the ecosystem needs more diverse voices—specifically, more women—helping shape its development and application." },
      { type: "quote", text: "Blockchain isn't just about technology—it's about reimagining systems to be more transparent, accessible, and fair." }
    ]
  },
  {
    slug: "web3-internet-upgrade",
    title: "Web3: The Internet's Glow-Up Is Here",
    subtitle: "From passive consumption to active ownership—the web is evolving",
    category: "Web3",
    author: "MetaHers Editorial",
    publishDate: "2025-10-14",
    readTime: 7,
    featured: true,
    image: "web3-evolution",
    content: [
      { type: "paragraph", text: "The internet has gone through major transformations before. Web1 was the read-only era (think basic websites, no interaction). Web2 brought us social media, apps, and user-generated content (read AND write). Now Web3 is emerging with a radical promise: read, write, and OWN." },
      { type: "paragraph", text: "In Web2, you create content on platforms—Instagram posts, TikTok videos, tweets—but the platform owns that data and profits from it. In Web3, you own your content, your data, and your digital identity. It's the difference between renting and owning." },
      { type: "heading", text: "What Changes in Web3?" },
      { type: "paragraph", text: "Imagine logging into any website with one universal identity you control—no more creating accounts and remembering passwords. Imagine your social media following actually belonging to you, portable across platforms. Imagine getting paid directly for your content and attention, not the platform." },
      { type: "paragraph", text: "That's Web3's vision: an internet where users have power, not just platforms." },
      { type: "heading", text: "The Building Blocks" },
      { type: "list", text: "Web3 runs on several key technologies:", items: [
        "Blockchain: The foundation for ownership and verification",
        "Cryptocurrency: Native digital money for the decentralized web",
        "Smart contracts: Self-executing agreements coded into blockchain",
        "NFTs: Proof of ownership for unique digital items",
        "DAOs: Community-governed organizations without CEOs",
        "Decentralized storage: Your data on distributed networks, not corporate servers"
      ]},
      { type: "paragraph", text: "This sounds complex because it is—Web3 is still being built. But so was Web2 in the early 2000s. Remember when 'social media influencer' wasn't a career? Web3 will create jobs and opportunities we can't even imagine yet." },
      { type: "heading", text: "Why Women Need to Be Part of This" },
      { type: "paragraph", text: "Here's the uncomfortable truth: technology has historically been built by and for men, leading to products and platforms that don't always serve women well. Web3 is young enough that we can still shape its development." },
      { type: "paragraph", text: "Women in Web3 are founding protocols, creating DAOs focused on female empowerment, building communities, and designing the user experiences that will make this technology accessible to everyone—not just crypto enthusiasts." },
      { type: "quote", text: "Web3 isn't perfect, and it's not a utopia. But it's a rare chance to help build the next version of the internet with intention and inclusivity from the start." }
    ]
  },
  {
    slug: "chatgpt-prompts-woman-boss",
    title: "10 ChatGPT Prompts Every Woman Boss Needs in 2025",
    subtitle: "Copy-paste prompts to automate your workflow and reclaim 10+ hours per week",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-27",
    readTime: 8,
    featured: true,
    image: "ai-prompts-boss",
    content: [
      { type: "paragraph", text: "Let's be honest: as a woman running a business, you're probably wearing 15 different hats. CEO. Marketing director. Customer service. Accountant. Social media manager. The list is endless—and exhausting." },
      { type: "paragraph", text: "What if you could delegate half of those tasks to an assistant who works 24/7, never complains, and costs you nothing? That assistant is ChatGPT—but only if you know how to talk to it." },
      { type: "paragraph", text: "Prompting is everything. A vague prompt gets you generic garbage. A specific, strategic prompt? That's where the magic happens. Here are 10 copy-paste prompts designed specifically for women entrepreneurs who are done with busywork." },
      { type: "heading", text: "1. The Email Responder (Save 5+ Hours/Week)" },
      { type: "paragraph", text: "Prompt: 'You are my executive assistant. Draft a professional but warm response to this email: [paste email]. My tone should be friendly, confident, and solution-oriented. Keep it under 150 words.'" },
      { type: "paragraph", text: "Why it works: Most of us spend hours agonizing over email responses. This prompt handles 80% of your inbox in seconds while maintaining your voice." },
      { type: "heading", text: "2. The Content Calendar Creator" },
      { type: "paragraph", text: "Prompt: 'I need a 30-day social media content calendar for [your industry/niche]. Target audience: [describe your ideal customer]. Brand voice: [professional/casual/luxury/etc]. Include post ideas, captions, and best posting times. Format as a table.'" },
      { type: "paragraph", text: "Why it works: Content planning is tedious but necessary. Let AI do the brainstorming heavy lifting, then you just refine and add your personal touch." },
      { type: "heading", text: "3. The Pitch Perfector" },
      { type: "paragraph", text: "Prompt: 'Help me craft a compelling 60-second elevator pitch for my business. Here's what I do: [describe your business/service]. My ideal clients are [target audience]. I want to sound confident, clear, and magnetic—not salesy. Give me 3 variations.'" },
      { type: "paragraph", text: "Why it works: Talking about yourself is hard. This prompt gives you multiple angles to test which one resonates most." },
      { type: "heading", text: "4. The Meeting Prep Assistant" },
      { type: "paragraph", text: "Prompt: 'I have a meeting with [client/investor/partner] in 30 minutes. The goal is [what you want to achieve]. Give me: (1) 5 smart questions to ask them, (2) 3 potential objections and how to address them, (3) A one-sentence summary of what success looks like for this meeting.'" },
      { type: "paragraph", text: "Why it works: Walking into meetings prepared makes you look like the expert you are. This prompt does all your prep work in under 60 seconds." },
      { type: "heading", text: "5. The Proposal Writer" },
      { type: "paragraph", text: "Prompt: 'Write a professional project proposal for [describe the project]. Client: [name/industry]. Scope: [what you're offering]. Timeline: [duration]. Investment: [your pricing]. Tone: confident, clear, outcome-focused. Include sections for: Problem, Solution, Deliverables, Timeline, Investment, Next Steps.'" },
      { type: "paragraph", text: "Why it works: Proposals take hours to write from scratch. This gives you a polished draft in minutes that you can customize with specific details." },
      { type: "heading", text: "6. The Caption Wizard" },
      { type: "paragraph", text: "Prompt: 'Write an Instagram caption for [describe your post/product/announcement]. Audience: [who you're talking to]. Vibe: [inspirational/educational/fun/luxury]. Include: hook in first line, value in the middle, call-to-action at the end. Keep it under 200 characters. Add 10 relevant hashtags.'" },
      { type: "paragraph", text: "Why it works: Staring at a blank screen trying to come up with captions is time-consuming. This structures your captions for maximum engagement every time." },
      { type: "heading", text: "7. The Newsletter Generator" },
      { type: "paragraph", text: "Prompt: 'Create a weekly newsletter outline for my audience of [describe your subscribers]. This week's theme: [topic]. Include: catchy subject line, personal opening story (2-3 sentences), main educational content (3 key points), one actionable tip they can implement today, warm sign-off. Tone: conversational and empowering.'" },
      { type: "paragraph", text: "Why it works: Newsletters keep your audience engaged, but they're time-intensive. This prompt gives you the structure—you just add the personality." },
      { type: "heading", text: "8. The Objection Handler" },
      { type: "paragraph", text: "Prompt: 'I'm launching [product/service] for [price]. My ideal clients are [target audience]. List the top 10 objections they might have and give me calm, confident responses to each one that highlight value without being defensive.'" },
      { type: "paragraph", text: "Why it works: Sales conversations get easier when you've already rehearsed every possible objection. This prompt arms you with persuasive, empathetic responses." },
      { type: "heading", text: "9. The Strategic Planning Partner" },
      { type: "paragraph", text: "Prompt: 'Act as my business strategist. I want to [specific business goal] in the next [timeframe]. My current resources: [time/budget/team]. My biggest challenge: [obstacle]. Give me a step-by-step action plan with realistic milestones. Be honest about what's achievable.'" },
      { type: "paragraph", text: "Why it works: Sometimes you need an outside perspective to cut through the noise. This prompt forces you to clarify your goals and gives you a roadmap." },
      { type: "heading", text: "10. The Brainstorm Buddy" },
      { type: "paragraph", text: "Prompt: 'I'm stuck on [problem/decision/creative block]. Here's the context: [explain situation]. Give me 10 wildly creative solutions—don't hold back. Include both practical and unconventional ideas. I want to think bigger.'" },
      { type: "paragraph", text: "Why it works: When you're too close to a problem, it's hard to see solutions. This prompt unleashes ideas you'd never think of on your own." },
      { type: "heading", text: "How to Make These Prompts Work Even Better" },
      { type: "list", text: "Power tips:", items: [
        "Save your best prompts in a note-taking app for instant access",
        "Customize the bracketed sections with your specific details",
        "Use follow-up prompts like 'Make this more concise' or 'Give me 3 more variations'",
        "Experiment with adding 'Forbes-meets-Vogue tone' or 'luxury brand voice' for elevated language",
        "Combine prompts—for example, use the brainstorm buddy to generate ideas, then the content calendar to schedule them"
      ]},
      { type: "paragraph", text: "The women who will dominate 2025 aren't the ones working harder—they're the ones working smarter by using AI as a force multiplier. These prompts are your starting point. The more you use them, the better you'll get at crafting custom prompts for your unique business needs." },
      { type: "quote", text: "AI won't replace you, but a woman using AI will replace a woman who isn't. Choose your side." }
    ]
  },
  {
    slug: "web3-luxury-status-symbol",
    title: "Web3 Luxury: The New Status Symbol for Modern Women",
    subtitle: "Why digital ownership is becoming more prestigious than designer handbags",
    category: "Web3",
    author: "MetaHers Editorial",
    publishDate: "2025-10-27",
    readTime: 7,
    featured: true,
    image: "web3-luxury",
    content: [
      { type: "paragraph", text: "There was a time when carrying a Birkin bag was the ultimate flex. Then it was driving a Tesla. Now? The most sophisticated women are collecting ENS domains, curating NFT portfolios, and casually mentioning their DAO memberships at brunches." },
      { type: "paragraph", text: "Web3 isn't just technology—it's the new luxury. And like all luxury movements, early adopters are the tastemakers who define what's next. This is your invitation to understand why digital ownership is becoming the ultimate status symbol." },
      { type: "heading", text: "The Shift: From Physical to Digital Prestige" },
      { type: "paragraph", text: "Luxury has always been about scarcity, craftsmanship, and exclusivity. A limited edition Hermès Kelly bag checks all those boxes. So does a one-of-one NFT by a renowned digital artist. The difference? The NFT is verifiable on the blockchain, transferrable globally in seconds, and can appreciate in value faster than traditional art." },
      { type: "paragraph", text: "The new wealthy aren't just buying things—they're building digital empires. An ENS domain (like yourname.eth) is your Web3 identity. A curated NFT collection is your digital art gallery. A smart contract portfolio shows you understand the future of finance." },
      { type: "heading", text: "What the New Luxury Looks Like" },
      { type: "list", text: "Status symbols of the Web3 era:", items: [
        "Premium ENS domains: Short, memorable .eth names (the digital equivalent of a Fifth Avenue penthouse address)",
        "Blue-chip NFTs: Collections like CryptoPunks, Art Blocks, or works by established digital artists",
        "Early DAO memberships: Being part of exclusive decentralized communities shaping industries",
        "DeFi portfolios: Understanding yield farming, staking, and crypto lending",
        "Virtual real estate: Owning prime land in metaverse platforms like Decentraland or The Sandbox",
        "Token-gated access: Exclusive events, communities, and experiences unlocked only by holding specific NFTs"
      ]},
      { type: "paragraph", text: "These aren't just assets—they're identity markers. They signal that you're not just consuming the future; you're building it." },
      { type: "heading", text: "Why Women Are Leading This Shift" },
      { type: "paragraph", text: "Smart women are recognizing something profound: Web3 luxury is more democratic than traditional luxury. You don't need generational wealth or industry connections to acquire a valuable NFT or build influence in a DAO. You need taste, timing, and knowledge." },
      { type: "paragraph", text: "Women founders are launching NFT collections that sell out in minutes. Female artists are earning more from their digital work than they ever made in traditional galleries. Women-led DAOs are allocating millions in capital to projects they believe in. This isn't hypothetical—it's happening right now." },
      { type: "heading", text: "The Investment Thesis Behind Digital Ownership" },
      { type: "paragraph", text: "Traditional luxury goods depreciate or hold value. A Chanel bag might resell for 70-80% of its purchase price if you keep it pristine. Digital assets? They can 10x, 100x, or become culturally iconic overnight—or lose value just as quickly." },
      { type: "paragraph", text: "The risk-reward is different. But so is the liquidity. Try selling a luxury handbag quickly—you're dealing with authentication services, consignment shops, and weeks of waiting. Sell an NFT? Instant global marketplace, 24/7 liquidity, transaction complete in minutes." },
      { type: "paragraph", text: "Smart collectors diversify. Physical luxury for tangible enjoyment, digital luxury for future-forward investment and cultural currency." },
      { type: "heading", text: "How to Enter the Web3 Luxury Space Tastefully" },
      { type: "paragraph", text: "Step 1: Educate yourself. Follow Web3-native women on Twitter. Join Discord communities. Browse NFT marketplaces (OpenSea, Foundation, SuperRare) not to buy immediately, but to develop your taste and understand what's valued." },
      { type: "paragraph", text: "Step 2: Start small. Claim your ENS domain ($20-50). It's your digital identity. Mint a free NFT from an emerging artist. Join a DAO with accessible entry (Friends With Benefits, Cabin DAO). Get comfortable with the mechanics." },
      { type: "paragraph", text: "Step 3: Curate intentionally. Don't chase hype. Build a collection that reflects your aesthetic, values, and vision. In five years, your NFT portfolio should tell a story about who you are—like a well-edited closet or art collection." },
      { type: "paragraph", text: "Step 4: Participate in the culture. Web3 luxury isn't just about owning—it's about contributing. Comment on others' work. Support emerging artists. Vote in DAOs. Build reputation through thoughtful engagement." },
      { type: "heading", text: "The Social Currency of Being Early" },
      { type: "paragraph", text: "There's a certain cachet to saying 'I've been in crypto since 2020' or 'I minted that collection on day one.' Early adopters don't just have financial gains—they have cultural authority. They were there when it wasn't cool, when people mocked NFTs, when the tech was clunky." },
      { type: "paragraph", text: "Right now, in 2025, you're still early. The women entering Web3 today will be the tastemakers, advisors, and experts everyone turns to in 2030. You're witnessing—and participating in—the birth of an entirely new luxury ecosystem." },
      { type: "quote", text: "The most expensive bag you'll ever carry is the opportunity cost of not understanding Web3. Digital luxury isn't the future—it's the present for those paying attention." }
    ]
  },
  {
    slug: "web3-location-independent-empire",
    title: "From 9-to-5 to Web3: How Women Are Building Location-Independent Empires",
    subtitle: "Real stories of women who quit corporate to build crypto careers from anywhere",
    category: "Web3",
    author: "MetaHers Editorial",
    publishDate: "2025-10-27",
    readTime: 9,
    featured: false,
    image: "web3-location-independent",
    content: [
      { type: "paragraph", text: "Picture this: You're working from a villa in Bali, earning in cryptocurrency, building a business that operates 24/7 without you being chained to a desk. Your income isn't tied to your hours. Your location isn't tied to an office. This isn't a fantasy—this is what Web3 careers look like for women brave enough to take the leap." },
      { type: "paragraph", text: "The 9-to-5 corporate grind promised stability. Web3 promises freedom. And increasingly, women are choosing freedom." },
      { type: "heading", text: "Why Web3 Enables True Location Independence" },
      { type: "paragraph", text: "Traditional remote work still has invisible chains—time zones, corporate policies, geographic restrictions on who can be hired. Web3 breaks all of that. DAOs don't care where you live. Crypto doesn't sleep. Smart contracts execute whether you're in New York or New Zealand." },
      { type: "paragraph", text: "In Web3, you're paid in cryptocurrency that can be accessed anywhere. You're working with global teams that coordinate asynchronously. You're building assets (NFTs, tokens, protocols) that generate passive income while you sleep, travel, or focus on other projects." },
      { type: "heading", text: "Real Paths Women Are Taking Into Web3" },
      { type: "list", text: "These are actual career paths women are pursuing:", items: [
        "DAO contributors: Getting paid in governance tokens to manage community, operations, or marketing for decentralized organizations",
        "NFT artists/creators: Minting digital art, music, or collectibles and selling directly to global collectors",
        "DeFi analysts: Researching protocols, writing reports, advising on crypto investments",
        "Web3 writers: Creating educational content, ghostwriting whitepapers, managing protocol communications",
        "Smart contract auditors: Reviewing code for security (high-paying, in-demand skill)",
        "Community managers: Running Discord servers, Twitter Spaces, and online communities for Web3 projects",
        "Tokenomics consultants: Designing economic models for new tokens and protocols",
        "Virtual world architects: Designing experiences, events, and spaces in metaverse platforms"
      ]},
      { type: "paragraph", text: "Notice a pattern? Most of these didn't exist five years ago. Web3 is creating entirely new career categories, and women are filling them." },
      { type: "heading", text: "The Transition: What It Actually Takes" },
      { type: "paragraph", text: "Let's be real: quitting your stable job to 'do Web3' without a plan is reckless. But making a strategic transition? That's smart. Here's how women are doing it successfully:" },
      { type: "paragraph", text: "Phase 1 (Months 1-3): Education. Spend evenings and weekends learning. Set up wallets. Buy a small amount of crypto. Join DAOs. Read whitepapers. Follow Web3 natives on Twitter. The goal isn't mastery—it's orientation." },
      { type: "paragraph", text: "Phase 2 (Months 4-6): Contribution. Start participating for free. Join a DAO and volunteer. Contribute to Discord discussions. Write a Mirror article about what you're learning. Build your Web3 reputation. This is your audition for paid opportunities." },
      { type: "paragraph", text: "Phase 3 (Months 7-9): Earning. Apply for bounties (short-term paid tasks in DAOs). Take contract work. Launch your first NFT project. The income might be inconsistent, but you're now earning in crypto while still working your day job." },
      { type: "paragraph", text: "Phase 4 (Months 10-12): Transition. When your Web3 income consistently covers 50-75% of your living expenses, you have options. Go part-time at your corporate job. Quit and go all-in. Build your runway, then leap." },
      { type: "heading", text: "The Financial Reality: What Women Are Actually Earning" },
      { type: "paragraph", text: "Let's talk numbers. Entry-level DAO contributors earn $2,000-5,000/month in tokens. Experienced community managers command $5,000-10,000/month. Skilled smart contract auditors? $15,000-30,000+ per month. NFT artists are wildly variable—some make nothing, some make millions." },
      { type: "paragraph", text: "The catch: income is often in crypto, which is volatile. A $6,000 monthly payment in ETH might be worth $7,500 next month or $4,500. You need financial buffer and risk tolerance. But you also have upside potential traditional salaries can never match." },
      { type: "heading", text: "The Lifestyle: What Actually Changes" },
      { type: "paragraph", text: "Beyond the income and location flexibility, here's what women report actually changes when they go full Web3:" },
      { type: "paragraph", text: "Time autonomy: You work when you're most productive, not 9-5. Some women do deep work at 5 AM, others at 11 PM. If you want to take Tuesday off and work Sunday, you can." },
      { type: "paragraph", text: "Geographic arbitrage: Earn in crypto (often pegged to US/EU rates), live in lower-cost countries. Your purchasing power multiplies. Bali, Portugal, Mexico, Thailand—these are popular bases for Web3 women." },
      { type: "paragraph", text: "Network effects: You're working with brilliant people globally. Your Slack channels have contributors from 15 countries. You're learning constantly, building relationships that transcend geography." },
      { type: "paragraph", text: "Identity shift: You're no longer 'job title at company X.' You're 'building in Web3.' Your identity becomes your skills and contributions, not your employer." },
      { type: "heading", text: "The Challenges No One Talks About" },
      { type: "paragraph", text: "It's not all villa sunsets and beach laptops. Web3 careers come with real challenges: tax complexity (crypto tax reporting is a nightmare), income volatility, lack of benefits (no 401k, health insurance, paid leave), and isolation (remote-first can be lonely)." },
      { type: "paragraph", text: "Plus, the industry moves fast. Protocols rise and fall. Your DAO might dissolve. Your token holdings could crash. You need mental resilience and financial backup plans." },
      { type: "paragraph", text: "But for many women, these trade-offs are worth it. The freedom to design your life, work on your terms, and build wealth through ownership (not just salary) is transformative." },
      { type: "heading", text: "Your First Step If You're Considering This" },
      { type: "paragraph", text: "If this resonates, here's your action plan for the next 30 days: (1) Set up a crypto wallet and buy $50 of ETH. (2) Join one Web3 community that aligns with your interests (DAO, NFT project, protocol Discord). (3) Follow 10 women working in Web3 on Twitter and read what they share. (4) Write down your 'why'—what would location independence actually enable for you?" },
      { type: "paragraph", text: "You don't need to quit your job next week. You need to start learning, building, and exploring whether this path is right for you. Some women will thrive in Web3. Others will take what they learn and apply it in traditional careers. Both are valid." },
      { type: "quote", text: "The question isn't whether Web3 is the future—it's whether you'll be a tourist or a builder. The women leading this movement didn't wait for permission. They learned, contributed, and created opportunities where none existed before. That invitation is still open." }
    ]
  }
];

// ===== QUIZ DATA & MATCHING LOGIC =====

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  text: string;
  matchScore: Record<string, number>; // ritual slug -> score weight
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Where are you on your tech journey right now?",
    options: [
      {
        id: "beginner",
        text: "Just getting started—curious but overwhelmed",
        matchScore: {
          "ai-glow-up-facial": 3,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 1,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      },
      {
        id: "learning",
        text: "I understand the basics, ready to go deeper",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 2
        }
      },
      {
        id: "advanced",
        text: "I'm ready for the cutting-edge concepts",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 3,
          "metaverse-meditation": 3
        }
      }
    ]
  },
  {
    id: "q2",
    question: "What excites you most about technology?",
    options: [
      {
        id: "creating",
        text: "Creating and automating with AI tools",
        matchScore: {
          "ai-glow-up-facial": 4,
          "blockchain-detox-ritual": 0,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      },
      {
        id: "finance",
        text: "Understanding digital money and finance differently",
        matchScore: {
          "ai-glow-up-facial": 0,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 4,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 0
        }
      },
      {
        id: "art",
        text: "Digital ownership, art, and creativity",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 0,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 4,
          "metaverse-meditation": 2
        }
      },
      {
        id: "virtual",
        text: "Virtual worlds and immersive experiences",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 4
        }
      },
      {
        id: "foundation",
        text: "The tech behind it all—how it works",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 4,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      }
    ]
  },
  {
    id: "q3",
    question: "How do you prefer to learn new skills?",
    options: [
      {
        id: "handson",
        text: "Hands-on, practical applications I can use today",
        matchScore: {
          "ai-glow-up-facial": 3,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 2
        }
      },
      {
        id: "conceptual",
        text: "Deep dive into concepts and theory first",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 3,
          "crypto-confidence-bath": 3,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 2
        }
      },
      {
        id: "creative",
        text: "Visual, creative, and experimental",
        matchScore: {
          "ai-glow-up-facial": 2,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 1,
          "nft-radiance-wrap": 3,
          "metaverse-meditation": 3
        }
      }
    ]
  },
  {
    id: "q4",
    question: "What's your biggest goal right now?",
    options: [
      {
        id: "productivity",
        text: "Multiply my productivity and automate tasks",
        matchScore: {
          "ai-glow-up-facial": 4,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      },
      {
        id: "invest",
        text: "Invest confidently in digital assets",
        matchScore: {
          "ai-glow-up-facial": 0,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 4,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 0
        }
      },
      {
        id: "create",
        text: "Create and monetize digital content",
        matchScore: {
          "ai-glow-up-facial": 2,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 4,
          "metaverse-meditation": 2
        }
      },
      {
        id: "build",
        text: "Build my presence in Web3 and virtual spaces",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 1,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 4
        }
      },
      {
        id: "understand",
        text: "Understand the foundation of blockchain technology",
        matchScore: {
          "ai-glow-up-facial": 0,
          "blockchain-detox-ritual": 4,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      }
    ]
  },
  {
    id: "q5",
    question: "Which description resonates most with you?",
    options: [
      {
        id: "innovator",
        text: "The Innovator—I love testing new AI tools and automations",
        matchScore: {
          "ai-glow-up-facial": 4,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 1,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 2
        }
      },
      {
        id: "investor",
        text: "The Investor—I want to make smart financial moves",
        matchScore: {
          "ai-glow-up-facial": 0,
          "blockchain-detox-ritual": 2,
          "crypto-confidence-bath": 4,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 1
        }
      },
      {
        id: "creator",
        text: "The Creator—I want to own and monetize my digital art",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 0,
          "nft-radiance-wrap": 4,
          "metaverse-meditation": 2
        }
      },
      {
        id: "builder",
        text: "The Builder—I'm designing my virtual brand presence",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 1,
          "crypto-confidence-bath": 1,
          "nft-radiance-wrap": 2,
          "metaverse-meditation": 4
        }
      },
      {
        id: "architect",
        text: "The Architect—I need to understand how it all works",
        matchScore: {
          "ai-glow-up-facial": 1,
          "blockchain-detox-ritual": 4,
          "crypto-confidence-bath": 2,
          "nft-radiance-wrap": 1,
          "metaverse-meditation": 2
        }
      }
    ]
  }
];

// Matching algorithm to determine which ritual based on quiz answers
export function matchRitual(answers: Record<string, string>): string {
  const scores: Record<string, number> = {
    "ai-glow-up-facial": 0,
    "blockchain-detox-ritual": 0,
    "crypto-confidence-bath": 0,
    "nft-radiance-wrap": 0,
    "metaverse-meditation": 0
  };

  // Calculate scores based on answers
  Object.entries(answers).forEach(([questionId, answerId]) => {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question) {
      const option = question.options.find(o => o.id === answerId);
      if (option) {
        Object.entries(option.matchScore).forEach(([ritual, score]) => {
          scores[ritual] += score;
        });
      }
    }
  });

  // Find ritual with highest score
  let maxScore = -1;
  let matchedRitual = "ai-glow-up-facial"; // default fallback
  
  Object.entries(scores).forEach(([ritual, score]) => {
    if (score > maxScore) {
      maxScore = score;
      matchedRitual = ritual;
    }
  });

  return matchedRitual;
}

// Get ritual details by slug
export function getRitualBySlug(slug: string): Ritual | undefined {
  return rituals.find(r => r.slug === slug);
}

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

// Subscriptions table (for Pro tier)
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: varchar("stripe_customer_id").unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripePriceId: varchar("stripe_price_id"),
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

// ===== ZOD SCHEMAS (for frontend/client data) =====

export const ritualSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tier: z.enum(["free", "pro"]),
  duration_min: z.number(),
  summary: z.string(),
  steps: z.array(z.string()),
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
      "Cleanse intent",
      "Prompting 101",
      "Automate one task",
      "Reflect & journal",
      "Set weekly trigger"
    ]
  },
  {
    slug: "blockchain-detox-ritual",
    title: "Blockchain Detox Ritual",
    tier: "pro",
    duration_min: 60,
    summary: "Wallet setup, self-custody, safety.",
    steps: [
      "Visualize trust",
      "Create wallet",
      "Self-custody basics",
      "Testnet transfer",
      "Journal"
    ]
  },
  {
    slug: "crypto-confidence-bath",
    title: "Crypto Confidence Bath",
    tier: "pro",
    duration_min: 75,
    summary: "BTC/ETH/stablecoins in plain language.",
    steps: [
      "Tea ritual",
      "BTC & ETH basics",
      "Stablecoins",
      "Use cases",
      "Journal"
    ]
  },
  {
    slug: "nft-radiance-wrap",
    title: "NFT Radiance Wrap",
    tier: "pro",
    duration_min: 90,
    summary: "Design and mint a first NFT (testnet).",
    steps: [
      "Inspiration",
      "Prompt art",
      "Mint on testnet",
      "List draft",
      "Story share"
    ]
  },
  {
    slug: "metaverse-meditation",
    title: "Metaverse Meditation",
    tier: "pro",
    duration_min: 90,
    summary: "Avatar, space, brand presence.",
    steps: [
      "Visualize",
      "Avatar setup",
      "Space design",
      "Brand ritual",
      "Journal"
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

import { z } from "zod";
import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  uniqueIndex,
  decimal, // Import decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// ===== DRIZZLE DATABASE TABLES =====

// Session storage table (required for Replit Auth)
export const session = pgTable(
  "session",
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
  subscriptionTier: varchar("subscription_tier").default("free").notNull(), // free, signature_monthly, private_monthly, ai_blueprint
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  quizUnlockedRitual: varchar("quiz_unlocked_ritual"), // Ritual unlocked via quiz
  quizCompletedAt: timestamp("quiz_completed_at"), // When they completed the quiz
  stripeCustomerId: varchar("stripe_customer_id"), // Stripe customer ID for payments
  stripeSubscriptionId: varchar("stripe_subscription_id"), // Current subscription ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// DEPRECATED: Cycle tracker removed in v2 restructure. Tables kept for migration safety.
// Menstrual cycle tracking table
export const menstrualCycles = pgTable("menstrual_cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startDate: varchar("start_date").notNull(), // YYYY-MM-DD
  endDate: varchar("end_date"), // YYYY-MM-DD, null if ongoing
  cycleLength: integer("cycle_length"), // Calculated or user-set
  periodLength: integer("period_length"), // Calculated or user-set
  symptoms: jsonb("symptoms").$type<string[]>().default(sql`'[]'::jsonb`),
  mood: varchar("mood"),
  flowIntensity: varchar("flow_intensity"), // light, medium, heavy
  isPredicted: boolean("is_predicted").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_menstrual_user").on(table.userId),
  index("idx_menstrual_date").on(table.startDate),
]);

export const insertMenstrualCycleSchema = createInsertSchema(menstrualCycles).omit({ id: true, createdAt: true });
export type InsertMenstrualCycle = z.infer<typeof insertMenstrualCycleSchema>;
export type MenstrualCycle = typeof menstrualCycles.$inferSelect;

// Daily symptoms log (independent of periods but useful for tracking)
export const dailySymptoms = pgTable("daily_symptoms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(), // YYYY-MM-DD
  symptoms: jsonb("symptoms").$type<string[]>().default(sql`'[]'::jsonb`),
  mood: varchar("mood"),
  energyLevel: integer("energy_level"), // 1-10
  stressLevel: integer("stress_level"), // 1-10
  waterIntake: integer("water_intake"), // glasses
  sleepHours: decimal("sleep_hours", { precision: 4, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_symptoms_user_date").on(table.userId, table.date),
]);

export const insertDailySymptomSchema = createInsertSchema(dailySymptoms).omit({ id: true, createdAt: true });
export type InsertDailySymptom = z.infer<typeof insertDailySymptomSchema>;
export type DailySymptom = typeof dailySymptoms.$inferSelect;

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

// Career Companion (Tamagotchi-style game)
export const companions = pgTable("companions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  name: varchar("name").notNull().default("Muse"),
  stage: varchar("stage").notNull().default("seedling"), // seedling, sprout, blooming, flourishing, radiant
  currentMood: varchar("current_mood").default("curious"),

  // Stats (0-100)
  growth: integer("growth").default(0).notNull(),
  inspiration: integer("inspiration").default(0).notNull(),
  connection: integer("connection").default(0).notNull(),
  mastery: integer("mastery").default(0).notNull(),

  // Engagement tracking
  lastFed: timestamp("last_fed"), // Fed by journaling
  lastPlayed: timestamp("last_played"), // Played with by completing experiences
  lastSocialized: timestamp("last_socialized"), // Socialized by community activity

  // Unlocks
  unlockedAccessories: jsonb("unlocked_accessories").$type<string[]>().default(sql`'[]'::jsonb`),
  equippedAccessories: jsonb("equipped_accessories").$type<Record<string, string>>().default(sql`'{}'::jsonb`),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_companion_user").on(table.userId),
]);

export const insertCompanionSchema = createInsertSchema(companions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompanion = z.infer<typeof insertCompanionSchema>;
export type CompanionDB = typeof companions.$inferSelect;

// Companion activity log
export const companionActivities = pgTable("companion_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  activityType: varchar("activity_type").notNull(), // "journal", "learn", "socialize", "achievement"
  statChanged: varchar("stat_changed").notNull(), // "growth", "inspiration", "connection", "mastery"
  pointsGained: integer("points_gained").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_companion_activity_user").on(table.userId),
  index("idx_companion_activity_created").on(table.createdAt),
]);

export const insertCompanionActivitySchema = createInsertSchema(companionActivities).omit({ id: true, createdAt: true });
export type InsertCompanionActivity = z.infer<typeof insertCompanionActivitySchema>;
export type CompanionActivityDB = typeof companionActivities.$inferSelect;

// ===== NORMALIZED EXPERIENCE SECTIONS =====

// Experience sections (normalized from JSONB)
export const experienceSections = pgTable('experience_sections', {
  id: serial('id').primaryKey(),
  experienceId: varchar('experience_id').notNull().references(() => transformationalExperiences.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'text', 'quiz', 'video', 'interactive', 'hands_on_lab'
  title: text('title').notNull(),
  content: text('content'), // Main content
  metadata: jsonb('metadata'), // Flexible fields like quiz questions, video URL
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_section_experience').on(table.experienceId),
  index('idx_section_sort').on(table.experienceId, table.sortOrder),
]);

export const insertExperienceSectionSchema = createInsertSchema(experienceSections).omit({ id: true, createdAt: true });
export type InsertExperienceSection = z.infer<typeof insertExperienceSectionSchema>;
export type ExperienceSectionDB = typeof experienceSections.$inferSelect;

// Section resources (links, downloads, references)
export const sectionResources = pgTable('section_resources', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull().references(() => experienceSections.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'link', 'download', 'video', 'article', 'tool'
  title: text('title').notNull(),
  url: text('url'),
  metadata: jsonb('metadata'), // Additional fields
  sortOrder: integer('sort_order').notNull(),
}, (table) => [
  index('idx_resource_section').on(table.sectionId),
]);

export const insertSectionResourceSchema = createInsertSchema(sectionResources).omit({ id: true });
export type InsertSectionResource = z.infer<typeof insertSectionResourceSchema>;
export type SectionResourceDB = typeof sectionResources.$inferSelect;

// User section completions (granular tracking)
export const sectionCompletions = pgTable('section_completions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sectionId: integer('section_id').notNull().references(() => experienceSections.id, { onDelete: 'cascade' }),
  experienceId: varchar('experience_id').notNull().references(() => transformationalExperiences.id, { onDelete: 'cascade' }),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  timeSpentSeconds: integer('time_spent_seconds'),
  quizScore: integer('quiz_score'), // If section is a quiz
}, (table) => [
  index('idx_completion_user').on(table.userId),
  index('idx_completion_section').on(table.sectionId),
  index('idx_completion_experience').on(table.experienceId),
  uniqueIndex('idx_completion_user_section_unique').on(table.userId, table.sectionId),
]);

export const insertSectionCompletionSchema = createInsertSchema(sectionCompletions).omit({ id: true, completedAt: true });
export type InsertSectionCompletion = z.infer<typeof insertSectionCompletionSchema>;
export type SectionCompletionDB = typeof sectionCompletions.$inferSelect;

// ===== ADMIN AUDIT LOGS =====
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLogDB = typeof auditLogs.$inferSelect;

// AI Usage Tracking Table
export const aiUsage = pgTable('ai_usage', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  promptType: varchar('prompt_type', { length: 50 }).notNull(),
  promptVersion: varchar('prompt_version', { length: 10 }).notNull(),
  model: varchar('model', { length: 50 }).notNull(),
  promptTokens: integer('prompt_tokens').notNull(),
  completionTokens: integer('completion_tokens').notNull(),
  totalTokens: integer('total_tokens').notNull(),
  cached: boolean('cached').default(false),
  latencyMs: integer('latency_ms'),
  cost: decimal('cost', { precision: 10, scale: 6 }), // Use decimal for cost
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const insertAiUsageSchema = createInsertSchema(aiUsage).omit({ id: true, timestamp: true });
export type InsertAiUsage = z.infer<typeof insertAiUsageSchema>;
export type AiUsageDB = typeof aiUsage.$inferSelect;


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
  lessonsCompleted: jsonb("lessons_completed").$type<number[]>().notNull().default(sql`'[]'::jsonb`), // Days where lesson was viewed
  practicesSubmitted: jsonb("practices_submitted").$type<number[]>().notNull().default(sql`'[]'::jsonb`), // Days where practice was completed
  practiceReflections: jsonb("practice_reflections").$type<Record<number, string>>().notNull().default(sql`'{}'::jsonb`), // {1: "reflection text", 2: "..."}
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

// Mind Spa Membership - Group Sessions table (for Sanctuary tier and above)
export const groupSessions = pgTable("group_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(), // "Monthly Ritual Session - January 2025"
  description: text("description"), // Session description
  sessionType: varchar("session_type").notNull().default("sanctuary_monthly"), // "sanctuary_monthly", "inner_circle_biweekly"
  scheduledDate: timestamp("scheduled_date").notNull(), // When the session happens
  duration: integer("duration").default(90).notNull(), // Duration in minutes
  maxCapacity: integer("max_capacity").default(30).notNull(), // Max attendees
  currentAttendees: integer("current_attendees").default(0).notNull(), // Current count
  zoomLink: varchar("zoom_link"), // Virtual meeting link
  meetingId: varchar("meeting_id"), // Zoom/external meeting ID
  status: varchar("status").notNull().default("scheduled"), // "scheduled", "completed", "cancelled"
  recordingUrl: varchar("recording_url"), // Post-session recording
  notes: text("notes"), // Session notes/summary
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_group_session_date").on(table.scheduledDate),
  index("idx_group_session_type").on(table.sessionType),
  index("idx_group_session_status").on(table.status),
]);

export const insertGroupSessionSchema = createInsertSchema(groupSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGroupSession = z.infer<typeof insertGroupSessionSchema>;
export type GroupSessionDB = typeof groupSessions.$inferSelect;

// Mind Spa Membership - Session Registrations table (tracks who's attending)
export const sessionRegistrations = pgTable("session_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => groupSessions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("registered"), // "registered", "attended", "no_show", "cancelled"
  registeredAt: timestamp("registered_at").defaultNow(),
  cancelledAt: timestamp("cancelled_at"),
}, (table) => [
  index("idx_session_reg_session").on(table.sessionId),
  index("idx_session_reg_user").on(table.userId),
]);

export const insertSessionRegistrationSchema = createInsertSchema(sessionRegistrations).omit({ id: true, registeredAt: true });
export type InsertSessionRegistration = z.infer<typeof insertSessionRegistrationSchema>;
export type SessionRegistrationDB = typeof sessionRegistrations.$inferSelect;

// Mind Spa Membership - 1:1 Bookings table (for Inner Circle quarterly and Founder's Circle monthly)
export const oneOnOneBookings = pgTable("one_on_one_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookingType: varchar("booking_type").notNull(), // "inner_circle_quarterly", "founders_circle_monthly", "founders_circle_retreat_day"
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").default(30).notNull(), // Duration in minutes
  meetingLink: varchar("meeting_link"), // Zoom/Calendly link
  status: varchar("status").notNull().default("scheduled"), // "scheduled", "completed", "cancelled", "rescheduled"
  agenda: text("agenda"), // User-submitted agenda/topics
  notes: text("notes"), // Post-session notes
  followUpActions: jsonb("follow_up_actions").$type<string[]>().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_1on1_user").on(table.userId),
  index("idx_1on1_date").on(table.scheduledDate),
  index("idx_1on1_status").on(table.status),
  index("idx_1on1_type").on(table.bookingType),
]);

export const insertOneOnOneBookingSchema = createInsertSchema(oneOnOneBookings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOneOnOneBooking = z.infer<typeof insertOneOnOneBookingSchema>;
export type OneOnOneBookingDB = typeof oneOnOneBookings.$inferSelect;

// Mind Spa Membership - Founder Insights table (exclusive content for Inner Circle and above)
export const founderInsights = pgTable("founder_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(), // Text content
  insightType: varchar("insight_type").notNull().default("voice_note"), // "voice_note", "article", "video", "quick_tip"
  audioUrl: varchar("audio_url"), // For voice notes
  videoUrl: varchar("video_url"), // For video content
  minTierRequired: varchar("min_tier_required").notNull().default("inner_circle"), // "inner_circle", "founders_circle"
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  viewCount: integer("view_count").default(0).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_founder_insight_type").on(table.insightType),
  index("idx_founder_insight_tier").on(table.minTierRequired),
  index("idx_founder_insight_published").on(table.publishedAt),
]);

export const insertFounderInsightSchema = createInsertSchema(founderInsights).omit({ id: true, createdAt: true });
export type InsertFounderInsight = z.infer<typeof insertFounderInsightSchema>;
export type FounderInsightDB = typeof founderInsights.$inferSelect;

// Mind Spa Membership - Insight Interactions table (tracks views, likes)
export const insightInteractions = pgTable("insight_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  insightId: varchar("insight_id").notNull().references(() => founderInsights.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hasViewed: boolean("has_viewed").default(false).notNull(),
  hasLiked: boolean("has_liked").default(false).notNull(),
  viewedAt: timestamp("viewed_at"),
  likedAt: timestamp("liked_at"),
}, (table) => [
  index("idx_insight_int_insight").on(table.insightId),
  index("idx_insight_int_user").on(table.userId),
]);

export const insertInsightInteractionSchema = createInsertSchema(insightInteractions).omit({ id: true });
export type InsertInsightInteraction = z.infer<typeof insertInsightInteractionSchema>;
export type InsightInteractionDB = typeof insightInteractions.$inferSelect;

// Retro Camera Photos - User-generated photos with filters
export const retroCameraPhotos = pgTable("retro_camera_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(), // Base64 or cloud storage URL
  filterName: varchar("filter_name").notNull(), // Which filter was applied
  caption: text("caption"),
  likeCount: integer("like_count").default(0).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_retro_photo_user").on(table.userId),
  index("idx_retro_photo_created").on(table.createdAt),
  index("idx_retro_photo_public").on(table.isPublic),
]);

export const insertRetroCameraPhotoSchema = createInsertSchema(retroCameraPhotos).omit({ id: true, createdAt: true });
export type InsertRetroCameraPhoto = z.infer<typeof insertRetroCameraPhotoSchema>;
export type RetroCameraPhotoDB = typeof retroCameraPhotos.$inferSelect;

// ===== METAHERS WORLD ARCHITECTURE =====

// Spaces table (6 main learning spaces in MetaHers World)
export const spaces = pgTable("spaces", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
  sortOrder: integer("sort_order").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_space_slug").on(table.slug),
  index("idx_space_active").on(table.isActive),
  index("idx_space_active_sort").on(table.isActive, table.sortOrder),
]);

export const insertSpaceSchema = createInsertSchema(spaces).omit({ createdAt: true, updatedAt: true });
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type SpaceDB = typeof spaces.$inferSelect;

// Transformational Experiences table (6 per space, personalized learning paths)
export const transformationalExperiences = pgTable("transformational_experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  spaceId: varchar("space_id").notNull().references(() => spaces.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description").notNull(),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().notNull(),
  tier: varchar("tier").notNull().default("free"),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  sortOrder: integer("sort_order").notNull(),
  content: jsonb("content").$type<{
    sections: Array<{
      id: string;
      title: string;
      type: "text" | "video" | "interactive" | "quiz" | "hands_on_lab";
      content: string;
      resources?: Array<{ title: string; url: string; type: string }>;
    }>;
  }>().notNull(),
  personalizationEnabled: boolean("personalization_enabled").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_experience_space").on(table.spaceId),
  index("idx_experience_tier").on(table.tier),
  index("idx_experience_space_active_sort").on(table.spaceId, table.isActive, table.sortOrder),
  index("idx_experience_active_sort").on(table.isActive, table.sortOrder),
]);

export const insertTransformationalExperienceSchema = createInsertSchema(transformationalExperiences).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTransformationalExperience = z.infer<typeof insertTransformationalExperienceSchema>;
export type TransformationalExperienceDB = typeof transformationalExperiences.$inferSelect;

// Experience Progress tracking table
export const experienceProgress = pgTable("experience_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  experienceId: varchar("experience_id").notNull().references(() => transformationalExperiences.id, { onDelete: "cascade" }),
  completedSections: jsonb("completed_sections").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  personalizationAnswers: jsonb("personalization_answers").$type<Record<string, any>>(),
  personalizedContent: jsonb("personalized_content").$type<{
    customGuidance?: string;
    recommendedTools?: string[];
    nextSteps?: string[];
  }>(),
  confidenceScore: integer("confidence_score"),
  businessImpact: text("business_impact"),
  milestonesAchieved: jsonb("milestones_achieved").$type<string[]>().default(sql`'[]'::jsonb`),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
  index("idx_exp_progress_user").on(table.userId),
  index("idx_exp_progress_experience").on(table.experienceId),
  uniqueIndex("idx_exp_progress_user_experience_unique").on(table.userId, table.experienceId),
]);

export const insertExperienceProgressSchema = createInsertSchema(experienceProgress).omit({ id: true, startedAt: true, lastUpdated: true });
export type InsertExperienceProgress = z.infer<typeof insertExperienceProgressSchema>;
export type ExperienceProgressDB = typeof experienceProgress.$inferSelect;

// Personalization Questions table (AI-powered adaptive questions)
export const personalizationQuestions = pgTable("personalization_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  experienceId: varchar("experience_id").notNull().references(() => transformationalExperiences.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type").notNull(),
  options: jsonb("options").$type<string[]>(),
  sortOrder: integer("sort_order").notNull(),
  isRequired: boolean("is_required").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_personalization_experience").on(table.experienceId),
]);

export const insertPersonalizationQuestionSchema = createInsertSchema(personalizationQuestions).omit({ id: true, createdAt: true });
export type InsertPersonalizationQuestion = z.infer<typeof insertPersonalizationQuestionSchema>;
export type PersonalizationQuestionDB = typeof personalizationQuestions.$inferSelect;

// App Atelier usage tracking
export const appAtelierUsage = pgTable("app_atelier_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messageCount: integer("message_count").default(0).notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  uniqueIndex("idx_app_atelier_user_unique").on(table.userId),
]);

export const insertAppAtelierUsageSchema = createInsertSchema(appAtelierUsage).omit({ id: true, createdAt: true });
export type InsertAppAtelierUsage = z.infer<typeof insertAppAtelierUsageSchema>;
export type AppAtelierUsageDB = typeof appAtelierUsage.$inferSelect;

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
        content: "Close your eyes. Imagine a space that's entirely yours—designed to your exact vision, where geography doesn't exist and your community can gather instantly. What does it look like? A serene virtual garden? A neon-lit gallery? A futuristic conference room? The metaverse is your blank canvas. Before diving into technology, get clear on intention: Why do you want a presence here? Networking? Education? Commerce? Your 'why' shapes your 'how.' Spend 10 minutes journaling your metaverse vision.",
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
    slug: "ai-content-creation",
    title: "AI Content Creation Mastery",
    subtitle: "Master AI tools to create stunning content that converts. Learn ChatGPT, Midjourney, video generation, and copywriting.",
    category: "AI",
    author: "Nadia",
    publishDate: "2025-12-01",
    readTime: 8,
    featured: true,
    image: "ai-content-creation",
    content: [
      { type: "paragraph", text: "Stop struggling with creative blocks. Learn how to use AI tools to generate high-quality content that resonates with your audience and drives conversions." },
      { type: "heading", text: "Master These Topics" },
      { type: "list", text: "Week 1 curriculum includes:", items: [
        "ChatGPT Content Generation: Compelling blog posts, sales copy, email sequences, social media captions",
        "AI Image Generation (Midjourney & DALL-E): Professional product images, social graphics, brand aesthetics",
        "Video Content with AI Tools: Script generation, AI avatar creation, auto-subtitles, video editing",
        "Copywriting That Converts: Psychology of persuasion, AIDA framework, landing pages, A/B testing"
      ]},
      { type: "paragraph", text: "High-quality content positions you as an expert in your field, attracting ideal clients naturally. AI tools reduce content creation time by 70% while maintaining quality and consistency." },
      { type: "heading", text: "Your Action Plan" },
      { type: "list", text: "This week:", items: [
        "Set up AI tools (ChatGPT Plus, Midjourney accounts)",
        "Create 5 pieces of content using AI",
        "Share your best work in our community for feedback"
      ]},
      { type: "quote", text: "Content creation isn't about working harder—it's about working smarter with AI while keeping your unique voice." }
    ]
  },
  {
    slug: "ai-brand-building",
    title: "Building Your AI-Powered Brand",
    subtitle: "Master personal branding with AI tools. Create a magnetic brand that attracts ideal clients and stands out.",
    category: "AI",
    author: "Nadia",
    publishDate: "2025-12-01",
    readTime: 8,
    featured: false,
    image: "ai-brand-building",
    content: [
      { type: "paragraph", text: "Your brand is your competitive advantage. Learn how to build a magnetic, cohesive brand identity that attracts your ideal clients and stands out in a crowded marketplace." },
      { type: "heading", text: "Brand Discovery & Positioning" },
      { type: "list", text: "Week 2 covers:", items: [
        "Identify your core values and mission with AI insights",
        "Find your unique angle in the market",
        "Create your brand story that resonates",
        "Develop your authentic brand voice"
      ]},
      { type: "heading", text: "Visual Brand Identity" },
      { type: "paragraph", text: "Create stunning visuals without a designer. Use AI tools like Looka for logo design, and learn color psychology and typography selection. A strong visual identity is recognizable at a glance." },
      { type: "heading", text: "Personal Branding Strategy" },
      { type: "list", text: "Build authority as a thought leader:", items: [
        "LinkedIn optimization that attracts opportunities",
        "Website messaging that sells",
        "Your unique positioning statement",
        "Compelling testimonials and case studies"
      ]},
      { type: "quote", text: "A strong brand allows you to charge premium prices and attract high-value clients naturally." }
    ]
  },
  {
    slug: "no-code-websites",
    title: "No-Code Website Building with AI",
    subtitle: "Build a professional website without coding. Launch your business online in days using modern no-code tools.",
    category: "AI",
    author: "Nadia",
    publishDate: "2025-12-01",
    readTime: 8,
    featured: false,
    image: "no-code-websites",
    content: [
      { type: "paragraph", text: "Launch a professional website that sells, without learning to code. Master modern no-code tools and AI to build your online business presence in days." },
      { type: "heading", text: "Platform Selection & Setup" },
      { type: "list", text: "Week 3 teaches:", items: [
        "Webflow: Full design control for professionals",
        "Framer: AI-powered design system",
        "Wix/Squarespace: Simplicity and speed",
        "Custom domain setup and optimization"
      ]},
      { type: "heading", text: "Website Structure That Converts" },
      { type: "list", text: "Build pages that turn visitors into customers:", items: [
        "Homepage that captures attention immediately",
        "Service/product pages with compelling copy",
        "About page that builds trust and connection",
        "Lead capture and email integration"
      ]},
      { type: "heading", text: "Design & Launch Timeline" },
      { type: "list", text: "Get live in 7 days:", items: [
        "Day 1-2: Choose platform and set up",
        "Day 3-5: Create core pages",
        "Day 6-7: Integrate payments and analytics, then launch"
      ]},
      { type: "quote", text: "A simple site that sells beats a fancy site that doesn't. Perfect is the enemy of done." }
    ]
  },
  {
    slug: "ai-agents-automation",
    title: "AI Agents & Business Automation",
    subtitle: "Deploy autonomous AI agents to run your business 24/7. Automate customer service, sales, and operations.",
    category: "AI",
    author: "Nadia",
    publishDate: "2025-12-01",
    readTime: 9,
    featured: false,
    image: "ai-agents-automation",
    content: [
      { type: "paragraph", text: "Stop working 24/7. Deploy autonomous AI agents that handle customer service, lead qualification, and repetitive tasks—while you focus on strategic growth." },
      { type: "heading", text: "What AI Agents Do" },
      { type: "list", text: "Week 4 automation covers:", items: [
        "Customer service agents: Available 24/7 with empathy",
        "Lead qualification: Auto-qualify and schedule consultations",
        "Workflow automation: Connect all your tools seamlessly",
        "Advanced AI deployment: Custom agents for your business"
      ]},
      { type: "heading", text: "Time Freedom Calculation" },
      { type: "list", text: "Automation frees up 20-30 hours per week:", items: [
        "Customer service replies: 8-10 hrs/week saved",
        "Lead qualification & scheduling: 5-8 hrs/week",
        "Email & content distribution: 3-5 hrs/week",
        "Invoice & payment reminders: 2-4 hrs/week"
      ]},
      { type: "heading", text: "Implementation Path" },
      { type: "list", text: "Roll out in 3 phases:", items: [
        "Phase 1: Quick wins (email automation, basic chatbot)",
        "Phase 2: Customer experience (lead agents, support)",
        "Phase 3: Advanced systems (custom AI, full integration)"
      ]},
      { type: "quote", text: "AI agents aren't replacing you—they're amplifying you by handling the work that drains your energy." }
    ]
  },
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
      { type: "paragraph", text: "Instead of asking 'write an email,' try 'write a warm but professional email to a potential client, introducing our new wellness retreat with a Forbes-meets-Vogue tone.' See the difference? Specificity is your superpower." },
      { type: "heading", text: "Your First AI Ritual" },
      { type: "list", text: "Start small and build from there:", items: [
        "Choose one repetitive task (scheduling, email responses, content creation)",
        "Spend 10 minutes crafting the perfect prompt",
        "Save your best prompts like recipes—you'll use them again",
        "Iterate and refine based on results"
      ]},
      { type: "paragraph", text: "The women who will thrive in this new era aren't the ones resisting AI—they're the ones treating it like the powerful tool it is, using it to amplify their unique voice and vision, not replace it." },
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
  },
  {
    slug: "ai-training-women-beginners-guide",
    title: "AI Training for Women: Complete Beginner's Guide to Learning AI in 2025",
    subtitle: "From zero AI knowledge to confident AI user: A step-by-step learning path designed specifically for women entering tech",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-30",
    readTime: 8,
    featured: true,
    image: "ai-prompts-boss",
    content: [
      { type: "paragraph", text: "If you're a woman looking to learn AI but feel intimidated by the technical jargon, overwhelmed by where to start, or worried you're 'too late'—this guide is for you. The truth? You're not too late. You're actually right on time. And learning AI doesn't require a computer science degree." },
      { type: "paragraph", text: "AI is the most important skill you can learn right now. Not coding. Not blockchain. AI. Because it's already changing how we work, create, and build businesses. And women who understand AI today will lead industries tomorrow." },
      { type: "heading", text: "Why Women Need AI Skills in 2025" },
      { type: "paragraph", text: "Here's the reality: only 26% of AI professionals are women. That's a massive gender gap—and a massive opportunity. The companies building AI desperately need diverse perspectives. The women entering AI now aren't catching up; they're shaping the future." },
      { type: "list", text: "AI skills give you:", items: [
        "Career leverage: Companies are hiring AI-literate professionals at premium salaries",
        "Entrepreneurial power: Start AI-powered businesses with minimal investment",
        "Creative amplification: Use AI to 10x your creative output (writing, design, strategy)",
        "Future-proofing: Understanding AI means you control it, not the other way around"
      ]},
      { type: "paragraph", text: "The women who will dominate 2025-2030 aren't the ones avoiding AI—they're the ones learning to use it strategically." },
      { type: "heading", text: "The Complete AI Learning Path for Beginners" },
      { type: "paragraph", text: "Forget expensive bootcamps. Here's how to learn AI systematically, for free or cheap, at your own pace:" },
      { type: "heading", text: "Phase 1: Foundation (Weeks 1-2)" },
      { type: "list", text: "Start with the basics:", items: [
        "Understand what AI actually is: Watch 'AI Explained' videos on YouTube to grasp machine learning, large language models (LLMs), and neural networks",
        "Create accounts: Sign up for ChatGPT, Claude, Google Gemini—all have free tiers",
        "Daily practice: Spend 20 minutes daily asking AI to help with real tasks (summarize articles, draft emails, brainstorm ideas)",
        "Learn prompt engineering: The #1 skill is asking AI the right questions. Practice writing clear, specific prompts"
      ]},
      { type: "heading", text: "Phase 2: Practical Skills (Weeks 3-6)" },
      { type: "list", text: "Get hands-on with AI tools:", items: [
        "Content creation: Use AI for writing blog posts, social media, marketing copy",
        "Data analysis: Upload spreadsheets to ChatGPT and ask it to find insights",
        "Image generation: Experiment with Midjourney, DALL-E, or Stable Diffusion",
        "Automation: Learn how to connect AI to workflows using Zapier or Make.com",
        "Build your first AI project: Create a personal AI assistant for a specific task"
      ]},
      { type: "heading", text: "Phase 3: Specialization (Weeks 7-12)" },
      { type: "paragraph", text: "Choose one area to go deep: AI for marketing, AI for writing, AI for data analysis, AI for business operations, or AI for creative work. Become known as 'the woman who knows AI + your specialty.'" },
      { type: "heading", text: "Best Free AI Learning Resources for Women" },
      { type: "list", text: "These resources are free and high-quality:", items: [
        "Google's AI Essentials Course (beginner-friendly, self-paced)",
        "DeepLearning.AI courses on Coursera (free to audit)",
        "Women in AI community events and workshops",
        "YouTube channels: AI Explained, Two Minute Papers, Lex Fridman",
        "Hands-on: Build projects with ChatGPT, Claude, or open-source AI tools"
      ]},
      { type: "heading", text: "The Skills Women Need Most in AI" },
      { type: "paragraph", text: "You don't need to learn Python (unless you want to). The highest-value AI skills for non-technical women are:" },
      { type: "list", text: "Critical AI skills:", items: [
        "Prompt engineering: Writing prompts that get excellent AI outputs",
        "AI ethics & bias awareness: Understanding limitations and risks",
        "Strategic thinking: Knowing when to use AI vs. when human judgment is needed",
        "Integration: Connecting AI tools to existing workflows and systems",
        "Communication: Translating AI capabilities to non-technical stakeholders"
      ]},
      { type: "heading", text: "Common Mistakes Women Make Learning AI" },
      { type: "paragraph", text: "Avoid these pitfalls: (1) Thinking you need to code first—you don't. Start with no-code AI tools. (2) Trying to learn everything at once—focus on one use case. (3) Learning in isolation—join Women in AI communities for support. (4) Not practicing daily—AI proficiency comes from consistent use, not theory." },
      { type: "heading", text: "Your 30-Day AI Learning Challenge" },
      { type: "list", text: "Here's your practical action plan:", items: [
        "Week 1: Use ChatGPT daily for work tasks. Track what works and what doesn't",
        "Week 2: Learn prompt engineering basics. Take a free course on effective prompting",
        "Week 3: Experiment with AI image generation. Create 10 images using different prompts",
        "Week 4: Build something real. Create an AI-powered system for your job or business"
      ]},
      { type: "heading", text: "Where Women Are Getting Hired in AI" },
      { type: "paragraph", text: "AI jobs for women without CS degrees include: AI prompt engineer ($70K-120K), AI content strategist ($60K-100K), AI ethics consultant ($80K-140K), AI product manager ($90K-150K), and AI customer success manager ($65K-95K). These roles value business acumen, communication, and strategic thinking over coding." },
      { type: "paragraph", text: "The best part? Many of these jobs didn't exist two years ago. We're all learning together. The woman who starts learning AI today has as much opportunity as anyone." },
      { type: "quote", text: "AI isn't replacing women in the workforce—it's amplifying those who learn to use it. The question isn't whether AI will change your career; it's whether you'll be leading that change or reacting to it. Start learning today." }
    ]
  },
  {
    slug: "personal-branding-women-tech-30-day-guide",
    title: "Personal Branding for Women in Tech: Build Your Thought Leadership in 30 Days",
    subtitle: "The complete blueprint for women to establish authority, grow their network, and become recognized tech leaders",
    category: "AI",
    author: "MetaHers Editorial",
    publishDate: "2025-10-31",
    readTime: 10,
    featured: true,
    image: "ai-prompts-boss",
    content: [
      { type: "paragraph", text: "Want to be known as a thought leader in AI or tech? Tired of watching less-qualified men get the speaking invitations, book deals, and press coverage you deserve? Ready to build a personal brand that opens doors and creates opportunities? You're in the right place." },
      { type: "paragraph", text: "Personal branding isn't vanity—it's visibility. And in tech, visibility is currency. The women who are leading AI, Web3, and emerging technologies aren't just talented; they're strategic about how they share their expertise, build their network, and position themselves as authorities." },
      { type: "heading", text: "Why Personal Branding Matters More for Women" },
      { type: "paragraph", text: "Let's be honest: men can show up to a tech conference and be assumed competent. Women have to prove it. A strong personal brand pre-validates your expertise. It means when you enter a room (virtual or physical), people already know your work, respect your opinion, and want to hear what you have to say." },
      { type: "paragraph", text: "Personal branding levels the playing field. It gives you control over your narrative instead of letting others define you." },
      { type: "heading", text: "The 30-Day Personal Brand Framework" },
      { type: "paragraph", text: "This isn't theory—this is the exact system successful women in tech use to build recognition. Here's the 30-day blueprint:" },
      { type: "heading", text: "Week 1: Foundation & Clarity" },
      { type: "list", text: "Define your positioning:", items: [
        "Day 1-3: Identify your unique expertise. What do you know that others don't? What's your superpower?",
        "Day 4-5: Define your audience. Who needs your knowledge? Who are you serving?",
        "Day 6-7: Craft your positioning statement: 'I help [audience] achieve [outcome] through [unique approach]'"
      ]},
      { type: "paragraph", text: "Example: 'I help women executives understand AI strategy without technical jargon, making them confident leaders in the AI era.'" },
      { type: "heading", text: "Week 2: Content Strategy & Presence" },
      { type: "list", text: "Build your online presence:", items: [
        "Day 8-10: Optimize your LinkedIn profile with keywords, clear headline, and compelling 'About' section",
        "Day 11-14: Create your content pillars—3-5 topics you'll consistently discuss (e.g., AI ethics, women in tech, prompt engineering, career growth)"
      ]},
      { type: "paragraph", text: "Your content should be 80% educational/valuable, 20% personal. Share insights, teach what you know, and occasionally share your journey." },
      { type: "heading", text: "Week 3: Consistent Publishing & Engagement" },
      { type: "list", text: "Start creating content daily:", items: [
        "Day 15-21: Publish daily on LinkedIn—short posts (100-300 words), insights from your work, industry observations",
        "Day 15-21: Engage authentically—comment on 5-10 posts daily from people in your industry. Add value, don't just say 'great post!'",
        "Day 15-21: Share your first long-form article (LinkedIn article or Medium post) on a topic you're expert in"
      ]},
      { type: "heading", text: "Week 4: Amplification & Authority Building" },
      { type: "list", text: "Scale your visibility:", items: [
        "Day 22-24: Apply to speak at 3 virtual events or webinars in your niche",
        "Day 25-27: Guest post on industry blogs or podcasts in your space",
        "Day 28-30: Launch your signature content series (weekly newsletter, video series, or podcast)"
      ]},
      { type: "heading", text: "The Content Formula That Works" },
      { type: "paragraph", text: "The highest-performing personal brand content follows this formula: Hook (grab attention in 1 line) + Context (what's the problem?) + Insight (your unique perspective) + Action (what should they do now?). Example: Hook: 'AI won't take your job. Someone using AI will.' Context: 'Women are underrepresented in AI conversations.' Insight: 'But women bring essential perspectives on ethics, usability, and impact.' Action: 'Start learning AI today—here's how...'" },
      { type: "heading", text: "Platforms That Matter Most for Women in Tech" },
      { type: "list", text: "Focus your energy here:", items: [
        "LinkedIn: #1 platform for professional thought leadership. Post 3-5x per week minimum",
        "Twitter/X: Real-time conversations, industry news, connecting with other thought leaders",
        "Substack/Medium: Long-form content that showcases deep expertise",
        "YouTube/TikTok: Video is exploding for tech content—short tutorials, insights, behind-the-scenes"
      ]},
      { type: "paragraph", text: "Don't try to be everywhere. Master 1-2 platforms first, then expand." },
      { type: "heading", text: "How to Stand Out in a Crowded Market" },
      { type: "paragraph", text: "Everyone can share AI news. You need a unique angle. Here's what works: (1) Personal experience: Share what you're building, learning, failing at. (2) Contrarian takes: Challenge conventional wisdom (respectfully). (3) Practical how-tos: Teach specific, actionable skills. (4) Data-driven insights: Share statistics, research, case studies. (5) Story-driven content: People remember stories, not facts." },
      { type: "heading", text: "Common Personal Branding Mistakes Women Make" },
      { type: "paragraph", text: "Avoid these pitfalls: (1) Waiting to feel 'ready'—you'll never feel ready. Start before you're ready. (2) Being too humble—share your wins. Men do it constantly. You should too. (3) Only posting when you have something to sell—build trust first, sell later. (4) Copying others' voices—your unique perspective is your competitive advantage. (5) Inconsistency—posting once a month won't build momentum. Daily engagement matters." },
      { type: "heading", text: "What Success Looks Like After 30 Days" },
      { type: "paragraph", text: "After 30 days of consistent personal branding, you should see: 500-2,000 new LinkedIn connections, 10-50K content impressions, 3-5 speaking or collaboration opportunities, recognition as 'that person who talks about X', and most importantly—confidence in your unique value." },
      { type: "paragraph", text: "The biggest transformation isn't external—it's internal. You start to see yourself as a thought leader. And that changes everything." },
      { type: "heading", text: "Your Personal Branding Action Plan" },
      { type: "list", text: "Start today:", items: [
        "Define your unique positioning in one sentence",
        "Optimize your LinkedIn headline and About section",
        "Publish your first post sharing an insight from your work",
        "Engage authentically on 10 posts in your industry",
        "Commit to 30 days of consistent content"
      ]},
      { type: "paragraph", text: "Personal branding isn't about becoming internet-famous. It's about being recognized for your expertise so opportunities come to you instead of you chasing them. It's about having a voice that matters. It's about building the career and influence you deserve." },
      { type: "quote", text: "The most dangerous career move is being invisible. In tech, your expertise doesn't matter if no one knows about it. Build your personal brand like your career depends on it—because it does." }
    ]
  },
  {
    slug: "women-web3-careers-complete-roadmap",
    title: "Women in Web3 Careers: Complete Roadmap to Blockchain Jobs in 2025",
    subtitle: "From zero blockchain knowledge to landing your first Web3 role: A practical guide for women entering decentralized tech",
    category: "Web3",
    author: "MetaHers Editorial",
    publishDate: "2025-10-31",
    readTime: 9,
    featured: false,
    image: "web3-evolution",
    content: [
      { type: "paragraph", text: "Web3 isn't the future—it's the present for women who want high-paying, remote-first careers in emerging tech. While traditional tech companies are laying off thousands, Web3 projects are hiring aggressively. And unlike Silicon Valley's bro culture, Web3 communities are actively recruiting women." },
      { type: "paragraph", text: "The best part? You don't need a computer science degree. You don't need to be a developer. You need curiosity, strategic learning, and the courage to enter an industry where the rulebook is still being written." },
      { type: "heading", text: "Why Web3 Careers Are Perfect for Women" },
      { type: "paragraph", text: "Web3 offers what traditional tech often doesn't: Remote-first from day one (work from anywhere), competitive pay in crypto (often above market rates), ownership culture (equity through tokens), flexible hours (asynchronous work is standard), and merit-based advancement (your contributions matter more than your pedigree)." },
      { type: "paragraph", text: "And here's the uncomfortable truth: Web3 is creating new industries where women can enter on equal footing. No old boys' clubs. No gatekeepers. Just capability and contribution." },
      { type: "heading", text: "Top Web3 Careers for Women (No Coding Required)" },
      { type: "list", text: "These roles are in high demand:", items: [
        "Community Manager ($50K-100K): Build and manage Discord/Telegram communities for Web3 projects",
        "DAO Operations ($60K-120K): Coordinate decentralized autonomous organizations—like project management for the future",
        "Web3 Content Creator ($40K-90K): Write educational content, ghostwrite for founders, manage social media",
        "NFT Marketing Specialist ($55K-110K): Strategy and campaigns for NFT launches and projects",
        "Tokenomics Analyst ($70K-140K): Design economic models for crypto tokens (research + analysis skills)",
        "DeFi Community Lead ($65K-130K): Educate users about decentralized finance products",
        "Metaverse Experience Designer ($60K-120K): Design virtual events, spaces, and activations",
        "Web3 Partnerships Manager ($70K-150K): Build relationships between protocols, DAOs, and companies"
      ]},
      { type: "paragraph", text: "Notice the pay ranges? They're competitive with Big Tech, often with token upside on top of base salary." },
      { type: "heading", text: "The 90-Day Roadmap to Your First Web3 Job" },
      { type: "heading", text: "Month 1: Foundation & Orientation" },
      { type: "list", text: "Start here:", items: [
        "Week 1: Set up your crypto wallet (MetaMask or Rainbow), buy $50-100 of ETH to learn by doing",
        "Week 2: Join 3 Web3 communities (DAOs, Discord servers, Twitter Spaces) and lurk to learn the culture",
        "Week 3: Follow 50 Web3-native women on Twitter, read everything they share for 7 days",
        "Week 4: Take a free blockchain fundamentals course (Coursera, Udemy, or CryptoZombies)"
      ]},
      { type: "heading", text: "Month 2: Build Skills & Reputation" },
      { type: "list", text: "Get hands-on:", items: [
        "Week 5-6: Contribute for free in one DAO—answer questions, help with documentation, participate in governance",
        "Week 7: Write your first Web3 article on Mirror or Medium about what you're learning",
        "Week 8: Mint your first NFT (even if it's just a profile picture) to understand the creator experience"
      ]},
      { type: "paragraph", text: "This builds your Web3 'proof of work'—evidence you understand the space and add value." },
      { type: "heading", text: "Month 3: Apply & Network Strategically" },
      { type: "list", text: "Land the role:", items: [
        "Week 9-10: Apply to 10-15 Web3 jobs on Crypto Jobs List, Web3 Career, or Bankless Jobs Board",
        "Week 11: Reach out to 5 women working in Web3, ask for 15-minute informational interviews",
        "Week 12: Complete paid bounties on platforms like Layer3, Rabbithole, or Dework to earn while you learn"
      ]},
      { type: "heading", text: "Essential Web3 Skills Employers Want" },
      { type: "list", text: "Master these:", items: [
        "Blockchain basics: Understand how blockchain, smart contracts, and wallets work (not coding—conceptual knowledge)",
        "Web3 tools fluency: Know how to use MetaMask, Discord, Notion, Twitter, and basic on-chain tools",
        "Community building: Ability to grow, engage, and moderate online communities",
        "Clear communication: Translate complex crypto concepts to non-technical audiences",
        "Self-direction: Work autonomously without constant management (Web3 is remote and async)",
        "Cultural fluency: Understand Web3 values (decentralization, transparency, ownership)"
      ]},
      { type: "heading", text: "How to Stand Out as a Woman in Web3" },
      { type: "paragraph", text: "Be visible. Share your learning journey on Twitter. Post about what you're discovering. Ask questions publicly. Women who document their Web3 learning get noticed by projects looking to hire curious, engaged people." },
      { type: "paragraph", text: "Join women-specific Web3 communities: Women in Web3, SheFi, Boys Club, Crypto Chicks. These groups share job opportunities, mentorship, and support you won't find elsewhere." },
      { type: "heading", text: "The Compensation Reality: What You'll Actually Earn" },
      { type: "paragraph", text: "Web3 salaries typically include: Base salary (in USD stablecoins or fiat), token allocation (equity in the project), and bounty/bonus opportunities (performance-based rewards). Total compensation often exceeds traditional tech by 20-40% when tokens perform well. But volatility is real—your $80K comp package might be worth $100K next month or $60K. Budget conservatively." },
      { type: "heading", text: "Common Mistakes Women Make Entering Web3" },
      { type: "paragraph", text: "Avoid these: (1) Trying to learn everything before starting—you'll learn faster by doing. (2) Only applying to 'perfect fit' roles—Web3 roles are fluid; skills matter more than titles. (3) Ignoring the community aspect—Web3 jobs come from relationships, not LinkedIn applications. (4) Not asking for help—Web3 community is supportive; people will guide you if you ask." },
      { type: "heading", text: "Best Resources for Women Learning Web3" },
      { type: "list", text: "Free and valuable:", items: [
        "Courses: Coursera Blockchain Basics, Buildspace (project-based learning), Rabbithole (learn-to-earn)",
        "Communities: SheFi DAO (DeFi education for women), Women in Web3 (global community)",
        "Content: Bankless podcast, The Defiant newsletter, Unchained by Laura Shin",
        "Practice: Join Gitcoin grants, participate in DAO governance, try DeFi protocols with small amounts"
      ]},
      { type: "paragraph", text: "The barrier to entry in Web3 isn't technical skill—it's willingness to learn publicly, contribute before you're paid, and embrace uncertainty. If you can do that, opportunities are abundant." },
      { type: "heading", text: "Your First Step Into Web3 Careers" },
      { type: "paragraph", text: "Start today: (1) Set up a crypto wallet. (2) Join one Web3 community on Discord. (3) Follow 10 women working in Web3 on Twitter. (4) Read one article about blockchain fundamentals. That's it. Small steps, consistent progress. In 90 days, you could be earning in crypto from anywhere in the world." },
      { type: "quote", text: "Web3 isn't just about technology—it's about who gets to build the future of the internet. Women who enter Web3 now aren't late; they're early to the biggest wealth and career opportunity of the decade. The question is: will you be building it, or watching it happen?" }
    ]
  },
  {
    slug: "web3-blockchain-ownership-economy",
    title: "The Web3 Ownership Economy: Why Blockchain is Your Key to Digital Wealth",
    subtitle: "Understanding the rise of decentralized ownership and how to claim your stake",
    category: "Web3",
    author: "MetaHers Editorial",
    publishDate: "2025-10-29",
    readTime: 8,
    featured: true,
    image: "web3-ownership-economy",
    content: [
      { type: "paragraph", text: "The internet we know today (Web2) is built on platforms. You create content, but the platform owns it. You build an audience, but the platform controls access. The emerging internet (Web3) flips this: You own your assets, your data, and your digital identity. This is the Ownership Economy." },
      { type: "paragraph", text: "Blockchain technology is the engine of this shift. It allows for verifiable, decentralized ownership of digital and physical assets, creating new ways to earn, invest, and participate." },
      { type: "heading", text: "What Does 'Ownership' Mean in Web3?" },
      { type: "paragraph", text: "In Web2, you *use* services. In Web3, you *own* parts of them. This ownership comes in various forms:" },
      { type: "list", text: "Types of Web3 Ownership:", items: [
        "Cryptocurrencies: Owning digital money like Bitcoin or Ether, with value driven by supply, demand, and utility.",
        "NFTs (Non-Fungible Tokens): Owning unique digital items – art, music, collectibles, virtual land, access passes – verified on the blockchain.",
        "Tokens: Holding governance tokens for DAOs (Decentralized Autonomous Organizations), giving you voting rights and a stake in the project's future.",
        "Decentralized Finance (DeFi) Assets: Earning yield on your crypto through lending, staking, or liquidity provision.",
        "Digital Identity: Owning your data and reputation, controlled by you, not platforms."
      ]},
      { type: "paragraph", text: "This shift from renting to owning fundamentally changes the relationship between users, creators, and platforms. Value accrues to the participants, not just the intermediaries." },
      { type: "heading", text: "Why Women Need to Embrace the Ownership Economy" },
      { type: "paragraph", text: "Historically, women have faced systemic barriers to wealth creation. The Ownership Economy, with its emphasis on decentralized access and meritocracy, offers a powerful new pathway." },
      { type: "list", text: "Benefits for women:", items: [
        "Financial Sovereignty: Take control of your assets and investments, free from traditional financial gatekeepers.",
        "Creator Economy Empowerment: Earn directly from your content and creations without platform fees or censorship.",
        "Global Access: Participate in financial systems and investment opportunities regardless of your location or background.",
        "Inclusive Governance: Influence the direction of projects and communities you care about through token-based voting in DAOs.",
        "New Career Paths: Build careers in areas like DeFi, NFT creation, community management, and tokenomics."
      ]},
      { type: "paragraph", text: "The women who understand and engage with Web3 now are positioning themselves to benefit from the next major economic transformation." },
      { type: "heading", text: "Getting Started: Claiming Your Stake" },
      { type: "paragraph", text: "Don't be intimidated by the jargon. The first steps are simple and accessible:" },
      { type: "list", text: "Actionable Steps:", items: [
        "Get a Wallet: Set up a non-custodial wallet like MetaMask or Phantom. This is your gateway to Web3.",
        "Acquire Crypto: Buy a small amount of a major cryptocurrency (like ETH) on a reputable exchange to learn how transactions work.",
        "Explore NFTs: Browse NFT marketplaces (OpenSea, Foundation) to see what's being created and collected. Consider minting your own art or content.",
        "Join a DAO: Find a DAO focused on your interests (e.g., women in tech, art, sustainability) and participate in discussions.",
        "Learn DeFi Basics: Explore simple yield-generating strategies (like staking) with small amounts.",
        "Stay Informed: Follow reputable Web3 news sources and thought leaders, especially women in the space."
      ]},
      { type: "paragraph", text: "The key is to start learning by doing. Treat it like exploring a new neighborhood – take small steps, observe, and gradually build confidence." },
      { type: "heading", text: "The Future is Owned" },
      { type: "paragraph", text: "The transition to a Web3 Ownership Economy is underway. It promises a more equitable, transparent, and user-centric digital world. For women, it represents an unprecedented opportunity to build wealth, influence, and freedom on their own terms." },
      { type: "quote", text: "In the Ownership Economy, your participation is your power. Don't just be a user—be an owner. The future is decentralized, and it's yours to build." }
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

// ===== FOUNDER'S SANCTUARY ACCELERATOR =====

// Accelerator cohorts table
export const acceleratorCohorts = pgTable("accelerator_cohorts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // e.g., "Winter 2026"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  applicationDeadline: timestamp("application_deadline").notNull(),
  maxParticipants: integer("max_participants").default(100).notNull(),
  currentParticipants: integer("current_participants").default(0).notNull(),
  price: integer("price").default(990).notNull(), // in dollars
  status: varchar("status").default("upcoming").notNull(), // upcoming, active, completed
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAcceleratorCohortSchema = createInsertSchema(acceleratorCohorts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAcceleratorCohort = z.infer<typeof insertAcceleratorCohortSchema>;
export type AcceleratorCohortDB = typeof acceleratorCohorts.$inferSelect;

// Accelerator milestones table
export const acceleratorMilestones = pgTable("accelerator_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  stage: varchar("stage").notNull(), // clarity, creation, momentum
  weekStart: integer("week_start").notNull(),
  weekEnd: integer("week_end").notNull(),
  order: integer("order").notNull(), // 1-11
  resources: jsonb("resources").$type<{ title: string; url: string; type: string }[]>().default(sql`'[]'::jsonb`),
  requiredFor: jsonb("required_for").$type<string[]>().default(sql`'[]'::jsonb`), // milestone IDs that depend on this one
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAcceleratorMilestoneSchema = createInsertSchema(acceleratorMilestones).omit({ id: true, createdAt: true });
export type InsertAcceleratorMilestone = z.infer<typeof insertAcceleratorMilestoneSchema>;
export type AcceleratorMilestoneDB = typeof acceleratorMilestones.$inferSelect;

// Accelerator enrollments table
export const acceleratorEnrollments = pgTable("accelerator_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cohortId: varchar("cohort_id").notNull().references(() => acceleratorCohorts.id, { onDelete: "cascade" }),
  status: varchar("status").default("applied").notNull(), // applied, accepted, active, completed, withdrawn
  applicationData: jsonb("application_data").$type<{
    businessIdea?: string;
    targetCustomer?: string;
    weeklyCommitment?: number;
    experience?: string;
    goals?: string;
  }>(),
  paidAt: timestamp("paid_at"),
  completedAt: timestamp("completed_at"),
  milestonesCompleted: integer("milestones_completed").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_enrollment_user").on(table.userId),
  index("idx_enrollment_cohort").on(table.cohortId),
  uniqueIndex("idx_enrollment_user_cohort_unique").on(table.userId, table.cohortId),
]);

export const insertAcceleratorEnrollmentSchema = createInsertSchema(acceleratorEnrollments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAcceleratorEnrollment = z.infer<typeof insertAcceleratorEnrollmentSchema>;
export type AcceleratorEnrollmentDB = typeof acceleratorEnrollments.$inferSelect;

// Accelerator milestone progress table
export const acceleratorMilestoneProgress = pgTable("accelerator_milestone_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull().references(() => acceleratorEnrollments.id, { onDelete: "cascade" }),
  milestoneId: varchar("milestone_id").notNull().references(() => acceleratorMilestones.id, { onDelete: "cascade" }),
  status: varchar("status").default("not_started").notNull(), // not_started, in_progress, completed, blocked
  progress: integer("progress").default(0).notNull(), // 0-100
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_milestone_progress_enrollment").on(table.enrollmentId),
  index("idx_milestone_progress_milestone").on(table.milestoneId),
  uniqueIndex("idx_milestone_progress_enrollment_milestone_unique").on(table.enrollmentId, table.milestoneId),
]);

export const insertAcceleratorMilestoneProgressSchema = createInsertSchema(acceleratorMilestoneProgress).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAcceleratorMilestoneProgress = z.infer<typeof insertAcceleratorMilestoneProgressSchema>;
export type AcceleratorMilestoneProgressDB = typeof acceleratorMilestoneProgress.$inferSelect;

// ===== METAHERS CIRCLE - WOMEN'S NETWORKING & MARKETPLACE =====

// Women's profiles table
export const womenProfiles = pgTable("women_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  headline: varchar("headline"),
  bio: text("bio"),
  location: varchar("location"),
  profileImage: varchar("profile_image"),
  visibility: varchar("visibility").default("public").notNull(),
  lookingFor: jsonb("looking_for").$type<string[]>().default(sql`'[]'::jsonb`),
  availability: varchar("availability").default("active").notNull(),
  verifiedMember: boolean("verified_member").default(false).notNull(),
  completionPercentage: integer("completion_percentage").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_profile_user").on(table.userId),
  index("idx_profile_visibility").on(table.visibility),
]);

export const insertWomenProfileSchema = createInsertSchema(womenProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWomenProfile = z.infer<typeof insertWomenProfileSchema>;
export type WomenProfileDB = typeof womenProfiles.$inferSelect;

// Profile skills table
export const profileSkills = pgTable("profile_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => womenProfiles.id, { onDelete: "cascade" }),
  skillName: varchar("skill_name").notNull(),
  proficiency: varchar("proficiency").default("intermediate").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_skill_profile").on(table.profileId),
]);

export const insertProfileSkillSchema = createInsertSchema(profileSkills).omit({ id: true, createdAt: true });
export type InsertProfileSkill = z.infer<typeof insertProfileSkillSchema>;
export type ProfileSkillDB = typeof profileSkills.$inferSelect;

// Direct messages table
export const directMessages = pgTable("direct_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: varchar("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_message_sender").on(table.senderId),
  index("idx_message_recipient").on(table.recipientId),
]);

export const insertDirectMessageSchema = createInsertSchema(directMessages).omit({ id: true, createdAt: true });
export type InsertDirectMessage = z.infer<typeof insertDirectMessageSchema>;
export type DirectMessageDB = typeof directMessages.$inferSelect;

// Skills trading listings table
export const skillsTrades = pgTable("skills_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => womenProfiles.id, { onDelete: "cascade" }),
  havingSkill: varchar("having_skill").notNull(),
  wantingSkill: varchar("wanting_skill").notNull(),
  description: text("description"),
  status: varchar("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_trade_profile").on(table.profileId),
  index("idx_trade_status").on(table.status),
]);

export const insertSkillsTradeSchema = createInsertSchema(skillsTrades).omit({ id: true, createdAt: true });
export type InsertSkillsTrade = z.infer<typeof insertSkillsTradeSchema>;
export type SkillsTradeDB = typeof skillsTrades.$inferSelect;

// Profile services table
export const profileServices = pgTable("profile_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => womenProfiles.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  rate: varchar("rate"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_service_profile").on(table.profileId),
]);

export const insertProfileServiceSchema = createInsertSchema(profileServices).omit({ id: true, createdAt: true });
export type InsertProfileService = z.infer<typeof insertProfileServiceSchema>;
export type ProfileServiceDB = typeof profileServices.$inferSelect;

// Opportunities board table
export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posterId: varchar("poster_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(),
  compensation: varchar("compensation"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_opportunity_poster").on(table.posterId),
]);

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({ id: true, createdAt: true });
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type OpportunityDB = typeof opportunities.$inferSelect;

// Profile activity feed table
export const profileActivityFeed = pgTable("profile_activity_feed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => womenProfiles.id, { onDelete: "cascade" }),
  activityType: varchar("activity_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  visibility: varchar("visibility").default("public").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_activity_profile").on(table.profileId),
  index("idx_activity_type").on(table.activityType),
]);

export const insertProfileActivityFeedSchema = createInsertSchema(profileActivityFeed).omit({ id: true, createdAt: true });
export type InsertProfileActivityFeed = z.infer<typeof insertProfileActivityFeedSchema>;
export type ProfileActivityFeedDB = typeof profileActivityFeed.$inferSelect;

// Onboarding Quiz Responses table
export const quizResponses = pgTable("quiz_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  goal: varchar("goal").notNull(), // "master_ai", "build_web3", "own_authority", "advance_career"
  experienceLevel: varchar("experience_level").notNull(), // "beginner", "intermediate", "comfortable", "expert"
  role: varchar("role").notNull(), // "solopreneur", "mom", "creative", "executive", "freelancer"
  timeAvailability: varchar("time_availability").notNull(), // "casual", "5hrs_week", "intensive"
  painPoint: varchar("pain_point").notNull(), // "overwhelmed", "tech_scared", "no_time", "imposter_syndrome"
  learningStyle: varchar("learning_style").notNull(), // "video", "written", "interactive", "coaching"
  recommendedExperiences: jsonb("recommended_experiences").$type<string[]>().notNull().default(sql`'[]'::jsonb`), // array of experience slugs
  completedAt: timestamp("completed_at").defaultNow(),
}, (table) => [
  index("idx_quiz_user").on(table.userId),
  index("idx_quiz_completed").on(table.completedAt),
]);

export const insertQuizResponseSchema = createInsertSchema(quizResponses).omit({ id: true, completedAt: true });
export type InsertQuizResponse = z.infer<typeof insertQuizResponseSchema>;
export type QuizResponseDB = typeof quizResponses.$inferSelect;

// ===== AI MASTERY PROGRAM (Learning Hub) =====

// AI Mastery enrollment table
export const aiMasteryEnrollment = pgTable("ai_mastery_enrollment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  tier: varchar("tier").notNull().default("basic"), // basic, premium
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("idx_ai_mastery_enrollment_user").on(table.userId),
]);

export const insertAiMasteryEnrollmentSchema = createInsertSchema(aiMasteryEnrollment).omit({ id: true, enrolledAt: true });
export type InsertAiMasteryEnrollment = z.infer<typeof insertAiMasteryEnrollmentSchema>;
export type AiMasteryEnrollmentDB = typeof aiMasteryEnrollment.$inferSelect;

// AI Mastery module progress
export const aiMasteryModuleProgress = pgTable("ai_mastery_module_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id").notNull(), // "week_1", "week_2", etc.
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  totalLessons: integer("total_lessons").notNull().default(5),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("idx_module_progress_user").on(table.userId),
  uniqueIndex("idx_module_progress_user_module_unique").on(table.userId, table.moduleId),
]);

export const insertAiMasteryModuleProgressSchema = createInsertSchema(aiMasteryModuleProgress).omit({ id: true, startedAt: true });
export type InsertAiMasteryModuleProgress = z.infer<typeof insertAiMasteryModuleProgressSchema>;
export type AiMasteryModuleProgressDB = typeof aiMasteryModuleProgress.$inferSelect;

// Live sessions
export const liveSessions = pgTable("live_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  videoUrl: varchar("video_url"),
  attendeeCount: integer("attendee_count").notNull().default(0),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_session_start").on(table.startTime),
]);

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({ id: true, createdAt: true });
export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type LiveSessionDB = typeof liveSessions.$inferSelect;

// Community activity feed
export const communityActivity = pgTable("community_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  activityType: varchar("activity_type").notNull(), // "completed_module", "milestone", "achievement"
  title: varchar("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_activity_user").on(table.userId),
  index("idx_activity_created").on(table.createdAt),
]);

export const insertCommunityActivitySchema = createInsertSchema(communityActivity).omit({ id: true, createdAt: true });
export type InsertCommunityActivity = z.infer<typeof insertCommunityActivitySchema>;
export type CommunityActivityDB = typeof communityActivity.$inferSelect;

// Direct messages (user to Nadia)
export const aiMasteryMessages = pgTable("ai_mastery_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderType: varchar("sender_type").notNull(), // "user" or "nadia"
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_message_user").on(table.userId),
  index("idx_message_created").on(table.createdAt),
]);

export const insertAiMasteryMessageSchema = createInsertSchema(aiMasteryMessages).omit({ id: true, createdAt: true });
export type InsertAiMasteryMessage = z.infer<typeof insertAiMasteryMessageSchema>;
export type AiMasteryMessageDB = typeof aiMasteryMessages.$inferSelect;

// User Events (for analytics, sponsored ads attribution, engagement tracking)
export const userEvents = pgTable("user_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: varchar("event_type").notNull(), // "signup", "purchase", "ritual_complete", "journal_entry", "ad_impression", "ad_click", "onboarding_complete"
  eventName: varchar("event_name").notNull(),
  properties: jsonb("properties").$type<Record<string, any>>(),
  adCampaignId: varchar("ad_campaign_id"), // For sponsored ad tracking
  source: varchar("source"), // "organic", "paid_ad", "referral"
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_events_user").on(table.userId),
  index("idx_events_type").on(table.eventType),
  index("idx_events_created").on(table.createdAt),
  index("idx_events_campaign").on(table.adCampaignId),
]);

export const insertUserEventSchema = createInsertSchema(userEvents).omit({ id: true, createdAt: true });
export type InsertUserEvent = z.infer<typeof insertUserEventSchema>;
export type UserEventDB = typeof userEvents.$inferSelect;

// Sponsored Ads (for platform-wide ad management)
export const sponsoredAds = pgTable("sponsored_ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  ctaUrl: varchar("cta_url"),
  placementType: varchar("placement_type").notNull(), // "dashboard_hero", "sidebar", "ritual_card", "journal_prompt"
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_ads_campaign").on(table.campaignId),
  index("idx_ads_active").on(table.isActive),
  index("idx_ads_placement").on(table.placementType),
]);

export const insertSponsoredAdSchema = createInsertSchema(sponsoredAds).omit({ id: true, createdAt: true });
export type InsertSponsoredAd = z.infer<typeof insertSponsoredAdSchema>;
export type SponsoredAdDB = typeof sponsoredAds.$inferSelect;

// ===== VISION BOARD 2026 =====

// Vision Board main table - stores user's annual vision board
export const visionBoards = pgTable("vision_boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  year: integer("year").notNull().default(2026),
  coreWord: varchar("core_word"), // User's single word for the year
  futureSelfMessage: text("future_self_message"), // Message from future self
  focusDimensions: jsonb("focus_dimensions").$type<string[]>().default(sql`'[]'::jsonb`), // Selected life areas
  status: varchar("status").notNull().default("draft"), // draft, intention_set, tiles_created, complete
  aiMuse: jsonb("ai_muse").$type<{ personality?: string; encouragements?: string[] }>(), // AI Muse configuration
  layoutConfig: jsonb("layout_config").$type<{ columns?: number; style?: string }>(),
  isPublic: boolean("is_public").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vb_user").on(table.userId),
  index("idx_vb_year").on(table.year),
  index("idx_vb_status").on(table.status),
]);

export const insertVisionBoardSchema = createInsertSchema(visionBoards).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVisionBoard = z.infer<typeof insertVisionBoardSchema>;
export type VisionBoardDB = typeof visionBoards.$inferSelect;

// Vision Tile - individual vision items on the board
export const visionTiles = pgTable("vision_tiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").notNull().references(() => visionBoards.id, { onDelete: "cascade" }),
  dimension: varchar("dimension").notNull(), // career, wealth, learning, wellness, relationships, lifestyle, impact
  title: varchar("title").notNull(),
  affirmation: text("affirmation"), // AI-generated affirmation
  imagePrompt: text("image_prompt"), // Prompt used to generate image
  imageUrl: text("image_url"), // Generated or user-uploaded image
  isAiGenerated: boolean("is_ai_generated").default(true).notNull(),
  position: integer("position").default(0).notNull(), // Order on board
  gridPosition: jsonb("grid_position").$type<{ row: number; col: number; span?: number }>(),
  userNotes: text("user_notes"), // User's personal notes
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_tile_board").on(table.boardId),
  index("idx_tile_dimension").on(table.dimension),
]);

export const insertVisionTileSchema = createInsertSchema(visionTiles).omit({ id: true, createdAt: true });
export type InsertVisionTile = z.infer<typeof insertVisionTileSchema>;
export type VisionTileDB = typeof visionTiles.$inferSelect;

// Vision Sisters - community matching for accountability
export const visionSisters = pgTable("vision_sisters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchedUserId: varchar("matched_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchScore: integer("match_score").default(0).notNull(), // 0-100 compatibility score
  sharedDimensions: jsonb("shared_dimensions").$type<string[]>().default(sql`'[]'::jsonb`),
  sharedCoreThemes: jsonb("shared_core_themes").$type<string[]>().default(sql`'[]'::jsonb`),
  status: varchar("status").notNull().default("pending"), // pending, connected, declined
  connectedAt: timestamp("connected_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vs_user").on(table.userId),
  index("idx_vs_matched").on(table.matchedUserId),
  index("idx_vs_status").on(table.status),
]);

export const insertVisionSisterSchema = createInsertSchema(visionSisters).omit({ id: true, createdAt: true });
export type InsertVisionSister = z.infer<typeof insertVisionSisterSchema>;
export type VisionSisterDB = typeof visionSisters.$inferSelect;

// Vision Board Refresh Reminders - quarterly check-ins
export const visionReminders = pgTable("vision_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  boardId: varchar("board_id").notNull().references(() => visionBoards.id, { onDelete: "cascade" }),
  reminderType: varchar("reminder_type").notNull(), // quarterly_review, annual_reset, dimension_focus
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vr_user").on(table.userId),
  index("idx_vr_scheduled").on(table.scheduledFor),
]);

export const insertVisionReminderSchema = createInsertSchema(visionReminders).omit({ id: true, createdAt: true });
export type InsertVisionReminder = z.infer<typeof insertVisionReminderSchema>;
export type VisionReminderDB = typeof visionReminders.$inferSelect;

// ===== AI DIGITAL AGENCY SYSTEM =====

// Business profile types
export type BusinessGoal = 'brand_growth' | 'sales' | 'content_creation' | 'automation' | 'authority' | 'consistency';
export type SocialPlatform = 'instagram' | 'tiktok' | 'linkedin' | 'x' | 'pinterest' | 'youtube' | 'substack';
export type AgentRole = 'strategist' | 'social_media' | 'visual_designer' | 'video_director' | 'copywriter' | 'analyst' | 'scheduler';
export type AssetType = 'post' | 'carousel' | 'reel_script' | 'tiktok_script' | 'image_prompt' | 'moodboard' | 'email' | 'newsletter' | 'landing_copy' | 'ad_copy' | 'strategy';

// Agency Business Profiles - stores user's business information
export const agencyBusinesses = pgTable("agency_businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessName: varchar("business_name").notNull(),
  brandStory: text("brand_story"),
  industry: varchar("industry"),
  targetAudience: text("target_audience"),
  products: text("products"), // Products/services description
  colorPalette: jsonb("color_palette").$type<{ primary?: string; secondary?: string; accent?: string; neutral?: string }>(),
  aestheticPreferences: text("aesthetic_preferences"),
  contentStyle: varchar("content_style"), // professional, casual, playful, luxurious, educational
  goals: jsonb("goals").$type<BusinessGoal[]>().default(sql`'[]'::jsonb`),
  platforms: jsonb("platforms").$type<SocialPlatform[]>().default(sql`'[]'::jsonb`),
  competitorUrls: jsonb("competitor_urls").$type<string[]>().default(sql`'[]'::jsonb`),
  uniqueValueProp: text("unique_value_prop"),
  idealClientProfile: text("ideal_client_profile"),
  brandVoice: text("brand_voice"), // Tone and voice description
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_ab_user").on(table.userId),
  index("idx_ab_active").on(table.isActive),
]);

export const insertAgencyBusinessSchema = createInsertSchema(agencyBusinesses).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAgencyBusiness = z.infer<typeof insertAgencyBusinessSchema>;
export type AgencyBusinessDB = typeof agencyBusinesses.$inferSelect;

// Agency Strategy Packages - generated brand strategies
export const agencyStrategies = pgTable("agency_strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  brandPositioning: text("brand_positioning"),
  messagingPillars: jsonb("messaging_pillars").$type<{ pillar: string; description: string }[]>().default(sql`'[]'::jsonb`),
  idealClientProfile: text("ideal_client_profile"),
  competitorDifferentiation: text("competitor_differentiation"),
  contentPillars: jsonb("content_pillars").$type<{ name: string; topics: string[]; frequency: string }[]>().default(sql`'[]'::jsonb`),
  weeklyCalendar: jsonb("weekly_calendar").$type<{ day: string; platform: string; contentType: string; topic: string }[]>().default(sql`'[]'::jsonb`),
  monthlyThemes: jsonb("monthly_themes").$type<{ week: number; theme: string; focus: string }[]>().default(sql`'[]'::jsonb`),
  keyMessages: jsonb("key_messages").$type<string[]>().default(sql`'[]'::jsonb`),
  toneGuidelines: text("tone_guidelines"),
  hashtagStrategy: jsonb("hashtag_strategy").$type<{ primary: string[]; secondary: string[]; branded: string[] }>(),
  status: varchar("status").notNull().default("draft"), // draft, generating, complete, archived
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_as_business").on(table.businessId),
  index("idx_as_status").on(table.status),
]);

export const insertAgencyStrategySchema = createInsertSchema(agencyStrategies).omit({ id: true, createdAt: true });
export type InsertAgencyStrategy = z.infer<typeof insertAgencyStrategySchema>;
export type AgencyStrategyDB = typeof agencyStrategies.$inferSelect;

// Agency Sessions - tracks multi-agent orchestration runs
export const agencySessions = pgTable("agency_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  strategyId: varchar("strategy_id").references(() => agencyStrategies.id, { onDelete: "set null" }),
  sessionType: varchar("session_type").notNull(), // full_package, content_batch, strategy_only, visual_only
  status: varchar("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  progress: integer("progress").default(0).notNull(), // 0-100 percentage
  currentAgent: varchar("current_agent"), // Which agent is currently active
  sharedContext: jsonb("shared_context").$type<Record<string, any>>(), // Shared memory between agents
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_ase_business").on(table.businessId),
  index("idx_ase_status").on(table.status),
]);

export const insertAgencySessionSchema = createInsertSchema(agencySessions).omit({ id: true, createdAt: true });
export type InsertAgencySession = z.infer<typeof insertAgencySessionSchema>;
export type AgencySessionDB = typeof agencySessions.$inferSelect;

// Agency Tasks - individual agent tasks within a session
export const agencyTasks = pgTable("agency_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => agencySessions.id, { onDelete: "cascade" }),
  agentRole: varchar("agent_role").notNull(), // strategist, social_media, visual_designer, etc.
  taskType: varchar("task_type").notNull(), // generate_strategy, create_posts, design_visuals, etc.
  inputData: jsonb("input_data").$type<Record<string, any>>(), // Input from previous agent or user
  outputData: jsonb("output_data").$type<Record<string, any>>(), // Generated output
  status: varchar("status").notNull().default("pending"), // pending, running, completed, failed, skipped
  retryCount: integer("retry_count").default(0).notNull(),
  errorMessage: text("error_message"),
  tokensUsed: integer("tokens_used").default(0),
  executionTimeMs: integer("execution_time_ms"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_at_session").on(table.sessionId),
  index("idx_at_agent").on(table.agentRole),
  index("idx_at_status").on(table.status),
]);

export const insertAgencyTaskSchema = createInsertSchema(agencyTasks).omit({ id: true, createdAt: true });
export type InsertAgencyTask = z.infer<typeof insertAgencyTaskSchema>;
export type AgencyTaskDB = typeof agencyTasks.$inferSelect;

// Agency Assets - all generated content pieces
export const agencyAssets = pgTable("agency_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id").references(() => agencySessions.id, { onDelete: "set null" }),
  assetType: varchar("asset_type").notNull(), // post, carousel, reel_script, image_prompt, email, etc.
  platform: varchar("platform"), // instagram, tiktok, linkedin, etc.
  title: varchar("title"),
  content: text("content"), // Main content (caption, script, email body)
  hook: text("hook"), // Opening hook for posts/videos
  cta: text("cta"), // Call to action
  hashtags: jsonb("hashtags").$type<string[]>().default(sql`'[]'::jsonb`),
  visualPrompt: text("visual_prompt"), // Image generation prompt
  visualUrl: text("visual_url"), // Generated or uploaded image URL
  carouselSlides: jsonb("carousel_slides").$type<{ slideNumber: number; content: string; visualPrompt?: string }[]>(),
  videoScript: jsonb("video_script").$type<{ scene: number; action: string; voiceover: string; onScreenText?: string; bRoll?: string }[]>(),
  emailSubject: varchar("email_subject"),
  emailPreheader: varchar("email_preheader"),
  scheduledFor: timestamp("scheduled_for"),
  isApproved: boolean("is_approved").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  engagementScore: integer("engagement_score"), // Predicted or actual engagement
  tags: jsonb("tags").$type<string[]>().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_aa_business").on(table.businessId),
  index("idx_aa_session").on(table.sessionId),
  index("idx_aa_type").on(table.assetType),
  index("idx_aa_platform").on(table.platform),
  index("idx_aa_approved").on(table.isApproved),
]);

export const insertAgencyAssetSchema = createInsertSchema(agencyAssets).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAgencyAsset = z.infer<typeof insertAgencyAssetSchema>;
export type AgencyAssetDB = typeof agencyAssets.$inferSelect;

// Agency Visual Packages - brand visual identity kits
export const agencyVisualPackages = pgTable("agency_visual_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id").references(() => agencySessions.id, { onDelete: "set null" }),
  moodboardPrompts: jsonb("moodboard_prompts").$type<{ category: string; prompt: string; style: string }[]>().default(sql`'[]'::jsonb`),
  colorSystem: jsonb("color_system").$type<{ 
    primary: { hex: string; usage: string };
    secondary: { hex: string; usage: string };
    accent: { hex: string; usage: string };
    neutral: { hex: string; usage: string };
    background: { hex: string; usage: string };
  }>(),
  typographyGuide: jsonb("typography_guide").$type<{ 
    headingFont: string;
    bodyFont: string;
    accentFont?: string;
    usage: string;
  }>(),
  visualStyle: text("visual_style"), // Overall visual direction description
  imagePrompts: jsonb("image_prompts").$type<{ category: string; prompt: string; platform?: string }[]>().default(sql`'[]'::jsonb`),
  videoScenes: jsonb("video_scenes").$type<{ sceneType: string; description: string; mood: string }[]>().default(sql`'[]'::jsonb`),
  brandTextures: jsonb("brand_textures").$type<string[]>().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_avp_business").on(table.businessId),
]);

export const insertAgencyVisualPackageSchema = createInsertSchema(agencyVisualPackages).omit({ id: true, createdAt: true });
export type InsertAgencyVisualPackage = z.infer<typeof insertAgencyVisualPackageSchema>;
export type AgencyVisualPackageDB = typeof agencyVisualPackages.$inferSelect;

// Agency Automation Schedules - content posting calendars
export const agencySchedules = pgTable("agency_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  platform: varchar("platform").notNull(),
  dayOfWeek: integer("day_of_week"), // 0-6 (Sunday-Saturday)
  timeSlot: varchar("time_slot"), // HH:MM format
  contentType: varchar("content_type"), // post, reel, story, carousel
  frequency: varchar("frequency").notNull(), // daily, weekly, biweekly, monthly
  isActive: boolean("is_active").default(true).notNull(),
  autopostTool: varchar("autopost_tool"), // later, buffer, hootsuite, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_asc_business").on(table.businessId),
  index("idx_asc_platform").on(table.platform),
  index("idx_asc_active").on(table.isActive),
]);

export const insertAgencyScheduleSchema = createInsertSchema(agencySchedules).omit({ id: true, createdAt: true });
export type InsertAgencySchedule = z.infer<typeof insertAgencyScheduleSchema>;
export type AgencyScheduleDB = typeof agencySchedules.$inferSelect;

// Agency Analytics Snapshots - performance tracking
export const agencyAnalytics = pgTable("agency_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull().references(() => agencyBusinesses.id, { onDelete: "cascade" }),
  platform: varchar("platform").notNull(),
  snapshotDate: varchar("snapshot_date").notNull(), // YYYY-MM-DD format
  followers: integer("followers"),
  engagement: decimal("engagement", { precision: 5, scale: 2 }), // Engagement rate percentage
  impressions: integer("impressions"),
  reach: integer("reach"),
  topPerformingContent: jsonb("top_performing_content").$type<{ assetId: string; metric: string; value: number }[]>(),
  growthTrend: decimal("growth_trend", { precision: 5, scale: 2 }), // Percentage growth
  recommendations: jsonb("recommendations").$type<string[]>().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_aan_business").on(table.businessId),
  index("idx_aan_platform").on(table.platform),
  index("idx_aan_date").on(table.snapshotDate),
])

export const insertAgencyAnalyticsSchema = createInsertSchema(agencyAnalytics).omit({ id: true, createdAt: true });
export type InsertAgencyAnalytics = z.infer<typeof insertAgencyAnalyticsSchema>;
export type AgencyAnalyticsDB = typeof agencyAnalytics.$inferSelect;

// ===== METAHERS VOYAGES - LUXURY TECH EDUCATION BOOKING =====

// Voyage category type
export type VoyageCategory = "AI" | "Crypto" | "Web3" | "AI_Branding";
export type VoyageVenueType = "Duffy_Boat" | "Picnic" | "Brunch";
export type VoyageStatus = "upcoming" | "full" | "completed" | "cancelled";

// Voyages table - intimate luxury tech education experiences
export const voyages = pgTable("voyages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  category: varchar("category").notNull(), // AI, Crypto, Web3, AI_Branding
  sequenceNumber: integer("sequence_number").notNull(), // 1-12 in the journey
  description: text("description").notNull(),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  date: timestamp("date").notNull(),
  time: varchar("time").notNull(), // "10:00 AM" format
  duration: varchar("duration").notNull(), // "3 hours" format
  location: varchar("location").notNull(),
  venueType: varchar("venue_type").notNull(), // Duffy_Boat, Picnic, Brunch
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  price: integer("price").notNull(), // in cents (e.g., 29700 = $297)
  maxCapacity: integer("max_capacity").notNull().default(6),
  currentBookings: integer("current_bookings").notNull().default(0),
  included: jsonb("included").$type<string[]>().notNull().default(sql`'[]'::jsonb`), // What's included in the experience
  heroImage: varchar("hero_image"), // Main hero image URL
  images: jsonb("images").$type<string[]>().default(sql`'[]'::jsonb`), // Gallery images
  status: varchar("status").notNull().default("upcoming"), // upcoming, full, completed, cancelled
  featuredTestimonial: text("featured_testimonial"), // Testimonial to show on card
  hostName: varchar("host_name").default("Melissa"), // Host/facilitator name
  hostImage: varchar("host_image"), // Host photo URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_voyage_slug").on(table.slug),
  index("idx_voyage_category").on(table.category),
  index("idx_voyage_status").on(table.status),
  index("idx_voyage_date").on(table.date),
  index("idx_voyage_sequence").on(table.sequenceNumber),
]);

export const insertVoyageSchema = createInsertSchema(voyages).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVoyage = z.infer<typeof insertVoyageSchema>;
export type VoyageDB = typeof voyages.$inferSelect;

// Voyage Bookings table - tracks user bookings for voyages
export const voyageBookings = pgTable("voyage_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  voyageId: varchar("voyage_id").notNull().references(() => voyages.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, cancelled, completed, refunded
  paymentStatus: varchar("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  stripeSessionId: varchar("stripe_session_id").unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  amount: integer("amount").notNull(), // Amount paid in cents
  promoCode: varchar("promo_code"), // If used a promo code
  discountAmount: integer("discount_amount").default(0), // Discount in cents
  referralCode: varchar("referral_code"), // If referred by someone
  specialRequests: text("special_requests"), // Any special accommodations
  confirmationCode: varchar("confirmation_code").unique(), // Human-readable code like "MHV-ABC123"
  checkedIn: boolean("checked_in").default(false).notNull(),
  checkedInAt: timestamp("checked_in_at"),
  completedOnboarding: boolean("completed_onboarding").default(false).notNull(),
  feedbackRating: integer("feedback_rating"), // 1-5 stars
  feedbackComment: text("feedback_comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_voyage_booking_user").on(table.userId),
  index("idx_voyage_booking_voyage").on(table.voyageId),
  index("idx_voyage_booking_status").on(table.status),
  index("idx_voyage_booking_payment").on(table.paymentStatus),
  index("idx_voyage_booking_confirmation").on(table.confirmationCode),
]);

export const insertVoyageBookingSchema = createInsertSchema(voyageBookings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVoyageBooking = z.infer<typeof insertVoyageBookingSchema>;
export type VoyageBookingDB = typeof voyageBookings.$inferSelect;

// Voyage Questionnaires - pre-voyage surveys to personalize the experience
export const voyageQuestionnaires = pgTable("voyage_questionnaires", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").unique().notNull().references(() => voyageBookings.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Tech background
  techComfortLevel: varchar("tech_comfort_level").notNull(), // beginner, intermediate, advanced, expert
  currentTools: jsonb("current_tools").$type<string[]>().default(sql`'[]'::jsonb`), // Tools they already use
  
  // Goals and interests
  primaryGoal: text("primary_goal").notNull(), // What do you hope to achieve?
  specificTopics: text("specific_topics"), // Any specific topics you want covered?
  biggestChallenge: text("biggest_challenge"), // What's your biggest tech challenge?
  
  // Personal details for personalization
  businessType: varchar("business_type"), // entrepreneur, corporate, freelancer, creator
  industry: varchar("industry"), // Their industry
  
  // Logistics
  dietaryRestrictions: text("dietary_restrictions"),
  accessibilityNeeds: text("accessibility_needs"),
  
  // Marketing
  howHeardAboutUs: varchar("how_heard_about_us"), // instagram, friend, google, other
  referredBy: varchar("referred_by"), // Name of referrer if applicable
  
  // AI-generated insights
  aiPersonalization: jsonb("ai_personalization").$type<{
    suggestedFocus?: string[];
    personalizedTips?: string[];
    recommendedPrep?: string[];
  }>(),
  
  completedAt: timestamp("completed_at").defaultNow(),
}, (table) => [
  index("idx_vq_booking").on(table.bookingId),
  index("idx_vq_user").on(table.userId),
]);

export const insertVoyageQuestionnaireSchema = createInsertSchema(voyageQuestionnaires).omit({ id: true, completedAt: true });
export type InsertVoyageQuestionnaire = z.infer<typeof insertVoyageQuestionnaireSchema>;
export type VoyageQuestionnaireDB = typeof voyageQuestionnaires.$inferSelect;

// Voyage Waitlist - for full voyages
export const voyageWaitlist = pgTable("voyage_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }), // Optional if not logged in
  voyageId: varchar("voyage_id").notNull().references(() => voyages.id, { onDelete: "cascade" }),
  name: varchar("name"),
  phone: varchar("phone"),
  notified: boolean("notified").default(false).notNull(), // If they were notified of opening
  notifiedAt: timestamp("notified_at"),
  converted: boolean("converted").default(false).notNull(), // If they booked after notification
  position: integer("position"), // Position in waitlist queue
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vw_voyage").on(table.voyageId),
  index("idx_vw_email").on(table.email),
  index("idx_vw_notified").on(table.notified),
]);

export const insertVoyageWaitlistSchema = createInsertSchema(voyageWaitlist).omit({ id: true, createdAt: true });
export type InsertVoyageWaitlist = z.infer<typeof insertVoyageWaitlistSchema>;
export type VoyageWaitlistDB = typeof voyageWaitlist.$inferSelect;

// Voyage Referrals - referral tracking for viral growth
export const voyageReferrals = pgTable("voyage_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referralCode: varchar("referral_code").unique().notNull(), // Unique code like "MELISSA-VOYAGE"
  totalReferrals: integer("total_referrals").notNull().default(0),
  successfulBookings: integer("successful_bookings").notNull().default(0),
  totalEarnings: integer("total_earnings").notNull().default(0), // In cents
  rewardType: varchar("reward_type").notNull().default("credit"), // credit, discount, cash
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vr_referrer").on(table.referrerId),
  index("idx_vr_code").on(table.referralCode),
]);

export const insertVoyageReferralSchema = createInsertSchema(voyageReferrals).omit({ id: true, createdAt: true });
export type InsertVoyageReferral = z.infer<typeof insertVoyageReferralSchema>;
export type VoyageReferralDB = typeof voyageReferrals.$inferSelect;

// Voyage Preparation Checklist - tracks onboarding completion
export const voyagePreparation = pgTable("voyage_preparation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").unique().notNull().references(() => voyageBookings.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Checklist items (all boolean)
  watchedWelcomeVideo: boolean("watched_welcome_video").default(false).notNull(),
  completedQuestionnaire: boolean("completed_questionnaire").default(false).notNull(),
  joinedCommunity: boolean("joined_community").default(false).notNull(),
  reviewedMaterials: boolean("reviewed_materials").default(false).notNull(),
  confirmedAttendance: boolean("confirmed_attendance").default(false).notNull(),
  addedToCalendar: boolean("added_to_calendar").default(false).notNull(),
  chargedDevices: boolean("charged_devices").default(false).notNull(),
  
  // Community details
  communityPlatform: varchar("community_platform"), // telegram, discord, whatsapp
  communityJoinedAt: timestamp("community_joined_at"),
  
  // Overall progress
  completionPercentage: integer("completion_percentage").notNull().default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vp_booking").on(table.bookingId),
  index("idx_vp_user").on(table.userId),
]);

export const insertVoyagePreparationSchema = createInsertSchema(voyagePreparation).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVoyagePreparation = z.infer<typeof insertVoyagePreparationSchema>;
export type VoyagePreparationDB = typeof voyagePreparation.$inferSelect;

// Voyage Testimonials - reviews from past attendees
export const voyageTestimonials = pgTable("voyage_testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voyageId: varchar("voyage_id").references(() => voyages.id, { onDelete: "set null" }), // Can be general if no specific voyage
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name").notNull(),
  title: varchar("title"), // e.g., "Founder, Tech Startup"
  avatarUrl: varchar("avatar_url"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5), // 1-5 stars
  category: varchar("category"), // Which category this testimonial applies to
  isFeatured: boolean("is_featured").default(false).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vt_voyage").on(table.voyageId),
  index("idx_vt_featured").on(table.isFeatured),
  index("idx_vt_category").on(table.category),
]);

export const insertVoyageTestimonialSchema = createInsertSchema(voyageTestimonials).omit({ id: true, createdAt: true });
export type InsertVoyageTestimonial = z.infer<typeof insertVoyageTestimonialSchema>;
export type VoyageTestimonialDB = typeof voyageTestimonials.$inferSelect;

// Voyage Invitation Requests - for invitation-only voyages
export const voyageInvitationRequests = pgTable("voyage_invitation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  voyageId: varchar("voyage_id").notNull().references(() => voyages.id, { onDelete: "cascade" }),
  
  // Request details
  status: varchar("status").notNull().default("pending"), // pending, approved, declined
  message: text("message"), // Why they want to attend
  
  // User info snapshot (for admin review)
  userName: varchar("user_name"),
  userEmail: varchar("user_email").notNull(),
  
  // Admin response
  adminNotes: text("admin_notes"),
  respondedAt: timestamp("responded_at"),
  respondedBy: varchar("responded_by").references(() => users.id, { onDelete: "set null" }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vir_user").on(table.userId),
  index("idx_vir_voyage").on(table.voyageId),
  index("idx_vir_status").on(table.status),
]);

export const insertVoyageInvitationRequestSchema = createInsertSchema(voyageInvitationRequests).omit({ id: true, createdAt: true, updatedAt: true, respondedAt: true });
export type InsertVoyageInvitationRequest = z.infer<typeof insertVoyageInvitationRequestSchema>;
export type VoyageInvitationRequestDB = typeof voyageInvitationRequests.$inferSelect;

// ===== AI TOOLKIT =====

export const toolReviews = pgTable("tool_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolSlug: varchar("tool_slug").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating"),
  tip: text("tip").notNull(),
  helpfulCount: integer("helpful_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_tool_reviews_slug").on(table.toolSlug),
  index("idx_tool_reviews_user").on(table.userId),
]);

export const insertToolReviewSchema = createInsertSchema(toolReviews).omit({ id: true, createdAt: true, helpfulCount: true });
export type InsertToolReview = z.infer<typeof insertToolReviewSchema>;
export type ToolReview = typeof toolReviews.$inferSelect;

export const toolReviewHelpful = pgTable("tool_review_helpful", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull().references(() => toolReviews.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  uniqueIndex("idx_review_helpful_unique").on(table.reviewId, table.userId),
]);


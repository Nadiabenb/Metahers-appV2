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

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
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
});

export type ShopProduct = z.infer<typeof shopProductSchema>;

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
    name: "Sheikha Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["Oud", "Musk", "Amber"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "sheikha"
  },
  {
    id: "serenity-bag",
    name: "Serenity Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["Lavender", "Lime", "Lemon"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "serenity"
  },
  {
    id: "floral-bag",
    name: "Floral Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["White Rose", "Red Rose", "Jasmine"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "floral"
  },
  {
    id: "trio-bundle",
    name: "Trio Bundle",
    type: "bundle",
    price: 499,
    scents: [],
    description: "All three Ritual Bags in one luxurious collection. Save $98.",
    image: "bundle"
  }
];

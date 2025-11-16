import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set");
  console.error("Please ensure DATABASE_URL is configured in your deployment secrets");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("✓ DATABASE_URL is configured");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add connection timeout and retry settings for production
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

// Test database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle({ client: pool, schema });

// Schema definitions from @shared/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  subscriptionTier: text("subscription_tier").default("free"),
  isAdmin: boolean("is_admin").default(false),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  usernameIdx: index("users_username_idx").on(table.username),
}));

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mood: text("mood"),
  tags: text("tags").array(),
  aiInsights: text("ai_insights"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("journal_entries_user_id_idx").on(table.userId),
  createdAtIdx: index("journal_entries_created_at_idx").on(table.createdAt),
}));

export const transformationalExperiences = pgTable("transformational_experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"), // e.g., "7 days", "30 days"
  difficulty: text("difficulty"), // e.g., "Beginner", "Intermediate", "Advanced"
  coverImageUrl: text("cover_image_url"),
  category: text("category"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  experienceId: text("experience_id").notNull().references(() => transformationalExperiences.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // e.g., "Not Started", "In Progress", "Completed"
  completedSections: text("completed_sections").array(), // e.g., ["section1", "section2"]
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_progress_user_id_idx").on(table.userId),
  experienceIdIdx: index("user_progress_experience_id_idx").on(table.experienceId),
  statusIdx: index("user_progress_status_idx").on(table.status),
  userExperienceUnique: uniqueIndex("user_progress_user_experience_unique").on(table.userId, table.experienceId),
}));

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  quizId: text("quiz_id").notNull(), // Identifier for the quiz
  score: integer("score").notNull(),
  passed: boolean("passed").default(false),
  answers: text("answers").array(), // Store user's answers, perhaps as JSON strings or objects
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }), // Reference to the user who authored the post
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("blog_posts_slug_idx").on(table.slug),
  authorIdIdx: index("blog_posts_author_id_idx").on(table.authorId),
  publishedAtIdx: index("blog_posts_published_at_idx").on(table.publishedAt),
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  postIdIdx: index("comments_post_id_idx").on(table.postId),
  userIdIdx: index("comments_user_id_idx").on(table.userId),
}));

// Define other tables and relationships as needed
// Example: Add an 'events' table, 'event_registrations' table, etc.
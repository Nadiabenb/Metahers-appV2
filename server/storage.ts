import {
  users,
  ritualProgress,
  journalEntries,
  subscriptions,
  achievements,
  type User,
  type UpsertUser,
  type RitualProgressDB,
  type InsertRitualProgress,
  type JournalEntryDB,
  type InsertJournalEntry,
  type SubscriptionDB,
  type InsertSubscription,
  type AchievementDB,
  type InsertAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  completeOnboarding(userId: string): Promise<void>;
  
  // Ritual progress operations
  getRitualProgress(userId: string, ritualSlug: string): Promise<RitualProgressDB | undefined>;
  upsertRitualProgress(progress: InsertRitualProgress): Promise<RitualProgressDB>;
  getAllUserRitualProgress(userId: string): Promise<RitualProgressDB[]>;
  
  // Journal operations
  getLatestJournalEntry(userId: string): Promise<JournalEntryDB | undefined>;
  upsertJournalEntry(entry: InsertJournalEntry): Promise<JournalEntryDB>;
  
  // Subscription operations
  getSubscription(userId: string): Promise<SubscriptionDB | undefined>;
  getSubscriptionByStripeCustomerId(stripeCustomerId: string): Promise<SubscriptionDB | undefined>;
  upsertSubscription(subscription: InsertSubscription): Promise<SubscriptionDB>;
  updateUserProStatus(userId: string, isPro: boolean): Promise<User>;
  
  // Journal analytics operations
  getJournalStats(userId: string): Promise<any>;
  getAllJournalEntries(userId: string, limit: number, mood?: string): Promise<JournalEntryDB[]>;
  
  // Achievement operations
  getUserAchievements(userId: string): Promise<AchievementDB[]>;
  unlockAchievement(userId: string, achievementKey: string): Promise<AchievementDB | null>;
  checkAchievementUnlocked(userId: string, achievementKey: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async completeOnboarding(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ onboardingCompleted: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Ritual progress operations
  async getRitualProgress(userId: string, ritualSlug: string): Promise<RitualProgressDB | undefined> {
    const [progress] = await db
      .select()
      .from(ritualProgress)
      .where(and(
        eq(ritualProgress.userId, userId),
        eq(ritualProgress.ritualSlug, ritualSlug)
      ));
    return progress;
  }

  async upsertRitualProgress(progressData: InsertRitualProgress): Promise<RitualProgressDB> {
    const existing = await this.getRitualProgress(progressData.userId, progressData.ritualSlug);
    
    if (existing) {
      const [updated] = await db
        .update(ritualProgress)
        .set({
          completedSteps: sql`${JSON.stringify(progressData.completedSteps)}::jsonb`,
          lastUpdated: new Date(),
        })
        .where(eq(ritualProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(ritualProgress)
        .values({
          ...progressData,
          completedSteps: sql`${JSON.stringify(progressData.completedSteps)}::jsonb`,
        })
        .returning();
      return created;
    }
  }

  async getAllUserRitualProgress(userId: string): Promise<RitualProgressDB[]> {
    return await db
      .select()
      .from(ritualProgress)
      .where(eq(ritualProgress.userId, userId));
  }

  // Journal operations
  async getLatestJournalEntry(userId: string): Promise<JournalEntryDB | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.lastSaved))
      .limit(1);
    return entry;
  }

  async upsertJournalEntry(entryData: InsertJournalEntry): Promise<JournalEntryDB> {
    const existing = await this.getLatestJournalEntry(entryData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(journalEntries)
        .set({
          content: entryData.content,
          mood: entryData.mood,
          tags: entryData.tags ? sql`${JSON.stringify(entryData.tags)}::jsonb` : undefined,
          wordCount: entryData.wordCount,
          aiInsights: entryData.aiInsights ? sql`${JSON.stringify(entryData.aiInsights)}::jsonb` : undefined,
          aiPrompt: entryData.aiPrompt,
          streak: entryData.streak,
          lastSaved: new Date(),
        })
        .where(eq(journalEntries.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(journalEntries)
        .values({
          ...entryData,
          tags: entryData.tags ? sql`${JSON.stringify(entryData.tags)}::jsonb` : sql`'[]'::jsonb`,
          aiInsights: entryData.aiInsights ? sql`${JSON.stringify(entryData.aiInsights)}::jsonb` : undefined,
        })
        .returning();
      return created;
    }
  }

  async getRecentJournalEntries(userId: string, limit: number = 10): Promise<JournalEntryDB[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async getAllJournalEntries(userId: string, limit: number = 30, mood?: string): Promise<JournalEntryDB[]> {
    const conditions = [eq(journalEntries.userId, userId)];
    if (mood) {
      conditions.push(eq(journalEntries.mood, mood));
    }
    
    return await db
      .select()
      .from(journalEntries)
      .where(and(...conditions))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  // Subscription operations
  async getSubscription(userId: string): Promise<SubscriptionDB | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return subscription;
  }

  async getSubscriptionByStripeCustomerId(stripeCustomerId: string): Promise<SubscriptionDB | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, stripeCustomerId));
    return subscription;
  }

  async upsertSubscription(subscriptionData: InsertSubscription): Promise<SubscriptionDB> {
    const existing = await this.getSubscription(subscriptionData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(subscriptions)
        .set({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(subscriptions)
        .values(subscriptionData)
        .returning();
      return created;
    }
  }

  async updateUserProStatus(userId: string, isPro: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isPro, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Journal analytics operations
  async getJournalStats(userId: string): Promise<any> {
    const entries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId));
    
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    const currentStreak = entries.length > 0 ? entries[0].streak : 0;
    
    // Mood distribution
    const moodCounts: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });
    
    // All unique tags
    const allTags = new Set<string>();
    entries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return {
      totalEntries,
      totalWords,
      currentStreak,
      moodDistribution: moodCounts,
      allTags: Array.from(allTags),
      entries: entries.map(e => ({
        id: e.id,
        createdAt: e.createdAt,
        mood: e.mood,
        tags: e.tags,
        wordCount: e.wordCount,
        content: e.content.substring(0, 200), // Preview only
      })),
    };
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<AchievementDB[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async unlockAchievement(userId: string, achievementKey: string): Promise<AchievementDB | null> {
    // Check if already unlocked
    const isUnlocked = await this.checkAchievementUnlocked(userId, achievementKey);
    if (isUnlocked) {
      return null;
    }
    
    // Unlock the achievement
    const [achievement] = await db
      .insert(achievements)
      .values({
        userId,
        achievementKey,
      })
      .returning();
    
    return achievement;
  }

  async checkAchievementUnlocked(userId: string, achievementKey: string): Promise<boolean> {
    const [achievement] = await db
      .select()
      .from(achievements)
      .where(and(
        eq(achievements.userId, userId),
        eq(achievements.achievementKey, achievementKey)
      ))
      .limit(1);
    
    return !!achievement;
  }
}

export const storage = new DatabaseStorage();

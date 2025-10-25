import {
  users,
  ritualProgress,
  journalEntries,
  subscriptions,
  achievements,
  passwordResetTokens,
  emailLeads,
  glowUpProfiles,
  glowUpProgress,
  glowUpJournal,
  quizSubmissions,
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
  type PasswordResetTokenDB,
  type InsertPasswordResetToken,
  type EmailLeadDB,
  type InsertEmailLead,
  type GlowUpProfileDB,
  type InsertGlowUpProfile,
  type GlowUpProgressDB,
  type InsertGlowUpProgress,
  type GlowUpJournalDB,
  type InsertGlowUpJournal,
  type QuizSubmissionDB,
  type InsertQuizSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  completeOnboarding(userId: string): Promise<void>;
  
  // Ritual progress operations
  getRitualProgress(userId: string, ritualSlug: string): Promise<RitualProgressDB | undefined>;
  upsertRitualProgress(progress: InsertRitualProgress): Promise<RitualProgressDB>;
  getAllUserRitualProgress(userId: string): Promise<RitualProgressDB[]>;
  
  // Journal operations
  getLatestJournalEntry(userId: string): Promise<JournalEntryDB | undefined>;
  getJournalEntryByDate(userId: string, date: string): Promise<JournalEntryDB | undefined>;
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
  
  // Password reset operations
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetTokenDB>;
  getPasswordResetToken(token: string): Promise<PasswordResetTokenDB | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;
  deleteUserPasswordResetTokens(userId: string): Promise<void>;
  
  // Email lead operations
  createEmailLead(lead: InsertEmailLead): Promise<EmailLeadDB>;
  
  // Glow-Up Program operations
  getGlowUpProfile(userId: string): Promise<GlowUpProfileDB | undefined>;
  upsertGlowUpProfile(profile: InsertGlowUpProfile): Promise<GlowUpProfileDB>;
  
  getGlowUpProgress(userId: string): Promise<GlowUpProgressDB | undefined>;
  upsertGlowUpProgress(progress: InsertGlowUpProgress): Promise<GlowUpProgressDB>;
  
  getGlowUpJournalEntry(userId: string, day: number): Promise<GlowUpJournalDB | undefined>;
  getAllGlowUpJournalEntries(userId: string): Promise<GlowUpJournalDB[]>;
  upsertGlowUpJournalEntry(entry: InsertGlowUpJournal): Promise<GlowUpJournalDB>;
  
  // Quiz submission operations
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmissionDB>;
  getQuizSubmissionsByEmail(email: string): Promise<QuizSubmissionDB[]>;
  getQuizSubmissionByEmail(email: string): Promise<QuizSubmissionDB | undefined>;
  getAllQuizSubmissions(): Promise<QuizSubmissionDB[]>;
  updateQuizSubmission(id: string, updates: Partial<QuizSubmissionDB>): Promise<QuizSubmissionDB>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
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

  async getJournalEntryByDate(userId: string, date: string): Promise<JournalEntryDB | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.userId, userId),
        eq(journalEntries.date, date)
      ))
      .limit(1);
    return entry;
  }

  async upsertJournalEntry(entryData: InsertJournalEntry): Promise<JournalEntryDB> {
    // Use the date from entryData, or default to today's date
    const journalDate = entryData.date || new Date().toISOString().split('T')[0];
    const existing = await this.getJournalEntryByDate(entryData.userId, journalDate);
    
    if (existing) {
      const [updated] = await db
        .update(journalEntries)
        .set({
          content: entryData.content,
          structuredContent: entryData.structuredContent ? sql`${JSON.stringify(entryData.structuredContent)}::jsonb` : undefined,
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
          date: journalDate,
          tags: entryData.tags ? sql`${JSON.stringify(entryData.tags)}::jsonb` : sql`'[]'::jsonb`,
          aiInsights: entryData.aiInsights ? sql`${JSON.stringify(entryData.aiInsights)}::jsonb` : undefined,
          structuredContent: entryData.structuredContent ? sql`${JSON.stringify(entryData.structuredContent)}::jsonb` : undefined,
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

  // Password reset operations
  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetTokenDB> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetTokenDB | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);
    return resetToken;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
  }

  async deleteUserPasswordResetTokens(userId: string): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  }

  // Email lead operations
  async createEmailLead(lead: InsertEmailLead): Promise<EmailLeadDB> {
    const [emailLead] = await db
      .insert(emailLeads)
      .values(lead)
      .onConflictDoNothing({ target: emailLeads.email })
      .returning();
    return emailLead;
  }

  // Glow-Up Program operations
  async getGlowUpProfile(userId: string): Promise<GlowUpProfileDB | undefined> {
    const [profile] = await db
      .select()
      .from(glowUpProfiles)
      .where(eq(glowUpProfiles.userId, userId))
      .limit(1);
    return profile;
  }

  async upsertGlowUpProfile(profileData: InsertGlowUpProfile): Promise<GlowUpProfileDB> {
    const existing = await this.getGlowUpProfile(profileData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(glowUpProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(glowUpProfiles.userId, profileData.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(glowUpProfiles)
        .values(profileData)
        .returning();
      return created;
    }
  }

  async getGlowUpProgress(userId: string): Promise<GlowUpProgressDB | undefined> {
    const [progress] = await db
      .select()
      .from(glowUpProgress)
      .where(eq(glowUpProgress.userId, userId))
      .limit(1);
    return progress;
  }

  async upsertGlowUpProgress(progressData: InsertGlowUpProgress): Promise<GlowUpProgressDB> {
    const existing = await this.getGlowUpProgress(progressData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(glowUpProgress)
        .set({
          completedDays: sql`${JSON.stringify(progressData.completedDays)}::jsonb`,
          currentDay: progressData.currentDay,
          completedAt: progressData.completedAt,
          lastUpdated: new Date(),
        })
        .where(eq(glowUpProgress.userId, progressData.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(glowUpProgress)
        .values({
          ...progressData,
          completedDays: sql`${JSON.stringify(progressData.completedDays)}::jsonb`,
        })
        .returning();
      return created;
    }
  }

  async getGlowUpJournalEntry(userId: string, day: number): Promise<GlowUpJournalDB | undefined> {
    const [entry] = await db
      .select()
      .from(glowUpJournal)
      .where(and(
        eq(glowUpJournal.userId, userId),
        eq(glowUpJournal.day, day)
      ))
      .limit(1);
    return entry;
  }

  async getAllGlowUpJournalEntries(userId: string): Promise<GlowUpJournalDB[]> {
    return await db
      .select()
      .from(glowUpJournal)
      .where(eq(glowUpJournal.userId, userId))
      .orderBy(glowUpJournal.day);
  }

  async upsertGlowUpJournalEntry(entryData: InsertGlowUpJournal): Promise<GlowUpJournalDB> {
    const existing = await this.getGlowUpJournalEntry(entryData.userId, entryData.day);
    
    if (existing) {
      const [updated] = await db
        .update(glowUpJournal)
        .set({
          gptResponse: entryData.gptResponse,
          publicPostDraft: entryData.publicPostDraft,
          notes: entryData.notes,
          updatedAt: new Date(),
        })
        .where(and(
          eq(glowUpJournal.userId, entryData.userId),
          eq(glowUpJournal.day, entryData.day)
        ))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(glowUpJournal)
        .values(entryData)
        .returning();
      return created;
    }
  }

  // Quiz submission operations
  async createQuizSubmission(submissionData: InsertQuizSubmission): Promise<QuizSubmissionDB> {
    const [submission] = await db
      .insert(quizSubmissions)
      .values({
        ...submissionData,
        answers: sql`${JSON.stringify(submissionData.answers)}::jsonb`,
      })
      .returning();
    return submission;
  }

  async getQuizSubmissionsByEmail(email: string): Promise<QuizSubmissionDB[]> {
    return await db
      .select()
      .from(quizSubmissions)
      .where(eq(quizSubmissions.email, email))
      .orderBy(desc(quizSubmissions.createdAt));
  }

  async getQuizSubmissionByEmail(email: string): Promise<QuizSubmissionDB | undefined> {
    const submissions = await this.getQuizSubmissionsByEmail(email);
    return submissions[0];
  }

  async getAllQuizSubmissions(): Promise<QuizSubmissionDB[]> {
    return await db
      .select()
      .from(quizSubmissions)
      .orderBy(desc(quizSubmissions.createdAt));
  }

  async updateQuizSubmission(id: string, updates: Partial<QuizSubmissionDB>): Promise<QuizSubmissionDB> {
    const [updated] = await db
      .update(quizSubmissions)
      .set(updates)
      .where(eq(quizSubmissions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();

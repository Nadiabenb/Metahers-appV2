import {
  users,
  ritualProgress,
  journalEntries,
  subscriptions,
  achievements,
  emailLeads,
  glowUpProfiles,
  glowUpProgress,
  glowUpJournal,
  quizSubmissions,
  passwordResetTokens,
  cohortCapacity,
  thoughtLeadershipPosts,
  thoughtLeadershipProgress,
  groupSessions,
  sessionRegistrations,
  oneOnOneBookings,
  founderInsights,
  insightInteractions,
  spaces,
  transformationalExperiences,
  experienceProgress,
  personalizationQuestions,
  appAtelierUsage,
  companions,
  companionActivities,
} from "@shared/schema";
import type {
  UpsertUser,
  User,
  InsertRitualProgress,
  RitualProgressDB,
  InsertJournalEntry,
  JournalEntryDB,
  InsertSubscription,
  SubscriptionDB,
  InsertAchievement,
  AchievementDB,
  InsertEmailLead,
  EmailLeadDB,
  InsertGlowUpProfile,
  GlowUpProfileDB,
  InsertGlowUpProgress,
  GlowUpProgressDB,
  InsertGlowUpJournal,
  GlowUpJournalDB,
  InsertQuizSubmission,
  QuizSubmissionDB,
  InsertPasswordResetToken,
  PasswordResetTokenDB,
  InsertCohortCapacity,
  CohortCapacityDB,
  InsertThoughtLeadershipPost,
  ThoughtLeadershipPostDB,
  InsertThoughtLeadershipProgress,
  ThoughtLeadershipProgressDB,
  InsertGroupSession,
  GroupSessionDB,
  InsertSessionRegistration,
  SessionRegistrationDB,
  InsertOneOnOneBooking,
  OneOnOneBookingDB,
  InsertFounderInsight,
  FounderInsightDB,
  InsertInsightInteraction,
  InsightInteractionDB,
  InsertSpace,
  SpaceDB,
  InsertTransformationalExperience,
  TransformationalExperienceDB,
  InsertExperienceProgress,
  ExperienceProgressDB,
  InsertPersonalizationQuestion,
  PersonalizationQuestionDB,
  InsertAppAtelierUsage,
  AppAtelierUsageDB,
  InsertCompanion,
  CompanionDB,
  InsertCompanionActivity,
  CompanionActivityDB,
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
  updateUserSubscriptionTier(userId: string, tier: string): Promise<User>;

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

  // Cohort capacity operations
  getCohortCapacity(cohortName: string): Promise<CohortCapacityDB | undefined>;
  upsertCohortCapacity(capacity: InsertCohortCapacity): Promise<CohortCapacityDB>;
  incrementCohortCapacity(cohortName: string): Promise<CohortCapacityDB | undefined>;

  // Thought Leadership operations
  createThoughtLeadershipPost(post: InsertThoughtLeadershipPost): Promise<ThoughtLeadershipPostDB>;
  getThoughtLeadershipPostById(id: string): Promise<ThoughtLeadershipPostDB | undefined>;
  getThoughtLeadershipPostBySlug(slug: string): Promise<ThoughtLeadershipPostDB | undefined>;
  getThoughtLeadershipPostsByUser(userId: string, limit: number): Promise<ThoughtLeadershipPostDB[]>;
  getPublicThoughtLeadershipPosts(limit: number): Promise<ThoughtLeadershipPostDB[]>;
  updateThoughtLeadershipPost(id: string, updates: Partial<ThoughtLeadershipPostDB>): Promise<ThoughtLeadershipPostDB>;

  getThoughtLeadershipProgress(userId: string): Promise<ThoughtLeadershipProgressDB | undefined>;
  createThoughtLeadershipProgress(progress: InsertThoughtLeadershipProgress): Promise<ThoughtLeadershipProgressDB>;
  updateThoughtLeadershipProgress(userId: string, updates: Partial<ThoughtLeadershipProgressDB>): Promise<ThoughtLeadershipProgressDB>;

  // Mind Spa Membership - Group Sessions operations
  createGroupSession(session: InsertGroupSession): Promise<GroupSessionDB>;
  getGroupSessionById(id: string): Promise<GroupSessionDB | undefined>;
  getUpcomingGroupSessions(sessionType?: string, limit?: number): Promise<GroupSessionDB[]>;
  getPastGroupSessions(sessionType?: string, limit?: number): Promise<GroupSessionDB[]>;
  updateGroupSession(id: string, updates: Partial<GroupSessionDB>): Promise<GroupSessionDB>;
  incrementSessionAttendees(id: string): Promise<void>;
  decrementSessionAttendees(id: string): Promise<void>;

  // Mind Spa Membership - Session Registrations operations
  createSessionRegistration(registration: InsertSessionRegistration): Promise<SessionRegistrationDB>;
  getSessionRegistration(sessionId: string, userId: string): Promise<SessionRegistrationDB | undefined>;
  getUserSessionRegistrations(userId: string, status?: string): Promise<SessionRegistrationDB[]>;
  getSessionRegistrations(sessionId: string): Promise<SessionRegistrationDB[]>;
  updateSessionRegistration(id: string, updates: Partial<SessionRegistrationDB>): Promise<SessionRegistrationDB>;
  cancelSessionRegistration(id: string): Promise<void>;

  // Mind Spa Membership - 1:1 Bookings operations
  createOneOnOneBooking(booking: InsertOneOnOneBooking): Promise<OneOnOneBookingDB>;
  getOneOnOneBookingById(id: string): Promise<OneOnOneBookingDB | undefined>;
  getUserOneOnOneBookings(userId: string, status?: string): Promise<OneOnOneBookingDB[]>;
  getUpcomingOneOnOneBookings(userId?: string): Promise<OneOnOneBookingDB[]>;
  updateOneOnOneBooking(id: string, updates: Partial<OneOnOneBookingDB>): Promise<OneOnOneBookingDB>;
  cancelOneOnOneBooking(id: string): Promise<void>;

  // Mind Spa Membership - Founder Insights operations
  createFounderInsight(insight: InsertFounderInsight): Promise<FounderInsightDB>;
  getFounderInsightById(id: string): Promise<FounderInsightDB | undefined>;
  getFounderInsights(minTierRequired?: string, limit?: number): Promise<FounderInsightDB[]>;
  updateFounderInsight(id: string, updates: Partial<FounderInsightDB>): Promise<FounderInsightDB>;
  deleteFounderInsight(id: string): Promise<void>;

  // Mind Spa Membership - Insight Interactions operations
  createInsightInteraction(interaction: InsertInsightInteraction): Promise<InsightInteractionDB>;
  getInsightInteraction(insightId: string, userId: string): Promise<InsightInteractionDB | undefined>;
  markInsightAsViewed(insightId: string, userId: string): Promise<void>;
  toggleInsightLike(insightId: string, userId: string): Promise<boolean>;

  // MetaHers World - Spaces operations
  getSpaces(): Promise<SpaceDB[]>;
  getSpaceBySlug(slug: string): Promise<SpaceDB | undefined>;

  // MetaHers World - Transformational Experiences operations
  getExperiencesBySpace(spaceId: string): Promise<TransformationalExperienceDB[]>;
  getExperienceById(id: string): Promise<TransformationalExperienceDB | undefined>;
  getExperienceBySlug(slug: string): Promise<TransformationalExperienceDB | undefined>;
  getAllExperiences(): Promise<TransformationalExperienceDB[]>;

  // MetaHers World - Experience Progress operations
  getAllExperienceProgress(userId: string): Promise<ExperienceProgressDB[]>;
  getExperienceProgress(userId: string, experienceId: string): Promise<ExperienceProgressDB | undefined>;
  upsertExperienceProgress(progress: InsertExperienceProgress): Promise<ExperienceProgressDB>;
  savePersonalizationAnswers(userId: string, experienceId: string, answers: Record<string, any>): Promise<ExperienceProgressDB>;
  getPersonalizationAnswers(userId: string, experienceId: string): Promise<Record<string, any> | null>;

  // App Atelier usage tracking operations
  getAppAtelierUsage(userId: string): Promise<AppAtelierUsageDB | undefined>;
  incrementAppAtelierUsage(userId: string): Promise<AppAtelierUsageDB>;

  // Companion operations
  getCompanion(userId: string): Promise<CompanionDB | undefined>;
  createCompanion(data: InsertCompanion): Promise<CompanionDB>;
  updateCompanionStats(
    userId: string,
    update: {
      growth?: number;
      inspiration?: number;
      connection?: number;
      mastery?: number;
      activityType: string;
    }
  ): Promise<CompanionDB>;
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

  async updateUserSubscriptionTier(userId: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionTier: tier, updatedAt: new Date() })
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
    return db.select().from(quizSubmissions).orderBy(desc(quizSubmissions.createdAt));
  }

  // ===== COMPANION METHODS =====
  async getCompanion(userId: string): Promise<CompanionDB | undefined> {
    const result = await db.select().from(companions).where(eq(companions.userId, userId)).limit(1);
    return result[0];
  }

  async createCompanion(data: InsertCompanion): Promise<CompanionDB> {
    const [result] = await db.insert(companions).values(data).returning();
    return result;
  }

  async updateCompanionStats(
    userId: string,
    update: {
      growth?: number;
      inspiration?: number;
      connection?: number;
      mastery?: number;
      activityType: string;
    }
  ): Promise<CompanionDB> {
    const companion = await this.getCompanion(userId);
    if (!companion) {
      throw new Error('Companion not found');
    }

    // Calculate new stats (capped at 100)
    const newGrowth = Math.min(100, companion.growth + (update.growth || 0));
    const newInspiration = Math.min(100, companion.inspiration + (update.inspiration || 0));
    const newConnection = Math.min(100, companion.connection + (update.connection || 0));
    const newMastery = Math.min(100, companion.mastery + (update.mastery || 0));

    // Determine stage based on total stats
    const totalStats = newGrowth + newInspiration + newConnection + newMastery;
    let stage = 'seedling';
    if (totalStats >= 300) stage = 'radiant';
    else if (totalStats >= 200) stage = 'flourishing';
    else if (totalStats >= 120) stage = 'blooming';
    else if (totalStats >= 50) stage = 'sprout';

    // Update timestamp based on activity type
    const timestamps: any = { updatedAt: new Date() };
    if (update.activityType === 'journal') timestamps.lastFed = new Date();
    if (update.activityType === 'learn') timestamps.lastPlayed = new Date();
    if (update.activityType === 'socialize') timestamps.lastSocialized = new Date();

    const result = await db
      .update(companions)
      .set({
        growth: newGrowth,
        inspiration: newInspiration,
        connection: newConnection,
        mastery: newMastery,
        stage,
        ...timestamps,
      })
      .where(eq(companions.userId, userId))
      .returning();

    // Log activity
    const pointsGained = (update.growth || 0) + (update.inspiration || 0) +
                        (update.connection || 0) + (update.mastery || 0);

    await db.insert(companionActivities).values({
      userId,
      activityType: update.activityType,
      statChanged: update.growth ? 'growth' : update.inspiration ? 'inspiration' :
                   update.connection ? 'connection' : 'mastery',
      pointsGained,
    });

    return result[0];
  }


  async updateQuizSubmission(id: string, updates: Partial<QuizSubmissionDB>): Promise<QuizSubmissionDB> {
    const [updated] = await db
      .update(quizSubmissions)
      .set(updates)
      .where(eq(quizSubmissions.id, id))
      .returning();
    return updated;
  }

  // Cohort capacity operations
  async getCohortCapacity(cohortName: string): Promise<CohortCapacityDB | undefined> {
    const [capacity] = await db
      .select()
      .from(cohortCapacity)
      .where(eq(cohortCapacity.cohortName, cohortName))
      .limit(1);
    return capacity;
  }

  async upsertCohortCapacity(capacityData: InsertCohortCapacity): Promise<CohortCapacityDB> {
    const existing = await this.getCohortCapacity(capacityData.cohortName);

    if (existing) {
      const [updated] = await db
        .update(cohortCapacity)
        .set({
          totalSpots: capacityData.totalSpots,
          takenSpots: capacityData.takenSpots,
          nextCohortDate: capacityData.nextCohortDate,
          isActive: capacityData.isActive,
          updatedAt: new Date(),
        })
        .where(eq(cohortCapacity.cohortName, capacityData.cohortName))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(cohortCapacity)
        .values(capacityData)
        .returning();
      return created;
    }
  }

  async incrementCohortCapacity(cohortName: string): Promise<CohortCapacityDB | undefined> {
    const existing = await this.getCohortCapacity(cohortName);
    if (!existing) return undefined;

    const [updated] = await db
      .update(cohortCapacity)
      .set({
        takenSpots: sql`${cohortCapacity.takenSpots} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(cohortCapacity.cohortName, cohortName))
      .returning();
    return updated;
  }

  // Thought Leadership operations
  async createThoughtLeadershipPost(postData: InsertThoughtLeadershipPost): Promise<ThoughtLeadershipPostDB> {
    const [post] = await db
      .insert(thoughtLeadershipPosts)
      .values({
        ...postData,
        externalPlatforms: sql`${JSON.stringify(postData.externalPlatforms || [])}::jsonb`,
      })
      .returning();
    return post;
  }

  async getThoughtLeadershipPostById(id: string): Promise<ThoughtLeadershipPostDB | undefined> {
    const [post] = await db
      .select()
      .from(thoughtLeadershipPosts)
      .where(eq(thoughtLeadershipPosts.id, id));
    return post;
  }

  async getThoughtLeadershipPostBySlug(slug: string): Promise<ThoughtLeadershipPostDB | undefined> {
    const [post] = await db
      .select()
      .from(thoughtLeadershipPosts)
      .where(eq(thoughtLeadershipPosts.slug, slug));
    return post;
  }

  async getThoughtLeadershipPostsByUser(userId: string, limit: number): Promise<ThoughtLeadershipPostDB[]> {
    const posts = await db
      .select()
      .from(thoughtLeadershipPosts)
      .where(eq(thoughtLeadershipPosts.userId, userId))
      .orderBy(desc(thoughtLeadershipPosts.createdAt))
      .limit(limit);
    return posts;
  }

  async getPublicThoughtLeadershipPosts(limit: number): Promise<ThoughtLeadershipPostDB[]> {
    const posts = await db
      .select()
      .from(thoughtLeadershipPosts)
      .where(eq(thoughtLeadershipPosts.isPublic, true))
      .orderBy(desc(thoughtLeadershipPosts.publishedAt))
      .limit(limit);
    return posts;
  }

  async updateThoughtLeadershipPost(id: string, updates: Partial<ThoughtLeadershipPostDB>): Promise<ThoughtLeadershipPostDB> {
    const [updated] = await db
      .update(thoughtLeadershipPosts)
      .set(updates)
      .where(eq(thoughtLeadershipPosts.id, id))
      .returning();
    return updated;
  }

  async getThoughtLeadershipProgress(userId: string): Promise<ThoughtLeadershipProgressDB | undefined> {
    const [progress] = await db
      .select()
      .from(thoughtLeadershipProgress)
      .where(eq(thoughtLeadershipProgress.userId, userId));
    return progress;
  }

  async createThoughtLeadershipProgress(progressData: InsertThoughtLeadershipProgress): Promise<ThoughtLeadershipProgressDB> {
    const [progress] = await db
      .insert(thoughtLeadershipProgress)
      .values({
        ...progressData,
        completedDays: sql`${JSON.stringify(progressData.completedDays || [])}::jsonb`,
        lessonsCompleted: sql`${JSON.stringify(progressData.lessonsCompleted || [])}::jsonb`,
        practicesSubmitted: sql`${JSON.stringify(progressData.practicesSubmitted || [])}::jsonb`,
        practiceReflections: sql`${JSON.stringify(progressData.practiceReflections || {})}::jsonb`,
      })
      .returning();
    return progress;
  }

  async updateThoughtLeadershipProgress(userId: string, updates: Partial<ThoughtLeadershipProgressDB>): Promise<ThoughtLeadershipProgressDB> {
    const [updated] = await db
      .update(thoughtLeadershipProgress)
      .set(updates)
      .where(eq(thoughtLeadershipProgress.userId, userId))
      .returning();
    return updated;
  }

  // Mind Spa Membership - Group Sessions operations
  async createGroupSession(sessionData: InsertGroupSession): Promise<GroupSessionDB> {
    const [session] = await db
      .insert(groupSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getGroupSessionById(id: string): Promise<GroupSessionDB | undefined> {
    const [session] = await db
      .select()
      .from(groupSessions)
      .where(eq(groupSessions.id, id));
    return session;
  }

  async getUpcomingGroupSessions(sessionType?: string, limit = 20): Promise<GroupSessionDB[]> {
    const now = new Date();
    const conditions = [sql`${groupSessions.scheduledDate} > ${now}`];

    if (sessionType) {
      conditions.push(eq(groupSessions.sessionType, sessionType));
    }

    return await db
      .select()
      .from(groupSessions)
      .where(and(...conditions))
      .orderBy(groupSessions.scheduledDate)
      .limit(limit);
  }

  async getPastGroupSessions(sessionType?: string, limit = 20): Promise<GroupSessionDB[]> {
    const now = new Date();
    const conditions = [sql`${groupSessions.scheduledDate} <= ${now}`];

    if (sessionType) {
      conditions.push(eq(groupSessions.sessionType, sessionType));
    }

    return await db
      .select()
      .from(groupSessions)
      .where(and(...conditions))
      .orderBy(desc(groupSessions.scheduledDate))
      .limit(limit);
  }

  async updateGroupSession(id: string, updates: Partial<GroupSessionDB>): Promise<GroupSessionDB> {
    const [updated] = await db
      .update(groupSessions)
      .set(updates)
      .where(eq(groupSessions.id, id))
      .returning();
    return updated;
  }

  async incrementSessionAttendees(id: string): Promise<void> {
    await db
      .update(groupSessions)
      .set({
        currentAttendees: sql`${groupSessions.currentAttendees} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(groupSessions.id, id));
  }

  async decrementSessionAttendees(id: string): Promise<void> {
    await db
      .update(groupSessions)
      .set({
        currentAttendees: sql`GREATEST(${groupSessions.currentAttendees} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(groupSessions.id, id));
  }

  // Mind Spa Membership - Session Registrations operations
  async createSessionRegistration(registrationData: InsertSessionRegistration): Promise<SessionRegistrationDB> {
    const [registration] = await db
      .insert(sessionRegistrations)
      .values(registrationData)
      .returning();
    return registration;
  }

  async getSessionRegistration(sessionId: string, userId: string): Promise<SessionRegistrationDB | undefined> {
    const [registration] = await db
      .select()
      .from(sessionRegistrations)
      .where(and(
        eq(sessionRegistrations.sessionId, sessionId),
        eq(sessionRegistrations.userId, userId)
      ));
    return registration;
  }

  async getUserSessionRegistrations(userId: string, status?: string): Promise<SessionRegistrationDB[]> {
    const conditions = [eq(sessionRegistrations.userId, userId)];

    if (status) {
      conditions.push(eq(sessionRegistrations.status, status));
    }

    return await db
      .select()
      .from(sessionRegistrations)
      .where(and(...conditions))
      .orderBy(desc(sessionRegistrations.registeredAt));
  }

  async getSessionRegistrations(sessionId: string): Promise<SessionRegistrationDB[]> {
    return await db
      .select()
      .from(sessionRegistrations)
      .where(eq(sessionRegistrations.sessionId, sessionId))
      .orderBy(sessionRegistrations.registeredAt);
  }

  async updateSessionRegistration(id: string, updates: Partial<SessionRegistrationDB>): Promise<SessionRegistrationDB> {
    const [updated] = await db
      .update(sessionRegistrations)
      .set(updates)
      .where(eq(sessionRegistrations.id, id))
      .returning();
    return updated;
  }

  async cancelSessionRegistration(id: string): Promise<void> {
    await db
      .update(sessionRegistrations)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
      })
      .where(eq(sessionRegistrations.id, id));
  }

  // Mind Spa Membership - 1:1 Bookings operations
  async createOneOnOneBooking(bookingData: InsertOneOnOneBooking): Promise<OneOnOneBookingDB> {
    const [booking] = await db
      .insert(oneOnOneBookings)
      .values({
        ...bookingData,
        followUpActions: sql`${JSON.stringify(bookingData.followUpActions || [])}::jsonb`,
      })
      .returning();
    return booking;
  }

  async getOneOnOneBookingById(id: string): Promise<OneOnOneBookingDB | undefined> {
    const [booking] = await db
      .select()
      .from(oneOnOneBookings)
      .where(eq(oneOnOneBookings.id, id));
    return booking;
  }

  async getUserOneOnOneBookings(userId: string, status?: string): Promise<OneOnOneBookingDB[]> {
    const conditions = [eq(oneOnOneBookings.userId, userId)];

    if (status) {
      conditions.push(eq(oneOnOneBookings.status, status));
    }

    return await db
      .select()
      .from(oneOnOneBookings)
      .where(and(...conditions))
      .orderBy(desc(oneOnOneBookings.scheduledDate));
  }

  async getUpcomingOneOnOneBookings(userId?: string): Promise<OneOnOneBookingDB[]> {
    const now = new Date();
    const conditions = [sql`${oneOnOneBookings.scheduledDate} > ${now}`];

    if (userId) {
      conditions.push(eq(oneOnOneBookings.userId, userId));
    }

    return await db
      .select()
      .from(oneOnOneBookings)
      .where(and(...conditions))
      .orderBy(oneOnOneBookings.scheduledDate);
  }

  async updateOneOnOneBooking(id: string, updates: Partial<OneOnOneBookingDB>): Promise<OneOnOneBookingDB> {
    const [updated] = await db
      .update(oneOnOneBookings)
      .set(updates)
      .where(eq(oneOnOneBookings.id, id))
      .returning();
    return updated;
  }

  async cancelOneOnOneBooking(id: string): Promise<void> {
    await db
      .update(oneOnOneBookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(oneOnOneBookings.id, id));
  }

  // Mind Spa Membership - Founder Insights operations
  async createFounderInsight(insightData: InsertFounderInsight): Promise<FounderInsightDB> {
    const [insight] = await db
      .insert(founderInsights)
      .values(insightData)
      .returning();
    return insight;
  }

  async getFounderInsightById(id: string): Promise<FounderInsightDB | undefined> {
    const [insight] = await db
      .select()
      .from(founderInsights)
      .where(eq(founderInsights.id, id));
    return insight;
  }

  async getFounderInsights(minTierRequired?: string, limit = 20): Promise<FounderInsightDB[]> {
    const conditions = [eq(founderInsights.isPublished, true)];

    if (minTierRequired) {
      conditions.push(eq(founderInsights.minTierRequired, minTierRequired));
    }

    return await db
      .select()
      .from(founderInsights)
      .where(and(...conditions))
      .orderBy(desc(founderInsights.publishedAt))
      .limit(limit);
  }

  async updateFounderInsight(id: string, updates: Partial<FounderInsightDB>): Promise<FounderInsightDB> {
    const [updated] = await db
      .update(founderInsights)
      .set(updates)
      .where(eq(founderInsights.id, id))
      .returning();
    return updated;
  }

  async deleteFounderInsight(id: string): Promise<void> {
    await db
      .delete(founderInsights)
      .where(eq(founderInsights.id, id));
  }

  // Mind Spa Membership - Insight Interactions operations
  async createInsightInteraction(interactionData: InsertInsightInteraction): Promise<InsightInteractionDB> {
    const [interaction] = await db
      .insert(insightInteractions)
      .values(interactionData)
      .returning();
    return interaction;
  }

  async getInsightInteraction(insightId: string, userId: string): Promise<InsightInteractionDB | undefined> {
    const [interaction] = await db
      .select()
      .from(insightInteractions)
      .where(and(
        eq(insightInteractions.insightId, insightId),
        eq(insightInteractions.userId, userId)
      ));
    return interaction;
  }

  async markInsightAsViewed(insightId: string, userId: string): Promise<void> {
    const existing = await this.getInsightInteraction(insightId, userId);

    if (existing) {
      await db
        .update(insightInteractions)
        .set({
          hasViewed: true,
          viewedAt: new Date(),
        })
        .where(eq(insightInteractions.id, existing.id));
    } else {
      await db
        .insert(insightInteractions)
        .values({
          insightId,
          userId,
          hasViewed: true,
          viewedAt: new Date(),
        });
    }

    // Increment view count on the insight
    await db
      .update(founderInsights)
      .set({
        viewCount: sql`${founderInsights.viewCount} + 1`,
      })
      .where(eq(founderInsights.id, insightId));
  }

  async toggleInsightLike(insightId: string, userId: string): Promise<boolean> {
    const existing = await this.getInsightInteraction(insightId, userId);

    if (existing) {
      const newLikedState = !existing.hasLiked;
      await db
        .update(insightInteractions)
        .set({
          hasLiked: newLikedState,
          likedAt: newLikedState ? new Date() : null,
        })
        .where(eq(insightInteractions.id, existing.id));

      // Update like count
      await db
        .update(founderInsights)
        .set({
          likeCount: newLikedState
            ? sql`${founderInsights.likeCount} + 1`
            : sql`GREATEST(${founderInsights.likeCount} - 1, 0)`,
        })
        .where(eq(founderInsights.id, insightId));

      return newLikedState;
    } else {
      await db
        .insert(insightInteractions)
        .values({
          insightId,
          userId,
          hasLiked: true,
          likedAt: new Date(),
        });

      // Increment like count
      await db
        .update(founderInsights)
        .set({
          likeCount: sql`${founderInsights.likeCount} + 1`,
        })
        .where(eq(founderInsights.id, insightId));

      return true;
    }
  }

  // MetaHers World - Spaces operations
  async getSpaces(): Promise<SpaceDB[]> {
    const allSpaces = await db
      .select()
      .from(spaces)
      .where(eq(spaces.isActive, true))
      .orderBy(spaces.sortOrder);
    return allSpaces;
  }

  async getSpaceBySlug(slug: string): Promise<SpaceDB | undefined> {
    const [space] = await db
      .select()
      .from(spaces)
      .where(and(eq(spaces.slug, slug), eq(spaces.isActive, true)));
    return space;
  }

  // MetaHers World - Transformational Experiences operations
  async getExperiencesBySpace(spaceId: string): Promise<TransformationalExperienceDB[]> {
    const experiences = await db
      .select()
      .from(transformationalExperiences)
      .where(and(
        eq(transformationalExperiences.spaceId, spaceId),
        eq(transformationalExperiences.isActive, true)
      ))
      .orderBy(transformationalExperiences.sortOrder);
    return experiences;
  }

  async getExperienceById(id: string): Promise<TransformationalExperienceDB | undefined> {
    const [experience] = await db
      .select()
      .from(transformationalExperiences)
      .where(and(
        eq(transformationalExperiences.id, id),
        eq(transformationalExperiences.isActive, true)
      ));
    return experience;
  }

  async getExperienceBySlug(slug: string): Promise<TransformationalExperienceDB | undefined> {
    const [experience] = await db
      .select()
      .from(transformationalExperiences)
      .where(and(
        eq(transformationalExperiences.slug, slug),
        eq(transformationalExperiences.isActive, true)
      ));
    return experience;
  }

  async getAllExperiences(): Promise<TransformationalExperienceDB[]> {
    const experiences = await db
      .select()
      .from(transformationalExperiences)
      .where(eq(transformationalExperiences.isActive, true))
      .orderBy(transformationalExperiences.sortOrder);
    return experiences;
  }

  // MetaHers World - Experience Progress operations
  async getAllExperienceProgress(userId: string): Promise<ExperienceProgressDB[]> {
    const progress = await db
      .select()
      .from(experienceProgress)
      .where(eq(experienceProgress.userId, userId));
    return progress;
  }

  async getExperienceProgress(userId: string, experienceId: string): Promise<ExperienceProgressDB | undefined> {
    const [progress] = await db
      .select()
      .from(experienceProgress)
      .where(and(
        eq(experienceProgress.userId, userId),
        eq(experienceProgress.experienceId, experienceId)
      ));
    return progress;
  }

  async upsertExperienceProgress(progressData: InsertExperienceProgress): Promise<ExperienceProgressDB> {
    const [progress] = await db
      .insert(experienceProgress)
      .values({
        ...progressData,
        completedSections: sql`${JSON.stringify(progressData.completedSections)}::jsonb`,
        milestonesAchieved: progressData.milestonesAchieved 
          ? sql`${JSON.stringify(progressData.milestonesAchieved)}::jsonb`
          : sql`'[]'::jsonb`,
      })
      .onConflictDoUpdate({
        target: [experienceProgress.userId, experienceProgress.experienceId],
        set: {
          completedSections: sql`${JSON.stringify(progressData.completedSections)}::jsonb`,
          confidenceScore: progressData.confidenceScore,
          businessImpact: progressData.businessImpact,
          milestonesAchieved: progressData.milestonesAchieved 
            ? sql`${JSON.stringify(progressData.milestonesAchieved)}::jsonb`
            : sql`'[]'::jsonb`,
          completedAt: progressData.completedAt,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return progress;
  }

  async savePersonalizationAnswers(userId: string, experienceId: string, answers: Record<string, any>): Promise<ExperienceProgressDB> {
    const [progress] = await db
      .insert(experienceProgress)
      .values({
        userId,
        experienceId,
        personalizationAnswers: answers,
        completedSections: [],
      })
      .onConflictDoUpdate({
        target: [experienceProgress.userId, experienceProgress.experienceId],
        set: {
          personalizationAnswers: answers,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return progress;
  }

  async getPersonalizationAnswers(userId: string, experienceId: string): Promise<Record<string, any> | null> {
    const [progress] = await db
      .select()
      .from(experienceProgress)
      .where(and(
        eq(experienceProgress.userId, userId),
        eq(experienceProgress.experienceId, experienceId)
      ));
    return progress?.personalizationAnswers || null;
  }

  // App Atelier usage tracking operations
  async getAppAtelierUsage(userId: string): Promise<AppAtelierUsageDB | undefined> {
    const [usage] = await db
      .select()
      .from(appAtelierUsage)
      .where(eq(appAtelierUsage.userId, userId));
    return usage;
  }

  async incrementAppAtelierUsage(userId: string): Promise<AppAtelierUsageDB> {
    const [usage] = await db
      .insert(appAtelierUsage)
      .values({
        userId,
        messageCount: 1,
        lastMessageAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appAtelierUsage.userId,
        set: {
          messageCount: sql`${appAtelierUsage.messageCount} + 1`,
          lastMessageAt: new Date(),
        },
      })
      .returning();
    return usage;
  }
}

export const storage = new DatabaseStorage();
import { Router } from 'express';
import { db } from './db';
import {
  users,
  transformationalExperiences,
  spaces,
  sectionCompletions,
  auditLogs,
  experienceProgress,
  voyages,
  voyageBookings,
  voyageWaitlist,
  insertVoyageSchema,
  scheduledEmails,
  agentUsage,
  quizResponses,
  memberNotes,
  agentConversations,
  ritualProgress,
  journalEntries,
} from '@shared/schema';
import { storage } from './storage';
import { eq, sql, and, gte, desc, asc, like, or } from 'drizzle-orm';
import { isAuthenticated } from './auth';
import { requireAdmin } from './middleware/requireAdmin';
import { logger } from './lib/logger';
import crypto from 'crypto';

const router = Router();

// Apply authentication and admin check to all routes
router.use(isAuthenticated);
router.use(requireAdmin);

function toExperiencePayload(data: any) {
  const { difficulty, isPublished, ...payload } = data;
  if (typeof isPublished === 'boolean' && typeof payload.isActive === 'undefined') {
    payload.isActive = isPublished;
  }
  return payload;
}

// Helper function to log admin actions
async function logAdminAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: any
) {
  try {
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      createdAt: new Date(),
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to log admin action');
  }
}

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

    const [userStats] = await db.select({
      total:        sql<number>`count(*)::int`,
      free:         sql<number>`count(*) filter (where subscription_tier = 'free')::int`,
      signature:    sql<number>`count(*) filter (where subscription_tier = 'signature_monthly')::int`,
      private:      sql<number>`count(*) filter (where subscription_tier = 'private_monthly')::int`,
      blueprint:    sql<number>`count(*) filter (where subscription_tier = 'ai_blueprint')::int`,
      newThisWeek:  sql<number>`count(*) filter (where created_at >= ${sevenDaysAgo})::int`,
      newThisMonth: sql<number>`count(*) filter (where created_at >= ${thirtyDaysAgo})::int`,
    }).from(users);

    const [agentStats] = await db.select({
      totalMessages: sql<number>`coalesce(sum(message_count), 0)::int`,
      activeUsers:   sql<number>`count(*) filter (where last_used_at >= ${sevenDaysAgo})::int`,
    }).from(agentUsage);

    const [emailStats] = await db.select({
      totalScheduled: sql<number>`count(*)::int`,
      totalSent:      sql<number>`count(*) filter (where sent_at is not null)::int`,
    }).from(scheduledEmails);

    const signupsByDay = await db.select({
      date:  sql<string>`date_trunc('day', created_at)::date::text`,
      count: sql<number>`count(*)::int`,
    })
    .from(users)
    .where(gte(users.createdAt, new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)))
    .groupBy(sql`date_trunc('day', created_at)`)
    .orderBy(sql`date_trunc('day', created_at)`);

    const [completionStats] = await db.select({
      total: sql<number>`count(*)::int`,
    }).from(experienceProgress).where(sql`completed_at is not null`);

    const paid = (userStats?.signature || 0) + (userStats?.private || 0) + (userStats?.blueprint || 0);
    const total = userStats?.total || 1;
    const conversionRate = Math.round((paid / total) * 100);

    res.json({
      totalUsers:         userStats?.total || 0,
      freeUsers:          userStats?.free || 0,
      signatureUsers:     userStats?.signature || 0,
      privateUsers:       userStats?.private || 0,
      blueprintUsers:     userStats?.blueprint || 0,
      paidUsers:          paid,
      newThisWeek:        userStats?.newThisWeek || 0,
      newThisMonth:       userStats?.newThisMonth || 0,
      conversionRate,
      totalAgentMessages: agentStats?.totalMessages || 0,
      activeAgentUsers:   agentStats?.activeUsers || 0,
      emailsSent:         emailStats?.totalSent || 0,
      emailsScheduled:    emailStats?.totalScheduled || 0,
      totalCompletions:   completionStats?.total || 0,
      signupsByDay: signupsByDay.map(r => ({ date: r.date, count: r.count })),
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch admin stats');
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ===== USER MANAGEMENT =====
router.get('/users', async (req, res) => {
  try {
    const { tier, status, persona, search, page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const now = new Date();
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
    const threeDaysAgo = new Date(now); threeDaysAgo.setDate(now.getDate() - 3);

    const conditions: any[] = [];
    if (tier && tier !== 'all') conditions.push(eq(users.subscriptionTier, tier as string));
    if (search) {
      const q = `%${search}%`;
      conditions.push(or(
        sql`${users.email} ilike ${q}`,
        sql`${users.firstName} ilike ${q}`,
        sql`${users.lastName} ilike ${q}`,
      ));
    }

    const baseUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        subscriptionTier: users.subscriptionTier,
        createdAt: users.createdAt,
        onboardingCompleted: users.onboardingCompleted,
        stripeCustomerId: users.stripeCustomerId,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    const userIds = baseUsers.map(u => u.id);
    if (userIds.length === 0) return res.json([]);

    const idList = userIds.map(id => `'${id.replace(/'/g, "''")}'`).join(',');
    const idArray = sql.raw(`ARRAY[${idList}]`);

    const [quizData, agentData, emailData, journalData, notesData] = await Promise.all([
      db.select().from(quizResponses).where(sql`${quizResponses.userId} = ANY(${idArray})`).catch(() => []),
      db.select().from(agentUsage).where(sql`${agentUsage.userId} = ANY(${idArray})`).catch(() => []),
      db.select({ userId: scheduledEmails.userId, sentAt: scheduledEmails.sentAt, emailKey: scheduledEmails.emailKey })
        .from(scheduledEmails).where(sql`${scheduledEmails.userId} = ANY(${idArray})`).catch(() => []),
      db.select({
        userId: journalEntries.userId,
        count: sql<number>`count(*)::int`,
        lastEntry: sql<Date>`max(created_at)`,
      }).from(journalEntries).where(sql`${journalEntries.userId} = ANY(${idArray})`).groupBy(journalEntries.userId).catch(() => []),
      db.select({ userId: memberNotes.userId, count: sql<number>`count(*)::int` })
        .from(memberNotes).where(sql`${memberNotes.userId} = ANY(${idArray})`).groupBy(memberNotes.userId).catch(() => []),
    ]);

    const quizMap = new Map(quizData.map(q => [q.userId, q]));
    const agentMap = new Map(agentData.map(a => [a.userId, a]));
    const journalMap = new Map(journalData.map(j => [j.userId, j]));
    const notesMap = new Map(notesData.map(n => [n.userId, n.count]));

    const emailMap = new Map<string, { sent: number; total: number; lastSentAt: Date | null }>();
    for (const row of emailData) {
      if (!emailMap.has(row.userId)) emailMap.set(row.userId, { sent: 0, total: 0, lastSentAt: null });
      const e = emailMap.get(row.userId)!;
      e.total++;
      if (row.sentAt) {
        e.sent++;
        if (!e.lastSentAt || row.sentAt > e.lastSentAt) e.lastSentAt = row.sentAt;
      }
    }

    const result = baseUsers.map(u => {
      const quiz = quizMap.get(u.id);
      const agent = agentMap.get(u.id);
      const email = emailMap.get(u.id);
      const journal = journalMap.get(u.id);

      const isPaid = u.subscriptionTier !== 'free';
      const lastAgentUse = agent?.lastUsedAt ? new Date(agent.lastUsedAt) : null;
      const hasUsedAgents = (agent?.messageCount ?? 0) > 0;
      const recentlyActive = lastAgentUse && lastAgentUse > sevenDaysAgo;
      const wasActiveNotRecently = hasUsedAgents && lastAgentUse && lastAgentUse < sevenDaysAgo && lastAgentUse > fourteenDaysAgo;
      const emailsReceived = email?.sent ?? 0;
      const joinedMoreThan3DaysAgo = u.createdAt && new Date(u.createdAt) < threeDaysAgo;

      let memberStatus: 'active' | 'at_risk' | 'silent' | 'converted';
      if (isPaid) {
        memberStatus = 'converted';
      } else if (recentlyActive) {
        memberStatus = 'active';
      } else if (wasActiveNotRecently || (!hasUsedAgents && emailsReceived >= 3)) {
        memberStatus = 'at_risk';
      } else if (!hasUsedAgents && joinedMoreThan3DaysAgo) {
        memberStatus = 'silent';
      } else {
        memberStatus = 'active';
      }

      const personaMap: Record<string, string> = {
        solopreneur: 'builder', freelancer: 'builder',
        creative: 'creative',
        mom: 'mom',
      };
      const resolvedPersona = quiz?.role ? (personaMap[quiz.role] || quiz.role) : null;

      const lastActive = [lastAgentUse, email?.lastSentAt]
        .filter(Boolean)
        .sort((a, b) => b!.getTime() - a!.getTime())[0] || null;

      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        subscriptionTier: u.subscriptionTier,
        createdAt: u.createdAt,
        onboardingCompleted: u.onboardingCompleted,
        stripeCustomerId: u.stripeCustomerId,
        persona: resolvedPersona,
        quizRole: quiz?.role || null,
        quizGoal: quiz?.goal || null,
        quizExperienceLevel: quiz?.experienceLevel || null,
        quizPainPoint: quiz?.painPoint || null,
        quizCompletedAt: quiz?.completedAt || null,
        agentMessages: agent?.messageCount || 0,
        lastAgentUsed: agent?.lastUsedAt || null,
        lastAgentId: agent?.lastAgentId || null,
        emailsSent: email?.sent || 0,
        emailsTotal: email?.total || 0,
        journalEntries: journal?.count || 0,
        lastJournalEntry: journal?.lastEntry || null,
        notesCount: notesMap.get(u.id) || 0,
        memberStatus,
        lastActive,
      };
    });

    const filtered = status && status !== 'all'
      ? result.filter(u => u.memberStatus === status)
      : result;

    const personaFiltered = persona && persona !== 'all'
      ? filtered.filter(u => u.persona === persona)
      : filtered;

    res.json(personaFiltered);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch users');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id/detail', async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [
      quiz,
      agent,
      conversations,
      emails,
      experiences,
      rituals,
      journals,
      notes,
    ] = await Promise.all([
      db.select().from(quizResponses).where(eq(quizResponses.userId, id)).limit(1),
      db.select().from(agentUsage).where(eq(agentUsage.userId, id)).limit(1),
      db.select({
        agentId: agentConversations.agentId,
        messageCount: agentConversations.messageCount,
        title: agentConversations.title,
        lastMessageAt: agentConversations.lastMessageAt,
        createdAt: agentConversations.createdAt,
      }).from(agentConversations).where(eq(agentConversations.userId, id)).orderBy(desc(agentConversations.lastMessageAt)),
      db.select().from(scheduledEmails).where(eq(scheduledEmails.userId, id)).orderBy(scheduledEmails.emailKey),
      db.select({
        experienceId: experienceProgress.experienceId,
        completedSections: experienceProgress.completedSections,
        completedAt: experienceProgress.completedAt,
        startedAt: experienceProgress.startedAt,
        confidenceScore: experienceProgress.confidenceScore,
      }).from(experienceProgress).where(eq(experienceProgress.userId, id)),
      db.select({
        ritualSlug: ritualProgress.ritualSlug,
        completedSteps: ritualProgress.completedSteps,
        lastUpdated: ritualProgress.lastUpdated,
      }).from(ritualProgress).where(eq(ritualProgress.userId, id)),
      db.select({
        count: sql<number>`count(*)::int`,
        lastEntry: sql<Date>`max(created_at)`,
        streak: sql<number>`max(streak)`,
      }).from(journalEntries).where(eq(journalEntries.userId, id)),
      db.select().from(memberNotes).where(eq(memberNotes.userId, id)).orderBy(desc(memberNotes.createdAt)).catch(() => []),
    ]);

    res.json({
      user,
      quiz: quiz[0] || null,
      agent: agent[0] || null,
      conversations,
      emails,
      experiences,
      rituals,
      journal: journals[0] || null,
      notes,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch user detail');
    res.status(500).json({ error: 'Failed to fetch user detail' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionTier, isAdmin, isPro } = req.body;

    const updateData: any = {};

    if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    if (typeof isPro === 'boolean') updateData.isPro = isPro;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    await logAdminAction(
      req.session!.userId as string,
      'update',
      'user',
      id,
      { changes: updateData }
    );

    res.json(updated);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update user');
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.session!.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await db.delete(users).where(eq(users.id, id));

    await logAdminAction(
      req.session!.userId as string,
      'delete',
      'user',
      id
    );

    res.json({ success: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete user');
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/users/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    if (!note?.trim()) return res.status(400).json({ error: 'Note is required' });

    const [created] = await db.insert(memberNotes).values({
      userId: id,
      note: note.trim(),
      createdBy: req.session!.userId as string,
    }).returning();

    res.json(created);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create note');
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.delete('/users/:userId/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    await db.delete(memberNotes).where(eq(memberNotes.id, noteId));
    res.json({ success: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete note');
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

router.patch('/users/:id/tier', async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionTier } = req.body;
    const validTiers = ['free', 'signature_monthly', 'private_monthly', 'ai_blueprint'];
    if (!validTiers.includes(subscriptionTier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    const [updated] = await db.update(users)
      .set({ subscriptionTier, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id, subscriptionTier: users.subscriptionTier });
    res.json(updated);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update tier');
    res.status(500).json({ error: 'Failed to update tier' });
  }
});

// ===== SPACE MANAGEMENT =====
router.get('/spaces', async (req, res) => {
  try {
    const allSpaces = await db
      .select()
      .from(spaces)
      .orderBy(asc(spaces.sortOrder));

    res.json(allSpaces);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch spaces');
    res.status(500).json({ error: 'Failed to fetch spaces' });
  }
});

router.post('/spaces', async (req, res) => {
  try {
    const { name, slug, description, iconName, icon, color, sortOrder } = req.body;

    const [newSpace] = await db.insert(spaces).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      icon: icon || iconName,
      color,
      sortOrder: sortOrder || 999,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await logAdminAction(
      req.user!.id,
      'create',
      'space',
      newSpace.id
    );

    // Invalidate spaces cache
    const { cacheDel } = await import('./lib/cache');
    await cacheDel('spaces:all');

    res.json(newSpace);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create space');
    res.status(500).json({ error: 'Failed to create space' });
  }
});

router.put('/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, iconName, icon, color, sortOrder, isActive } = req.body;

    const updateData: any = { updatedAt: new Date() };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (icon || iconName) updateData.icon = icon || iconName;
    if (color) updateData.color = color;
    if (typeof sortOrder === 'number') updateData.sortOrder = sortOrder;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const [updated] = await db
      .update(spaces)
      .set(updateData)
      .where(eq(spaces.id, id))
      .returning();

    await logAdminAction(
      req.user!.id,
      'update',
      'space',
      id,
      { changes: updateData }
    );

    res.json(updated);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update space');
    res.status(500).json({ error: 'Failed to update space' });
  }
});

router.delete('/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(spaces).where(eq(spaces.id, id));

    await logAdminAction(
      req.user!.id,
      'delete',
      'space',
      id
    );

    res.json({ success: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete space');
    res.status(500).json({ error: 'Failed to delete space' });
  }
});

// ===== EXPERIENCE MANAGEMENT =====
router.get('/experiences', async (req, res) => {
  try {
    const { spaceId, status } = req.query;

    let query = db.select().from(transformationalExperiences);
    const conditions: any[] = [];

    if (spaceId) {
      conditions.push(eq(transformationalExperiences.spaceId, spaceId as string));
    }

    if (status === 'published') {
      conditions.push(eq(transformationalExperiences.isActive, true));
    } else if (status === 'draft') {
      conditions.push(eq(transformationalExperiences.isActive, false));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const experiences = await query.orderBy(desc(transformationalExperiences.createdAt));

    res.json(experiences);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch experiences');
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

router.post('/experiences', async (req, res) => {
  try {
    const experienceData = toExperiencePayload(req.body);

    const [experience] = await db
      .insert(transformationalExperiences)
      .values({
        ...experienceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await logAdminAction(
      req.user!.id,
      'create',
      'experience',
      experience.id,
      { title: experience.title }
    );

    res.json(experience);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create experience');
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experienceData = toExperiencePayload(req.body);

    const [updated] = await db
      .update(transformationalExperiences)
      .set({
        ...experienceData,
        updatedAt: new Date(),
      })
      .where(eq(transformationalExperiences.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await logAdminAction(
      req.user!.id,
      'update',
      'experience',
      id,
      { title: updated.title }
    );

    // Invalidate experience cache
    const { cacheDel } = await import('./lib/cache');
    await cacheDel(`experience:${updated.slug}`);

    res.json(updated);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update experience');
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(transformationalExperiences).where(eq(transformationalExperiences.id, id));

    await logAdminAction(
      req.user!.id,
      'delete',
      'experience',
      id
    );

    res.json({ success: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete experience');
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

router.post('/experiences/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;

    const [original] = await db
      .select()
      .from(transformationalExperiences)
      .where(eq(transformationalExperiences.id, id))
      .limit(1);

    if (!original) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const { id: _originalId, ...duplicateData } = original;

    const [duplicate] = await db
      .insert(transformationalExperiences)
      .values({
        ...duplicateData,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy`,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await logAdminAction(
      req.user!.id,
      'duplicate',
      'experience',
      duplicate.id,
      { originalId: id, title: duplicate.title }
    );

    res.json(duplicate);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to duplicate experience');
    res.status(500).json({ error: 'Failed to duplicate experience' });
  }
});

// ===== PROGRESS MANAGEMENT =====
router.get('/progress', async (req, res) => {
  try {
    const progress = await db
      .select()
      .from(experienceProgress)
      .orderBy(desc(experienceProgress.lastUpdated));

    res.json(progress);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch progress');
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// ===== AUDIT LOGS =====
router.get('/audit-logs', async (req, res) => {
  try {
    const { limit = '100', offset = '0' } = req.query;

    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(logs);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch audit logs');
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ===== AI USAGE ANALYTICS =====
router.get('/ai/stats', async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);

    const [totals] = await db.select({
      totalMessages: sql<number>`coalesce(sum(message_count), 0)::int`,
      totalUsers:    sql<number>`count(distinct user_id)::int`,
    }).from(agentUsage);

    const [recentTotals] = await db.select({
      messages7d:    sql<number>`coalesce(sum(message_count), 0)::int`,
      activeUsers7d: sql<number>`count(distinct user_id)::int`,
    }).from(agentConversations)
      .where(sql`${agentConversations.updatedAt} >= ${sevenDaysAgo}`);

    const [todayTotals] = await db.select({
      messagesToday: sql<number>`coalesce(sum(message_count), 0)::int`,
    }).from(agentConversations)
      .where(sql`${agentConversations.updatedAt} >= ${startOfToday}`);

    const agentBreakdown = await db.select({
      agentId:            agentConversations.agentId,
      totalMessages:      sql<number>`coalesce(sum(message_count), 0)::int`,
      totalConversations: sql<number>`count(*)::int`,
      uniqueUsers:        sql<number>`count(distinct user_id)::int`,
    }).from(agentConversations)
      .groupBy(agentConversations.agentId)
      .orderBy(sql`coalesce(sum(message_count), 0) desc`);

    const dailyVolume = await db.select({
      date:        sql<string>`date_trunc('day', updated_at)::date::text`,
      messages:    sql<number>`coalesce(sum(message_count), 0)::int`,
      activeUsers: sql<number>`count(distinct user_id)::int`,
    }).from(agentConversations)
      .where(sql`${agentConversations.updatedAt} >= ${new Date(now.getTime() - 14 * 86400000)}`)
      .groupBy(sql`date_trunc('day', updated_at)`)
      .orderBy(sql`date_trunc('day', updated_at)`);

    const tierSplit = await db.select({
      tier:          users.subscriptionTier,
      totalMessages: sql<number>`coalesce(sum(${agentUsage.messageCount}), 0)::int`,
      userCount:     sql<number>`count(distinct ${agentUsage.userId})::int`,
    }).from(agentUsage)
      .leftJoin(users, eq(agentUsage.userId, users.id))
      .groupBy(users.subscriptionTier);

    const [limitHits] = await db.select({
      count: sql<number>`count(*)::int`,
    }).from(agentUsage)
      .leftJoin(users, eq(agentUsage.userId, users.id))
      .where(and(
        eq(users.subscriptionTier, 'free'),
        sql`${agentUsage.messageCount} >= 10`
      ));

    const topUsers = await db.select({
      userId:           agentUsage.userId,
      email:            users.email,
      firstName:        users.firstName,
      subscriptionTier: users.subscriptionTier,
      messageCount:     agentUsage.messageCount,
      lastUsedAt:       agentUsage.lastUsedAt,
      lastAgentId:      agentUsage.lastAgentId,
    }).from(agentUsage)
      .leftJoin(users, eq(agentUsage.userId, users.id))
      .orderBy(desc(agentUsage.messageCount))
      .limit(10);

    const [newConvos] = await db.select({
      count: sql<number>`count(*)::int`,
    }).from(agentConversations)
      .where(sql`${agentConversations.createdAt} >= ${sevenDaysAgo}`);

    res.json({
      totals: {
        totalMessages:      totals?.totalMessages || 0,
        totalUsersEverUsed: totals?.totalUsers || 0,
        messages7d:         recentTotals?.messages7d || 0,
        activeUsers7d:      recentTotals?.activeUsers7d || 0,
        messagesToday:      todayTotals?.messagesToday || 0,
        newConversations7d: newConvos?.count || 0,
        usersAtFreeLimit:   limitHits?.count || 0,
      },
      agentBreakdown,
      dailyVolume: dailyVolume.map(d => ({
        date:        new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        messages:    d.messages,
        activeUsers: d.activeUsers,
      })),
      tierSplit,
      topUsers,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch AI stats');
    res.status(500).json({ error: 'Failed to fetch AI stats' });
  }
});

router.post('/ai/clear-cache', async (req, res) => {
  try {
    const { cacheDelPattern } = await import('./lib/cache');
    const deleted = await cacheDelPattern('ai:*');
    
    res.json({ 
      success: true, 
      message: 'AI cache cleared',
      keysDeleted: deleted
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to clear cache');
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// Get cache statistics
router.get('/cache/stats', async (req, res) => {
  try {
    const { getCacheStats, getCacheMemoryUsage } = await import('./lib/cache');
    const { checkRedisHealth } = await import('./lib/redis');
    
    const stats = getCacheStats();
    const memory = await getCacheMemoryUsage();
    const healthy = await checkRedisHealth();
    
    res.json({
      healthy,
      stats,
      memory,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to get cache stats');
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

// Clear cache by pattern
router.post('/cache/clear/:pattern', async (req, res) => {
  try {
    const { pattern } = req.params;
    const { cacheDelPattern } = await import('./lib/cache');
    
    // Validate pattern to prevent dangerous wildcards
    if (pattern === '*') {
      return res.status(400).json({ 
        error: 'Cannot clear all cache keys. Use specific patterns like "spaces:*" or "experience:*"' 
      });
    }
    
    const deleted = await cacheDelPattern(pattern);
    
    res.json({ 
      success: true, 
      message: `Cache cleared for pattern: ${pattern}`,
      keysDeleted: deleted
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to clear cache pattern');
    res.status(500).json({ error: 'Failed to clear cache pattern' });
  }
});

// ===== VOYAGE MANAGEMENT =====

// Get all voyages with stats
router.get('/voyages', async (req, res) => {
  try {
    const allVoyages = await db
      .select()
      .from(voyages)
      .orderBy(asc(voyages.sequenceNumber));

    // Get booking stats for each voyage
    const voyagesWithStats = await Promise.all(
      allVoyages.map(async (voyage) => {
        const bookings = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(voyageBookings)
          .where(and(
            eq(voyageBookings.voyageId, voyage.id),
            eq(voyageBookings.status, 'confirmed')
          ));

        const waitlist = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(voyageWaitlist)
          .where(eq(voyageWaitlist.voyageId, voyage.id));

        return {
          ...voyage,
          confirmedBookings: bookings[0]?.count || 0,
          waitlistCount: waitlist[0]?.count || 0,
        };
      })
    );

    res.json(voyagesWithStats);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch voyages');
    res.status(500).json({ error: 'Failed to fetch voyages' });
  }
});

// Get single voyage
router.get('/voyages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const voyage = await db.select().from(voyages).where(eq(voyages.id, id)).limit(1);
    
    if (!voyage || voyage.length === 0) {
      return res.status(404).json({ error: 'Voyage not found' });
    }

    // Get bookings for this voyage
    const bookings = await db
      .select()
      .from(voyageBookings)
      .where(eq(voyageBookings.voyageId, id))
      .orderBy(desc(voyageBookings.createdAt));

    res.json({ ...voyage[0], bookings });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch voyage');
    res.status(500).json({ error: 'Failed to fetch voyage' });
  }
});

// Create new voyage
router.post('/voyages', async (req, res) => {
  try {
    const userId = req.session?.userId as string;
    const voyageData = req.body;

    // Generate slug from title
    const slug = voyageData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create the voyage
    const newVoyage = await db.insert(voyages).values({
      ...voyageData,
      slug,
      learningObjectives: voyageData.learningObjectives || [],
      included: voyageData.included || [],
      images: voyageData.images || [],
      currentBookings: 0,
    }).returning();

    await logAdminAction(userId, 'create', 'voyage', newVoyage[0].id, { title: voyageData.title });

    res.json(newVoyage[0]);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create voyage');
    res.status(500).json({ error: 'Failed to create voyage' });
  }
});

// Update voyage
router.patch('/voyages/:id', async (req, res) => {
  try {
    const userId = req.session?.userId as string;
    const { id } = req.params;
    const updates = req.body;

    // Update slug if title changed
    if (updates.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const updated = await db
      .update(voyages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(voyages.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: 'Voyage not found' });
    }

    await logAdminAction(userId, 'update', 'voyage', id, { updates: Object.keys(updates) });

    res.json(updated[0]);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update voyage');
    res.status(500).json({ error: 'Failed to update voyage' });
  }
});

// Delete voyage
router.delete('/voyages/:id', async (req, res) => {
  try {
    const userId = req.session?.userId as string;
    const { id } = req.params;

    // Check for existing bookings
    const bookings = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(voyageBookings)
      .where(and(
        eq(voyageBookings.voyageId, id),
        eq(voyageBookings.status, 'confirmed')
      ));

    if (bookings[0]?.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete voyage with confirmed bookings. Cancel bookings first.' 
      });
    }

    await db.delete(voyages).where(eq(voyages.id, id));
    await logAdminAction(userId, 'delete', 'voyage', id);

    res.json({ success: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete voyage');
    res.status(500).json({ error: 'Failed to delete voyage' });
  }
});

// Get voyage bookings
router.get('/voyages/:id/bookings', async (req, res) => {
  try {
    const { id } = req.params;
    
    const bookings = await db
      .select({
        id: voyageBookings.id,
        userId: voyageBookings.userId,
        status: voyageBookings.status,
        paymentStatus: voyageBookings.paymentStatus,
        amount: voyageBookings.amount,
        confirmationCode: voyageBookings.confirmationCode,
        createdAt: voyageBookings.createdAt,
        userEmail: users.email,
        userName: users.firstName,
      })
      .from(voyageBookings)
      .leftJoin(users, eq(voyageBookings.userId, users.id))
      .where(eq(voyageBookings.voyageId, id))
      .orderBy(desc(voyageBookings.createdAt));

    res.json(bookings);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch voyage bookings');
    res.status(500).json({ error: 'Failed to fetch voyage bookings' });
  }
});

// Update booking status
router.patch('/voyages/bookings/:bookingId', async (req, res) => {
  try {
    const userId = req.session?.userId as string;
    const { bookingId } = req.params;
    const { status } = req.body;

    const updated = await db
      .update(voyageBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(voyageBookings.id, bookingId))
      .returning();

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update voyage currentBookings count
    if (status === 'cancelled' || status === 'refunded') {
      await db
        .update(voyages)
        .set({ currentBookings: sql`current_bookings - 1` })
        .where(eq(voyages.id, updated[0].voyageId));
    }

    await logAdminAction(userId, 'update', 'voyageBooking', bookingId, { newStatus: status });

    res.json(updated[0]);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update booking');
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Get voyage stats summary
router.get('/voyages-stats', async (req, res) => {
  try {
    const totalVoyages = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(voyages);

    const upcomingVoyages = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(voyages)
      .where(eq(voyages.status, 'upcoming'));

    const totalBookings = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(voyageBookings)
      .where(eq(voyageBookings.status, 'confirmed'));

    const totalRevenue = await db
      .select({ sum: sql<number>`coalesce(sum(amount), 0)::int` })
      .from(voyageBookings)
      .where(eq(voyageBookings.paymentStatus, 'paid'));

    const totalWaitlist = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(voyageWaitlist);

    res.json({
      totalVoyages: totalVoyages[0]?.count || 0,
      upcomingVoyages: upcomingVoyages[0]?.count || 0,
      totalBookings: totalBookings[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.sum || 0,
      totalWaitlist: totalWaitlist[0]?.count || 0,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch voyage stats');
    res.status(500).json({ error: 'Failed to fetch voyage stats' });
  }
});

// ===== EMAIL SEQUENCE TRACKER =====

router.get('/email-sequence', async (req, res) => {
  try {
    const { status, persona, search } = req.query as Record<string, string>;

    const rows = await db
      .select({
        id: scheduledEmails.id,
        userId: scheduledEmails.userId,
        emailKey: scheduledEmails.emailKey,
        scheduledFor: scheduledEmails.scheduledFor,
        sentAt: scheduledEmails.sentAt,
        persona: scheduledEmails.persona,
        variant: scheduledEmails.variant,
        createdAt: scheduledEmails.createdAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userTier: users.subscriptionTier,
      })
      .from(scheduledEmails)
      .leftJoin(users, eq(scheduledEmails.userId, users.id))
      .orderBy(desc(scheduledEmails.createdAt), scheduledEmails.emailKey);

    let filtered = rows;

    if (status === 'sent') {
      filtered = filtered.filter(r => r.sentAt !== null);
    } else if (status === 'pending') {
      filtered = filtered.filter(r => r.sentAt === null);
    } else if (status === 'skipped') {
      filtered = filtered.filter(r => r.persona === 'upgraded');
    }

    if (persona && persona !== 'all') {
      filtered = filtered.filter(r => r.persona === persona);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.userEmail?.toLowerCase().includes(q) ||
        r.userFirstName?.toLowerCase().includes(q)
      );
    }

    const userMap = new Map<string, {
      userId: string;
      email: string;
      firstName: string | null;
      tier: string | null;
      persona: string | null;
      emailsSent: number;
      emailsPending: number;
      emailsTotal: number;
      emails: typeof filtered;
    }>();

    for (const row of filtered) {
      if (!userMap.has(row.userId)) {
        userMap.set(row.userId, {
          userId: row.userId,
          email: row.userEmail || '',
          firstName: row.userFirstName,
          tier: row.userTier,
          persona: row.persona,
          emailsSent: 0,
          emailsPending: 0,
          emailsTotal: 0,
          emails: [],
        });
      }
      const entry = userMap.get(row.userId)!;
      entry.emails.push(row);
      entry.emailsTotal++;
      if (row.sentAt) entry.emailsSent++;
      else entry.emailsPending++;
      if (!entry.persona && row.persona) entry.persona = row.persona;
    }

    const allRows = await db
      .select({ id: scheduledEmails.id, sentAt: scheduledEmails.sentAt, userId: scheduledEmails.userId })
      .from(scheduledEmails);

    const totalScheduled = allRows.length;
    const totalSent = allRows.filter(r => r.sentAt !== null).length;
    const totalPending = allRows.filter(r => r.sentAt === null).length;
    const uniqueUsers = new Set(allRows.map(r => r.userId)).size;

    res.json({
      stats: { totalScheduled, totalSent, totalPending, uniqueUsers },
      users: Array.from(userMap.values()),
    });
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed to fetch email sequence data');
    res.status(500).json({ message: 'Failed to fetch email sequence data' });
  }
});

router.post('/email-sequence/backfill', async (req, res) => {
  try {
    const allFreeUsers = await db
      .select({ id: users.id, email: users.email, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.subscriptionTier, 'free'));

    const alreadyScheduled = await db
      .select({ userId: scheduledEmails.userId })
      .from(scheduledEmails);

    const scheduledUserIds = new Set(alreadyScheduled.map(r => r.userId));
    const toBackfill = allFreeUsers.filter(u => !scheduledUserIds.has(u.id));

    if (toBackfill.length === 0) {
      return res.json({ message: 'All free users already in sequence', enrolled: 0 });
    }

    let enrolled = 0;
    let failed = 0;

    for (const user of toBackfill) {
      try {
        const signupDate = user.createdAt || new Date();
        await storage.scheduleEmailSequence(user.id, signupDate);
        enrolled++;
      } catch (err: any) {
        logger.error({ error: err.message, userId: user.id }, 'Backfill failed for user');
        failed++;
      }
    }

    res.json({ message: 'Backfill complete', enrolled, failed, total: toBackfill.length });
  } catch (err: any) {
    logger.error({ error: err.message }, 'Backfill endpoint error');
    res.status(500).json({ message: 'Backfill failed' });
  }
});

export default router;

import { Router } from 'express';
import { db } from './db';
import {
  users,
  transformationalExperiences,
  spaces,
  sectionCompletions,
  auditLogs,
  experienceProgress // Import experienceProgress
} from '@shared/schema';
import { eq, sql, and, gte, desc, asc, like, or } from 'drizzle-orm';
import { isAuthenticated } from './auth';
import { requireAdmin } from './middleware/requireAdmin';
import { logger } from './lib/logger';
import crypto from 'crypto';

const router = Router();

// Apply authentication and admin check to all routes
router.use(isAuthenticated);
router.use(requireAdmin);

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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get user counts by tier
    const userStats = await db
      .select({
        total: sql<number>`count(*)::int`,
        free: sql<number>`count(*) filter (where subscription_tier = 'free')::int`,
        pro: sql<number>`count(*) filter (where subscription_tier = 'pro')::int`,
        vip: sql<number>`count(*) filter (where subscription_tier = 'vip')::int`,
        active: sql<number>`count(*) filter (where last_login >= ${sevenDaysAgo})::int`,
      })
      .from(users);

    // Get experience count
    const experienceCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(transformationalExperiences)
      .where(eq(transformationalExperiences.isActive, true));

    // Get total completions
    const completionCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(experienceProgress)
      .where(sql`completed_at is not null`);

    res.json({
      totalUsers: userStats[0]?.total || 0,
      freeUsers: userStats[0]?.free || 0,
      proUsers: userStats[0]?.pro || 0,
      vipUsers: userStats[0]?.vip || 0,
      activeUsers: userStats[0]?.active || 0,
      totalExperiences: experienceCount[0]?.count || 0,
      totalCompletions: completionCount[0]?.count || 0,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch admin stats');
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ===== USER MANAGEMENT =====
router.get('/users', async (req, res) => {
  try {
    const { tier, search, active, page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select().from(users);
    const conditions: any[] = [];

    if (tier) {
      conditions.push(eq(users.subscriptionTier, tier as string));
    }

    if (search) {
      conditions.push(
        or(
          like(users.email, `%${search}%`),
          like(users.fullName, `%${search}%`)
        )
      );
    }

    if (active === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      conditions.push(gte(users.lastLogin, sevenDaysAgo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const allUsers = await query
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    res.json(allUsers);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch users');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's progress
    const progress = await db
      .select()
      .from(experienceProgress)
      .where(eq(experienceProgress.userId, id));

    res.json({ user, progress });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch user details');
    res.status(500).json({ error: 'Failed to fetch user details' });
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
      req.user!.id,
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
    if (id === req.user!.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await db.delete(users).where(eq(users.id, id));

    await logAdminAction(
      req.user!.id,
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
    const { name, slug, description, iconName, color, requiredTier, sortOrder } = req.body;

    const [newSpace] = await db.insert(spaces).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      iconName,
      color,
      requiredTier: requiredTier || 'free',
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

    res.json(newSpace);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create space');
    res.status(500).json({ error: 'Failed to create space' });
  }
});

router.put('/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, iconName, color, requiredTier, sortOrder, isActive } = req.body;

    const updateData: any = { updatedAt: new Date() };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (iconName) updateData.iconName = iconName;
    if (color) updateData.color = color;
    if (requiredTier) updateData.requiredTier = requiredTier;
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
    const { spaceId, difficulty, status } = req.query;

    let query = db.select().from(transformationalExperiences);
    const conditions: any[] = [];

    if (spaceId) {
      conditions.push(eq(transformationalExperiences.spaceId, spaceId as string));
    }

    if (difficulty) {
      conditions.push(eq(transformationalExperiences.difficulty, difficulty as string));
    }

    if (status === 'published') {
      conditions.push(eq(transformationalExperiences.isPublished, true));
    } else if (status === 'draft') {
      conditions.push(eq(transformationalExperiences.isPublished, false));
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
    const experienceData = req.body;

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
    const experienceData = req.body;

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

    const [duplicate] = await db
      .insert(transformationalExperiences)
      .values({
        ...original,
        id: undefined,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy`,
        isPublished: false,
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

export default router;
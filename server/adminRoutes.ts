
import { Router } from 'express';
import { db } from './db';
import { 
  users, 
  transformationalExperiences, 
  spaces, 
  userProgress,
  sectionCompletions,
  auditLogs 
} from '@shared/schema';
import { eq, sql, and, gte, desc, asc, like, or } from 'drizzle-orm';
import { isAuthenticated } from './auth';
import { requireAdmin } from './middleware/requireAdmin';
import { logger } from './lib/logger';

const router = Router();

// Apply authentication and admin check to all routes
router.use(isAuthenticated);
router.use(requireAdmin);

// Helper function to log admin actions
async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  changes?: any
) {
  try {
    await db.insert(auditLogs).values({
      adminId,
      action,
      entityType,
      entityId: entityId || null,
      changes: changes || null,
    });
  } catch (error) {
    logger.error({ error, adminId, action, entityType }, 'Failed to log admin action');
  }
}

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [freeUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionTier, 'free'));

    const [proUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionTier, 'pro'));

    const [vipUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionTier, 'vip'));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [activeUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.lastLoginAt, sevenDaysAgo));

    const [totalExperiencesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transformationalExperiences);

    const [totalCompletionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sectionCompletions);

    const stats = {
      totalUsers: totalUsersResult?.count || 0,
      freeUsers: freeUsersResult?.count || 0,
      proUsers: proUsersResult?.count || 0,
      vipUsers: vipUsersResult?.count || 0,
      activeUsers: activeUsersResult?.count || 0,
      totalExperiences: totalExperiencesResult?.count || 0,
      totalCompletions: totalCompletionsResult?.count || 0,
    };

    res.json(stats);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch admin stats');
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ===== USER MANAGEMENT =====
router.get('/users', async (req, res) => {
  try {
    const { 
      tier, 
      search, 
      active,
      limit = '50',
      offset = '0'
    } = req.query;

    let query = db.select().from(users);
    const conditions: any[] = [];

    if (tier && tier !== 'all') {
      conditions.push(eq(users.subscriptionTier, tier as string));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(users.email, searchTerm),
          like(users.username, searchTerm),
          like(users.displayName, searchTerm)
        )
      );
    }

    if (active === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      conditions.push(gte(users.lastLoginAt, sevenDaysAgo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const usersList = await query
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Remove sensitive data
    const sanitizedUsers = usersList.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      subscriptionTier: user.subscriptionTier,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    }));

    res.json(sanitizedUsers);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch users');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's progress
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, id));

    // Get completion count
    const [completions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sectionCompletions)
      .where(eq(sectionCompletions.userId, id));

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      subscriptionTier: user.subscriptionTier,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      progress,
      completionCount: completions?.count || 0,
    };

    res.json(sanitizedUser);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch user details');
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionTier, isAdmin, emailVerified } = req.body;

    const updateData: any = {};
    if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    if (typeof emailVerified === 'boolean') updateData.emailVerified = emailVerified;
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAdminAction(
      req.user!.id,
      'update',
      'user',
      id,
      { changes: updateData }
    );

    res.json({ success: true, user: updated });
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
    const { name, slug, description, icon, color, isActive, sortOrder } = req.body;

    const [space] = await db
      .insert(spaces)
      .values({
        name,
        slug,
        description,
        icon,
        color,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    await logAdminAction(
      req.user!.id,
      'create',
      'space',
      space.id,
      { name, slug }
    );

    res.json(space);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create space');
    res.status(500).json({ error: 'Failed to create space' });
  }
});

router.put('/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, color, isActive, sortOrder } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon) updateData.icon = icon;
    if (color) updateData.color = color;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof sortOrder === 'number') updateData.sortOrder = sortOrder;

    const [updated] = await db
      .update(spaces)
      .set(updateData)
      .where(eq(spaces.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Space not found' });
    }

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

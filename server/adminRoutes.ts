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

// ===== AI USAGE ANALYTICS =====
router.get('/ai/stats', async (req, res) => {
  try {
    const { getMonthlyUsageStats } = await import('./lib/aiBudget');
    const stats = await getMonthlyUsageStats();
    res.json(stats);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch AI stats');
    res.status(500).json({ error: 'Failed to fetch AI stats' });
  }
});

router.get('/ai/usage-by-type', async (req, res) => {
  try {
    const { getUsageByPromptType } = await import('./lib/aiBudget');
    const usage = await getUsageByPromptType();
    res.json(usage);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch AI usage by type');
    res.status(500).json({ error: 'Failed to fetch AI usage by type' });
  }
});

router.get('/ai/top-spenders', async (req, res) => {
  try {
    const { limit = '10' } = req.query;
    const { getTopSpenders } = await import('./lib/aiBudget');
    const spenders = await getTopSpenders(parseInt(limit as string));
    res.json(spenders);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch top spenders');
    res.status(500).json({ error: 'Failed to fetch top spenders' });
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

import { db } from '../db';
import { aiUsage, users } from '@shared/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

export const BUDGET_LIMITS = {
  free: 0.50,
  pro: 10.00,
  sanctuary: 25.00,
  inner_circle: 50.00,
  founders_circle: Infinity,
} as const;

export async function getUserBudgetStatus(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new Error('User not found');
  }

  const tier = user.subscriptionTier as keyof typeof BUDGET_LIMITS;
  const limit = BUDGET_LIMITS[tier] || BUDGET_LIMITS.free;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({ 
      total: sql<number>`COALESCE(SUM(CAST(cost AS DECIMAL)), 0)`,
      count: sql<number>`COUNT(*)::int`
    })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, userId),
        gte(aiUsage.timestamp, startOfMonth)
      )
    );

  const spent = Number(result?.total || 0);
  const requestCount = Number(result?.count || 0);

  return {
    tier,
    limit,
    spent,
    remaining: limit === Infinity ? Infinity : Math.max(0, limit - spent),
    percentage: limit === Infinity ? 0 : (spent / limit) * 100,
    requestCount,
    canMakeRequest: limit === Infinity || spent < limit,
  };
}

export async function getMonthlyUsageStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const stats = await db
    .select({
      totalCost: sql<number>`COALESCE(SUM(CAST(cost AS DECIMAL)), 0)`,
      totalRequests: sql<number>`COUNT(*)::int`,
      totalTokens: sql<number>`COALESCE(SUM(total_tokens), 0)::int`,
      cacheHitRate: sql<number>`
        CASE 
          WHEN COUNT(*) > 0 
          THEN (COUNT(*) FILTER (WHERE cached = true)::float / COUNT(*)::float) * 100
          ELSE 0 
        END
      `,
      avgLatency: sql<number>`COALESCE(AVG(latency_ms), 0)::int`,
    })
    .from(aiUsage)
    .where(gte(aiUsage.timestamp, startOfMonth));

  return stats[0];
}

export async function getUsageByPromptType(startDate?: Date) {
  const start = startDate || (() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  return db
    .select({
      promptType: aiUsage.promptType,
      totalCost: sql<number>`COALESCE(SUM(CAST(cost AS DECIMAL)), 0)`,
      requestCount: sql<number>`COUNT(*)::int`,
      avgLatency: sql<number>`COALESCE(AVG(latency_ms), 0)::int`,
    })
    .from(aiUsage)
    .where(gte(aiUsage.timestamp, start))
    .groupBy(aiUsage.promptType);
}

export async function getTopSpenders(limit = 10) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return db
    .select({
      userId: aiUsage.userId,
      email: users.email,
      tier: users.subscriptionTier,
      totalCost: sql<number>`COALESCE(SUM(CAST(ai_usage.cost AS DECIMAL)), 0)`,
      requestCount: sql<number>`COUNT(*)::int`,
    })
    .from(aiUsage)
    .innerJoin(users, eq(aiUsage.userId, users.id))
    .where(gte(aiUsage.timestamp, startOfMonth))
    .groupBy(aiUsage.userId, users.email, users.subscriptionTier)
    .orderBy(sql`COALESCE(SUM(CAST(ai_usage.cost AS DECIMAL)), 0) DESC`)
    .limit(limit);
}

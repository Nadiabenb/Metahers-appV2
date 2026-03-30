import * as bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { RedisStore } from "connect-redis";
import { pool } from "./db";
import { getRedisClient } from "./lib/redis";
import { users, passwordResetTokens, type User, type InsertUser, type InsertPasswordResetToken } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { logger } from "./lib/logger";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function setupAuth(app: Express) {
  // Try to use Redis for sessions, fallback to PostgreSQL
  const redisClient = getRedisClient();
  let sessionStore;

  if (redisClient) {
    logger.info('Using Redis for session storage');
    sessionStore = new RedisStore({
      client: redisClient,
      prefix: 'metahers:session:',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
    });
  } else {
    logger.info('Using PostgreSQL for session storage (Redis unavailable)');
    const PgSession = connectPg(session);
    sessionStore = new PgSession({
      pool,
      createTableIfMissing: false,
    });
  }

  // Session middleware
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  logger.warn({
    path: req.path,
    method: req.method,
    ip: req.ip,
  }, 'Unauthorized access attempt');

  return res.status(401).json({ message: "Unauthorized" });
};

export const isSignatureOrAbove: RequestHandler = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { storage } = await import("./storage");
  const user = await storage.getUser(req.session.userId);
  const { isSignatureTier } = await import("../shared/pricing");

  if (!user || (!user.isPro && !isSignatureTier(user.subscriptionTier as any))) {
    return res.status(403).json({ message: "Signature subscription required" });
  }

  return next();
};

// Backward-compat alias
export const isProUser = isSignatureOrAbove;

// Thought Leadership freemium access: Free users get days 1-3, Pro gets all 30 days
export const canAccessThoughtLeadership: RequestHandler = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};

export const isPrivateOrAbove: RequestHandler = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { storage } = await import("./storage");
  const user = await storage.getUser(req.session.userId);
  const { isPrivateTier } = await import("../shared/pricing");

  if (!user || !isPrivateTier(user.subscriptionTier as any)) {
    return res.status(403).json({
      message: "Private tier or higher required",
      requiredTier: "private_monthly"
    });
  }

  return next();
};

// Backward-compat alias
export const isSanctuaryMember = isPrivateOrAbove;

// Backward-compat aliases — both map to private tier in v2
export const isInnerCircleMember = isPrivateOrAbove;
export const isFoundersCircleMember = isPrivateOrAbove;

/**
 * Admin middleware - protects sensitive admin endpoints
 * Only allows specific admin emails defined in environment
 */
export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { storage } = await import("./storage");
  const user = await storage.getUser(req.session.userId);

  // Define admin emails (should be in environment variable)
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

  if (!user || !adminEmails.includes(user.email.toLowerCase())) {
    logger.warn({
      userId: user?.id,
      email: user?.email,
      ip: req.ip,
      path: req.path,
    }, 'Admin access denied');
    return res.status(403).json({ message: "Admin access required" });
  }

  logger.info({
    userId: user.id,
    email: user.email,
    ip: req.ip,
    path: req.path,
  }, 'Admin access granted');
  return next();
};

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
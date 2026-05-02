
import rateLimit from 'express-rate-limit';

// In-memory store for development
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per hour
  message: 'AI request limit reached, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.session?.userId || req.ip || 'unknown';
  },
});

export const journalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 journal operations per minute
  message: 'Too many journal operations, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

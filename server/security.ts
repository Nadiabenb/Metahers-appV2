import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import type { Express } from 'express';

/**
 * Rate limiting configuration
 * Protects against brute force attacks and API abuse
 */
export function setupRateLimiting(app: Express) {
  // Global rate limit: 100 requests per 15 minutes per IP
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Strict rate limit for auth endpoints: 5 requests per 15 minutes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful auth attempts
  });

  // Admin endpoint limiter: 10 requests per hour
  const adminLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: 'Too many admin requests, please try again later.',
  });

  // Apply global rate limiting
  app.use('/api/', globalLimiter);

  // Apply strict limits to authentication endpoints
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);
  app.use('/api/auth/request-password-reset', authLimiter);

  // Apply strict limits to admin endpoints
  app.use('/api/admin/', adminLimiter);
}

/**
 * Security headers configuration using Helmet
 * Protects against XSS, clickjacking, and other vulnerabilities
 */
export function setupSecurityHeaders(app: Express) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required for Vite in development
          "'unsafe-eval'", // Required for Vite in development
          "https://js.stripe.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for styled-components
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http:", // Allow all images (for user avatars, external content)
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Required for some third-party resources
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny', // Prevent clickjacking
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  }));
}

/**
 * CORS configuration
 * Only allows requests from trusted origins
 * SECURITY: Actively rejects requests from unauthorized origins before they reach routes
 */
export function setupCORS(app: Express) {
  const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173', // Vite dev server
    'https://app.metahers.ai',
    'https://metahers.ai', // Production domain without subdomain
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  ].filter(Boolean) as string[];

  // First middleware: Actively reject disallowed origins BEFORE processing the request
  app.use((req, res, next) => {
    const origin = req.get('Origin');
    
    // Allow requests with no origin (server-to-server, mobile apps, curl, Stripe webhooks)
    if (!origin) {
      return next();
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return next();
    }

    // SECURITY: Reject requests from unauthorized origins with 403
    console.warn(`CORS blocked and rejected request from unauthorized origin: ${origin} to ${req.method} ${req.path}`);
    return res.status(403).json({ 
      message: 'Origin not allowed by CORS policy',
      origin: origin 
    });
  });

  // Second middleware: Set CORS headers for allowed origins
  app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false, // Handle OPTIONS automatically
    optionsSuccessStatus: 204, // For legacy browsers
  }));
}

/**
 * Input sanitization utilities
 * Protects against XSS attacks
 */
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function sanitizeText(text: string): string {
  // Remove any HTML tags and scripts
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Deep sanitization for nested objects (like rich text editor content)
 * Recursively sanitizes all string values in an object
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Sanitize string values (remove scripts but allow basic HTML)
    return sanitizeHTML(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  // Return primitives as-is (numbers, booleans, etc.)
  return obj;
}

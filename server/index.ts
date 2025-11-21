import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurityHeaders, setupCORS, setupRateLimiting } from "./security";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./lib/logger";
import { requestLogger } from "./middleware/requestLogger";
import adminRoutes from './adminRoutes';

console.log("PRODUCTION BUILD:", new Date().toISOString());

const app = express();

// Trust proxy for rate limiting and session security
app.set("trust proxy", 1);

// Security headers (Helmet) - must be first
setupSecurityHeaders(app);

// CORS configuration - allow only trusted origins
setupCORS(app);

// Rate limiting - protect against abuse
setupRateLimiting(app);

// Gzip/Brotli compression for all responses (reduces LCP/FCP by 60-70%)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6 // Balance between speed and compression ratio
}));

// Stripe webhook needs raw body for signature verification
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use(requestLogger);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    logger.info({ mode: app.get("env") }, 'Starting server');

    // Verify critical environment variables
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set - database connection will fail");
    }
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is not set - sessions will fail");
    }
    logger.info('Environment variables validated');

    const server = await registerRoutes(app);
    logger.info('Routes registered');

    // Register Stripe routes
    const { registerStripeRoutes } = await import('./stripeRoutes');
    await registerStripeRoutes(app);
    logger.info('Stripe routes registered');

    // Register admin routes
    app.use('/api/admin', adminRoutes);

    // Global error handler (must be after routes)
    app.use(errorHandler);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
      logger.info('Vite dev server setup');
    } else {
      serveStatic(app);
      logger.info('Static files configured for production');
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);

    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, async () => {
      logger.info({ port, host: '0.0.0.0', env: app.get("env") }, 'Server successfully started');
      logger.info('Ready to accept traffic');

      // Seed database in production only if needed (check if data exists first)
      if (app.get("env") === "production") {
        try {
          const { db } = await import("./db");
          const { transformationalExperiences, spaces } = await import("@shared/schema");

          // Check if database is already populated
          const existingExperiences = await db.select().from(transformationalExperiences);
          const existingSpaces = await db.select().from(spaces);

          if (existingSpaces.length === 0 || existingExperiences.length < 54) {
            logger.info('Database appears empty or incomplete. Use /api/admin/populate-database endpoint to seed data.');
          } else {
            logger.info({ spaces: existingSpaces.length, experiences: existingExperiences.length }, 'Database already populated');
          }
        } catch (error) {
          logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Database seeding check failed');
          logger.info('TIP: Use /api/admin/populate-database endpoint to manually seed the database');
        }
      }
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.fatal({ port, error: error.message }, 'Port is already in use');
      } else if (error.code === 'EACCES') {
        logger.fatal({ port, error: error.message }, 'Permission denied to bind to port');
      } else {
        logger.fatal({ error: error.message, stack: error.stack }, 'Server failed to start');
      }
      process.exit(1);
    });

  } catch (error) {
    logger.fatal({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Fatal error during startup');
    process.exit(1);
  }
})();
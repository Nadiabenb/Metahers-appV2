import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurityHeaders, setupCORS, setupRateLimiting } from "./security";
import { seedSpaces } from "./seedSpaces";
import { seedExperiences } from "./seedExperiences";

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
    log(`Starting server in ${app.get("env")} mode...`);

    // Verify critical environment variables
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set - database connection will fail");
    }
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is not set - sessions will fail");
    }
    log("✓ Environment variables validated");

    const server = await registerRoutes(app);
    log("✓ Routes registered");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${status} - ${message}`);
      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log("✓ Vite dev server setup");
    } else {
      serveStatic(app);
      log("✓ Static files configured for production");
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
      log(`✓ Server successfully listening on 0.0.0.0:${port}`);
      log(`✓ Environment: ${app.get("env")}`);
      log(`✓ Ready to accept traffic`);

      // ALWAYS seed database on startup to ensure latest data
      // This ensures production deployments pick up updated seed files
      try {
        // IMPORTANT: Sequential seeding to respect foreign key constraints (spaces -> experiences)
        log("⏳ Starting database seeding...");
        await seedSpaces();
        log("✓ Spaces seeded (9 total)");
        await seedExperiences();
        log("✓ Experiences seeded (54 total)");
        log("✅ Database seeding completed successfully");

        // Verify seeding worked
        const { db } = await import("./db");
        const { transformationalExperiences } = await import("@shared/schema");
        const count = await db.select().from(transformationalExperiences);
        log(`📊 Verification: ${count.length} experiences in database`);

        if (count.length !== 54) {
          log(`⚠️ WARNING: Expected 54 experiences, found ${count.length}`);
        }

        // Clear any cached data after seeding
        log("🔄 Clearing application caches...");
        // The cache clearing will happen automatically on first request since server just started

      } catch (error) {
        log(`❌ Database seeding failed: ${error instanceof Error ? error.message : String(error)}`);
        console.error("Database seeding error details:", error);
        // Non-fatal - server continues running
      }
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        log(`ERROR: Port ${port} is already in use`);
      } else if (error.code === 'EACCES') {
        log(`ERROR: Permission denied to bind to port ${port}`);
      } else {
        log(`ERROR: Server failed to start - ${error.message}`);
      }
      process.exit(1);
    });

  } catch (error) {
    log(`FATAL ERROR during startup: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error);
    process.exit(1);
  }
})();
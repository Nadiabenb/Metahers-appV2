import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isProUser, canAccessThoughtLeadership, isSanctuaryMember, isInnerCircleMember, isFoundersCircleMember, isAdmin, hashPassword, verifyPassword } from "./auth";
import { sanitizeText, sanitizeHTML, sanitizeObject } from "./security";
import { asyncHandler, DatabaseError, OpenAIError, OpenAITimeoutError, ValidationError, NotFoundError, AuthenticationError } from "./middleware/errorHandler";
import Stripe from "stripe";
import { Resend } from "resend";
import OpenAI from "openai";
import { generateJournalPrompt, analyzeJournalEntry, chatWithJournalCoach, generateThoughtLeadershipContent, chatWithAppAtelierCoach, generateRecommendations, type Recommendation, cacheMonitor } from "./aiService";
import { fetchNewsByCategory, type NewsCategory } from "./rssNewsService";
import { z } from "zod";
import { CURRICULUM } from "@shared/curriculum";
import { db } from "./db";
import { spaces, transformationalExperiences, cohortCapacity, quizResponses, users, experienceProgress, aiMasteryEnrollment, aiMasteryModuleProgress, liveSessions, communityActivity, aiMasteryMessages, userEvents, sponsoredAds, visionBoards, visionTiles, visionSisters, insertVisionBoardSchema, insertVisionTileSchema } from "@shared/schema";
import { sql as drizzleSql, eq, desc, and, sql, gte } from "drizzle-orm";
import { voyages, voyageBookings, voyageWaitlist, voyageQuestionnaires, voyagePreparation, voyageReferrals, voyageTestimonials, voyageInvitationRequests } from "@shared/schema";
// Import all 54 experiences from seed file
import { EXPERIENCES } from "./seedExperiences";
// Import admin routes
import adminRoutes from "./adminRoutes";

// City search endpoint function
async function searchCities(query: string) {
  if (!query || query.length < 2) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=20&addresstype=city,town,village&featuretype=city,town,village`,
      {
        headers: {
          "User-Agent": "MetaHersMindSpa/1.0"
        }
      }
    );
    const results = await response.json() as any[];
    
    // Filter and map results, prefer English names when available
    const processed = results.map((r: any) => {
      const address = r.address || {};
      // Use display_name as primary source to get English names from OSM
      let displayName = r.display_name || "";
      
      // Extract city and country from display_name (format: "City, Region, Country")
      const parts = displayName.split(",").map((p: string) => p.trim());
      const cityName = address.city || address.town || address.village || parts[0] || "";
      const country = address.country || parts[parts.length - 1] || "";
      
      return {
        name: `${cityName}, ${country}`,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        importance: r.importance || 0
      };
    }).filter((r: any) => r.name && r.name.length > 2)
     .sort((a: any, b: any) => b.importance - a.importance)
     .slice(0, 10)
     .map((r: any) => ({
       name: r.name,
       latitude: r.latitude,
       longitude: r.longitude
     }));
    
    return processed;
  } catch (error) {
    console.error("City search error:", error);
    return [];
  }
}

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Resend email client (using Replit-managed connection)
let connectionSettings: any;

async function getResendCredentials() {
  // Fallback: Check for direct RESEND_API_KEY environment variable first
  if (process.env.RESEND_API_KEY) {
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'MetaHers Mind Spa <help@metahers.ai>'
    };
  }

  // Try Replit connector
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) {
    return null;
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings || !connectionSettings.settings.api_key) {
      return null;
    }
    return {
      apiKey: connectionSettings.settings.api_key, 
      fromEmail: connectionSettings.settings.from_email || 'MetaHers Mind Spa <help@metahers.ai>'
    };
  } catch (error) {
    console.warn('Failed to fetch Resend credentials from Replit connector:', error);
    return null;
  }
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const credentials = await getResendCredentials();
  if (!credentials) {
    return null;
  }
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

// Simple in-memory cache for recommendations
const recommendationCache = new Map<string, { data: Recommendation; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Simple in-memory cache for spaces and experiences (read-heavy, rarely changes)
let spacesCache: { data: any[]; timestamp: number } | null = null;
let experiencesCache: { data: any[]; timestamp: number } | null = null;
const DATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// CRITICAL: Clear all caches on server startup to ensure fresh Harvard-style content is served
console.log('🔄 Clearing all caches on startup to serve fresh content...');
spacesCache = null;
experiencesCache = null;
recommendationCache.clear();

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoints for deployment monitoring
  // Note: Root "/" is handled by static file serving (index.html) which also returns 200
  app.get('/health', asyncHandler(async (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }));

  app.get('/api/health', asyncHandler(async (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }));

  // Client-side logging endpoint
  app.post('/api/logs/client', asyncHandler(async (req: Request, res) => {
    const { logs } = req.body;
    const userId = req.session?.userId;

    if (!Array.isArray(logs)) {
      return res.status(400).json({ message: 'Invalid logs format' });
    }

    // Log each client error with context
    logs.forEach((log: any) => {
      const logData = {
        client_log: true,
        userId: userId || 'anonymous',
        level: log.level,
        message: log.message,
        context: log.context,
        error: log.error,
        timestamp: log.timestamp,
        userAgent: req.get('user-agent'),
      };

      if (log.level === 'error') {
        logger.error(logData, `Client error: ${log.message}`);
      } else if (log.level === 'warn') {
        logger.warn(logData, `Client warning: ${log.message}`);
      }
    });

    res.status(200).json({ received: logs.length });
  }));

  // 💰 OpenAI Prompt Cache Stats (Admin only)
  app.get('/api/admin/cache-stats', isAuthenticated, isAdmin, asyncHandler(async (_req, res) => {
    cacheMonitor.report();
    res.status(200).json({ 
      status: 'ok', 
      message: 'Cache stats logged to console. Check server logs for detailed metrics.' 
    });
  }));

  // Test endpoint to check Resend configuration (admin only in production)
  app.get('/api/test-resend', async (req, res) => {
    try {
      const credentials = await getResendCredentials();

      if (!credentials) {
        return res.json({ 
          status: 'not_configured',
          message: 'Resend credentials not found',
          hasApiKey: !!process.env.RESEND_API_KEY,
          hasHostname: !!process.env.REPLIT_CONNECTORS_HOSTNAME,
          hasToken: !!(process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL)
        });
      }

      // Try to get a client
      const resendClient = await getUncachableResendClient();
      if (!resendClient) {
        return res.json({ 
          status: 'client_creation_failed',
          message: 'Failed to create Resend client'
        });
      }

      return res.json({ 
        status: 'configured',
        message: 'Resend is properly configured',
        fromEmail: resendClient.fromEmail,
        hasApiKey: !!credentials.apiKey
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: String(error)
      });
    }
  });

  // Setup authentication middleware
  await setupAuth(app);

  // Admin routes (protected by requireAdmin middleware)
  app.use('/api/admin', adminRoutes);

  // ===== ADMINROUTES =====

  // Clear all caches (admin only)
  app.post('/api/admin/clear-cache', isAuthenticated, isAdmin, async (req: Request, res) => {
    try {

      // Clear all caches
      spacesCache = null;
      experiencesCache = null;
      recommendationCache.clear();

      console.log("🔄 All caches cleared by admin");

      res.json({
        success: true,
        message: "All caches cleared successfully",
        cleared: {
          spacesCache: true,
          experiencesCache: true,
          recommendationCache: true
        }
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
      res.status(500).json({ 
        message: "Failed to clear cache",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Regenerate Harvard-style content for all experiences (admin only)
  // ⚠️ CRITICAL DATA PROTECTION: This endpoint modifies the CORE VALUE of MetaHers Mind Spa
  // Harvard-style learning content should NEVER be removed without explicit approval
  app.post('/api/admin/regenerate-content', isAuthenticated, isAdmin, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      // 🔒 PROTECTION LAYER 1: Require explicit confirmation
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const expectedPhrase = `APPROVE-REGENERATE-${today}`;
      const confirmationPhrase = req.body.confirmationPhrase;

      if (confirmationPhrase !== expectedPhrase) {
        return res.status(400).json({
          success: false,
          message: "Confirmation required. This operation will regenerate Harvard-style content.",
          requiredPhrase: expectedPhrase,
          instructions: `To proceed, send: { "confirmationPhrase": "${expectedPhrase}", "batchSize": 10 }`
        });
      }

      console.log(`\n⚠️  CRITICAL OPERATION: Content regeneration approved by ${user.email}`);
      console.log(`⚠️  Confirmation phrase validated: ${confirmationPhrase}`);

      // 🔒 PROTECTION LAYER 2: Create backup before proceeding
      console.log(`🔒 Creating pre-operation backup...`);
      const { execSync } = await import('child_process');
      try {
        const backupOutput = execSync('tsx server/backupTransformationalContent.ts', { encoding: 'utf-8' });
        console.log(backupOutput);
      } catch (backupError) {
        console.error('❌ Backup failed:', backupError);
        return res.status(500).json({
          success: false,
          message: "Pre-operation backup failed. Aborting for safety.",
          error: backupError instanceof Error ? backupError.message : String(backupError)
        });
      }

      const batchSize = req.body.batchSize || 10;
      console.log(`\n🎓 Starting content regeneration (batch size: ${batchSize})...`);

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Get experiences that need content (< 5 sections)
      const needsUpdate = await db
        .select()
        .from(transformationalExperiences)
        .where(drizzleSql`jsonb_array_length(content->'sections') < 5`)
        .limit(batchSize);

      if (needsUpdate.length === 0) {
        return res.json({
          success: true,
          message: "All experiences already have comprehensive content!",
          stats: { processed: 0, remaining: 0 }
        });
      }

      // Get all spaces for context
      const allSpaces = await db.select().from(spaces);
      const spaceMap = new Map(allSpaces.map(s => [s.id, s]));

      let successCount = 0;
      let failCount = 0;

      for (const exp of needsUpdate) {
        try {
          const space = spaceMap.get(exp.spaceId);
          const spaceContext = space ? `${space.name}: ${space.description}` : exp.spaceId;
          const sectionCount = exp.tier === "pro" ? 7 : 5;

          const prompt = `Create a comprehensive ${sectionCount}-section learning curriculum for "${exp.title}".

Context: MetaHers Mind Spa - AI learning platform for women solopreneurs
Space: ${spaceContext}
Description: ${exp.description}
Objectives: ${(exp.learningObjectives as string[]).join(", ")}
Tier: ${exp.tier.toUpperCase()} (${exp.tier === "pro" ? "7 advanced sections" : "5 foundational sections"})

Create ${sectionCount} sections:
1. Foundation (type: text) - Core concepts
2-${sectionCount - 2}. Mix of text, interactive, quiz, hands_on_lab sections
${sectionCount}. Final project (type: hands_on_lab)

Each section needs:
- id: kebab-case
- title: Clear, actionable
- type: text | interactive | quiz | hands_on_lab
- content: 600-900 words (Harvard Business School style - research-backed, practical)
- resources: 2-4 external resources

Forbes-meets-Vogue tone: professional, empowering, practical.

Return ONLY valid JSON:
{
  "sections": [{"id": "...", "title": "...", "type": "...", "content": "...", "resources": [...]}]
}`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "Expert curriculum designer for MetaHers. Create Harvard-quality learning content for women solopreneurs. Return only valid JSON."
              },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" }
          });

          const response = completion.choices[0]?.message?.content;
          if (!response) throw new Error("No response from OpenAI");

          const content = JSON.parse(response);

          // 🔒 PROTECTION LAYER 3: Validate section count before update
          const minimumSections = exp.tier === "pro" ? 7 : 5;
          const actualSections = content.sections?.length || 0;

          if (actualSections < minimumSections) {
            console.log(`   ⚠️  VALIDATION FAILED: ${exp.title} has ${actualSections} sections (requires ${minimumSections})`);
            console.log(`   🔒 SAFETY: Skipping update to prevent content degradation`);
            failCount++;
            continue; // Skip this experience, don't update
          }

          // 🔒 PROTECTION LAYER 4: Audit log before update
          const oldSectionCount = (exp.content as any)?.sections?.length || 0;
          console.log(`   📝 AUDIT: ${exp.title} - Updating from ${oldSectionCount} to ${actualSections} sections`);
          console.log(`   📝 AUDIT: Modified by ${user.email} at ${new Date().toISOString()}`);

          await db
            .update(transformationalExperiences)
            .set({ content, updatedAt: new Date() })
            .where(drizzleSql`id = ${exp.id}`);

          console.log(`   ✅ ${exp.title}: ${content.sections.length} sections`);
          successCount++;

          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting

        } catch (error) {
          console.log(`   ❌ Failed: ${exp.title}`);
          failCount++;
        }
      }

      // Check remaining
      const remaining = await db
        .select({ count: drizzleSql<number>`count(*)` })
        .from(transformationalExperiences)
        .where(drizzleSql`jsonb_array_length(content->'sections') < 5`);

      res.json({
        success: true,
        message: `Batch complete! ${successCount}/${needsUpdate.length} successful`,
        stats: {
          processed: successCount,
          failed: failCount,
          remaining: remaining[0].count
        }
      });

    } catch (error) {
      console.error("Error regenerating content:", error);
      res.status(500).json({
        message: "Failed to regenerate content",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // DEV ONLY: Clear cache without authentication (for development)
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/dev/clear-cache', async (_req: Request, res) => {
      spacesCache = null;
      experiencesCache = null;
      recommendationCache.clear();

      console.log("🔄 [DEV] All caches cleared");

      res.json({
        success: true,
        message: "Development caches cleared",
        cleared: {
          spacesCache: true,
          experiencesCache: true,
          recommendationCache: true
        }
      });
    });
  }

  // Manually populate database (admin only - use nadia@metahers.ai account)
  // ⚠️ CRITICAL WARNING: This endpoint can overwrite Harvard-style content if not careful!
  // Only use this for initial setup or when specifically instructed
  app.post('/api/admin/populate-db', isAuthenticated, isAdmin, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      // 🔒 PROTECTION: Require explicit confirmation
      const today = new Date().toISOString().split('T')[0];
      const expectedPhrase = `APPROVE-POPULATE-${today}`;
      const confirmationPhrase = req.body.confirmationPhrase;

      if (confirmationPhrase !== expectedPhrase) {
        // Check if there's existing Harvard-style content
        const existingExperiences = await db.select().from(transformationalExperiences);
        const hasFullContent = existingExperiences.some(exp => {
          const sections = (exp.content as any)?.sections || [];
          return sections.length >= 5;
        });

        return res.status(400).json({
          success: false,
          message: hasFullContent 
            ? "⚠️ DANGER: Database contains Harvard-style content! This operation will OVERWRITE it with minimal seed data."
            : "Confirmation required. This will populate the database with initial seed data.",
          warning: hasFullContent 
            ? "You will LOSE all existing Harvard-style learning content. Consider backing up first with: tsx server/backupTransformationalContent.ts"
            : null,
          requiredPhrase: expectedPhrase,
          instructions: `To proceed, send: { "confirmationPhrase": "${expectedPhrase}" }`
        });
      }

      console.log(`\n⚠️  CRITICAL OPERATION: Database population approved by ${user.email}`);
      console.log(`⚠️  Confirmation phrase validated: ${confirmationPhrase}`);
      console.log("🔄 Manual database population triggered by admin...");

      // Import seed functions
      const { seedSpaces } = await import("./seedSpaces");
      const { seedExperiences } = await import("./seedExperiences");

      // Sequential seeding
      await seedSpaces();
      console.log("✓ Spaces populated (9 total)");

      await seedExperiences();
      console.log("✓ Experiences populated (54 total)");

      // Verify counts
      const spacesCount = await db.select().from(spaces);
      const experiencesCount = await db.select().from(transformationalExperiences);

      res.json({
        success: true,
        message: "Database populated successfully",
        stats: {
          spaces: spacesCount.length,
          experiences: experiencesCount.length
        }
      });
    } catch (error) {
      console.error("Error populating database:", error);
      res.status(500).json({ 
        message: "Failed to populate database",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ===== RETRO CAMERA PHOTO FEED ROUTES =====

  // Get public photo feed
  app.get('/api/retro-camera/feed', async (req: Request, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const photos = await storage.getRetroCameraPhotos(limit);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photo feed:", error);
      res.status(500).json({ message: "Failed to fetch photo feed" });
    }
  });

  // Get user's own photos
  app.get('/api/retro-camera/my-photos', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const photos = await storage.getUserRetroCameraPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching user photos:", error);
      res.status(500).json({ message: "Failed to fetch your photos" });
    }
  });

  // Post a new photo
  app.post('/api/retro-camera/post', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { imageUrl, filterName, caption, isPublic } = req.body;

      if (!imageUrl || !filterName) {
        return res.status(400).json({ message: "Image and filter are required" });
      }

      const photo = await storage.createRetroCameraPhoto({
        userId,
        imageUrl,
        filterName,
        caption: caption || null,
        isPublic: isPublic !== false, // Default to public
      });

      res.json(photo);
    } catch (error) {
      console.error("Error posting photo:", error);
      res.status(500).json({ message: "Failed to post photo" });
    }
  });

  // Delete a photo
  app.delete('/api/retro-camera/photos/:photoId', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { photoId } = req.params;

      const deleted = await storage.deleteRetroCameraPhoto(photoId, userId);

      if (!deleted) {
        return res.status(404).json({ message: "Photo not found or unauthorized" });
      }

      res.json({ success: true, message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Like a photo
  app.post('/api/retro-camera/photos/:photoId/like', isAuthenticated, async (req: Request, res) => {
    try {
      const { photoId } = req.params;
      const updated = await storage.likeRetroCameraPhoto(photoId);

      if (!updated) {
        return res.status(404).json({ message: "Photo not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error liking photo:", error);
      res.status(500).json({ message: "Failed to like photo" });
    }
  });

  // ===== AUTHROUTES =====

  // Signup endpoint
  app.post('/api/auth/signup', asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, quizUnlockedRitual } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Check if user has completed the quiz
    const quizSubmission = await storage.getQuizSubmissionByEmail(email);

    // Use quiz ritual from request body if provided, otherwise from quiz submission
    const unlockedRitual = quizUnlockedRitual || quizSubmission?.matchedRitual || null;

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await storage.createUser({
      email,
      passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      quizUnlockedRitual: unlockedRitual,
      quizCompletedAt: quizSubmission ? new Date() : null,
    });

    // Set up session
    req.session!.userId = user.id;

    req.session!.save((err: any) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.status(201).json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    });
  }));

  // Login endpoint
  app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user has a password hash
    if (!user.passwordHash) {
      console.error("User exists but has no password hash:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    let isValid = false;
    try {
      isValid = await verifyPassword(password, user.passwordHash);
    } catch (passwordError) {
      console.error("Password verification error for user:", email, passwordError);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set up session
    req.session!.userId = user.id;

    req.session!.save((err: any) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    });
  }));

  // Logout endpoint
  app.post('/api/auth/logout', async (req, res) => {
    const userId = req.session?.userId as string;

    req.session?.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      // Clear user's recommendation cache on logout
      if (userId) {
        recommendationCache.delete(userId);
      }

      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Mark onboarding as completed
  app.post('/api/auth/complete-onboarding', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      await storage.completeOnboarding(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Submit email for beta access (public endpoint)
  app.post('/api/email-leads', async (req: Request, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      // Save email lead
      await storage.createEmailLead({ email, source: "email_capture_modal" });

      res.json({ success: true, message: "Thank you for signing up!" });
    } catch (error) {
      console.error("Error saving email lead:", error);
      // Don't expose duplicate email errors to users for privacy
      res.status(500).json({ message: "Failed to save email. Please try again." });
    }
  });

  // Activate beta code for Pro access
  app.post('/api/auth/activate-beta-code', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Beta code is required" });
      }

      // Check if code is valid (case-insensitive)
      if (code.trim().toUpperCase() !== "METAMUSE2025") {
        return res.status(400).json({ message: "Invalid beta code" });
      }

      // Get user and check if already Pro
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isPro) {
        return res.status(400).json({ message: "You already have Pro access" });
      }

      // Grant Pro access
      await storage.updateUserProStatus(userId, true);

      res.json({ success: true, message: "Pro access activated! Welcome to MetaHers Pro." });
    } catch (error) {
      console.error("Error activating beta code:", error);
      res.status(500).json({ message: "Failed to activate beta code" });
    }
  });

  // Request password reset
  app.post('/api/auth/request-password-reset', async (req: Request, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ success: true, message: "If an account exists with that email, a password reset link has been sent." });
      }

      // Delete any existing reset tokens for this user
      await storage.deleteUserPasswordResetTokens(user.id);

      // Generate a random token
      const resetToken = randomBytes(32).toString('hex');

      // Create reset token with 1 hour expiration
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
      });

      // Generate reset link
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;

      // Send password reset email via Resend (if configured)
      const resendClient = await getUncachableResendClient();
      if (!resendClient) {
        console.warn('⚠️ Resend not configured - password reset email not sent. Reset token created for user:', email);
        console.warn('Reset link (for development/testing):', resetLink);
      } else {
        try {
          console.log(`📧 Attempting to send password reset email to: ${email}`);
          const result = await resendClient.client.emails.send({
          from: resendClient.fromEmail,
          to: email,
          subject: 'Reset Your MetaHers Password',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Palatino', serif; background-color: #0A0A0F;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A0A0F;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a2e 0%, #0A0A0F 100%); border-radius: 12px; border: 1px solid #8B5CF6;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #F8F8F8; letter-spacing: 1px;">
                MetaHers Mind Spa
              </h1>
              <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #8B5CF6, #EC4899); margin: 20px auto;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #F8F8F8; line-height: 1.6;">
                Hello ${user.firstName || 'there'},
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #D4D4D8; line-height: 1.6;">
                We received a request to reset your password for your MetaHers account. Click the button below to create a new password:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: #FFFFFF; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; letter-spacing: 0.5px;">
                      Reset Your Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0; font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                This link will expire in 1 hour for your security.
              </p>

              <p style="margin: 20px 0; font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #8B5CF6, transparent); margin: 30px 0;"></div>

              <p style="margin: 0; font-size: 13px; color: #71717A; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0; font-size: 13px; color: #8B5CF6; word-break: break-all;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #27272A;">
              <p style="margin: 0; font-size: 14px; color: #71717A; line-height: 1.6;">
                With gratitude,<br>
                <span style="color: #F8F8F8; font-style: italic;">The MetaHers Team</span>
              </p>
              <p style="margin: 15px 0 0; font-size: 12px; color: #52525B;">
                © ${new Date().getFullYear()} MetaHers Mind Spa. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });

          console.log(`✅ Password reset email sent successfully to ${email}`);
          console.log(`   Result:`, JSON.stringify(result, null, 2));
        } catch (emailError) {
          console.error("❌ Error sending password reset email:", emailError);
          console.error("   Email address:", email);
          console.error("   Full error:", JSON.stringify(emailError, null, 2));
          // Don't fail the request if email fails - token is still valid
          // User can contact support if they don't receive the email
          console.warn('⚠️ Reset link (for recovery):', resetLink);
        }
      }

      res.json({ 
        success: true, 
        message: "If an account exists with that email, a password reset link has been sent."
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ message: "Failed to request password reset" });
    }
  });

  // Reset password with token
  app.post('/api/auth/reset-password', async (req: Request, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Find the reset token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Check if token has expired
      if (new Date() > new Date(resetToken.expiresAt)) {
        await storage.deletePasswordResetToken(token);
        return res.status(400).json({ message: "Reset token has expired" });
      }

      // Get the user
      const user = await storage.getUser(resetToken.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const passwordHash = await hashPassword(newPassword);

      // Update user's password
      await storage.upsertUser({
        ...user,
        passwordHash,
      });

      // Delete the used reset token
      await storage.deletePasswordResetToken(token);

      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // ===== QUIZROUTES =====

  // Submit quiz (public route - no auth required)
  app.post('/api/quiz/submit', async (req: Request, res) => {
    try {
      const { name, email, answers } = req.body;

      // Validate input
      if (!name || !email || !answers) {
        return res.status(400).json({ message: "Name, email, and answers are required" });
      }

      // Import matching function
      const { matchRitual } = await import('../shared/schema');
      const matchedRitual = matchRitual(answers);

      // Check if user is logged in
      const userId = req.session?.userId as string | undefined;

      // Create quiz submission
      const submission = await storage.createQuizSubmission({
        userId: userId || null,
        name,
        email,
        answers,
        matchedRitual,
        claimed: !!userId, // If logged in, mark as claimed immediately
        ritualCompleted: false,
        oneOnOneBooked: false,
      });

      // If user is logged in, update their profile with the unlocked ritual
      if (userId) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.upsertUser({
            ...user,
            quizUnlockedRitual: matchedRitual,
            quizCompletedAt: new Date(),
          });
        }
      }

      res.json({ 
        success: true, 
        submissionId: submission.id,
        matchedRitual,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Get quiz results (for retake or viewing)
  app.get('/api/quiz/results/:email', async (req: Request, res) => {
    try {
      const { email } = req.params;

      const submissions = await storage.getQuizSubmissionsByEmail(email);

      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  // Admin route to get all quiz submissions
  app.get('/api/quiz/admin/all', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      // Simple admin check - only allow specific emails
      if (user?.email !== "hello@metahers.ai" && user?.email !== "metahers@gmail.com") {
        return res.status(403).json({ message: "Access denied" });
      }

      const submissions = await storage.getAllQuizSubmissions();

      res.json(submissions);
    } catch (error) {
      console.error("Error fetching all quiz submissions:", error);
      res.status(500).json({ message: "Failed to fetch quiz submissions" });
    }
  });

  // Update quiz submission status (admin only)
  app.patch('/api/admin/quiz-submissions/:id', isAuthenticated, isAdmin, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      // TODO: Add admin check when we have admin roles
      if (user?.email !== 'admin@metahers.ai') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { id } = req.params;
      const { oneOnOneBooked } = req.body;

      await storage.updateQuizSubmission(id, { oneOnOneBooked });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating quiz submission:", error);
      res.status(500).json({ message: "Failed to update quiz submission" });
    }
  });

  // ===== CAREER COMPANION ROUTES =====

  // Get user's companion
  app.get('/api/companion', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      let companion = await storage.getCompanion(userId);

      // Create companion if doesn't exist
      if (!companion) {
        companion = await storage.createCompanion({ userId });
      }

      res.json(companion);
    } catch (error) {
      console.error('Error fetching companion:', error);
      res.status(500).json({ message: 'Failed to fetch companion' });
    }
  });

  // Feed companion (journal activity)
  app.post('/api/companion/feed', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const companion = await storage.updateCompanionStats(userId, {
        inspiration: 5,
        activityType: 'journal',
      });
      res.json(companion);
    } catch (error) {
      console.error('Error feeding companion:', error);
      res.status(500).json({ message: 'Failed to feed companion' });
    }
  });

  // Play with companion (learning activity)
  app.post('/api/companion/play', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const companion = await storage.updateCompanionStats(userId, {
        growth: 5,
        mastery: 3,
        activityType: 'learn',
      });
      res.json(companion);
    } catch (error) {
      console.error('Error playing with companion:', error);
      res.status(500).json({ message: 'Failed to play with companion' });
    }
  });

  // Socialize companion (community activity)
  app.post('/api/companion/socialize', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const companion = await storage.updateCompanionStats(userId, {
        connection: 5,
        activityType: 'socialize',
      });
      res.json(companion);
    } catch (error) {
      console.error('Error socializing companion:', error);
      res.status(500).json({ message: 'Failed to socialize companion' });
    }
  });

  // ===== METAHERS WORLD SPACESROUTES =====
  app.get('/api/spaces', asyncHandler(async (_req: Request, res) => {
    const { cacheGet, cacheSet } = await import('./lib/cache');

    // Try Redis cache first
    const cached = await cacheGet<any[]>('spaces:all');
    if (cached) {
      return res.json(cached);
    }

    // Check in-memory cache as secondary fallback
    const now = Date.now();
    if (spacesCache && (now - spacesCache.timestamp) < DATA_CACHE_TTL) {
      return res.json(spacesCache.data);
    }

    // Fetch from database
    try {
      const spaces = await storage.getSpaces();

      // Update both caches
      spacesCache = { data: spaces, timestamp: now };
      await cacheSet('spaces:all', spaces, 3600); // 1 hour TTL

      res.json(spaces);
    } catch (error) {
      throw new DatabaseError("Failed to fetch learning spaces", error);
    }
  }));

  app.get('/api/spaces/:slug', async (req: Request, res) => {
    try {
      const { slug } = req.params;
      const space = await storage.getSpaceBySlug(slug);

      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }

      res.json(space);
    } catch (error) {
      console.error("Error fetching space:", error);
      res.status(500).json({ message: "Failed to fetch space" });
    }
  });

  // ===== TRANSFORMATIONAL EXPERIENCES ROUTES =====
  app.get('/api/spaces/:spaceId/experiences', async (req: Request, res) => {
    try {
      const { spaceId } = req.params;
      // Return experiences directly from seed data (avoids database dependency)
      const experiences = EXPERIENCES.filter(exp => exp.spaceId === spaceId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(exp => ({
          id: exp.slug,
          spaceId: exp.spaceId,
          title: exp.title,
          slug: exp.slug,
          description: exp.description,
          learningObjectives: exp.learningObjectives,
          tier: exp.tier,
          estimatedMinutes: exp.estimatedMinutes,
          sortOrder: exp.sortOrder,
          isActive: exp.isActive,
          content: exp.content,
          personalizationEnabled: exp.personalizationEnabled
        }));
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // GET all experiences (must be before :slug/:id routes)
  app.get('/api/experiences/all', async (req: Request, res) => {
    try {
      // Return experiences directly from seed data
      const experiences = EXPERIENCES
        .filter(exp => exp.isActive !== false)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(exp => ({
          id: exp.slug,
          spaceId: exp.spaceId,
          title: exp.title,
          slug: exp.slug,
          description: exp.description,
          learningObjectives: exp.learningObjectives,
          tier: exp.tier,
          estimatedMinutes: exp.estimatedMinutes,
          sortOrder: exp.sortOrder,
          isActive: exp.isActive,
          content: exp.content,
          personalizationEnabled: exp.personalizationEnabled
        }));

      res.json(experiences);
    } catch (error) {
      console.error("Error fetching all experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // GET single experience by slug
  app.get('/api/experiences/:slug', async (req: Request, res) => {
    try {
      const { slug } = req.params;

      // Find experience from seed data
      const seedExperience = EXPERIENCES.find(exp => exp.slug === slug);
      if (!seedExperience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      // Map to response format
      const experience = {
        id: seedExperience.slug,
        spaceId: seedExperience.spaceId,
        title: seedExperience.title,
        slug: seedExperience.slug,
        description: seedExperience.description,
        learningObjectives: seedExperience.learningObjectives,
        tier: seedExperience.tier,
        estimatedMinutes: seedExperience.estimatedMinutes,
        sortOrder: seedExperience.sortOrder,
        isActive: seedExperience.isActive,
        content: seedExperience.content,
        personalizationEnabled: seedExperience.personalizationEnabled
      };

      // Return experience
      res.json(experience);
    } catch (error) {
      console.error("Error fetching experience:", error);
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  // GET all progress for current user (for progress dashboard)
  app.get('/api/progress/all', async (req: Request, res) => {
    try {
      if (!req.session?.userId) {
        return res.json([]); // Return empty array for non-authenticated users
      }

      const userId = req.session.userId as string;
      const progress = await storage.getAllExperienceProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching all progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // POST section completion (granular tracking)
  app.post('/api/experiences/:experienceId/sections/:sectionId/complete', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId, sectionId } = req.params;
      const { timeSpentSeconds, quizScore } = req.body;

      // Record granular completion
      await storage.recordSectionCompletion({
        userId,
        experienceId,
        sectionId: parseInt(sectionId),
        timeSpentSeconds: timeSpentSeconds || null,
        quizScore: quizScore || null,
      });

      // Also update legacy progress tracker
      const currentProgress = await storage.getExperienceProgress(userId, experienceId);
      const completedSections = currentProgress?.completedSections || [];
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        await storage.upsertExperienceProgress({
          userId,
          experienceId,
          completedSections,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error recording section completion:", error);
      res.status(500).json({ message: "Failed to record completion" });
    }
  });

  // GET section analytics for user
  app.get('/api/experiences/:experienceId/analytics', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId } = req.params;

      const analytics = await storage.getSectionAnalytics(userId, experienceId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching section analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // POST personalization answers
  app.post('/api/experiences/:experienceId/personalization', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId } = req.params;
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ message: "Answers are required" });
      }

      const result = await storage.savePersonalizationAnswers(userId, experienceId, answers);
      res.json(result);
    } catch (error) {
      console.error("Error saving personalization answers:", error);
      res.status(500).json({ message: "Failed to save answers" });
    }
  });

  // GET personalization answers
  app.get('/api/experiences/:experienceId/personalization', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId } = req.params;

      const answers = await storage.getPersonalizationAnswers(userId, experienceId);
      res.json(answers || {});
    } catch (error) {
      console.error("Error fetching personalization answers:", error);
      res.status(500).json({ message: "Failed to fetch answers" });
    }
  });

  // ===== EXPERIENCE PROGRESS ROUTES =====
  app.get('/api/experiences/:experienceId/progress', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId } = req.params;

      const progress = await storage.getExperienceProgress(userId, experienceId);

      if (!progress) {
        return res.json({ 
          experienceId, 
          completedSections: [], 
          confidenceScore: null,
          startedAt: new Date().toISOString() 
        });
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching experience progress:", error);
      res.status(500).json({ message: "Failed to fetch experience progress" });
    }
  });

  app.post('/api/experiences/:experienceId/progress', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { experienceId } = req.params;
      const { completedSections, confidenceScore, businessImpact, milestonesAchieved } = req.body;

      // Get existing progress
      const existingProgress = await storage.getExperienceProgress(userId, experienceId);

      // Determine if experience is now complete
      const experience = await storage.getExperienceById(experienceId);
      const totalSections = experience?.content?.sections?.length || 0;
      const isComplete = completedSections && completedSections.length === totalSections;

      const progress = await storage.upsertExperienceProgress({
        userId,
        experienceId,
        completedSections: completedSections !== undefined ? completedSections : existingProgress?.completedSections || [],
        confidenceScore: confidenceScore !== undefined ? confidenceScore : existingProgress?.confidenceScore,
        businessImpact: businessImpact !== undefined ? businessImpact : existingProgress?.businessImpact,
        milestonesAchieved: milestonesAchieved !== undefined ? milestonesAchieved : existingProgress?.milestonesAchieved || [],
        completedAt: isComplete ? new Date() : existingProgress?.completedAt,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error saving experience progress:", error);
      res.status(500).json({ message: "Failed to save experience progress" });
    }
  });

  // ===== AI COACHING ROUTE =====
  app.post('/api/ai/coach', isAuthenticated, async (req: Request, res) => {
    try {
      const { experienceTitle, sectionTitle, sectionContent, messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages are required" });
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `You are an encouraging AI learning coach for MetaHers Mind Spa, helping women solopreneurs learn AI and Web3 concepts.

Current Learning Context:
- Experience: ${experienceTitle}
- Section: ${sectionTitle}
- Section Content: ${sectionContent.substring(0, 500)}...

Your role:
- Answer questions about the current learning material
- Provide clear, practical explanations
- Encourage and motivate the learner
- Relate concepts to real-world business applications
- Keep responses concise (2-3 paragraphs max)
- Be supportive and understanding
- Use a Forbes-meets-Vogue tone: professional yet warm

Always remember: The learner is investing time to build valuable skills. Your job is to make the learning journey enjoyable and effective.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || "I'm here to help! Could you rephrase your question?";

      res.json({ response });
    } catch (error) {
      console.error("Error in AI coaching:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // ===== RITUAL PROGRESS ROUTES =====
  app.get('/api/rituals/:slug/progress', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { slug } = req.params;

      const progress = await storage.getRitualProgress(userId, slug);

      if (!progress) {
        return res.json({ slug, completedSteps: [], lastUpdated: new Date().toISOString() });
      }

      res.json({
        slug: progress.ritualSlug,
        completedSteps: progress.completedSteps,
        lastUpdated: progress.lastUpdated?.toISOString(),
      });
    } catch (error) {
      console.error("Error fetching ritual progress:", error);
      res.status(500).json({ message: "Failed to fetch ritual progress" });
    }
  });

  app.post('/api/rituals/:slug/progress', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { slug } = req.params;
      const { completedSteps } = req.body;

      const progress = await storage.upsertRitualProgress({
        userId,
        ritualSlug: slug,
        completedSteps: completedSteps || [],
      });

      res.json({
        slug: progress.ritualSlug,
        completedSteps: progress.completedSteps,
        lastUpdated: progress.lastUpdated?.toISOString(),
      });
    } catch (error) {
      console.error("Error saving ritual progress:", error);
      res.status(500).json({ message: "Failed to save ritual progress" });
    }
  });

  // ===== PUBLIC PLAYGROUND API =====
  // Simple rate limiting for playground (max 10 prompts per IP per hour)
  const playgroundRateLimit = new Map<string, { count: number; resetTime: number }>();

  app.post('/api/playground/run-prompt', async (req: Request, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      if (prompt.length > 2000) {
        return res.status(400).json({ message: "Prompt is too long. Maximum 2000 characters." });
      }

      // Simple rate limiting by IP
      const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;

      const rateLimitData = playgroundRateLimit.get(clientIP);
      if (rateLimitData) {
        if (now < rateLimitData.resetTime) {
          if (rateLimitData.count >= 10) {
            return res.status(429).json({ 
              message: "Rate limit exceeded. Please try again in an hour or sign up for unlimited access." 
            });
          }
          rateLimitData.count++;
        } else {
          playgroundRateLimit.set(clientIP, { count: 1, resetTime: now + hourInMs });
        }
      } else {
        playgroundRateLimit.set(clientIP, { count: 1, resetTime: now + hourInMs });
      }

      // Clean up old entries (optional, prevents memory leak)
      if (playgroundRateLimit.size > 1000) {
        const entries = Array.from(playgroundRateLimit.entries());
        for (const [ip, data] of entries) {
          if (now > data.resetTime) {
            playgroundRateLimit.delete(ip);
          }
        }
      }

      // Use OpenAI to generate response
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for MetaHers Mind Spa. Provide clear, professional, and empowering responses. Keep responses concise (under 300 words) unless the user asks for more detail."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";

      res.json({ response });
    } catch (error: any) {
      console.error("Playground API error:", error);
      res.status(500).json({ message: "Failed to generate AI response. Please try again." });
    }
  });

  // Career Path Generator API with rate limiting
  const careerPathRateLimit = new Map<string, { count: number; resetTime: number }>();

  app.post('/api/career-path/generate', async (req: Request, res) => {
    try {
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ message: "Answers are required" });
      }

      // Validate input size
      const answersString = JSON.stringify(answers);
      if (answersString.length > 5000) {
        return res.status(400).json({ message: "Answers are too long. Please be more concise." });
      }

      // Rate limiting by IP (max 3 career paths per hour per IP)
      const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;

      const rateLimitData = careerPathRateLimit.get(clientIP);
      if (rateLimitData) {
        if (now < rateLimitData.resetTime) {
          if (rateLimitData.count >= 3) {
            return res.status(429).json({ 
              message: "Rate limit exceeded. You can generate 3 career paths per hour. Please try again later or sign up for unlimited access." 
            });
          }
          rateLimitData.count++;
        } else {
          careerPathRateLimit.set(clientIP, { count: 1, resetTime: now + hourInMs });
        }
      } else {
        careerPathRateLimit.set(clientIP, { count: 1, resetTime: now + hourInMs });
      }

      // Clean up old entries
      if (careerPathRateLimit.size > 1000) {
        const entries = Array.from(careerPathRateLimit.entries());
        for (const [ip, data] of entries) {
          if (now > data.resetTime) {
            careerPathRateLimit.delete(ip);
          }
        }
      }

      // Build prompt from answers
      const prompt = `You are a career advisor for MetaHers Mind Spa, helping women transition into AI and Web3 careers.

User Profile:
- Current Situation: ${answers.current_role || 'Not specified'}
- Interest Area: ${answers.interest_area || 'Not specified'}
- Experience Level: ${answers.experience_level || 'Not specified'}
- Timeline: ${answers.timeline || 'Not specified'}
- Specific Goals: ${answers.goals || 'Not specified'}

Generate a detailed, personalized 3-phase career roadmap in JSON format with this exact structure:
{
  "title": "A specific career title they're working toward (e.g., 'AI Product Manager', 'Web3 Developer')",
  "overview": "1-2 sentence overview of their path and what makes them well-suited for it",
  "phase1": {
    "title": "Phase 1 title with timeframe (e.g., 'Months 1-3: Foundation Building')",
    "goals": ["3-4 specific, measurable learning goals for this phase"],
    "resources": ["3-4 specific courses, books, or actions to take"]
  },
  "phase2": {
    "title": "Phase 2 title with timeframe",
    "goals": ["3-4 specific goals building on phase 1"],
    "resources": ["3-4 specific resources and projects"]
  },
  "phase3": {
    "title": "Phase 3 title with timeframe",
    "goals": ["3-4 advanced goals leading to career entry"],
    "resources": ["3-4 resources including portfolio projects and networking"]
  },
  "nextSteps": ["3 immediate actions they should take this week to start their journey"]
}

Make it empowering, specific, and actionable. Reference MetaHers programs where relevant but focus on the complete path. Return only valid JSON.`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const careerPath = JSON.parse(completion.choices[0].message.content || "{}");

      res.json({ careerPath });
    } catch (error: any) {
      console.error("Career path generation error:", error);
      res.status(500).json({ message: "Failed to generate career path. Please try again." });
    }
  });

  // ===== AI RECOMMENDATIONS ROUTE =====
  app.get('/api/recommendations', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;

    // Check cache first
    const cached = recommendationCache.get(userId);
    const now = Date.now();
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return res.json(cached.data);
    }

    try {
      // Fetch user data (only aggregates, no PII)
      const journalEntries = await storage.getAllJournalEntries(userId, 10);
      const experienceProgress = await storage.getAllExperienceProgress(userId);
      const achievements = await storage.getUserAchievements(userId);

      // Extract themes from journal AI insights (robust extraction)
      const recentThemes: string[] = [];
      journalEntries.slice(0, 5).forEach(entry => {
        if (entry.aiInsights) {
          try {
            const insights = typeof entry.aiInsights === 'string' 
              ? JSON.parse(entry.aiInsights) 
              : entry.aiInsights;
            if (insights && Array.isArray(insights.themes)) {
              recentThemes.push(...insights.themes);
            }
          } catch (error) {
            // Skip invalid JSON entries
            console.warn('Failed to parse aiInsights JSON:', error);
          }
        }
      });

      // Build context for AI (data minimization - only aggregates)
      const context = {
        recentMoods: journalEntries.map(e => e.mood),
        journalStreak: journalEntries[0]?.streak || 0,
        completedExperiences: experienceProgress.filter(p => p.completedAt).length,
        totalExperiences: 54, // Total experiences across all 9 spaces
        recentThemes: recentThemes.slice(0, 5),
        achievementCount: achievements.length,
        hasJournalEntries: journalEntries.length > 0
      };

      // Generate recommendations using AI
      const recommendations = await generateRecommendations(context);

      // Cache the result
      recommendationCache.set(userId, {
        data: recommendations,
        timestamp: now
      });

      // Clean up stale cache entries (simple cleanup)
      if (recommendationCache.size > 100) {
        const entriesToDelete: string[] = [];
        recommendationCache.forEach((value, key) => {
          if (now - value.timestamp > CACHE_TTL) {
            entriesToDelete.push(key);
          }
        });
        entriesToDelete.forEach(key => recommendationCache.delete(key));
      }

      res.json(recommendations);
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new OpenAITimeoutError();
      }
      throw new OpenAIError('Recommendations temporarily unavailable', error);
    }
  }));

  // ===== JOURNAL ROUTES =====
  // Tier Check: Core Membership+ required for journals
  const requiresCoreOrPremium: RequestHandler = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { storage } = await import("./storage");
    const user = await storage.getUser(req.session.userId);
    if (!user || (user.subscriptionTier !== 'core' && user.subscriptionTier !== 'premium' && user.subscriptionTier !== 'pro_monthly' && user.subscriptionTier !== 'pro_annual' && user.subscriptionTier !== 'sanctuary' && user.subscriptionTier !== 'inner_circle' && user.subscriptionTier !== 'founders_circle')) {
      return res.status(403).json({ message: "Core Membership or higher required. Upgrade to access journals.", requiredTier: "core" });
    }
    return next();
  };

  // List journal entries for a month (for calendar view)
  app.get('/api/journal/list', isAuthenticated, requiresCoreOrPremium, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const month = req.query.month as string; // Expected format: YYYY-MM

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
      }

      // Get all entries for the user
      const allEntries = await storage.getAllJournalEntries(userId, 100);

      // Filter entries for the requested month and include mood
      const monthEntries = allEntries
        .filter(entry => entry.date.startsWith(month))
        .map(entry => ({ 
          date: entry.date,
          mood: entry.mood || null
        }));

      res.json(monthEntries);
    } catch (error) {
      console.error("Error fetching journal list:", error);
      res.status(500).json({ message: "Failed to fetch journal list" });
    }
  });

  app.get('/api/journal', isAuthenticated, requiresCoreOrPremium, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      // Get date from query param, default to today
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const entry = await storage.getJournalEntryByDate(userId, date);

      if (!entry) {
        return res.json({ 
          content: "", 
          structuredContent: null,
          lastSaved: new Date().toISOString(), 
          streak: 0,
          mood: null,
          tags: [],
          wordCount: 0,
          aiInsights: null,
        });
      }

      res.json({
        content: entry.content,
        structuredContent: entry.structuredContent,
        mood: entry.mood,
        tags: entry.tags || [],
        wordCount: entry.wordCount || 0,
        aiInsights: entry.aiInsights,
        aiPrompt: entry.aiPrompt,
        streak: entry.streak,
        lastSaved: entry.lastSaved?.toISOString(),
      });
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  app.post('/api/journal', isAuthenticated, requiresCoreOrPremium, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;

      // Validate request body
      const bodySchema = z.object({
        content: z.string().optional(),
        structuredContent: z.any().optional(),
        date: z.string().optional(), // Journal date in YYYY-MM-DD format
        streak: z.number().optional(),
        mood: z.string().nullable().optional(),
        tags: z.array(z.string()).max(10).optional(),
        aiPrompt: z.string().optional(),
      });

      const validation = bodySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validation.error.errors 
        });
      }

      const { content, structuredContent, date, streak, mood, tags, aiPrompt } = validation.data;

      // For backwards compatibility, support both content and structuredContent
      // SECURITY: Sanitize user-generated content to prevent XSS attacks
      const finalContent = content ? sanitizeText(content) : "";
      const sanitizedStructuredContent = structuredContent ? sanitizeObject(structuredContent) : undefined;
      const sanitizedMood = mood ? sanitizeText(mood) : null;
      const sanitizedTags = tags ? tags.map(tag => sanitizeText(tag)) : undefined;
      const sanitizedAiPrompt = aiPrompt ? sanitizeText(aiPrompt) : undefined;

      // Calculate word count (filter empty tokens)
      const wordCount = finalContent.trim() === "" 
        ? 0 
        : finalContent.trim().split(/\s+/).filter(w => w.length > 0).length;

      // Generate AI insights if content is substantial (Pro only)
      let aiInsights = undefined;
      const user = await storage.getUser(userId);
      if (finalContent.trim().length > 50 && user?.isPro) {
        try {
          aiInsights = await analyzeJournalEntry(finalContent);
        } catch (error) {
          console.error("Error generating AI insights:", error);
        }
      }

      const entry = await storage.upsertJournalEntry({
        userId,
        date: date || new Date().toISOString().split('T')[0], // Use provided date or default to today
        content: finalContent,
        structuredContent: sanitizedStructuredContent,
        streak: streak || 0,
        mood: sanitizedMood,
        tags: sanitizedTags,
        wordCount,
        aiInsights,
        aiPrompt: sanitizedAiPrompt,
      });

      res.json({
        content: entry.content,
        structuredContent: entry.structuredContent,
        mood: entry.mood,
        tags: entry.tags || [],
        wordCount: entry.wordCount || 0,
        aiInsights: entry.aiInsights,
        aiPrompt: entry.aiPrompt,
        streak: entry.streak,
        lastSaved: entry.lastSaved?.toISOString(),
      });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  // AI Journal Prompt Generation (Pro only)
  app.get('/api/journal/prompt', isAuthenticated, requiresCoreOrPremium, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const user = await storage.getUser(userId);

    if (!user?.isPro) {
      return res.status(403).json({ message: "This feature requires a Pro subscription" });
    }

    const ritualContext = req.query.ritual as string | undefined;

    try {
      // Get recent entries for context
      const recentEntries = await storage.getRecentJournalEntries(userId, 3);
      const previousEntries = recentEntries.map((e: { content: string }) => e.content.substring(0, 100));

      const prompt = await generateJournalPrompt(ritualContext, previousEntries);
      res.json({ prompt });
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new OpenAITimeoutError();
      }
      throw new OpenAIError("Failed to generate journal prompt", error);
    }
  }));

  // AI Journal Analysis (Pro only)
  app.post('/api/journal/analyze', isAuthenticated, requiresCoreOrPremium, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "AI insights require a Pro subscription" });
      }

      // Validate request body
      const bodySchema = z.object({
        content: z.string().min(20, "Content must be at least 20 characters"),
      });

      const validation = bodySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: validation.error.errors[0]?.message || "Invalid request body" 
        });
      }

      const { content } = validation.data;
      const insights = await analyzeJournalEntry(content);
      res.json(insights);
    } catch (error) {
      console.error("Error analyzing journal:", error);
      res.status(500).json({ message: "Failed to analyze journal entry" });
    }
  });

  // AI Journal Coach Chat (Pro only)
  app.post('/api/journal/chat', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "AI Journal Coach is a Pro feature" });
      }

      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message required" });
      }

      // Get recent entries for context
      const recentEntries = await storage.getRecentJournalEntries(userId, 3);
      const journalHistory = recentEntries.map((e: { content: string }) => e.content);

      const response = await chatWithJournalCoach(message, journalHistory);
      res.json({ response });
    } catch (error) {
      console.error("Error in journal chat:", error);
      res.status(500).json({ message: "Failed to get coach response" });
    }
  });

  // Get all journal entries
  app.get('/api/journal/entries', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const limit = parseInt(req.query.limit as string) || 30;
      const mood = req.query.mood as string | undefined;

      const entries = await storage.getAllJournalEntries(userId, limit, mood);

      res.json(entries.map((entry: any) => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        wordCount: entry.wordCount,
        aiInsights: entry.aiInsights,
        streak: entry.streak,
        createdAt: entry.createdAt?.toISOString(),
        lastSaved: entry.lastSaved?.toISOString(),
      })));
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // ===== PROGRESS & ACHIEVEMENTS ROUTES =====
  
  // Calculate real user streak from journal entries
  app.get('/api/progress/streak', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const streak = await storage.calculateUserStreak(userId);
    res.json({ streak });
  }));

  // Get user achievements and badges
  app.get('/api/achievements/user', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const achievements = await storage.getUserAchievements(userId);
    res.json(achievements);
  }));

  // Get recent activities for feed
  app.get('/api/activities', asyncHandler(async (req: Request, res) => {
    const userId = req.query.userId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await storage.getRecentActivities(userId, limit);
    res.json(activities);
  }));

  // Get retreat spots remaining
  app.get('/api/retreat/spots', asyncHandler(async (req: Request, res) => {
    const TOTAL_SPOTS = 20;
    // In a real implementation, query the database for bookings
    // For now, return a dynamic count based on cohort capacity
    const cohortData = await db.select().from(cohortCapacity).where(eq(cohortCapacity.cohortName, 'retreat_3day'));
    const takenSpots = cohortData[0]?.takenSpots || 2;
    const spotsRemaining = Math.max(0, TOTAL_SPOTS - takenSpots);
    res.json({ 
      totalSpots: TOTAL_SPOTS,
      takenSpots,
      spotsRemaining
    });
  }));

  // ===== APP ATELIER AI COACH ROUTES =====

  // Get user's App Atelier usage status
  app.get('/api/app-atelier/usage', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get usage stats
      const usage = await storage.getAppAtelierUsage(userId);
      const messageCount = usage?.messageCount || 0;

      // Determine limits based on subscription tier
      const tier = user.subscriptionTier;
      const hasFullAccess = tier === 'vip_cohort' || tier === 'executive';
      const messageLimit = hasFullAccess ? null : 5; // Free tier gets 5 messages

      res.json({
        messageCount,
        messageLimit,
        hasFullAccess,
        tier,
        remainingMessages: messageLimit ? Math.max(0, messageLimit - messageCount) : null
      });
    } catch (error) {
      console.error("Error fetching App Atelier usage:", error);
      res.status(500).json({ message: "Failed to fetch usage" });
    }
  });

  app.post('/api/app-atelier/chat', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { message, conversationHistory, userProfile } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message required" });
      }

      // Get user to check subscription tier
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has full access (Inner Circle or Executive Intensive)
      const hasFullAccess = user.subscriptionTier === 'vip_cohort' || user.subscriptionTier === 'executive';

      // For free tier users, check message limit
      if (!hasFullAccess) {
        const usage = await storage.getAppAtelierUsage(userId);
        const messageCount = usage?.messageCount || 0;
        const MESSAGE_LIMIT = 5;

        if (messageCount >= MESSAGE_LIMIT) {
          return res.status(403).json({ 
            message: "Message limit reached",
            limitReached: true,
            upgradeRequired: true
          });
        }
      }

      // Get AI response
      const response = await chatWithAppAtelierCoach(
        message,
        conversationHistory || [],
        userProfile
      );

      // Track message usage
      await storage.incrementAppAtelierUsage(userId);

      res.json({ response });
    } catch (error) {
      console.error("Error in App Atelier chat:", error);
      res.status(500).json({ message: "Failed to get coach response" });
    }
  });

  // ===== STATS ROUTE =====
  app.get('/api/stats', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;

      const allProgress = await storage.getAllUserRitualProgress(userId);
      const allJournalEntries = await storage.getAllJournalEntries(userId, 100);

      const totalRituals = allProgress.length;
      const completedRituals = allProgress.filter(p => p.completedSteps.length > 0).length;
      const journalEntries = allJournalEntries.length;

      const latestEntry = allJournalEntries[0];
      const streak = latestEntry?.streak || 0;

      res.json({
        totalRituals,
        completedRituals,
        journalEntries,
        streak,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ===== JOURNAL ANALYTICS ROUTES =====
  app.get('/api/journal/stats', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const stats = await storage.getJournalStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching journal stats:", error);
      res.status(500).json({ message: "Failed to fetch journal stats" });
    }
  });

  app.get('/api/analytics/progress', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const entries = await storage.getAllJournalEntries(userId, 30);

      // Group by date with actual Date objects for proper sorting
      const progressByDate: Map<string, { date: Date; count: number; label: string }> = new Map();

      entries.forEach(entry => {
        if (entry.createdAt) {
          const dateObj = new Date(entry.createdAt);
          const dateKey = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD for grouping
          const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          if (progressByDate.has(dateKey)) {
            progressByDate.get(dateKey)!.count++;
          } else {
            progressByDate.set(dateKey, { date: dateObj, count: 1, label });
          }
        }
      });

      // Sort by date descending and take most recent 14 days
      const progressData = Array.from(progressByDate.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 14)
        .reverse() // Reverse to show oldest -> newest on chart
        .map(({ label, count }) => ({ date: label, count }));

      res.json(progressData);
    } catch (error) {
      console.error("Error fetching progress analytics:", error);
      res.status(500).json({ message: "Failed to fetch progress analytics" });
    }
  });

  // ===== ACHIEVEMENTS ROUTES =====
  app.get('/api/achievements', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post('/api/achievements/check', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;

      // Get journal stats to check achievements
      const stats = await storage.getJournalStats(userId);
      const newlyUnlocked: any[] = [];

      // Check and unlock achievements based on stats
      const achievementsToCheck = [
        { key: 'first_entry', condition: stats.totalEntries >= 1 },
        { key: 'streak_3', condition: stats.currentStreak >= 3 },
        { key: 'streak_7', condition: stats.currentStreak >= 7 },
        { key: 'streak_30', condition: stats.currentStreak >= 30 },
        { key: 'word_warrior_1k', condition: stats.totalWords >= 1000 },
        { key: 'word_warrior_5k', condition: stats.totalWords >= 5000 },
        { key: 'mood_master', condition: Object.keys(stats.moodDistribution).length >= 5 },
        { key: 'tag_explorer', condition: stats.allTags.length >= 10 },
        { key: 'consistent_writer', condition: stats.totalEntries >= 10 },
      ];

      for (const achievement of achievementsToCheck) {
        if (achievement.condition) {
          const unlocked = await storage.unlockAchievement(userId, achievement.key);
          if (unlocked) {
            newlyUnlocked.push(unlocked);
          }
        }
      }

      res.json({ 
        newlyUnlocked,
        message: newlyUnlocked.length > 0 
          ? `Unlocked ${newlyUnlocked.length} new achievement(s)!`
          : 'No new achievements'
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // ===== STRIPE SUBSCRIPTION ROUTES =====
  app.post('/api/create-subscription', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      const existingSubscription = await storage.getSubscription(userId);
      if (existingSubscription && existingSubscription.status === 'active') {
        return res.json({
          alreadySubscribed: true,
          status: existingSubscription.status,
          currentPeriodEnd: existingSubscription.currentPeriodEnd,
        });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || undefined,
        metadata: {
          userId: user.id,
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID!,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      const subData = subscription as any;
      await storage.upsertSubscription({
        userId: user.id,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: process.env.STRIPE_PRICE_ID!,
        status: subscription.status,
        currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      });

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: error.message || "Failed to create subscription" });
    }
  });

  // Create Stripe checkout session for tier subscription/upgrade
  app.post('/api/create-checkout-session', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const { tier } = req.body as { tier: string };

      if (!tier) {
        return res.status(400).json({ message: "Tier is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.email) {
        return res.status(400).json({ message: "User email is required for subscriptions" });
      }

      // Map tier to Stripe price ID from environment
      const tierPriceMap: Record<string, string | undefined> = {
        'pro_monthly': process.env.STRIPE_PRICE_ID,
        'pro_annual': process.env.STRIPE_PRICE_ID_ANNUAL,
        'sanctuary': process.env.STRIPE_PRICE_ID_SANCTUARY,
        'inner_circle': process.env.STRIPE_PRICE_ID_INNER_CIRCLE,
        'founders_circle': process.env.STRIPE_PRICE_ID_FOUNDERS_CIRCLE,
        'vip_cohort': process.env.STRIPE_PRICE_ID_VIP,
        'executive': process.env.STRIPE_PRICE_ID_EXECUTIVE,
      };

      const priceId = tierPriceMap[tier];
      if (!priceId) {
        return res.status(400).json({ message: `Invalid tier or missing price configuration for: ${tier}` });
      }

      // Check for existing subscription
      const existingSubscription = await storage.getSubscription(userId);

      // If user has active subscription, upgrade it directly (not via checkout)
      if (existingSubscription?.status === 'active' && existingSubscription.stripeSubscriptionId) {
        // Get current subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(existingSubscription.stripeSubscriptionId);

        // Update subscription with new price (proration automatic)
        const updatedSubscription = await stripe.subscriptions.update(
          existingSubscription.stripeSubscriptionId,
          {
            items: [{
              id: subscription.items.data[0].id,
              price: priceId,
            }],
            proration_behavior: 'create_prorations',
            metadata: {
              userId: user.id,
              tier,
            },
          }
        );

        // Update database
        const subData = updatedSubscription as any;
        await storage.upsertSubscription({
          userId: user.id,
          stripeCustomerId: existingSubscription.stripeCustomerId,
          stripeSubscriptionId: updatedSubscription.id,
          stripePriceId: priceId,
          status: updatedSubscription.status,
          currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : undefined,
          cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end || false,
        });

        // Update user subscription tier
        await storage.updateUserSubscriptionTier(user.id, tier);

        return res.json({
          upgraded: true,
          message: 'Subscription upgraded successfully with proration applied',
        });
      }

      // New subscription - create checkout session
      let customerId = existingSubscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
      }

      // Create checkout session for new subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: `${req.protocol}://${req.get('host')}/workspace?upgrade=success`,
        cancel_url: `${req.protocol}://${req.get('host')}/upgrade?canceled=true`,
        subscription_data: {
          metadata: {
            userId: user.id,
            tier,
          },
        },
        metadata: {
          userId: user.id,
          tier,
        },
      });

      res.json({ 
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
  });

  // ===== GLOW-UP PROGRAM ROUTES (PRO ONLY) =====

  // Get user's glow-up profile
  app.get('/api/glow-up/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const profile = await storage.getGlowUpProfile(userId);
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching glow-up profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create/update glow-up profile (onboarding)
  app.post('/api/glow-up/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const { name, brandType, niche, platform, goal } = req.body;

      if (!name || !brandType || !niche || !platform || !goal) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const profile = await storage.upsertGlowUpProfile({
        userId,
        name,
        brandType,
        niche,
        platform,
        goal,
      });

      // Initialize progress if it doesn't exist
      let progress = await storage.getGlowUpProgress(userId);
      if (!progress) {
        progress = await storage.upsertGlowUpProgress({
          userId,
          completedDays: [],
          currentDay: 1,
        });
      }

      res.json({ profile, progress });
    } catch (error) {
      console.error("Error saving glow-up profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Get user's glow-up progress
  app.get('/api/glow-up/progress', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const progress = await storage.getGlowUpProgress(userId);
      res.json(progress || null);
    } catch (error) {
      console.error("Error fetching glow-up progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update glow-up progress (mark day complete)
  app.post('/api/glow-up/progress', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const { day } = req.body;

      if (!day || day < 1 || day > 14) {
        return res.status(400).json({ message: "Invalid day number" });
      }

      const currentProgress = await storage.getGlowUpProgress(userId);
      if (!currentProgress) {
        return res.status(404).json({ message: "Progress not found. Complete onboarding first." });
      }

      const completedDays = currentProgress.completedDays || [];
      if (!completedDays.includes(day)) {
        completedDays.push(day);
        completedDays.sort((a, b) => a - b);
      }

      const completedAt = completedDays.length === 14 ? new Date() : currentProgress.completedAt;
      const currentDay = Math.min(completedDays.length + 1, 14);

      const progress = await storage.upsertGlowUpProgress({
        userId,
        completedDays,
        currentDay,
        completedAt,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error updating glow-up progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get all journal entries
  app.get('/api/glow-up/journal', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const entries = await storage.getAllGlowUpJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching glow-up journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Get specific day journal entry
  app.get('/api/glow-up/journal/:day', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const day = parseInt(req.params.day);

      if (isNaN(day) || day < 1 || day > 14) {
        return res.status(400).json({ message: "Invalid day number" });
      }

      const entry = await storage.getGlowUpJournalEntry(userId, day);
      res.json(entry || null);
    } catch (error) {
      console.error("Error fetching glow-up journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  // Save/update journal entry
  app.post('/api/glow-up/journal', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);

      if (!user?.isPro) {
        return res.status(403).json({ message: "The AI Glow-Up Program is a Pro feature" });
      }

      const { day, gptResponse, publicPostDraft, notes } = req.body;

      if (!day || day < 1 || day > 14) {
        return res.status(400).json({ message: "Invalid day number" });
      }

      console.log(`[Glow-Up] Saving Day ${day} for user ${userId}:`, {
        day,
        gptResponseLength: gptResponse?.length || 0,
        publicPostDraftLength: publicPostDraft?.length || 0,
        notesLength: notes?.length || 0
      });

      const entry = await storage.upsertGlowUpJournalEntry({
        userId,
        day,
        gptResponse: gptResponse || null,
        publicPostDraft: publicPostDraft || null,
        notes: notes || null,
      });

      console.log(`[Glow-Up] Successfully saved Day ${day}, entry ID: ${entry.id}`);

      res.json(entry);
    } catch (error) {
      console.error("Error saving glow-up journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  // ===== NEWSROUTES (Public) =====

  // Get daily tech news from RSS feeds
  app.get('/api/news', async (req, res) => {
    try {
      const category = req.query.category as NewsCategory | undefined;

      // Validate category if provided
      const validCategories: NewsCategory[] = ["AI", "Crypto", "NFT", "Blockchain", "Metaverse", "Social"];
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }

      const news = await fetchNewsByCategory(category);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // ===== COHORT CAPACITY ROUTES (Public) =====

  // Get cohort capacity by name (vip_cohort or executive)
  app.get('/api/cohort-capacity/:cohortName', async (req, res) => {
    try {
      const { cohortName } = req.params;

      // Validate cohort name
      if (cohortName !== 'vip_cohort' && cohortName !== 'executive') {
        return res.status(400).json({ message: "Invalid cohort name" });
      }

      const capacity = await storage.getCohortCapacity(cohortName);

      // Return default if not found
      if (!capacity) {
        return res.json({
          cohortName,
          totalSpots: 10,
          takenSpots: 7,
          spotsRemaining: 3,
          isActive: true,
        });
      }

      res.json({
        ...capacity,
        spotsRemaining: capacity.totalSpots - capacity.takenSpots,
      });
    } catch (error) {
      console.error("Error fetching cohort capacity:", error);
      res.status(500).json({ message: "Failed to fetch cohort capacity" });
    }
  });

  // Stripe webhook handler
  app.post('/api/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('No signature provided');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata?.userId || 
            (await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer).metadata?.userId;

          if (userId) {
            await storage.upsertSubscription({
              userId,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            });

            // Update user's Pro status
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';
            await storage.updateUserProStatus(userId, isActive);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata?.userId ||
            (await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer).metadata?.userId;

          if (userId) {
            await storage.upsertSubscription({
              userId,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: 'canceled',
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              cancelAtPeriodEnd: true,
            });

            // Remove user's Pro status
            await storage.updateUserProStatus(userId, false);
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook event:', error);
      res.status(500).json({ message: 'Webhook handler failed' });
    }
  });

  // ===== THOUGHT LEADERSHIP JOURNEY ROUTES (FREEMIUM: Days 1-3 Free, 4-30 Pro) =====

  // Get user's journey progress
  // Get curriculum (all 30 days)
  app.get('/api/thought-leadership/curriculum', canAccessThoughtLeadership, async (_req: Request, res) => {
    res.json(CURRICULUM);
  });

  // Get specific curriculum day
  app.get('/api/thought-leadership/curriculum/:day', canAccessThoughtLeadership, async (req: Request, res) => {
    const day = parseInt(req.params.day);
    const curriculumDay = CURRICULUM.find(d => d.day === day);

    if (!curriculumDay) {
      return res.status(404).json({ message: 'Day not found' });
    }

    res.json(curriculumDay);
  });

  app.get('/api/thought-leadership/progress', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const progress = await storage.getThoughtLeadershipProgress(userId);

      if (!progress) {
        // Create initial progress for new user
        const newProgress = await storage.createThoughtLeadershipProgress({
          userId,
          currentDay: 1,
          completedDays: [],
          lessonsCompleted: [],
          practicesSubmitted: [],
          practiceReflections: {},
          currentStreak: 0,
          longestStreak: 0,
          totalPostsGenerated: 0,
          totalPostsPublished: 0,
          journeyStatus: 'active',
          lastActivityDate: null,
        });
        return res.json(newProgress);
      }

      res.json(progress);
    } catch (error) {
      console.error('Error fetching TL progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  });

  // Update brand profile (onboarding)
  app.put('/api/thought-leadership/brand-profile', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { brandExpertise, brandNiche, problemSolved, uniqueStory, currentGoals } = req.body;

      // Get or create progress record
      let progress = await storage.getThoughtLeadershipProgress(userId);

      if (!progress) {
        progress = await storage.createThoughtLeadershipProgress({
          userId,
          currentDay: 1,
          completedDays: [],
          currentStreak: 0,
          longestStreak: 0,
          totalPostsGenerated: 0,
          totalPostsPublished: 0,
          journeyStatus: 'active',
          lastActivityDate: null,
          brandOnboardingCompleted: false,
        });
      }

      // Update brand profile
      const updated = await storage.updateThoughtLeadershipProgress(userId, {
        brandExpertise,
        brandNiche,
        problemSolved,
        uniqueStory,
        currentGoals,
        brandOnboardingCompleted: true,
        updatedAt: new Date(),
      });

      res.json(updated);
    } catch (error) {
      console.error('Error updating brand profile:', error);
      res.status(500).json({ message: 'Failed to update brand profile' });
    }
  });

  // Generate new content for current day (or regenerate for specific day)
  app.post('/api/thought-leadership/generate', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { practiceReflection, dayNumber: requestedDay } = req.body;

      if (!practiceReflection || !practiceReflection.trim()) {
        return res.status(400).json({ message: 'Practice reflection is required' });
      }

      // Get user's brand profile and progress
      const progress = await storage.getThoughtLeadershipProgress(userId);
      if (!progress) {
        return res.status(400).json({ message: 'Please complete brand onboarding first' });
      }

      // Use requested day number or default to current day
      const targetDay = requestedDay || progress.currentDay;

      // Validate day number
      if (targetDay < 1 || targetDay > 30) {
        return res.status(400).json({ message: 'Invalid day number. Must be between 1 and 30.' });
      }

      // Check if user has Pro access for days 4-30
      const user = await storage.getUser(userId);
      const { isProTier } = await import("../shared/pricing");
      const isPro = user && (user.isPro || isProTier(user.subscriptionTier as any));

      if (targetDay > 3 && !isPro) {
        return res.status(403).json({ 
          message: 'Pro subscription required',
          reason: 'Free users can access days 1-3. Upgrade to Pro to unlock all 30 days.' 
        });
      }

      // Get curriculum for target day
      const curriculumDay = CURRICULUM.find(d => d.day === targetDay);
      if (!curriculumDay) {
        return res.status(400).json({ message: 'Invalid day number' });
      }

      // Get previous topics to avoid repetition
      const recentPosts = await storage.getThoughtLeadershipPostsByUser(userId, 7);
      const previousTopics = recentPosts.map(p => p.topic);

      // Generate content using AI with brand profile and practice reflection
      const brandProfile = {
        brandExpertise: progress.brandExpertise || undefined,
        brandNiche: progress.brandNiche || undefined,
        problemSolved: progress.problemSolved || undefined,
        uniqueStory: progress.uniqueStory || undefined,
        currentGoals: progress.currentGoals || undefined,
      };

      const content = await generateThoughtLeadershipContent(
        targetDay,
        brandProfile,
        practiceReflection,
        curriculumDay.contentFocus.topic,
        curriculumDay.contentFocus.angle,
        previousTopics
      );

      const actualDayNumber = targetDay;
      const isRegenerating = !!requestedDay; // If dayNumber is provided, it's a regeneration request

      // Check if post already exists for this day
      const existingPosts = await storage.getThoughtLeadershipPostsByUser(userId, 100);
      const existingPost = existingPosts.find(p => p.dayNumber === actualDayNumber);

      let post;
      if (existingPost) {
        // Update existing post (whether current day or past day)
        post = await storage.updateThoughtLeadershipPost(existingPost.id, {
          topic: content.topic,
          dailyStory: practiceReflection,
          contentLong: content.contentLong,
          contentMedium: content.contentMedium,
          contentShort: content.contentShort,
          updatedAt: new Date(),
        });
      } else {
        // Create new post only if none exists for this day
        post = await storage.createThoughtLeadershipPost({
          userId,
          dayNumber: actualDayNumber,
          topic: content.topic,
          dailyStory: practiceReflection,
          contentLong: content.contentLong,
          contentMedium: content.contentMedium,
          contentShort: content.contentShort,
          status: 'draft',
          publishedToMetaHers: false,
          publishedToExternal: false,
          externalPlatforms: [],
          isPublic: false,
        });
      }

      // Update progress - mark day as completed, practice submitted, and advance
      if (progress) {
        const practiceReflections = progress.practiceReflections || {};
        practiceReflections[actualDayNumber] = practiceReflection;

        const practicesSubmitted = [...(progress.practicesSubmitted || []), actualDayNumber]
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => a - b);
        const today = new Date().toISOString().split('T')[0];
        const completedDays = [...progress.completedDays, actualDayNumber].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);

        // Only update streak and advance day if this is a new completion (not regenerating)
        const progressUpdates: any = {
          completedDays,
          practicesSubmitted,
          practiceReflections,
          updatedAt: new Date(),
        };

        // Only only update streak and advance day if this is a new completion (not regenerating)
        const shouldAdvance = actualDayNumber === progress.currentDay && !existingPost;

        if (shouldAdvance) {
          // Calculate streak
          let newStreak = 1;
          if (progress.lastActivityDate) {
            const lastDate = new Date(progress.lastActivityDate);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
              newStreak = progress.currentStreak + 1;
            } else if (daysDiff > 1) {
              newStreak = 1; // Streak broken
            } else {
              newStreak = progress.currentStreak || 1; // Same day
            }
          }

          const nextDay = Math.min(actualDayNumber + 1, 30);

          progressUpdates.currentDay = nextDay;
          progressUpdates.currentStreak = newStreak;
          progressUpdates.longestStreak = Math.max(newStreak, progress.longestStreak);
          progressUpdates.totalPostsGenerated = progress.totalPostsGenerated + 1;
          progressUpdates.lastActivityDate = today;
          progressUpdates.journeyStatus = completedDays.length >= 30 ? 'completed' : 'active';
          progressUpdates.completedAt = completedDays.length >= 30 ? new Date() : undefined;
        }

        await storage.updateThoughtLeadershipProgress(userId, progressUpdates);
      }

      res.json(post);
    } catch (error) {
      console.error('Error generating TL content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Failed to generate content', error: errorMessage });
    }
  });

  // Save or update a post
  app.patch('/api/thought-leadership/posts/:id', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id } = req.params;
      const updates = req.body;

      // Verify ownership
      const post = await storage.getThoughtLeadershipPostById(id);
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const updated = await storage.updateThoughtLeadershipPost(id, {
        ...updates,
        updatedAt: new Date(),
      });

      res.json(updated);
    } catch (error) {
      console.error('Error updating TL post:', error);
      res.status(500).json({ message: 'Failed to update post' });
    }
  });

  // Publish a post
  app.post('/api/thought-leadership/posts/:id/publish', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id } = req.params;
      const { publishTo } = req.body; // "metahers", "external", or "both"

      const post = await storage.getThoughtLeadershipPostById(id);
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Generate slug from topic
      const slug = post.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const updates: any = {
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      if (publishTo === 'metahers' || publishTo === 'both') {
        updates.publishedToMetaHers = true;
        updates.isPublic = true;
        updates.slug = `${slug}-${id.slice(0, 8)}`;
        updates.status = publishTo === 'both' ? 'published_both' : 'published_metahers';
      }

      if (publishTo === 'external' || publishTo === 'both') {
        updates.publishedToExternal = true;
        updates.status = publishTo === 'both' ? 'published_both' : 'published_external';
      }

      const updated = await storage.updateThoughtLeadershipPost(id, updates);

      // Update progress - mark day as completed and update streak
      const progress = await storage.getThoughtLeadershipProgress(userId);
      if (progress) {
        const today = new Date().toISOString().split('T')[0];
        const completedDays = [...progress.completedDays, post.dayNumber].filter((v, i, a) => a.indexOf(v) === i);

        // Calculate streak
        let newStreak = 1;
        if (progress.lastActivityDate) {
          const lastDate = new Date(progress.lastActivityDate);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 1) {
            newStreak = progress.currentStreak + 1;
          } else if (daysDiff > 1) {
            newStreak = 1; // Streak broken
          } else {
            newStreak = progress.currentStreak; // Same day
          }
        }

        await storage.updateThoughtLeadershipProgress(userId, {
          completedDays,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, progress.longestStreak),
          totalPostsPublished: progress.totalPostsPublished + 1,
          lastActivityDate: today,
          journeyStatus: completedDays.length >= 30 ? 'completed' : 'active',
          completedAt: completedDays.length >= 30 ? new Date() : undefined,
          updatedAt: new Date(),
        });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error publishing TL post:', error);
      res.status(500).json({ message: 'Failed to publish post' });
    }
  });

  // Get user's posts
  app.get('/api/thought-leadership/posts', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const limit = parseInt(req.query.limit as string) || 30;
      const posts = await storage.getThoughtLeadershipPostsByUser(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching TL posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  // Get a specific post
  app.get('/api/thought-leadership/posts/:id', canAccessThoughtLeadership, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id } = req.params;

      const post = await storage.getThoughtLeadershipPostById(id);
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching TL post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  // Get public posts for MetaHers Insights feed (public route)
  app.get('/api/thought-leadership/public', async (_req: Request, res) => {
    try {
      const limit = parseInt(_req.query.limit as string) || 20;
      const posts = await storage.getPublicThoughtLeadershipPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching public TL posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  // Get public post by slug (public route)
  app.get('/api/thought-leadership/insights/:slug', async (req: Request, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getThoughtLeadershipPostBySlug(slug);

      if (!post || !post.isPublic) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Increment view count
      await storage.updateThoughtLeadershipPost(post.id, {
        viewCount: post.viewCount + 1,
      });

      res.json(post);
    } catch (error) {
      console.error('Error fetching public TL post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  // ===== MEMBERSHIP TIERROUTES =====

  // GROUP SESSIONS (Sanctuary tier and above)
  app.get('/api/sessions/upcoming', isSanctuaryMember, async (req: Request, res) => {
    try {
      const sessionType = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const sessions = await storage.getUpcomingGroupSessions(sessionType, limit);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      res.status(500).json({ message: 'Failed to fetch sessions' });
    }
  });

  app.get('/api/sessions/past', isSanctuaryMember, async (req: Request, res) => {
    try {
      const sessionType = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const sessions = await storage.getPastGroupSessions(sessionType, limit);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching past sessions:', error);
      res.status(500).json({ message: 'Failed to fetch sessions' });
    }
  });

  app.get('/api/sessions/:id', isSanctuaryMember, async (req: Request, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getGroupSessionById(id);

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      res.json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ message: 'Failed to fetch session' });
    }
  });

  // SESSION REGISTRATIONS
  app.post('/api/sessions/:id/register', isSanctuaryMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id: sessionId } = req.params;

      // Check if session exists
      const session = await storage.getGroupSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Check if user is already registered
      const existingRegistrations = await storage.getSessionRegistrations(sessionId);
      const alreadyRegistered = existingRegistrations.some(r => r.userId === userId);

      if (alreadyRegistered) {
        return res.status(400).json({ message: 'Already registered for this session' });
      }

      // Check capacity
      const activeRegistrations = existingRegistrations.filter(r => r.status === 'confirmed');
      if (activeRegistrations.length >= session.maxCapacity) {
        return res.status(400).json({ message: 'Session is full' });
      }

      // Create registration
      const registration = await storage.createSessionRegistration({
        userId,
        sessionId,
        status: 'confirmed',
      });

      res.json(registration);
    } catch (error) {
      console.error('Error registering for session:', error);
      res.status(500).json({ message: 'Failed to register for session' });
    }
  });

  app.delete('/api/sessions/:id/cancel', isSanctuaryMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id: sessionId } = req.params;

      const registrations = await storage.getUserSessionRegistrations(userId);
      const registration = registrations.find(r => r.sessionId === sessionId);

      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      await storage.cancelSessionRegistration(registration.id);
      res.json({ message: 'Registration cancelled' });
    } catch (error) {
      console.error('Error cancelling registration:', error);
      res.status(500).json({ message: 'Failed to cancel registration' });
    }
  });

  app.get('/api/sessions/my-registrations', isSanctuaryMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const status = req.query.status as string | undefined;
      const registrations = await storage.getUserSessionRegistrations(userId, status);
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Failed to fetch registrations' });
    }
  });

  // ONE-ON-ONE BOOKINGS (Inner Circle and above)
  app.post('/api/bookings', isInnerCircleMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { scheduledDate, sessionType, notes } = req.body;

      if (!scheduledDate || !sessionType) {
        return res.status(400).json({ message: 'Scheduled date and session type are required' });
      }

      const booking = await storage.createOneOnOneBooking({
        userId,
        scheduledDate: new Date(scheduledDate),
        bookingType: sessionType,
        notes: notes || null,
        status: 'pending',
        duration: 30,
      });

      res.json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  app.get('/api/bookings', isInnerCircleMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const status = req.query.status as string | undefined;
      const bookings = await storage.getUserOneOnOneBookings(userId, status);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/bookings/upcoming', isInnerCircleMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const bookings = await storage.getUpcomingOneOnOneBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.patch('/api/bookings/:id', isInnerCircleMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id } = req.params;

      const booking = await storage.getOneOnOneBookingById(id);
      if (!booking || booking.userId !== userId) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const updated = await storage.updateOneOnOneBooking(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Failed to update booking' });
    }
  });

  app.delete('/api/bookings/:id', isInnerCircleMember, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { id } = req.params;

      const booking = await storage.getOneOnOneBookingById(id);
      if (!booking || booking.userId !== userId) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await storage.updateOneOnOneBooking(id, { status: 'cancelled' });
      res.json({ message: 'Booking cancelled' });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: 'Failed to cancel booking' });
    }
  });

  // FOUNDER INSIGHTS (Inner Circle and above)
  app.get('/api/insights', isInnerCircleMember, async (req: Request, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const insights = await storage.getFounderInsights(undefined, limit);
      res.json(insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      res.status(500).json({ message: 'Failed to fetch insights' });
    }
  });

  app.get('/api/insights/:id', isInnerCircleMember, async (req: Request, res) => {
    try {
      const { id } = req.params;
      const insight = await storage.getFounderInsightById(id);

      if (!insight || !insight.isPublished) {
        return res.status(404).json({ message: 'Insight not found' });
      }

      // Increment view count
      await storage.updateFounderInsight(id, {
        viewCount: insight.viewCount + 1,
      });

      res.json(insight);
    } catch (error) {
      console.error('Error fetching insight:', error);
      res.status(500).json({ message: 'Failed to fetch insight' });
    }
  });

  // ONE-TIME PRODUCTION DATABASE POPULATION ENDPOINT
  // This endpoint populates the production database with initial spaces and experiences
  // It's idempotent and safe to call multiple times (uses ON CONFLICT DO UPDATE)
  // PROTECTED: Requires admin authentication
  app.post('/api/admin/populate-database', isAuthenticated, isAdmin, async (_req: Request, res) => {
    try {
      console.log('Starting database population...');

      // Check if spaces already exist
      const existingSpaces = await storage.getSpaces();
      if (existingSpaces && existingSpaces.length > 0) {
        console.log(`Database already has ${existingSpaces.length} spaces. Updating existing data...`);
      }

      const spacesData = [
        {
          id: 'web3',
          name: 'Web3',
          slug: 'web3',
          description: 'Master decentralized technologies and understand the future of the internet. Build your Web3 fluency from fundamentals to real-world applications.',
          icon: 'Globe',
          color: 'hyper-violet',
          sortOrder: 1,
          isActive: true
        },
        {
          id: 'crypto',
          name: 'NFT/Blockchain/Crypto',
          slug: 'crypto',
          description: 'Navigate the world of digital assets with confidence. From NFTs to blockchain basics to cryptocurrency trading—understand it all and leverage it for your future.',
          icon: 'Coins',
          color: 'magenta-quartz',
          sortOrder: 2,
          isActive: true
        },
        {
          id: 'ai',
          name: 'AI',
          slug: 'ai',
          description: 'Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.',
          icon: 'Sparkles',
          color: 'cyber-fuchsia',
          sortOrder: 3,
          isActive: true
        },
        {
          id: 'metaverse',
          name: 'Metaverse',
          slug: 'metaverse',
          description: 'Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.',
          icon: 'Boxes',
          color: 'aurora-teal',
          sortOrder: 4,
          isActive: true
        },
        {
          id: 'branding',
          name: 'Branding',
          slug: 'branding',
          description: 'Build your personal and professional brand with AI-powered tools. Master content creation, community building, and thought leadership for the digital age.',
          icon: 'Megaphone',
          color: 'liquid-gold',
          sortOrder: 5,
          isActive: true
        },
        {
          id: 'moms',
          name: 'Moms',
          slug: 'moms',
          description: 'A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.',
          icon: 'Heart',
          color: 'hyper-violet',
          sortOrder: 6,
          isActive: true
        },
        {
          id: 'app-atelier',
          name: 'App Atelier',
          slug: 'app-atelier',
          description: 'Build apps with AI assistance. Turn your ideas into reality with AI-powered development tools and no-code solutions.',
          icon: 'Code',
          color: 'aurora-teal',
          sortOrder: 7,
          isActive: true
        },
        {
          id: 'founders-club',
          name: 'Founder\'s Club',
          slug: 'founders-club',
          description: 'The 12-week accelerator where women turn business ideas into reality using AI, no-code tools, and Web3 mindset. Personal mentorship, community support, and everything you need to launch.',
          icon: 'Crown',
          color: 'cyber-fuchsia',
          sortOrder: 8,
          isActive: true
        },
        {
          id: 'digital-sales',
          name: 'Digital Boutique',
          slug: 'digital-boutique',
          description: 'Launch your online store and start selling in 3 days. Master Shopify, Instagram Shopping, TikTok Shop, and automated marketing. Learn by DOING—not watching—in hands-on workshops where you build your e-commerce business in real-time.',
          icon: 'ShoppingBag',
          color: 'liquid-gold',
          sortOrder: 9,
          isActive: true
        }
      ];

      const experiencesData = EXPERIENCES.map(exp => ({
        id: exp.id,
        spaceId: exp.spaceId,
        title: exp.title,
        slug: exp.slug,
        description: exp.description,
        learningObjectives: exp.learningObjectives,
        tier: exp.tier,
        estimatedMinutes: exp.estimatedMinutes,
        sortOrder: exp.sortOrder,
        content: exp.content,
        personalizationEnabled: exp.personalizationEnabled,
        isActive: true
      }));

      // Populate spaces
      let spacesCreated = 0;
      for (const spaceData of spacesData) {
        await db.insert(spaces)
          .values({
            id: spaceData.id,
            name: spaceData.name,
            slug: spaceData.slug,
            description: spaceData.description,
            icon: spaceData.icon,
            color: spaceData.color,
            sortOrder: spaceData.sortOrder,
            isActive: spaceData.isActive
          })
          .onConflictDoUpdate({
            target: spaces.id,
            set: {
              name: drizzleSql`EXCLUDED.name`,
              slug: drizzleSql`EXCLUDED.slug`,
              description: drizzleSql`EXCLUDED.description`,
              icon: drizzleSql`EXCLUDED.icon`,
              color: drizzleSql`EXCLUDED.color`,
              sortOrder: drizzleSql`EXCLUDED.sort_order`,
              isActive: drizzleSql`EXCLUDED.is_active`,
              updatedAt: drizzleSql`NOW()`
            }
          });
        spacesCreated++;
        console.log(`✓ Upserted space: ${spaceData.name}`);
      }

      // Populate experiences
      let experiencesCreated = 0;
      for (const expData of experiencesData) {
        await db.insert(transformationalExperiences)
          .values({
            id: expData.id,
            spaceId: expData.spaceId,
            title: expData.title,
            slug: expData.slug,
            description: expData.description,
            learningObjectives: expData.learningObjectives,
            tier: expData.tier,
            estimatedMinutes: expData.estimatedMinutes,
            sortOrder: expData.sortOrder,
            content: expData.content,
            personalizationEnabled: expData.personalizationEnabled,
            isActive: expData.isActive
          } as any)
          .onConflictDoUpdate({
            target: transformationalExperiences.id,
            set: {
              spaceId: drizzleSql`EXCLUDED.space_id`,
              title: drizzleSql`EXCLUDED.title`,
              slug: drizzleSql`EXCLUDED.slug`,
              description: drizzleSql`EXCLUDED.description`,
              learningObjectives: drizzleSql`EXCLUDED.learning_objectives`,
              tier: drizzleSql`EXCLUDED.tier`,
              estimatedMinutes: drizzleSql`EXCLUDED.estimated_minutes`,
              sortOrder: drizzleSql`EXCLUDED.sort_order`,
              content: drizzleSql`EXCLUDED.content`,
              personalizationEnabled: drizzleSql`EXCLUDED.personalization_enabled`,
              isActive: drizzleSql`EXCLUDED.is_active`,
              updatedAt: drizzleSql`NOW()`
            }
          });
        experiencesCreated++;
        console.log(`✓ Upserted experience: ${expData.title}`);
      }

      console.log(`✅ Database population complete: ${spacesCreated} spaces, ${experiencesCreated} experiences`);

      res.json({
        success: true,
        message: 'Database populated successfully',
        stats: {
          spaces: spacesCreated,
          experiences: experiencesCreated
        }
      });
    } catch (error) {
      console.error('❌ Error populating database:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to populate database',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ADMIN: Test content enhancement with TOON optimization (Protected - Admin Only)
  app.post('/api/admin/test-content-enhancement', isAuthenticated, isAdmin, async (req: Request, res) => {
    try {

      const { experienceSlug, mode } = req.body;

      if (!experienceSlug) {
        return res.status(400).json({ message: 'Experience slug is required' });
      }

      // Import the enhancement service
      const { enhanceExperienceContent, estimateRegenerationCost } = await import('./enhancedContentService.js');

      // Fetch the experience
      const experience = await storage.getExperienceBySlug(experienceSlug);
      if (!experience) {
        return res.status(404).json({ message: 'Experience not found' });
      }

      // Prepare the experience data
      const existingExperience = {
        id: experience.id,
        title: experience.title,
        description: experience.description,
        tier: experience.tier as "free" | "pro",
        learningObjectives: experience.learningObjectives,
        sections: experience.content.sections
      };

      // Enhance the content
      const enhancedSections = await enhanceExperienceContent(existingExperience, {
        fullRegeneration: mode === 'full',
        preserveStructure: mode !== 'full'
      });

      // Calculate cost estimates for full regeneration
      const costEstimate = estimateRegenerationCost(65, experience.tier as "free" | "pro");

      res.json({
        success: true,
        experience: {
          title: experience.title,
          slug: experienceSlug,
          tier: experience.tier
        },
        originalSectionCount: experience.content.sections.length,
        enhancedSectionCount: enhancedSections.length,
        enhancedSections,
        costEstimate: {
          message: 'Estimated cost to regenerate all 65 experiences',
          ...costEstimate
        }
      });

    } catch (error) {
      console.error('❌ Content enhancement test failed:', error);
      res.status(500).json({
        success: false,
        message: 'Content enhancement failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== METAHERS CIRCLE ROUTES =====
  
  // Get all women profiles (public discovery)
  app.get('/api/circle/profiles', asyncHandler(async (req: Request, res) => {
    const profiles = await storage.getAllWomenProfiles();
    res.json(profiles);
  }));

  // Search women profiles
  app.get('/api/circle/search', asyncHandler(async (req: Request, res) => {
    const { q, visibility } = req.query;
    const profiles = await storage.searchProfiles(q as string, visibility as string);
    res.json(profiles);
  }));

  // Get user's own profile
  app.get('/api/circle/profile', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const profile = await storage.getUserWomenProfile(userId);
    res.json(profile);
  }));

  // Create/update women profile
  app.post('/api/circle/profile', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { headline, bio, location, visibility, lookingFor } = req.body;
    
    let profile = await storage.getUserWomenProfile(userId);
    if (profile) {
      profile = await storage.updateWomenProfile(profile.id, { headline, bio, location, visibility, lookingFor });
    } else {
      profile = await storage.createWomenProfile({ userId, headline, bio, location, visibility, lookingFor });
    }
    res.json(profile);
  }));

  // Get active skills trades
  app.get('/api/circle/skills-trades', asyncHandler(async (req: Request, res) => {
    const trades = await storage.getActiveSkillsTrades();
    res.json(trades);
  }));

  // Create skills trade
  app.post('/api/circle/skills-trade', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const profile = await storage.getUserWomenProfile(userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const { havingSkill, wantingSkill, description } = req.body;
    const trade = await storage.createSkillsTrade({ profileId: profile.id, havingSkill, wantingSkill, description });
    res.json(trade);
  }));

  // Get user messages
  app.get('/api/circle/messages', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const messages = await storage.getUserMessages(userId, 50);
    res.json(messages);
  }));

  // Send direct message
  app.post('/api/circle/message', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { recipientId, message } = req.body;
    const dm = await storage.sendDirectMessage({ senderId: userId, recipientId, message });
    res.json(dm);
  }));

  // Get conversation
  app.get('/api/circle/conversation/:userId', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const currentUserId = req.session!.userId as string;
    const otherUserId = req.params.userId;
    const messages = await storage.getConversation(currentUserId, otherUserId, 50);
    res.json(messages);
  }));

  // Get profile services
  app.get('/api/circle/services/:profileId', asyncHandler(async (req: Request, res) => {
    const services = await storage.getProfileServices(req.params.profileId);
    res.json(services);
  }));

  // Create service
  app.post('/api/circle/service', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const profile = await storage.getUserWomenProfile(userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const { title, description, category, rate } = req.body;
    const service = await storage.createProfileService({ profileId: profile.id, title, description, category, rate });
    res.json(service);
  }));

  // Get opportunities
  app.get('/api/circle/opportunities', asyncHandler(async (req: Request, res) => {
    const opportunities = await storage.getAllOpportunities(20);
    res.json(opportunities);
  }));

  // Post opportunity
  app.post('/api/circle/opportunity', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { title, description, type, compensation } = req.body;
    const opp = await storage.createOpportunity({ posterId: userId, title, description, type, compensation });
    res.json(opp);
  }));

  // Get profile activity
  app.get('/api/circle/activity/:profileId', asyncHandler(async (req: Request, res) => {
    const activity = await storage.getProfileActivity(req.params.profileId, 20);
    res.json(activity);
  }));

  // Add to activity feed
  app.post('/api/circle/activity', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const profile = await storage.getUserWomenProfile(userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const { activityType, title, description } = req.body;
    const activity = await storage.addActivityFeed({ profileId: profile.id, activityType, title, description });
    res.json(activity);
  }));

  // Submit onboarding quiz
  app.post('/api/onboarding/quiz', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { goal, experienceLevel, role, timeAvailability, painPoint, learningStyle, recommendedExperiences } = req.body;
    
    // Validate required fields
    if (!goal || !experienceLevel || !role || !timeAvailability || !painPoint || !learningStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quizData = {
      userId,
      goal,
      experienceLevel,
      role,
      timeAvailability,
      painPoint,
      learningStyle,
      recommendedExperiences: recommendedExperiences || [],
    };

    const result = await db.insert(quizResponses)
      .values(quizData as any)
      .onConflictDoUpdate({
        target: quizResponses.userId,
        set: quizData as any,
      })
      .returning();

    // Mark onboarding as completed in user record
    await db.update(users).set({ onboardingCompleted: true }).where(eq(users.id, userId));

    res.json(result[0] || result);
  }));

  // Get user's quiz responses and recommendations
  app.get('/api/onboarding/quiz', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const result = await db.select().from(quizResponses).where(eq(quizResponses.userId, userId)).limit(1);
    res.json(result[0] || null);
  }));

  // Get smart next experience recommendation based on progress
  app.get('/api/recommendations/next', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    // Get user's quiz responses
    const quizResult = await db.select().from(quizResponses).where(eq(quizResponses.userId, userId)).limit(1);
    const quizData = quizResult[0];
    
    if (!quizData?.recommendedExperiences?.length) {
      return res.json(null);
    }

    // Get all recommended experiences for this user
    const recommendedSlugs = quizData.recommendedExperiences as string[];
    
    // Get their progress on these experiences
    const allExps = await storage.getAllExperiences();
    const recommendedExps = allExps.filter(exp => recommendedSlugs.includes(exp.slug));
    
    // Find completed experiences
    const completedExp = await db.select().from(experienceProgress).where(eq(experienceProgress.userId, userId));
    
    const completedExpIds = new Set(completedExp.filter((p: any) => p.completedAt).map((p: any) => p.experienceId));
    
    // Find first incomplete recommended experience
    const nextExp = recommendedExps.find(exp => !completedExpIds.has(exp.id));
    
    if (!nextExp) {
      return res.json(null);
    }

    const reasons: Record<string, string> = {
      master_ai: "Build on your AI foundations with practical applications",
      build_web3: "Deepen your Web3 knowledge with hands-on projects",
      own_authority: "Strengthen your thought leadership positioning",
      advance_career: "Level up your professional capabilities",
    };

    const difficultyMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
      free: "beginner",
      pro: "intermediate",
      vip: "advanced",
    };

    res.json({
      id: nextExp.id,
      title: nextExp.title,
      slug: nextExp.slug,
      description: nextExp.description,
      estimatedMinutes: nextExp.estimatedMinutes,
      difficulty: difficultyMap[nextExp.tier] || "intermediate",
      reason: reasons[quizData.goal as keyof typeof reasons] || "Continue your learning journey",
    });
  }));

  // ===== LEARNING HUB (AI MASTERY PROGRAM) =====

  // Get user's enrollment and module progress
  app.get('/api/learning-hub/progress', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    const enrollment = await db.select().from(aiMasteryEnrollment).where(eq(aiMasteryEnrollment.userId, userId)).limit(1);
    const modules = await db.select().from(aiMasteryModuleProgress).where(eq(aiMasteryModuleProgress.userId, userId));
    
    res.json({
      enrollment: enrollment[0] || null,
      modules: modules || []
    });
  }));

  // Get all live sessions
  app.get('/api/learning-hub/sessions', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const sessions = await db.select().from(liveSessions).orderBy(liveSessions.startTime).limit(20);
    res.json(sessions);
  }));

  // Get community activity feed
  app.get('/api/learning-hub/community/activity', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const activities = await db.select().from(communityActivity).orderBy(communityActivity.createdAt).limit(20);
    res.json(activities);
  }));

  // Update module progress
  app.post('/api/learning-hub/progress/update', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { moduleId, lessonsCompleted, totalLessons, isUnlocked } = req.body;
    
    const { and } = await import('drizzle-orm');
    const existing = await db.select().from(aiMasteryModuleProgress)
      .where(and(eq(aiMasteryModuleProgress.userId, userId), eq(aiMasteryModuleProgress.moduleId, moduleId)));
    
    if (existing.length > 0) {
      const updated = await db.update(aiMasteryModuleProgress)
        .set({ lessonsCompleted, isUnlocked })
        .where(eq(aiMasteryModuleProgress.id, existing[0].id))
        .returning();
      res.json(updated[0]);
    } else {
      const created = await db.insert(aiMasteryModuleProgress)
        .values({ userId, moduleId, lessonsCompleted, totalLessons, isUnlocked })
        .returning();
      res.json(created[0]);
    }
  }));

  // Get messages with Nadia
  app.get('/api/learning-hub/messages', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const messages = await db.select().from(aiMasteryMessages)
      .where(eq(aiMasteryMessages.userId, userId))
      .orderBy(aiMasteryMessages.createdAt);
    res.json(messages);
  }));

  // Send message to Nadia
  app.post('/api/learning-hub/messages', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content required' });
    }
    
    const message = await db.insert(aiMasteryMessages)
      .values({ userId, senderType: 'user', content })
      .returning();
    
    res.json(message[0]);
  }));

  // ===== ANALYTICS & EVENTS =====
  // Track user events (for sponsored ads attribution & engagement)
  app.post('/api/events/track', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { eventType, eventName, properties, adCampaignId, source } = req.body;
    
    const event = await db.insert(userEvents)
      .values({ userId, eventType, eventName, properties, adCampaignId, source })
      .returning();
    
    res.json(event[0]);
  }));

  // Get user's event history
  app.get('/api/events/history', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const events = await db.select().from(userEvents)
      .where(eq(userEvents.userId, userId))
      .orderBy(desc(userEvents.createdAt))
      .limit(50);
    
    res.json(events);
  }));

  // Get analytics funnel (signup → purchase → engagement)
  app.get('/api/analytics/funnel', asyncHandler(async (_req: Request, res) => {
    const signups = await db.select().from(userEvents)
      .where(eq(userEvents.eventType, 'signup'));
    
    const purchases = await db.select().from(userEvents)
      .where(eq(userEvents.eventType, 'purchase'));
    
    const engagements = await db.select().from(userEvents)
      .where(eq(userEvents.eventType, 'ritual_complete'));
    
    res.json({
      signups: signups.length,
      purchases: purchases.length,
      purchaseRate: ((purchases.length / signups.length) * 100).toFixed(2) + '%',
      engagements: engagements.length,
      engagementRate: ((engagements.length / purchases.length) * 100).toFixed(2) + '%'
    });
  }));

  // ===== SPONSORED ADS =====
  // Get active ads for placement
  app.get('/api/ads/active', asyncHandler(async (req: Request, res) => {
    const placement = req.query.placement as string || 'dashboard_hero';
    
    const ads = await db.select().from(sponsoredAds)
      .where(and(
        eq(sponsoredAds.isActive, true),
        eq(sponsoredAds.placementType, placement)
      ))
      .limit(3);
    
    res.json(ads);
  }));

  // Track ad impression
  app.post('/api/ads/impression', asyncHandler(async (req: Request, res) => {
    const { adId, userId } = req.body;
    
    await db.update(sponsoredAds)
      .set({ impressions: sql`${sponsoredAds.impressions} + 1` })
      .where(eq(sponsoredAds.id, adId));
    
    if (userId) {
      await db.insert(userEvents)
        .values({ userId, eventType: 'ad_impression', eventName: 'ad_impression', adCampaignId: adId });
    }
    
    res.json({ success: true });
  }));

  // Track ad click
  app.post('/api/ads/click', asyncHandler(async (req: Request, res) => {
    const { adId, userId } = req.body;
    
    await db.update(sponsoredAds)
      .set({ clicks: sql`${sponsoredAds.clicks} + 1` })
      .where(eq(sponsoredAds.id, adId));
    
    if (userId) {
      await db.insert(userEvents)
        .values({ userId, eventType: 'ad_click', eventName: 'ad_click', adCampaignId: adId });
    }
    
    res.json({ success: true });
  }));

  // Admin: Create sponsored ad
  app.post('/api/admin/ads/create', isAuthenticated, isAdmin, asyncHandler(async (req: Request, res) => {
    const { campaignId, title, description, imageUrl, ctaUrl, placementType, dailyBudget } = req.body;
    
    const ad = await db.insert(sponsoredAds)
      .values({ campaignId, title, description, imageUrl, ctaUrl, placementType, dailyBudget })
      .returning();
    
    res.json(ad[0]);
  }));

  // ===== VISION BOARD 2026 =====
  
  // Get user's vision board for a specific year
  app.get('/api/vision-board/:year', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const year = parseInt(req.params.year);
    
    const board = await db.select()
      .from(visionBoards)
      .where(and(eq(visionBoards.userId, userId), eq(visionBoards.year, year)))
      .limit(1);
    
    if (board.length === 0) {
      return res.json(null);
    }
    
    // Get tiles for this board
    const tiles = await db.select()
      .from(visionTiles)
      .where(eq(visionTiles.boardId, board[0].id))
      .orderBy(visionTiles.position);
    
    res.json({ board: board[0], tiles });
  }));
  
  // Create or update vision board
  app.post('/api/vision-board', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    const { year, coreWord, futureSelfMessage, focusDimensions, status } = req.body;
    
    // Check if board exists
    const existing = await db.select()
      .from(visionBoards)
      .where(and(eq(visionBoards.userId, userId), eq(visionBoards.year, year || 2026)))
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing board
      const updated = await db.update(visionBoards)
        .set({ 
          coreWord: coreWord || existing[0].coreWord,
          futureSelfMessage: futureSelfMessage || existing[0].futureSelfMessage,
          focusDimensions: focusDimensions || existing[0].focusDimensions,
          status: status || existing[0].status,
          updatedAt: new Date()
        })
        .where(eq(visionBoards.id, existing[0].id))
        .returning();
      
      return res.json(updated[0]);
    }
    
    // Create new board
    const newBoard = await db.insert(visionBoards)
      .values({
        userId,
        year: year || 2026,
        coreWord,
        futureSelfMessage,
        focusDimensions: focusDimensions || [],
        status: status || "draft"
      })
      .returning();
    
    res.json(newBoard[0]);
  }));
  
  // Generate AI vision tiles based on user's intentions
  app.post('/api/vision-board/:boardId/generate-tiles', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { boardId } = req.params;
    
    // Get the board
    const board = await db.select()
      .from(visionBoards)
      .where(and(eq(visionBoards.id, boardId), eq(visionBoards.userId, userId)))
      .limit(1);
    
    if (board.length === 0) {
      throw new NotFoundError("Vision board not found");
    }
    
    const { coreWord, futureSelfMessage, focusDimensions } = board[0];
    
    if (!focusDimensions || focusDimensions.length === 0) {
      throw new ValidationError("Please select at least one focus dimension");
    }
    
    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Generate tiles for each dimension
    const generatedTiles = [];
    
    for (let i = 0; i < focusDimensions.length; i++) {
      const dimension = focusDimensions[i];
      
      const prompt = `You are an empowering life coach helping a woman create her vision board for 2026.

Her core word for the year is: "${coreWord}"
Her message from her future self: "${futureSelfMessage || 'Not provided'}"
Focus dimension: ${dimension}

Generate a vision tile with:
1. A powerful, specific title (3-6 words) that captures her goal in ${dimension}
2. An empowering affirmation (one sentence, present tense, starting with "I am" or "I have")
3. An image prompt for generating a beautiful, aspirational image (focus on aesthetic, mood, and visual elements - no text in image)

Respond in JSON format:
{
  "title": "...",
  "affirmation": "...",
  "imagePrompt": "..."
}`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });
        
        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          
          // Insert tile
          const tile = await db.insert(visionTiles)
            .values({
              boardId,
              dimension,
              title: parsed.title,
              affirmation: parsed.affirmation,
              imagePrompt: parsed.imagePrompt,
              isAiGenerated: true,
              position: i
            })
            .returning();
          
          generatedTiles.push(tile[0]);
        }
      } catch (error) {
        console.error(`Error generating tile for ${dimension}:`, error);
      }
    }
    
    // Update board status
    await db.update(visionBoards)
      .set({ status: "tiles_created", updatedAt: new Date() })
      .where(eq(visionBoards.id, boardId));
    
    res.json({ tiles: generatedTiles });
  }));
  
  // Update a vision tile
  app.patch('/api/vision-board/tile/:tileId', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { tileId } = req.params;
    const { title, affirmation, userNotes, imageUrl, position } = req.body;
    
    // Verify ownership
    const tile = await db.select()
      .from(visionTiles)
      .innerJoin(visionBoards, eq(visionTiles.boardId, visionBoards.id))
      .where(and(eq(visionTiles.id, tileId), eq(visionBoards.userId, userId)))
      .limit(1);
    
    if (tile.length === 0) {
      throw new NotFoundError("Vision tile not found");
    }
    
    const updated = await db.update(visionTiles)
      .set({
        ...(title && { title }),
        ...(affirmation && { affirmation }),
        ...(userNotes !== undefined && { userNotes }),
        ...(imageUrl && { imageUrl }),
        ...(position !== undefined && { position })
      })
      .where(eq(visionTiles.id, tileId))
      .returning();
    
    res.json(updated[0]);
  }));
  
  // Complete vision board
  app.post('/api/vision-board/:boardId/complete', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { boardId } = req.params;
    
    const updated = await db.update(visionBoards)
      .set({ 
        status: "complete", 
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(visionBoards.id, boardId), eq(visionBoards.userId, userId)))
      .returning();
    
    if (updated.length === 0) {
      throw new NotFoundError("Vision board not found");
    }
    
    res.json(updated[0]);
  }));
  
  // Get potential Vision Sisters (users with similar goals)
  app.get('/api/vision-board/:boardId/sisters', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { boardId } = req.params;
    
    // Get the user's board
    const board = await db.select()
      .from(visionBoards)
      .where(and(eq(visionBoards.id, boardId), eq(visionBoards.userId, userId)))
      .limit(1);
    
    if (board.length === 0) {
      throw new NotFoundError("Vision board not found");
    }
    
    const userDimensions = board[0].focusDimensions || [];
    
    // Find other public boards with overlapping dimensions
    const potentialMatches = await db.select({
      board: visionBoards,
      user: users
    })
      .from(visionBoards)
      .innerJoin(users, eq(visionBoards.userId, users.id))
      .where(and(
        eq(visionBoards.isPublic, true),
        eq(visionBoards.status, "complete"),
        sql`${visionBoards.userId} != ${userId}`
      ))
      .limit(10);
    
    // Calculate match scores
    const matches = potentialMatches.map(match => {
      const theirDimensions = (match.board.focusDimensions || []) as string[];
      const sharedDimensions = userDimensions.filter((d: string) => theirDimensions.includes(d));
      const matchScore = Math.round((sharedDimensions.length / Math.max(userDimensions.length, 1)) * 100);
      
      return {
        userId: match.user.id,
        firstName: match.user.firstName,
        coreWord: match.board.coreWord,
        sharedDimensions,
        matchScore
      };
    }).filter(m => m.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
    
    res.json(matches);
  }));

  // ===== AI DIGITAL AGENCY ROUTES =====
  const { startAgencySession } = await import("./lib/agencyOrchestrator");

  // Create a new business profile
  app.post('/api/agency/business', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { 
      businessName, brandStory, industry, targetAudience, products,
      colorPalette, aestheticPreferences, contentStyle, goals, platforms,
      competitorUrls, uniqueValueProp, idealClientProfile, brandVoice 
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ message: "Business name is required" });
    }

    const business = await storage.createAgencyBusiness({
      userId,
      businessName,
      brandStory,
      industry,
      targetAudience,
      products,
      colorPalette,
      aestheticPreferences,
      contentStyle,
      goals: goals || [],
      platforms: platforms || ['instagram'],
      competitorUrls: competitorUrls || [],
      uniqueValueProp,
      idealClientProfile,
      brandVoice,
    });

    res.json(business);
  }));

  // Get user's businesses
  app.get('/api/agency/businesses', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const businesses = await storage.getUserAgencyBusinesses(userId);
    res.json(businesses);
  }));

  // Get a specific business
  app.get('/api/agency/business/:id', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.id);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }
    
    res.json(business);
  }));

  // Update a business profile
  app.patch('/api/agency/business/:id', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.id);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const updated = await storage.updateAgencyBusiness(req.params.id, req.body);
    res.json(updated);
  }));

  // Start an agency session (runs multi-agent orchestration)
  app.post('/api/agency/session/start', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { businessId, sessionType } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    const business = await storage.getAgencyBusiness(businessId);
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const session = await startAgencySession(businessId, sessionType || 'full_package');
    res.json(session);
  }));

  // Get session status and progress
  app.get('/api/agency/session/:id', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const session = await storage.getAgencySession(req.params.id);
    if (!session) {
      throw new NotFoundError("Session not found");
    }

    const business = await storage.getAgencyBusiness(session.businessId);
    const userId = req.session!.userId as string;
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Session not found");
    }

    const tasks = await storage.getSessionTasks(session.id);
    res.json({ session, tasks });
  }));

  // Get all sessions for a business
  app.get('/api/agency/business/:businessId/sessions', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const sessions = await storage.getBusinessSessions(req.params.businessId);
    res.json(sessions);
  }));

  // Get strategies for a business
  app.get('/api/agency/business/:businessId/strategies', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const strategies = await storage.getBusinessStrategies(req.params.businessId);
    res.json(strategies);
  }));

  // Get a specific strategy
  app.get('/api/agency/strategy/:id', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const strategy = await storage.getAgencyStrategy(req.params.id);
    if (!strategy) {
      throw new NotFoundError("Strategy not found");
    }

    const business = await storage.getAgencyBusiness(strategy.businessId);
    const userId = req.session!.userId as string;
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Strategy not found");
    }

    res.json(strategy);
  }));

  // Get assets for a business (with optional filters)
  app.get('/api/agency/business/:businessId/assets', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const assetType = req.query.type as string | undefined;
    const platform = req.query.platform as string | undefined;
    const assets = await storage.getBusinessAssets(req.params.businessId, assetType, platform);
    res.json(assets);
  }));

  // Get session assets
  app.get('/api/agency/session/:sessionId/assets', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const session = await storage.getAgencySession(req.params.sessionId);
    if (!session) {
      throw new NotFoundError("Session not found");
    }

    const business = await storage.getAgencyBusiness(session.businessId);
    const userId = req.session!.userId as string;
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Session not found");
    }

    const assets = await storage.getSessionAssets(req.params.sessionId);
    res.json(assets);
  }));

  // Update an asset (approve, schedule, etc.)
  app.patch('/api/agency/asset/:id', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const { isApproved, scheduledFor, content, hook, cta, hashtags } = req.body;
    const updated = await storage.updateAgencyAsset(req.params.id, {
      isApproved,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      content,
      hook,
      cta,
      hashtags,
    });
    res.json(updated);
  }));

  // Get visual packages for a business
  app.get('/api/agency/business/:businessId/visuals', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const packages = await storage.getBusinessVisualPackages(req.params.businessId);
    res.json(packages);
  }));

  // Get schedules for a business
  app.get('/api/agency/business/:businessId/schedules', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const schedules = await storage.getBusinessSchedules(req.params.businessId);
    res.json(schedules);
  }));

  // Get analytics for a business
  app.get('/api/agency/business/:businessId/analytics', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const business = await storage.getAgencyBusiness(req.params.businessId);
    
    if (!business || business.userId !== userId) {
      throw new NotFoundError("Business not found");
    }

    const platform = req.query.platform as string | undefined;
    const analytics = await storage.getBusinessAnalytics(req.params.businessId, platform);
    res.json(analytics);
  }));

  // ===== METAHERS VOYAGES API ROUTES =====

  // Get all voyages (public)
  app.get('/api/voyages', asyncHandler(async (req: Request, res) => {
    const category = req.query.category as string | undefined;
    const status = req.query.status as string || 'upcoming';
    
    let query = db.select().from(voyages).orderBy(voyages.date);
    
    const allVoyages = await query;
    
    // Filter in JS for simplicity
    let filtered = allVoyages;
    if (category && category !== 'all') {
      filtered = filtered.filter(v => v.category === category);
    }
    if (status) {
      filtered = filtered.filter(v => v.status === status);
    }
    
    res.json(filtered);
  }));

  // Get single voyage by slug (public)
  app.get('/api/voyages/:slug', asyncHandler(async (req: Request, res) => {
    const { slug } = req.params;
    
    const voyage = await db.select().from(voyages).where(eq(voyages.slug, slug)).limit(1);
    
    if (!voyage || voyage.length === 0) {
      throw new NotFoundError("Voyage not found");
    }
    
    res.json(voyage[0]);
  }));

  // Create Stripe checkout session for voyage booking
  app.post('/api/voyages/checkout', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { voyageId, promoCode } = req.body;
    
    if (!voyageId) {
      throw new ValidationError("Voyage ID is required");
    }
    
    // Get voyage details
    const voyage = await db.select().from(voyages).where(eq(voyages.id, voyageId)).limit(1);
    if (!voyage || voyage.length === 0) {
      throw new NotFoundError("Voyage not found");
    }
    
    const voyageData = voyage[0];
    
    // Check capacity
    if (voyageData.currentBookings >= voyageData.maxCapacity) {
      throw new ValidationError("This voyage is full. Please join the waitlist.");
    }
    
    // Get user email
    const user = await storage.getUser(userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    
    // Generate confirmation code
    const confirmationCode = `MHV-${randomBytes(3).toString('hex').toUpperCase()}`;
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: voyageData.title,
              description: `${voyageData.venueType.replace('_', ' ')} Experience - ${voyageData.location}`,
              images: voyageData.heroImage ? [voyageData.heroImage] : [],
            },
            unit_amount: voyageData.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        voyageId,
        userId,
        confirmationCode,
        type: 'voyage_booking',
      },
      success_url: `${req.headers.origin}/voyages/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/voyages/${voyageData.slug}`,
    });
    
    // Create pending booking
    await db.insert(voyageBookings).values({
      userId,
      voyageId,
      status: 'pending',
      paymentStatus: 'pending',
      stripeSessionId: session.id,
      amount: voyageData.price,
      confirmationCode,
      promoCode: promoCode || null,
    });
    
    res.json({ url: session.url, sessionId: session.id });
  }));

  // Stripe webhook for voyage bookings
  app.post('/api/voyages/webhook', asyncHandler(async (req: Request, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.metadata?.type === 'voyage_booking') {
        const { voyageId, userId, confirmationCode } = session.metadata;
        
        // Update booking status
        await db.update(voyageBookings)
          .set({
            status: 'confirmed',
            paymentStatus: 'paid',
            stripePaymentIntentId: session.payment_intent as string,
            updatedAt: new Date(),
          })
          .where(eq(voyageBookings.stripeSessionId, session.id));
        
        // Increment voyage bookings count
        await db.update(voyages)
          .set({
            currentBookings: sql`${voyages.currentBookings} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(voyages.id, voyageId));
        
        // Check if voyage is now full
        const updatedVoyage = await db.select().from(voyages).where(eq(voyages.id, voyageId)).limit(1);
        if (updatedVoyage[0] && updatedVoyage[0].currentBookings >= updatedVoyage[0].maxCapacity) {
          await db.update(voyages)
            .set({ status: 'full', updatedAt: new Date() })
            .where(eq(voyages.id, voyageId));
        }
        
        // Create preparation checklist
        const booking = await db.select().from(voyageBookings)
          .where(eq(voyageBookings.stripeSessionId, session.id)).limit(1);
        
        if (booking[0]) {
          await db.insert(voyagePreparation).values({
            bookingId: booking[0].id,
            userId,
          });
        }
        
        // TODO: Send confirmation email via Resend
        console.log(`Voyage booking confirmed: ${confirmationCode}`);
      }
    }
    
    res.json({ received: true });
  }));

  // Join voyage waitlist (public with email)
  app.post('/api/voyages/waitlist', asyncHandler(async (req: Request, res) => {
    const { voyageId, email, name, phone } = req.body;
    const userId = req.session?.userId as string | undefined;
    
    if (!voyageId || !email) {
      throw new ValidationError("Voyage ID and email are required");
    }
    
    // Check if already on waitlist
    const existing = await db.select().from(voyageWaitlist)
      .where(and(
        eq(voyageWaitlist.voyageId, voyageId),
        eq(voyageWaitlist.email, email)
      )).limit(1);
    
    if (existing.length > 0) {
      res.json({ message: "You're already on the waitlist!", alreadyExists: true });
      return;
    }
    
    // Get current position
    const currentWaitlist = await db.select().from(voyageWaitlist)
      .where(eq(voyageWaitlist.voyageId, voyageId));
    const position = currentWaitlist.length + 1;
    
    await db.insert(voyageWaitlist).values({
      voyageId,
      email: sanitizeText(email),
      name: name ? sanitizeText(name) : null,
      phone: phone ? sanitizeText(phone) : null,
      userId: userId || null,
      position,
    });
    
    res.json({ message: "You've joined the waitlist!", position });
  }));

  // Submit voyage invitation request (requires authentication)
  app.post('/api/voyages/invitation-request', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { voyageId, message } = req.body;
    
    if (!voyageId) {
      throw new ValidationError("Voyage ID is required");
    }
    
    // Get user info for the request
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || user.length === 0) {
      throw new AuthenticationError("User not found");
    }
    
    // Check if already requested
    const existing = await db.select().from(voyageInvitationRequests)
      .where(and(
        eq(voyageInvitationRequests.voyageId, voyageId),
        eq(voyageInvitationRequests.userId, userId)
      )).limit(1);
    
    if (existing.length > 0) {
      res.json({ 
        message: "You've already submitted a request for this voyage!", 
        alreadyExists: true,
        status: existing[0].status
      });
      return;
    }
    
    // Get voyage details for email
    const voyage = await db.select().from(voyages).where(eq(voyages.id, voyageId)).limit(1);
    if (!voyage || voyage.length === 0) {
      throw new NotFoundError("Voyage not found");
    }
    
    // Create the invitation request
    const [newRequest] = await db.insert(voyageInvitationRequests).values({
      userId,
      voyageId,
      message: message ? sanitizeText(message) : null,
      userName: user[0].firstName && user[0].lastName 
        ? `${user[0].firstName} ${user[0].lastName}` 
        : user[0].firstName || null,
      userEmail: user[0].email,
      status: 'pending',
    }).returning();
    
    // Send email notification to admin
    try {
      const resendClient = await getUncachableResendClient();
      if (resendClient) {
        await resendClient.client.emails.send({
          from: resendClient.fromEmail,
          to: 'melissa@metahers.ai', // Admin email
          subject: `New Voyage Invitation Request: ${voyage[0].title}`,
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0B14; color: #fff; padding: 32px; border-radius: 16px;">
              <h1 style="color: #E879F9; margin-bottom: 24px;">New Invitation Request</h1>
              
              <div style="background: rgba(232, 121, 249, 0.1); border: 1px solid rgba(232, 121, 249, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #fff; margin: 0 0 8px 0; font-size: 18px;">${voyage[0].title}</h2>
                <p style="color: #9CA3AF; margin: 0;">${new Date(voyage[0].date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #D8BFD8; margin: 0 0 16px 0;">Requester Details</h3>
                <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${newRequest.userName || 'Not provided'}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${newRequest.userEmail}</p>
                ${message ? `<p style="margin: 16px 0 0 0;"><strong>Message:</strong><br/><span style="color: #9CA3AF;">"${message}"</span></p>` : ''}
              </div>
              
              <p style="color: #9CA3AF; font-size: 14px;">
                Review this request in your admin dashboard to approve or decline.
              </p>
            </div>
          `,
        });
        console.log(`Invitation request email sent for voyage: ${voyage[0].title}`);
      }
    } catch (emailError) {
      console.error('Failed to send invitation request email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ 
      message: "Your invitation request has been submitted! We'll be in touch soon.",
      requestId: newRequest.id,
      status: 'pending'
    });
  }));

  // Check user's invitation request status for a voyage
  app.get('/api/voyages/invitation-request/:voyageId', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { voyageId } = req.params;
    
    const request = await db.select().from(voyageInvitationRequests)
      .where(and(
        eq(voyageInvitationRequests.voyageId, voyageId),
        eq(voyageInvitationRequests.userId, userId)
      )).limit(1);
    
    if (request.length === 0) {
      res.json({ hasRequested: false });
      return;
    }
    
    res.json({ 
      hasRequested: true,
      status: request[0].status,
      createdAt: request[0].createdAt
    });
  }));

  // Get user's voyage bookings
  app.get('/api/voyages/my-bookings', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    const bookings = await db.select({
      booking: voyageBookings,
      voyage: voyages,
    })
    .from(voyageBookings)
    .innerJoin(voyages, eq(voyageBookings.voyageId, voyages.id))
    .where(eq(voyageBookings.userId, userId))
    .orderBy(desc(voyages.date));
    
    res.json(bookings);
  }));

  // Get user's upcoming voyage (for dashboard)
  app.get('/api/voyages/upcoming', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    const upcoming = await db.select({
      booking: voyageBookings,
      voyage: voyages,
    })
    .from(voyageBookings)
    .innerJoin(voyages, eq(voyageBookings.voyageId, voyages.id))
    .where(and(
      eq(voyageBookings.userId, userId),
      eq(voyageBookings.status, 'confirmed'),
      gte(voyages.date, new Date())
    ))
    .orderBy(voyages.date)
    .limit(1);
    
    res.json(upcoming[0] || null);
  }));

  // Get preparation checklist
  app.get('/api/voyages/preparation/:bookingId', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { bookingId } = req.params;
    
    const prep = await db.select().from(voyagePreparation)
      .where(and(
        eq(voyagePreparation.bookingId, bookingId),
        eq(voyagePreparation.userId, userId)
      )).limit(1);
    
    if (!prep || prep.length === 0) {
      throw new NotFoundError("Preparation checklist not found");
    }
    
    res.json(prep[0]);
  }));

  // Update preparation checklist
  app.patch('/api/voyages/preparation/:bookingId', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const { bookingId } = req.params;
    const updates = req.body;
    
    // Calculate completion percentage
    const checklistItems = [
      'watchedWelcomeVideo', 'completedQuestionnaire', 'joinedCommunity',
      'reviewedMaterials', 'confirmedAttendance', 'addedToCalendar', 'chargedDevices'
    ];
    const completed = checklistItems.filter(item => updates[item] === true).length;
    const completionPercentage = Math.round((completed / checklistItems.length) * 100);
    
    await db.update(voyagePreparation)
      .set({
        ...updates,
        completionPercentage,
        updatedAt: new Date(),
      })
      .where(and(
        eq(voyagePreparation.bookingId, bookingId),
        eq(voyagePreparation.userId, userId)
      ));
    
    const updated = await db.select().from(voyagePreparation)
      .where(eq(voyagePreparation.bookingId, bookingId)).limit(1);
    
    res.json(updated[0]);
  }));

  // Submit questionnaire
  app.post('/api/voyages/questionnaire', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    const {
      bookingId,
      techComfortLevel,
      currentTools,
      primaryGoal,
      specificTopics,
      biggestChallenge,
      businessType,
      industry,
      dietaryRestrictions,
      accessibilityNeeds,
      howHeardAboutUs,
      referredBy,
    } = req.body;
    
    if (!bookingId || !techComfortLevel || !primaryGoal) {
      throw new ValidationError("Required fields are missing");
    }
    
    // Check booking belongs to user
    const booking = await db.select().from(voyageBookings)
      .where(and(
        eq(voyageBookings.id, bookingId),
        eq(voyageBookings.userId, userId)
      )).limit(1);
    
    if (!booking || booking.length === 0) {
      throw new NotFoundError("Booking not found");
    }
    
    await db.insert(voyageQuestionnaires).values({
      bookingId,
      userId,
      techComfortLevel,
      currentTools: currentTools || [],
      primaryGoal: sanitizeText(primaryGoal),
      specificTopics: specificTopics ? sanitizeText(specificTopics) : null,
      biggestChallenge: biggestChallenge ? sanitizeText(biggestChallenge) : null,
      businessType: businessType || null,
      industry: industry || null,
      dietaryRestrictions: dietaryRestrictions ? sanitizeText(dietaryRestrictions) : null,
      accessibilityNeeds: accessibilityNeeds ? sanitizeText(accessibilityNeeds) : null,
      howHeardAboutUs: howHeardAboutUs || null,
      referredBy: referredBy ? sanitizeText(referredBy) : null,
    });
    
    // Update preparation checklist
    await db.update(voyagePreparation)
      .set({ completedQuestionnaire: true, updatedAt: new Date() })
      .where(eq(voyagePreparation.bookingId, bookingId));
    
    res.json({ success: true, message: "Questionnaire submitted!" });
  }));

  // Get referral code for user
  app.get('/api/voyages/referral', isAuthenticated, asyncHandler(async (req: Request, res) => {
    const userId = req.session!.userId as string;
    
    let referral = await db.select().from(voyageReferrals)
      .where(eq(voyageReferrals.referrerId, userId)).limit(1);
    
    if (!referral || referral.length === 0) {
      // Create a referral code
      const user = await storage.getUser(userId);
      const firstName = user?.firstName || 'VOYAGER';
      const code = `${firstName.toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
      
      await db.insert(voyageReferrals).values({
        referrerId: userId,
        referralCode: code,
      });
      
      referral = await db.select().from(voyageReferrals)
        .where(eq(voyageReferrals.referrerId, userId)).limit(1);
    }
    
    res.json(referral[0]);
  }));

  // Get voyage testimonials
  app.get('/api/voyages/testimonials', asyncHandler(async (req: Request, res) => {
    const voyageId = req.query.voyageId as string | undefined;
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === 'true';
    
    let allTestimonials = await db.select().from(voyageTestimonials)
      .where(eq(voyageTestimonials.isApproved, true))
      .orderBy(desc(voyageTestimonials.createdAt));
    
    if (voyageId) {
      allTestimonials = allTestimonials.filter(t => t.voyageId === voyageId);
    }
    if (category) {
      allTestimonials = allTestimonials.filter(t => t.category === category);
    }
    if (featured) {
      allTestimonials = allTestimonials.filter(t => t.isFeatured);
    }
    
    res.json(allTestimonials);
  }));

  const httpServer = createServer(app);
  return httpServer;
}
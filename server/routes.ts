import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Extend Express Request to include user claims
interface AuthRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // ===== AUTH ROUTES =====
  app.get('/api/auth/user', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
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

  // ===== RITUAL PROGRESS ROUTES =====
  app.get('/api/rituals/:slug/progress', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
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

  app.post('/api/rituals/:slug/progress', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
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

  // ===== JOURNAL ROUTES =====
  app.get('/api/journal', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const entry = await storage.getLatestJournalEntry(userId);
      
      if (!entry) {
        return res.json({ content: "", lastSaved: new Date().toISOString(), streak: 0 });
      }
      
      res.json({
        content: entry.content,
        lastSaved: entry.lastSaved?.toISOString(),
        streak: entry.streak,
      });
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  app.post('/api/journal', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { content, streak } = req.body;

      const entry = await storage.upsertJournalEntry({
        userId,
        content,
        streak: streak || 0,
      });

      res.json({
        content: entry.content,
        lastSaved: entry.lastSaved?.toISOString(),
        streak: entry.streak,
      });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  // ===== STATS ROUTE =====
  app.get('/api/stats', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      
      const allProgress = await storage.getAllUserRitualProgress(userId);
      const journalEntry = await storage.getLatestJournalEntry(userId);

      const totalRituals = allProgress.length;
      const completedRituals = allProgress.filter(p => p.completedSteps.length > 0).length;
      const journalEntries = journalEntry && journalEntry.content.trim().length > 0 ? 1 : 0;
      const streak = journalEntry?.streak || 0;

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

  const httpServer = createServer(app);
  return httpServer;
}

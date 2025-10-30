import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isProUser, hashPassword, verifyPassword } from "./auth";
import Stripe from "stripe";
import { generateJournalPrompt, analyzeJournalEntry, chatWithJournalCoach, generateThoughtLeadershipContent } from "./aiService";
import { fetchNewsByCategory, type NewsCategory } from "./rssNewsService";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoints for deployment
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Setup authentication middleware
  await setupAuth(app);

  // ===== AUTH ROUTES =====
  
  // Signup endpoint
  app.post('/api/auth/signup', async (req, res) => {
    try {
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
      
      res.status(201).json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  
  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Set up session
      req.session!.userId = user.id;
      
      res.json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout endpoint
  app.post('/api/auth/logout', async (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Logout failed" });
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
        return res.json({ success: true, message: "If an account exists with that email, a password reset link has been generated." });
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
      
      // In production, send an email here with the reset link
      // For development/testing, log the reset link to server console
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
      console.log(`\n🔐 Password Reset Link (DEV ONLY): ${resetLink}\n`);
      
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

  // ===== QUIZ ROUTES =====
  
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
  app.patch('/api/admin/quiz-submissions/:id', isAuthenticated, async (req: Request, res) => {
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

  // ===== JOURNAL ROUTES =====
  // List journal entries for a month (for calendar view)
  app.get('/api/journal/list', isAuthenticated, async (req: Request, res) => {
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

  app.get('/api/journal', isAuthenticated, async (req: Request, res) => {
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

  app.post('/api/journal', isAuthenticated, async (req: Request, res) => {
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
      const finalContent = content || "";

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
        structuredContent,
        streak: streak || 0,
        mood,
        tags,
        wordCount,
        aiInsights,
        aiPrompt,
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
  app.get('/api/journal/prompt', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const user = await storage.getUser(userId);
      
      if (!user?.isPro) {
        return res.status(403).json({ message: "This feature requires a Pro subscription" });
      }
      
      const ritualContext = req.query.ritual as string | undefined;
      
      // Get recent entries for context
      const recentEntries = await storage.getRecentJournalEntries(userId, 3);
      const previousEntries = recentEntries.map((e: { content: string }) => e.content.substring(0, 100));
      
      const prompt = await generateJournalPrompt(ritualContext, previousEntries);
      res.json({ prompt });
    } catch (error) {
      console.error("Error generating prompt:", error);
      res.status(500).json({ message: "Failed to generate prompt" });
    }
  });

  // AI Journal Analysis (Pro only)
  app.post('/api/journal/analyze', isAuthenticated, async (req: Request, res) => {
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

  // ===== STATS ROUTE =====
  app.get('/api/stats', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      
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

  // ===== NEWS ROUTES (Public) =====
  
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

  // ===== THOUGHT LEADERSHIP JOURNEY ROUTES (PRO-ONLY) =====

  // Get user's journey progress
  app.get('/api/thought-leadership/progress', isProUser, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const progress = await storage.getThoughtLeadershipProgress(userId);
      
      if (!progress) {
        // Create initial progress for new user
        const newProgress = await storage.createThoughtLeadershipProgress({
          userId,
          currentDay: 1,
          completedDays: [],
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

  // Generate new content for current day
  app.post('/api/thought-leadership/generate', isProUser, async (req: Request, res) => {
    try {
      const userId = req.session!.userId!;
      const { niche, dayNumber } = req.body;

      // Get previous topics to avoid repetition
      const recentPosts = await storage.getThoughtLeadershipPostsByUser(userId, 7);
      const previousTopics = recentPosts.map(p => p.topic);

      // Generate content using AI
      const content = await generateThoughtLeadershipContent(
        niche || "AI and Web3",
        dayNumber || 1,
        previousTopics
      );

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
        });
      }
      const actualDayNumber = progress.currentDay;

      // Save as draft
      const post = await storage.createThoughtLeadershipPost({
        userId,
        dayNumber: actualDayNumber,
        topic: content.topic,
        contentLong: content.contentLong,
        contentMedium: content.contentMedium,
        contentShort: content.contentShort,
        status: 'draft',
        publishedToMetaHers: false,
        publishedToExternal: false,
        externalPlatforms: [],
        isPublic: false,
      });

      // Update progress - mark day as completed and advance
      if (progress) {
        const today = new Date().toISOString().split('T')[0];
        const completedDays = [...progress.completedDays, actualDayNumber].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
        
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

        await storage.updateThoughtLeadershipProgress(userId, {
          currentDay: nextDay,
          completedDays,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, progress.longestStreak),
          totalPostsGenerated: progress.totalPostsGenerated + 1,
          lastActivityDate: today,
          journeyStatus: completedDays.length >= 30 ? 'completed' : 'active',
          completedAt: completedDays.length >= 30 ? new Date() : undefined,
          updatedAt: new Date(),
        });
      }

      res.json(post);
    } catch (error) {
      console.error('Error generating TL content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Failed to generate content', error: errorMessage });
    }
  });

  // Save or update a post
  app.patch('/api/thought-leadership/posts/:id', isProUser, async (req: Request, res) => {
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
  app.post('/api/thought-leadership/posts/:id/publish', isProUser, async (req: Request, res) => {
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
  app.get('/api/thought-leadership/posts', isProUser, async (req: Request, res) => {
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
  app.get('/api/thought-leadership/posts/:id', isProUser, async (req: Request, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}

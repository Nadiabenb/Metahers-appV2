import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, verifyPassword } from "./auth";
import Stripe from "stripe";
import { generateJournalPrompt, analyzeJournalEntry, chatWithJournalCoach } from "./aiService";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // ===== AUTH ROUTES =====
  
  // Signup endpoint
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
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
      
      // Hash password and create user
      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
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
  app.get('/api/journal', isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session!.userId as string;
      const entry = await storage.getLatestJournalEntry(userId);
      
      if (!entry) {
        return res.json({ 
          content: "", 
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
        content: z.string(),
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

      const { content, streak, mood, tags, aiPrompt } = validation.data;

      // Calculate word count (filter empty tokens)
      const wordCount = content.trim() === "" 
        ? 0 
        : content.trim().split(/\s+/).filter(w => w.length > 0).length;

      // Generate AI insights if content is substantial (Pro only)
      let aiInsights = undefined;
      const user = await storage.getUser(userId);
      if (content.trim().length > 50 && user?.isPro) {
        try {
          aiInsights = await analyzeJournalEntry(content);
        } catch (error) {
          console.error("Error generating AI insights:", error);
        }
      }

      const entry = await storage.upsertJournalEntry({
        userId,
        content,
        streak: streak || 0,
        mood,
        tags,
        wordCount,
        aiInsights,
        aiPrompt,
      });

      res.json({
        content: entry.content,
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

  const httpServer = createServer(app);
  return httpServer;
}

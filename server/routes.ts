import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isProUser, isSanctuaryMember, isInnerCircleMember, isFoundersCircleMember, hashPassword, verifyPassword } from "./auth";
import Stripe from "stripe";
import { Resend } from "resend";
import OpenAI from "openai";
import { generateJournalPrompt, analyzeJournalEntry, chatWithJournalCoach, generateThoughtLeadershipContent } from "./aiService";
import { fetchNewsByCategory, type NewsCategory } from "./rssNewsService";
import { z } from "zod";
import { CURRICULUM } from "@shared/curriculum";
import { db } from "./db";
import { spaces, transformationalExperiences } from "@shared/schema";
import { sql as drizzleSql } from "drizzle-orm";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Resend email client (using Replit-managed connection)
let connectionSettings: any;

async function getResendCredentials() {
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
          await resendClient.client.emails.send({
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
        
          console.log(`✅ Password reset email sent to ${email}`);
        } catch (emailError) {
          console.error("Error sending password reset email:", emailError);
          // Don't fail the request if email fails - token is still valid
          // User can contact support if they don't receive the email
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

  // ===== METAHERS WORLD SPACES ROUTES =====
  app.get('/api/spaces', async (_req: Request, res) => {
    try {
      const spaces = await storage.getSpaces();
      res.json(spaces);
    } catch (error) {
      console.error("Error fetching spaces:", error);
      res.status(500).json({ message: "Failed to fetch spaces" });
    }
  });

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
      const experiences = await storage.getExperiencesBySpace(spaceId);
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // GET single experience by slug
  app.get('/api/experiences/:slug', async (req: Request, res) => {
    try {
      const { slug } = req.params;
      const experience = await storage.getExperienceBySlug(slug);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.json(experience);
    } catch (error) {
      console.error("Error fetching experience:", error);
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.get('/api/experiences/:id', async (req: Request, res) => {
    try {
      const { id } = req.params;
      const experience = await storage.getExperienceById(id);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.json(experience);
    } catch (error) {
      console.error("Error fetching experience:", error);
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  // GET all experiences (for progress dashboard)
  app.get('/api/experiences/all', async (_req: Request, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching all experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
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
  // Get curriculum (all 30 days)
  app.get('/api/thought-leadership/curriculum', isProUser, async (_req: Request, res) => {
    res.json(CURRICULUM);
  });

  // Get specific curriculum day
  app.get('/api/thought-leadership/curriculum/:day', isProUser, async (req: Request, res) => {
    const day = parseInt(req.params.day);
    const curriculumDay = CURRICULUM.find(d => d.day === day);
    
    if (!curriculumDay) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    res.json(curriculumDay);
  });

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
  app.put('/api/thought-leadership/brand-profile', isProUser, async (req: Request, res) => {
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
  app.post('/api/thought-leadership/generate', isProUser, async (req: Request, res) => {
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

        // Only advance progress if this is the current day AND we're creating a new post
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

  // ===== MEMBERSHIP TIER ROUTES =====
  
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
  app.post('/api/admin/populate-database', async (_req: Request, res) => {
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
        }
      ];

      const experiencesData = [
        {
          id: 'ai-1-foundations',
          spaceId: 'ai',
          title: 'AI Essentials',
          slug: 'ai-essentials',
          description: 'Understand AI, machine learning, and how to use these tools to multiply your productivity and creativity.',
          learningObjectives: ['Explain AI and machine learning clearly', 'Identify AI tools for your workflow', 'Start using AI ethically and effectively'],
          tier: 'free' as const,
          estimatedMinutes: 20,
          sortOrder: 1,
          content: { sections: [{ id: 'ai-intro', type: 'text', title: 'AI Demystified', content: 'AI isn\'t magic - it\'s a powerful tool you can master.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'ai-2-chatgpt',
          spaceId: 'ai',
          title: 'Master ChatGPT & Custom GPTs',
          slug: 'master-chatgpt',
          description: 'Go beyond basic prompts. Create custom GPTs, build AI assistants, and automate your workflow.',
          learningObjectives: ['Write advanced prompts that get results', 'Build your first custom GPT', 'Automate repetitive tasks with AI'],
          tier: 'pro' as const,
          estimatedMinutes: 35,
          sortOrder: 2,
          content: { sections: [{ id: 'prompting', type: 'interactive', title: 'Prompt Engineering Mastery', content: 'The art and science of talking to AI.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'ai-3-content',
          spaceId: 'ai',
          title: 'AI-Powered Content Creation',
          slug: 'ai-content-creation',
          description: 'Create blog posts, social media, newsletters, and more - faster and better than ever with AI as your co-pilot.',
          learningObjectives: ['Generate high-quality content with AI', 'Maintain your unique voice and style', 'Build a content system that scales'],
          tier: 'pro' as const,
          estimatedMinutes: 30,
          sortOrder: 3,
          content: { sections: [{ id: 'content-intro', type: 'text', title: 'AI as Your Content Partner', content: 'Create more, stress less - AI handles the heavy lifting.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'ai-4-automation',
          spaceId: 'ai',
          title: 'AI Automation & Workflows',
          slug: 'ai-automation',
          description: 'Connect AI tools to automate your business processes. From email to social media to client onboarding.',
          learningObjectives: ['Map your automation opportunities', 'Connect AI tools with no-code platforms', 'Build workflows that run on autopilot'],
          tier: 'pro' as const,
          estimatedMinutes: 40,
          sortOrder: 4,
          content: { sections: [{ id: 'automation-intro', type: 'text', title: 'Automation Foundations', content: 'Work smarter, not harder - let AI handle the busywork.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'ai-5-image-gen',
          spaceId: 'ai',
          title: 'AI Image & Video Generation',
          slug: 'ai-image-video',
          description: 'Create stunning visuals with Midjourney, DALL-E, and AI video tools. Design like a pro, no design skills required.',
          learningObjectives: ['Generate professional images with AI', 'Create video content faster', 'Build a visual content library'],
          tier: 'pro' as const,
          estimatedMinutes: 35,
          sortOrder: 5,
          content: { sections: [{ id: 'image-gen', type: 'interactive', title: 'AI Visual Creation', content: 'Turn your ideas into stunning visuals instantly.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'ai-6-product',
          spaceId: 'ai',
          title: 'Build Your AI-Powered Product',
          slug: 'build-ai-product',
          description: 'Launch an AI tool, service, or product. From idea to MVP - ship something people will pay for.',
          learningObjectives: ['Validate your AI product idea', 'Build an MVP with no-code tools', 'Launch and get your first customers'],
          tier: 'pro' as const,
          estimatedMinutes: 60,
          sortOrder: 6,
          content: { sections: [{ id: 'product-planning', type: 'hands_on_lab', title: 'AI Product Strategy', content: 'Time to build and ship your AI product.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'branding-1-strategy',
          spaceId: 'branding',
          title: 'AI Branding Fundamentals',
          slug: 'ai-branding-fundamentals',
          description: 'Build a powerful brand with AI tools. From positioning to messaging to visual identity.',
          learningObjectives: ['Define your brand strategy with AI', 'Create compelling brand messaging', 'Position yourself in the market'],
          tier: 'free' as const,
          estimatedMinutes: 25,
          sortOrder: 1,
          content: { sections: [{ id: 'branding-intro', type: 'text', title: 'Brand Strategy with AI', content: 'Build a brand that stands out with AI power.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'branding-2-content',
          spaceId: 'branding',
          title: 'AI Content Strategy',
          slug: 'ai-content-strategy',
          description: 'Create a content system that builds your brand on autopilot. Blog, social, email, and more.',
          learningObjectives: ['Build your AI content engine', 'Create content pillars and calendars', 'Maintain consistency across platforms'],
          tier: 'pro' as const,
          estimatedMinutes: 35,
          sortOrder: 2,
          content: { sections: [{ id: 'content-strategy', type: 'interactive', title: 'Content System Building', content: 'Create content that builds your brand.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'branding-3-social',
          spaceId: 'branding',
          title: 'AI-Powered Social Media',
          slug: 'ai-social-media',
          description: 'Grow your audience with AI. Create engaging content, optimize posting, and build community.',
          learningObjectives: ['Generate social content with AI', 'Optimize posting times and frequency', 'Grow your following strategically'],
          tier: 'pro' as const,
          estimatedMinutes: 30,
          sortOrder: 3,
          content: { sections: [{ id: 'social-media', type: 'text', title: 'Social Media with AI', content: 'Grow your social presence efficiently.' }] },
          personalizationEnabled: true,
          isActive: true
        },
        {
          id: 'branding-4-thought-leadership',
          spaceId: 'branding',
          title: 'AI Thought Leadership',
          slug: 'ai-thought-leadership',
          description: 'Position yourself as an authority. Use AI to research, write, and publish thought leadership content.',
          learningObjectives: ['Develop your unique point of view', 'Create high-quality thought leadership', 'Build authority in your niche'],
          tier: 'pro' as const,
          estimatedMinutes: 40,
          sortOrder: 4,
          content: { sections: [{ id: 'thought-leadership', type: 'text', title: 'Becoming a Thought Leader', content: 'Build authority with AI-assisted content.' }] },
          personalizationEnabled: true,
          isActive: true
        }
      ];

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

  const httpServer = createServer(app);
  return httpServer;
}

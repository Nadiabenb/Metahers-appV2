import type { Express, Request } from "express";
import { getStripeClient, getStripePublishableKey } from "./stripeClient";
import { storage } from "./storage";
import { asyncHandler, ValidationError } from "./middleware/errorHandler";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerStripeRoutes(app: Express) {
  const stripe = await getStripeClient();

  // Get publishable key for frontend
  app.get('/api/stripe/publishable-key', asyncHandler(async (req, res) => {
    const key = await getStripePublishableKey();
    res.json({ publishableKey: key });
  }));

  // Create checkout session
  app.post('/api/checkout', asyncHandler(async (req: any, res) => {
    if (!req.user) throw new ValidationError('Unauthorized');
    
    const { priceId } = req.body;
    if (!priceId) throw new ValidationError('Price ID required');

    const user = await storage.getUser(req.user.id);
    if (!user) throw new ValidationError('User not found');

    // Create or get customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      await db.update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, user.id));
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
    });

    res.json({ url: session.url });
  }));

  // Get subscription status
  app.get('/api/subscription', asyncHandler(async (req: any, res) => {
    if (!req.user) throw new ValidationError('Unauthorized');

    const user = await storage.getUser(req.user.id);
    if (!user?.stripeSubscriptionId) {
      return res.json({ subscription: null });
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    res.json({ subscription });
  }));

  // Customer portal
  app.post('/api/billing-portal', asyncHandler(async (req: any, res) => {
    if (!req.user) throw new ValidationError('Unauthorized');

    const user = await storage.getUser(req.user.id);
    if (!user?.stripeCustomerId) throw new ValidationError('No customer found');

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.protocol}://${req.get('host')}/dashboard`,
    });

    res.json({ url: session.url });
  }));
}

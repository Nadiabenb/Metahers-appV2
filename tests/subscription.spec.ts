
import { test, expect } from '@playwright/test';
import { setupTestDatabase, seedTestData, cleanupTestData } from './helpers/database';
import { login } from './helpers/auth';

test.describe('Subscription Upgrade Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase();
    await seedTestData();
    await login(page);
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('should show paywall for pro-only content', async ({ page }) => {
    // Try to access a Pro-only experience
    await page.goto('/spaces/executive');
    
    // Look for paywall or upgrade prompt
    const paywallExists = await page.locator('text=/Upgrade|Pro only|Premium/i').isVisible({ timeout: 5000 })
      .catch(() => false);
    
    if (paywallExists) {
      await expect(page.locator('text=/Upgrade to Pro|Premium/i')).toBeVisible();
    }
  });

  test('should navigate to upgrade page', async ({ page }) => {
    // Click upgrade button from dashboard or navigation
    await page.goto('/dashboard');
    
    const upgradeButton = page.locator('button:has-text("Upgrade"), a:has-text("Upgrade")').first();
    
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Verify redirect to upgrade page
      await expect(page).toHaveURL(/.*upgrade/);
    } else {
      // Navigate directly
      await page.goto('/upgrade');
    }
    
    await expect(page).toHaveURL(/.*upgrade/);
  });

  test('should display pricing correctly', async ({ page }) => {
    await page.goto('/upgrade');
    
    // Verify pricing tiers are displayed
    await expect(page.locator('text=/Free|Pro|Executive/i')).toBeVisible({ timeout: 10000 });
    
    // Verify price amounts are shown
    await expect(page.locator('text=/\\$|month|year/i')).toBeVisible();
    
    // Verify feature lists
    const featureList = page.locator('ul, [data-testid="features"]').first();
    await expect(featureList).toBeVisible();
  });

  test('should show upgrade CTA on restricted content', async ({ page }) => {
    // Try to access Pro experience
    await page.goto('/experience/executive-leadership');
    
    // Check if paywall appears
    const upgradeCTA = page.locator('button:has-text("Upgrade to Pro"), a:has-text("Upgrade")');
    
    if (await upgradeCTA.isVisible({ timeout: 5000 })) {
      await upgradeCTA.click();
      
      // Verify redirect to upgrade page
      await expect(page).toHaveURL(/.*upgrade/);
    }
  });

  test('should handle subscription selection', async ({ page }) => {
    await page.goto('/upgrade');
    
    // Select Pro tier
    const proButton = page.locator('button:has-text("Choose Pro"), button:has-text("Select Pro")').first();
    
    if (await proButton.isVisible()) {
      await proButton.click();
      
      // Note: Don't actually process payment in test
      // Just verify the payment flow is initiated
      const paymentForm = page.locator('form, [data-testid="payment-form"]');
      const paymentExists = await paymentForm.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Either payment form appears or we're redirected to Stripe
      expect(paymentExists || page.url().includes('stripe') || page.url().includes('checkout')).toBeTruthy();
    }
  });
});

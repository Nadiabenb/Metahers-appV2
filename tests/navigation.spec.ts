
import { test, expect } from '@playwright/test';
import { setupTestDatabase, seedTestData, cleanupTestData } from './helpers/database';
import { login } from './helpers/auth';

test.describe('Navigation and UI', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase();
    await seedTestData();
    await login(page);
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('should navigate through main sections', async ({ page }) => {
    // Dashboard
    await page.goto('/dashboard');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Discover
    await page.goto('/discover');
    await expect(page.locator('h1:has-text("Discover")')).toBeVisible({ timeout: 10000 });

    // Rituals
    await page.goto('/rituals');
    await expect(page.locator('h1:has-text("Rituals")')).toBeVisible({ timeout: 10000 });

    // Account
    await page.goto('/account');
    await expect(page.locator('h1:has-text("Account")')).toBeVisible({ timeout: 10000 });
  });

  test('should use global search', async ({ page }) => {
    await page.goto('/dashboard');
    
    const searchInput = page.locator('input[placeholder*="Search"], [data-testid="global-search"]');
    
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('branding');
      await page.keyboard.press('Enter');
      
      // Verify search results appear
      await expect(page.locator('text=branding')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Look for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], [data-testid="mobile-menu"]');
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Verify navigation menu appears
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    }
  });
});

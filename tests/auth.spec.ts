
import { test, expect } from '@playwright/test';
import { setupTestDatabase, seedTestData, cleanupTestData } from './helpers/database';
import { testUser, login, logout } from './helpers/auth';

test.describe('Authentication Flow', () => {
  test.beforeEach(async () => {
    await setupTestDatabase();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('should complete full registration flow', async ({ page }) => {
    // Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/MetaHers/);

    // Click "Get Started" button
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/.*signup/);

    // Fill registration form
    await page.fill('input[name="username"]', testUser.username);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify user is logged in - check for user menu or username
    const isLoggedIn = await page.locator('[data-testid="user-menu"]').isVisible()
      .catch(() => page.locator(`text=${testUser.username}`).isVisible());
    expect(isLoggedIn).toBeTruthy();
  });

  test('should login and logout successfully', async ({ page }) => {
    // Setup: Create test user
    await seedTestData();

    // Login
    await login(page);
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify dashboard loads
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Logout
    await logout(page);
    await expect(page).toHaveURL('/');

    // Verify redirect to landing page
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('should login with existing credentials', async ({ page }) => {
    // Setup: Create test user
    await seedTestData();

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Verify successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Should stay on login page and show error
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('text=/Invalid|incorrect|wrong/i')).toBeVisible({ timeout: 5000 });
  });

  test('should handle password reset flow', async ({ page }) => {
    await seedTestData();

    await page.goto('/login');
    await page.click('text=Forgot password');
    
    await expect(page).toHaveURL(/.*forgot-password/);
    
    await page.fill('input[type="email"]', testUser.email);
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('text=/email sent|check your email/i')).toBeVisible({ timeout: 5000 });
  });
});

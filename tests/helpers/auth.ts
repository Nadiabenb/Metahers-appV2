
import { Page } from '@playwright/test';

export const testUser = {
  email: 'test@metahers.com',
  password: 'TestPassword123!',
  username: 'testuser',
};

export async function login(page: Page, email = testUser.email, password = testUser.password) {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

export async function logout(page: Page) {
  // Open user menu
  await page.click('[data-testid="user-menu"]', { timeout: 5000 }).catch(async () => {
    // Fallback: try clicking avatar or profile button
    await page.click('button:has-text("Account")', { timeout: 5000 }).catch(async () => {
      await page.click('[aria-label="User menu"]', { timeout: 5000 });
    });
  });
  
  // Click logout button
  await page.click('text=Log out');
  
  // Wait for redirect to landing page
  await page.waitForURL('/', { timeout: 10000 });
}

export async function signup(
  page: Page,
  email = testUser.email,
  password = testUser.password,
  username = testUser.username
) {
  await page.goto('/signup');
  
  await page.fill('input[name="username"]', username);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  await page.click('button[type="submit"]');
  
  // Wait for successful registration and redirect
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

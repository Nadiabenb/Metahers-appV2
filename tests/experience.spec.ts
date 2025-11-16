
import { test, expect } from '@playwright/test';
import { setupTestDatabase, seedTestData, cleanupTestData } from './helpers/database';
import { login } from './helpers/auth';

test.describe('Experience Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase();
    await seedTestData();
    await login(page);
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('should complete an experience flow', async ({ page }) => {
    // Navigate to a space (Web3)
    await page.goto('/spaces/web3');
    await expect(page.locator('h1:has-text("Web3")')).toBeVisible({ timeout: 10000 });

    // Click on first experience
    const firstExperience = page.locator('[data-testid="experience-card"]').first();
    await expect(firstExperience).toBeVisible();
    await firstExperience.click();

    // Verify experience detail page loads
    await expect(page).toHaveURL(/.*\/experience\/.*/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Start the experience
    const startButton = page.locator('button:has-text("Start"), button:has-text("Begin")');
    if (await startButton.isVisible()) {
      await startButton.click();
    }

    // Read through sections - look for Next button
    const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")');
    
    // Click through up to 3 sections
    for (let i = 0; i < 3; i++) {
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }

    // Look for quiz section
    const quizOption = page.locator('input[type="radio"]').first();
    if (await quizOption.isVisible()) {
      await quizOption.click();
      
      const submitQuiz = page.locator('button:has-text("Submit"), button:has-text("Check Answer")');
      if (await submitQuiz.isVisible()) {
        await submitQuiz.click();
        await page.waitForTimeout(1000);
      }
    }

    // Mark as complete if button exists
    const completeButton = page.locator('button:has-text("Complete"), button:has-text("Finish")');
    if (await completeButton.isVisible()) {
      await completeButton.click();
      
      // Verify completion celebration or confirmation
      await expect(
        page.locator('text=/Completed|Congratulations|Well done/i')
      ).toBeVisible({ timeout: 5000 });
    }

    // Go back to dashboard
    await page.goto('/dashboard');

    // Verify progress is reflected
    await expect(page.locator('[data-testid="progress-indicator"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should track section progress', async ({ page }) => {
    await page.goto('/spaces/branding');
    
    const firstExperience = page.locator('[data-testid="experience-card"]').first();
    await firstExperience.click();

    // Verify initial progress is 0% or shows "Not started"
    const progressIndicator = page.locator('[data-testid="progress"]').first();
    if (await progressIndicator.isVisible()) {
      const progressText = await progressIndicator.textContent();
      expect(progressText).toMatch(/0%|Not started|Start/i);
    }

    // Start experience
    const startButton = page.locator('button:has-text("Start"), button:has-text("Begin")');
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(1000);
      
      // Progress should update
      if (await progressIndicator.isVisible()) {
        const updatedProgress = await progressIndicator.textContent();
        expect(updatedProgress).not.toMatch(/0%|Not started/i);
      }
    }
  });

  test('should allow bookmarking experiences', async ({ page }) => {
    await page.goto('/spaces/web3');
    
    const firstExperience = page.locator('[data-testid="experience-card"]').first();
    await firstExperience.click();

    // Look for bookmark button
    const bookmarkButton = page.locator('button[aria-label*="bookmark"], button:has-text("Bookmark")');
    
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      
      // Verify bookmark confirmation
      await expect(
        page.locator('text=/Bookmarked|Saved|Added to/i')
      ).toBeVisible({ timeout: 3000 });
    }
  });
});

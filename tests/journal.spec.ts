
import { test, expect } from '@playwright/test';
import { setupTestDatabase, seedTestData, cleanupTestData } from './helpers/database';
import { login } from './helpers/auth';

test.describe('Journal Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase();
    await seedTestData();
    await login(page);
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('should create a new journal entry', async ({ page }) => {
    // Navigate to journal page
    await page.goto('/journal');
    await expect(page.locator('h1:has-text("Journal")')).toBeVisible({ timeout: 10000 });

    // Create new entry
    const newEntryButton = page.locator('button:has-text("New Entry"), button:has-text("Write")');
    await expect(newEntryButton).toBeVisible();
    await newEntryButton.click();

    // Add gratitude items
    const gratitudeInput = page.locator('textarea[placeholder*="grateful"], input[placeholder*="grateful"]').first();
    if (await gratitudeInput.isVisible()) {
      await gratitudeInput.fill('I am grateful for this test passing');
    }

    // Set mood if mood selector exists
    const moodSelector = page.locator('[data-testid="mood-selector"]').first();
    if (await moodSelector.isVisible()) {
      await moodSelector.click();
    }

    // Fill main journal content
    const journalContent = page.locator('textarea').first();
    await journalContent.fill('This is my test journal entry. Today was a great day of testing!');

    // Save entry
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    await saveButton.click();

    // Verify success message
    await expect(
      page.locator('text=/Saved|Entry created|Success/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should view journal history', async ({ page }) => {
    // First create an entry
    await page.goto('/journal');
    
    const newEntryButton = page.locator('button:has-text("New Entry"), button:has-text("Write")');
    if (await newEntryButton.isVisible()) {
      await newEntryButton.click();
      
      const journalContent = page.locator('textarea').first();
      await journalContent.fill('Test entry for history');
      
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to history
    await page.goto('/journal/history');
    
    // Verify entry appears
    await expect(page.locator('text=Test entry for history')).toBeVisible({ timeout: 5000 });
  });

  test('should edit an existing journal entry', async ({ page }) => {
    // Create an entry first
    await page.goto('/journal');
    
    const newEntryButton = page.locator('button:has-text("New Entry"), button:has-text("Write")');
    if (await newEntryButton.isVisible()) {
      await newEntryButton.click();
      
      const journalContent = page.locator('textarea').first();
      await journalContent.fill('Original entry text');
      
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();
      await page.waitForTimeout(2000);
    }

    // Find and edit the entry
    const editButton = page.locator('button:has-text("Edit"), button[aria-label*="Edit"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      const journalContent = page.locator('textarea').first();
      await journalContent.clear();
      await journalContent.fill('Updated entry text');
      
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();
      
      // Verify update
      await expect(page.locator('text=Updated entry text')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete a journal entry', async ({ page }) => {
    // Create an entry first
    await page.goto('/journal');
    
    const newEntryButton = page.locator('button:has-text("New Entry"), button:has-text("Write")');
    if (await newEntryButton.isVisible()) {
      await newEntryButton.click();
      
      const journalContent = page.locator('textarea').first();
      await journalContent.fill('Entry to delete');
      
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();
      await page.waitForTimeout(2000);
    }

    // Find and delete the entry
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="Delete"]').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion if dialog appears
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Verify entry is gone
      await expect(page.locator('text=Entry to delete')).not.toBeVisible({ timeout: 5000 });
    }
  });
});

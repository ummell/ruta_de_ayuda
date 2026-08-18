import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('debe funcionar en móvil', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 13'].viewport!);
    await page.goto('/');

    // Mobile menu should be visible
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
  });

  test('debe funcionar en tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Desktop nav might be hidden, but content should be accessible
    await expect(page.locator('h1')).toContainText('Terremoto');
  });
});

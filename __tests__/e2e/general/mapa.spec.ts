import { test, expect } from '@playwright/test';

test.describe('Mapa Interactivo', () => {
  test('debe cargar sin errores', async ({ page }) => {
    await page.goto('/');
    // Map should load without crashing
    await expect(page.getByRole('heading', { name: 'Mapa en tiempo real' })).toBeVisible();
  });
});

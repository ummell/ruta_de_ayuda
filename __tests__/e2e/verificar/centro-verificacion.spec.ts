import { test, expect } from '@playwright/test';

test.describe('Centro de Verificación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/verificar');
  });

  test('debe cargar la página', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Centro de Verificación');
  });

  test('debe mostrar mensaje cuando el texto es muy corto', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.pressSequentially('Cali');

    const verificarBtn = page.getByRole('button', { name: 'Verificar' });
    await expect(verificarBtn).toBeDisabled();
  });

  test('debe permitir verificar texto válido', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.pressSequentially('Centro de acopio en el barrio San Antonio de Cali');

    const verificarBtn = page.getByRole('button', { name: 'Verificar' });
    await expect(verificarBtn).toBeEnabled();
    await verificarBtn.click();

    // Should show result
    await expect(page.getByText(/Verificado|No Podemos|Conflicto/)).toBeVisible({ timeout: 10000 });
  });

  test('debe explicar por qué verificar es importante', async ({ page }) => {
    await expect(page.getByText(/En emergencias circulan noticias falsas/)).toBeVisible();
    await expect(page.getByText(/Verificar protege a todos/)).toBeVisible();
  });
});

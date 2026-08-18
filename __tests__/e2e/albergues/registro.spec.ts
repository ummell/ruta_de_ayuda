import { test, expect } from '@playwright/test';

test.describe('Registro de Albergues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/albergues/nuevo');
  });

  test('debe mostrar los badges de verificación', async ({ page }) => {
    await expect(page.getByText('Verificado Alto')).toBeVisible();
    await expect(page.getByText('Avalado')).toBeVisible();
    await expect(page.getByText('Voluntario Hogar')).toBeVisible();
  });

  test('debe mostrar advertencia para voluntario hogar', async ({ page }) => {
    await expect(page.getByText(/No es un albergue oficial/)).toBeVisible();
  });

  test('debe registrar un nuevo albergue', async ({ page }) => {
    await page.locator('#voluntarioNombre').pressSequentially('María García');
    await page.locator('#telefono').pressSequentially('3001234567');
    await page.locator('#direccion').pressSequentially('Carrera 15 #8-23');
    await page.locator('#ciudad').pressSequentially('Cali');
    await page.locator('#capacidad').pressSequentially('10');

    await page.getByRole('button', { name: 'Publicar' }).click();

    await expect(page).toHaveURL('/albergues');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Registro de Personas Desaparecidas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/personas/nuevo');
  });

  test('debe mostrar el formulario de registro', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Reportar Persona Desaparecida');
    await expect(page.locator('#nombre')).toBeVisible();
    await expect(page.getByLabel('Apellido')).toBeVisible();
    await expect(page.getByLabel('Ciudad')).toBeVisible();
  });

  test('debe validar campos requeridos', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Publicar Reporte' }).click();

    // Should show validation errors
    await expect(page.getByText('Nombre es requerido')).toBeVisible();
  });

  test('debe permitir subir una foto', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('debe completar el formulario exitosamente', async ({ page }) => {
    // Fill required fields
    await page.locator('#nombre').pressSequentially('María');
    await page.getByLabel('Apellido').pressSequentially('García');
    await page.getByLabel('Ciudad').pressSequentially('Cali');
    await page.getByLabel('Última ubicación conocida').pressSequentially('Barrio San Antonio');
    await page.getByLabel('Fecha de desaparición').fill('2026-08-10');

    // Fill reportante info
    await page.getByLabel('Tu nombre completo').pressSequentially('Juan Pérez');
    await page.getByLabel('Teléfono').pressSequentially('3001234567');

    // Submit
    await page.getByRole('button', { name: 'Publicar Reporte' }).click();

    // Should redirect to list page
    await expect(page).toHaveURL('/personas');
  });
});

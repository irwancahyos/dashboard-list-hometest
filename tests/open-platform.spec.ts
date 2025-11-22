import { test, expect } from '@playwright/test';

test('Open platform able redirect to dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(4000);
  await expect(page.getByText('Dashboard')).toBeVisible();
  await page.waitForTimeout(4000);
  await expect(page.getByText('Produk')).toBeVisible();
});
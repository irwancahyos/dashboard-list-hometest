import { test, expect } from '@playwright/test';

// Separate timew
const STATIC_TIMEOUT = 500; 

test('E2E: Edit Nama Barang Berhasil dan Terverifikasi', async ({ page }) => {
  // Old and new product name
  const OLD_NAME = 'Papan tulis';
  const NEW_NAME = 'Papan Basar'; 
  
  // Go to platform
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(STATIC_TIMEOUT); 
  
  // seach old name product
  await page.getByRole('textbox', { name: 'Cari barang' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);
  await page.getByRole('textbox', { name: 'Cari barang' }).fill(OLD_NAME);
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Make sure product exist
  await expect(page.getByText(OLD_NAME)).toBeVisible(); 
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  // Clict edit button
  await page.getByRole('row', { name: `Image product ${OLD_NAME}` }).getByRole('link').click();
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Verification page of edit
  await expect(page).toHaveURL(/inventory\/.*\/edit/);
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Edit name of product
  await page.getByRole('textbox', { name: 'Nama barang' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);
  await page.getByRole('textbox', { name: 'Nama barang' }).fill(NEW_NAME);
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Save edit
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Verification to dashboard
  await expect(page).toHaveURL('/inventory');
  await page.waitForTimeout(STATIC_TIMEOUT);

  
  // Verification old data not exist and new data exist
  await page.getByRole('textbox', { name: 'Cari barang' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);
  await page.getByRole('textbox', { name: 'Cari barang' }).fill(NEW_NAME);
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Verif name exist
  await expect(page.getByText(NEW_NAME)).toBeVisible(); 
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Clear searchbox
  await page.getByRole('textbox', { name: 'Cari barang' }).fill('');
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  // Find old name
  await page.getByRole('textbox', { name: 'Cari barang' }).fill(OLD_NAME);
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  // Make sure old name is not exist
  await expect(page.getByText('Data yang anda cari tidak ada')).toBeVisible();
  await page.waitForTimeout(STATIC_TIMEOUT);
});
import { test, expect } from '@playwright/test';
import * as path from 'path'; 

// Use mock image from dir app/test-image/image-cluoud.jpg
const MOCK_IMAGE_PATH = path.join(__dirname, '..', 'app', 'test-image', 'image-cloud.jpg'); 

// Separate time
const STATIC_TIMEOUT = 500; 

test('Create new product', async ({ page }) => {
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(STATIC_TIMEOUT); 
  
  // Click button add product
  await page.getByRole('button', { name: 'Tambah' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Then when arrived to form, just get input file and not need to click because use mock image
  await page.setInputFiles('#file-upload', MOCK_IMAGE_PATH);
  await page.waitForTimeout(STATIC_TIMEOUT); 

  // Then when success to upload get alt preview image
  await expect(page.getByAltText('Preview Image')).toBeVisible();

  // Input form
  await page.getByPlaceholder('Nama barang').fill('Barang Jasa');
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  await page.getByPlaceholder('Kode Produk').fill('BJ09');
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  await page.getByPlaceholder('Stok').fill('7');
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  await page.getByPlaceholder('Harga barang').fill('Rp 7.0000');
  await page.waitForTimeout(STATIC_TIMEOUT);
  
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(STATIC_TIMEOUT);

  // Go to dashboard again, cek name product
  await expect(page.getByText('Barang Jasa')).toBeVisible();
});
// npm install --no-save --package-lock=false lighthouse playwright
// Run with node scripts/verify-performance.mjs after build:assets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'pages/menu.html', 'pages/offers.html'];
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const [url, descriptor] = candidate.trim().split(/\s+/);
      const asset = path.resolve(root, path.dirname(file), url);
      assert(fs.existsSync(asset), `${file}: missing ${url}`);
      const metadata = await sharp(asset).metadata();
      assert.equal(metadata.width, parseInt(descriptor), `${file}: incorrect width descriptor for ${url}`);
    }
  }
}
console.log('Responsive image paths and intrinsic width descriptors verified.');

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.avif': 'image/avif', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve => server.listen(4180, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.width < 768 ? 2 : 1 });
    await context.addInitScript(() => {
      localStorage.setItem('tl_location_name', 'Test location');
      localStorage.setItem('tl_firstvisit_hinted', '1');
    });
    for (const file of pages) {
      const page = await context.newPage();
      const errors = [];
      const failedAssets = [];
      page.on('pageerror', error => errors.push(error.stack));
      page.on('response', response => {
        if (response.url().startsWith('http://127.0.0.1:4180/') && response.status() >= 400) failedAssets.push(response.url());
      });
      await page.goto('http://127.0.0.1:4180/' + file, { waitUntil: 'load' });
      await page.waitForFunction(() => typeof window.CartManager === 'object' && !!document.querySelector('.navbar'));
      await page.waitForTimeout(800);
      assert.deepEqual(errors, [], `${file}: browser errors`);
      assert.deepEqual(failedAssets, [], `${file}: asset failures`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${file}: horizontal overflow`);
      if (file !== 'pages/offers.html') {
        const frame = page.locator('.hero-image-frame').first();
        assert(await frame.evaluate(el => el.classList.contains('loaded')), `${file}: shimmer still active`);
        const hero = await page.locator('.hero-full-img:not(.clone)').first().evaluate(img => ({
          source: img.currentSrc, width: img.getBoundingClientRect().width,
          frameWidth: img.closest('.hero-image-frame').getBoundingClientRect().width,
          complete: img.complete && img.naturalWidth > 0,
        }));
        assert(hero.complete, `${file}: banner not loaded`);
        assert(Math.abs(hero.width - hero.frameWidth) < 2, `${file}: banner does not fill frame`);
        if (viewport.width < 768) assert(hero.source.includes('/responsive/'), `${file}: full-size mobile banner`);
        assert.equal(await page.locator('#hero-primary-img').count(), file === 'index.html' ? 1 : 0);
        const indicators = page.locator('.carousel-indicators .indicator');
        await indicators.nth(1).click();
        await page.waitForTimeout(600);
        assert(await indicators.nth(1).evaluate(el => el.classList.contains('active')), `${file}: carousel navigation failed`);
        console.log(JSON.stringify({ viewport: viewport.width, file, hero }));
      }
      await page.locator('.product-card').first().scrollIntoViewIfNeeded();
      const position = await page.evaluate(() => window.scrollY);
      await page.locator('.product-card').first().click();
      await page.waitForFunction(() => document.querySelector('#item-modal.active'));
      assert(await page.evaluate(() => document.body.classList.contains('modal-open')), `${file}: modal not scroll locked`);
      await page.locator('#modal-add-to-cart').click();
      await page.waitForFunction(() => !document.querySelector('#item-modal.active'));
      await page.waitForTimeout(500);
      assert(await page.evaluate(() => window.CartManager.getTotalItems() > 0), `${file}: cart failed`);
      assert(Math.abs(await page.evaluate(() => window.scrollY) - position) <= 2, `${file}: modal close changed scroll position`);
      await page.evaluate(() => window.openSearchModal());
      await page.waitForFunction(() => document.querySelector('#search-results-overlay.open'));
      await page.locator('#mobile-search-overlay-input').fill('burger');
      await page.waitForTimeout(350);
      assert(await page.locator('#search-results-grid').evaluate(el => el.children.length > 0), `${file}: search failed`);
      await page.locator('#search-results-close').click();
      await page.waitForFunction(() => !document.querySelector('#search-results-overlay.open'));
      assert(!await page.evaluate(() => document.body.classList.contains('modal-open')), `${file}: modal lock not released`);
      // Shared demo/info dialogs must still lay out when opened, despite
      // skipping their content while closed.
      for (const id of ['demo-modal', 'about-demo-modal', 'delivery-info-modal']) {
        await page.evaluate(id => window._tl_openModal(document.getElementById(id), id), id);
        await page.waitForTimeout(350);
        const dialog = page.locator('#' + id);
        assert(await dialog.evaluate(el => getComputedStyle(el).contentVisibility === 'visible'), `${id}: dialog content hidden`);
        assert((await dialog.locator('.modal-sheet').boundingBox()).height > 50, `${id}: dialog collapsed`);
        await page.evaluate(id => window._tl_closeModal(document.getElementById(id)), id);
        await page.waitForTimeout(350);
        assert(!await page.evaluate(() => document.body.classList.contains('modal-open')), `${id}: lock not released`);
        assert(Math.abs(await page.evaluate(() => window.scrollY) - position) <= 2, `${id}: closing changed scroll`);
      }
      assert.deepEqual(errors, [], `${file}: interaction errors`);
      console.log(`${viewport.width}px ${file}: carousel/layout, cart, modal scroll, search passed.`);
      await page.close();
    }
    for (const file of fs.readdirSync(path.join(root, 'pages')).filter(file => file.endsWith('.html') && !['menu.html', 'offers.html'].includes(file))) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.stack));
      await page.goto('http://127.0.0.1:4180/pages/' + file, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      assert.deepEqual(errors, [], `${file}: smoke-test browser errors`);
      assert(await page.locator('.navbar').count() > 0, `${file}: header missing`);
      await page.close();
    }
    console.log(`${viewport.width}px: all public-page smoke tests passed.`);
    await context.close();
  }
} finally {
  if (browser) await browser.close();
  server.close();
}

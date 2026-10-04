// Run against the production bundles, with a fresh browser for each audit.
// Install temporary tooling with: npm install --no-save lighthouse playwright
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const phase = process.argv[2] || 'before';
const resultDir = path.join(root, '.perf-results');
fs.mkdirSync(resultDir, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.avif': 'image/avif', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  const ext = path.extname(file);
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  const data = fs.readFileSync(file);
  if (['.html', '.css', '.js'].includes(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    res.setHeader('Content-Encoding', 'gzip'); res.end(zlib.gzipSync(data));
  } else res.end(data);
});
await new Promise(resolve => server.listen(4179, '127.0.0.1', resolve));
const summary = [];
try {
  for (const [profile, page, count] of [['mobile', '/', 3], ['desktop', '/', 1], ['mobile', '/pages/menu.html', 1]]) {
    for (let run = 1; run <= count; run++) {
      const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--remote-debugging-port=9223'], headless: true });
      try {
        const result = await lighthouse('http://127.0.0.1:4179' + page, { port: 9223, logLevel: 'error', onlyCategories: ['performance'], ...(profile === 'desktop' ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 }, emulatedUserAgent: false } : {}) });
        const { lhr } = result;
        const row = { profile, page, run, score: Math.round(lhr.categories.performance.score * 100), fcp: lhr.audits['first-contentful-paint'].numericValue, lcp: lhr.audits['largest-contentful-paint'].numericValue, tbt: lhr.audits['total-blocking-time'].numericValue, cls: lhr.audits['cumulative-layout-shift'].numericValue, si: lhr.audits['speed-index'].numericValue };
        summary.push(row);
        fs.writeFileSync(path.join(resultDir, `${phase}-${profile}-${page === '/' ? 'home' : 'menu'}-${run}.json`), JSON.stringify(lhr, null, 2));
        console.log(JSON.stringify(row));
      } finally { await browser.close(); }
    }
  }
  fs.writeFileSync(path.join(resultDir, phase + '-summary.json'), JSON.stringify(summary, null, 2));
} finally { server.close(); }

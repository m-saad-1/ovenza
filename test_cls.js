const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Emulate Moto G Power
  await page.setViewport({ width: 412, height: 823, isMobile: true, hasTouch: true });

  await page.evaluateOnNewDocument(() => {
    window.clsShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        let shiftInfo = {
          value: entry.value,
          sources: entry.sources ? entry.sources.map(s => {
            let n = s.node;
            return n ? `<${n.tagName.toLowerCase()} class="${n.className}" id="${n.id}">` : 'unknown';
          }) : []
        };
        window.clsShifts.push(shiftInfo);
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  const shifts = await page.evaluate(() => window.clsShifts);
  console.log('Layout Shifts:', JSON.stringify(shifts, null, 2));

  await browser.close();
})();

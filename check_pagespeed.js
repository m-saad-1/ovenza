const https = require('https');
const fs = require('fs');

const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://crustpk.vercel.app/&strategy=mobile&category=performance';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.lighthouseResult) {
        const lh = json.lighthouseResult;
        const score = lh.categories.performance.score * 100;
        console.log('Performance Score:', score);
        console.log('FCP:', lh.audits['first-contentful-paint'].displayValue);
        console.log('LCP:', lh.audits['largest-contentful-paint'].displayValue);
        console.log('TBT:', lh.audits['total-blocking-time'].displayValue);
        console.log('CLS:', lh.audits['cumulative-layout-shift'].displayValue);
        
        console.log('\n--- Failed Audits ---');
        for (let key in lh.audits) {
          const audit = lh.audits[key];
          if (audit.score !== null && audit.score < 0.9 && audit.weight > 0) {
            console.log(`${audit.title} (Score: ${audit.score}): ${audit.displayValue || ''}`);
          }
        }
        
        console.log('\n--- Diagnostics ---');
        if (lh.audits['layout-shift-elements'] && lh.audits['layout-shift-elements'].details) {
          console.log('Layout Shift Elements:');
          lh.audits['layout-shift-elements'].details.items.forEach(item => {
            console.log('-', item.node.snippet, 'Score:', item.score);
          });
        }
      } else {
        console.log('Error in API response:', json);
      }
    } catch (e) {
      console.log('Parse error:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('Network error:', e.message);
});

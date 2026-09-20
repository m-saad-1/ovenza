const fs = require('fs');
const path = require('path');

const filePath = path.join('dashboard', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<div class="page-header" style="margin-bottom: 2rem;">\s*<h1 class="page-title">Orders Management<\/h1>\s*<p class="page-subtitle">View, filter, and manage all incoming orders across branches\.<\/p>\s*<div style="display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap;">/;

const newHeader = `<div class="page-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h1 class="page-title">Orders Management</h1>
                            <p class="page-subtitle">View, filter, and manage all incoming orders across branches.</p>
                        </div>
                        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items: center;">`;

content = content.replace(regex, newHeader);

fs.writeFileSync(filePath, content);
console.log('index.html updated with Orders header layout');

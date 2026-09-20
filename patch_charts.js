const fs = require('fs');
const path = require('path');

['dashboard/js/admin.js', 'dashboard/js/dashboard.js'].forEach(file => {
    let p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/'#E5E9EB'/g, "'rgba(150, 150, 150, 0.15)'");
        content = content.replace(/"#E5E9EB"/g, "'rgba(150, 150, 150, 0.15)'");
        fs.writeFileSync(p, content);
        console.log(`Updated ${file}`);
    }
});

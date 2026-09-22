const fs = require('fs');
const glob = require('glob');

const placeholder = '<div id="navbar-placeholder" style="height: 70px; width: 100%; flex-shrink: 0;"></div>\n<main>';

glob.sync('**/*.html', { ignore: 'node_modules/**' }).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('id="navbar-placeholder"')) {
        content = content.replace(/<main>/, placeholder);
        fs.writeFileSync(file, content);
    }
});
console.log('Placeholders added.');

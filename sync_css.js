const fs = require('fs');
const glob = require('glob');

glob.sync('**/*.html', { ignore: 'node_modules/**' }).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace async CSS with sync CSS
    content = content.replace(/<link rel="preload" href="([^"]+)" as="style" onload="this\.onload=null;this\.rel='stylesheet'">/g, '<link rel="stylesheet" href="$1">');
    // Remove the noscript tag for the CSS since it's sync now
    content = content.replace(/<noscript><link href="[^"]+" rel="stylesheet"\/><\/noscript>/g, '');
    
    fs.writeFileSync(file, content);
});
console.log('CSS links updated to synchronous.');

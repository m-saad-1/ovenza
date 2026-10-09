const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '..');

const replacements = {
    "Ovenza": "Ovenza",
    "ovenza": "ovenza",
    "OVENZA": "OVENZA",
    "#790909": "#790909",
    "#790909": "#790909",
    "#790909": "#790909",
    "#790909": "#790909",
    "#790909": "#790909"
};

function processFile(filepath) {
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    let newContent = content;
    for (const [oldStr, newStr] of Object.entries(replacements)) {
        newContent = newContent.split(oldStr).join(newStr);
    }

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated: ${filepath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('.git') || fullPath.includes('node_modules')) {
            continue;
        }
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.md') || fullPath.endsWith('.json')) {
            processFile(fullPath);
        }
    }
}

walkDir(targetDir);
console.log("Done replacements.");

const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '..');

const replacements = {
    // Lists where we can cleanly add the second location
    "<li>Opposite to Jawad tower university road, Peshawar</li>
<li>Lexus Mall Gulberg Greens, Islamabad</li>": "<li>Opposite to Jawad tower university road, Peshawar</li>\n<li>Lexus Mall Gulberg Greens, Islamabad</li>",
    
    // Map Links (defaulting to the first location for the main map)
    "q=Opposite+to+Jawad+tower+university+road,+Peshawar": "q=Opposite+to+Jawad+tower+university+road,+Peshawar",
    "query=Opposite+to+Jawad+tower+university+road,+Peshawar": "query=Opposite+to+Jawad+tower+university+road,+Peshawar",
    "query=Ovenza+Opposite+to+Jawad+tower+university+road,+Peshawar": "query=Ovenza+Opposite+to+Jawad+tower+university+road,+Peshawar",
    
    // Phones
    "0328 5741158": "0328 5741158",
    "923285741158": "923285741158",
    
    // Any other remaining full matches
    "Opposite to Jawad tower university road, Peshawar": "Opposite to Jawad tower university road, Peshawar",
    "Opposite to Jawad tower university road, Peshawar": "Opposite to Jawad tower university road, Peshawar",
    
    // Just city name
    "Peshawar": "Peshawar"
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

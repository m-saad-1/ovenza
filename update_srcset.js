const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const regex = /<img([^>]*)src="([^"]*assets\/images\/([^"]+)\.avif)"([^>]*)>/gi;
  content = content.replace(regex, (match, p1, src, baseName, p4) => {
    // Only apply to specific LCP images
    if (baseName.match(/^(combo|burger|pizza|roll|cheese|mountain|special|crown|app|offer|hero)-.*/) || baseName === 'hero') {
      if (match.includes('srcset=')) return match; // Already processed
      
      const src300 = src.replace('.avif', '-300.avif');
      const src600 = src.replace('.avif', '-600.avif');
      const srcset = `srcset="${src300} 300w, ${src600} 600w" sizes="(max-width: 640px) 319px, 298px"`;
      changed = true;
      return `<img${p1}src="${src}" ${srcset}${p4}>`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Updated srcset in', filePath);
  }
}

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      processHtmlFile(fullPath);
    }
  }
}

processDir('d:/WEB_DEVELOPMENT/crust');

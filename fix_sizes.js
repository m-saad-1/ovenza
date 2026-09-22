const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix hero images
  content = content.replace(
    /(<img[^>]+class="hero-full-img"[^>]+sizes=")[^"]+(")/g,
    '$1(max-width: 640px) 100vw, 800px$2'
  );

  // Fix category circles
  content = content.replace(
    /(<div class="circle-img">[\s\S]*?<img[^>]+sizes=")[^"]+(")/g,
    '$1(max-width: 640px) 116px, 66px$2'
  );
  
  // Also add 150w candidate to srcset of cheese-fries if missing, for Phase 3
  if (content.includes('cheese-fries-300.avif') && !content.includes('cheese-fries-150.avif')) {
      content = content.replace(
          /srcset="([^"]*cheese-fries-300\.avif 300w)[^"]*"/g,
          'srcset="./assets/images/cheese-fries-150.avif 150w, $1"'
      );
      content = content.replace(
          /srcset="\.\.\/assets\/images\/cheese-fries-300\.avif 300w[^"]*"/g,
          'srcset="../assets/images/cheese-fries-150.avif 150w, ../assets/images/cheese-fries-300.avif 300w"'
      );
  }

  // Phase 4b: fix adm-customize-title h4 to h2
  content = content.replace(
    /<h4 class="adm-customize-title">/g,
    '<h2 class="adm-customize-title">'
  ).replace(
    /<\/h4><!-- adm-customize-title end -->|<\/h4>/g,
    (match) => match.replace('h4', 'h2')
  );

  // Phase 4c: keyboard navigation in category-circles
  if (content.includes('id="category-circles-home"')) {
     content = content.replace(
       /<div class="category-circles-wrapper" id="category-circles-home"([^>]*)>/,
       '<div class="category-circles-wrapper" id="category-circles-home" role="tablist"$1>'
     );
     // Note: we'd also need to add role="tab" to anchors inside.
     content = content.replace(
        /(<a class="category-circle-btn[^"]*"[^>]*?)>/g,
        (match, p1) => {
           if (p1.includes('role="tab"')) return match;
           return p1 + ' role="tab" aria-selected="false">';
        }
     );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed', filePath);
}

processFile(path.join(__dirname, 'index.html'));
processFile(path.join(__dirname, 'pages', 'menu.html'));

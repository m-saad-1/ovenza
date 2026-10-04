// Generate display-sized AVIF variants without changing the source artwork.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function build() {
  const imageRoot = path.resolve('assets/images');
  const outputRoot = path.join(imageRoot, 'responsive');
  fs.mkdirSync(outputRoot, { recursive: true });
  const files = new Map();
  const pages = ['index.html', 'pages/menu.html', 'pages/offers.html'];
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = match[0];
      const src = tag.match(/\bsrc="(?:\.\/|\.\.\/)?assets\/images\/([^"]+)"/);
      if (!src || !/\.avif$/i.test(src[1])) continue;
      // Card/category images only. Modal and logo artwork keeps its source.
      const preceding = html.slice(Math.max(0, match.index - 160), match.index);
      const hero = /hero-full-img/.test(tag);
      const category = /class="circle-img"/.test(preceding);
      const card = /class="card-image"/.test(preceding);
      if (hero || category || card) {
        const widths = hero ? [480, 800] : category ? [96, 192] : [240, 480];
        const current = files.get(src[1]) || new Set();
        widths.forEach(width => current.add(width));
        files.set(src[1], current);
      }
    }
  }
  let originalBytes = 0;
  let variantBytes = 0;
  const intrinsicWidths = new Map();
  for (const [file, widths] of files) {
    const source = path.join(imageRoot, file);
    const metadata = await sharp(source).metadata();
    intrinsicWidths.set(file, metadata.width);
    originalBytes += fs.statSync(source).size;
    for (const width of widths) {
      const target = path.join(outputRoot, `${file.replace(/\.avif$/i, '')}-${width}.avif`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      // Keep the generator repeatable without re-encoding unchanged variants.
      if (!fs.existsSync(target) || fs.statSync(target).mtimeMs < fs.statSync(source).mtimeMs) {
        await sharp(source).resize({ width: Math.min(width, metadata.width), withoutEnlargement: true }).avif({ quality: 60, effort: 4 }).toFile(target);
      }
      variantBytes += fs.statSync(target).size;
    }
  }
  // This rewrite is mechanical: retain content/layout, add responsive sources,
  // and remove excessive image priority on the menu catalogue.
  for (const page of pages) {
    let html = fs.readFileSync(page, 'utf8');
    html = html.replace(/<img\b[^>]*>/g, (tag, offset) => {
      const src = tag.match(/\bsrc="((?:\.\/|\.\.\/)?assets\/images\/)([^"]+)"/);
      if (!src || !files.has(src[2])) return tag;
      const preceding = html.slice(Math.max(0, offset - 160), offset);
      const hero = /hero-full-img/.test(tag);
      const category = /class="circle-img"/.test(preceding);
      const card = /class="card-image"/.test(preceding);
      if (!hero && !category && !card) return tag;
      const widths = hero ? [480, 800] : category ? [96, 192] : [240, 480];
      const seen = new Set();
      const candidates = widths.filter(width => {
        const actual = Math.min(width, intrinsicWidths.get(src[2]));
        if (seen.has(actual)) return false;
        seen.add(actual);
        return true;
      }).map(width => `${src[1]}responsive/${src[2].replace(/\.avif$/i, '')}-${width}.avif ${Math.min(width, intrinsicWidths.get(src[2]))}w`);
      if (hero) candidates.push(`${src[1]}${src[2]} ${src[2] === 'hero-main.avif' ? 1600 : 850}w`);
      const sizes = hero
        ? '(max-width: 768px) calc(100vw - 16px), calc(100vw - 48px)'
        : category ? '70px'
        : page === 'index.html' ? '(max-width: 768px) calc((100vw - 44px) / 2), 240px'
        : '(max-width: 768px) 112px, 240px';
      tag = tag.replace(/\s(?:srcset|sizes)="[^"]*"/g, '');
      tag = tag.replace(/\sdecoding="[^"]*"/, ' decoding="async"');
      if (!hero) {
        tag = tag.replace(/\sfetchpriority="[^"]*"/g, '');
        if (!/\bloading=/.test(tag)) tag = tag.replace('<img', '<img loading="lazy"');
      }
      return tag.replace('<img', `<img srcset="${candidates.join(', ')}" sizes="${sizes}"`);
    });
    if (page === 'index.html') {
      html = html.replace(/<link as="image"[^>]*hero-main\.avif[^>]*>/, '<link as="image" fetchpriority="high" href="./assets/images/hero-main.avif" imagesrcset="./assets/images/responsive/hero-main-480.avif 480w, ./assets/images/responsive/hero-main-800.avif 800w, ./assets/images/hero-main.avif 1600w" imagesizes="(max-width: 768px) calc(100vw - 16px), calc(100vw - 48px)" rel="preload" />');
    } else if (page === 'pages/menu.html') {
      html = html.replace(/<link rel="preload" as="image"[^>]*offer-1\.avif[^>]*>/, '<link rel="preload" as="image" href="../assets/images/offer-1.avif" imagesrcset="../assets/images/responsive/offer-1-480.avif 480w, ../assets/images/responsive/offer-1-800.avif 800w, ../assets/images/offer-1.avif 850w" imagesizes="(max-width: 768px) calc(100vw - 16px), calc(100vw - 48px)" fetchpriority="high">');
    }
    fs.writeFileSync(page, html);
  }
  console.log(JSON.stringify({ sourceImages: files.size, originalBytes, variantBytes }));
}
build().catch(error => { console.error(error); process.exitCode = 1; });

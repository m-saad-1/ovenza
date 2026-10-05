import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoots = ['index.html', 'pages', 'dashboard', path.join('assets', 'js'), path.join('assets', 'css')];
const sourceExtensions = new Set(['.html', '.js', '.css', '.json']);
const sources = [];

function collect(target) {
  const absolute = path.join(root, target);
  const stat = fs.statSync(absolute);
  if (stat.isFile()) {
    sources.push(absolute);
    return;
  }
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) collect(path.relative(root, child));
    else if (sourceExtensions.has(path.extname(entry.name))) sources.push(child);
  }
}

sourceRoots.forEach(collect);

const missing = [];
const legacyReferences = [];
const mojibake = [];
const oldContent = [];
const assetPattern = /(?:\.\.\/|\.\/)?assets\/(?:images|gallery)\/[A-Za-z0-9_./() -]+\.(?:avif|png|jpe?g|webp|mp4)/gi;

for (const source of sources) {
  const text = fs.readFileSync(source, 'utf8');
  const rel = path.relative(root, source);
  if (/ðŸ|â(?:€|™|œ|ž|š|˜|†|‡|‰|‹|›)/.test(text)) mojibake.push(rel);
  if (/imbiss|Urban Flame Kitchen|123 Food Street|Opposite Jinnah|Pak Arab|3232000888|923232000888|#719397|#587b80|placeholder\.avif/i.test(text)) oldContent.push(rel);
  for (const match of text.matchAll(assetPattern)) {
    const reference = match[0].replaceAll('\\', '/');
    if (!reference.toLowerCase().endsWith('.avif')) legacyReferences.push(`${rel}: ${reference}`);
    const assetIndex = reference.toLowerCase().indexOf('assets/');
    const absolute = path.join(root, reference.slice(assetIndex));
    if (!fs.existsSync(absolute)) missing.push(`${rel}: ${reference}`);
  }
}

const imageFiles = [];
function collectImages(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) collectImages(child);
    else imageFiles.push(child);
  }
}
collectImages(path.join(root, 'assets', 'images'));
collectImages(path.join(root, 'assets', 'gallery'));

const unreadable = [];
for (const image of imageFiles) {
  if (path.extname(image).toLowerCase() !== '.avif') continue;
  try {
    const metadata = await sharp(image).metadata();
    if (!metadata.width || !metadata.height || metadata.format !== 'heif') unreadable.push(path.relative(root, image));
  } catch {
    unreadable.push(path.relative(root, image));
  }
}

const failures = { missing, legacyReferences, mojibake, oldContent, unreadable };
for (const [name, items] of Object.entries(failures)) {
  console.log(`${name}: ${items.length}`);
  items.forEach(item => console.log(`  ${item}`));
}
console.log(`verifiedAvif: ${imageFiles.filter(file => path.extname(file).toLowerCase() === '.avif').length}`);
if (Object.values(failures).some(items => items.length)) process.exitCode = 1;

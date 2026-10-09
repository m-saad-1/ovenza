import fs from 'node:fs';
import { PurgeCSS } from 'purgecss';
import CleanCSS from 'clean-css';

const sources = [
  ['index.html', 'html'],
  ['assets/js/loader.js', 'js'],
  ['assets/js/script.bundle.js', 'js'],
  ['assets/js/search.js', 'js'],
].map(([file, extension]) => ({ raw: fs.readFileSync(file, 'utf8'), extension }));
const css = fs.readFileSync('assets/css/style.bundle.css', 'utf8');

const [{ css: purged }] = await new PurgeCSS().purge({
  content: sources,
  css: [{ raw: css }],
  safelist: {
    standard: ['active', 'dark-mode', 'loaded', 'is-loaded', 'open'],
  },
});
const result = new CleanCSS({ level: { 1: { all: true }, 2: false } }).minify(purged);
if (result.errors.length) throw new Error(result.errors.join('\n'));
fs.writeFileSync('assets/css/style.home.min.css', result.styles);
console.log(`style.home.min.css: ${Buffer.byteLength(result.styles)} bytes`);

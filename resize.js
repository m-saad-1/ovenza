const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'assets/images');

async function processImages() {
  const files = fs.readdirSync(imgDir);
  
  for (const file of files) {
    if (file.match(/^(combo|burger|pizza|roll|cheese|mountain|special|crown|app|offer|hero)-.*\.avif$/) || file === 'hero.avif') {
      const baseName = path.parse(file).name;
      const inputPath = path.join(imgDir, file);
      
      const path300 = path.join(imgDir, `${baseName}-300.avif`);
      const path600 = path.join(imgDir, `${baseName}-600.avif`);
      
      if (!fs.existsSync(path300)) {
        await sharp(inputPath).resize({ width: 300 }).avif({ quality: 60 }).toFile(path300);
        console.log(`Generated ${path300}`);
      }
      if (!fs.existsSync(path600)) {
        await sharp(inputPath).resize({ width: 600 }).avif({ quality: 60 }).toFile(path600);
        console.log(`Generated ${path600}`);
      }
    }
  }
}

processImages().catch(console.error);

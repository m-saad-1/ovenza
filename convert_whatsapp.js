const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'assets', 'images', 'whatsapp.png');
const outputPath = path.join(__dirname, 'assets', 'images', 'whatsapp.avif');

if (fs.existsSync(inputPath)) {
  sharp(inputPath)
    .resize(120, 120, { fit: 'inside' })
    .avif({ quality: 80 })
    .toFile(outputPath)
    .then(() => {
      console.log('Successfully converted whatsapp.png to whatsapp.avif');
      fs.unlinkSync(inputPath); // Delete old png
    })
    .catch(err => {
      console.error('Error converting image:', err);
    });
} else {
  console.log('whatsapp.png not found');
}

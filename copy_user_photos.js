const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\180fed6f-7b2b-4ad1-8090-92a62a475153\\.user_uploaded';
const destDir = path.join(__dirname, 'public', 'images', 'couple');
const rootImagesDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  'media_1788629874985.jpg',
  'media_1788629875010.jpg',
  'media_1788629875028.jpg',
  'media_1788629875046.jpg',
  'media_1788629875073.jpg',
];

files.forEach((file, idx) => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, `photo_${idx + 1}.jpg`);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} -> photo_${idx + 1}.jpg`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
});

// Set photo_5 (mountain landscape canyon selfie) or photo_2 as hero background
const heroSrc = path.join(destDir, 'photo_5.jpg');
const heroDest = path.join(rootImagesDir, 'hero.jpg');
if (fs.existsSync(heroSrc)) {
  fs.copyFileSync(heroSrc, heroDest);
  console.log('Set photo_5.jpg as main hero image');
}

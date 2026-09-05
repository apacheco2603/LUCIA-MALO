const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\180fed6f-7b2b-4ad1-8090-92a62a475153';
const destDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = {
  'wedding_hero_1788048331066.jpg': 'hero.jpg',
  'wedding_ceremony_1788048724683.jpg': 'ceremony.jpg',
  'wedding_party_1788048798380.jpg': 'party.jpg',
};

for (const [srcFile, destFile] of Object.entries(mappings)) {
  const srcPath = path.join(srcDir, srcFile);
  const destPath = path.join(destDir, destFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcFile} -> ${destFile}`);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
}

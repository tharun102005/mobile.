import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

if (!fs.existsSync(svgPath)) {
  console.error('favicon.svg not found!');
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  try {
    // 192x192 PNG
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    console.log('Generated pwa-192x192.png');

    // 512x512 PNG
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
    console.log('Generated pwa-512x512.png');

    // Maskable 512x512 PNG with safe padding
    await sharp(svgBuffer)
      .resize(400, 400)
      .extend({
        top: 56,
        bottom: 56,
        left: 56,
        right: 56,
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));
    console.log('Generated maskable-icon-512x512.png');

    // Apple touch icon 180x180
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    console.log('All icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceImage = join(__dirname, '../attached_assets/generated_images/MetaHers_luxury_app_icon_d0b12232.png');
const publicDir = join(__dirname, '../public');

async function generateIcons() {
  try {
    // Generate 192x192 icon
    await sharp(sourceImage)
      .resize(192, 192, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'icon-192.png'));
    console.log('✓ Generated icon-192.png');

    // Generate 512x512 icon
    await sharp(sourceImage)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'icon-512.png'));
    console.log('✓ Generated icon-512.png');

    // Generate Apple touch icon (180x180)
    await sharp(sourceImage)
      .resize(180, 180, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');

    // Also generate a favicon
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon.png'));
    console.log('✓ Generated favicon.png');

    console.log('\n✨ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

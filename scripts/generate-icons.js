import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceImage = join(__dirname, '../attached_assets/generated_images/Gradient_M_minimalist_icon_2e1fa2e4.png');
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

    // Generate high-quality favicon (48x48 for better clarity)
    await sharp(sourceImage)
      .resize(48, 48, { 
        fit: 'cover',
        kernel: sharp.kernel.lanczos3 
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(join(publicDir, 'favicon.png'));
    console.log('✓ Generated favicon.png');
    
    // Also generate standard 16x16 favicon
    await sharp(sourceImage)
      .resize(16, 16, { 
        fit: 'cover',
        kernel: sharp.kernel.lanczos3 
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(join(publicDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    console.log('\n✨ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

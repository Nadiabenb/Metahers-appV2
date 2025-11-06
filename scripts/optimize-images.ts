import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const CRITICAL_IMAGES = [
  'Neon_light_trails_hero_2008ed57.png',
  '3D_isometric_luxury_spa_6_rooms_52f40b1c.png',
];

const BREAKPOINTS = [400, 800, 1200, 1600, 2400];
const OUTPUT_DIR = 'client/public/optimized';

async function optimizeImage(inputPath: string, filename: string) {
  const baseName = filename.replace(/\.[^.]+$/, '');
  
  console.log(`\n📸 Optimizing: ${filename}`);
  
  for (const width of BREAKPOINTS) {
    // Generate AVIF (best compression, modern browsers)
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .avif({ quality: 80, effort: 4 })
      .toFile(join(OUTPUT_DIR, `${baseName}-${width}w.avif`));
    
    // Generate WebP (good compression, wider support)
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(join(OUTPUT_DIR, `${baseName}-${width}w.webp`));
    
    console.log(`  ✅ ${width}w: AVIF + WebP`);
  }
  
  // Fallback JPEG at largest size
  await sharp(inputPath)
    .resize(2400, null, { withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(join(OUTPUT_DIR, `${baseName}-fallback.jpg`));
  
  console.log(`  ✅ Fallback: JPEG`);
}

async function main() {
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('🚀 Starting image optimization...\n');
  
  // Optimize critical hero images
  for (const filename of CRITICAL_IMAGES) {
    const inputPath = join('attached_assets/generated_images', filename);
    
    if (!existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${filename} - file not found`);
      continue;
    }
    
    await optimizeImage(inputPath, filename);
  }
  
  console.log('\n✨ Optimization complete!');
  console.log(`📊 Estimated savings: ~85-90% file size reduction`);
}

main().catch(console.error);

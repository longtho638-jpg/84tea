import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const INPUT_FILE = path.join(PROJECT_ROOT, 'public/assets/logo.svg');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/icons');
const BRAND_COLOR = '#1b5e20'; // Imperial Green
const MASKABLE_PADDING_RATIO = 0.2; // 20% padding

async function generateIcons() {
  console.log('🚀 Starting PWA Icon Generation...');
  console.log(`📂 Project Root: ${PROJECT_ROOT}`);
  console.log(`📄 Input: ${INPUT_FILE}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}`);
  }

  // Verify input file
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  try {
    // 1. Generate Standard "Any" Icons (Transparent Background)
    console.log('\nGenerating Standard (Any) Icons...');
    for (const size of SIZES) {
      const fileName = `icon-${size}x${size}.png`;
      await sharp(INPUT_FILE)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(path.join(OUTPUT_DIR, fileName));
      console.log(`✅ Generated: ${fileName}`);
    }

    // 2. Generate Maskable Icons (Solid Background + Padding)
    console.log('\nGenerating Maskable Icons...');
    for (const size of SIZES) {
      const padding = Math.round(size * MASKABLE_PADDING_RATIO);
      const innerSize = size - padding;

      // Read SVG
      const svgContent = fs.readFileSync(INPUT_FILE, 'utf8');

      // Create white version for the green background
      // This simple replace assumes the logo uses #1b5e20. If not, it might not work as intended.
      // But for this project, the logo is likely brand color.
      const whiteLogoSvg = svgContent.replace(/#1b5e20/g, '#ffffff');
      const whiteLogoBuffer = Buffer.from(whiteLogoSvg);

      const innerWhiteLogoBuffer = await sharp(whiteLogoBuffer)
        .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      const fileName = `icon-maskable-${size}x${size}.png`;

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: BRAND_COLOR
        }
      })
      .composite([{ input: innerWhiteLogoBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(OUTPUT_DIR, fileName));

      console.log(`✅ Generated: ${fileName}`);
    }

    // 3. Special Case: Windows Taskbar (64x64)
    await sharp(INPUT_FILE)
      .resize(64, 64)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon-64x64.png'));
    console.log(`✅ Generated: icon-64x64.png`);

    // 4. Special Case: iOS Apple Touch Icon (180x180)
    const iosSize = 180;
    const iosPadding = Math.round(iosSize * 0.1);
    const iosInnerSize = iosSize - iosPadding;

    const svgContent = fs.readFileSync(INPUT_FILE, 'utf8');
    const whiteLogoSvg = svgContent.replace(/#1b5e20/g, '#ffffff');
    const whiteLogoBuffer = Buffer.from(whiteLogoSvg);

    const iosInnerLogoBuffer = await sharp(whiteLogoBuffer)
      .resize(iosInnerSize, iosInnerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: iosSize,
        height: iosSize,
        channels: 4,
        background: BRAND_COLOR
      }
    })
    .composite([{ input: iosInnerLogoBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
    console.log(`✅ Generated: apple-touch-icon.png`);

    console.log('\n🎉 Icon Generation Complete!');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

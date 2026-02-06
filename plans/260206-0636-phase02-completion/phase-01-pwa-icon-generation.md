# Phase 01: PWA Icon Generation

## Context
- **Plan:** [84tea Phase 02 Completion](../plan.md)
- **Research:** [PWA Icon Generation](../research/researcher-01-pwa-icons.md)
- **Goal:** Generate a complete set of PWA icons that meet modern standards (Any & Maskable) to ensure the app looks native on all platforms (iOS, Android, Windows).

## Requirements

### Icon Sizes & Types
| Size (px) | Purpose | Type | Background |
|-----------|---------|------|------------|
| 192x192 | Home screen | `any`, `maskable` | Transparent / #1b5e20 |
| 512x512 | Splash screen | `any`, `maskable` | Transparent / #1b5e20 |
| 180x180 | iOS Touch | `image/png` | #1b5e20 (No padding) |
| 64x64 | Windows | `image/png` | Transparent |
| Others | Various | `any`, `maskable` | As needed (72, 96, 128, 144, 152, 384) |

### Design Specs
- **Maskable Icons:** Must use Imperial Green (`#1b5e20`) background with adequate padding (content within safe zone).
- **Any Icons:** Transparent background for standard usage.
- **Source:** Use vector SVG source for high-quality generation.

## Implementation Steps

### 1. Prepare Source Assets
- [ ] Ensure high-quality SVG logo exists in `public/assets/logo.svg` (or similar).
- [ ] Create `scripts/generate-icons.mjs` for automation.

### 2. Create Generation Script
- [ ] Install `sharp` as a dev dependency: `npm install --save-dev sharp`
- [ ] Implement script to generate all required sizes from the research report.
- [ ] Logic to handle "maskable" (add background + padding) vs "any" (resize only).

```javascript
// scripts/generate-icons.mjs (Draft)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const INPUT = 'public/logo.svg'; // Verify path
const OUTPUT_DIR = 'public/icons';
const BG_COLOR = '#1b5e20';

// Ensure dir exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function generate() {
  // Generate "Any" icons (Transparent)
  for (const size of SIZES) {
    await sharp(INPUT)
      .resize(size, size)
      .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
  }

  // Generate "Maskable" icons (Solid BG + Padding)
  // Note: For maskable, we resize image to ~80% and composite over solid bg
  for (const size of SIZES) {
    const padding = Math.floor(size * 0.2); // 10% each side = 20% total reduction
    const innerSize = size - padding;

    await sharp(INPUT)
      .resize(innerSize, innerSize)
      .extend({
        top: padding / 2,
        bottom: padding / 2,
        left: padding / 2,
        right: padding / 2,
        background: BG_COLOR
      })
      .flatten({ background: BG_COLOR })
      .toFile(path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`));
  }

  console.log('✅ Icons generated successfully');
}

generate();
```

### 3. Update Manifest (If needed)
- [ ] Verify `public/manifest.json` matches the generated file names.
- [ ] Ensure `purpose: "maskable any"` is correctly applied or separate entries if file names differ (Research suggests separate files for optimal result, but same file with `purpose: "maskable any"` works if solid background is acceptable for "any" context. Better to have specific maskable files).
- **Decision:** Generate specific `icon-maskable-XxX.png` files and update manifest to reference them for `purpose: "maskable"`.

### 4. Validation
- [ ] Run script and check output files.
- [ ] Test 192x192 maskable icon on [Maskable.app](https://maskable.app/editor) to ensure logo isn't cut off.

## Success Criteria
- [ ] `public/icons` contains all required PNGs.
- [ ] Manifest points to correct files.
- [ ] Lighthouse PWA check passes icon validation.

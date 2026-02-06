# Research Report: PWA Icon Generation Best Practices

**Date:** 2026-02-06
**Context:** 84tea PWA Implementation
**Focus:** Icon generation, maskable icons, automation tools

## 1. Executive Summary
PWA icons require a specific strategy to look native on all platforms. The critical distinction is between standard ("any") and "maskable" icons. Automation via CLI (Sharp/ImageMagick) is preferred over manual export to ensure consistency and speed.

## 2. Requirements & Specifications

### Essential Sizes
| Size (px) | Purpose | Type |
|-----------|---------|------|
| 192x192 | Home screen, Task switcher | `any`, `maskable` |
| 512x512 | Splash screen, Install prompt | `any`, `maskable` |
| 180x180 | iOS Apple Touch Icon | `image/png` (no padding) |
| 64x64 | Windows Taskbar | `image/png` |

**Manifest Configuration:**
```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## 3. Maskable vs. Any Purpose

### The "Any" Icon
- **Behavior:** Displayed exactly as provided. Background is transparent.
- **Use Case:** Favicons, browser tabs, OS contexts that don't enforce shape.
- **Design:** Logo with transparent background.

### The "Maskable" Icon
- **Behavior:** The OS applies a mask (circle, square, squircle) to the icon.
- **Use Case:** Android home screen, App store listings.
- **Design:** **Must have a solid background color**. No transparency.
- **Safe Zone:** All critical visual content must fit within a **central circle of 80% diameter** (40% radius).
- **Padding:** Generally requires ~10% padding around the core logo to ensure it doesn't get cut off by circular masks.

## 4. Automation Tools & Scripts

### Option A: Sharp (Node.js) - Recommended for JS Projects
Fast, integrates with build scripts.

```javascript
const sharp = require('sharp');

// Generate Maskable Icon (Solid Background + Padding)
sharp('input-logo.svg')
  .resize(512, 512, { fit: 'contain', background: '#1b5e20' }) // Brand color
  .flatten({ background: '#1b5e20' })
  .toFile('icon-maskable-512.png');

// Generate "Any" Icon (Transparent)
sharp('input-logo.svg')
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('icon-any-192.png');
```

### Option B: ImageMagick (CLI)
Good for shell scripts/Makefiles.

```bash
# Maskable (Add background and centering)
convert logo.png -background "#1b5e20" -gravity center -extent 512x512 icon-maskable-512.png

# Simple Resize
convert logo.png -resize 192x192 icon-192.png
```

### Option C: PWA Asset Generator (CLI Tool)
Automates everything including HTML meta tags.
```bash
npx pwa-asset-generator logo.png ./public/icons --background "#1b5e20" --maskable --html
```

## 5. Design Best Practices

1.  **Avoid Transparency in Maskable Icons:** Android may fill transparency with black, ruining the aesthetic. Always flatten onto brand color.
2.  **Use SVG Source:** Always start from SVG to ensure 512px renders are crisp.
3.  **Check with Maskable.app:** Use [Maskable.app](https://maskable.app/editor) to preview how the icon looks in various shapes (Circle, Rounded Rect, etc.).
4.  **Monochrome Variant:** Consider adding a monochrome icon for specific Android widgets/notifications if applicable.

## 6. Recommended Workflow for 84tea

1.  **Source:** `logo-white.svg` and `logo-color.svg`.
2.  **Background:** Imperial Green (`#1b5e20`) for maskable icons.
3.  **Script:** Create `scripts/generate-icons.js` using `sharp`.
4.  **CI/CD:** Run generation on build or commit generated assets.

## Sources
- [W3C Image Resource](https://www.w3.org/TR/image-resource/)
- [Web.dev: Maskable Icons](https://web.dev/articles/maskable-icon)
- [MDN: Manifest Icons](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons)
- [Maskable.app](https://maskable.app/)

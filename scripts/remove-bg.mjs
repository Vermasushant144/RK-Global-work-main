import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN_DIR = path.join(__dirname, '../public/images/machines');
const OUT_DIR = path.join(__dirname, '../public/images/machines-navy');

mkdirSync(OUT_DIR, { recursive: true });

// Slider images only
const SLIDER_IMAGES = [
  'stirrup-bender-d4.webp',
  'concrete-mixer-machine.webp',
  'suspended-platform-zlp800.webp',
  'rebar-bending-machine.webp'
];

// Navy bg color matching slider: #0B1F33 = rgb(11, 31, 51)
const BG_R = 11, BG_G = 31, BG_B = 51;

for (const filename of SLIDER_IMAGES) {
  const inFile = path.join(IN_DIR, filename);
  const outFile = path.join(OUT_DIR, filename);

  const { data, info } = await sharp(inFile)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const { width, height, channels } = info;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Pure white / near-white → replace with navy
    if (r > 230 && g > 230 && b > 230) {
      pixels[i]     = BG_R;
      pixels[i + 1] = BG_G;
      pixels[i + 2] = BG_B;
      pixels[i + 3] = 255;
    }
    // Light grey transition → blend toward navy
    else if (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) {
      const blend = (r - 200) / 30;
      pixels[i]     = Math.round(BG_R * blend + r * (1 - blend));
      pixels[i + 1] = Math.round(BG_G * blend + g * (1 - blend));
      pixels[i + 2] = Math.round(BG_B * blend + b * (1 - blend));
      pixels[i + 3] = 255;
    }
  }

  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels }
  })
    .webp({ quality: 95 })
    .toFile(outFile);

  console.log(`✓ ${filename} → navy bg applied`);
}

console.log('\nDone! Check /public/images/machines-navy/');

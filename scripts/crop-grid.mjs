import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.join(__dirname, '../public/images/img/ChatGPT Image Aug 29, 2026, 01_24_23 PM.png');
const OUT = path.join(__dirname, '../public/images/machines');

// Get image dimensions first
const meta = await sharp(INPUT).metadata();
const W = meta.width;
const H = meta.height;

console.log(`Image size: ${W} x ${H}`);

const COLS = 5;
const ROWS = 5;
const cellW = Math.floor(W / COLS);
const cellH = Math.floor(H / ROWS);

// Named mapping: [row, col] => filename (0-indexed)
const cells = [
  // Row 0
  { row: 0, col: 0, name: 'stirrup-bender-d4' },
  { row: 0, col: 1, name: 'concrete-mixer-machine' },
  { row: 0, col: 2, name: 'suspended-platform-zlp800' },
  { row: 0, col: 3, name: 'bar-straightening-machine' },
  { row: 0, col: 4, name: 'bar-decoiling-machine' },
  // Row 1
  { row: 1, col: 0, name: 'rebar-bending-machine' },
  { row: 1, col: 1, name: 'suspended-platform-workers' },
  { row: 1, col: 2, name: 'steel-rebar-bars' },
  { row: 1, col: 3, name: 'stirrup-rings-stack' },
  { row: 1, col: 4, name: 'threading-machine-worker' },
  // Row 2
  { row: 2, col: 0, name: 'concrete-pour-site' },
  { row: 2, col: 1, name: 'mini-excavator' },
  { row: 2, col: 2, name: 'rebar-cage-foundation' },
  { row: 2, col: 3, name: 'floor-grinder-machine' },
  { row: 2, col: 4, name: 'steel-rod-bundles' },
  // Row 3
  { row: 3, col: 0, name: 'rebar-cutting-sparks' },
  { row: 3, col: 1, name: 'concrete-mixer-site' },
  { row: 3, col: 2, name: 'plate-compactor-machine' },
  { row: 3, col: 3, name: 'ring-bending-close' },
  { row: 3, col: 4, name: 'walk-behind-roller' },
  // Row 4
  { row: 4, col: 0, name: 'bar-decoiler-coil' },
  { row: 4, col: 1, name: 'rebar-threading-close' },
  { row: 4, col: 2, name: 'ironworker-machine' },
  { row: 4, col: 3, name: 'floor-grinder-polish' },
  { row: 4, col: 4, name: 'mini-excavator-2' },
];

import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

for (const cell of cells) {
  const left = cell.col * cellW;
  const top = cell.row * cellH;
  const outFile = path.join(OUT, `${cell.name}.webp`);

  await sharp(INPUT)
    .extract({ left, top, width: cellW, height: cellH })
    .resize(900, 600, {
      fit: 'inside',           // keep aspect ratio, no crop
      kernel: sharp.kernel.lanczos3,  // sharpest upscale algorithm
      withoutEnlargement: false        // allow upscaling
    })
    .sharpen({ sigma: 0.8 })   // compensate for upscale softness
    .webp({ quality: 95 })
    .toFile(outFile);

  console.log(`✓ ${cell.name}.webp  [${left},${top} ${cellW}x${cellH} → 900x600]`);
}

console.log('\nAll 25 images cropped successfully!');

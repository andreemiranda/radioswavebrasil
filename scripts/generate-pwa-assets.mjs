// scripts/generate-pwa-assets.mjs
// Executa com: node scripts/generate-pwa-assets.mjs

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');

// Garante que a pasta public existe
if (!existsSync(PUBLIC)) {
  mkdirSync(PUBLIC, { recursive: true });
}

// Lê o favicon.svg existente como buffer
const svgPath = resolve(PUBLIC, 'favicon.svg');
if (!existsSync(svgPath)) {
  console.error('â Œ Erro: public/favicon.svg nÃ£o encontrado.');
  process.exit(1);
}
const svgBuffer = readFileSync(svgPath);

// â”€â”€â”€ Ã cones padrÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const standardIcons = [
  { file: 'favicon-16x16.png',        size: 16  },
  { file: 'favicon-32x32.png',        size: 32  },
  { file: 'favicon-48x48.png',        size: 48  },
  { file: 'favicon-96x96.png',        size: 96  },
  { file: 'apple-touch-icon.png',     size: 180 },  // iOS tela inicial
  { file: 'icon-192x192.png',         size: 192 },  // Android Chrome
  { file: 'icon-256x256.png',         size: 256 },
  { file: 'icon-384x384.png',         size: 384 },
  { file: 'icon-512x512.png',         size: 512 },  // Splash + PWA obrigatÃ³rio
  // Windows tiles
  { file: 'mstile-70x70.png',         size: 70  },
  { file: 'mstile-144x144.png',       size: 144 },
  { file: 'mstile-150x150.png',       size: 150 },
  { file: 'mstile-310x310.png',       size: 310 },
];

async function generateAssets() {
  for (const { file, size } of standardIcons) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 156, b: 59, alpha: 1 } })
      .png()
      .toFile(resolve(PUBLIC, file));
    console.log(`âœ… ${file} (${size}x${size})`);
  }

  // â”€â”€â”€ Ã cone maskable (Android Adaptive Icon) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Maskable: Ãcone com 20% de safe zone preenchida com a cor de fundo
  // O Ãcone SVG ocupa 60% do espaÃ§o, centralizado em fundo verde
  await sharp(svgBuffer)
    .resize(410, 410, { fit: 'contain', background: { r: 0, g: 156, b: 59, alpha: 1 } })
    .extend({
      top: 51, bottom: 51, left: 51, right: 51,
      background: { r: 0, g: 156, b: 59, alpha: 1 }
    })
    .resize(512, 512)
    .png()
    .toFile(resolve(PUBLIC, 'icon-512x512-maskable.png'));
  console.log('âœ… icon-512x512-maskable.png (512x512, maskable)');

  await sharp(svgBuffer)
    .resize(154, 154, { fit: 'contain', background: { r: 0, g: 156, b: 59, alpha: 1 } })
    .extend({
      top: 19, bottom: 19, left: 19, right: 19,
      background: { r: 0, g: 156, b: 59, alpha: 1 }
    })
    .resize(192, 192)
    .png()
    .toFile(resolve(PUBLIC, 'icon-192x192-maskable.png'));
  console.log('âœ… icon-192x192-maskable.png (192x192, maskable)');

  // â”€â”€â”€ Wide tile Windows (310x150) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await sharp(svgBuffer)
    .resize(100, 100, { fit: 'contain', background: { r: 0, g: 156, b: 59, alpha: 1 } })
    .extend({
      top: 25, bottom: 25, left: 105, right: 105,
      background: { r: 0, g: 156, b: 59, alpha: 1 }
    })
    .resize(310, 150)
    .png()
    .toFile(resolve(PUBLIC, 'mstile-310x150.png'));
  console.log('âœ… mstile-310x150.png (310x150)');

  // â”€â”€â”€ OG Image (Open Graph / Twitter Card) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Gera uma imagem OG 1200x630 com fundo escuro e Ãcone centralizado
  const ogIconBuffer = await sharp(svgBuffer)
    .resize(200, 200, { fit: 'contain', background: { r: 26, g: 29, b: 38, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 26, g: 29, b: 38, alpha: 1 }
    }
  })
    .composite([
      { input: ogIconBuffer, gravity: 'centre' }
    ])
    .png()
    .toFile(resolve(PUBLIC, 'og-image.png'));
  console.log('âœ… og-image.png (1200x630, Open Graph)');

  // â”€â”€â”€ Splash Screens iOS (Apple Splash) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // iOS exige splash screens em tamanhos especÃficos por dispositivo
  const splashScreens = [
    // iPhone SE, 8, 7, 6
    { file: 'apple-splash-750x1334.png',   w: 750,  h: 1334 },
    // iPhone 12, 13, 14
    { file: 'apple-splash-1170x2532.png',  w: 1170, h: 2532 },
    // iPhone 14 Plus, 15 Plus
    { file: 'apple-splash-1284x2778.png',  w: 1284, h: 2778 },
    // iPhone 14 Pro, 15 Pro
    { file: 'apple-splash-1179x2556.png',  w: 1179, h: 2556 },
    // iPhone 14 Pro Max, 15 Pro Max
    { file: 'apple-splash-1290x2796.png',  w: 1290, h: 2796 },
    // iPad 9Âª geraÃ§Ã£o
    { file: 'apple-splash-1620x2160.png',  w: 1620, h: 2160 },
    // iPad Pro 12.9"
    { file: 'apple-splash-2048x2732.png',  w: 2048, h: 2732 },
  ];

  for (const { file, w, h } of splashScreens) {
    const iconSize = Math.round(Math.min(w, h) * 0.25); // Ãcone = 25% da menor dimensÃ£o
    const iconBuf = await sharp(svgBuffer)
      .resize(iconSize, iconSize, { fit: 'contain', background: { r: 26, g: 29, b: 38, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: { width: w, height: h, channels: 4, background: { r: 26, g: 29, b: 38, alpha: 1 } }
    })
      .composite([{ input: iconBuf, gravity: 'centre' }])
      .png()
      .toFile(resolve(PUBLIC, file));
    console.log(`âœ… ${file} (${w}x${h})`);
  }

  // â”€â”€â”€ favicon.ico (multi-resoluÃ§Ã£o: 16 + 32 + 48) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  try {
    const { default: toIco } = await import('to-ico');
    const pngs = [
      readFileSync(resolve(PUBLIC, 'favicon-16x16.png')),
      readFileSync(resolve(PUBLIC, 'favicon-32x32.png')),
      readFileSync(resolve(PUBLIC, 'favicon-48x48.png')),
    ];
    const ico = await toIco(pngs);
    writeFileSync(resolve(PUBLIC, 'favicon.ico'), ico);
    console.log('âœ… favicon.ico (16+32+48px multi-resoluÃ§Ã£o)');
  } catch (error) {
    console.warn('âš ï¸   to-ico nÃ£o encontrado ou falhou â€” instale com: npm i -D to-ico');
  }

  console.log('\nðŸŽ‰ Todos os assets PWA gerados em /public/');
}

generateAssets().catch(console.error);

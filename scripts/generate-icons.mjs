import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const publicDir = './public';
if (!existsSync(publicDir)) {
  mkdirSync(publicDir);
}

const faviconPath = './public/favicon.svg';
const ogPath = './public/og-image.svg';

async function generateIcons() {
  console.log('--- Inicando geração de ícones ---');
  
  try {
    const faviconBuffer = readFileSync(faviconPath);

    const icons = [
      { file: 'favicon-16x16.png', size: 16 },
      { file: 'favicon-32x32.png', size: 32 },
      { file: 'apple-touch-icon.png', size: 180 },
      { file: 'android-chrome-192x192.png', size: 192 },
      { file: 'android-chrome-512x512.png', size: 512 },
      { file: 'mstile-70x70.png', size: 70 },
      { file: 'mstile-144x144.png', size: 144 },
      { file: 'mstile-150x150.png', size: 150 },
      { file: 'mstile-310x310.png', size: 310 },
    ];

    for (const { file, size } of icons) {
      await sharp(faviconBuffer)
        .resize(size, size)
        .png()
        .toFile(`${publicDir}/${file}`);
      console.log(`✅ Gerado: ${file} (${size}x${size})`);
    }

    // Gerar wide tile 310x150
    await sharp(faviconBuffer)
      .resize(310, 150, { fit: 'contain', background: { r: 26, g: 29, b: 38, alpha: 1 } })
      .png()
      .toFile(`${publicDir}/mstile-310x150.png`);
    console.log('✅ Gerado: mstile-310x150.png (310x150)');

    // Gerar favicon.ico
    const pngs = await Promise.all([16, 32].map(async s => {
      return await sharp(faviconBuffer).resize(s, s).png().toBuffer();
    }));
    const ico = await toIco(pngs);
    writeFileSync(`${publicDir}/favicon.ico`, ico);
    console.log('✅ Gerado: favicon.ico');

    // Gerar OG Image PNG
    if (existsSync(ogPath)) {
      const ogBuffer = readFileSync(ogPath);
      await sharp(ogBuffer)
        .resize(1200, 630)
        .png()
        .toFile(`${publicDir}/og-image.png`);
      console.log('✅ Gerado: og-image.png (1200x630)');
    }

    console.log('--- Geração de ícones concluída ---');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();

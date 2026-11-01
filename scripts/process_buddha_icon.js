const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImage() {
  const inputPath = path.join(__dirname, '../public/images/buddha_bodhi_tree.png');
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  
  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  
  // Create transparent black silhouette buffer
  const blackBuffer = Buffer.alloc(width * height * 4);
  // Create transparent gold (#d97706 / saffron-600) silhouette buffer
  const goldBuffer = Buffer.alloc(width * height * 4);
  // Create mask buffer (white on transparent)
  const maskBuffer = Buffer.alloc(width * height * 4);

  const bgLum = 224;
  const fgLum = 50;

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (lum <= fgLum) {
      alpha = 255;
    } else if (lum >= bgLum) {
      alpha = 0;
    } else {
      alpha = Math.round(255 * (bgLum - lum) / (bgLum - fgLum));
    }

    const dstIdx = i * 4;
    // Black silhouette
    blackBuffer[dstIdx] = 0;
    blackBuffer[dstIdx + 1] = 0;
    blackBuffer[dstIdx + 2] = 0;
    blackBuffer[dstIdx + 3] = alpha;

    // Gold/saffron silhouette (#d97706: 217, 119, 6)
    goldBuffer[dstIdx] = 217;
    goldBuffer[dstIdx + 1] = 119;
    goldBuffer[dstIdx + 2] = 6;
    goldBuffer[dstIdx + 3] = alpha;

    // Mask (white with alpha)
    maskBuffer[dstIdx] = 255;
    maskBuffer[dstIdx + 1] = 255;
    maskBuffer[dstIdx + 2] = 255;
    maskBuffer[dstIdx + 3] = alpha;
  }

  const iconsDir = path.join(__dirname, '../public/icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  await sharp(blackBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(iconsDir, 'buddha_bodhi_black.png'));

  await sharp(goldBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(iconsDir, 'buddha_bodhi_gold.png'));

  // Also create a crisp 128x128 and 64x64 for favicon / micro-icons
  await sharp(goldBuffer, { raw: { width, height, channels: 4 } })
    .resize(128, 128)
    .png()
    .toFile(path.join(iconsDir, 'buddha_bodhi_128.png'));

  await sharp(goldBuffer, { raw: { width, height, channels: 4 } })
    .resize(64, 64)
    .png()
    .toFile(path.join(iconsDir, 'buddha_bodhi_64.png'));

  // SVG version with mask
  const goldBase64 = (await sharp(goldBuffer, { raw: { width, height, channels: 4 } }).png().toBuffer()).toString('base64');
  const blackBase64 = (await sharp(blackBuffer, { raw: { width, height, channels: 4 } }).png().toBuffer()).toString('base64');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="currentColor" width="100%" height="100%">
  <defs>
    <mask id="buddha-bodhi-mask">
      <image href="data:image/png;base64,${blackBase64}" width="${width}" height="${height}" />
    </mask>
  </defs>
  <rect width="${width}" height="${height}" fill="currentColor" mask="url(#buddha-bodhi-mask)" />
</svg>`;

  fs.writeFileSync(path.join(iconsDir, 'buddha_bodhi.svg'), svgContent);

  console.log('Successfully generated transparent Buddha Bodhi icon assets!');
}

processImage().catch(console.error);

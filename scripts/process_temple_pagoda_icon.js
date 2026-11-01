const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processIcon() {
  const inputPath = 'C:/Users/qockh/.gemini/antigravity-ide/brain/41c74255-813b-450c-b378-5d9f134ce1d9/.user_uploaded/media_1791702708512.png';
  const iconsDir = path.join(__dirname, '../public/icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  // Crop centered around the temple silhouette: center (490, 490), size 840
  const cropSize = 840;
  const left = 70;
  const top = 70;

  const cropped = await sharp(inputPath)
    .extract({ left, top, width: cropSize, height: cropSize })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const blackBuf = Buffer.alloc(width * height * 4);
  const lotusBuf = Buffer.alloc(width * height * 4);
  const goldBuf = Buffer.alloc(width * height * 4);

  const bgLum = 240;
  const fgLum = 40;

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

    // Black mask
    blackBuf[dstIdx] = 0;
    blackBuf[dstIdx + 1] = 0;
    blackBuf[dstIdx + 2] = 0;
    blackBuf[dstIdx + 3] = alpha;

    // Lotus color (#be185d / 190, 24, 93)
    lotusBuf[dstIdx] = 190;
    lotusBuf[dstIdx + 1] = 24;
    lotusBuf[dstIdx + 2] = 93;
    lotusBuf[dstIdx + 3] = alpha;

    // Saffron gold (#d97706 / 217, 119, 6)
    goldBuf[dstIdx] = 217;
    goldBuf[dstIdx + 1] = 119;
    goldBuf[dstIdx + 2] = 6;
    goldBuf[dstIdx + 3] = alpha;
  }

  // Save 512x512 master PNGs
  await sharp(blackBuf, { raw: { width, height, channels: 4 } })
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'temple_pagoda_black.png'));

  await sharp(lotusBuf, { raw: { width, height, channels: 4 } })
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'temple_pagoda_lotus.png'));

  await sharp(goldBuf, { raw: { width, height, channels: 4 } })
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'temple_pagoda_gold.png'));

  console.log('Successfully generated Temple Pagoda icon PNGs!');
}

processIcon().catch(console.error);

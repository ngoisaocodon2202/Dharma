const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processIcon() {
  const inputPath = 'C:/Users/qockh/.gemini/antigravity-ide/brain/41c74255-813b-450c-b378-5d9f134ce1d9/.user_uploaded/media_1791703004006.png';
  const iconsDir = path.join(__dirname, '../public/icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  const rawImage = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = rawImage;
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Find bounding box of silhouette (lum < 230)
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < 230) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  const centerX = Math.round((minX + maxX) / 2);
  const centerY = Math.round((minY + maxY) / 2);

  // We want the icon to have comfortable padding (~460px in 512px canvas, matching temple pagoda and meditation)
  const targetDimension = 460;
  const maxDim = Math.max(contentW, contentH);
  // Scale factor to fit maxDim into targetDimension
  const scale = targetDimension / maxDim;

  // Build transparent RGBA buffer from original image
  const blackBuf = Buffer.alloc(width * height * 4);
  const saffronBuf = Buffer.alloc(width * height * 4);

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

    // Saffron color (#b45309 / 180, 83, 9)
    saffronBuf[dstIdx] = 180;
    saffronBuf[dstIdx + 1] = 83;
    saffronBuf[dstIdx + 2] = 9;
    saffronBuf[dstIdx + 3] = alpha;
  }

  // Crop exactly to content bounding box
  const croppedBlack = await sharp(blackBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: contentW, height: contentH })
    .png()
    .toBuffer();

  const croppedSaffron = await sharp(saffronBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: contentW, height: contentH })
    .png()
    .toBuffer();

  // Create 512x512 transparent canvas and composite resized content centered
  const scaledW = Math.round(contentW * scale);
  const scaledH = Math.round(contentH * scale);

  const resizedBlack = await sharp(croppedBlack).resize(scaledW, scaledH).toBuffer();
  const resizedSaffron = await sharp(croppedSaffron).resize(scaledW, scaledH).toBuffer();

  const offsetX = Math.round((512 - scaledW) / 2);
  const offsetY = Math.round((512 - scaledH) / 2);

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resizedBlack, left: offsetX, top: offsetY }])
    .png()
    .toFile(path.join(iconsDir, 'dharma_book_black.png'));

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resizedSaffron, left: offsetX, top: offsetY }])
    .png()
    .toFile(path.join(iconsDir, 'dharma_book_saffron.png'));

  console.log(`Saved dharma_book_black.png and dharma_book_saffron.png with scaled size ${scaledW}x${scaledH} in 512x512!`);
}

processIcon().catch(console.error);

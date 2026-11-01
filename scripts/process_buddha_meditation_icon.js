const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processIcon() {
  const inputPath = 'C:/Users/qockh/.gemini/antigravity-ide/brain/41c74255-813b-450c-b378-5d9f134ce1d9/.user_uploaded/media_1791702232704.jpg';
  const iconsDir = path.join(__dirname, '../public/icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  // 1. Crop to square around Buddha: x: 212, y: 141, size: 678
  const cropSize = 678;
  const left = 212;
  const top = 141;

  const cropped = await sharp(inputPath)
    .extract({ left, top, width: cropSize, height: cropSize })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const width = info.width;
  const height = info.height;

  const bgLum = 222;
  const fgLum = 55;

  const blackBuf = Buffer.alloc(width * height * 4);
  const jadeBuf = Buffer.alloc(width * height * 4);
  const goldBuf = Buffer.alloc(width * height * 4);

  const haloCenterX = 339;
  const haloCenterY = 180;
  const haloRadius = 180;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const srcIdx = i * 3;
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

      // Filter out stray background texture marks outside halo in the upper region
      if (y < 200) {
        const distFromHalo = Math.hypot(x - haloCenterX, y - haloCenterY);
        if (distFromHalo > haloRadius + 15) {
          alpha = 0;
        }
      }

      const dstIdx = i * 4;

      blackBuf[dstIdx] = 0;
      blackBuf[dstIdx + 1] = 0;
      blackBuf[dstIdx + 2] = 0;
      blackBuf[dstIdx + 3] = alpha;

      jadeBuf[dstIdx] = 4;
      jadeBuf[dstIdx + 1] = 120;
      jadeBuf[dstIdx + 2] = 87;
      jadeBuf[dstIdx + 3] = alpha;

      goldBuf[dstIdx] = 217;
      goldBuf[dstIdx + 1] = 119;
      goldBuf[dstIdx + 2] = 6;
      goldBuf[dstIdx + 3] = alpha;
    }
  }

  // Find tight bounding box of alpha
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = blackBuf[(y * width + x) * 4 + 3];
      if (a > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;

  async function saveCentered(rawBuf, filename) {
    const extracted = await sharp(rawBuf, { raw: { width, height, channels: 4 } })
      .extract({ left: minX, top: minY, width: boxW, height: boxH })
      .png()
      .toBuffer();

    const targetH = 447;
    const scale = targetH / boxH;
    const scaledW = Math.round(boxW * scale);
    const scaledH = Math.round(boxH * scale);

    const resized = await sharp(extracted).resize(scaledW, scaledH).toBuffer();
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
      .composite([{ input: resized, left: offsetX, top: offsetY }])
      .png()
      .toFile(path.join(iconsDir, filename));
  }

  await saveCentered(blackBuf, 'buddha_meditation_black.png');
  await saveCentered(jadeBuf, 'buddha_meditation_jade.png');
  await saveCentered(goldBuf, 'buddha_meditation_gold.png');

  console.log('Successfully generated perfectly centered Buddha Meditation icon PNGs!');
}

processIcon().catch(console.error);

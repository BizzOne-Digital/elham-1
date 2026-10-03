/**
 * Prepares header/footer logo PNGs: keys out white matte, aligns accent color to site teal.
 * Usage: node scripts/process-brand-logo.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public", "brand");
const logoFiles = ["logo.png", "logo-source.png"].map((name) => path.join(brandDir, name));
const faviconPath = path.join(brandDir, "favicon.png");
const VOID = { r: 11, g: 17, b: 32, alpha: 1 };

function processPixels(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    const a = pixels[i + 3];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    if (min > 235 && chroma < 20) {
      pixels[i + 3] = 0;
      continue;
    }
    if (min > 200 && chroma < 28) {
      const t = (min - 200) / 35;
      pixels[i + 3] = Math.round(a * (1 - Math.min(1, t)));
      continue;
    }

    if (max > 80 && b > r && g > 60) {
      g = Math.min(255, g + 18);
      b = Math.max(0, b - 8);
      r = Math.max(0, r - 6);
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }

    if (r > 210 && g > 210 && b > 210 && chroma < 25) {
      pixels[i] = 248;
      pixels[i + 1] = 250;
      pixels[i + 2] = 252;
    }
  }
}

async function processLogo(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing: ${filePath}`);
    return;
  }

  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  processPixels(pixels);

  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(filePath);

  console.log(`Processed ${path.basename(filePath)}`);
}

for (const filePath of logoFiles) {
  await processLogo(filePath);
}

const headerLogo = path.join(brandDir, "logo.png");
if (fs.existsSync(headerLogo)) {
  await sharp(headerLogo)
    .resize(64, 64, { fit: "contain", background: { ...VOID, alpha: 0 } })
    .flatten({ background: VOID })
    .png()
    .toFile(faviconPath);
  console.log(`Wrote favicon.png`);
}

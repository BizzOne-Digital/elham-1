/**
 * Builds site-ready logo assets from the client's black-matte source file.
 * Usage: node scripts/process-brand-logo.mjs [input.png]
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const inputPath = path.resolve(
  root,
  process.argv[2] ?? path.join(root, "public", "brand", "logo-source.png"),
);
const outputPath = path.join(root, "public", "brand", "logo.png");
const faviconPath = path.join(root, "public", "brand", "favicon.png");

const VOID = { r: 11, g: 17, b: 32, alpha: 1 };

if (!fs.existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}

// Keep full lockup for header/footer; black matte is removed in CSS via mix-blend-mode.
await sharp(inputPath).png({ compressionLevel: 9 }).toFile(outputPath);

// Favicon: flatten onto site void-black so there is no contrasting box in browser chrome.
await sharp(inputPath)
  .resize(64, 64, { fit: "contain", background: VOID })
  .flatten({ background: VOID })
  .png()
  .toFile(faviconPath);

console.log(`Wrote ${outputPath} and ${faviconPath}`);

import sharp from "sharp";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");

async function optimizeDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await optimizeDirectory(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    console.log(`Optimizing ${fullPath}`);

    try {
      const buffer = await sharp(fullPath)
        .rotate()
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .png({
          quality: 80,
          compressionLevel: 9,
        })
        .webp({
          quality: 80,
        })
        .toBuffer();

      fs.writeFileSync(fullPath, buffer);

      console.log(`✔ Optimized ${file}`);
    } catch (err) {
      console.error(`✘ Failed ${file}`, err.message);
    }
  }
}

optimizeDirectory(PUBLIC_DIR);

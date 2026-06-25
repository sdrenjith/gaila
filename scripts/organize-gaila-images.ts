/**
 * Organize bulk-uploaded images from public/uploads/gaila into category folders,
 * rename to kebab-case, and register MediaAsset records in MongoDB.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { mkdir, readdir, rename, stat } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { slugify } from "../src/lib/slug";
import { MediaAsset } from "../src/models/MediaAsset";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

const SOURCE_DIR = resolve(process.cwd(), "public", "uploads", "gaila");
const UPLOADS_ROOT = resolve(process.cwd(), "public", "uploads");

type ImageCategory = "weddings" | "events" | "corporate" | "gallery" | "content" | "desserts";

const CATEGORY_HINTS: Array<{ pattern: RegExp; category: ImageCategory; label: string }> = [
  { pattern: /wedding|chiavari|floral|bridal|celebration-hall|bouquet/i, category: "weddings", label: "wedding" },
  { pattern: /corporate|conference|gala|summit|business/i, category: "corporate", label: "corporate" },
  { pattern: /dessert|sweet|cake|candy|pastry/i, category: "desserts", label: "dessert" },
  { pattern: /banner|chatgpt|brand|studio|team/i, category: "content", label: "brand" },
  { pattern: /graduation|newborn|balloon|decor/i, category: "events", label: "event" },
];

function inferCategory(filename: string, index: number): { category: ImageCategory; label: string } {
  const lower = filename.toLowerCase();
  for (const hint of CATEGORY_HINTS) {
    if (hint.pattern.test(lower)) {
      return { category: hint.category, label: hint.label };
    }
  }
  const rotation: ImageCategory[] = ["weddings", "events", "corporate", "gallery", "desserts", "content"];
  const category = rotation[index % rotation.length];
  return { category, label: category.slice(0, -1) || "event" };
}

function buildSafeName(original: string, label: string, counter: number): string {
  const ext = extname(original).toLowerCase() || ".jpg";
  const stem = basename(original, extname(original));
  const slug = slugify(stem.replace(/^\d+/, "").replace(/улучшено-nr/i, "enhanced"));
  const base = slug && slug.length > 2 ? slug.slice(0, 48) : `${label}-photo`;
  return `${base}-${String(counter).padStart(3, "0")}${ext}`;
}

function mimeForExt(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext.toLowerCase()] || "image/jpeg";
}

function titleFromFilename(name: string): string {
  const stem = basename(name, extname(name));
  return stem
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function organize() {
  if (!existsSync(SOURCE_DIR)) {
    console.log(`Source folder not found: ${SOURCE_DIR}`);
    return;
  }

  const files = (await readdir(SOURCE_DIR))
    .filter((f) => !f.startsWith("."))
    .sort();

  if (files.length === 0) {
    console.log("No files to organize.");
    return;
  }

  const counters: Record<ImageCategory, number> = {
    weddings: 0,
    events: 0,
    corporate: 0,
    gallery: 0,
    content: 0,
    desserts: 0,
  };

  const manifest: Array<{
    original: string;
    url: string;
    category: ImageCategory;
    filename: string;
  }> = [];

  for (let i = 0; i < files.length; i++) {
    const original = files[i];
    const { category, label } = inferCategory(original, i);
    counters[category] += 1;
    const safeName = buildSafeName(original, label, counters[category]);
    const destDir = join(UPLOADS_ROOT, category);
    await mkdir(destDir, { recursive: true });
    const destPath = join(destDir, safeName);
    const srcPath = join(SOURCE_DIR, original);

    await rename(srcPath, destPath);

    const url = `/uploads/${category}/${safeName}`;
    manifest.push({ original, url, category, filename: safeName });
    console.log(`${original} → ${url}`);
  }

  await connectDB();

  let registered = 0;
  for (const entry of manifest) {
    const filePath = join(UPLOADS_ROOT, entry.category, entry.filename);
    let size = 0;
    try {
      const fileStat = await stat(filePath);
      size = fileStat.size;
    } catch {
      size = 0;
    }

    const ext = extname(entry.filename);
    await MediaAsset.updateOne(
      { url: entry.url },
      {
        $set: {
          title: titleFromFilename(entry.filename),
          url: entry.url,
          alt: `Gaila ${entry.category} event styling`,
          folder: entry.category,
          mimeType: mimeForExt(ext),
          size,
        },
      },
      { upsert: true },
    );
    registered += 1;
  }

  await disconnectDB();

  console.log(`\nOrganized ${manifest.length} images into category folders.`);
  console.log(`Registered ${registered} MediaAsset records.`);
  console.log("Category counts:", counters);
}

organize().catch((error) => {
  console.error(error);
  process.exit(1);
});

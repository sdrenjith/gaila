import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { gallerySections } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import type { PageRecord, PageSection } from "../src/types/cms";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

const GRID_DEFAULTS = gallerySections.find((section) => section.id === "gallery-grid");

function mergeGalleryGridSection(sections: PageSection[]): PageSection[] {
  if (!GRID_DEFAULTS) {
    throw new Error("gallery-grid defaults missing from gallerySections");
  }

  const existingIndex = sections.findIndex((section) => section.id === "gallery-grid");
  if (existingIndex >= 0) {
    return sections.map((section) => {
      if (section.id !== "gallery-grid") {
        return section;
      }
      return {
        ...section,
        eyebrow: GRID_DEFAULTS.eyebrow,
        title: GRID_DEFAULTS.title,
        subtitle: GRID_DEFAULTS.subtitle,
        settings: {
          ...section.settings,
          columns: GRID_DEFAULTS.settings?.columns ?? 4,
          defaultCategory: GRID_DEFAULTS.settings?.defaultCategory ?? "weddings",
          categories: GRID_DEFAULTS.settings?.categories ?? [],
          items: [],
        },
      };
    });
  }

  const heroIndex = sections.findIndex((section) => section.id === "gallery-hero");
  const insertAt = heroIndex >= 0 ? heroIndex + 1 : sections.length;
  const next = [...sections];
  next.splice(insertAt, 0, GRID_DEFAULTS);
  return next;
}

async function updateGalleryPage() {
  if (!GRID_DEFAULTS) {
    throw new Error("gallery-grid defaults missing from gallerySections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "gallery" }).lean<PageRecord>();
  if (!page) {
    console.log("No gallery page in database — skipping gallery update.");
  } else {
    const sections = mergeGalleryGridSection(page.sections);
    const pageResult = await Page.updateOne({ slug: "gallery" }, { $set: { sections } });
    console.log(
      `Gallery page updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  await disconnectDB();
}

updateGalleryPage().catch((error) => {
  console.error(error);
  process.exit(1);
});

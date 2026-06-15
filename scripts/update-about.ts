import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { aboutSections, defaultPages } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import type { PageRecord } from "../src/types/cms";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

const ABOUT_DEFAULTS = defaultPages.find((page) => page.slug === "about");
const DEFAULT_SECTION_IDS = new Set(aboutSections.map((section) => section.id));

async function updateAboutPage() {
  if (!ABOUT_DEFAULTS) {
    throw new Error("about page defaults missing from defaultPages");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "about" }).lean<PageRecord>();
  if (!page) {
    console.log("No about page in database — skipping update.");
    await disconnectDB();
    return;
  }

  const legacyIds = page.sections
    .map((section) => section.id)
    .filter((id) => !DEFAULT_SECTION_IDS.has(id));
  const sections = aboutSections.map((defaults) => {
    const current = page.sections.find((section) => section.id === defaults.id);
    if (!current) return defaults;
    return {
      ...current,
      type: defaults.type,
      enabled: defaults.enabled,
      eyebrow: defaults.eyebrow,
      title: defaults.title,
      subtitle: defaults.subtitle,
      settings: { ...current.settings, ...defaults.settings },
    };
  });
  const sectionOrder = sections.map((section) => section.id).join(" → ");

  const result = await Page.updateOne(
    { slug: "about" },
    {
      $set: {
        seo: ABOUT_DEFAULTS.seo,
        sections,
        showInHeader: ABOUT_DEFAULTS.showInHeader,
        headerLabel: ABOUT_DEFAULTS.headerLabel,
        headerOrder: ABOUT_DEFAULTS.headerOrder,
      },
    },
  );

  console.log(`About page updated — matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);
  console.log(`Section order: ${sectionOrder}`);
  if (legacyIds.length > 0) {
    console.log(`Removed legacy sections: ${legacyIds.join(", ")}`);
  }

  await disconnectDB();
}

updateAboutPage().catch((error) => {
  console.error(error);
  process.exit(1);
});

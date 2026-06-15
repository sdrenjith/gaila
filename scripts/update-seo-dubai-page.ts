import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defaultPages, seoDubaiSections, services } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Content } from "../src/models/Content";
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

const SEO_DUBAI_PAGE_SLUG = "service-seo-dubai";
const SEO_DUBAI_CONTENT_SLUG = "seo-dubai";
const PAGE_DEFAULTS = defaultPages.find((page) => page.slug === SEO_DUBAI_PAGE_SLUG);
const CONTENT_DEFAULTS = services.find((service) => service.slug === SEO_DUBAI_CONTENT_SLUG);
const DEFAULT_SECTION_IDS = new Set(seoDubaiSections.map((section) => section.id));

function mergeSections(existing: PageSection[]): PageSection[] {
  const existingById = new Map(existing.map((section) => [section.id, section]));
  const ordered: PageSection[] = [];

  for (const defaults of seoDubaiSections) {
    const current = existingById.get(defaults.id);
    if (current) {
      ordered.push({
        ...current,
        type: defaults.type,
        enabled: defaults.enabled,
        eyebrow: defaults.eyebrow,
        title: defaults.title,
        subtitle: defaults.subtitle,
        settings: { ...current.settings, ...defaults.settings },
      });
      existingById.delete(defaults.id);
    } else {
      ordered.push(defaults);
    }
  }

  for (const section of existing) {
    if (!DEFAULT_SECTION_IDS.has(section.id)) {
      ordered.push(section);
    }
  }

  return ordered;
}

async function updateSeoDubaiPage() {
  if (!PAGE_DEFAULTS) {
    throw new Error("service-seo-dubai page defaults missing from defaultPages");
  }
  if (!CONTENT_DEFAULTS) {
    throw new Error("seo-dubai content defaults missing from services");
  }

  await connectDB();

  const pageResult = await Page.updateOne(
    { slug: SEO_DUBAI_PAGE_SLUG },
    { $set: PAGE_DEFAULTS },
    { upsert: true },
  );

  const existingPage = await Page.findOne({ slug: SEO_DUBAI_PAGE_SLUG }).lean<PageRecord>();
  if (existingPage) {
    const sections = mergeSections(existingPage.sections);
    await Page.updateOne({ slug: SEO_DUBAI_PAGE_SLUG }, { $set: { sections } });
    console.log(`Section order: ${sections.map((section) => section.id).join(" → ")}`);
  }

  const contentResult = await Content.updateOne(
    { slug: SEO_DUBAI_CONTENT_SLUG },
    { $set: CONTENT_DEFAULTS },
    { upsert: true },
  );

  console.log(
    `SEO Dubai page — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}, upserted: ${pageResult.upsertedCount ? "yes" : "no"}`,
  );
  console.log(
    `SEO Dubai content — matched: ${contentResult.matchedCount}, modified: ${contentResult.modifiedCount}, upserted: ${contentResult.upsertedCount ? "yes" : "no"}`,
  );

  await disconnectDB();
}

updateSeoDubaiPage().catch((error) => {
  console.error(error);
  process.exit(1);
});

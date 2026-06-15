import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  defaultPages,
  footerMenuItems,
  headerMenuItems,
  services,
  servicesSections,
} from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Content } from "../src/models/Content";
import { NavigationMenu } from "../src/models/NavigationMenu";
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

const SERVICES_DEFAULTS = defaultPages.find((page) => page.slug === "services");
const DEFAULT_SECTION_IDS = new Set(servicesSections.map((section) => section.id));
const REMOVED_SECTION_IDS = new Set(["services-intro", "services-tailored"]);
const NEW_SERVICE_SLUGS = new Set(["influencer-marketing", "public-relations"]);

function mergeSections(existing: PageSection[]): PageSection[] {
  const existingById = new Map(existing.map((section) => [section.id, section]));
  const ordered: PageSection[] = [];

  for (const defaults of servicesSections) {
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
    if (!DEFAULT_SECTION_IDS.has(section.id) && !REMOVED_SECTION_IDS.has(section.id)) {
      ordered.push(section);
    }
  }

  return ordered;
}

async function updateServicesConsolidation() {
  if (!SERVICES_DEFAULTS) {
    throw new Error("services page defaults missing from defaultPages");
  }

  await connectDB();

  const pageResult = await Page.updateOne(
    { slug: "services" },
    { $set: SERVICES_DEFAULTS },
    { upsert: true },
  );

  const existingPage = await Page.findOne({ slug: "services" }).lean<PageRecord>();
  if (existingPage) {
    const sections = mergeSections(existingPage.sections);
    await Page.updateOne({ slug: "services" }, { $set: { sections } });
    console.log(`Section order: ${sections.map((section) => section.id).join(" → ")}`);
  }

  const removedPage = await Page.deleteOne({ slug: "our-services" });
  console.log(
    `Removed our-services page — deleted: ${removedPage.deletedCount}`,
  );

  for (const item of services.filter((service) => NEW_SERVICE_SLUGS.has(service.slug))) {
    const contentResult = await Content.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
    console.log(
      `Service ${item.slug} — matched: ${contentResult.matchedCount}, modified: ${contentResult.modifiedCount}, upserted: ${contentResult.upsertedCount ? "yes" : "no"}`,
    );
  }

  const headerNavResult = await NavigationMenu.updateOne(
    { location: "header" },
    {
      $set: {
        location: "header",
        title: "Header Menu",
        items: headerMenuItems,
      },
    },
    { upsert: true },
  );

  const footerNavResult = await NavigationMenu.updateOne(
    { location: "footer" },
    {
      $set: {
        location: "footer",
        title: "Footer Menu",
        items: footerMenuItems,
      },
    },
    { upsert: true },
  );

  console.log(
    `Services page — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}, upserted: ${pageResult.upsertedCount ? "yes" : "no"}`,
  );
  console.log(
    `Header menu updated — matched: ${headerNavResult.matchedCount}, modified: ${headerNavResult.modifiedCount}`,
  );
  console.log(
    `Footer menu updated — matched: ${footerNavResult.matchedCount}, modified: ${footerNavResult.modifiedCount}`,
  );

  await disconnectDB();
}

updateServicesConsolidation().catch((error) => {
  console.error(error);
  process.exit(1);
});

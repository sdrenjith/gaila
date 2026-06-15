import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { homeSections } from "../src/lib/default-content";
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

const FAQ_DEFAULTS = homeSections.find((section) => section.id === "faq");

function mergeHomeFaqSection(sections: PageSection[]): PageSection[] {
  if (!FAQ_DEFAULTS) {
    throw new Error("faq defaults missing from homeSections");
  }

  const existingIndex = sections.findIndex((section) => section.id === "faq");
  if (existingIndex >= 0) {
    return sections.map((section) => {
      if (section.id !== "faq") {
        return section;
      }
      return {
        ...section,
        eyebrow: FAQ_DEFAULTS.eyebrow,
        title: FAQ_DEFAULTS.title,
        subtitle: FAQ_DEFAULTS.subtitle,
        settings: {
          ...section.settings,
          faqs: FAQ_DEFAULTS.settings?.faqs ?? [],
        },
      };
    });
  }

  const ctaIndex = sections.findIndex((section) => section.id === "cta");
  const insertAt = ctaIndex >= 0 ? ctaIndex : sections.length;
  const next = [...sections];
  next.splice(insertAt, 0, FAQ_DEFAULTS);
  return next;
}

async function updateHomeFaq() {
  if (!FAQ_DEFAULTS) {
    throw new Error("faq defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping FAQ update.");
  } else {
    const sections = mergeHomeFaqSection(page.sections);
    const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(
      `Home FAQ updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  await disconnectDB();
}

updateHomeFaq().catch((error) => {
  console.error(error);
  process.exit(1);
});

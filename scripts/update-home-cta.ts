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

const CTA_DEFAULTS = homeSections.find((section) => section.id === "cta");

async function updateHomeCta() {
  if (!CTA_DEFAULTS) {
    throw new Error("cta defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping CTA section update.");
  } else {
    const sections = page.sections.map((section: PageSection) =>
      section.id === "cta" ? { ...CTA_DEFAULTS } : section,
    );

    const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(
      `Home CTA section updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );

    const updated = sections.find((section) => section.id === "cta");
    console.log("Updated CTA section:", JSON.stringify(updated, null, 2));
  }

  await disconnectDB();
}

updateHomeCta().catch((error) => {
  console.error(error);
  process.exit(1);
});

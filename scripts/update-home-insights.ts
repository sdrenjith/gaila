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

const INSIGHTS_DEFAULTS = homeSections.find((section) => section.id === "insights");

async function updateHomeInsights() {
  if (!INSIGHTS_DEFAULTS) {
    throw new Error("insights defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping insights section update.");
  } else {
    const hasInsights = page.sections.some((section) => section.id === "insights");
    const sections: PageSection[] = hasInsights
      ? page.sections.map((section) =>
          section.id === "insights" ? { ...INSIGHTS_DEFAULTS } : section,
        )
      : [...page.sections, INSIGHTS_DEFAULTS];

    const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(
      `Home insights scroll section updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  await disconnectDB();
}

updateHomeInsights().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import type { PageRecord } from "../src/types/cms";

const SECTION_ID = "ambient-showcase";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

async function removeAmbientShowcase() {
  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping section removal.");
  } else {
    const before = page.sections.length;
    const sections = page.sections.filter((section) => section.id !== SECTION_ID);
    const removed = before - sections.length;

    if (removed === 0) {
      console.log(`Section "${SECTION_ID}" not found on home page — nothing to remove.`);
    } else {
      const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
      console.log(
        `Removed "${SECTION_ID}" from home page — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
      );
      console.log(`Sections before: ${before}, after: ${sections.length}`);
    }
  }

  await disconnectDB();
}

removeAmbientShowcase().catch((error) => {
  console.error(error);
  process.exit(1);
});

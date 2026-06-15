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

const PROCESS_DEFAULTS = homeSections.find((section) => section.id === "process");

async function updateHomeProcess() {
  if (!PROCESS_DEFAULTS) {
    throw new Error("process defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping process update.");
  } else {
    const sections = page.sections.map((section: PageSection) => {
      if (section.id !== "process") {
        return section;
      }
      return {
        ...section,
        eyebrow: PROCESS_DEFAULTS.eyebrow,
        title: PROCESS_DEFAULTS.title,
        settings: {
          ...section.settings,
          steps: PROCESS_DEFAULTS.settings?.steps ?? [],
        },
      };
    });

    const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(
      `Home process updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  await disconnectDB();
}

updateHomeProcess().catch((error) => {
  console.error(error);
  process.exit(1);
});

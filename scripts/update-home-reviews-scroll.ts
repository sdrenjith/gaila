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

const REVIEWS_SCROLL_DEFAULTS = homeSections.find((section) => section.id === "google-reviews-scroll");
const REMOVED_SECTION_IDS = new Set(["google-reviews", "insights"]);

async function updateHomeReviewsScroll() {
  if (!REVIEWS_SCROLL_DEFAULTS) {
    throw new Error("google-reviews-scroll defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping reviews scroll section update.");
  } else {
    const withoutRemoved = page.sections.filter((section) => !REMOVED_SECTION_IDS.has(section.id));
    const withoutReviews = withoutRemoved.filter((section) => section.id !== "google-reviews-scroll");
    const clientQuoteIndex = withoutReviews.findIndex((section) => section.id === "client-quote");
    const insertAt = clientQuoteIndex >= 0 ? clientQuoteIndex + 1 : withoutReviews.length;

    const sections: PageSection[] = [
      ...withoutReviews.slice(0, insertAt),
      { ...REVIEWS_SCROLL_DEFAULTS },
      ...withoutReviews.slice(insertAt),
    ];

    const pageResult = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(
      `Home reviews scroll section updated — removed: ${[...REMOVED_SECTION_IDS].join(", ")}, reset: google-reviews-scroll (scrollHeightVh: 0), positioned after client-quote — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  await disconnectDB();
}

updateHomeReviewsScroll().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { homeSections } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
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

const HEADER_CTA_HREF = "tel:+971502827279";
const HERO_DEFAULTS = homeSections.find((section) => section.id === "hero-editorial");

async function updateHomeHeroAndHeaderCta() {
  if (!HERO_DEFAULTS) {
    throw new Error("hero-editorial defaults missing from homeSections");
  }

  await connectDB();

  const page = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (!page) {
    console.log("No home page in database — skipping page hero update.");
  } else {
    const heroSettings = HERO_DEFAULTS.settings as Record<string, unknown>;
    const sections = page.sections.map((section: PageSection) => {
      if (section.id !== "hero-editorial") {
        return section;
      }
      return {
        ...section,
        title: HERO_DEFAULTS.title,
        subtitle: HERO_DEFAULTS.subtitle,
        settings: {
          ...section.settings,
          ctaLabel: heroSettings.ctaLabel,
          ctaHref: heroSettings.ctaHref,
          secondaryCtaLabel: heroSettings.secondaryCtaLabel,
          secondaryCtaHref: heroSettings.secondaryCtaHref,
        },
      };
    });

    const pageResult = await Page.updateOne(
      { slug: "home" },
      { $set: { sections } },
    );
    console.log(
      `Home hero updated — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`,
    );
  }

  const menuResult = await NavigationMenu.updateOne(
    { location: "header" },
    { $set: { "cta.href": HEADER_CTA_HREF } },
  );
  console.log(
    `Header CTA href updated — matched: ${menuResult.matchedCount}, modified: ${menuResult.modifiedCount}`,
  );

  const headerMenu = await NavigationMenu.findOne(
    { location: "header" },
    { cta: 1 },
  ).lean<{ cta?: { label: string; href: string; visible: boolean } }>();
  console.log("Header CTA after update:", headerMenu?.cta ?? "(missing)");

  await disconnectDB();
}

updateHomeHeroAndHeaderCta().catch((error) => {
  console.error(error);
  process.exit(1);
});

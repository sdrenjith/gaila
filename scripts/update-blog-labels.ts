import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defaultPages, headerMenuItems } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Category } from "../src/models/Category";
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

function getBlogDefaults() {
  const blogDefaults = defaultPages.find((page) => page.slug === "blog");
  if (!blogDefaults) {
    throw new Error("blog page defaults missing from defaultPages");
  }
  return blogDefaults;
}

type HeroCategory = { label?: string; href?: string; meta?: string };

function relabelInsightsInSections(sections: PageSection[]): PageSection[] {
  return sections.map((section) => {
    const settings = section.settings as Record<string, unknown> | undefined;
    const next: PageSection = { ...section };
    let changed = false;

    if (section.eyebrow === "Insights") {
      next.eyebrow = "Blog";
      changed = true;
    }

    if (settings && Array.isArray(settings.categories)) {
      const categories = (settings.categories as HeroCategory[]).map((category) =>
        category.label === "Insights" ? { ...category, label: "Blog" } : category,
      );
      const previous = settings.categories as HeroCategory[];
      if (categories.some((category, index) => category !== previous[index])) {
        next.settings = { ...settings, categories };
        changed = true;
      }
    }

    return changed ? next : section;
  });
}

async function updateBlogLabels() {
  const blogDefaults = getBlogDefaults();
  await connectDB();

  const navResult = await NavigationMenu.updateOne(
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

  const blogPageResult = await Page.updateOne(
    { slug: "blog" },
    {
      $set: {
        title: blogDefaults.title,
        headerLabel: blogDefaults.headerLabel,
        seo: blogDefaults.seo,
        sections: blogDefaults.sections,
      },
    },
  );

  const pages = await Page.find({}).lean<PageRecord[]>();
  let pagesRelabeled = 0;
  for (const page of pages) {
    if (page.slug === "blog") {
      continue;
    }
    const sections = relabelInsightsInSections(page.sections);
    const changed = JSON.stringify(sections) !== JSON.stringify(page.sections);
    if (!changed) {
      continue;
    }
    await Page.updateOne({ _id: page._id }, { $set: { sections } });
    pagesRelabeled += 1;
  }

  const categoryResult = await Category.updateOne(
    { slug: "insights" },
    { $set: { title: "Blog" } },
  );

  console.log(
    `Header menu updated — matched: ${navResult.matchedCount}, modified: ${navResult.modifiedCount}, upserted: ${navResult.upsertedCount ? "yes" : "no"}`,
  );
  console.log(
    `Blog page updated — matched: ${blogPageResult.matchedCount}, modified: ${blogPageResult.modifiedCount}`,
  );
  console.log(`Other pages with hero categories relabeled: ${pagesRelabeled}`);
  console.log(
    `Insights category title updated — matched: ${categoryResult.matchedCount}, modified: ${categoryResult.modifiedCount}`,
  );

  await disconnectDB();
}

updateBlogLabels().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * Targeted MongoDB update: local images, homepage sliders, content cover images.
 * Does NOT wipe collections — merges from default-content.ts defaults.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  blogPosts,
  defaultPages,
  homeSections,
  services,
} from "../src/lib/default-content";
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

function mergeHomeSections(existing: PageSection[]): PageSection[] {
  const byId = new Map(existing.map((section) => [section.id, section]));
  const merged: PageSection[] = [];

  for (const defaults of homeSections) {
    const current = byId.get(defaults.id);
    if (current) {
      merged.push({
        ...current,
        ...defaults,
        settings: { ...current.settings, ...defaults.settings },
      });
      byId.delete(defaults.id);
    } else {
      merged.push(defaults);
    }
  }

  for (const section of existing) {
    if (byId.has(section.id)) {
      merged.push(section);
    }
  }

  return merged;
}

async function updateLocalImages() {
  await connectDB();

  const homeDefaults = defaultPages.find((page) => page.slug === "home");
  const galleryDefaults = defaultPages.find((page) => page.slug === "gallery");

  const homePage = await Page.findOne({ slug: "home" }).lean<PageRecord>();
  if (homePage) {
    const sections = mergeHomeSections(homePage.sections);
    const result = await Page.updateOne({ slug: "home" }, { $set: { sections } });
    console.log(`Home page sections updated — modified: ${result.modifiedCount}`);
  } else if (homeDefaults) {
    await Page.updateOne({ slug: "home" }, { $set: homeDefaults }, { upsert: true });
    console.log("Home page created from defaults.");
  }

  const galleryPage = await Page.findOne({ slug: "gallery" }).lean<PageRecord>();
  if (galleryPage && galleryDefaults) {
    const sections = galleryDefaults.sections.map((defaults) => {
      const current = galleryPage.sections.find((s) => s.id === defaults.id);
      if (!current) return defaults;
      return {
        ...current,
        ...defaults,
        settings: { ...current.settings, ...defaults.settings },
      };
    });
    const result = await Page.updateOne({ slug: "gallery" }, { $set: { sections } });
    console.log(`Gallery page updated — modified: ${result.modifiedCount}`);
  }

  for (const service of services) {
    const result = await Content.updateOne(
      { slug: service.slug, kind: "service" },
      { $set: { coverImage: service.coverImage } },
    );
    if (result.matchedCount) {
      console.log(`Service cover updated: ${service.slug}`);
    }
  }

  for (const post of blogPosts) {
    if (!post.coverImage) continue;
    await Content.updateOne(
      { slug: post.slug, kind: "blog" },
      { $set: { coverImage: post.coverImage } },
    );
  }
  console.log(`Blog cover images synced (${blogPosts.length} posts).`);

  await disconnectDB();
}

updateLocalImages().catch((error) => {
  console.error(error);
  process.exit(1);
});

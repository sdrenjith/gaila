import { config } from "dotenv";
import { hash } from "bcryptjs";
import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { getEnv } from "../src/lib/env";
import {
  blogPosts,
  caseStudies,
  defaultPages,
  defaultFooterCta,
  footerMenuItems,
  headerMenuItems,
  services,
} from "../src/lib/default-content";
import { AdminUser } from "../src/models/AdminUser";
import { Category } from "../src/models/Category";
import { Content } from "../src/models/Content";
import { MediaAsset } from "../src/models/MediaAsset";
import { NavigationMenu } from "../src/models/NavigationMenu";
import { Page } from "../src/models/Page";
import { SiteSettings } from "../src/models/SiteSettings";

const localEnv = resolve(process.cwd(), ".env.local");
if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

async function upsertHomeHeroAsset() {
  const url = "/uploads/video/home-hero.mp4";
  const filePath = resolve(process.cwd(), "public", "uploads", "video", "home-hero.mp4");
  let size = 0;
  if (existsSync(filePath)) {
    try {
      const fileStat = await stat(filePath);
      size = fileStat.size;
    } catch {
      size = 0;
    }
  }

  await MediaAsset.updateOne(
    { url },
    {
      $setOnInsert: {
        title: "Home hero",
        url,
        alt: "Homepage hero background",
        folder: "video",
        mimeType: "video/mp4",
        size,
      },
    },
    { upsert: true },
  );
}

async function upsertAdmin() {
  const env = getEnv();
  if (!env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD must be set in the environment before seeding.");
  }
  const passwordHash = await hash(env.ADMIN_PASSWORD, 12);

  await AdminUser.updateOne(
    { email: env.ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
        status: "active",
      },
    },
    { upsert: true },
  );
}

async function seed() {
  await connectDB();

  const defaultSettings = new SiteSettings().toObject();
  const { _id: _settingsId, ...settingsPayload } = defaultSettings;
  await SiteSettings.updateOne(
    {},
    {
      $set: settingsPayload,
    },
    { upsert: true },
  );

  await NavigationMenu.updateOne(
    { location: "header" },
    {
      $set: {
        location: "header",
        title: "Header Menu",
        items: headerMenuItems,
        cta: { label: "Plan your event", href: "/contact", visible: true },
      },
    },
    { upsert: true },
  );

  await NavigationMenu.updateOne(
    { location: "footer" },
    {
      $set: {
        location: "footer",
        title: "Footer Menu",
        items: footerMenuItems,
        cta: { ...defaultFooterCta },
      },
    },
    { upsert: true },
  );

  for (const page of defaultPages) {
    await Page.updateOne({ slug: page.slug }, { $set: page }, { upsert: true });
  }

  for (const item of [...services, ...caseStudies, ...blogPosts]) {
    await Content.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
  }

  const seededCategories = [
    {
      title: "Services",
      slug: "services",
      description: "Event services managed through the Gaila CMS.",
      status: "published",
      stories: services.map((item, index) => ({
        id: `legacy-${item.slug}`,
        title: item.title,
        slug: item.slug,
        summary: item.excerpt,
        body: item.body,
        status: item.status,
        media: item.coverImage,
        order: index,
        subitems: [],
      })),
    },
    {
      title: "Case Studies",
      slug: "case-studies",
      description: "Event case studies managed through the Gaila CMS.",
      status: "published",
      stories: caseStudies.map((item, index) => ({
        id: `legacy-${item.slug}`,
        title: item.title,
        slug: item.slug,
        summary: item.excerpt,
        body: item.body,
        status: item.status,
        media: item.coverImage,
        order: index,
        subitems: [],
      })),
    },
    {
      title: "Blog",
      slug: "insights",
      description: "Event insights and articles managed through the Gaila CMS.",
      status: "published",
      stories: blogPosts.map((item, index) => ({
        id: `legacy-${item.slug}`,
        title: item.title,
        slug: item.slug,
        summary: item.excerpt,
        body: item.body,
        status: item.status,
        media: item.coverImage,
        order: index,
        subitems: [],
      })),
    },
  ];

  for (const category of seededCategories) {
    await Category.updateOne({ slug: category.slug }, { $set: category }, { upsert: true });
  }

  await upsertHomeHeroAsset();

  await upsertAdmin();
  console.log("Gaila CMS seeded successfully.");
  console.log(`Admin: ${getEnv().ADMIN_EMAIL}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });

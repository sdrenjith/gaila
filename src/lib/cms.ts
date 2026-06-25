import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { normalizeStoryOrder, sortStoriesByOrder } from "@/lib/category-order";
import { mergeCategoryStoriesWithContent } from "@/lib/category-content-merge";
import {
  categorySlugForLegacyKind,
  type LegacyContentKind,
} from "@/lib/category-content-sync";
import { normalizePageSections } from "@/lib/normalize-section";
import { serializeDoc } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Content } from "@/models/Content";
import { Lead } from "@/models/Lead";
import { MediaAsset } from "@/models/MediaAsset";
import { NavigationMenu } from "@/models/NavigationMenu";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import type {
  AdminCategoryListItem,
  AdminContentListItem,
  AdminPageListItem,
  ContentRecord,
  CategoryRecord,
  LeadRecord,
  MediaAssetRecord,
  NavigationRecord,
  PageRecord,
  SiteSettingsRecord,
} from "@/types/cms";

const LEGACY_CATEGORY_MAP = {
  service: {
    title: "Services",
    slug: "services",
    description: "Legacy services migrated from the original content library.",
  },
  caseStudy: {
    title: "Case Studies",
    slug: "case-studies",
    description: "Legacy case studies migrated from the original content library.",
  },
  blog: {
    title: "Blog",
    slug: "insights",
    description: "Legacy insight posts migrated from the original content library.",
  },
} as const;

const ADMIN_PAGES_TAG = "admin-pages";
const ADMIN_CATEGORIES_TAG = "admin-categories";
const ADMIN_CONTENT_TAG = "admin-content";

let legacyBootstrapChecked = false;

async function ensureLegacyCategoriesBootstrapped() {
  if (legacyBootstrapChecked) {
    return;
  }

  const existing = await Category.countDocuments();
  if (existing > 0) {
    legacyBootstrapChecked = true;
    return;
  }

  const legacyItems = await Content.find().sort({ featured: -1, updatedAt: -1 }).lean();
  if (!legacyItems.length) {
    return;
  }

  const grouped = new Map<keyof typeof LEGACY_CATEGORY_MAP, typeof legacyItems>();
  for (const item of legacyItems) {
    const kind = item.kind as keyof typeof LEGACY_CATEGORY_MAP;
    if (!grouped.has(kind)) {
      grouped.set(kind, []);
    }
    grouped.get(kind)?.push(item);
  }

  for (const [kind, items] of grouped) {
    const config = LEGACY_CATEGORY_MAP[kind];
    await Category.updateOne(
      { slug: config.slug },
      {
        $setOnInsert: {
          title: config.title,
          slug: config.slug,
          description: config.description,
          status: "published",
          stories: items.map((item, index) => ({
            id: `legacy-${item.slug}`,
            title: item.title,
            slug: item.slug,
            summary: item.excerpt,
            body: item.body,
            status: item.status,
            media: item.coverImage ?? "",
            order: index,
            subitems: [],
          })),
        },
      },
      { upsert: true },
    );
  }

  legacyBootstrapChecked = true;
}

export const getSiteSettings = cache(async () => {
  return unstable_cache(
    async () => {
      await connectDB();
      const settings = await SiteSettings.findOneAndUpdate(
        {},
        { $setOnInsert: {} },
        { upsert: true, new: true },
      ).lean();
      const serialized = serializeDoc<SiteSettingsRecord>(settings);
      return {
        ...serialized,
        googleReviews: serialized.googleReviews ?? [],
        heroVideo: serialized.heroVideo || "/uploads/video/home-hero.mp4",
        logo: serialized.logo || "",
      };
    },
    ["site-settings"],
    { revalidate: 60, tags: ["site-settings"] },
  )();
});

export const getNavigation = cache(async (location: "header" | "footer") => {
  return unstable_cache(
    async () => {
      await connectDB();
      const menu = await NavigationMenu.findOne({ location }).lean();
      return menu ? serializeDoc<NavigationRecord>(menu) : null;
    },
    ["navigation", location],
    { revalidate: 60, tags: [`navigation:${location}`] },
  )();
});

export async function getAllNavigation() {
  await connectDB();
  const menus = await NavigationMenu.find().sort({ location: 1 }).lean();
  return serializeDoc<NavigationRecord[]>(menus);
}

function withNormalizedSections(page: PageRecord): PageRecord {
  return {
    ...page,
    sections: normalizePageSections(page.sections),
  };
}

export const getPublishedPage = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const page = await Page.findOne({ slug, status: "published" }).lean();
      return page ? withNormalizedSections(serializeDoc<PageRecord>(page)) : null;
    },
    ["published-page", slug],
    { revalidate: 60, tags: [`page:${slug}`] },
  )();
});

export async function getPage(slug: string) {
  await connectDB();
  const page = await Page.findOne({ slug }).lean();
  return page ? withNormalizedSections(serializeDoc<PageRecord>(page)) : null;
}

export async function getPages() {
  await connectDB();
  const pages = await Page.find().sort({ updatedAt: -1 }).lean();
  return serializeDoc<PageRecord[]>(pages).map(withNormalizedSections);
}

export const getAdminPagesList = cache(async () => {
  return unstable_cache(
    async () => {
      await connectDB();
      const pages = await Page.find({}, { title: 1, slug: 1, status: 1, updatedAt: 1 })
        .sort({ updatedAt: -1 })
        .lean();
      return serializeDoc<AdminPageListItem[]>(pages);
    },
    ["admin-pages-list"],
    { revalidate: 30, tags: [ADMIN_PAGES_TAG] },
  )();
});

export const getAdminPageBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const page = await Page.findOne({ slug }).lean();
      return page ? withNormalizedSections(serializeDoc<PageRecord>(page)) : null;
    },
    ["admin-page", slug],
    { revalidate: 30, tags: [ADMIN_PAGES_TAG, `admin-page:${slug}`] },
  )();
});

export async function getPublishedPages() {
  await connectDB();
  const pages = await Page.find({ status: "published" }).sort({ slug: 1 }).lean();
  return serializeDoc<PageRecord[]>(pages).map(withNormalizedSections);
}

export async function getCategories(publishedOnly = false) {
  await connectDB();
  await ensureLegacyCategoriesBootstrapped();
  const query = publishedOnly ? { status: "published" } : {};
  const categories = await Category.find(query).sort({ updatedAt: -1, title: 1 }).lean();
  return serializeDoc<CategoryRecord[]>(categories).map((category) => ({
    ...category,
    stories: sortStoriesByOrder(normalizeStoryOrder(category.stories ?? [])),
  }));
}

export const getAdminCategoriesList = cache(async () => {
  return unstable_cache(
    async () => {
      await connectDB();
      await ensureLegacyCategoriesBootstrapped();
      const categories = await Category.find({}, { title: 1, slug: 1, status: 1, updatedAt: 1 })
        .sort({ updatedAt: -1, title: 1 })
        .lean();
      return serializeDoc<AdminCategoryListItem[]>(categories);
    },
    ["admin-categories-list"],
    { revalidate: 30, tags: [ADMIN_CATEGORIES_TAG] },
  )();
});

export const getAdminCategoryBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      await ensureLegacyCategoriesBootstrapped();
      const category = await Category.findOne({ slug }).lean();
      if (!category) {
        return null;
      }
      const serialized = serializeDoc<CategoryRecord>(category);
      return {
        ...serialized,
        stories: sortStoriesByOrder(normalizeStoryOrder(serialized.stories ?? [])),
      };
    },
    ["admin-category", slug],
    { revalidate: 30, tags: [ADMIN_CATEGORIES_TAG, `admin-category:${slug}`] },
  )();
});

export const getAdminCategoryOptions = cache(async () => {
  return unstable_cache(
    async () => {
      await connectDB();
      await ensureLegacyCategoriesBootstrapped();
      const categories = await Category.find({}, { title: 1, slug: 1 }).sort({ title: 1 }).lean();
      return serializeDoc<{ slug: string; title: string }[]>(categories);
    },
    ["admin-category-options"],
    { revalidate: 30, tags: [ADMIN_CATEGORIES_TAG] },
  )();
});

async function getContentForLegacyKind(
  kind: LegacyContentKind,
  publishedOnly: boolean,
): Promise<ContentRecord[]> {
  const categorySlug = categorySlugForLegacyKind(kind);
  const category = await Category.findOne({ slug: categorySlug }, { stories: 1 }).lean<{
    stories?: CategoryRecord["stories"];
  }>();

  const contentItems = serializeDoc<ContentRecord[]>(
    await Content.find({ kind }).sort({ featured: -1, updatedAt: -1 }).lean(),
  );

  if (category?.stories?.length) {
    const merged = mergeCategoryStoriesWithContent(category.stories, contentItems, kind);
    return publishedOnly ? merged.filter((item) => item.status === "published") : merged;
  }

  return publishedOnly ? contentItems.filter((item) => item.status === "published") : contentItems;
}

export const getContent = cache(
  async (kind?: "service" | "caseStudy" | "blog", publishedOnly = false) => {
    const cacheKey = `content:${kind ?? "all"}:${publishedOnly ? "published" : "all"}`;
    return unstable_cache(
      async () => {
        await connectDB();
        if (!kind) {
          const query: Record<string, unknown> = {};
          if (publishedOnly) query.status = "published";
          const items = await Content.find(query).sort({ featured: -1, updatedAt: -1 }).lean();
          return serializeDoc<ContentRecord[]>(items);
        }

        return getContentForLegacyKind(kind, publishedOnly);
      },
      [cacheKey],
      { revalidate: 60, tags: kind ? [`content:${kind}`] : ["content"] },
    )();
  },
);

export const getAdminContentList = cache(async () => {
  return unstable_cache(
    async () => {
      await connectDB();
      const items = await Content.find({}, { title: 1, slug: 1, kind: 1, status: 1, featured: 1 })
        .sort({ featured: -1, updatedAt: -1 })
        .lean();
      return serializeDoc<AdminContentListItem[]>(items);
    },
    ["admin-content-list"],
    { revalidate: 30, tags: [ADMIN_CONTENT_TAG] },
  )();
});

export const getAdminContentBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const item = await Content.findOne({ slug }).lean();
      return item ? serializeDoc<ContentRecord>(item) : null;
    },
    ["admin-content-item", slug],
    { revalidate: 30, tags: [ADMIN_CONTENT_TAG, `admin-content:${slug}`] },
  )();
});

export const getContentBySlug = cache(async (slug: string, publishedOnly = true) => {
  await connectDB();
  const item = await Content.findOne({ slug }).lean();
  if (!item) {
    return null;
  }

  const serialized = serializeDoc<ContentRecord>(item);
  const kind = serialized.kind as LegacyContentKind;
  const categorySlug = categorySlugForLegacyKind(kind);
  const category = await Category.findOne(
    { slug: categorySlug, "stories.slug": slug },
    { stories: { $elemMatch: { slug } } },
  ).lean<{ stories?: CategoryRecord["stories"] }>();

  const story = category?.stories?.[0];
  if (!story) {
    if (publishedOnly && serialized.status !== "published") {
      return null;
    }
    return serialized;
  }

  const [merged] = mergeCategoryStoriesWithContent([story], [serialized], kind);
  if (publishedOnly && merged.status !== "published") {
    return null;
  }
  return merged;
});

export async function getLeads() {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return serializeDoc<LeadRecord[]>(leads);
}

export async function getMediaAssets() {
  await connectDB();
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
  return serializeDoc<MediaAssetRecord[]>(assets);
}

export async function getAdminDashboardStats() {
  await connectDB();
  await ensureLegacyCategoriesBootstrapped();
  const [pages, publishedPages, categories, contentEntries, leads, media] = await Promise.all([
    Page.countDocuments(),
    Page.countDocuments({ status: "published" }),
    Category.countDocuments(),
    Content.countDocuments(),
    Lead.countDocuments(),
    MediaAsset.countDocuments(),
  ]);

  return { pages, publishedPages, categories, contentEntries, leads, media };
}

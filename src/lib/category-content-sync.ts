import "server-only";

import { normalizeStoryOrder, sortStoriesByOrder } from "@/lib/category-order";
import { storyToContentFields } from "@/lib/category-content-merge";
import { Category } from "@/models/Category";
import { Content } from "@/models/Content";
import type { CategoryStoryRecord } from "@/types/cms";

export const LEGACY_CATEGORY_KIND_MAP = {
  "case-studies": "caseStudy",
  services: "service",
  insights: "blog",
} as const;

export type LegacyCategorySlug = keyof typeof LEGACY_CATEGORY_KIND_MAP;
export type LegacyContentKind = (typeof LEGACY_CATEGORY_KIND_MAP)[LegacyCategorySlug];

export function legacyKindForCategorySlug(slug: string): LegacyContentKind | null {
  return LEGACY_CATEGORY_KIND_MAP[slug as LegacyCategorySlug] ?? null;
}

export function categorySlugForLegacyKind(kind: LegacyContentKind): LegacyCategorySlug {
  return Object.entries(LEGACY_CATEGORY_KIND_MAP).find(([, value]) => value === kind)?.[0] as LegacyCategorySlug;
}

export async function syncCategoryStoriesToContent(
  categorySlug: string,
  stories: CategoryStoryRecord[],
) {
  const kind = legacyKindForCategorySlug(categorySlug);
  if (!kind) {
    return;
  }

  const ordered = sortStoriesByOrder(normalizeStoryOrder(stories));

  // Content.slug is globally unique (not compound with kind). Match by slug only,
  // same as saveContentAction, so upserts update existing rows instead of E11000.
  // Sequential writes avoid rare upsert races on the slug unique index.
  for (const story of ordered) {
    const fields = storyToContentFields(story, kind);
    await Content.updateOne(
      { slug: story.slug },
      {
        $set: {
          kind: fields.kind,
          title: fields.title,
          excerpt: fields.excerpt,
          body: fields.body,
          coverImage: fields.coverImage,
          status: fields.status,
        },
        $setOnInsert: {
          slug: fields.slug,
          tags: [],
          featured: false,
          seo: fields.seo,
        },
      },
      { upsert: true },
    );
  }
}

export async function syncContentFieldsToCategoryStory(
  kind: LegacyContentKind,
  slug: string,
  fields: {
    title: string;
    excerpt: string;
    body: string;
    coverImage: string;
    status: "draft" | "published";
  },
) {
  const categorySlug = categorySlugForLegacyKind(kind);
  await Category.updateOne(
    { slug: categorySlug, "stories.slug": slug },
    {
      $set: {
        "stories.$.title": fields.title,
        "stories.$.summary": fields.excerpt,
        "stories.$.body": fields.body,
        "stories.$.media": fields.coverImage,
        "stories.$.status": fields.status,
      },
    },
  );
}

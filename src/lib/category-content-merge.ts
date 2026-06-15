import { normalizeStoryOrder, sortStoriesByOrder } from "@/lib/category-order";
import type { CategoryStoryRecord, ContentRecord } from "@/types/cms";

export function contentRecordsBySlug(items: ContentRecord[]): Map<string, ContentRecord> {
  return new Map(items.map((item) => [item.slug, item]));
}

/** Category stories drive order and primary fields; Content supplies SEO, tags, metrics, featured. */
export function mergeCategoryStoriesWithContent(
  stories: CategoryStoryRecord[],
  contentItems: ContentRecord[],
  kind: ContentRecord["kind"],
): ContentRecord[] {
  const bySlug = contentRecordsBySlug(contentItems);
  const ordered = sortStoriesByOrder(normalizeStoryOrder(stories));

  return ordered.map((story) => {
    const legacy = bySlug.get(story.slug);
    const defaultSeo = {
      title: story.title,
      description: story.summary,
      keywords: [] as string[],
    };

    return {
      _id: legacy?._id ?? story.id,
      kind,
      title: story.title,
      slug: story.slug,
      excerpt: story.summary,
      body: story.body,
      coverImage: story.media?.trim() || legacy?.coverImage?.trim() || "",
      tags: legacy?.tags ?? [],
      status: story.status,
      featured: legacy?.featured ?? false,
      seo: legacy?.seo ?? defaultSeo,
      metrics: legacy?.metrics,
      updatedAt: legacy?.updatedAt,
    };
  });
}

export function storyToContentFields(story: CategoryStoryRecord, kind: ContentRecord["kind"]) {
  return {
    kind,
    title: story.title,
    slug: story.slug,
    excerpt: story.summary,
    body: story.body,
    coverImage: story.media ?? "",
    status: story.status,
    seo: {
      title: story.title,
      description: story.summary,
      keywords: [] as string[],
    },
  };
}

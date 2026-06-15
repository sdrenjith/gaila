import { mergeCategoryStoriesWithContent } from "@/lib/category-content-merge";
import { legacyKindForCategorySlug } from "@/lib/category-content-sync";
import { sortStoriesByOrder, sortSubitemsByOrder } from "@/lib/category-order";
import { getCategories, getContent } from "@/lib/cms";
import type { CategoryStoryRecord, ContentRecord, StorySubitemRecord } from "@/types/cms";

export {
  LEGACY_KIND_TO_CATEGORY_SLUG,
  migrateCaseStudyGridSettings,
  resolveCaseStudyGridCategorySlug,
} from "@/lib/section-category-settings";

export type CategoryEditorialItem = ContentRecord & {
  subitems: StorySubitemRecord[];
};

function hrefBaseForLegacyKind(kind: ContentRecord["kind"] | null, categorySlug: string): string {
  if (kind === "blog") return "/blog";
  if (kind === "service") return "/services";
  if (kind === "caseStudy") return "/case-studies";
  return `/categories/${categorySlug}`;
}

function publishedSubitems(
  story: CategoryStoryRecord | undefined,
  publishedOnly: boolean,
): StorySubitemRecord[] {
  if (!story) return [];
  return sortSubitemsByOrder(story.subitems).filter(
    (subitem) => !publishedOnly || subitem.status === "published",
  );
}

export async function getCategoryEditorialItems(
  categorySlug: string,
  options: {
    featuredOnly?: boolean;
    limit?: number;
    publishedOnly?: boolean;
  } = {},
): Promise<{
  items: CategoryEditorialItem[];
  hrefBase: string;
  kind: ContentRecord["kind"] | null;
}> {
  const { featuredOnly = false, limit = 0, publishedOnly = true } = options;
  const categories = await getCategories(publishedOnly);
  const category = categories.find((entry) => entry.slug === categorySlug);

  if (!category) {
    return { items: [], hrefBase: "/case-studies", kind: null };
  }

  const legacyKind = legacyKindForCategorySlug(categorySlug);
  let stories = sortStoriesByOrder(category.stories);
  if (publishedOnly) {
    stories = stories.filter((story) => story.status === "published");
  }

  let items: CategoryEditorialItem[];

  if (legacyKind) {
    const contentItems = await getContent(legacyKind, publishedOnly);
    const merged = mergeCategoryStoriesWithContent(stories, contentItems, legacyKind);
    items = merged.map((content) => {
      const story = stories.find((entry) => entry.slug === content.slug);
      return {
        ...content,
        subitems: publishedSubitems(story, publishedOnly),
      };
    });
  } else {
    items = stories.map((story) => ({
      _id: story.id,
      kind: "caseStudy",
      title: story.title,
      slug: story.slug,
      excerpt: story.summary,
      body: story.body,
      coverImage: story.media?.trim() || "",
      tags: [],
      status: story.status,
      featured: false,
      seo: {
        title: story.title,
        description: story.summary,
        keywords: [],
      },
      subitems: publishedSubitems(story, publishedOnly),
    }));
  }

  if (featuredOnly) {
    items = items.filter((item) => item.featured);
  }
  if (limit > 0) {
    items = items.slice(0, limit);
  }

  return {
    items,
    hrefBase: hrefBaseForLegacyKind(legacyKind, categorySlug),
    kind: legacyKind,
  };
}

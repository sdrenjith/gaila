import { describe, expect, it } from "vitest";
import {
  mergeCategoryStoriesWithContent,
  storyToContentFields,
} from "@/lib/category-content-merge";
import {
  normalizeStoryOrder,
  sortStoriesByOrder,
  withSequentialStoryOrder,
} from "@/lib/category-order";
import type { CategoryStoryRecord, ContentRecord } from "@/types/cms";

function story(
  overrides: Partial<CategoryStoryRecord> & Pick<CategoryStoryRecord, "slug" | "title">,
): CategoryStoryRecord {
  return {
    id: overrides.id ?? `id-${overrides.slug}`,
    summary: overrides.summary ?? `${overrides.title} summary`,
    body: overrides.body ?? `${overrides.title} body`,
    status: overrides.status ?? "published",
    media: overrides.media ?? "",
    order: overrides.order,
    subitems: overrides.subitems ?? [],
    ...overrides,
  };
}

function content(
  overrides: Partial<ContentRecord> & Pick<ContentRecord, "slug" | "title">,
): ContentRecord {
  return {
    _id: overrides._id ?? `content-${overrides.slug}`,
    kind: overrides.kind ?? "caseStudy",
    excerpt: overrides.excerpt ?? `${overrides.title} excerpt`,
    body: overrides.body ?? `${overrides.title} body`,
    tags: overrides.tags ?? [],
    status: overrides.status ?? "published",
    featured: overrides.featured ?? false,
    seo: overrides.seo ?? {
      title: overrides.title,
      description: `${overrides.title} excerpt`,
      keywords: [],
    },
    ...overrides,
  };
}

describe("mergeCategoryStoriesWithContent", () => {
  it("uses category story order, not content sort order", () => {
    const stories = [
      story({ slug: "real-estate-launch", title: "Real Estate Launch Campaign", order: 3 }),
      story({ slug: "fenty-beauty", title: "Fenty Beauty", order: 0 }),
    ];
    const legacy = [
      content({ slug: "fenty-beauty", title: "Legacy Fenty", featured: true }),
      content({ slug: "real-estate-launch", title: "Legacy Real Estate" }),
    ];

    const merged = mergeCategoryStoriesWithContent(stories, legacy, "caseStudy");

    expect(merged.map((item) => item.slug)).toEqual(["fenty-beauty", "real-estate-launch"]);
    expect(merged[1]?.title).toBe("Real Estate Launch Campaign");
    expect(merged[1]?.excerpt).toBe("Real Estate Launch Campaign summary");
  });

  it("maps story fields by slug and keeps legacy seo/tags/metrics", () => {
    const stories = [story({ slug: "launch-campaign", title: "Launch Campaign", media: "/uploads/cover.webp" })];
    const legacy = [
      content({
        slug: "launch-campaign",
        title: "Old title",
        tags: ["retail"],
        metrics: [{ label: "Lift", value: "42%" }],
      }),
    ];

    const [merged] = mergeCategoryStoriesWithContent(stories, legacy, "caseStudy");

    expect(merged.title).toBe("Launch Campaign");
    expect(merged.coverImage).toBe("/uploads/cover.webp");
    expect(merged.tags).toEqual(["retail"]);
    expect(merged.metrics).toEqual([{ label: "Lift", value: "42%" }]);
  });

  it("respects manual order after reordering", () => {
    const reordered = withSequentialStoryOrder([
      story({ slug: "second", title: "Second", order: 99 }),
      story({ slug: "first", title: "First", order: 1 }),
    ]);

    const merged = mergeCategoryStoriesWithContent(reordered, [], "caseStudy");
    expect(merged.map((item) => item.slug)).toEqual(["second", "first"]);
  });
});

describe("story order preservation", () => {
  it("normalizes missing order values without changing relative order", () => {
    const stories = normalizeStoryOrder([
      story({ slug: "a", title: "A" }),
      story({ slug: "b", title: "B", order: 5 }),
    ]);

    expect(stories.map((entry) => entry.order)).toEqual([0, 5]);
    expect(sortStoriesByOrder(stories).map((entry) => entry.slug)).toEqual(["a", "b"]);
  });

  it("assigns sequential order on save parsing flow", () => {
    const parsed = withSequentialStoryOrder([
      story({ slug: "one", title: "One", order: 99 }),
      story({ slug: "two", title: "Two", order: 2 }),
    ]);

    expect(parsed.map((entry, index) => ({ slug: entry.slug, order: entry.order }))).toEqual([
      { slug: "one", order: 0 },
      { slug: "two", order: 1 },
    ]);
  });
});

describe("storyToContentFields", () => {
  it("maps category story fields to content payload shape", () => {
    const fields = storyToContentFields(
      story({
        slug: "real-estate-launch",
        title: "Real Estate Launch Campaign",
        summary: "A launch story",
        body: "Full body",
        media: "/uploads/real-estate.webp",
        status: "published",
      }),
      "caseStudy",
    );

    expect(fields).toMatchObject({
      kind: "caseStudy",
      slug: "real-estate-launch",
      title: "Real Estate Launch Campaign",
      excerpt: "A launch story",
      body: "Full body",
      coverImage: "/uploads/real-estate.webp",
      status: "published",
    });
  });
});

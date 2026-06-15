import { describe, expect, it } from "vitest";
import {
  LEGACY_KIND_TO_CATEGORY_SLUG,
  migrateCaseStudyGridSettings,
  resolveCaseStudyGridCategorySlug,
} from "@/lib/section-category-settings";

describe("migrateCaseStudyGridSettings", () => {
  it("maps legacy caseStudy kind to case-studies slug", () => {
    expect(migrateCaseStudyGridSettings({ kind: "caseStudy", limit: 0 })).toEqual({
      limit: 0,
      categorySlug: "case-studies",
    });
  });

  it("maps legacy blog kind to insights slug", () => {
    expect(migrateCaseStudyGridSettings({ kind: "blog", featuredOnly: true })).toEqual({
      featuredOnly: true,
      categorySlug: "insights",
    });
  });

  it("keeps an existing categorySlug unchanged", () => {
    expect(
      migrateCaseStudyGridSettings({
        kind: "blog",
        categorySlug: "custom-category",
        featuredOnly: true,
      }),
    ).toEqual({
      kind: "blog",
      categorySlug: "custom-category",
      featuredOnly: true,
    });
  });
});

describe("resolveCaseStudyGridCategorySlug", () => {
  it("defaults to case-studies when no source is configured", () => {
    expect(resolveCaseStudyGridCategorySlug({})).toBe(LEGACY_KIND_TO_CATEGORY_SLUG.caseStudy);
  });

  it("prefers categorySlug over legacy kind", () => {
    expect(
      resolveCaseStudyGridCategorySlug({
        kind: "blog",
        categorySlug: "services",
      }),
    ).toBe("services");
  });
});

export const LEGACY_KIND_TO_CATEGORY_SLUG = {
  caseStudy: "case-studies",
  blog: "insights",
} as const;

export function migrateCaseStudyGridSettings(
  settings: Record<string, unknown>,
): Record<string, unknown> {
  const categorySlug =
    typeof settings.categorySlug === "string" ? settings.categorySlug.trim() : "";
  if (categorySlug) {
    return settings;
  }

  const kind = settings.kind === "blog" ? "blog" : "caseStudy";
  const { kind: _legacyKind, ...rest } = settings;
  return {
    ...rest,
    categorySlug: LEGACY_KIND_TO_CATEGORY_SLUG[kind],
  };
}

export function resolveCaseStudyGridCategorySlug(settings: Record<string, unknown>): string {
  const migrated = migrateCaseStudyGridSettings(settings);
  const slug =
    typeof migrated.categorySlug === "string" ? migrated.categorySlug.trim() : "";
  return slug || LEGACY_KIND_TO_CATEGORY_SLUG.caseStudy;
}

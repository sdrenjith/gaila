const CONTENT_KIND_TERMS: Record<string, string[]> = {
  service: ["service"],
  caseStudy: ["casestudy", "case study", "case-study"],
  blog: ["blog"],
};

export function matchesSearchTerm(needle: string, fields: (string | undefined | null)[]): boolean {
  if (!needle) return true;
  return fields
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(needle));
}

export function contentMatchesSearch(
  item: { title: string; slug: string; kind: string; status: string },
  needle: string,
): boolean {
  const kindTerms = [item.kind, ...(CONTENT_KIND_TERMS[item.kind] ?? [])];
  return matchesSearchTerm(needle, [item.title, item.slug, item.status, ...kindTerms]);
}

export function categoryStoryMatchesSearch(
  story: { title: string; slug: string; status: string },
  needle: string,
): boolean {
  const statusTerms = story.status === "published" ? [story.status, "active"] : [story.status];
  return matchesSearchTerm(needle, [story.title, story.slug, ...statusTerms]);
}

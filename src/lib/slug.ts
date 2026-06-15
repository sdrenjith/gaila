export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePageSlug(input: string) {
  const slug = slugify(input.replace(/^\/+|\/+$/g, ""));
  return slug || "home";
}

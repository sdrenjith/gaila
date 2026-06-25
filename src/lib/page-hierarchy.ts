import type { AdminPageListItem } from "@/types/cms";

export const SERVICES_PARENT_SLUG = "services";

/** Canonical order for service sub-pages in admin sidebars and previews. */
export const SERVICE_SUBPAGE_SLUGS = [
  "service-wedding-planning",
  "service-newborn-hospital-decor",
  "service-graduation-setup",
  "service-corporate-events",
  "service-dessert-events",
] as const;

/** Preferred top-level page order in the admin pages sidebar. */
export const TOP_LEVEL_PAGE_SLUG_ORDER = [
  "home",
  SERVICES_PARENT_SLUG,
  "gallery",
  "blog",
  "about-us",
  "contact",
] as const;

export function isServiceSubPageSlug(slug: string) {
  return slug.startsWith("service-") && slug !== SERVICES_PARENT_SLUG;
}

export function serviceSubPageSortIndex(slug: string) {
  const index = SERVICE_SUBPAGE_SLUGS.indexOf(slug as (typeof SERVICE_SUBPAGE_SLUGS)[number]);
  return index === -1 ? SERVICE_SUBPAGE_SLUGS.length : index;
}

export type AdminPageTreeEntry =
  | { type: "page"; page: AdminPageListItem }
  | { type: "group"; page: AdminPageListItem; children: AdminPageListItem[] };

function topLevelSortIndex(slug: string) {
  const index = TOP_LEVEL_PAGE_SLUG_ORDER.indexOf(slug as (typeof TOP_LEVEL_PAGE_SLUG_ORDER)[number]);
  return index === -1 ? TOP_LEVEL_PAGE_SLUG_ORDER.length : index;
}

function comparePages(a: AdminPageListItem, b: AdminPageListItem) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
}

export function buildAdminPageTree(pages: AdminPageListItem[]): AdminPageTreeEntry[] {
  const serviceChildren = pages
    .filter((page) => isServiceSubPageSlug(page.slug))
    .sort((a, b) => {
      const orderDiff = serviceSubPageSortIndex(a.slug) - serviceSubPageSortIndex(b.slug);
      return orderDiff !== 0 ? orderDiff : comparePages(a, b);
    });

  const topLevelPages = pages
    .filter((page) => !isServiceSubPageSlug(page.slug))
    .sort((a, b) => {
      const orderDiff = topLevelSortIndex(a.slug) - topLevelSortIndex(b.slug);
      return orderDiff !== 0 ? orderDiff : comparePages(a, b);
    });

  return topLevelPages.map((page) => {
    if (page.slug === SERVICES_PARENT_SLUG && serviceChildren.length > 0) {
      return { type: "group", page, children: serviceChildren };
    }
    return { type: "page", page };
  });
}

export function pageTreeContainsSlug(entries: AdminPageTreeEntry[], slug: string) {
  return entries.some((entry) => {
    if (entry.page.slug === slug) return true;
    if (entry.type === "group") {
      return entry.children.some((child) => child.slug === slug);
    }
    return false;
  });
}

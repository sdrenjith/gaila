import { defaultFooterCta, footerMenuItems } from "@/lib/default-content";
import type { MenuItem, NavigationRecord, PageRecord } from "@/types/cms";

const DEFAULT_FOOTER_TAGLINE = "Built in Dubai · Made for the world";

function mergeFooterCta(menu: NavigationRecord | null): NavigationRecord["cta"] {
  const stored = menu?.cta;
  return {
    eyebrow: stored?.eyebrow?.trim() || defaultFooterCta.eyebrow,
    headline: stored?.headline?.trim() || defaultFooterCta.headline,
    headlineAccent: stored?.headlineAccent?.trim() || defaultFooterCta.headlineAccent,
    label: stored?.label?.trim() || defaultFooterCta.label,
    href: stored?.href?.trim() || defaultFooterCta.href,
    visible: stored?.visible ?? defaultFooterCta.visible,
  };
}

/** Footer explore links and CTA with seed defaults when the DB menu is missing or empty. */
export function resolveFooterMenu(menu: NavigationRecord | null): NavigationRecord {
  const items = menu?.items?.length ? menu.items : footerMenuItems;

  return {
    _id: menu?._id ?? "footer",
    location: "footer",
    title: menu?.title?.trim() || "Footer Menu",
    items,
    cta: mergeFooterCta(menu),
  };
}

export { DEFAULT_FOOTER_TAGLINE };

export function toPageHref(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export function getPublishedPageHrefSet(pages: PageRecord[]) {
  return new Set(
    pages.filter((page) => page.status === "published").map((page) => toPageHref(page.slug)),
  );
}

export function splitManualMenuItems(items: MenuItem[], pages: PageRecord[]) {
  const pageHrefs = getPublishedPageHrefSet(pages);
  return items.filter((item) => !pageHrefs.has(item.href));
}

export type PageHeaderPreviewItem = {
  label: string;
  href: string;
  order: number;
  slug: string;
};

export function getPageHeaderPreviewItems(pages: PageRecord[]): PageHeaderPreviewItem[] {
  return pages
    .filter((page) => page.status === "published" && page.showInHeader === true)
    .map((page) => ({
      label: page.headerLabel?.trim() || page.title,
      href: toPageHref(page.slug),
      order: Number.isFinite(page.headerOrder) ? Number(page.headerOrder) : 0,
      slug: page.slug,
    }))
    .sort((a, b) => a.order - b.order);
}

export function mergeHeaderMenuWithPages(
  menu: NavigationRecord | null,
  pages: PageRecord[],
): NavigationRecord | null {
  if (!menu) {
    return null;
  }

  const pageHrefMap = new Map(
    pages
      .filter((page) => page.status === "published")
      .map((page) => [toPageHref(page.slug), page]),
  );

  const manualByHref = new Map(menu.items.map((item) => [item.href, item]));

  const dynamicItems: MenuItem[] = pages
    .filter((page) => page.status === "published")
    .flatMap((page) => {
      const href = toPageHref(page.slug);
      const manualItem = manualByHref.get(href);
      const visibleFromPage = page.showInHeader === true;
      const visibleFromExistingMenu = Boolean(manualItem?.visible);

      if (!visibleFromPage && !visibleFromExistingMenu) {
        return [];
      }

      return [
        {
          label: page.headerLabel?.trim() || manualItem?.label || page.title,
          href,
          order: Number.isFinite(page.headerOrder) ? Number(page.headerOrder) : manualItem?.order || 0,
          visible: true,
        },
      ];
    });

  const manualItems = menu.items.filter((item) => !pageHrefMap.has(item.href));

  return {
    ...menu,
    items: [...manualItems, ...dynamicItems].sort((a, b) => a.order - b.order),
  };
}

import { defaultFooterCta, footerMenuItems, headerMenuItems } from "@/lib/default-content";
import type { MenuItem, NavigationRecord, PageRecord } from "@/types/cms";

const DEFAULT_FOOTER_TAGLINE = "Built in Dubai · Made for memorable moments";

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

/** Header links with seed defaults when the DB menu is missing or empty. */
export function resolveHeaderMenu(menu: NavigationRecord | null): NavigationRecord {
  return {
    _id: menu?._id ?? "header",
    location: "header",
    title: menu?.title?.trim() || "Header Menu",
    items: menu?.items?.length ? menu.items : headerMenuItems,
    cta: menu?.cta ?? { label: "Plan your event", href: "/contact", visible: true },
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
  return items.filter((item) => {
    if (item.children?.length) return true;
    return !pageHrefs.has(item.href);
  });
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

export function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  if (isActiveHref(item.href, pathname)) return true;
  return (item.children ?? []).some((child) => isActiveHref(child.href, pathname));
}

function isActiveHref(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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
      if (manualItem?.children?.length) {
        return [];
      }

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
          children: manualItem?.children,
        },
      ];
    });

  const manualItems = menu.items.filter((item) => {
    if (item.children?.length) return true;
    return !pageHrefMap.has(item.href);
  });

  return {
    ...menu,
    items: [...manualItems, ...dynamicItems].sort((a, b) => a.order - b.order),
  };
}

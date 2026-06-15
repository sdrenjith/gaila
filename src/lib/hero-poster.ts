import type { PageSection } from "@/types/cms";

/** Resolve the LCP poster URL for the first enabled hero section on a page. */
export function heroPosterFromSections(sections: PageSection[]): string | null {
  const hero = sections.find(
    (section) =>
      section.enabled && (section.type === "heroEditorial" || section.type === "heroSlider"),
  );
  if (!hero?.settings || typeof hero.settings !== "object") {
    return null;
  }

  const settings = hero.settings as Record<string, unknown>;
  const poster = typeof settings.poster === "string" ? settings.poster.trim() : "";
  const image = typeof settings.image === "string" ? settings.image.trim() : "";
  return poster || image || null;
}

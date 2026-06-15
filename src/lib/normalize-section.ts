import { migrateCaseStudyGridSettings } from "@/lib/section-category-settings";
import { isSectionType } from "@/lib/section-types";
import type { PageSection } from "@/types/cms";

function normalizeSectionSettings(section: PageSection): Record<string, unknown> {
  const settings =
    section.settings && typeof section.settings === "object" && !Array.isArray(section.settings)
      ? section.settings
      : {};

  if (section.type === "caseStudyGrid") {
    return migrateCaseStudyGridSettings(settings);
  }

  return settings;
}

export function normalizePageSection(section: Partial<PageSection> & { id: string; type: PageSection["type"] }): PageSection {
  const normalized: PageSection = {
    id: section.id,
    type: section.type,
    title: section.title ?? "",
    eyebrow: section.eyebrow ?? "",
    subtitle: section.subtitle ?? "",
    enabled: section.enabled !== false,
    settings:
      section.settings && typeof section.settings === "object" && !Array.isArray(section.settings)
        ? section.settings
        : {},
  };

  return {
    ...normalized,
    settings: normalizeSectionSettings(normalized),
  };
}

export function normalizePageSections(sections: unknown): PageSection[] {
  if (!Array.isArray(sections)) {
    return [];
  }
  return sections
    .filter((section): section is Partial<PageSection> & { id: string; type: PageSection["type"] } => {
      return Boolean(
        section &&
          typeof section === "object" &&
          "id" in section &&
          typeof section.id === "string" &&
          isSectionType(section.type),
      );
    })
    .map((section) => normalizePageSection(section));
}

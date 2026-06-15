import type { PageSection } from "@/types/cms";

/**
 * The contact page CMS seed includes a light `contact-cta` banner above the
 * global footer. At the natural scroll end that white block reads as the page
 * finish, leaving only a thin strip of the dark footer visible.
 */
export function publicPageSections(slug: string, sections: PageSection[]): PageSection[] {
  if (slug !== "contact") {
    return sections;
  }

  return sections.filter((section) => section.id !== "contact-cta");
}

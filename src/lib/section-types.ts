import type { SectionType } from "@/types/cms";

export const SECTION_TYPES = [
  "heroSlider",
  "heroEditorial",
  "marquee",
  "categoryStories",
  "serviceGrid",
  "servicesEditorial",
  "statsBand",
  "processSteps",
  "caseStudyGrid",
  "googleReviews",
  "testimonialSlider",
  "faq",
  "ctaBanner",
  "imageText",
  "logoCloud",
  "contactForm",
  "gallery",
  "quote",
] as const satisfies readonly SectionType[];

export function isSectionType(value: unknown): value is SectionType {
  return typeof value === "string" && (SECTION_TYPES as readonly string[]).includes(value);
}

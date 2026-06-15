import type { Metadata } from "next";
import { CmsPage } from "@/components/site/CmsPage";
import { getPublishedPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPublishedPage("case-studies"), getSiteSettings()]);
  return buildMetadata(page?.seo || settings.seoDefaults, settings, "/case-studies");
}

export default function CaseStudiesPage() {
  return <CmsPage slug="case-studies" />;
}

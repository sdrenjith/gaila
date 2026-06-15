import type { Metadata } from "next";
import { CmsPage } from "@/components/site/CmsPage";
import { getPublishedPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPublishedPage("services"), getSiteSettings()]);
  return buildMetadata(page?.seo || settings.seoDefaults, settings, "/services");
}

export default function ServicesPage() {
  return <CmsPage slug="services" />;
}

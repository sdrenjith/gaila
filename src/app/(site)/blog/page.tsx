import type { Metadata } from "next";
import { CmsPage } from "@/components/site/CmsPage";
import { getPublishedPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPublishedPage("blog"), getSiteSettings()]);
  return buildMetadata(page?.seo || settings.seoDefaults, settings, "/blog");
}

export default function BlogPage() {
  return <CmsPage slug="blog" />;
}

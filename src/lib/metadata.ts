import type { Metadata } from "next";
import { getPublicUrl } from "@/lib/env";
import type { SeoMeta, SiteSettingsRecord } from "@/types/cms";

export function buildMetadata(seo: SeoMeta, settings: SiteSettingsRecord, path = "/"): Metadata {
  const title = seo.title || settings.seoDefaults.title;
  const description = seo.description || settings.seoDefaults.description;
  const url = getPublicUrl(seo.canonicalPath || path);
  const image = seo.image || settings.seoDefaults.image || "/opengraph-image";

  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : settings.seoDefaults.keywords,
    alternates: { canonical: url },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.siteName,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

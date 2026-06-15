import type { MetadataRoute } from "next";
import { getContent, getPublishedPages } from "@/lib/cms";
import { getPublicUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, cases, posts] = await Promise.all([
    getPublishedPages(),
    getContent("service", true),
    getContent("caseStudy", true),
    getContent("blog", true),
  ]);

  const pageRoutes = pages.map((page) => ({
    url: getPublicUrl(page.slug === "home" ? "/" : `/${page.slug}`),
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
  }));

  const contentRoutes = [...services, ...cases, ...posts].map((item) => ({
    url: getPublicUrl(
      item.kind === "service"
        ? `/services/${item.slug}`
        : item.kind === "caseStudy"
          ? `/case-studies/${item.slug}`
          : `/blog/${item.slug}`,
    ),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  }));

  return [...pageRoutes, ...contentRoutes];
}

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SectionRenderer, sectionNavItems } from "@/components/sections/SectionRenderer";
import { SectionNav } from "@/components/site/SectionNav";
import { getContentBySlug, getPublishedPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { publicPageSections } from "@/lib/page-sections";
import type { ContentRecord } from "@/types/cms";

const CONTENT_REDIRECT_PREFIX: Record<ContentRecord["kind"], string> = {
  caseStudy: "/case-studies",
  service: "/services",
  blog: "/blog",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  if (!page) {
    return buildMetadata(settings.seoDefaults, settings, `/${slug}`);
  }
  return buildMetadata(page.seo, settings, `/${slug}`);
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  if (!page) {
    const content = await getContentBySlug(slug);
    if (content) {
      permanentRedirect(`${CONTENT_REDIRECT_PREFIX[content.kind]}/${slug}`);
    }
    notFound();
  }

  const sections = publicPageSections(slug, page.sections);
  const navItems = sectionNavItems(sections);

  return (
    <>
      <SectionNav items={navItems} />
      <SectionRenderer sections={sections} />
    </>
  );
}

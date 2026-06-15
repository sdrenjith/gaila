import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer, sectionNavItems } from "@/components/sections/SectionRenderer";
import { SectionNav } from "@/components/site/SectionNav";
import { getPublishedPage, getSiteSettings } from "@/lib/cms";
import { heroPosterFromSections } from "@/lib/hero-poster";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPublishedPage("home"), getSiteSettings()]);
  return buildMetadata(page?.seo || settings.seoDefaults, settings, "/");
}

export default async function Home() {
  const page = await getPublishedPage("home");
  if (!page) {
    notFound();
  }

  const navItems = sectionNavItems(page.sections);
  const heroPoster = heroPosterFromSections(page.sections);

  return (
    <>
      {heroPoster ? (
        <link rel="preload" as="image" href={heroPoster} fetchPriority="high" />
      ) : null}
      <SectionNav items={navItems} />
      <SectionRenderer sections={page.sections} />
    </>
  );
}

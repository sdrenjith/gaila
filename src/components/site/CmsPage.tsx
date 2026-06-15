import { notFound } from "next/navigation";
import { SectionRenderer, sectionNavItems } from "@/components/sections/SectionRenderer";
import { SectionNav } from "@/components/site/SectionNav";
import { getPublishedPage } from "@/lib/cms";

export async function CmsPage({ slug }: { slug: string }) {
  const page = await getPublishedPage(slug);
  if (!page) {
    notFound();
  }

  return (
    <>
      <SectionNav items={sectionNavItems(page.sections)} />
      <SectionRenderer sections={page.sections} />
    </>
  );
}

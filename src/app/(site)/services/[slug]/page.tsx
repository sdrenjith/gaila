import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EditorialCta } from "@/components/sections/EditorialCta";
import { SectionRenderer, sectionNavItems } from "@/components/sections/SectionRenderer";
import { ServicesEditorial } from "@/components/sections/ServicesEditorial";
import { SectionNav } from "@/components/site/SectionNav";
import { getContent, getContentBySlug, getPublishedPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, settings] = await Promise.all([getContentBySlug(slug), getSiteSettings()]);
  if (!item) {
    return buildMetadata(settings.seoDefaults, settings, `/services/${slug}`);
  }
  return buildMetadata(item.seo, settings, `/services/${slug}`);
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const [item, layoutPage] = await Promise.all([
    getContentBySlug(slug),
    getPublishedPage(`service-${slug}`),
  ]);

  if (!item || item.kind !== "service") {
    notFound();
  }

  if (layoutPage?.sections?.length) {
    const sections = layoutPage.sections.filter((section) => section.enabled);
    const navItems = sectionNavItems(sections);

    return (
      <>
        <SectionNav items={navItems} />
        <SectionRenderer sections={sections} />
      </>
    );
  }

  const all = await getContent("service", true);
  const related = all.filter((entry) => entry.slug !== item.slug).slice(0, 4);

  const cover =
    item.coverImage ||
    "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=2400&q=80";

  return (
    <article className="bg-white">
      <header className="relative isolate overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-0 -z-10">
          <Image src={cover} alt={item.title} fill priority sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(14,14,14,0.55)] via-[rgba(14,14,14,0.45)] to-[rgba(14,14,14,0.95)]" />
          <div className="editorial-grain absolute inset-0" />
        </div>
        <div className="mx-auto flex max-w-[1480px] flex-col gap-10 px-5 pb-24 pt-32 sm:px-8 lg:px-14 lg:pb-32 lg:pt-40">
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-light)]">
            <span className="inline-block h-px w-10 bg-[var(--gold-light)]/60" />
            Service · Dubai &amp; UAE
          </p>
          <h1 className="max-w-5xl font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.96] tracking-[-0.03em]">
            {item.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{item.excerpt}</p>
          {item.metrics && item.metrics.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-3 lg:max-w-3xl">
              {item.metrics.slice(0, 3).map((metric, idx) => (
                <div key={idx}>
                  <dd className="font-display text-[clamp(2rem,3.6vw,3rem)] leading-none text-white">
                    {metric.value}
                  </dd>
                  <dt className="mt-2 text-[11px] uppercase tracking-[0.32em] text-white/55">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold-deep)]">
              Service area
            </p>
            <p className="mt-2 font-display text-3xl tracking-[-0.02em] text-[var(--ink)]">{item.title}</p>
            <ul className="mt-8 space-y-3 border-t border-[var(--hairline-strong)] pt-6 text-sm text-[var(--ink-soft)]">
              {(item.tags ?? []).map((tag) => (
                <li key={tag} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-[var(--ink-mute)]">
                  <span aria-hidden="true" className="h-px w-6 bg-[var(--ink-mute)]/50" />
                  {tag}
                </li>
              ))}
            </ul>
          </aside>
          <div className="space-y-6 text-lg leading-9 text-[var(--ink-soft)]">
            {item.body.split("\n").filter(Boolean).map((paragraph, index) => (
              <p
                key={`${item._id}-p-${index}`}
                className="first:text-[var(--ink)] first:font-display first:text-[clamp(1.5rem,2.4vw,2.2rem)] first:leading-snug first:tracking-[-0.01em]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <ServicesEditorial
          eyebrow="More from Gaila"
          title="Other services we run from the same studio."
          items={related}
        />
      )}

      <EditorialCta
        title="Plan your event with Gaila"
        subtitle="Share your brief and timeline. We&rsquo;ll come back with a practical proposal and a clear run-of-show outline."
        ctaLabel="Request a proposal"
        ctaHref="/contact"
        variant="dark"
      />
    </article>
  );
}

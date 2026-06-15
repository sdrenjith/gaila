import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudiesEditorial } from "@/components/sections/CaseStudiesEditorial";
import { EditorialCta } from "@/components/sections/EditorialCta";
import { getContent, getContentBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, settings] = await Promise.all([getContentBySlug(slug), getSiteSettings()]);
  return buildMetadata(item?.seo || settings.seoDefaults, settings, `/case-studies/${slug}`);
}

export default async function CaseStudyDetail({ params }: Props) {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item || item.kind !== "caseStudy") {
    notFound();
  }
  const allCases = await getContent("caseStudy", true);
  const related = allCases.filter((entry) => entry.slug !== item.slug).slice(0, 3);

  const cover =
    item.coverImage ||
    "https://images.unsplash.com/photo-1522335789203-aaa0e7d04a96?auto=format&fit=crop&w=2400&q=80";

  return (
    <article className="bg-white">
        {/* HERO */}
        <header className="relative isolate overflow-hidden bg-[var(--ink)] text-white">
          <div className="absolute inset-0 -z-10">
            <Image src={cover} alt={item.title} fill priority sizes="100vw" className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(14,14,14,0.55)] to-[rgba(14,14,14,0.95)]" />
            <div className="editorial-grain absolute inset-0" />
          </div>
          <div className="mx-auto flex max-w-[1480px] flex-col gap-10 px-5 pb-24 pt-32 sm:px-8 lg:px-14 lg:pb-32 lg:pt-40">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-light)]">
              <span className="inline-block h-px w-10 bg-[var(--gold-light)]/60" />
              Case study · {item.tags?.[0] ?? "Brand"}
            </p>
            <h1 className="max-w-5xl font-display text-[clamp(2.6rem,8vw,8rem)] leading-[0.96] tracking-[-0.03em]">
              {item.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{item.excerpt}</p>
            {item.metrics && item.metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-3 lg:max-w-3xl">
                {item.metrics.slice(0, 3).map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none text-white">
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

        {/* BODY */}
        <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.35fr_0.65fr]">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold-deep)]">
                Project
              </p>
              <p className="mt-2 font-display text-3xl tracking-[-0.02em] text-[var(--ink)]">{item.title}</p>
              <ul className="mt-8 space-y-4 border-t border-[var(--hairline-strong)] pt-6 text-sm text-[var(--ink-soft)]">
                {(item.tags ?? []).map((tag) => (
                  <li key={tag} className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-6 bg-[var(--ink-mute)]/50" />
                    <span className="text-[11px] uppercase tracking-[0.32em] text-[var(--ink-mute)]">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="space-y-6 text-lg leading-9 text-[var(--ink-soft)]">
              {item.body.split("\n").filter(Boolean).map((paragraph, index) => (
                <p key={`${item._id}-p-${index}`} className="first:text-[var(--ink)] first:font-display first:text-[clamp(1.4rem,2.2vw,2rem)] first:leading-snug first:tracking-[-0.01em]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <CaseStudiesEditorial
            eyebrow="More work"
            title="Other projects from the studio."
            items={related}
            kind="caseStudy"
          />
        )}

        <EditorialCta
          title="Want a campaign like this?"
          subtitle="Tell us what you&rsquo;re trying to grow and we&rsquo;ll share a practical plan in the first call."
          ctaLabel="Start a project"
          ctaHref="/contact"
          variant="dark"
        />
        <Link href="/case-studies" className="sr-only">Back to all case studies</Link>
      </article>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialCta } from "@/components/sections/EditorialCta";
import { EditorialMarquee } from "@/components/sections/EditorialMarquee";
import { getContent, getContentBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, settings] = await Promise.all([getContentBySlug(slug), getSiteSettings()]);
  return buildMetadata(item?.seo || settings.seoDefaults, settings, `/blog/${slug}`);
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item || item.kind !== "blog") {
    notFound();
  }
  const related = (await getContent("blog", true))
    .filter((entry) => entry.slug !== item.slug)
    .slice(0, 4);
  const marqueeItems = related.map((entry) => entry.title);

  return (
    <article className="bg-white">
        <header className="px-5 pb-16 pt-32 sm:px-8 lg:px-14 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
              <span className="inline-block h-px w-10 bg-[var(--gold-deep)]/60" />
              Blog · {item.tags?.[0] ?? "Journal"}
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1] tracking-[-0.02em] text-[var(--ink)]">
              {item.title}
            </h1>
            <p className="mt-6 text-xl leading-9 text-[var(--ink-soft)]">{item.excerpt}</p>
          </div>
        </header>

        {item.coverImage && (
          <div className="px-5 sm:px-8 lg:px-14">
            <div className="relative mx-auto aspect-[16/9] max-w-[1480px] overflow-hidden rounded-[2rem]">
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                priority
                sizes="(min-width: 1024px) 1480px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="space-y-7 text-lg leading-9 text-[var(--ink-soft)]">
            {item.body.split("\n").filter(Boolean).map((paragraph, index) => (
              <p
                key={`${item._id}-p-${index}`}
                className="first:text-[var(--ink)] first:font-display first:text-[clamp(1.4rem,2.2vw,2rem)] first:leading-snug first:tracking-[-0.01em]"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-12 border-t border-[var(--hairline-strong)] pt-6 text-[11px] uppercase tracking-[0.32em] text-[var(--ink-mute)]">
              Tagged · {item.tags.join(" · ")}
            </div>
          )}
        </div>

        {marqueeItems.length > 0 && (
          <div className="mb-4">
            <EditorialMarquee items={marqueeItems} speedSeconds={45} />
          </div>
        )}

        {related.length > 0 && (
          <section className="border-t border-[var(--hairline)] bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
            <div className="mx-auto max-w-[1480px]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                More from the blog
              </p>
              <h2 className="mb-12 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
                Keep reading.
              </h2>
              <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {related.map((entry) => (
                  <li key={entry._id}>
                    <Link href={`/blog/${entry.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[var(--cream-deep)] shadow-[var(--shadow-card)] ring-1 ring-[var(--hairline)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card-hover)] group-hover:ring-[var(--hairline-strong)]">
                        {entry.coverImage && (
                          <Image
                            src={entry.coverImage}
                            alt={entry.title}
                            fill
                            sizes="(min-width: 1024px) 320px, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <h3 className="mt-4 font-display text-xl leading-snug tracking-[-0.01em] text-[var(--ink)] transition group-hover:text-[var(--gold-deep)]">
                        {entry.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <EditorialCta
          title="Planning an event in Dubai?"
          subtitle="Tell us about your occasion, guest profile, and timeline. We&rsquo;ll share practical guidance from our latest UAE programmes."
          ctaLabel="Plan your event"
          ctaHref="/contact"
          variant="dark"
        />
      </article>
  );
}

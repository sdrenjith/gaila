"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ContentRecord, StorySubitemRecord } from "@/types/cms";

export type EditorialGridItem = ContentRecord & {
  subitems?: StorySubitemRecord[];
};

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: EditorialGridItem[];
  hrefBase?: string;
  kind?: "caseStudy" | "blog";
};

export function CaseStudiesEditorial({
  eyebrow,
  title,
  subtitle,
  items,
  hrefBase,
  kind = "caseStudy",
}: Props) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;
  const linkBase = hrefBase ?? (kind === "blog" ? "/blog" : "/case-studies");

  return (
    <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1480px]">
        {(eyebrow || title || subtitle) && (
          <div className="mb-16">
            {eyebrow && (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                {eyebrow}
              </p>
            )}
            {(title || subtitle) && (
              <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:gap-x-16">
                {title && (
                  <h2 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="max-w-md text-[15px] leading-8 text-[var(--ink-soft)] lg:justify-self-end lg:pt-[0.4em] lg:text-right">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-y-16 lg:gap-y-24">
          {items.map((item, index) => {
            const reversed = index % 2 === 1;
            const cover =
              item.coverImage ||
              "https://images.unsplash.com/photo-1522335789203-aaa0e7d04a96?auto=format&fit=crop&w=1600&q=80";
            const publishedSubitems = (item.subitems ?? []).filter(
              (subitem) => subitem.status === "published",
            );
            return (
              <motion.article
                key={item._id}
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`grid items-start gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <Link
                  href={`${linkBase}/${item.slug}`}
                  className="group relative block w-full overflow-hidden rounded-3xl bg-[var(--cream-deep)] shadow-[var(--shadow-card)] ring-1 ring-[var(--hairline)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--hairline-strong)]"
                  aria-label={`Open ${item.title}`}
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={cover}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 580px, (min-width: 640px) 80vw, 100vw"
                      className="object-cover transition duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,14,0.45)] via-transparent to-transparent" />
                    <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-white backdrop-blur">
                      {String(index + 1).padStart(2, "0")} · {kind === "blog" ? "Blog" : "Case study"}
                    </span>
                  </div>
                </Link>
                <div className="flex flex-col justify-center">
                  <Link
                    href={`${linkBase}/${item.slug}`}
                    className="font-display text-[clamp(2rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)] transition hover:text-[var(--gold-deep)]"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-5 max-w-xl text-[15px] leading-8 text-[var(--ink-soft)]">{item.excerpt}</p>
                  {publishedSubitems.length > 0 ? (
                    <div className="mt-6 rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-mute)]">
                        Related items
                      </p>
                      <ul className="mt-3 grid gap-3">
                        {publishedSubitems.map((subitem) => (
                          <li key={subitem.id} className="rounded-xl border border-[var(--hairline)] bg-white p-3">
                            <p className="font-semibold text-[var(--ink)]">{subitem.title}</p>
                            {subitem.content ? (
                              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{subitem.content}</p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {item.metrics && item.metrics.length > 0 && (
                    <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[var(--hairline-strong)] pt-7 sm:grid-cols-3">
                      {item.metrics.slice(0, 3).map((metric) => (
                        <div key={metric.label}>
                          <p className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--ink)]">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[var(--ink-mute)]">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`${linkBase}/${item.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 border-b border-[var(--ink)] pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
                  >
                    Read the project
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

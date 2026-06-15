"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ContentRecord } from "@/types/cms";

function hrefFor(item: ContentRecord) {
  if (item.kind === "service") return `/services/${item.slug}`;
  if (item.kind === "caseStudy") return `/case-studies/${item.slug}`;
  return `/blog/${item.slug}`;
}

const placeholderCover =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80";

export function ContentCard({ item }: { item: ContentRecord }) {
  const reduceMotion = useReducedMotion();
  const cover = item.coverImage || placeholderCover;
  const href = hrefFor(item);

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-500 hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-card-hover)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={cover}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,14,0.45)] to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          {(item.tags ?? []).length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {(item.tags ?? []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--hairline)] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold-deep)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-display text-2xl leading-snug tracking-[-0.01em] text-[var(--ink)] transition group-hover:text-[var(--gold-deep)]">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.excerpt}</p>
          {item.metrics && item.metrics.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {item.metrics.slice(0, 2).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[var(--hairline)] bg-[var(--cream-deep)] p-4"
                >
                  <p className="font-display text-xl leading-none tracking-[-0.01em] text-[var(--gold-deep)]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}
          <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)]">
            {item.kind === "service" ? "View service" : item.kind === "caseStudy" ? "Read case study" : "Read article"}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

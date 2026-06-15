"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ContentRecord } from "@/types/cms";

export type ServicesEditorialItem = Pick<
  ContentRecord,
  "_id" | "title" | "excerpt" | "coverImage" | "tags" | "slug"
> & {
  href?: string;
  ctaLabel?: string;
};

type ServicesEditorialProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: ServicesEditorialItem[];
  linkLabel?: string;
  layout?: "editorial" | "stacked";
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=1600&q=80",
];

type ServiceCardProps = {
  item: ServicesEditorialItem;
  index: number;
  reduceMotion: boolean | null;
  compact?: boolean;
  linkLabel?: string;
};

function ServiceCard({ item, index, reduceMotion, compact = false, linkLabel }: ServiceCardProps) {
  const cover = item.coverImage || fallbackImages[index % fallbackImages.length];
  const indexLabel = String(index + 1).padStart(2, "0");
  const href = item.href?.trim() || (item.slug ? `/services/${item.slug}` : "");
  const isLink = Boolean(href && href !== "#");
  const ctaText =
    item.ctaLabel?.trim() ||
    (linkLabel?.trim() ? `${linkLabel.trim()} ${item.title} →` : isLink ? "View service" : "");

  const cardClassName =
    "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-white shadow-[var(--shadow-card)] transition duration-500 hover:-translate-y-0.5 hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream-deep)] motion-reduce:transform-none sm:flex-row sm:items-stretch";

  const cardInner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />

      <div
        className={`relative flex flex-1 flex-col ${compact ? "p-5 sm:p-6 lg:p-7" : "p-6 sm:p-8 lg:p-9"}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-2 top-2 select-none font-display leading-none tracking-[-0.04em] text-[var(--ink)]/[0.04] transition duration-500 group-hover:text-[var(--gold-deep)]/10 ${
            compact
              ? "text-[clamp(3rem,6vw,4.5rem)]"
              : "text-[clamp(4rem,8vw,6.5rem)]"
          }`}
        >
          {indexLabel}
        </span>

        <div className="relative flex items-start gap-4">
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[var(--cream-deep)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)] transition duration-300 group-hover:border-[var(--gold)] group-hover:bg-white">
            {indexLabel}
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display leading-[1.06] tracking-[-0.02em] text-[var(--ink)] transition duration-300 group-hover:text-[var(--gold-deep)] ${
                compact
                  ? "text-[clamp(1.35rem,2.4vw,1.85rem)]"
                  : "text-[clamp(1.6rem,3.2vw,2.6rem)]"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-3 text-[var(--ink-soft)] ${compact ? "text-[14px] leading-6" : "max-w-xl text-[15px] leading-7"}`}
            >
              {item.excerpt}
            </p>
          </div>
        </div>

        {(item.tags ?? []).length > 0 && (
          <div className="relative mt-6 flex flex-wrap gap-2 border-t border-[var(--hairline)] pt-5">
            {(item.tags ?? []).slice(0, compact ? 3 : 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--hairline)] bg-[var(--cream-deep)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)] transition duration-300 group-hover:border-[var(--hairline-strong)] group-hover:text-[var(--gold-deep)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {ctaText && (
          <span className="relative mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition duration-300 group-hover:text-[var(--gold-deep)] sm:mt-auto sm:pt-6">
            {ctaText}
            {!ctaText.endsWith("→") && (
              <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
                →
              </span>
            )}
          </span>
        )}
      </div>

      <div
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--cream-deep)] sm:aspect-auto sm:w-[38%] ${
          compact ? "lg:w-[40%]" : "lg:w-[42%]"
        }`}
      >
        <Image
          src={cover}
          alt={item.title}
          fill
          sizes={
            compact
              ? "(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
              : "(min-width: 640px) 280px, 100vw"
          }
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent sm:bg-gradient-to-l sm:from-white/30" />
      </div>
    </>
  );

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index, 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      {isLink ? (
        <Link href={href!} className={cardClassName}>
          {cardInner}
        </Link>
      ) : (
        <div className={cardClassName}>{cardInner}</div>
      )}
    </motion.li>
  );
}

export function ServicesEditorial({
  eyebrow,
  title,
  subtitle,
  items,
  linkLabel,
  layout = "editorial",
}: ServicesEditorialProps) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;

  const introBlock = (eyebrow || title || subtitle) && (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={layout === "stacked" ? "mb-12 w-full sm:mb-14 lg:mb-16" : "lg:sticky lg:top-32"}
    >
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-[var(--gold-deep)]/50" />
          {eyebrow}
        </p>
      )}
      {layout === "stacked" && (title || subtitle) ? (
        <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:gap-x-16">
          {title && (
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[15px] leading-8 text-[var(--ink-soft)] lg:justify-self-end lg:pt-[0.4em] lg:text-right">
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <>
          {title && (
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-6 max-w-md text-[15px] leading-8 text-[var(--ink-soft)]">{subtitle}</p>
          )}
        </>
      )}
      {layout === "editorial" && (
        <div className="mt-10 flex items-center gap-4 border-t border-[var(--hairline-strong)] pt-8">
          <span className="font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-none tracking-[-0.04em] text-[var(--ink)]">
            {String(items.length).padStart(2, "0")}
          </span>
          <p className="max-w-[12rem] text-[11px] font-semibold uppercase leading-5 tracking-[0.28em] text-[var(--ink-mute)]">
            Services led by one senior studio team
          </p>
        </div>
      )}
    </motion.header>
  );

  if (layout === "stacked") {
    return (
      <section className="relative overflow-hidden bg-[var(--cream-deep)] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div aria-hidden="true" className="editorial-grain pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,163,91,0.14)_0%,transparent_68%)]"
        />

        <div className="relative mx-auto max-w-[1320px]">
          {introBlock}
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 sm:gap-8 lg:gap-x-10 lg:gap-y-12">
            {items.map((item, index) => (
              <ServiceCard
                key={item._id}
                item={item}
                index={index}
                reduceMotion={reduceMotion}
                compact
                linkLabel={linkLabel}
              />
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = items;
  const gridItems = rest;

  return (
    <section className="relative overflow-hidden bg-[var(--cream-deep)] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
      <div aria-hidden="true" className="editorial-grain pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,163,91,0.14)_0%,transparent_68%)]"
      />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Intro + featured — explicit row so tops align */}
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.54fr)] lg:gap-x-12 xl:gap-x-16">
          {introBlock && <motion.aside>{introBlock}</motion.aside>}

          <ul className="m-0 list-none p-0">
            <ServiceCard item={featured} index={0} reduceMotion={reduceMotion} linkLabel={linkLabel} />
          </ul>
        </div>

        {/* Remaining services — 2-column grid with extra breathing room */}
        {gridItems.length > 0 && (
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:mt-20 lg:gap-x-10 lg:gap-y-12 lg:px-6 xl:px-10">
            {gridItems.map((item, gridIndex) => (
              <ServiceCard
                key={item._id}
                item={item}
                index={gridIndex + 1}
                reduceMotion={reduceMotion}
                compact
                linkLabel={linkLabel}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

type EditorialImageTextProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  checklistTitle?: string;
  footer?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  align?: "left" | "right";
  ctaLabel?: string;
  ctaHref?: string;
  headingAs?: "h1" | "h2";
};

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5"
    >
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EditorialImageText({
  eyebrow,
  title,
  subtitle,
  body,
  checklistTitle,
  footer,
  bullets = [],
  image,
  imageAlt,
  align = "left",
  ctaLabel,
  ctaHref,
  headingAs = "h2",
}: EditorialImageTextProps) {
  const HeadingTag = headingAs === "h1" ? "h1" : "h2";
  const checklistItems = bullets.map((item) => item.trim()).filter(Boolean);
  const paragraphs = body ? body.split("\n").filter(Boolean) : [];
  const hasChecklist = checklistItems.length > 0;
  const footerText = footer?.trim() ?? "";
  const hasRichContent = paragraphs.length >= 3 || hasChecklist || Boolean(footerText);
  const reduceMotion = useReducedMotion();
  const fallbackImage =
    "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1800&q=80";

  const imageBlock = (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${hasRichContent ? "lg:sticky lg:top-28 lg:self-start" : ""}`}
    >
      {/* Decorative offset frame */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -z-10 hidden rounded-[var(--radius-editorial)] bg-[var(--cream-deep)] lg:block ${
          align === "right"
            ? "-left-5 -top-5 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)]"
            : "-right-5 -top-5 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)]"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute hidden h-24 w-px bg-gradient-to-b from-[var(--gold)]/70 via-[var(--gold)]/30 to-transparent lg:block ${
          align === "right" ? "-left-8 top-8" : "-right-8 top-8"
        }`}
      />

      <div className="relative overflow-hidden rounded-[var(--radius-editorial)] bg-[var(--cream-deep)] shadow-[var(--shadow-card)] ring-1 ring-[var(--hairline)] transition duration-500 hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--hairline-strong)]">
        <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-[5/4]">
          <motion.div
            initial={reduceMotion ? false : { scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={image || fallbackImage}
              alt={imageAlt || title || "Editorial illustration"}
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(14,14,14,0.12)] via-transparent to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );

  const bodyBlock = paragraphs.length > 0 && (
    <div
      className={
        paragraphs.length >= 4
          ? "mt-8 space-y-5 lg:columns-2 lg:gap-x-10 lg:space-y-0 [&>p]:break-inside-avoid [&>p]:pb-5"
          : "mt-8 max-w-prose space-y-5"
      }
    >
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={
            index === 0
              ? "text-[clamp(1.05rem,1.6vw,1.2rem)] font-medium leading-[1.75] text-[var(--ink)]"
              : "text-[15px] leading-[1.85] text-[var(--ink-soft)]"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );

  const checklistBlock = hasChecklist && (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-[var(--cream-deep)] p-6 sm:p-8 lg:mt-16 lg:p-10"
    >
      {checklistTitle && (
        <h3 className="font-display text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.08] tracking-[-0.02em] text-[var(--ink)]">
          {checklistTitle}
        </h3>
      )}
      <ul
        className={`grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4 ${checklistTitle ? "mt-7" : ""}`}
      >
        {checklistItems.map((item, index) => (
          <motion.li
            key={item}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.45,
              delay: Math.min(index, 5) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex gap-3.5 rounded-2xl border border-transparent bg-[var(--cream)]/60 px-4 py-3.5 transition duration-300 hover:border-[var(--hairline)] hover:bg-[var(--cream)]"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[var(--cream)] text-[var(--gold-deep)] shadow-sm"
            >
              <CheckIcon />
            </span>
            <span className="text-[14px] leading-6 text-[var(--ink-soft)] sm:text-[15px] sm:leading-7">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  const footerBlock = footerText && (
    <p className="mt-8 max-w-prose text-[15px] leading-[1.85] text-[var(--ink-soft)] sm:mt-10">
      {footerText}
    </p>
  );

  const ctaBlock = (ctaLabel || ctaHref) && (
    <Link
      href={ctaHref || "/contact"}
      className="group mt-10 inline-flex items-center gap-3 border-b border-[var(--ink)] pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
    >
      {ctaLabel || "Learn more"}
      <span aria-hidden="true" className="transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  );

  return (
    <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      {/* Subtle ambient wash for rich sections */}
      {hasRichContent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[var(--cream-deep)]/40 to-transparent"
        />
      )}

      <div className="relative mx-auto max-w-[1480px]">
        {hasRichContent ? (
          <>
            {/* Full-width header */}
            {(eyebrow || title || subtitle) && (
              <header className="mb-12 max-w-3xl lg:mb-14">
                {eyebrow && (
                  <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                    <span
                      aria-hidden="true"
                      className="inline-block h-px w-10 bg-[var(--gold-deep)]/50"
                    />
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <HeadingTag className="font-display text-[clamp(2.1rem,4.8vw,4.2rem)] leading-[1.04] tracking-[-0.02em] text-[var(--ink)]">
                    {title}
                  </HeadingTag>
                )}
                {subtitle && (
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
                    {subtitle}
                  </p>
                )}
              </header>
            )}

            {/* Image + body grid */}
            <div
              className={`grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14 xl:gap-20 ${
                align === "right" ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {imageBlock}
              <div className="min-w-0">
                {bodyBlock}
                {!hasChecklist && ctaBlock}
              </div>
            </div>

            {checklistBlock}
            {footerBlock}
            {hasChecklist && ctaBlock && (
              <div className="mt-10 flex justify-start sm:justify-end">{ctaBlock}</div>
            )}
          </>
        ) : (
          /* Compact layout for short about-page sections */
          <div
            className={`grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14 ${
              align === "right" ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {imageBlock}
            <div>
              {eyebrow && (
                <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-px w-10 bg-[var(--gold-deep)]/50"
                  />
                  {eyebrow}
                </p>
              )}
              {title && (
                <HeadingTag className="font-display text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
                  {title}
                </HeadingTag>
              )}
              {subtitle && (
                <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
                  {subtitle}
                </p>
              )}
              {bodyBlock}
              {checklistBlock}
              {footerBlock}
              {ctaBlock}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

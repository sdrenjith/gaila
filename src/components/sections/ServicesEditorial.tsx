"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deferUntilIdle } from "@/lib/defer-idle";
import { sliderMountIndices } from "@/lib/slider-mount-indices";
import { useInViewMount } from "@/lib/use-in-view-mount";
import { cn } from "@/lib/utils";
import type { ContentRecord } from "@/types/cms";

export type ServicesEditorialItem = Pick<
  ContentRecord,
  "_id" | "title" | "excerpt" | "coverImage" | "tags" | "slug"
> & {
  href?: string;
  ctaLabel?: string;
};

export type ServicesSliderImage = {
  image?: string;
  alt?: string;
};

type ServicesEditorialProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: ServicesEditorialItem[];
  linkLabel?: string;
  layout?: "editorial" | "stacked";
  sliderImages?: ServicesSliderImage[];
  intervalSeconds?: number;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
];

type ServiceCardProps = {
  item: ServicesEditorialItem;
  index: number;
  reduceMotion: boolean | null;
  compact?: boolean;
  grid?: boolean;
  linkLabel?: string;
};

function ServiceCard({
  item,
  index,
  reduceMotion,
  compact = false,
  grid = false,
  linkLabel,
}: ServiceCardProps) {
  const cover = item.coverImage || fallbackImages[index % fallbackImages.length];
  const indexLabel = String(index + 1).padStart(2, "0");
  const href = item.href?.trim() || (item.slug ? `/services/${item.slug}` : "");
  const isLink = Boolean(href && href !== "#");
  const ctaText =
    item.ctaLabel?.trim() ||
    (linkLabel?.trim() ? `${linkLabel.trim()} ${item.title} →` : isLink ? "View service" : "");

  const cardClassName = grid
    ? "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream-deep)] motion-reduce:transform-none"
    : "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream-deep)] motion-reduce:transform-none sm:flex-row sm:items-stretch";

  const cardInner = grid ? (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />

      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--cream-deep)]">
        <Image
          src={cover}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080014]/75 via-transparent to-fuchsia-500/10" />
        <span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-fuchsia-200/25 bg-[#080014]/55 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100 backdrop-blur-md transition duration-300 group-hover:border-[var(--event-cyan)] group-hover:bg-cyan-300/10">
          {indexLabel}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 top-1 select-none font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-[0.02em] text-white/[0.04] transition duration-500 group-hover:text-fuchsia-200/10"
        >
          {indexLabel}
        </span>

        <h3 className="relative font-display text-[clamp(1.2rem,2vw,1.55rem)] uppercase leading-[0.94] tracking-[0.02em] text-[var(--ink)] transition duration-300 group-hover:text-[var(--gold-light)]">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="relative mt-2 line-clamp-2 text-[13px] leading-6 text-[var(--ink-soft)]">
            {item.excerpt}
          </p>
        )}

        {(item.tags ?? []).length > 0 && (
          <div className="relative mt-4 flex flex-wrap gap-1.5 border-t border-[var(--hairline)] pt-4">
            {(item.tags ?? []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-mute)] transition duration-300 group-hover:border-fuchsia-200/30 group-hover:text-fuchsia-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {ctaText && (
          <span className="relative mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition duration-300 group-hover:text-[var(--event-cyan)] sm:mt-auto sm:pt-4">
            {ctaText}
            {!ctaText.endsWith("→") && (
              <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
                →
              </span>
            )}
          </span>
        )}
      </div>
    </>
  ) : (
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
          className={`pointer-events-none absolute -right-2 top-2 select-none font-display leading-none tracking-[0.02em] text-white/[0.04] transition duration-500 group-hover:text-fuchsia-200/10 ${
            compact
              ? "text-[clamp(3rem,6vw,4.5rem)]"
              : "text-[clamp(4rem,8vw,6.5rem)]"
          }`}
        >
          {indexLabel}
        </span>

        <div className="relative flex items-start gap-4">
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-fuchsia-200/25 bg-fuchsia-300/10 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100 transition duration-300 group-hover:border-[var(--event-cyan)] group-hover:bg-cyan-300/10">
            {indexLabel}
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display uppercase leading-[0.94] tracking-[0.02em] text-[var(--ink)] transition duration-300 group-hover:text-[var(--gold-light)] ${
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
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)] transition duration-300 group-hover:border-fuchsia-200/30 group-hover:text-fuchsia-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {ctaText && (
          <span className="relative mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition duration-300 group-hover:text-[var(--event-cyan)] sm:mt-auto sm:pt-6">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#080014]/70 via-transparent to-fuchsia-500/10" />
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

type ServicesHeroSliderProps = {
  images: ServicesSliderImage[];
  reduceMotion: boolean | null;
  intervalSeconds?: number;
  className?: string;
};

const SLIDER_EASE = [0.22, 1, 0.36, 1] as const;
const IDLE_RESUME_MS = 8000;

const SLIDER_FADE_MS = 450;

function ServicesHeroSlider({
  images,
  reduceMotion,
  intervalSeconds = 3.5,
  className,
}: ServicesHeroSliderProps) {
  const usable = images.filter((item) => Boolean(item.image?.trim()));
  const { ref: viewportRef, inView, hasEntered } = useInViewMount<HTMLDivElement>("200px 0px");
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloadAll, setPreloadAll] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [manualHold, setManualHold] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const intervalMs = Math.max(3000, Math.round(intervalSeconds * 1000));

  const mountedIndices = useMemo(() => {
    if (!hasEntered) return [];
    if (preloadAll) return usable.map((_, index) => index);
    return sliderMountIndices(activeIndex, usable.length);
  }, [activeIndex, hasEntered, preloadAll, usable]);

  useEffect(() => {
    if (!hasEntered || preloadAll || usable.length <= 3) return;
    return deferUntilIdle(() => setPreloadAll(true));
  }, [hasEntered, preloadAll, usable.length]);

  const pauseAutoPlay = useCallback(() => {
    setManualHold(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setManualHold(false), IDLE_RESUME_MS);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    },
    [],
  );

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      if (usable.length === 0) return;
      const next = ((index % usable.length) + usable.length) % usable.length;
      setActiveIndex(next);
      if (fromUser) pauseAutoPlay();
    },
    [pauseAutoPlay, usable.length],
  );

  const goPrev = useCallback(
    () => goTo(activeIndex - 1, true),
    [activeIndex, goTo],
  );
  const goNext = useCallback(
    () => goTo(activeIndex + 1, true),
    [activeIndex, goTo],
  );

  const autoPlayActive =
    inView &&
    hasEntered &&
    usable.length > 1 &&
    !reduceMotion &&
    !manualHold &&
    !isHovered &&
    !isFocused;

  useEffect(() => {
    if (!autoPlayActive) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % usable.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlayActive, intervalMs, usable.length]);

  if (usable.length === 0) return null;

  const current = usable[activeIndex];

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[var(--shadow-card)] backdrop-blur-xl",
        className,
      )}
      aria-roledescription="carousel"
      aria-label="What we do highlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || usable.length < 2) return;
        const delta = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
        touchStartX.current = null;
        if (Math.abs(delta) < 48) return;
        pauseAutoPlay();
        if (delta > 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
      }}
    >
      <div className="relative aspect-[4/3] w-full min-h-0 flex-1 overflow-hidden bg-[var(--cream-deep)] sm:aspect-[3/2] lg:aspect-auto lg:h-full">
        {hasEntered ? (
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={current.image}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: SLIDER_FADE_MS / 1000,
                ease: SLIDER_EASE,
              }}
              className="absolute inset-0 will-change-opacity"
            >
              <Image
                src={current.image!}
                alt={current.alt || `Gaila event styling ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover"
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? undefined : "lazy"}
              />
            </motion.div>
          </AnimatePresence>
        ) : null}
        {mountedIndices
          .filter((index) => index !== activeIndex)
          .map((index) => {
            const slide = usable[index];
            if (!slide?.image) return null;
            return (
              <div key={slide.image} className="pointer-events-none absolute inset-0 -z-10 opacity-0" aria-hidden="true">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            );
          })}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080014]/80 via-[#080014]/10 to-fuchsia-500/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(168,85,247,0.22),transparent_60%)]" />
      </div>

      {usable.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#080014]/55 text-white backdrop-blur-md transition hover:border-fuchsia-300/50 hover:bg-[#080014]/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--event-cyan)]"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ‹
            </span>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#080014]/55 text-white backdrop-blur-md transition hover:border-fuchsia-300/50 hover:bg-[#080014]/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--event-cyan)]"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ›
            </span>
          </button>

          <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2">
            {usable.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goTo(index, true)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[var(--event-cyan)] shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ServicesEditorial({
  eyebrow,
  title,
  subtitle,
  items,
  linkLabel,
  layout = "editorial",
  sliderImages = [],
  intervalSeconds = 3.5,
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
      <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
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

  const rowOne = items.slice(0, 3);
  const rowTwo = items.slice(3, 5);
  const heroSlides =
    sliderImages.length > 0
      ? sliderImages
      : items.slice(0, 5).map((item, index) => ({
          image: item.coverImage || fallbackImages[index % fallbackImages.length],
          alt: item.title,
        }));

  return (
    <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div aria-hidden="true" className="editorial-grain pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,163,91,0.14)_0%,transparent_68%)]"
      />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.54fr)] lg:items-stretch lg:gap-x-12 xl:gap-x-16">
          {introBlock && (
            <motion.aside className="min-h-0 self-start lg:self-stretch">{introBlock}</motion.aside>
          )}
          <div className="relative min-h-0 w-full self-start lg:flex lg:min-h-0 lg:self-stretch">
            <ServicesHeroSlider
              images={heroSlides}
              reduceMotion={reduceMotion}
              intervalSeconds={intervalSeconds}
              className="w-full lg:h-full"
            />
          </div>
        </div>

        {(rowOne.length > 0 || rowTwo.length > 0) && (
          <div className="mt-14 sm:mt-16 lg:mt-20">
            {rowOne.length > 0 && (
              <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
                {rowOne.map((item, index) => (
                  <ServiceCard
                    key={item._id}
                    item={item}
                    index={index}
                    reduceMotion={reduceMotion}
                    grid
                    linkLabel={linkLabel}
                  />
                ))}
              </ul>
            )}

            {rowTwo.length > 0 && (
              <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:mt-8 sm:grid-cols-2 sm:gap-8 lg:gap-x-8 lg:gap-y-10">
                {rowTwo.map((item, index) => (
                  <ServiceCard
                    key={item._id}
                    item={item}
                    index={index + 3}
                    reduceMotion={reduceMotion}
                    grid
                    linkLabel={linkLabel}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

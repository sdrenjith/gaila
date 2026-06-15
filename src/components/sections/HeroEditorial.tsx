"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AMBIENT_VIDEOS } from "@/components/sections/ambient-videos";
import { deferUntilIdle } from "@/lib/defer-idle";
import { notifyHeroMediaStarted } from "@/lib/progressive-media-loader";

export type HeroEditorialCategory = {
  label: string;
  href: string;
  meta?: string;
};

type HeroEditorialProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  video?: string;
  poster?: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  categories?: HeroEditorialCategory[];
  /** When 2+ entries, the headline rotates through them with a fade/blur swap. */
  rotatingTitles?: string[];
  /** Seconds each rotating title is shown. Default 4. */
  rotationSeconds?: number;
};

const HEADLINE_CLASS =
  "font-display text-[clamp(2rem,4.6vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.02em] text-white max-w-[min(100%,38rem)] sm:max-w-[min(100%,44rem)] lg:max-w-[min(100%,50rem)]";

function RotatingHeadline({
  titles,
  intervalMs,
  headingDelay,
  headingStep,
  reduceMotion,
}: {
  titles: string[];
  intervalMs: number;
  headingDelay: number;
  headingStep: number;
  reduceMotion: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (titles.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % titles.length);
    }, Math.max(1500, intervalMs));
    return () => window.clearInterval(id);
  }, [titles.length, intervalMs]);

  const safeIndex = index % Math.max(titles.length, 1);
  const current = titles[safeIndex] ?? "";

  return (
    <div aria-live="polite" className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${safeIndex}-${current}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedHeading
            text={current}
            as="h1"
            delay={headingDelay}
            step={headingStep}
            className={HEADLINE_CLASS}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const DEFAULT_VIDEO = AMBIENT_VIDEOS.homeHero;
const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2400&q=80";

export function HeroEditorial({
  eyebrow,
  title,
  subtitle,
  video,
  poster,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  categories = [],
  rotatingTitles,
  rotationSeconds,
}: HeroEditorialProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const cleanRotating = useMemo(
    () => (rotatingTitles || []).map((t) => t.trim()).filter(Boolean),
    [rotatingTitles],
  );
  const isRotating = cleanRotating.length >= 2;
  const headingText =
    cleanRotating[0] || title || "We build brand stories that perform.";
  const longestWordCount = useMemo(() => {
    const pool = isRotating ? cleanRotating : [headingText];
    return pool.reduce(
      (max, entry) =>
        Math.max(
          max,
          entry.replace(/\|/g, " ").split(" ").filter(Boolean).length,
        ),
      0,
    );
  }, [isRotating, cleanRotating, headingText]);
  const headingDelay = 0.18;
  const headingStep = reduceMotion ? 0 : 0.06;
  const tailDelay = headingDelay + longestWordCount * headingStep;
  const intervalMs = Math.round(Math.max(1.5, rotationSeconds ?? 4) * 1000);

  const resolvedVideo = video || (image ? "" : DEFAULT_VIDEO);
  const resolvedPoster = poster || image || DEFAULT_POSTER;
  const heroAlt = imageAlt || title || "Gaila editorial hero";

  useEffect(() => {
    if (!resolvedVideo || reduceMotion) {
      setShouldLoadVideo(false);
      return;
    }
    return deferUntilIdle(() => {
      setShouldLoadVideo(true);
      notifyHeroMediaStarted(resolvedVideo);
    });
  }, [resolvedVideo, reduceMotion]);

  useEffect(() => {
    if (!shouldLoadVideo || !resolvedVideo || reduceMotion) {
      setVideoReady(false);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    setVideoReady(false);

    const markReady = () => setVideoReady(true);
    const ensurePlaying = () => {
      if (el.paused || el.ended) {
        const p = el.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    };
    const onLoaded = () => {
      markReady();
      ensurePlaying();
    };
    const onPlaying = () => {
      markReady();
    };
    const onEnded = () => {
      try {
        el.currentTime = 0;
      } catch {}
      ensurePlaying();
    };
    const onPause = () => {
      if (!document.hidden) ensurePlaying();
    };
    const onVisibility = () => {
      if (!document.hidden) ensurePlaying();
    };

    el.addEventListener("loadeddata", onLoaded);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);

    // loadeddata may fire before this effect runs (SSR/hydration or cached media).
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || !el.paused) {
      onLoaded();
    } else {
      ensurePlaying();
    }

    return () => {
      el.removeEventListener("loadeddata", onLoaded);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, [shouldLoadVideo, resolvedVideo, reduceMotion]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[var(--ink)] text-white"
      aria-labelledby="hero-editorial-title"
    >
      <style>{`
        @keyframes hero-kenburns {
          0%   { transform: scale(1.04) translate3d(0,0,0); }
          50%  { transform: scale(1.10) translate3d(-1.5%, -1%, 0); }
          100% { transform: scale(1.04) translate3d(0,0,0); }
        }
        .hero-kenburns { animation: hero-kenburns 22s ease-in-out infinite; transform-origin: center; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .hero-kenburns { animation: none; }
        }
      `}</style>
      <div className="absolute inset-0 -z-10">
        {/* Poster always renders; video crossfades in on loadeddata. */}
        <Image
          src={resolvedPoster}
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-[center_30%] transition-opacity duration-700 lg:object-center ${videoReady ? "opacity-0" : "opacity-70"}`}
        />
        {shouldLoadVideo && resolvedVideo && !reduceMotion && (
          <video
            ref={videoRef}
            src={resolvedVideo}
            poster={resolvedPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            // @ts-expect-error fetchPriority is valid on media elements in modern browsers
            fetchPriority="low"
            aria-hidden="true"
            className={`hero-kenburns absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-700 lg:object-center ${
              videoReady ? "opacity-70" : "opacity-0"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_30%,rgba(200,163,91,0.18),transparent_60%),radial-gradient(70%_60%_at_15%_85%,rgba(139,106,38,0.18),transparent_55%)]" />
        <div className="editorial-grain absolute inset-0" />
        <div className="editorial-noise absolute inset-0" />
      </div>

      {/* Foreground content — centered block keeps headline + CTAs above the fold */}
      <div
        className={`relative mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 pt-[clamp(6rem,14vh,8.75rem)] sm:px-8 lg:px-14 ${
          categories.length > 0 ? "pb-16 sm:pb-6" : "pb-6 sm:pb-8"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-5 py-2 sm:gap-6 sm:py-4 lg:gap-7">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-light)]">
              <span className="inline-block h-px w-10 bg-[var(--gold-light)]/60" />
              {eyebrow || "Creative Digital Agency · Dubai"}
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.42em] text-white/45 sm:block">
              UAE
            </p>
          </motion.div>

          {/* Headline + CTAs */}
          <div className="max-w-[1200px]">
            {isRotating ? (
              <RotatingHeadline
                titles={cleanRotating}
                intervalMs={intervalMs}
                headingDelay={headingDelay}
                headingStep={headingStep}
                reduceMotion={Boolean(reduceMotion)}
              />
            ) : (
              <AnimatedHeading
                text={headingText}
                as="h1"
                delay={headingDelay}
                step={headingStep}
                className={HEADLINE_CLASS}
              />
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: tailDelay + 0.1 }}
                className="mt-4 max-w-2xl text-sm leading-7 text-white/70 [text-wrap:pretty] line-clamp-2 sm:mt-5 sm:text-base sm:leading-8 md:line-clamp-none lg:mt-6 lg:text-lg"
              >
                {subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: tailDelay + 0.2 }}
              className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 lg:mt-8"
            >
            {(ctaLabel || ctaHref) && (
              <Link
                href={ctaHref || "/contact"}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[image:linear-gradient(135deg,var(--gold-light),var(--gold)_55%,var(--gold-deep))] px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] shadow-[0_8px_30px_rgba(200,163,91,0.45)] ring-1 ring-inset ring-white/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(200,163,91,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] active:translate-y-0 active:shadow-[0_6px_20px_rgba(200,163,91,0.4)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[220%] motion-reduce:hidden"
                />
                <span className="relative z-10">{ctaLabel || "Get in touch"}</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                >
                  →
                </span>
              </Link>
            )}
            {(secondaryCtaLabel || secondaryCtaHref) && (
              <Link
                href={secondaryCtaHref || "tel:+971502827279"}
                className="group relative inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span className="relative">
                  {secondaryCtaLabel || "Request a proposal"}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-white/80 transition-all duration-300 group-hover:w-full motion-reduce:hidden"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                >
                  →
                </span>
              </Link>
            )}
            </motion.div>
          </div>
        </div>

        {/* Bottom ticker / proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: tailDelay + 0.4 }}
          className="mt-auto hidden shrink-0 flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4 sm:flex lg:pt-5"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/55 lg:text-[11px] lg:tracking-[0.32em]">
            <span className="text-[var(--gold-light)]" aria-hidden="true">★★★★★</span>
            <span>5.0 Google rated · 120+ campaigns · 30+ Dubai brands</span>
          </div>
          <a href="#next-section" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/55 hover:text-white lg:text-[11px] lg:tracking-[0.32em]">
            <span>Scroll</span>
            <span aria-hidden="true" className="transition group-hover:translate-y-0.5">↓</span>
          </a>
        </motion.div>
      </div>

      {/* Mobile horizontal nav chips — overlay so hero stays exactly one viewport tall */}
      {categories.length > 0 && (
        <nav
          aria-label="Site sections"
          className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/35 lg:hidden"
        >
          <div className="no-scrollbar mx-auto flex max-w-7xl gap-3 overflow-x-auto px-5 py-3 text-xs font-medium text-white/85 sm:px-8">
            {categories.map((category, index) => (
              <Link
                key={`${category.href}-${index}`}
                href={category.href}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
              >
                <span className="text-[10px] tracking-[0.32em] text-white/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {category.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

HeroEditorial.defaultVideo = DEFAULT_VIDEO;
HeroEditorial.defaultPoster = DEFAULT_POSTER;

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

type ConnectIconKind = "whatsapp" | "instagram" | "contact";

function ConnectIcon({ kind }: { kind: ConnectIconKind }) {
  const common = "h-4 w-4 shrink-0";
  switch (kind) {
    case "whatsapp":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
  }
}

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
  whatsappHref?: string;
  instagramHref?: string;
  contactHref?: string;
  /** When 2+ entries, the headline rotates through them with a fade/blur swap. */
  rotatingTitles?: string[];
  /** Seconds each rotating title is shown. Default 4. */
  rotationSeconds?: number;
  /** When 2+ entries, crossfades through background images behind overlays. */
  backgroundImages?: string[];
  /** Seconds each background image is shown. Default 6. */
  backgroundIntervalSeconds?: number;
};

const HEADLINE_CLASS =
  "font-display text-[clamp(3.2rem,8vw,7.9rem)] font-normal uppercase leading-[0.86] tracking-[0.015em] text-white max-w-[min(100%,46rem)] sm:max-w-[min(100%,54rem)] lg:max-w-[min(100%,60rem)]";

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
const DEFAULT_POSTER = "/uploads/events/dsc08594-010.jpg";

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
  whatsappHref,
  instagramHref,
  contactHref = "/contact",
  rotatingTitles,
  rotationSeconds,
  backgroundImages,
  backgroundIntervalSeconds,
}: HeroEditorialProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const cleanBackgrounds = useMemo(
    () => (backgroundImages || []).map((url) => url.trim()).filter(Boolean),
    [backgroundImages],
  );
  const hasBgSlider = cleanBackgrounds.length >= 2;
  const bgIntervalMs = Math.round(Math.max(2, backgroundIntervalSeconds ?? 6) * 1000);

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

  const connectLinks = useMemo(() => {
    const links: { label: string; href: string; icon: ConnectIconKind; external: boolean }[] = [];
    if (whatsappHref) {
      links.push({ label: "WhatsApp", href: whatsappHref, icon: "whatsapp", external: true });
    }
    if (instagramHref) {
      links.push({ label: "Instagram", href: instagramHref, icon: "instagram", external: true });
    }
    links.push({ label: "Contact", href: contactHref, icon: "contact", external: false });
    return links;
  }, [whatsappHref, instagramHref, contactHref]);

  const resolvedVideo = hasBgSlider ? "" : video || (image ? "" : DEFAULT_VIDEO);
  const resolvedPoster =
    poster ||
    image ||
    cleanBackgrounds[0] ||
    DEFAULT_POSTER;
  const heroAlt = imageAlt || title || "Gaila editorial hero";

  useEffect(() => {
    if (!hasBgSlider || reduceMotion) return;
    const id = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % cleanBackgrounds.length);
    }, bgIntervalMs);
    return () => window.clearInterval(id);
  }, [hasBgSlider, cleanBackgrounds.length, bgIntervalMs, reduceMotion]);

  useEffect(() => {
    if (!resolvedVideo || reduceMotion) {
      const timer = setTimeout(() => {
        setShouldLoadVideo(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    return deferUntilIdle(() => {
      setShouldLoadVideo(true);
      notifyHeroMediaStarted(resolvedVideo);
    });
  }, [resolvedVideo, reduceMotion]);

  useEffect(() => {
    if (!shouldLoadVideo || !resolvedVideo || reduceMotion) {
      const timer = setTimeout(() => {
        setVideoReady(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    const el = videoRef.current;
    if (!el) return;

    const resetTimer = setTimeout(() => {
      setVideoReady(false);
    }, 0);

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
      clearTimeout(resetTimer);
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
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#080014] text-white"
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
        {hasBgSlider ? (
          <AnimatePresence mode="sync">
            <motion.div
              key={cleanBackgrounds[bgIndex % cleanBackgrounds.length]}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="hero-kenburns absolute inset-0"
            >
              <Image
                src={cleanBackgrounds[bgIndex % cleanBackgrounds.length]}
                alt={heroAlt}
                fill
                priority={bgIndex === 0}
                sizes="100vw"
                className="object-cover object-[center_30%] opacity-50 lg:object-center"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <Image
            src={resolvedPoster}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className={`object-cover object-[center_30%] transition-opacity duration-700 lg:object-center ${videoReady ? "opacity-0" : "opacity-40"}`}
          />
        )}
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
              videoReady ? "opacity-[0.42]" : "opacity-0"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,0,20,0.98)_0%,rgba(42,0,72,0.78)_46%,rgba(8,0,20,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_82%_18%,rgba(168,85,247,0.55),transparent_58%),radial-gradient(50%_60%_at_12%_85%,rgba(255,63,180,0.36),transparent_58%),radial-gradient(38%_44%_at_64%_78%,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[var(--event-pink)]/30 blur-[110px] animate-neon-pulse" />
        <div className="absolute right-4 top-10 h-96 w-96 rounded-full bg-[var(--gold)]/30 blur-[120px] animate-float-slow-2" />
        <div className="editorial-grain absolute inset-0" />
        <div className="editorial-noise absolute inset-0" />
      </div>

      {/* Foreground content — dynamic CMS copy with an event-template screen composition. */}
      <div
        className={`relative mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 pt-[clamp(6rem,14vh,8.75rem)] sm:px-8 lg:px-14 ${
          categories.length > 0 ? "pb-16 sm:pb-6" : "pb-6 sm:pb-8"
        }`}
      >
        <div className="grid min-h-0 flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,0.86fr)] lg:gap-12 lg:py-10">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 flex flex-wrap items-center gap-3"
            >
              <p className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/80 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[var(--event-cyan)] shadow-[0_0_22px_rgba(34,211,238,0.9)]" />
                {eyebrow || "Event Styling & Production · Dubai"}
              </p>
              <p className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-fuchsia-100/85">
                UAE · 2026
              </p>
            </motion.div>

            <div>
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
                  className="mt-6 max-w-2xl text-base leading-8 text-white/72 [text-wrap:pretty] sm:text-lg"
                >
                  {subtitle}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: tailDelay + 0.2 }}
                className="mt-7 flex flex-wrap items-center gap-3 lg:mt-9"
              >
            {(ctaLabel || ctaHref) && (
              <Link
                href={ctaHref || "/contact"}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full gold-gradient cta-shadow px-7 py-4 text-[13px] font-black uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-white/30 transition-all duration-300 ease-out hover:-translate-y-0.5 cta-shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080014] active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
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

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: tailDelay + 0.34 }}
              className="mt-8 grid max-w-xl grid-cols-3 gap-3"
            >
              {["500+ Events", "5.0 Rated", "UAE Wide"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur-xl">
                  <p className="font-display text-2xl uppercase leading-none text-white">{item.split(" ")[0]}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/48">
                    {item.split(" ").slice(1).join(" ") || "Trusted"}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 34, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: tailDelay + 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden min-h-[520px] perspective-[1400px] lg:block"
          >
            <div className="animate-tilt-card absolute left-10 top-7 w-[72%] overflow-hidden rounded-[2rem] border border-white/14 bg-[#0d0520]/90 p-3 shadow-[0_34px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/[0.06] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/55">
                <span>Gaila Live</span>
                <span className="text-[var(--event-cyan)]">Now booking</span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                <Image
                  src={resolvedPoster}
                  alt={heroAlt}
                  fill
                  sizes="560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080014] via-[#220039]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-fuchsia-100/80">Featured event</p>
                  <p className="mt-2 font-display text-4xl uppercase leading-[0.9] text-white">
                    Design. Production. Delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-2 bottom-2 w-[45%] rotate-[5deg] rounded-[1.6rem] border border-white/14 bg-white/[0.08] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">Connect</p>
              <div className="mt-4 grid gap-2">
                {connectLinks.map((link) => {
                  const rowClass =
                    "group flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition hover:border-fuchsia-300/50 hover:text-white";
                  const iconWrap = (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-400/15 to-cyan-400/10 text-fuchsia-100 shadow-[0_0_18px_rgba(168,85,247,0.25)] transition group-hover:border-fuchsia-300/45 group-hover:text-white">
                      <ConnectIcon kind={link.icon} />
                    </span>
                  );
                  const label = <span className="min-w-0 flex-1 truncate">{link.label}</span>;
                  const arrow = (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-fuchsia-200/70 transition group-hover:translate-x-0.5 group-hover:text-fuchsia-100"
                    >
                      →
                    </span>
                  );

                  if (link.external) {
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {iconWrap}
                        {label}
                        {arrow}
                      </a>
                    );
                  }

                  return (
                    <Link key={link.label} href={link.href} className={rowClass}>
                      {iconWrap}
                      {label}
                      {arrow}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
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
            <span>5.0 Google rated · 500+ styled events · UAE-wide production</span>
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
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#080014]"
      />
    </section>
  );
}

HeroEditorial.defaultVideo = DEFAULT_VIDEO;
HeroEditorial.defaultPoster = DEFAULT_POSTER;

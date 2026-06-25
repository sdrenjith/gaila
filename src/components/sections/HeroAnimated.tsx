"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { deferUntilIdle } from "@/lib/defer-idle";
import { notifyHeroMediaStarted } from "@/lib/progressive-media-loader";

type Slide = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type HeroAnimatedProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  slides: Slide[];
  video?: string;
  poster?: string;
};

const DEFAULT_VIDEO = "/uploads/video/home-hero.mp4";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const glowFloat: Variants = {
  rest: { opacity: 0.55, scale: 1 },
  drift: { opacity: [0.5, 0.85, 0.6, 0.5], scale: [1, 1.06, 0.98, 1] },
};

export function HeroAnimated({
  eyebrow,
  title,
  subtitle,
  slides,
  video,
  poster,
}: HeroAnimatedProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const primary = slides[0] ?? {};
  const titleText = title || primary.title || "";
  const subtitleText = subtitle || primary.subtitle || "";
  const titleLines = titleText
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);
  const totalWordCount = titleLines.reduce(
    (sum, line) => sum + line.split(" ").filter(Boolean).length,
    0,
  );
  const ctaLabel = primary.ctaLabel || "Plan your event";
  const ctaHref = primary.ctaHref || "/contact";

  const eyebrowDuration = 0.5;
  const headlineDelayBase = eyebrowDuration + 0.1;
  const headlineDelayStep = reduceMotion ? 0 : 0.06;
  const tailDelay = headlineDelayBase + totalWordCount * headlineDelayStep;

  const showCards = slides.length > 0;
  const cards = (slides.length ? slides : []).slice(0, 3);

  const resolvedVideo = video || DEFAULT_VIDEO;
  const resolvedPoster = poster || "";
  const useVideo = !reduceMotion && Boolean(resolvedVideo);

  useEffect(() => {
    if (!useVideo) {
      const timer = setTimeout(() => {
        setShouldLoadVideo(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    return deferUntilIdle(() => {
      setShouldLoadVideo(true);
      notifyHeroMediaStarted(resolvedVideo);
    });
  }, [useVideo, resolvedVideo]);

  useEffect(() => {
    if (!shouldLoadVideo || !useVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const ensurePlaying = () => {
      if (el.paused || el.ended) {
        void el.play().catch(() => {});
      }
    };

    el.addEventListener("loadeddata", ensurePlaying);
    el.addEventListener("canplay", ensurePlaying);
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || !el.paused) {
      ensurePlaying();
    } else {
      ensurePlaying();
    }

    return () => {
      el.removeEventListener("loadeddata", ensurePlaying);
      el.removeEventListener("canplay", ensurePlaying);
    };
  }, [shouldLoadVideo, resolvedVideo, reduceMotion, useVideo]);

  return (
    <section
      aria-labelledby="hero-animated-title"
      className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-[var(--ink)] px-5 pb-10 pt-[clamp(4.75rem,11vh,7rem)] text-white sm:px-8 sm:pb-12 lg:px-10 lg:pb-14"
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
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {useVideo && shouldLoadVideo ? (
          <video
            ref={videoRef}
            src={resolvedVideo}
            poster={resolvedPoster || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            // @ts-expect-error fetchPriority is valid on media elements in modern browsers
            fetchPriority="low"
            aria-hidden="true"
            className="hero-kenburns absolute inset-0 h-full w-full object-cover object-[center_30%] lg:object-center"
          />
        ) : resolvedPoster ? (
          <img
            src={resolvedPoster}
            alt=""
            decoding="async"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] lg:object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--ink)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_25%,rgba(200,163,91,0.18),transparent_60%),radial-gradient(60%_55%_at_15%_80%,rgba(139,106,38,0.18),transparent_55%)]"
          variants={glowFloat}
          initial="rest"
          animate={reduceMotion ? "rest" : "drift"}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div
        className={
          showCards
            ? "relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
            : "relative mx-auto max-w-4xl text-center"
        }
      >
        <div className={showCards ? "" : "mx-auto"}>
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: eyebrowDuration }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-light)] backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(135deg,#f3ce67,#cb9727,#8d670a)]" />
              {eyebrow}
            </motion.p>
          )}

          <h1
            id="hero-animated-title"
            className={`font-display max-w-[20ch] text-[clamp(2rem,5.2vw,3.75rem)] font-semibold leading-[1.06] tracking-tight text-white [text-wrap:balance] [hyphens:none] ${
              showCards ? "" : "mx-auto"
            }`}
          >
            {titleLines.map((line, lineIdx) => {
              const lineWords = line.split(" ").filter(Boolean);
              const previousWordsCount = titleLines
                .slice(0, lineIdx)
                .reduce((acc, currLine) => acc + currLine.split(" ").filter(Boolean).length, 0);

              return (
                <span
                  key={`hl-${lineIdx}`}
                  className={titleLines.length > 1 ? "block" : "inline"}
                >
                  {lineWords.map((word, w) => {
                    const currentWordIndex = previousWordsCount + w;
                    const isLast = w === lineWords.length - 1;
                    return (
                      <motion.span
                        key={`${word}-${lineIdx}-${w}`}
                        initial="hidden"
                        animate="visible"
                        variants={wordVariants}
                        transition={{
                          duration: 0.6,
                          delay:
                            headlineDelayBase +
                            currentWordIndex * headlineDelayStep,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`inline-block will-change-transform${isLast ? "" : " mr-[0.25em]"}`}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
          </h1>

          {subtitleText && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: tailDelay + 0.1 }}
              className={`mt-6 max-w-xl text-[15px] leading-7 text-white/75 [text-wrap:pretty] sm:text-base ${
                showCards ? "" : "mx-auto"
              }`}
            >
              {subtitleText}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: tailDelay + 0.25 }}
            className={`mt-9 flex flex-wrap items-center gap-4 ${
              showCards ? "" : "justify-center"
            }`}
          >
            <Link
              href={ctaHref}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[image:linear-gradient(135deg,var(--gold-light),var(--gold)_55%,var(--gold-deep))] px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] shadow-[0_8px_30px_rgba(200,163,91,0.45)] ring-1 ring-inset ring-white/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(200,163,91,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[220%] motion-reduce:hidden"
              />
              <span className="relative z-10">{ctaLabel}</span>
              <span
                aria-hidden="true"
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
              >
                →
              </span>
            </Link>
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span>See proof</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
              >
                →
              </span>
            </Link>
          </motion.div>

          {showCards && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 text-[11px] uppercase tracking-[0.28em] text-white/70"
            >
              <span className="flex items-center gap-2">
                <span className="text-[var(--gold-light)]" aria-hidden="true">★★★★★</span>
                <span>5.0 Google rated</span>
              </span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>120+ campaigns shipped</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>30+ Dubai brands</span>
            </motion.div>
          )}
        </div>

        {showCards && (
          <div className="relative grid gap-4">
            {cards.map((slide, index) => (
              <motion.article
                key={`${slide.title || "slide"}-${index}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.6 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.3 } }}
                style={{
                  marginLeft: index === 1 ? "1.5rem" : 0,
                  marginRight: index === 2 ? "1.5rem" : 0,
                }}
                className="relative rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md"
              >
                <span className="absolute -left-2 -top-2 grid h-9 w-9 place-items-center rounded-xl bg-[var(--gold)] text-xs font-bold text-[var(--ink)] shadow-[0_6px_16px_rgba(200,163,91,0.45)]">
                  0{index + 1}
                </span>
                {slide.title && (
                  <h2 className="mt-1 text-xl font-semibold leading-snug text-white">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="mt-2 text-sm leading-7 text-white/75">{slide.subtitle}</p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

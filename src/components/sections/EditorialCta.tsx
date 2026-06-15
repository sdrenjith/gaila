"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AMBIENT_VIDEOS } from "@/components/sections/ambient-videos";
import { isMediaPrefetched, onMediaPrefetched } from "@/lib/progressive-media-loader";

type EditorialCtaProps = {
  title?: string;
  subtitle?: string;
  /** Optional supporting paragraph below the subtitle. */
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "light" | "dark";
  background?: string;
  /** Optional ambient video URL rendered behind the section. Takes precedence over `background` when both are set. */
  videoBackground?: string;
};

/**
 * Mount expensive media only after the section first enters the viewport,
 * and pause/resume playback as the user scrolls in and out.
 */
function useInViewMount<T extends HTMLElement>(rootMargin = "20% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      setHasEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin, threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView, hasEntered };
}

export function EditorialCta({
  title,
  subtitle,
  body,
  ctaLabel,
  ctaHref,
  variant = "dark",
  background,
  videoBackground,
}: EditorialCtaProps) {
  const reduceMotion = useReducedMotion();
  const isDark = variant === "dark";
  // Use the slim ambient loop for footer CTAs — not the 273 MB hero reel.
  const effectiveVideo =
    videoBackground || (isDark && !background ? AMBIENT_VIDEOS.motionClip : "");
  const { ref: sectionRef, inView, hasEntered } = useInViewMount<HTMLElement>("25% 0px");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaReady, setMediaReady] = useState(() =>
    effectiveVideo ? isMediaPrefetched(effectiveVideo) : false,
  );

  useEffect(() => {
    if (!effectiveVideo) return;
    setMediaReady(isMediaPrefetched(effectiveVideo));
    return onMediaPrefetched((url) => {
      if (url === effectiveVideo) setMediaReady(true);
    });
  }, [effectiveVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion || !hasEntered || !effectiveVideo) return;

    let retryTimer = 0;
    let retryAttempts = 0;

    const ensurePlaying = () => {
      if (!inView || document.hidden) return;
      if (el.paused || el.ended) {
        void el.play().catch(() => {
          if (retryAttempts < 8) {
            retryAttempts += 1;
            window.clearTimeout(retryTimer);
            retryTimer = window.setTimeout(ensurePlaying, 400);
          }
        });
      }
    };

    const onCanPlay = () => ensurePlaying();
    const onPause = () => {
      if (inView && !document.hidden) ensurePlaying();
    };
    const onVisibility = () => {
      if (!document.hidden && inView) ensurePlaying();
    };

    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("loadeddata", onCanPlay);
    el.addEventListener("canplaythrough", onCanPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);

    if (mediaReady && el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      el.load();
    }

    if (inView) {
      ensurePlaying();
    } else {
      el.pause();
    }

    return () => {
      window.clearTimeout(retryTimer);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("loadeddata", onCanPlay);
      el.removeEventListener("canplaythrough", onCanPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, [inView, hasEntered, effectiveVideo, reduceMotion, mediaReady]);

  const shouldPreloadVideo = Boolean(
    effectiveVideo && (mediaReady || inView),
  );

  return (
    <section
      ref={sectionRef}
      className={`relative isolate overflow-hidden px-5 py-24 sm:px-8 lg:px-14 lg:py-32 ${
        isDark ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)]"
      }`}
    >
      {effectiveVideo && !reduceMotion && hasEntered && (
        <video
          ref={videoRef}
          key={effectiveVideo}
          src={effectiveVideo}
          autoPlay
          muted
          loop
          playsInline
          preload={shouldPreloadVideo ? "auto" : "metadata"}
          // @ts-expect-error fetchPriority is valid on media elements in modern browsers
          fetchPriority="low"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        />
      )}
      {effectiveVideo && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/40 to-black/80"
        />
      )}
      {!effectiveVideo && background && (
        <Image
          src={background}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover opacity-25"
        />
      )}
      {isDark && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_30%,rgba(200,163,91,0.22),transparent_60%),radial-gradient(70%_60%_at_15%_85%,rgba(139,106,38,0.22),transparent_55%)]" />
          <div className="editorial-noise absolute inset-0" />
        </div>
      )}

      {/* Parallax word — drifts slowly behind the headline */}
      <motion.span
        aria-hidden="true"
        initial={reduceMotion ? false : { x: -40 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-none absolute -bottom-6 left-0 right-0 select-none overflow-hidden whitespace-nowrap text-center font-display text-[clamp(3.5rem,12vw,11rem)] font-medium leading-none tracking-[-0.05em] sm:-bottom-8 ${
          isDark ? "text-white/[0.05]" : "text-[var(--ink)]/[0.05]"
        }`}
      >
        Gaila
      </motion.span>

      <div className="relative mx-auto flex max-w-[1480px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {title && (
            <h2 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.02] tracking-[-0.03em]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`mt-6 max-w-xl text-base leading-8 sm:text-lg ${
                isDark ? "text-white/70" : "text-[var(--ink-soft)]"
              }`}
            >
              {subtitle}
            </p>
          )}
          {body && (
            <p
              className={`mt-4 max-w-xl text-base leading-8 sm:text-lg ${
                isDark ? "text-white/70" : "text-[var(--ink-soft)]"
              }`}
            >
              {body}
            </p>
          )}
        </div>
        {(ctaLabel || ctaHref) && (
          <Link
            href={ctaHref || "/contact"}
            className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] transition ${
              isDark
                ? "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)]"
                : "bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)]"
            }`}
          >
            {ctaLabel || "Start a project"}
            <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

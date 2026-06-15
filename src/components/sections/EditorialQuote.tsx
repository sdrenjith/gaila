"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AMBIENT_VIDEOS } from "@/components/sections/ambient-videos";

type Props = {
  eyebrow?: string;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
  /** Optional ambient video URL rendered behind the quote. Defaults to the editorial brand reel when no image is supplied. */
  videoBackground?: string;
};

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

export function EditorialQuote({
  eyebrow,
  quote,
  author,
  role,
  image,
  videoBackground,
}: Props) {
  const reduceMotion = useReducedMotion();
  // When no image is provided, fall back to an ambient editorial loop — the smaller of the available reels.
  const effectiveVideo = videoBackground || (image ? "" : AMBIENT_VIDEOS.editorialLoop);
  const hasVideo = Boolean(effectiveVideo);
  const { ref: sectionRef, inView, hasEntered } = useInViewMount<HTMLElement>("25% 0px");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  if (!quote) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative isolate overflow-hidden px-5 py-24 sm:px-8 lg:px-14 lg:py-28 ${
        hasVideo ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)]"
      }`}
    >
      {hasVideo && !reduceMotion && hasEntered && (
        <video
          ref={videoRef}
          src={effectiveVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        />
      )}
      {hasVideo && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-black/85"
        />
      )}
      <div className="mx-auto max-w-[1180px]">
        {eyebrow && (
          <p
            className={`mb-6 text-[11px] font-semibold uppercase tracking-[0.38em] ${
              hasVideo ? "text-[var(--gold-light)]" : "text-[var(--gold-deep)]"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <motion.blockquote
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <span
            aria-hidden="true"
            className={`font-display text-[8rem] leading-none ${
              hasVideo ? "text-[var(--gold-light)]/40" : "text-[var(--gold-deep)]/30"
            }`}
          >
            “
          </span>
          <p
            className={`-mt-12 font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.15] tracking-[-0.01em] ${
              hasVideo ? "text-white" : "text-[var(--ink)]"
            }`}
          >
            {quote}
          </p>
        </motion.blockquote>
        {(author || role || image) && (
          <div
            className={`mt-10 flex items-center gap-4 border-t pt-6 ${
              hasVideo ? "border-white/15" : "border-[var(--hairline-strong)]"
            }`}
          >
            {image && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[var(--cream-deep)]">
                <Image src={image} alt={author || "Quote author"} fill sizes="48px" className="object-cover" />
              </div>
            )}
            <div>
              {author && (
                <p
                  className={`text-sm font-semibold ${
                    hasVideo ? "text-white" : "text-[var(--ink)]"
                  }`}
                >
                  {author}
                </p>
              )}
              {role && (
                <p
                  className={`text-xs uppercase tracking-[0.28em] ${
                    hasVideo ? "text-white/60" : "text-[var(--ink-mute)]"
                  }`}
                >
                  {role}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

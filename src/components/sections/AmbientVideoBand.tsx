"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AMBIENT_VIDEOS } from "@/components/sections/ambient-videos";

type AmbientVideoBandProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional override; defaults to the slim editorial loop (cheapest bandwidth). */
  videoSrc?: string;
  /** Optional still poster shown for reduced-motion users. */
  poster?: string;
};

/**
 * Full-bleed editorial "ambient brand band" — a 65vh ribbon of motion between
 * sections, with centered copy and a single CTA. Self-renders with sensible
 * defaults; not registered in `SectionRenderer` so it can be wired into pages
 * later without coupling to the live page seed.
 */
export function AmbientVideoBand({
  eyebrow = "Krew · In Motion",
  title = "Brand stories built to be felt, not skimmed.",
  body = "We craft cinematic campaigns for forward-thinking Dubai brands — strategy, design, and motion in one operation.",
  ctaLabel = "See the work",
  ctaHref = "/case-studies",
  videoSrc = AMBIENT_VIDEOS.motionClip,
  poster,
}: AmbientVideoBandProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
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
      { rootMargin: "25% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="relative isolate flex min-h-[65vh] items-center justify-center overflow-hidden bg-[var(--ink)] text-white"
    >
      {!reduceMotion && hasEntered && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
        />
      )}
      {reduceMotion && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/40 to-black/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(200,163,91,0.18),transparent_65%)]"
      />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-7 px-6 py-24 text-center">
        {eyebrow && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-light)]"
          >
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[var(--gold-light)]/60" />
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.04] tracking-[-0.025em]"
        >
          {title}
        </motion.h2>
        {body && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg"
          >
            {body}
          </motion.p>
        )}
        {(ctaLabel || ctaHref) && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={ctaHref || "/case-studies"}
              className="group inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/70 hover:text-white motion-reduce:transform-none"
            >
              <span>{ctaLabel || "See the work"}</span>
              <span aria-hidden="true" className="transition group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

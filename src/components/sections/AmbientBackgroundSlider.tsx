"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { deferUntilIdle } from "@/lib/defer-idle";
import { sliderMountIndices } from "@/lib/slider-mount-indices";
import { useInViewMount } from "@/lib/use-in-view-mount";

export type AmbientSlide = {
  image?: string;
  alt?: string;
};

type Props = {
  images: AmbientSlide[];
  intervalSeconds?: number;
  heightClass?: string;
};

export function AmbientBackgroundSlider({
  images,
  intervalSeconds = 6,
  heightClass = "min-h-[42vh] lg:min-h-[52vh]",
}: Props) {
  const reduceMotion = useReducedMotion();
  const usable = images.filter((item) => Boolean(item.image));
  const { ref: sectionRef, inView, hasEntered } = useInViewMount<HTMLElement>("200px 0px");
  const [index, setIndex] = useState(0);
  const [preloadAll, setPreloadAll] = useState(false);
  const intervalMs = Math.max(2000, Math.round(intervalSeconds * 1000));

  const mountedIndices = useMemo(() => {
    if (!hasEntered) return [];
    if (preloadAll) return usable.map((_, i) => i);
    return sliderMountIndices(index, usable.length);
  }, [hasEntered, index, preloadAll, usable]);

  useEffect(() => {
    if (!hasEntered || preloadAll || usable.length <= 3) return;
    return deferUntilIdle(() => setPreloadAll(true));
  }, [hasEntered, preloadAll, usable.length]);

  useEffect(() => {
    if (!inView || !hasEntered || usable.length < 2 || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % usable.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [usable.length, intervalMs, reduceMotion, inView, hasEntered]);

  if (!usable.length) return null;

  const current = usable[index % usable.length];

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className={`relative isolate overflow-hidden ${heightClass}`}
    >
      {hasEntered ? (
        <AnimatePresence mode="sync">
          <motion.div
            key={current.image}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.image!}
              alt={current.alt || ""}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
            />
          </motion.div>
        </AnimatePresence>
      ) : null}
      {mountedIndices
        .filter((slideIndex) => slideIndex !== index)
        .map((slideIndex) => {
          const slide = usable[slideIndex];
          if (!slide?.image) return null;
          return (
            <div
              key={slide.image}
              className="pointer-events-none absolute inset-0 -z-10 opacity-0"
              aria-hidden="true"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading="lazy"
              />
            </div>
          );
        })}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,0,20,0.55)_0%,rgba(8,0,20,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(168,85,247,0.28),transparent_65%),radial-gradient(40%_50%_at_90%_90%,rgba(34,211,238,0.18),transparent_60%)]" />
      <div className="editorial-grain absolute inset-0 opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#080014]" />
    </section>
  );
}

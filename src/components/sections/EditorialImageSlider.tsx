"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deferUntilIdle } from "@/lib/defer-idle";
import { sliderMountIndices } from "@/lib/slider-mount-indices";
import { useInViewMount } from "@/lib/use-in-view-mount";

export type EditorialSliderItem = {
  image?: string;
  alt?: string;
  caption?: string;
};

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: EditorialSliderItem[];
  intervalSeconds?: number;
  ctaLabel?: string;
  ctaHref?: string;
};

export function EditorialImageSlider({
  eyebrow,
  title,
  subtitle,
  items,
  intervalSeconds = 5,
  ctaLabel,
  ctaHref,
}: Props) {
  const reduceMotion = useReducedMotion();
  const usable = items.filter((item) => Boolean(item.image));
  const { ref: sectionRef, inView, hasEntered } = useInViewMount<HTMLElement>("200px 0px");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloadAll, setPreloadAll] = useState(false);
  const intervalMs = Math.max(2500, Math.round(intervalSeconds * 1000));

  const mountedIndices = useMemo(() => {
    if (!hasEntered) return [];
    if (preloadAll) return usable.map((_, index) => index);
    return sliderMountIndices(activeIndex, usable.length);
  }, [activeIndex, hasEntered, preloadAll, usable]);

  useEffect(() => {
    if (!hasEntered || preloadAll || usable.length <= 3) return;
    return deferUntilIdle(() => setPreloadAll(true));
  }, [hasEntered, preloadAll, usable.length]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el || usable.length === 0) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
    setActiveIndex(index);
  }, [reduceMotion, usable.length]);

  useEffect(() => {
    if (!inView || !hasEntered || usable.length < 2 || reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % usable.length;
        scrollToIndex(next);
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [usable.length, intervalMs, reduceMotion, scrollToIndex, inView, hasEntered]);

  if (!usable.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080014] px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(168,85,247,0.35),transparent_60%),radial-gradient(50%_40%_at_80%_80%,rgba(34,211,238,0.22),transparent_55%)]" />
      <div className="editorial-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-fuchsia-200/80">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] uppercase leading-[0.95] tracking-[0.01em] text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 max-w-xl text-base leading-8 text-white/65">{subtitle}</p>
            )}
          </div>
          {(ctaLabel || ctaHref) && (
            <Link
              href={ctaHref || "/gallery"}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-xl transition hover:border-fuchsia-300/50 hover:bg-white/15"
            >
              {ctaLabel || "View gallery"}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:gap-6"
          onScroll={() => {
            const el = scrollRef.current;
            if (!el) return;
            const children = Array.from(el.children) as HTMLElement[];
            const center = el.scrollLeft + el.clientWidth / 2;
            let closest = 0;
            let minDist = Infinity;
            children.forEach((child, i) => {
              const childCenter = child.offsetLeft + child.offsetWidth / 2;
              const dist = Math.abs(center - childCenter);
              if (dist < minDist) {
                minDist = dist;
                closest = i;
              }
            });
            setActiveIndex(closest);
          }}
        >
          {usable.map((item, index) => {
            const shouldMountImage = mountedIndices.includes(index);
            const isActive = index === activeIndex;

            return (
              <motion.figure
                key={`${item.image}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="group relative w-[min(88vw,420px)] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:w-[min(36vw,480px)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#120024]">
                  {shouldMountImage ? (
                    <Image
                      src={item.image!}
                      alt={item.alt || `Gaila event ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 88vw, 480px"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      priority={hasEntered && index === 0}
                      loading={isActive || index === 0 ? undefined : "lazy"}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080014] via-transparent to-transparent opacity-90" />
                  {item.caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-fuchsia-100/70">
                        Gaila · Dubai
                      </p>
                      <p className="mt-1 font-display text-xl uppercase leading-tight text-white">
                        {item.caption}
                      </p>
                    </figcaption>
                  )}
                </div>
              </motion.figure>
            );
          })}
        </div>

        {usable.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {usable.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[var(--event-cyan)] shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                    : "w-2 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40 lg:hidden"
          >
            {activeIndex + 1} / {usable.length}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

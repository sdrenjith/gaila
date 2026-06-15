"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type SectionNavItem = {
  id: string;
  label: string;
};

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length || typeof window === "undefined") return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.15, 0.5, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 0;

  return (
    <>
      {/* Desktop: fixed right vertical nav */}
      <nav
        aria-label="Page sections"
        className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <ul className="pointer-events-auto flex flex-col gap-3">
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-end gap-3 py-1.5 pr-2 text-[10px] font-semibold uppercase tracking-[0.32em]"
                >
                  <span
                    className={`max-w-0 overflow-hidden whitespace-nowrap text-right transition-[max-width,opacity,color] duration-300 ease-out ${
                      isActive
                        ? "max-w-[12rem] text-[var(--gold-deep)] opacity-100"
                        : "text-[var(--ink-mute)] opacity-0 group-hover:max-w-[12rem] group-hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? "h-2.5 w-2.5 bg-[var(--gold)] shadow-[0_0_0_4px_rgba(200,163,91,0.18)]"
                          : "h-1.5 w-1.5 bg-[var(--ink-mute)]/60 group-hover:bg-[var(--gold)]"
                      }`}
                    />
                    <span className="sr-only">
                      {String(index + 1).padStart(2, "0")} {item.label}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: top progress strip with active label */}
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 top-[64px] z-20 lg:hidden"
      >
        <div className="flex items-center gap-3 border-b border-[var(--hairline)] bg-white/85 px-5 py-2 backdrop-blur-xl">
          <div className="flex flex-1 items-center gap-1.5">
            {items.map((item) => (
              <span
                key={item.id}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  item.id === activeId ? "bg-[var(--gold)]" : "bg-[var(--hairline-strong)]"
                }`}
              />
            ))}
          </div>
          <motion.span
            key={activeId ?? "none"}
            initial={reduceMotion ? false : { opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-soft)]"
          >
            {items[activeIndex]?.label}
          </motion.span>
          <span className="hidden text-[10px] font-medium tabular-nums text-[var(--ink-mute)] sm:inline">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </>
  );
}

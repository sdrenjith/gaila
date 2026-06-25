"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  items: string[];
  speedSeconds?: number;
};

export function EditorialMarquee({ items, speedSeconds = 38 }: Props) {
  const reduceMotion = useReducedMotion();
  const safe = items.filter(Boolean);
  if (!safe.length) return null;

  const row = [...safe, ...safe];

  return (
    <div className="relative overflow-hidden border-y border-[var(--hairline-strong)] bg-transparent py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <motion.div
        className="flex w-max items-center gap-14 whitespace-nowrap will-change-transform"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion ? undefined : { duration: speedSeconds, repeat: Infinity, ease: "linear" }
        }
      >
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-display text-[clamp(1.6rem,3vw,3rem)] leading-none tracking-[-0.02em] text-[var(--ink)]"
          >
            {item}
            <span
              aria-hidden="true"
              className="ml-14 inline-block h-1 w-1 rounded-full bg-[var(--gold)] align-middle"
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type StatItem = { value?: string; label?: string };

type EditorialStatsProps = {
  eyebrow?: string;
  title?: string;
  stats: StatItem[];
};

/** Try to count up the numeric part of values like "+184%", "120+", "3.2x". Leaves the suffix/prefix in place. */
function parseNumeric(value: string): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const number = Number(match[2].replace(",", "."));
  if (!Number.isFinite(number)) return null;
  return { prefix: match[1] ?? "", number, suffix: match[3] ?? "" };
}

function StatNumber({ value, active }: { value: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduceMotion = useReducedMotion();
  const parsed = parseNumeric(value);

  useEffect(() => {
    if (!parsed || reduceMotion || !active) {
      if (ref.current) ref.current.textContent = value;
      return;
    }
    const node = ref.current;
    if (!node) return;
    const decimals = (parsed.number.toString().split(".")[1] || "").length;
    const controls = animate(0, parsed.number, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const formatted = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
        node.textContent = `${parsed.prefix}${formatted}${parsed.suffix}`;
      },
    });
    return () => controls.stop();
  }, [active, parsed, reduceMotion, value]);

  return (
    <span ref={ref} className="block">
      {parsed ? `${parsed.prefix}0${parsed.suffix}` : value}
    </span>
  );
}

export function EditorialStats({ eyebrow, title, stats }: EditorialStatsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-20%" });
  const items = stats.filter((stat) => (stat.value ?? "").trim() || (stat.label ?? "").trim());
  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-300/30 to-transparent" />
      <div className="mx-auto max-w-[1480px]">
        {(eyebrow || title) && (
          <div className="mb-14 max-w-3xl border-b border-[var(--hairline)] pb-8">
            {eyebrow && (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">
                {title}
              </h2>
            )}
          </div>
        )}
        <div
          ref={containerRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.055] px-6 py-9 shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-fuchsia-200/35 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span aria-hidden="true" className="absolute -right-12 -top-16 h-32 w-32 rounded-full bg-[var(--gold)]/20 blur-3xl" />
              <p className="relative font-display text-[clamp(3rem,7vw,6.4rem)] font-normal uppercase leading-none tracking-[0.02em] text-white">
                <StatNumber value={stat.value || "0"} active={inView} />
              </p>
              <p className="relative mt-5 text-sm leading-7 text-[var(--ink-soft)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

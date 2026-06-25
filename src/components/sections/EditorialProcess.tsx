"use client";

import { motion, useReducedMotion } from "motion/react";

type Step = { title?: string; text?: string };

type EditorialProcessProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  steps: Step[];
};

export function EditorialProcess({ eyebrow, title, subtitle, steps }: EditorialProcessProps) {
  const reduceMotion = useReducedMotion();
  const items = steps.filter((step) => (step.title ?? "").trim() || (step.text ?? "").trim());
  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-10 h-[30rem] w-[30rem] rounded-full bg-[var(--event-cyan)]/10 blur-[120px]" />
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-6 max-w-md text-base leading-8 text-[var(--ink-soft)]">{subtitle}</p>
          )}
        </div>
        <ol className="relative grid gap-5 border-l border-fuchsia-200/20 pl-8 lg:pl-12">
          {items.map((step, index) => (
            <motion.li
              key={`${step.title}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-6 shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-fuchsia-200/30 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[45px] top-7 grid h-8 w-8 place-items-center rounded-full border border-fuchsia-200/30 bg-[#120529] text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100 shadow-[0_0_28px_rgba(168,85,247,0.55)] lg:-left-[57px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[clamp(1.8rem,2.8vw,2.7rem)] uppercase leading-[0.95] tracking-[0.02em] text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-4 max-w-xl text-[15px] leading-8 text-[var(--ink-soft)]">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

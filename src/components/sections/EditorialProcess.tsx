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
    <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
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
        <ol className="relative border-l border-[var(--hairline-strong)] pl-8 lg:pl-12">
          {items.map((step, index) => (
            <motion.li
              key={`${step.title}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-12 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[37px] top-2 grid h-6 w-6 place-items-center rounded-full border border-[var(--hairline-strong)] bg-white text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)] shadow-[0_1px_2px_rgba(14,14,14,0.06)] lg:-left-[53px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-tight tracking-[-0.02em] text-[var(--ink)]">
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

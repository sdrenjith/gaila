"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Faq = { question?: string; answer?: string };

type EditorialFaqProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  faqs: Faq[];
};

export function EditorialFaq({ eyebrow, title, subtitle, faqs }: EditorialFaqProps) {
  const reduceMotion = useReducedMotion();
  const items = faqs.filter((faq) => (faq.question ?? "").trim());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.35fr_0.65fr]">
        <div>
          {eyebrow && (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-5 max-w-md text-[15px] leading-8 text-[var(--ink-soft)]">{subtitle}</p>
          )}
        </div>
        <ul className="border-t border-[var(--hairline-strong)]">
          {items.map((faq, index) => {
            const open = index === openIndex;
            return (
              <li key={`${faq.question}-${index}`} className="border-b border-[var(--hairline-strong)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-[clamp(1.3rem,2vw,1.9rem)] leading-tight tracking-[-0.01em] text-[var(--ink)]">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] text-[var(--ink)] transition ${
                      open ? "bg-[var(--ink)] text-white" : "group-hover:border-[var(--ink)]"
                    }`}
                  >
                    {open ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && faq.answer && (
                    <motion.div
                      key="answer"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pr-12 text-[15px] leading-8 text-[var(--ink-soft)]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

type AnimatedHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  step?: number;
  /** Use `whileInView` rather than `animate` on mount. */
  inView?: boolean;
};

/**
 * Render headings as word-staggered animations.
 *
 * Editors can force an explicit line break by using `|` in the title text,
 * e.g. `We build brand stories | that earn revenue.` Otherwise the heading
 * relies on `text-wrap: balance` (with a `ch`-constrained max width) so
 * lines stay roughly the same length and avoid awkward clause breaks.
 */
export function AnimatedHeading({
  text,
  as = "h2",
  className,
  delay = 0.1,
  step = 0.06,
  inView = false,
}: AnimatedHeadingProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  const lines = (text || "")
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);
  const trigger = inView
    ? { whileInView: "visible", initial: "hidden", viewport: { once: true, margin: "-80px" } as const }
    : { animate: "visible", initial: "hidden" };
  const stepEffective = reduceMotion ? 0 : step;

  let wordIndex = -1;

  return (
    <Component className={cn("[text-wrap:balance] [hyphens:none]", className)}>
      {lines.map((line, lineIdx) => {
        const words = line.split(/\s+/).filter(Boolean);
        return (
          <span
            key={`line-${lineIdx}-${line}`}
            className={lines.length > 1 ? "block" : undefined}
          >
            {words.map((word, w) => {
              wordIndex += 1;
              return (
                <Fragment key={`${word}-${lineIdx}-${w}`}>
                  {w > 0 ? " " : null}
                  <motion.span
                    variants={wordVariants}
                    transition={{
                      duration: 0.6,
                      delay: delay + wordIndex * stepEffective,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block will-change-transform"
                    {...trigger}
                  >
                    {word}
                  </motion.span>
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}

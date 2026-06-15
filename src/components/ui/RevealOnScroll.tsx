"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const directionMap: Record<NonNullable<RevealOnScrollProps["direction"]>, Variants> = {
  up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  className?: string;
  as?: "div" | "section" | "span" | "li";
  once?: boolean;
};

export function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.7,
  direction = "up",
  className,
  as = "div",
  once = true,
}: RevealOnScrollProps) {
  const Component = motion[as];
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={directionMap[direction]}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

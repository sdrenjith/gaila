"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type GalleryItem = {
  image?: string;
  alt?: string;
  caption?: string;
};

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: GalleryItem[];
  columns?: number;
};

export function EditorialGallery({ eyebrow, title, subtitle, items, columns = 3 }: Props) {
  const reduceMotion = useReducedMotion();
  const usable = items.filter((item) => Boolean(item.image));
  if (!usable.length) return null;
  const cols = Math.min(Math.max(columns, 1), 4);
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1480px]">
        {(eyebrow || title || subtitle) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-5 max-w-xl text-base leading-8 text-[var(--ink-soft)]">{subtitle}</p>}
          </div>
        )}
        <div className={`grid ${colsClass} gap-4`}>
          {usable.map((item, index) => (
            <motion.figure
              key={`${item.image}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-[1.6rem] bg-[var(--cream-deep)] shadow-[var(--shadow-card)] ring-1 ring-[var(--hairline)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--hairline-strong)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image!}
                  alt={item.alt || item.caption || "Gallery image"}
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              {item.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(14,14,14,0.7)] to-transparent p-5 text-sm text-white">
                  {item.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

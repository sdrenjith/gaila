"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type GalleryItem = {
  image?: string;
  alt?: string;
  caption?: string;
};

export type GalleryCategory = {
  slug?: string;
  label?: string;
  items?: GalleryItem[];
};

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: GalleryItem[];
  categories?: GalleryCategory[];
  columns?: number;
  defaultCategory?: string;
};

function usableItems(items: GalleryItem[] | undefined): GalleryItem[] {
  return (items ?? []).filter((item) => Boolean(item.image));
}

function columnsClass(columns: number): string {
  const cols = Math.min(Math.max(columns, 1), 4);
  if (cols === 1) return "grid-cols-1";
  if (cols === 2) return "grid-cols-1 sm:grid-cols-2";
  if (cols === 3) return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
}

function GalleryGrid({
  items,
  columns,
  onSelect,
}: {
  items: GalleryItem[];
  columns: number;
  onSelect?: (item: GalleryItem) => void;
}) {
  const reduceMotion = useReducedMotion();
  const usable = usableItems(items);
  if (!usable.length) return null;

  return (
    <div className={`grid ${columnsClass(columns)} gap-3 sm:gap-4`}>
      {usable.map((item, index) => (
        <motion.figure
          key={`${item.image}-${index}`}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-[1.25rem] bg-[rgba(255,255,255,0.04)] shadow-[var(--shadow-card)] ring-1 ring-[var(--hairline)] transition duration-500 hover:ring-[var(--hairline-strong)] hover:shadow-[0_0_32px_rgba(168,85,247,0.22),var(--shadow-card-hover)]"
        >
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className="relative block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream-deep)]"
            aria-label={item.alt || item.caption || "View gallery image"}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image!}
                alt={item.alt || item.caption || "Gallery image"}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(8,0,20,0.55)] via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
              />
            </div>
            {item.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-xs font-medium uppercase tracking-[0.18em] text-white/90 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
                {item.caption}
              </figcaption>
            )}
          </button>
        </motion.figure>
      ))}
    </div>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item?.image ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(4,0,12,0.92)] p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] sm:right-8 sm:top-8"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </motion.button>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[1.5rem] shadow-[0_0_80px_rgba(168,85,247,0.35)] ring-1 ring-white/15"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/5] max-h-[88vh] w-full sm:aspect-[16/10]">
              <Image
                src={item.image}
                alt={item.alt || item.caption || "Gallery image"}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {item.caption ? (
              <p className="border-t border-white/10 bg-[rgba(8,0,20,0.85)] px-5 py-4 text-center text-sm uppercase tracking-[0.2em] text-white/80">
                {item.caption}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function EditorialGallery({
  eyebrow,
  title,
  subtitle,
  items = [],
  categories = [],
  columns = 4,
  defaultCategory,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categorySections = useMemo(
    () =>
      categories
        .map((category, index) => ({
          slug: category.slug?.trim() || `category-${index}`,
          label: category.label?.trim() || `Category ${index + 1}`,
          items: usableItems(category.items),
        }))
        .filter((category) => category.items.length > 0),
    [categories],
  );

  const flatItems = usableItems(items);
  const useCategories = categorySections.length > 0;

  const initialSlug =
    defaultCategory && categorySections.some((entry) => entry.slug === defaultCategory)
      ? defaultCategory
      : categorySections[0]?.slug ?? "";

  const [activeSlug, setActiveSlug] = useState(initialSlug);

  useEffect(() => {
    if (!useCategories) return;
    if (!categorySections.some((entry) => entry.slug === activeSlug)) {
      setActiveSlug(categorySections[0]?.slug ?? "");
    }
  }, [activeSlug, categorySections, useCategories]);

  const activeCategory = categorySections.find((entry) => entry.slug === activeSlug);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  if (!useCategories && !flatItems.length) return null;

  return (
    <section className="relative bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        {(eyebrow || title || subtitle) && (
          <div className="mb-10 max-w-3xl sm:mb-12">
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
            {subtitle && (
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--ink-soft)]">{subtitle}</p>
            )}
          </div>
        )}

        {useCategories ? (
          <div className="space-y-8">
            <div className="-mx-1 overflow-x-auto pb-1">
              <div
                className="flex min-w-max gap-2 px-1 sm:flex-wrap sm:min-w-0"
                role="tablist"
                aria-label="Gallery categories"
              >
                {categorySections.map((category) => {
                  const active = category.slug === activeSlug;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`gallery-panel-${category.slug}`}
                      id={`gallery-tab-${category.slug}`}
                      onClick={() => setActiveSlug(category.slug)}
                      className={`group relative overflow-hidden rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream-deep)] sm:px-5 sm:py-3 sm:text-[12px] ${
                        active
                          ? "gold-gradient cta-shadow text-white ring-1 ring-inset ring-white/25"
                          : "border border-[var(--hairline)] bg-[rgba(255,255,255,0.04)] text-[var(--ink-soft)] hover:border-[var(--hairline-strong)] hover:text-[var(--ink)] hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                      }`}
                    >
                      <span className="relative z-10">{category.label}</span>
                      <span className="relative z-10 ml-2 text-[10px] opacity-70">({category.items.length})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeCategory ? (
                <motion.div
                  key={activeCategory.slug}
                  id={`gallery-panel-${activeCategory.slug}`}
                  role="tabpanel"
                  aria-labelledby={`gallery-tab-${activeCategory.slug}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GalleryGrid
                    items={activeCategory.items}
                    columns={columns}
                    onSelect={setLightboxItem}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : (
          <GalleryGrid items={flatItems} columns={columns} onSelect={setLightboxItem} />
        )}
      </div>

      <Lightbox item={lightboxItem} onClose={closeLightbox} />
    </section>
  );
}

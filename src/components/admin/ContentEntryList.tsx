"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminListSearch } from "@/components/admin/AdminListSearch";
import { useDebouncedValue } from "@/components/admin/useDebouncedValue";
import { contentMatchesSearch } from "@/lib/admin-search";
import type { AdminContentListItem } from "@/types/cms";

type Props = {
  items: AdminContentListItem[];
  selectedSlug?: string;
};

const KIND_LABELS: Record<AdminContentListItem["kind"], string> = {
  service: "Service",
  caseStudy: "Case study",
  blog: "Blog",
};

export function ContentEntryList({ items, selectedSlug }: Props) {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebouncedValue(term);

  const filtered = useMemo(() => {
    const needle = debouncedTerm.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => contentMatchesSearch(item, needle));
  }, [items, debouncedTerm]);

  return (
    <>
      <AdminListSearch
        value={term}
        onChange={setTerm}
        placeholder="Search by title, slug, kind, or status…"
        visibleCount={filtered.length}
        totalCount={items.length}
        itemLabel="entries"
        stacked
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
          No entries match your search.
        </p>
      ) : (
        <ul className="grid max-h-[min(60vh,28rem)] gap-1.5 overflow-y-auto pr-1 [scrollbar-gutter:stable] lg:max-h-[calc(100vh-14rem)]">
          {filtered.map((item) => {
            const active = item.slug === selectedSlug;
            const published = item.status === "published";

            return (
              <li key={item._id} className="min-w-0">
                <Link
                  href={`/admin/content?slug=${item.slug}`}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  title={item.title}
                  className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-stone-900 text-white shadow-sm ring-1 ring-stone-900"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <p className="truncate font-medium leading-snug" title={item.title}>
                    {item.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        active ? "bg-white/15 text-white/80" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {KIND_LABELS[item.kind]}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] ${
                        active ? "text-white/60" : published ? "text-[var(--gold-deep)]" : "text-stone-400"
                      }`}
                    >
                      {published ? "active" : "draft"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

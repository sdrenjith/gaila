"use client";

import Link from "next/link";
import { adminListActive, adminListInactive, adminStatusActive } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { AdminPageListItem } from "@/types/cms";
import {
  buildAdminPageTree,
  SERVICES_PARENT_SLUG,
} from "@/lib/page-hierarchy";

type Props = {
  pages: AdminPageListItem[];
  selectedSlug?: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({
  status,
  isActive,
  compact = false,
}: {
  status: AdminPageListItem["status"];
  isActive: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "shrink-0 uppercase tracking-[0.18em]",
        compact ? "text-[9px]" : "text-[10px]",
        isActive ? "text-white/60" : status === "published" ? adminStatusActive : "text-stone-400",
      )}
    >
      {status === "published" ? "active" : "draft"}
    </span>
  );
}

function PageLink({
  page,
  isActive,
  nested = false,
}: {
  page: AdminPageListItem;
  isActive: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={`/admin/pages?slug=${page.slug}`}
      prefetch={false}
      title={page.title}
      className={cn(
        nested ? "pl-4 pr-2" : "px-3",
        "flex min-w-0 w-full items-center gap-2 rounded-xl py-2.5 text-sm transition",
        isActive ? adminListActive : adminListInactive,
      )}
    >
      <span className="min-w-0 flex-1 truncate">{page.title}</span>
      <StatusBadge status={page.status} isActive={isActive} compact={nested} />
    </Link>
  );
}

export function AdminPagesList({ pages, selectedSlug }: Props) {
  const entries = buildAdminPageTree(pages);
  const servicesGroup = entries.find(
    (entry): entry is Extract<(typeof entries)[number], { type: "group" }> =>
      entry.type === "group" && entry.page.slug === SERVICES_PARENT_SLUG,
  );
  const selectedInServices =
    selectedSlug === SERVICES_PARENT_SLUG ||
    Boolean(servicesGroup?.children.some((child) => child.slug === selectedSlug));

  const [servicesOpen, setServicesOpen] = useState(selectedInServices);

  useEffect(() => {
    if (selectedInServices) {
      setServicesOpen(true);
    }
  }, [selectedInServices]);

  return (
    <ul className="grid min-w-0 gap-1">
      {entries.map((entry) => {
        if (entry.type === "group") {
          const parentActive = entry.page.slug === selectedSlug;
          return (
            <li key={entry.page._id} className="grid min-w-0 gap-0.5">
              <div className="flex min-w-0 items-stretch gap-0.5">
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  aria-expanded={servicesOpen}
                  aria-label={servicesOpen ? "Collapse service pages" : "Expand service pages"}
                  className={cn(
                    "grid h-auto w-8 shrink-0 place-items-center rounded-xl transition",
                    parentActive ? adminListActive : "text-stone-500 hover:bg-stone-100",
                  )}
                >
                  <Chevron open={servicesOpen} />
                </button>
                <Link
                  href={`/admin/pages?slug=${entry.page.slug}`}
                  prefetch={false}
                  title={entry.page.title}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                    parentActive ? adminListActive : adminListInactive,
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{entry.page.title}</span>
                  <StatusBadge status={entry.page.status} isActive={parentActive} />
                </Link>
              </div>
              {servicesOpen ? (
                <ul className="ml-2 grid min-w-0 gap-0.5 border-l border-stone-200 pl-1.5">
                  {entry.children.map((child) => (
                    <li key={child._id} className="min-w-0">
                      <PageLink page={child} isActive={child.slug === selectedSlug} nested />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        }

        return (
          <li key={entry.page._id} className="min-w-0">
            <PageLink page={entry.page} isActive={entry.page.slug === selectedSlug} />
          </li>
        );
      })}
    </ul>
  );
}

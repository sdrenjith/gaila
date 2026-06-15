"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavGroup = {
  label: string;
  items: { label: string; href: string }[];
};

const groups: NavGroup[] = [
  {
    label: "Content",
    items: [
      { label: "Pages", href: "/admin/pages" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Story library", href: "/admin/content" },
      { label: "Menus", href: "/admin/menus" },
    ],
  },
  {
    label: "Library",
    items: [{ label: "Media", href: "/admin/media" }],
  },
  {
    label: "Audience",
    items: [{ label: "Leads", href: "/admin/leads" }],
  },
  {
    label: "Workspace",
    items: [
      { label: "Site details", href: "/admin/settings" },
      { label: "Manage users", href: "/admin/users" },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <nav className="grid gap-5 text-sm">
      <Link
        href="/admin"
        prefetch={false}
        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition ${
          pathname === "/admin"
            ? "bg-stone-900 text-white"
            : "text-stone-700 hover:bg-stone-100"
        }`}
      >
        Dashboard
      </Link>
      {groups.map((group) => {
        const isCollapsed = collapsed[group.label];
        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => setCollapsed((current) => ({ ...current, [group.label]: !current[group.label] }))}
              className="flex w-full items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400"
            >
              {group.label}
              <span aria-hidden="true">{isCollapsed ? "+" : "−"}</span>
            </button>
            {!isCollapsed && (
              <ul className="mt-2 grid gap-1">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                          active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {active && <span aria-hidden="true" className="text-xs">→</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

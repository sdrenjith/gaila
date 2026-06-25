import Link from "next/link";
import { adminBtn, adminStatusActive } from "@/lib/admin-ui";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Panel } from "@/components/admin/forms/Field";
import { getAdminDashboardStats, getAdminPagesList, getLeads } from "@/lib/cms";

export default async function AdminDashboardPage() {
  const [stats, pages, leads] = await Promise.all([getAdminDashboardStats(), getAdminPagesList(), getLeads()]);
  const cards = [
    { label: "Pages", value: stats.pages, href: "/admin/pages" },
    { label: "Active pages", value: stats.publishedPages, href: "/admin/pages" },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    { label: "Content entries", value: stats.contentEntries, href: "/admin/content" },
    { label: "Leads", value: stats.leads, href: "/admin/leads" },
    { label: "Media", value: stats.media, href: "/admin/media" },
  ];

  return (
    <AdminPageFrame>
      <Breadcrumbs
        items={[{ label: "Dashboard" }]}
        actions={
          <Link
            href="/admin/pages?slug=home"
            className={adminBtn}
          >
            Edit homepage
          </Link>
        }
      />

      <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            prefetch={false}
            className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-violet-500"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400">{card.label}</p>
            <p className="mt-2 font-display text-4xl leading-none tracking-[-0.02em] text-stone-950">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Recently edited pages">
          <ul className="grid gap-2">
            {pages.slice(0, 6).map((page) => (
              <li key={page._id}>
                <Link
                  href={`/admin/pages?slug=${page.slug}`}
                  prefetch={false}
                  className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm transition hover:bg-white"
                >
                  <span className="truncate">{page.title}</span>
                  <span className={`text-[10px] uppercase tracking-[0.18em] ${adminStatusActive}`}>{page.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Latest leads">
          <ul className="grid gap-2">
            {leads.slice(0, 6).map((lead) => (
              <li key={lead._id}>
                <Link
                  href="/admin/leads"
                  className="block rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm transition hover:bg-white"
                >
                  <span className="font-semibold text-stone-950">{lead.name}</span>
                  <span className="ml-2 text-stone-500">{lead.email}</span>
                </Link>
              </li>
            ))}
            {leads.length === 0 && (
              <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
                No enquiries yet.
              </p>
            )}
          </ul>
        </Panel>
      </div>
    </AdminPageFrame>
  );
}

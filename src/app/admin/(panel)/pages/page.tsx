import Link from "next/link";
import { deletePageAction } from "@/app/actions/admin";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { PageEditor } from "@/components/admin/PageEditor";
import { Panel } from "@/components/admin/forms/Field";
import { getAdminCategoryOptions, getAdminPageBySlug, getAdminPagesList } from "@/lib/cms";
import { newPageSections } from "@/lib/default-content";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function AdminPagesPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  const isNew = slug === "new";
  const pages = await getAdminPagesList();
  const selectedSlug = !isNew && pages.length ? slug || pages[0]?.slug : undefined;

  const [categories, selectedPage] = await Promise.all([
    getAdminCategoryOptions(),
    selectedSlug ? getAdminPageBySlug(selectedSlug) : Promise.resolve(undefined),
  ]);

  const selected = selectedPage ?? undefined;

  return (
    <AdminPageFrame>
      <Breadcrumbs
        items={[
          { label: "Content", href: "/admin" },
          { label: "Pages", href: "/admin/pages" },
          { label: selected ? selected.title : "New page" },
        ]}
        actions={
          <Link
            href="/admin/pages?slug=new"
            prefetch={false}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
          >
            + New page
          </Link>
        }
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <Panel title="All pages" description={`${pages.length} pages`}>
          <ul className="grid gap-1">
            {pages.map((page) => {
              const isActive = page.slug === (selected?.slug || slug);
              return (
                <li key={page._id}>
                  <Link
                    href={`/admin/pages?slug=${page.slug}`}
                    prefetch={false}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="truncate">{page.title}</span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] ${
                        isActive ? "text-white/60" : page.status === "published" ? "text-[var(--gold-deep)]" : "text-stone-400"
                      }`}
                    >
                      {page.status === "published" ? "active" : "draft"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {selected && selected.slug !== "home" && (
            <DeleteActionForm
              action={deletePageAction}
              id={selected._id}
              itemLabel={selected.title}
              className="mt-4 border-t border-stone-200 pt-4"
            />
          )}
        </Panel>

        <div>
          <PageEditor page={selected} starterSections={newPageSections} categories={categories} />
        </div>
      </div>
    </AdminPageFrame>
  );
}

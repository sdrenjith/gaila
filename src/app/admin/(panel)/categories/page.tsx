import Link from "next/link";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Panel } from "@/components/admin/forms/Field";
import { deleteCategoryAction } from "@/app/actions/admin";
import { getAdminCategoriesList, getAdminCategoryBySlug } from "@/lib/cms";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  const isNew = slug === "new";
  const categories = await getAdminCategoriesList();
  const selectedSlug = !isNew && categories.length ? slug || categories[0]?.slug : undefined;
  const selected = selectedSlug ? await getAdminCategoryBySlug(selectedSlug) : undefined;

  return (
    <AdminPageFrame>
      <Breadcrumbs
        items={[
          { label: "Content", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: selected ? selected.title : "New category" },
        ]}
        actions={
          <Link
            href="/admin/categories?slug=new"
            prefetch={false}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
          >
            + New category
          </Link>
        }
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <Panel title="All categories" description={`${categories.length} categories`}>
          <ul className="grid gap-1">
            {categories.map((category) => {
              const active = category.slug === (selected?.slug || slug);
              return (
                <li key={category._id}>
                  <Link
                    href={`/admin/categories?slug=${category.slug}`}
                    prefetch={false}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                      active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="truncate">{category.title}</span>
                    <span className={`text-[10px] uppercase tracking-[0.18em] ${active ? "text-white/60" : "text-stone-400"}`}>
                      {category.status === "published" ? "active" : "draft"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {selected ? (
            <DeleteActionForm
              action={deleteCategoryAction}
              id={selected._id}
              itemLabel={selected.title}
              className="mt-4 border-t border-stone-200 pt-4"
            />
          ) : null}
        </Panel>

        <CategoryEditor category={selected ?? undefined} />
      </div>
    </AdminPageFrame>
  );
}

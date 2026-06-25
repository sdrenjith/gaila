import Link from "next/link";
import { adminBtn } from "@/lib/admin-ui";
import { deletePageAction } from "@/app/actions/admin";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { AdminPagesList } from "@/components/admin/AdminPagesList";
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
            className={adminBtn}
          >
            + New page
          </Link>
        }
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <Panel title="All pages" description={`${pages.length} pages`}>
          <AdminPagesList pages={pages} selectedSlug={selected?.slug || slug} />
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

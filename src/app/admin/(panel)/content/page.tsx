import Link from "next/link";
import { deleteContentAction, saveContentAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { ContentEntryList } from "@/components/admin/ContentEntryList";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ImageSourceInput } from "@/components/admin/ImageSourceInput";
import { Panel, Select, Textarea, TextInput, Toggle } from "@/components/admin/forms/Field";
import { getAdminContentBySlug, getAdminContentList } from "@/lib/cms";

type Props = {
  searchParams: Promise<{ slug?: string; kind?: "service" | "caseStudy" | "blog" }>;
};

export default async function AdminContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const [items, selected] = await Promise.all([
    getAdminContentList(),
    params.slug ? getAdminContentBySlug(params.slug) : Promise.resolve(null),
  ]);
  const kind = selected?.kind || params.kind || "service";

  return (
    <AdminPageFrame>
      <Breadcrumbs
        items={[{ label: "Content", href: "/admin" }, { label: "Library" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            {(["service", "caseStudy", "blog"] as const).map((itemKind) => (
              <Link
                key={itemKind}
                href={`/admin/content?kind=${itemKind}`}
                prefetch={false}
                className="rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
              >
                + New {itemKind}
              </Link>
            ))}
          </div>
        }
      />

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <Panel title="All entries" description={`${items.length} entries`}>
            <ContentEntryList items={items} selectedSlug={selected?.slug} />
          </Panel>
        </div>

        <div className="min-w-0">
          <Panel
            key={selected?._id ?? `new-${kind}`}
            title={selected ? `Editing ${selected.title}` : `Create ${kind}`}
          >
            <ActionForm action={saveContentAction} className="grid min-w-0 gap-5">
              {selected?._id && <input type="hidden" name="id" value={selected._id} />}
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <Select
                  label="Kind"
                  name="kind"
                  defaultValue={kind}
                  options={[
                    { label: "Service", value: "service" },
                    { label: "Case study", value: "caseStudy" },
                    { label: "Blog", value: "blog" },
                  ]}
                />
                <Select
                  label="Status"
                  name="status"
                  defaultValue={selected?.status || "draft"}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
                <TextInput label="Title" name="title" defaultValue={selected?.title || ""} required />
                <TextInput label="Slug" name="slug" defaultValue={selected?.slug || ""} required />
              </div>
              <Textarea label="Excerpt" name="excerpt" rows={3} defaultValue={selected?.excerpt || ""} required />
              <Textarea label="Body" name="body" rows={9} defaultValue={selected?.body || ""} required />
              <ImageSourceInput
                label="Cover image"
                name="coverImage"
                defaultValue={selected?.coverImage || ""}
                folder="content"
                description="Pick a single source per image — upload a file OR paste a URL."
              />
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <TextInput
                  label="Tags, comma separated"
                  name="tags"
                  defaultValue={selected?.tags?.join(", ") || ""}
                  optional
                />
                <TextInput label="SEO title" name="seoTitle" defaultValue={selected?.seo?.title || ""} required />
                <TextInput
                  label="SEO description"
                  name="seoDescription"
                  defaultValue={selected?.seo?.description || ""}
                  className="md:col-span-2"
                  required
                />
              </div>
              <Toggle
                label="Featured content"
                hint="Pinned to the top of editorial grids."
                name="featured"
                defaultChecked={selected?.featured || false}
              />
            </ActionForm>
            {selected && (
              <DeleteActionForm
                action={deleteContentAction}
                id={selected._id}
                itemLabel={selected.title}
                buttonLabel="Delete content"
                className="mt-4 border-t border-stone-200 pt-4"
                buttonClassName="rounded-full border border-red-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50"
              />
            )}
          </Panel>
        </div>
      </div>
    </AdminPageFrame>
  );
}

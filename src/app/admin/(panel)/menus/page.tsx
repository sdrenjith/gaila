import Link from "next/link";
import { MenuEditor } from "@/components/admin/MenuEditor";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Panel } from "@/components/admin/AdminFields";
import { getAllNavigation, getPublishedPages, getSiteSettings } from "@/lib/cms";
import { footerMenuItems, headerMenuItems } from "@/lib/default-content";
import {
  getPageHeaderPreviewItems,
  splitManualMenuItems,
} from "@/lib/navigation";

type Props = {
  searchParams: Promise<{ location?: "header" | "footer" }>;
};

export default async function AdminMenusPage({ searchParams }: Props) {
  const { location = "header" } = await searchParams;
  const [menus, publishedPages, settings] = await Promise.all([
    getAllNavigation(),
    getPublishedPages(),
    location === "footer" ? getSiteSettings() : Promise.resolve(null),
  ]);
  const selected = menus.find((menu) => menu.location === location) ?? null;
  const defaultItems = location === "footer" ? footerMenuItems : headerMenuItems;
  const storedItems = selected?.items?.length ? selected.items : defaultItems;
  const manualItems =
    location === "header" ? splitManualMenuItems(storedItems, publishedPages) : storedItems;
  const pageHeaderItems = location === "header" ? getPageHeaderPreviewItems(publishedPages) : [];

  return (
    <AdminPageFrame>
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Menus</h1>
        <p className="mt-2 text-stone-500">
          Configure footer navigation and any non-page header links. Published pages marked “show in header” on the Pages screen are merged into the main header automatically.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
        <Panel title="Locations">
          <div className="space-y-3">
            {(["header", "footer"] as const).map((item) => (
              <Link
                key={item}
                href={`/admin/menus?location=${item}`}
                className={`block rounded-2xl border p-4 capitalize transition ${
                  item === location
                    ? "border-[var(--gold)] bg-[var(--paper)]"
                    : "border-stone-200 bg-stone-50 hover:bg-stone-100"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </Panel>
        <MenuEditor
          key={location}
          location={location}
          menu={selected?.location === location ? selected : null}
          initialItems={manualItems}
          pageHeaderItems={pageHeaderItems}
          initialSocial={settings?.social}
        />
      </div>
    </AdminPageFrame>
  );
}

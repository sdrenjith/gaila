import Link from "next/link";
import type { MenuItem } from "@/types/cms";

type Props = {
  items: MenuItem[];
};

function visibleItems(items: MenuItem[]) {
  return items.filter((item) => item.visible).sort((a, b) => a.order - b.order);
}

function MenuPreviewRow({
  item,
  depth = 0,
}: {
  item: MenuItem;
  depth?: number;
}) {
  const children = visibleItems(item.children ?? []);

  return (
    <li>
      <div
        className={`flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 ${
          depth > 0 ? "ml-6 border-stone-100 bg-stone-50" : ""
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-950">{item.label}</p>
          <p className="truncate text-[11px] text-stone-500">{item.href}</p>
        </div>
        {children.length > 0 ? (
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600">
            {children.length} sub-items
          </span>
        ) : null}
      </div>
      {children.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {children.map((child) => (
            <MenuPreviewRow key={child.href} item={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function HeaderMenuPreview({ items }: Props) {
  const visible = visibleItems(items);

  if (visible.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
        No visible header links configured yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      <p className="text-xs text-stone-500">
        Live header order after merging manual links with published pages.{" "}
        <Link href="/admin/pages" className="font-semibold text-stone-700 underline-offset-2 hover:underline">
          Edit pages
        </Link>{" "}
        or manual links below.
      </p>
      <ul className="grid gap-2">
        {visible.map((item) => (
          <MenuPreviewRow key={item.href} item={item} />
        ))}
      </ul>
    </div>
  );
}

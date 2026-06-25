"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { saveMenuAction, type AdminActionState } from "@/app/actions/admin";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { Panel, Select, TextInput } from "@/components/admin/forms/Field";
import { useToast } from "@/components/admin/Toaster";
import { useConfirmDelete } from "@/components/admin/useConfirmDelete";
import { HeaderMenuPreview } from "@/components/admin/HeaderMenuPreview";
import { defaultFooterCta } from "@/lib/default-content";
import { adminBadge, adminBadgeMuted, adminBtn, adminBtnLg, adminDragBorder } from "@/lib/admin-ui";
import type { PageHeaderPreviewItem } from "@/lib/navigation";
import type { MenuItem, NavigationRecord, SiteSettingsRecord } from "@/types/cms";

type EditableMenuItem = MenuItem & { _id: string };

type Props = {
  location: "header" | "footer";
  menu?: NavigationRecord | null;
  initialItems: MenuItem[];
  pageHeaderItems?: PageHeaderPreviewItem[];
  resolvedHeaderItems?: MenuItem[];
  initialSocial?: SiteSettingsRecord["social"];
};

const initialState: AdminActionState = { ok: false, message: "" };

function randomId() {
  return `menu-item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function withSequentialOrder(items: EditableMenuItem[]): EditableMenuItem[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

function toEditableItems(items: MenuItem[]): EditableMenuItem[] {
  return withSequentialOrder(
    items.map((item) => ({
      ...structuredClone(item),
      _id: randomId(),
    })),
  );
}

function toMenuItems(items: EditableMenuItem[]): MenuItem[] {
  return withSequentialOrder(items).map(({ _id: _unused, ...item }) => item);
}

export function MenuEditor({
  location,
  menu,
  initialItems,
  pageHeaderItems = [],
  resolvedHeaderItems = [],
  initialSocial,
}: Props) {
  const { push } = useToast();
  const [state, formAction, pending] = useActionState(saveMenuAction, initialState);
  const [, startTransition] = useTransition();
  const footerCtaDefaults = location === "footer" ? defaultFooterCta : null;
  const [title, setTitle] = useState(menu?.title || (location === "header" ? "Header Menu" : "Footer Menu"));
  const [items, setItems] = useState<EditableMenuItem[]>(() => toEditableItems(initialItems));
  const [ctaEyebrow, setCtaEyebrow] = useState(
    menu?.cta?.eyebrow || footerCtaDefaults?.eyebrow || "",
  );
  const [ctaHeadline, setCtaHeadline] = useState(
    menu?.cta?.headline || footerCtaDefaults?.headline || "",
  );
  const [ctaHeadlineAccent, setCtaHeadlineAccent] = useState(
    menu?.cta?.headlineAccent || footerCtaDefaults?.headlineAccent || "",
  );
  const [ctaLabel, setCtaLabel] = useState(menu?.cta?.label || footerCtaDefaults?.label || "");
  const [ctaHref, setCtaHref] = useState(menu?.cta?.href || footerCtaDefaults?.href || "");
  const [ctaVisible, setCtaVisible] = useState(
    menu?.cta?.visible ?? footerCtaDefaults?.visible ?? false,
  );
  const [instagram, setInstagram] = useState(initialSocial?.instagram ?? "");
  const [linkedin, setLinkedin] = useState(initialSocial?.linkedin ?? "");
  const [facebook, setFacebook] = useState(initialSocial?.facebook ?? "");
  const [x, setX] = useState(initialSocial?.x ?? "");
  const [dragId, setDragId] = useState<string | null>(null);
  const { pending: pendingDelete, requestDelete, cancelDelete, confirmDelete } = useConfirmDelete();

  useEffect(() => {
    if (state.message) {
      push({ message: state.message, variant: state.ok ? "success" : "error" });
    }
  }, [push, state.message, state.ok]);

  const updateItem = (id: string, updater: (item: EditableMenuItem) => EditableMenuItem) => {
    setItems((current) => current.map((item) => (item._id === id ? updater(item) : item)));
  };

  const addItem = () => {
    const suffix = Date.now().toString(36);
    setItems((current) =>
      withSequentialOrder([
        ...current,
        {
          _id: randomId(),
          label: "New link",
          href: `/link-${suffix}`,
          order: current.length,
          visible: true,
        },
      ]),
    );
  };

  const removeItem = (id: string) => {
    const item = items.find((entry) => entry._id === id);
    requestDelete({
      title: "Remove menu link?",
      description: `This will remove “${item?.label || "this link"}” from the menu. Save to persist the change.`,
      onConfirm: () => {
        setItems((current) => withSequentialOrder(current.filter((entry) => entry._id !== id)));
      },
    });
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((current) => {
      const index = current.findIndex((entry) => entry._id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return withSequentialOrder(next);
    });
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setItems((current) => {
      const from = current.findIndex((entry) => entry._id === dragId);
      const to = current.findIndex((entry) => entry._id === targetId);
      if (from === -1 || to === -1) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return withSequentialOrder(next);
    });
    setDragId(null);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    form.set("location", location);
    form.set("title", title);
    form.set("itemsJson", JSON.stringify(toMenuItems(items)));
    form.set("ctaEyebrow", ctaEyebrow);
    form.set("ctaHeadline", ctaHeadline);
    form.set("ctaHeadlineAccent", ctaHeadlineAccent);
    form.set("ctaLabel", ctaLabel);
    form.set("ctaHref", ctaHref);
    if (ctaVisible) form.set("ctaVisible", "on");
    if (location === "footer") {
      form.set("instagram", instagram);
      form.set("linkedin", linkedin);
      form.set("facebook", facebook);
      form.set("x", x);
    }
    startTransition(() => formAction(form));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <Panel title={`Editing ${location} menu`}>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Location"
            name="locationDisplay"
            value={location}
            disabled
            options={[
              { label: "Header", value: "header" },
              { label: "Footer", value: "footer" },
            ]}
          />
          <TextInput label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
      </Panel>

      {location === "header" ? (
        <Panel
          title="Header menu preview"
          description="How the main site navigation will appear, including Service sub-pages."
        >
          <HeaderMenuPreview items={resolvedHeaderItems} />
        </Panel>
      ) : null}

      {location === "header" ? (
        <Panel
          title="Pages in header"
          description="These links come from published pages marked “show in header” on the Pages screen. Edit labels and order there."
        >
          {pageHeaderItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
              No pages are currently set to appear in the header. Open a page in the Pages screen and enable “show in header”.
            </p>
          ) : (
            <ul className="grid gap-2">
              {pageHeaderItems.map((item, index) => (
                <li
                  key={item.href}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-950">{item.label}</p>
                    <p className="truncate text-[11px] text-stone-500">{item.href}</p>
                  </div>
                  <span className={adminBadge}>
                    Page
                  </span>
                  <Link
                    href={`/admin/pages?slug=${item.slug}`}
                    className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-stone-700"
                  >
                    Edit page
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {location === "header" ? (
        <Panel
          title="Manual header links"
          description="Custom links that are not tied to a published page. They appear alongside page links on the live site."
          actions={
            <button
              type="button"
              onClick={addItem}
              className={adminBtn}
            >
              + Add link
            </button>
          }
        >
          <MenuItemList
            items={items}
            dragId={dragId}
            onDragStart={setDragId}
            onDragEnd={() => setDragId(null)}
            onDrop={handleDrop}
            onMove={moveItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            emptyMessage="No manual header links yet. Add custom links like external URLs or landing pages not managed as site pages."
          />
        </Panel>
      ) : (
        <Panel
          title="Footer links"
          description="Drag to reorder, or use the arrow buttons. Toggle visibility to hide a link without deleting it."
          actions={
            <button
              type="button"
              onClick={addItem}
              className={adminBtn}
            >
              + Add link
            </button>
          }
        >
          <MenuItemList
            items={items}
            dragId={dragId}
            onDragStart={setDragId}
            onDragEnd={() => setDragId(null)}
            onDrop={handleDrop}
            onMove={moveItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            emptyMessage="No footer links yet. Add your first link to start building the footer menu."
          />
        </Panel>
      )}

      {location === "footer" ? (
        <Panel
          title="Social links"
          description="Shown in the footer Studio and bottom bar. Same fields as Site details — saving here updates them site-wide."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Instagram"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              optional
            />
            <TextInput
              label="LinkedIn"
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              optional
            />
            <TextInput
              label="Facebook"
              value={facebook}
              onChange={(event) => setFacebook(event.target.value)}
              optional
            />
            <TextInput
              label="X / Twitter"
              value={x}
              onChange={(event) => setX(event.target.value)}
              optional
            />
          </div>
        </Panel>
      ) : null}

      <Panel
        title={location === "footer" ? "Footer call to action" : "Call to action button"}
        description={
          location === "footer"
            ? "Controls the large headline and project button in the footer. Leave fields blank to use the live-site defaults until you save."
            : undefined
        }
      >
        {location === "footer" ? (
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <TextInput
              label="Eyebrow"
              value={ctaEyebrow}
              onChange={(event) => setCtaEyebrow(event.target.value)}
              optional
            />
            <TextInput
              label="Headline (line 1)"
              value={ctaHeadline}
              onChange={(event) => setCtaHeadline(event.target.value)}
              optional
            />
            <TextInput
              label="Headline accent (gold line)"
              value={ctaHeadlineAccent}
              onChange={(event) => setCtaHeadlineAccent(event.target.value)}
              optional
            />
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Button label"
            value={ctaLabel}
            onChange={(event) => setCtaLabel(event.target.value)}
            optional
          />
          <TextInput label="Button link" value={ctaHref} onChange={(event) => setCtaHref(event.target.value)} optional />
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={ctaVisible}
            onChange={(event) => setCtaVisible(event.target.checked)}
            className="h-4 w-4 rounded border-stone-300"
          />
          Show CTA button
        </label>
      </Panel>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        <button
          type="submit"
          disabled={pending}
          className={adminBtnLg}
        >
          {pending ? "Saving…" : "Save menu"}
        </button>
        {pending ? <p className="text-sm text-stone-500">Saving changes…</p> : null}
      </div>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title ?? "Remove link?"}
        description={pendingDelete?.description ?? "This action cannot be undone."}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </form>
  );
}

type MenuItemListProps = {
  items: EditableMenuItem[];
  dragId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onUpdate: (id: string, updater: (item: EditableMenuItem) => EditableMenuItem) => void;
  onRemove: (id: string) => void;
  emptyMessage: string;
};

function MenuItemList({
  items,
  dragId,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
  onUpdate,
  onRemove,
  emptyMessage,
}: MenuItemListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-2">
      {items.map((item, index) => (
        <li
          key={item._id}
          onDragOver={(event) => {
            if (dragId && dragId !== item._id) event.preventDefault();
          }}
          onDrop={() => onDrop(item._id)}
          className={`rounded-2xl border bg-white transition ${
            dragId === item._id ? `${adminDragBorder} opacity-60` : "border-stone-200"
          } ${!item.visible ? "opacity-70" : ""}`}
        >
          <div className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span
              draggable
              aria-hidden="true"
              title="Drag to reorder"
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", item._id);
                onDragStart(item._id);
              }}
              onDragEnd={onDragEnd}
              className="cursor-grab select-none text-lg text-stone-300 active:cursor-grabbing"
            >
              ⋮⋮
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={adminBadgeMuted}>
              Manual
            </span>
            <button
              type="button"
              onClick={() => onMove(item._id, -1)}
              disabled={index === 0}
              className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Move link up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(item._id, 1)}
              disabled={index === items.length - 1}
              className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Move link down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onRemove(item._id)}
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-4 border-t border-stone-200 px-4 py-4 md:grid-cols-[1fr_1fr_auto]">
            <TextInput
              label="Label"
              value={item.label}
              onChange={(event) => onUpdate(item._id, (current) => ({ ...current, label: event.target.value }))}
              required
            />
            <TextInput
              label="Link URL"
              value={item.href}
              onChange={(event) =>
                onUpdate(item._id, (current) => ({ ...current, href: event.target.value }))
              }
              required
            />
            <label className="flex items-end gap-3 pb-2.5 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={item.visible}
                onChange={(event) =>
                  onUpdate(item._id, (current) => ({ ...current, visible: event.target.checked }))
                }
                className="h-4 w-4 rounded border-stone-300"
              />
              Visible
            </label>
          </div>
          {(item.children ?? []).length > 0 ? (
            <div className="border-t border-stone-200 px-4 py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Sub-items
              </p>
              <ul className="grid gap-1.5">
                {[...(item.children ?? [])]
                  .sort((a, b) => a.order - b.order)
                  .map((child) => (
                    <li
                      key={child.href}
                      className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-stone-700"
                    >
                      <span className="truncate">{child.label}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-stone-400">{child.href}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { SectionEditor } from "@/components/admin/SectionEditor";
import type { CategoryOption } from "@/components/admin/SectionFieldRow";
import { useConfirmDelete } from "@/components/admin/useConfirmDelete";
import { SECTION_GROUPS, buildDefaultSection, getSectionSpec } from "@/lib/section-schemas";
import type { PageSection, SectionType } from "@/types/cms";

type Props = {
  value: PageSection[];
  onChange: (next: PageSection[]) => void;
  categories?: CategoryOption[];
};

function previewTitle(section: PageSection): string {
  if (section.title?.trim()) return section.title;
  if (section.eyebrow?.trim()) return section.eyebrow;
  return getSectionSpec(section.type).label;
}

export function SectionsManager({ value, onChange, categories = [] }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerInsertIndex, setPickerInsertIndex] = useState<number | null>(null);
  const { pending: pendingDelete, requestDelete, cancelDelete, confirmDelete } = useConfirmDelete();

  const updateSection = (id: string, next: PageSection) => {
    onChange(value.map((entry) => (entry.id === id ? next : entry)));
  };

  const duplicateSection = (id: string) => {
    const target = value.find((entry) => entry.id === id);
    if (!target) return;
    const clone: PageSection = {
      ...target,
      id: `${target.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      settings: structuredClone(target.settings ?? {}),
    };
    const index = value.findIndex((entry) => entry.id === id);
    onChange([...value.slice(0, index + 1), clone, ...value.slice(index + 1)]);
  };

  const removeSection = (id: string) => {
    const section = value.find((entry) => entry.id === id);
    requestDelete({
      title: "Delete section?",
      description: `This will remove “${previewTitle(section ?? { type: "heroEditorial", id, enabled: true, settings: {} })}”. Save the page to persist the change.`,
      onConfirm: () => {
        onChange(value.filter((entry) => entry.id !== id));
        if (openId === id) setOpenId(null);
      },
    });
  };

  const insertSection = (type: SectionType, atIndex: number | null = null) => {
    const next = buildDefaultSection(type);
    const list = [...value];
    const index = atIndex === null ? list.length : atIndex;
    list.splice(index, 0, next);
    onChange(list);
    setOpenId(next.id);
    setPickerOpen(false);
    setPickerInsertIndex(null);
  };

  const moveSection = (id: string, direction: -1 | 1) => {
    const index = value.findIndex((entry) => entry.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= value.length) return;
    const next = [...value];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = value.findIndex((entry) => entry.id === dragId);
    const to = value.findIndex((entry) => entry.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setDragId(null);
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div>
          <p className="text-sm font-semibold text-stone-950">Page sections</p>
          <p className="text-xs text-stone-500">Drag to reorder. Click a row to edit it.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPickerInsertIndex(null);
            setPickerOpen(true);
          }}
          className="rounded-full bg-stone-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-stone-700"
        >
          + Add section
        </button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <p className="text-sm text-stone-500">No sections yet. Add your first one to start building.</p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-stone-700"
          >
            + Add section
          </button>
        </div>
      ) : (
        <ul className="grid gap-2">
          {value.map((section, index) => {
            const spec = getSectionSpec(section.type);
            const open = openId === section.id;
            return (
              <li
                key={section.id}
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragOver={(event) => {
                  if (dragId && dragId !== section.id) event.preventDefault();
                }}
                onDrop={() => handleDrop(section.id)}
                onDragEnd={() => setDragId(null)}
                className={`rounded-2xl border bg-white shadow-sm transition ${
                  dragId === section.id ? "border-violet-500 opacity-60" : "border-stone-200 hover:border-stone-300"
                } ${!section.enabled ? "opacity-70" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span
                    aria-hidden="true"
                    title="Drag to reorder"
                    className="cursor-grab select-none text-lg text-stone-300 active:cursor-grabbing"
                  >
                    ⋮⋮
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : section.id)}
                      className="block w-full text-left"
                    >
                      <p className="truncate text-sm font-semibold text-stone-950">{previewTitle(section)}</p>
                      <p className="truncate text-[11px] text-stone-500">
                        {spec.label}
                        {section.enabled ? "" : " · Hidden"}
                      </p>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, -1)}
                      disabled={index === 0}
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 1)}
                      disabled={index === value.length - 1}
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateSection(section.id)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600 hover:bg-stone-100"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : section.id)}
                      className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-stone-700"
                    >
                      {open ? "Close" : "Edit"}
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-stone-200 bg-stone-50/60"
                    >
                      <div className="p-5">
                        <SectionEditor
                          section={section}
                          onChange={(next) => updateSection(section.id, next)}
                          categories={categories}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}

      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
            onClick={() => setPickerOpen(false)}
          >
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">Add a section</h3>
                  <p className="mt-1 text-sm text-stone-500">Pick a section type — content stubs are inserted for you.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600 hover:bg-stone-200"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-6">
                {SECTION_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                      {group.label}
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {group.types.map((type) => {
                        const spec = getSectionSpec(type);
                        return (
                          <li key={type}>
                            <button
                              type="button"
                              onClick={() => insertSection(type, pickerInsertIndex)}
                              className="flex w-full items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-violet-500 hover:bg-stone-50"
                            >
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-100 font-mono text-xs text-stone-500">
                                {type
                                  .replace(/[A-Z]/g, (m) => ` ${m}`)
                                  .trim()
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                              <span className="grid gap-1">
                                <span className="font-semibold text-stone-950">{spec.label}</span>
                                <span className="text-xs text-stone-500">{spec.description}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title ?? "Delete item?"}
        description={pendingDelete?.description ?? "This action cannot be undone."}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

"use client";

import { SectionFieldRow, type CategoryOption } from "@/components/admin/SectionFieldRow";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { Textarea, TextInput, Toggle } from "@/components/admin/forms/Field";
import { useConfirmDelete } from "@/components/admin/useConfirmDelete";
import { getSectionSpec } from "@/lib/section-schemas";
import type { PageSection } from "@/types/cms";

type SettingsRecord = Record<string, unknown>;

type Props = {
  section: PageSection;
  onChange: (next: PageSection) => void;
  categories?: CategoryOption[];
};

function toRecord(value: unknown): SettingsRecord {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as SettingsRecord;
  }
  return {};
}

function toArray(value: unknown): SettingsRecord[] {
  return Array.isArray(value) ? (value as SettingsRecord[]) : [];
}

export function SectionEditor({ section, onChange, categories = [] }: Props) {
  const spec = getSectionSpec(section.type);
  const settings = toRecord(section.settings);
  const { pending: pendingDelete, requestDelete, cancelDelete, confirmDelete } = useConfirmDelete();

  const setSetting = (key: string, value: unknown) => {
    onChange({ ...section, settings: { ...settings, [key]: value } });
  };

  const setGroup = (groupName: string, next: SettingsRecord[]) => {
    setSetting(groupName, next);
  };

  const setTopLevel = <K extends "title" | "eyebrow" | "subtitle" | "enabled">(key: K, value: PageSection[K]) => {
    onChange({ ...section, [key]: value });
  };

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold-deep)]">{spec.label}</p>
          <p className="mt-1 text-sm text-stone-500">{spec.description}</p>
        </div>
        <Toggle
          label="Enabled"
          hint="Hide this section from the public site without deleting it."
          checked={section.enabled}
          onChange={(event) => setTopLevel("enabled", event.target.checked)}
        />
      </header>

      {/* Top-level fields */}
      {(spec.topLevel ?? []).length > 0 && (
        <div className="grid gap-4">
          {spec.topLevel?.includes("eyebrow") && (
            <TextInput
              label="Eyebrow"
              placeholder="A short kicker above the title"
              value={section.eyebrow}
              onChange={(event) => setTopLevel("eyebrow", event.target.value)}
              optional
            />
          )}
          {spec.topLevel?.includes("title") && (
            <TextInput
              label="Title"
              placeholder="Section title"
              value={section.title}
              onChange={(event) => setTopLevel("title", event.target.value)}
              hint="Use “ | ” to force a line break (e.g. “We build brand stories | that earn revenue.”)."
              optional
            />
          )}
          {spec.topLevel?.includes("subtitle") && (
            <Textarea
              label="Subtitle"
              placeholder="Supporting paragraph (1–3 sentences)"
              value={section.subtitle}
              onChange={(event) => setTopLevel("subtitle", event.target.value)}
              optional
              rows={3}
            />
          )}
        </div>
      )}

      {/* Discrete settings fields */}
      {spec.fields.length > 0 && (
        <div className="grid gap-4">
          {spec.fields.map((fieldSpec) => (
            <SectionFieldRow
              key={fieldSpec.name}
              spec={fieldSpec}
              value={settings[fieldSpec.name]}
              onChange={(next) => setSetting(fieldSpec.name, next)}
              categories={categories}
            />
          ))}
        </div>
      )}

      {/* Repeatable groups */}
      {(spec.groups ?? []).map((group) => {
        const items = toArray(settings[group.name]);

        const updateItem = (index: number, key: string, value: unknown) => {
          const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
          setGroup(group.name, next);
        };

        const removeItem = (index: number) => {
          setGroup(
            group.name,
            items.filter((_, i) => i !== index),
          );
        };

        const moveItem = (index: number, dir: -1 | 1) => {
          const targetIndex = index + dir;
          if (targetIndex < 0 || targetIndex >= items.length) return;
          const next = [...items];
          const [moved] = next.splice(index, 1);
          next.splice(targetIndex, 0, moved);
          setGroup(group.name, next);
        };

        const isPlainStringArray =
          group.fields.length === 1 &&
          group.fields[0].kind === "text" &&
          (items.length === 0 || items.every((entry) => typeof entry === "string"));

        const addItem = () => {
          if (isPlainStringArray) {
            setGroup(group.name, [...items, "" as unknown as SettingsRecord]);
            return;
          }
          const blank: SettingsRecord = {};
          for (const field of group.fields) {
            blank[field.name] = field.kind === "number" ? 0 : field.kind === "switch" ? false : "";
          }
          setGroup(group.name, [...items, blank]);
        };

        return (
          <div key={group.name} className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-950">{group.label}</p>
                <p className="text-xs text-stone-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
              >
                + Add {group.itemLabel.toLowerCase()}
              </button>
            </div>

            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-xs text-stone-500">
                No {group.itemLabel.toLowerCase()}s yet. Add one to get started.
              </p>
            ) : (
              <ul className="grid gap-3">
                {items.map((item, index) => (
                  <li
                    key={`${group.name}-${index}`}
                    className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      <span>
                        {group.itemLabel} {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Move up"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="grid h-7 w-7 place-items-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          onClick={() => moveItem(index, 1)}
                          disabled={index === items.length - 1}
                          className="grid h-7 w-7 place-items-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() => {
                            requestDelete({
                              title: `Remove ${group.itemLabel.toLowerCase()}?`,
                              description: `This will remove this ${group.itemLabel.toLowerCase()} from the section. Save the page to persist the change.`,
                              onConfirm: () => removeItem(index),
                            });
                          }}
                          className="grid h-7 w-7 place-items-center rounded-full border border-stone-200 bg-white text-red-600 hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {group.fields.length === 1 && group.fields[0].kind === "text" ? (
                      // Special case: marquee items / single-text groups render as plain text rows.
                      <SectionFieldRow
                        spec={group.fields[0]}
                        value={typeof item === "string" ? item : item[group.fields[0].name]}
                        onChange={(next) => {
                          // If group items are plain strings (marquee), replace whole item with the string.
                          const isPlainString = items.every((entry) => typeof entry === "string");
                          if (isPlainString) {
                            const replaced = items.map((entry, i) => (i === index ? next : entry));
                            setGroup(group.name, replaced as unknown as SettingsRecord[]);
                          } else {
                            updateItem(index, group.fields[0].name, next);
                          }
                        }}
                      />
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {group.fields.map((fieldSpec) => (
                          <SectionFieldRow
                            key={fieldSpec.name}
                            spec={fieldSpec}
                            value={item[fieldSpec.name]}
                            onChange={(next) => updateItem(index, fieldSpec.name, next)}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

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

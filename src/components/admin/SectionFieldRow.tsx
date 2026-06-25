"use client";

import { ImageSourceInput } from "@/components/admin/ImageSourceInput";
import { VideoSourceInput } from "@/components/admin/VideoSourceInput";
import { Select, Textarea, TextInput, Toggle } from "@/components/admin/forms/Field";
import type { SectionFieldSpec } from "@/lib/section-schemas";

export type CategoryOption = {
  slug: string;
  title: string;
};

type Props = {
  spec: SectionFieldSpec;
  value: unknown;
  onChange: (next: unknown) => void;
  categories?: CategoryOption[];
};

export function SectionFieldRow({ spec, value, onChange, categories = [] }: Props) {
  const stringValue = typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);

  const resolvedSpec =
    spec.kind === "categorySelect"
      ? {
          ...spec,
          kind: "select" as const,
          options: categories.map((category) => ({
            label: category.title,
            value: category.slug,
          })),
        }
      : spec;

  if (resolvedSpec.kind === "longtext") {
    return (
      <Textarea
        label={resolvedSpec.label}
        rows={5}
        placeholder={resolvedSpec.placeholder}
        hint={resolvedSpec.description}
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        optional={!resolvedSpec.required}
      />
    );
  }

  if (resolvedSpec.kind === "number") {
    return (
      <TextInput
        type="number"
        label={resolvedSpec.label}
        placeholder={resolvedSpec.placeholder}
        hint={resolvedSpec.description}
        value={stringValue}
        onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
        optional={!resolvedSpec.required}
      />
    );
  }

  if (resolvedSpec.kind === "select") {
    return (
      <Select
        label={resolvedSpec.label}
        options={resolvedSpec.options || []}
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        hint={resolvedSpec.description}
      />
    );
  }

  if (resolvedSpec.kind === "switch") {
    return (
      <div className="grid gap-2 text-[12px] text-stone-700">
        <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{resolvedSpec.label}</span>
        <Toggle
          label={resolvedSpec.placeholder || "Enabled"}
          hint={resolvedSpec.description}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
    );
  }

  if (resolvedSpec.kind === "image") {
    return (
      <ImageSourceInput
        label={resolvedSpec.label}
        name={`__field-${resolvedSpec.name}`}
        defaultValue={stringValue}
        description={resolvedSpec.description}
        folder="sections"
        onChange={(next) => onChange(next)}
      />
    );
  }

  if (resolvedSpec.kind === "video") {
    return (
      <VideoSourceInput
        label={resolvedSpec.label}
        name={`__field-${resolvedSpec.name}`}
        defaultValue={stringValue}
        description={resolvedSpec.description}
        folder="video"
        onChange={(next) => onChange(next)}
      />
    );
  }

  return (
    <TextInput
      type="text"
      inputMode={resolvedSpec.kind === "url" ? "url" : undefined}
      label={resolvedSpec.label}
      placeholder={resolvedSpec.placeholder}
      hint={resolvedSpec.description}
      value={stringValue}
      onChange={(event) => onChange(event.target.value)}
      optional={!resolvedSpec.required}
    />
  );
}

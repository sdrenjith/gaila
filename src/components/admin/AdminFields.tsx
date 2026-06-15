"use client";

import type { ReactNode } from "react";
import { Panel as SharedPanel, Select as SharedSelect, Textarea, TextInput } from "@/components/admin/forms/Field";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  hint?: ReactNode;
  placeholder?: string;
};

/** Back-compat wrapper around the shared TextInput. */
export function Field({ label, name, defaultValue, type = "text", required = true, hint, placeholder }: FieldProps) {
  return (
    <TextInput
      label={label}
      name={name}
      type={type}
      defaultValue={defaultValue}
      required={required}
      hint={hint}
      placeholder={placeholder}
      optional={!required}
    />
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  hint?: ReactNode;
  placeholder?: string;
};

export function TextArea({ label, name, defaultValue, rows = 5, required = true, hint, placeholder }: TextAreaProps) {
  return (
    <Textarea
      label={label}
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      required={required}
      hint={hint}
      placeholder={placeholder}
      optional={!required}
    />
  );
}

type SelectProps = {
  label: string;
  name: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
  hint?: ReactNode;
};

export function Select({ label, name, defaultValue, options, hint }: SelectProps) {
  return <SharedSelect label={label} name={name} defaultValue={defaultValue} options={options} hint={hint} />;
}

export function Panel(props: { children: React.ReactNode; title?: string; description?: string; actions?: React.ReactNode }) {
  return <SharedPanel {...props} />;
}

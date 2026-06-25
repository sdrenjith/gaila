"use client";

import { type ReactNode, type ChangeEvent, type InputHTMLAttributes } from "react";
import { adminInputClass } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
  optional?: boolean;
  htmlFor?: string;
};

export function FieldShell({ label, hint, error, className, children, optional, htmlFor }: FieldShellProps) {
  return (
    <label htmlFor={htmlFor} className={cn("grid gap-2 text-[12px] font-medium text-stone-700", className)}>
      {label && (
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
          {label}
          {optional && <span className="text-[10px] text-stone-400">optional</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="text-[12px] text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-stone-500">{hint}</span>
      ) : null}
    </label>
  );
}

type TextInputProps = {
  label?: ReactNode;
  name?: string;
  type?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  inputClassName?: string;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
};

export function TextInput({
  label,
  name,
  type = "text",
  inputMode,
  defaultValue,
  value,
  placeholder,
  required,
  hint,
  error,
  className,
  inputClassName,
  optional,
  disabled,
  onChange,
  id,
}: TextInputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className} optional={optional} htmlFor={id}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className={cn(adminInputClass, inputClassName)}
      />
    </FieldShell>
  );
}

type TextareaProps = {
  label?: ReactNode;
  name?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
};

export function Textarea({
  label,
  name,
  defaultValue,
  value,
  placeholder,
  rows = 4,
  required,
  hint,
  error,
  className,
  optional,
  disabled,
  onChange,
  id,
}: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className} optional={optional} htmlFor={id}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className={cn(adminInputClass, "resize-y leading-6")}
      />
    </FieldShell>
  );
}

type SelectProps = {
  label?: ReactNode;
  name?: string;
  defaultValue?: string;
  value?: string;
  options: { label: string; value: string }[];
  hint?: ReactNode;
  error?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
};

export function Select({
  label,
  name,
  defaultValue,
  value,
  options,
  hint,
  error,
  className,
  optional,
  disabled,
  required,
  onChange,
  id,
}: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className} optional={optional} htmlFor={id}>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={cn(adminInputClass, "pr-8")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type ToggleProps = {
  label: ReactNode;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  hint?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
};

export function Toggle({ label, name, checked, defaultChecked, hint, onChange, id }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-stone-700">
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="block h-5 w-9 rounded-full bg-stone-300 transition peer-checked:bg-stone-900" />
        <span className="absolute left-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="grid gap-1">
        <span className="font-medium text-stone-900">{label}</span>
        {hint && <span className="text-[12px] text-stone-500">{hint}</span>}
      </span>
    </label>
  );
}

export function Panel({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      {(title || description || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold tracking-tight text-stone-950">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-6 text-stone-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

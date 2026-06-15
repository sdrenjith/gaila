"use client";

type AdminListSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  visibleCount: number;
  totalCount: number;
  itemLabel?: string;
  /** Stack count below the input — better for narrow sidebar columns. */
  stacked?: boolean;
};

export function AdminListSearch({
  value,
  onChange,
  placeholder = "Search…",
  visibleCount,
  totalCount,
  itemLabel = "entries",
  stacked = false,
}: AdminListSearchProps) {
  const label = totalCount === 1 ? itemLabel.replace(/s$/, "") : itemLabel;
  const count = (
    <span className="text-xs text-stone-500">
      {visibleCount} / {totalCount} {label}
    </span>
  );

  return (
    <div className={`mb-3 ${stacked ? "grid gap-2" : "flex items-center gap-3"}`}>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm outline-none focus:border-[var(--gold-deep)]"
      />
      {stacked ? count : <span className="shrink-0">{count}</span>}
    </div>
  );
}

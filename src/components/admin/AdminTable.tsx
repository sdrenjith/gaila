"use client";

import { useMemo, useState, type ReactNode } from "react";

export type AdminTableColumn<T> = {
  key: string;
  header: string;
  /** How wide the column should be in the grid. e.g. "minmax(0,1.5fr)" or "8rem". */
  width?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
};

type AdminTableProps<T> = {
  rows: T[];
  columns: AdminTableColumn<T>[];
  getRowKey: (row: T) => string;
  searchPlaceholder?: string;
  /** Should return true if the row matches the search term. */
  filterRow?: (row: T, term: string) => boolean;
  emptyState?: ReactNode;
  /** Row-level actions displayed on the right side. */
  rowActions?: (row: T) => ReactNode;
};

export function AdminTable<T>({
  rows,
  columns,
  getRowKey,
  searchPlaceholder = "Search…",
  filterRow,
  emptyState,
  rowActions,
}: AdminTableProps<T>) {
  const [term, setTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const visibleRows = useMemo(() => {
    let result = rows;
    if (term.trim() && filterRow) {
      const needle = term.toLowerCase().trim();
      result = result.filter((row) => filterRow(row, needle));
    }
    if (sortKey) {
      const column = columns.find((c) => c.key === sortKey);
      if (column?.sortValue) {
        const valueFn = column.sortValue;
        result = [...result].sort((a, b) => {
          const av = valueFn(a);
          const bv = valueFn(b);
          if (av === bv) return 0;
          const diff = av > bv ? 1 : -1;
          return sortDir === "asc" ? diff : -diff;
        });
      }
    }
    return result;
  }, [rows, term, filterRow, sortKey, sortDir, columns]);

  const gridTemplate = useMemo(() => {
    const widths = columns.map((column) => column.width || "minmax(0,1fr)");
    if (rowActions) widths.push("minmax(0,auto)");
    return widths.join(" ");
  }, [columns, rowActions]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full max-w-sm rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm outline-none focus:border-[var(--gold-deep)]"
        />
        <span className="text-xs text-stone-500">
          {visibleRows.length} / {rows.length} {rows.length === 1 ? "row" : "rows"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div
            className="grid border-b border-stone-200 bg-stone-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((column) => (
              <button
                key={column.key}
                type="button"
                onClick={() => column.sortable && toggleSort(column.key)}
                disabled={!column.sortable}
                className={`flex items-center gap-1 text-left ${
                  column.sortable ? "cursor-pointer text-stone-700" : ""
                }`}
              >
                {column.header}
                {column.sortable && sortKey === column.key && (
                  <span aria-hidden="true">{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
            ))}
            {rowActions && <span className="text-right">Actions</span>}
          </div>
          <ul className="divide-y divide-stone-100">
            {visibleRows.map((row) => (
              <li
                key={getRowKey(row)}
                className="grid items-center gap-4 px-4 py-4 text-sm text-stone-800 transition hover:bg-stone-50"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                {columns.map((column) => (
                  <div key={column.key} className="min-w-0">
                    {column.render(row)}
                  </div>
                ))}
                {rowActions && <div className="flex items-center justify-end gap-2">{rowActions(row)}</div>}
              </li>
            ))}
            {visibleRows.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-stone-500">
                {emptyState ?? "No rows yet."}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

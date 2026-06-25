/**
 * Gaila CMS admin UI tokens — explicit light-theme colors.
 * Do not use site :root vars (--ink, --paper) in admin; they follow the public dark theme.
 */

/** Primary action button (default size) */
export const adminBtn =
  "rounded-full bg-stone-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60";

/** Primary action button (large) */
export const adminBtnLg =
  "rounded-full bg-stone-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60";

/** Primary action button (small) */
export const adminBtnSm =
  "rounded-full bg-stone-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60";

/** Violet accent button (secondary CTA) */
export const adminAccentBtn =
  "rounded-full bg-violet-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60";

/** Selected location / nav card */
export const adminNavActive =
  "border-violet-600 bg-stone-900 font-semibold text-white shadow-sm ring-1 ring-stone-900";

/** Unselected location / nav card */
export const adminNavInactive =
  "border-stone-200 bg-stone-50 text-stone-900 hover:bg-stone-100";

/** Selected list row */
export const adminListActive = "bg-stone-900 text-white";

/** Unselected list row */
export const adminListInactive = "text-stone-700 hover:bg-stone-100";

/** Status / type badge on light surfaces */
export const adminBadge =
  "rounded-full bg-stone-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-800";

/** Muted badge on light surfaces */
export const adminBadgeMuted =
  "rounded-full bg-stone-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-700";

/** Progress bar fill */
export const adminProgress = "h-full rounded-full bg-stone-900 transition-[width]";

/** Drag target / accent border */
export const adminDragBorder = "border-violet-500";

/** Published / active status text */
export const adminStatusActive = "text-violet-700";

/** Input focus ring (for admin forms) */
export const adminInputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-800 disabled:opacity-100";

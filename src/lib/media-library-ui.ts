import type { MediaAssetRecord } from "@/types/cms";

export type MediaKind = "image" | "video" | "other";

export type MediaTypeFilter = "all" | "image" | "video";

export const MEDIA_FOLDER_ORDER = [
  "weddings",
  "events",
  "corporate",
  "gallery",
  "content",
  "desserts",
  "brand",
  "video",
  "videos",
  "site",
  "settings",
  "categories",
  "sections",
  "general",
] as const;

export const MEDIA_UPLOAD_FOLDER_OPTIONS = [
  { value: "weddings", label: "Weddings" },
  { value: "events", label: "Events" },
  { value: "corporate", label: "Corporate" },
  { value: "gallery", label: "Gallery" },
  { value: "content", label: "Content" },
  { value: "desserts", label: "Desserts" },
  { value: "brand", label: "Brand" },
  { value: "video", label: "Video" },
  { value: "videos", label: "Videos" },
  { value: "site", label: "Site" },
  { value: "settings", label: "Settings" },
  { value: "categories", label: "Categories" },
  { value: "sections", label: "Sections" },
  { value: "general", label: "General" },
] as const;

export function classifyMediaKind(mimeType: string): MediaKind {
  const mime = (mimeType || "").toLowerCase();
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  return "other";
}

export function normalizeFolder(folder: string | undefined): string {
  const value = (folder || "general").trim().toLowerCase();
  return value || "general";
}

export function formatFolderLabel(folder: string): string {
  const normalized = normalizeFolder(folder);
  if (normalized === "site") return "Site";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatMediaDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function compareFolders(a: string, b: string): number {
  const ai = MEDIA_FOLDER_ORDER.indexOf(a as (typeof MEDIA_FOLDER_ORDER)[number]);
  const bi = MEDIA_FOLDER_ORDER.indexOf(b as (typeof MEDIA_FOLDER_ORDER)[number]);
  const aRank = ai === -1 ? MEDIA_FOLDER_ORDER.length + 1 : ai;
  const bRank = bi === -1 ? MEDIA_FOLDER_ORDER.length + 1 : bi;
  if (aRank !== bRank) return aRank - bRank;
  return a.localeCompare(b);
}

export function getFolderCounts(assets: MediaAssetRecord[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const asset of assets) {
    const folder = normalizeFolder(asset.folder);
    counts.set(folder, (counts.get(folder) ?? 0) + 1);
  }
  return counts;
}

export function getSortedFolders(assets: MediaAssetRecord[]): string[] {
  const folders = new Set<string>();
  for (const asset of assets) {
    folders.add(normalizeFolder(asset.folder));
  }
  return [...folders].sort(compareFolders);
}

export function groupAssetsByFolder(assets: MediaAssetRecord[]): Map<string, MediaAssetRecord[]> {
  const groups = new Map<string, MediaAssetRecord[]>();
  for (const asset of assets) {
    const folder = normalizeFolder(asset.folder);
    const list = groups.get(folder);
    if (list) list.push(asset);
    else groups.set(folder, [asset]);
  }
  return groups;
}

export function filterMediaAssets(
  assets: MediaAssetRecord[],
  options: {
    folder?: string;
    type?: MediaTypeFilter;
    query?: string;
  },
): MediaAssetRecord[] {
  const folder = options.folder && options.folder !== "all" ? normalizeFolder(options.folder) : null;
  const type = options.type ?? "all";
  const query = (options.query ?? "").trim().toLowerCase();

  return assets.filter((asset) => {
    if (folder && normalizeFolder(asset.folder) !== folder) return false;
    if (type !== "all" && classifyMediaKind(asset.mimeType) !== type) return false;
    if (!query) return true;

    const haystack = [
      asset.title,
      asset.alt,
      asset.url,
      asset.folder,
      asset.mimeType,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getMediaTypeCounts(assets: MediaAssetRecord[]) {
  let images = 0;
  let videos = 0;
  for (const asset of assets) {
    const kind = classifyMediaKind(asset.mimeType);
    if (kind === "image") images += 1;
    else if (kind === "video") videos += 1;
  }
  return { all: assets.length, image: images, video: videos };
}

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/x-m4v": "m4v",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
  "video/x-quicktime": "mov",
  "video/mov": "mov",
};

const MIME_TO_EXT: Record<string, string> = {
  ...IMAGE_MIME_TO_EXT,
  ...VIDEO_MIME_TO_EXT,
};

const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const ALLOWED_VIDEO_EXTENSIONS = new Set(["mp4", "m4v", "webm", "mov", "ogv"]);
const ALLOWED_EXTENSIONS = new Set([
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_VIDEO_EXTENSIONS,
]);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_FILE_BYTES = MAX_IMAGE_BYTES;
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
export const MAX_IMAGE_LABEL = "10 MB";
export const MAX_VIDEO_LABEL = "500 MB";

export type AssetKind = "image" | "video";

function extensionFromFileName(fileName: string): string {
  return fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() ?? "" : "";
}

export function detectAssetKind(fileName: string, mimeType: string): AssetKind | null {
  const mime = (mimeType || "").toLowerCase();
  const extension = extensionFromFileName(fileName);

  if (mime.startsWith("image/") || ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }
  if (mime.startsWith("video/") || ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  return null;
}

export function isSvgAsset(fileName: string, mimeType: string): boolean {
  const mime = (mimeType || "").toLowerCase();
  return mime === "image/svg+xml" || mime.includes("svg") || extensionFromFileName(fileName) === "svg";
}

export function isAllowedAssetType(fileName: string, mimeType: string, kind: AssetKind): boolean {
  const mime = (mimeType || "").toLowerCase();
  const extension = extensionFromFileName(fileName);
  const allowedExtensions = allowedForKind(kind);
  const mimeExtensions = kind === "video" ? VIDEO_MIME_TO_EXT : IMAGE_MIME_TO_EXT;

  return allowedExtensions.has(extension) || Boolean(mimeExtensions[mime]);
}

function fallbackForKind(kind: AssetKind): string {
  return kind === "video" ? "mp4" : "jpg";
}

function allowedForKind(kind: AssetKind): Set<string> {
  return kind === "video" ? ALLOWED_VIDEO_EXTENSIONS : ALLOWED_IMAGE_EXTENSIONS;
}

export function resolveAssetExtension(
  fileName: string,
  mimeType: string,
  kind: AssetKind,
): string {
  const extFromName = extensionFromFileName(fileName);
  const extFromMime = MIME_TO_EXT[mimeType] ?? "";
  const allowed = allowedForKind(kind);
  const candidate = extFromName || extFromMime;

  if (candidate && allowed.has(candidate)) {
    return candidate === "jpeg" ? "jpg" : candidate;
  }

  if (extFromMime && allowed.has(extFromMime)) {
    return extFromMime === "jpeg" ? "jpg" : extFromMime;
  }

  return fallbackForKind(kind);
}

export function resolveImageExtension(fileName: string, mimeType: string): string {
  return resolveAssetExtension(fileName, mimeType, "image");
}

export function resolveVideoExtension(fileName: string, mimeType: string): string {
  return resolveAssetExtension(fileName, mimeType, "video");
}

export { ALLOWED_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS };

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-quicktime": "mov",
  "video/mov": "mov",
};

const MIME_TO_EXT: Record<string, string> = {
  ...IMAGE_MIME_TO_EXT,
  ...VIDEO_MIME_TO_EXT,
};

const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const ALLOWED_VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);
const ALLOWED_EXTENSIONS = new Set([
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_VIDEO_EXTENSIONS,
]);

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export type AssetKind = "image" | "video";

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
  const extFromName = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() ?? "" : "";
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

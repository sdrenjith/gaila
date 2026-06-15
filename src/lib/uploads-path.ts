import { sep, normalize, join } from "node:path";

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

/** Resolve a `/uploads/...` URL path to an absolute file under `public/uploads/`. */
export function resolveUploadFilePath(relativePath: string): string | null {
  const trimmed = relativePath.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!trimmed.startsWith("uploads/")) {
    return null;
  }

  const publicRoot = join(process.cwd(), "public");
  const absolute = normalize(join(publicRoot, trimmed));
  const uploadsRoot = join(publicRoot, "uploads") + sep;

  if (!absolute.startsWith(uploadsRoot)) {
    return null;
  }

  return absolute;
}

export function mimeTypeForUploadPath(relativePath: string): string {
  const extension = relativePath.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TO_MIME[extension] ?? "application/octet-stream";
}

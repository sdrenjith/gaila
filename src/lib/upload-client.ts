"use client";

import { formatBytes } from "@/lib/utils";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export type UploadKind = "image" | "video";

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number | null;
};

export type UploadResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export type UploadHandlers = {
  onProgress?: (progress: UploadProgress) => void;
  onXhr?: (xhr: XMLHttpRequest) => void;
};

export type ValidateOptions = {
  acceptKinds: UploadKind[];
};

export type ValidationResult = { ok: true } | { ok: false; message: string };

export class UploadAbortError extends Error {
  constructor() {
    super("Upload cancelled.");
    this.name = "UploadAbortError";
  }
}

export class UploadNetworkError extends Error {
  constructor(message = "Upload failed. Check your connection and try again.") {
    super(message);
    this.name = "UploadNetworkError";
  }
}

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function validateUpload(file: File | null | undefined, options: ValidateOptions): ValidationResult {
  if (!file) {
    return { ok: false, message: "Choose a file to upload." };
  }

  const mime = (file.type || "").toLowerCase();
  const isImage = mime.startsWith("image/");
  const isVideo = mime.startsWith("video/");
  const acceptsImage = options.acceptKinds.includes("image");
  const acceptsVideo = options.acceptKinds.includes("video");

  if (!((isImage && acceptsImage) || (isVideo && acceptsVideo))) {
    if (acceptsImage && acceptsVideo) {
      return { ok: false, message: "Only image and video uploads are allowed." };
    }
    if (acceptsImage) {
      return { ok: false, message: "Only image files are allowed." };
    }
    return { ok: false, message: "Only video files are allowed." };
  }

  if (isImage && (mime === "image/svg+xml" || mime.includes("svg"))) {
    return { ok: false, message: "SVG uploads are not allowed." };
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: `That file is ${formatBytes(file.size)}. Images must be 5 MB or smaller.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return {
      ok: false,
      message: `That file is ${formatBytes(file.size)}. Videos must be 250 MB or smaller.`,
    };
  }

  return { ok: true };
}

export function uploadWithProgress<T = unknown>(
  url: string,
  formData: FormData,
  handlers: UploadHandlers = {},
): Promise<UploadResult<T>> {
  return new Promise<UploadResult<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    handlers.onXhr?.(xhr);

    xhr.open("POST", url, true);

    xhr.upload.onprogress = (event) => {
      if (!handlers.onProgress) return;
      const total = event.lengthComputable && event.total > 0 ? event.total : 0;
      const loaded = event.loaded;
      const percent = total > 0 ? (loaded / total) * 100 : null;
      handlers.onProgress({ loaded, total, percent });
    };

    xhr.onload = () => {
      const status = xhr.status;
      const text = xhr.responseText ?? "";
      if (status >= 200 && status < 300) {
        const data = parseJson<T>(text);
        if (data == null) {
          resolve({ ok: false, status, error: "Upload failed." });
          return;
        }
        resolve({ ok: true, data });
        return;
      }
      const errorBody = parseJson<{ error?: string }>(text);
      resolve({
        ok: false,
        status,
        error: errorBody?.error || `Upload failed (${status}).`,
      });
    };

    xhr.onerror = () => {
      reject(new UploadNetworkError());
    };

    xhr.ontimeout = () => {
      reject(new UploadNetworkError("Upload timed out."));
    };

    xhr.onabort = () => {
      reject(new UploadAbortError());
    };

    xhr.send(formData);
  });
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useToast } from "@/components/admin/Toaster";
import {
  UploadAbortError,
  UploadNetworkError,
  uploadWithProgress,
  validateUpload,
  type UploadProgress,
} from "@/lib/upload-client";
import { formatBytes } from "@/lib/utils";

type UploadResponse = {
  ok?: boolean;
  url?: string;
  error?: string;
  asset?: {
    id: string;
    title: string;
    url: string;
    alt: string;
    folder: string;
    mimeType: string;
    size: number;
  };
};

function detectKind(file: File | null): "image" | "video" | null {
  if (!file) return null;
  const mime = (file.type || "").toLowerCase();
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  return null;
}

function suggestedFolder(kind: "image" | "video" | null): string {
  if (kind === "video") return "video";
  return "site";
}

export function MediaUploadForm() {
  const router = useRouter();
  const { push } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const folderTouched = useRef(false);

  const fileId = useId();
  const altId = useId();
  const folderId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [folder, setFolder] = useState("site");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kind = detectKind(file);

  useEffect(() => {
    if (!file) return;
    if (folderTouched.current) return;
    setFolder(suggestedFolder(kind));
  }, [file, kind]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    setError(null);
    setProgress(null);
    folderTouched.current = false;
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    folderTouched.current = true;
    setFolder(event.target.value);
  };

  const reset = useCallback(() => {
    setFile(null);
    setAlt("");
    folderTouched.current = false;
    setFolder("site");
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);

    const validation = validateUpload(file, { acceptKinds: ["image", "video"] });
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    if (!alt.trim()) {
      setError("Add alt text so editors and screen readers know what this asset is.");
      return;
    }

    const trimmedFolder = folder.trim() || (kind === "video" ? "video" : "site");

    const body = new FormData();
    body.set("file", file as File);
    body.set("alt", alt.trim());
    body.set("folder", trimmedFolder);
    body.set("responseFormat", "json");

    setSubmitting(true);
    setProgress({ loaded: 0, total: file ? file.size : 0, percent: 0 });

    try {
      const result = await uploadWithProgress<UploadResponse>("/api/admin/media", body, {
        onProgress: (next) => setProgress(next),
        onXhr: (xhr) => {
          xhrRef.current = xhr;
        },
      });

      if (!result.ok) {
        setError(result.error);
        push({ message: result.error, variant: "error" });
        return;
      }

      const data = result.data;
      if (!data.url) {
        const message = data.error || "Upload did not return a URL.";
        setError(message);
        push({ message, variant: "error" });
        return;
      }

      push({
        message: `Uploaded ${data.asset?.title || "asset"}.`,
        variant: "success",
      });
      reset();
      router.refresh();
    } catch (err) {
      if (err instanceof UploadAbortError) {
        setError("Upload cancelled.");
        return;
      }
      const message = err instanceof UploadNetworkError ? err.message : "Upload failed.";
      setError(message);
      push({ message, variant: "error" });
    } finally {
      xhrRef.current = null;
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    xhrRef.current?.abort();
  };

  const sizeLabel = file ? formatBytes(file.size) : null;
  const percent = progress?.percent != null ? Math.min(100, Math.max(0, Math.round(progress.percent))) : null;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <label
        htmlFor={fileId}
        className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"
      >
        File
        <input
          ref={fileInputRef}
          id={fileId}
          type="file"
          accept="image/*,video/*"
          required
          disabled={submitting}
          onChange={handleFileChange}
          className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 file:mr-4 file:rounded-full file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-stone-700 hover:file:bg-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {file && (
          <span className="text-[11px] font-normal normal-case tracking-normal text-stone-500">
            {file.name}
            {sizeLabel ? ` · ${sizeLabel}` : ""}
            {kind ? ` · ${kind}` : ""}
          </span>
        )}
      </label>

      <label
        htmlFor={altId}
        className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"
      >
        Alt text
        <input
          id={altId}
          name="alt"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          required
          disabled={submitting}
          placeholder={kind === "video" ? "Describe the video for accessibility" : "Describe the image"}
          className="rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold-deep)] disabled:cursor-not-allowed disabled:bg-stone-100"
        />
      </label>

      <label
        htmlFor={folderId}
        className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"
      >
        Folder
        <input
          id={folderId}
          name="folder"
          value={folder}
          onChange={handleFolderChange}
          disabled={submitting}
          className="rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold-deep)] disabled:cursor-not-allowed disabled:bg-stone-100"
        />
        <span className="text-[11px] font-normal normal-case tracking-normal text-stone-500">
          Stored under <code className="text-[var(--gold-deep)]">public/uploads/{folder || "general"}/</code>.
          Videos default to <code className="text-[var(--gold-deep)]">video</code>.
        </span>
      </label>

      {progress && submitting && (
        <div className="grid gap-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-[var(--ink)] transition-[width]"
              style={{ width: `${percent ?? 25}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">
            {percent != null ? `${percent}% uploaded` : "Uploading…"}
            {progress.total > 0
              ? ` · ${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}`
              : ""}
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--ink-soft)] disabled:opacity-60"
        >
          {submitting ? "Uploading…" : "Upload"}
        </button>
        {submitting && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-stone-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
          >
            Cancel
          </button>
        )}
        <p className="text-[11px] text-stone-500">
          Images up to 5 MB · Videos up to 250 MB. SVG not allowed.
        </p>
      </div>
    </form>
  );
}

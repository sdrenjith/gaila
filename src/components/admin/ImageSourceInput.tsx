"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  UploadAbortError,
  UploadNetworkError,
  uploadWithProgress,
  validateUpload,
  type UploadProgress,
} from "@/lib/upload-client";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { useMediaLibraryAssets } from "@/components/admin/useMediaLibraryAssets";
import { UploadErrorBanner, UploadProgressBar } from "@/components/admin/UploadStatus";

type ImageSourceMode = "url" | "upload";

type ImageSourceInputProps = {
  label: string;
  /** Name of the form field that will hold the resolved image URL. */
  name: string;
  defaultValue?: string;
  /** Folder hint for the upload endpoint. */
  folder?: string;
  /** Hint text shown under the segmented control. */
  description?: string;
  required?: boolean;
  /** If `false`, the Upload tab is shown as disabled with a tooltip. */
  uploadEnabled?: boolean;
  /** Notify a parent when the resolved URL changes. Optional — pure FormData users can ignore. */
  onChange?: (next: string) => void;
  /** Controlled value — when provided, the input follows this prop instead of only initial defaultValue. */
  value?: string;
};

type UploadApiResponse = { ok?: boolean; url?: string; error?: string };

const urlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    { message: "Enter a valid URL (https://...) or site path (/uploads/...)" },
  );

function detectInitialMode(value: string): ImageSourceMode {
  if (!value) return "url";
  return value.startsWith("/uploads/") ? "upload" : "url";
}

export function ImageSourceInput({
  label,
  name,
  defaultValue = "",
  folder = "general",
  description,
  required = false,
  uploadEnabled = true,
  onChange,
  value: controlledValue,
}: ImageSourceInputProps) {
  const fieldId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [mode, setMode] = useState<ImageSourceMode>(detectInitialMode(defaultValue));
  const [value, setValueState] = useState<string>(controlledValue ?? defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySession, setLibrarySession] = useState(0);
  const mediaLibrary = useMediaLibraryAssets("image");
  const showPreview = useMemo(() => Boolean(value), [value]);

  useEffect(() => {
    if (controlledValue === undefined) {
      return;
    }
    setValueState(controlledValue);
    if (controlledValue) {
      setMode(detectInitialMode(controlledValue));
    }
  }, [controlledValue]);

  useEffect(() => {
    if (controlledValue !== undefined || !defaultValue) {
      return;
    }
    setValueState(defaultValue);
    setMode(detectInitialMode(defaultValue));
  }, [controlledValue, defaultValue]);

  const setValue = (next: string) => {
    setValueState(next);
    onChange?.(next);
  };

  const resetProgress = () => {
    setProgress(null);
    setLoaded(0);
    setTotal(0);
  };

  const switchMode = (next: ImageSourceMode) => {
    if (next === mode) return;
    if (next === "upload" && !uploadEnabled) return;
    setMode(next);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openLibrary = () => {
    setError(null);
    setLibrarySession((current) => current + 1);
    void mediaLibrary.reload();
    setLibraryOpen(true);
  };

  const handleLibrarySelect = (next: string) => {
    setValue(next);
    setMode(detectInitialMode(next));
  };

  const handleUrlChange = (next: string) => {
    setValue(next);
    if (!next) {
      setError(null);
      return;
    }
    const parsed = urlSchema.safeParse(next);
    setError(parsed.success ? null : parsed.error.issues[0]?.message || "Invalid URL");
  };

  const handleClear = () => {
    setValue("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    xhrRef.current?.abort();
  };

  const handleUpload = async (file: File) => {
    setError(null);
    resetProgress();

    const validation = validateUpload(file, { acceptKinds: ["image"] });
    if (!validation.ok) {
      setError(validation.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const body = new FormData();
    body.set("file", file);
    body.set("folder", folder);
    body.set("alt", "");
    body.set("responseFormat", "json");

    setUploading(true);
    setProgress(null);

    try {
      const result = await uploadWithProgress<UploadApiResponse>("/api/admin/media", body, {
        onXhr: (xhr) => {
          xhrRef.current = xhr;
        },
        onProgress: (p: UploadProgress) => {
          setLoaded(p.loaded);
          setTotal(p.total);
          setProgress(p.percent);
        },
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!result.data.url) {
        setError(result.data.error || "Upload did not return a URL.");
        return;
      }
      setValue(result.data.url);
    } catch (err) {
      if (err instanceof UploadAbortError) {
        setError("Upload cancelled.");
      } else if (err instanceof UploadNetworkError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    } finally {
      xhrRef.current = null;
      setUploading(false);
      resetProgress();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const segmentBase =
    "min-w-0 flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-amber-500";

  return (
    <div className="grid min-w-0 gap-3 text-sm text-stone-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={fieldId} className="font-medium text-stone-700">
          {label}
        </label>
        <div
          role="tablist"
          aria-label={`${label} source`}
          className="inline-flex w-full flex-wrap rounded-full border border-stone-300 bg-stone-100 p-1 sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "url"}
            aria-controls={`${fieldId}-url-panel`}
            onClick={() => switchMode("url")}
            className={`${segmentBase} ${
              mode === "url" ? "bg-white text-stone-950 shadow-sm" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            URL
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "upload"}
            aria-controls={`${fieldId}-upload-panel`}
            onClick={() => switchMode("upload")}
            disabled={!uploadEnabled}
            title={uploadEnabled ? undefined : "Configure media storage to enable uploads"}
            className={`${segmentBase} ${
              !uploadEnabled
                ? "cursor-not-allowed text-stone-400"
                : mode === "upload"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={libraryOpen}
            onClick={openLibrary}
            className={`${segmentBase} text-stone-500 hover:text-stone-900`}
          >
            Library
          </button>
        </div>
      </div>

      <input type="hidden" name={name} value={value} required={required} aria-hidden="true" />

      {mode === "url" ? (
        <div id={`${fieldId}-url-panel`} role="tabpanel">
          <input
            id={fieldId}
            type="url"
            inputMode="url"
            placeholder="https://images.example.com/photo.jpg"
            value={value}
            onChange={(event) => handleUrlChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-desc` : undefined}
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none focus:border-amber-500"
          />
        </div>
      ) : (
        <div id={`${fieldId}-upload-panel`} role="tabpanel" className="grid gap-2">
          <input
            id={fieldId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={uploading || !uploadEnabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
            }}
            aria-describedby={description ? `${fieldId}-desc` : undefined}
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-stone-700 hover:file:bg-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {uploading && !error && (
            <UploadProgressBar
              uploading={uploading}
              progress={progress}
              loaded={loaded}
              total={total}
              onCancel={handleCancel}
            />
          )}
          {!uploadEnabled && (
            <p className="text-xs text-amber-700">
              Upload is disabled. Configure media storage to enable file uploads.
            </p>
          )}
        </div>
      )}

      <MediaLibraryModal
        key={librarySession}
        open={libraryOpen}
        kind="image"
        title="Choose image"
        folder={folder}
        uploadEnabled={uploadEnabled}
        initialSelectedUrl={value}
        assets={mediaLibrary.assets}
        loading={mediaLibrary.loading}
        loadError={mediaLibrary.loadError}
        onReload={() => void mediaLibrary.reload()}
        onDismissLoadError={mediaLibrary.dismissLoadError}
        onSelect={handleLibrarySelect}
        onClose={() => setLibraryOpen(false)}
      />

      {description && !error && (
        <p id={`${fieldId}-desc`} className="text-xs text-stone-500">
          {description}
        </p>
      )}
      {error && <UploadErrorBanner message={error} onDismiss={() => setError(null)} />}

      {showPreview && (
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 sm:flex-row sm:items-center">
          <div className="relative aspect-[7/5] w-full max-w-xs overflow-hidden rounded-xl bg-stone-100 sm:h-20 sm:w-28 sm:max-w-none sm:shrink-0 sm:aspect-auto">
            <Image
              src={value}
              alt={`${label} preview`}
              fill
              sizes="112px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="break-all text-xs text-stone-500" title={value}>
              {value}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

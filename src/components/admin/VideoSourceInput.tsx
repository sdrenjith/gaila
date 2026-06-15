"use client";

import { useId, useMemo, useRef, useState } from "react";
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

type VideoSourceMode = "url" | "upload";

type VideoSourceInputProps = {
  label: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  description?: string;
  required?: boolean;
  uploadEnabled?: boolean;
  onChange?: (next: string) => void;
};

type UploadApiResponse = { ok?: boolean; url?: string; error?: string };

const urlSchema = z.string().trim().url({ message: "Enter a valid video URL (https://…/clip.mp4)" });

function detectInitialMode(value: string): VideoSourceMode {
  if (!value) return "url";
  return value.startsWith("/uploads/") ? "upload" : "url";
}

export function VideoSourceInput({
  label,
  name,
  defaultValue = "",
  folder = "video",
  description,
  required = false,
  uploadEnabled = true,
  onChange,
}: VideoSourceInputProps) {
  const fieldId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [mode, setMode] = useState<VideoSourceMode>(detectInitialMode(defaultValue));
  const [value, setValueState] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySession, setLibrarySession] = useState(0);
  const mediaLibrary = useMediaLibraryAssets("video");
  const showPreview = useMemo(() => Boolean(value), [value]);

  const setValue = (next: string) => {
    setValueState(next);
    onChange?.(next);
  };

  const resetProgress = () => {
    setProgress(null);
    setLoaded(0);
    setTotal(0);
  };

  const switchMode = (next: VideoSourceMode) => {
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

    const validation = validateUpload(file, { acceptKinds: ["video"] });
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
        <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
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
            onClick={() => switchMode("upload")}
            disabled={!uploadEnabled}
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
        <input
          id={fieldId}
          type="url"
          inputMode="url"
          placeholder="https://videos.example.com/clip.mp4"
          value={value}
          onChange={(event) => handleUrlChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-950 outline-none focus:border-[var(--gold-deep)] focus:ring-2 focus:ring-[var(--gold-light)]/40"
        />
      ) : (
        <input
          id={fieldId}
          ref={fileInputRef}
          type="file"
          accept="video/*"
          disabled={uploading || !uploadEnabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-950 file:mr-4 file:rounded-full file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-stone-700 hover:file:bg-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
        />
      )}

      <MediaLibraryModal
        key={librarySession}
        open={libraryOpen}
        kind="video"
        title="Choose video"
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

      {uploading && !error && (
        <UploadProgressBar
          uploading={uploading}
          progress={progress}
          loaded={loaded}
          total={total}
          onCancel={handleCancel}
        />
      )}
      {description && !error && <p className="text-xs text-stone-500">{description}</p>}
      {error && <UploadErrorBanner message={error} onDismiss={() => setError(null)} />}

      {showPreview && (
        <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:flex-row sm:items-center">
          <video
            src={value}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full max-w-sm rounded-lg bg-black object-cover sm:h-24 sm:w-40 sm:max-w-none sm:shrink-0 sm:aspect-auto"
          />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="break-all text-xs text-stone-500" title={value}>
              {value}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

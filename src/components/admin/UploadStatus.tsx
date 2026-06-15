"use client";

import { formatBytes } from "@/lib/utils";

type UploadProgressBarProps = {
  uploading: boolean;
  progress: number | null;
  loaded: number;
  total: number;
  onCancel?: () => void;
};

export function UploadProgressBar({
  uploading,
  progress,
  loaded,
  total,
  onCancel,
}: UploadProgressBarProps) {
  if (!uploading) return null;

  const determinate = progress != null;
  const percentLabel = determinate ? `${Math.round(progress!)}%` : "";

  return (
    <div className="grid gap-1.5" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
        <span>
          Uploading…{determinate ? ` ${percentLabel}` : ""}
        </span>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="tabular-nums">
              {formatBytes(loaded)} / {formatBytes(total)}
            </span>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(progress!) : undefined}
        className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200"
      >
        {determinate ? (
          <div
            className="h-full rounded-full bg-[var(--gold)] transition-[width] duration-150 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress!))}%` }}
          />
        ) : (
          <div className="upload-indeterminate-bar h-full w-2/5 rounded-full bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-deep)]" />
        )}
      </div>
    </div>
  );
}

type UploadErrorBannerProps = {
  message: string;
  onDismiss: () => void;
};

export function UploadErrorBanner({ message, onDismiss }: UploadErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
      >
        !
      </span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-xs font-semibold text-red-700 hover:text-red-900"
      >
        Dismiss
      </button>
    </div>
  );
}

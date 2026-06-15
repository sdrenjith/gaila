"use client";

import { useCallback, useState } from "react";
import type { MediaLibraryAsset } from "@/components/admin/MediaLibraryModal";

type MediaKind = "image" | "video";

type MediaLibraryResponse = {
  ok?: boolean;
  error?: string;
  assets?: MediaLibraryAsset[];
};

function filterAssets(assets: MediaLibraryAsset[], kind: MediaKind): MediaLibraryAsset[] {
  const prefix = kind === "video" ? "video/" : "image/";
  return assets.filter((asset) => asset.mimeType.toLowerCase().startsWith(prefix));
}

export function useMediaLibraryAssets(kind: MediaKind) {
  const [assets, setAssets] = useState<MediaLibraryAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/media", { method: "GET" });
      const payload = (await response.json()) as MediaLibraryResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Could not load media.");
      }
      setAssets(filterAssets(payload.assets || [], kind));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  return { assets, loading, loadError, reload, dismissLoadError: () => setLoadError(null) };
}

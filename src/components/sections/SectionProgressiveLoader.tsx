"use client";

import { useEffect } from "react";
import type { SectionMediaAsset } from "@/lib/section-assets";
import { enqueueSectionAssets, startProgressiveMediaLoader } from "@/lib/progressive-media-loader";

type Props = {
  assets: SectionMediaAsset[];
};

/**
 * Invisible client helper that preloads below-fold section media in document
 * order after the hero has started and the page is idle — without blocking LCP.
 */
export function SectionProgressiveLoader({ assets }: Props) {
  useEffect(() => {
    if (!assets.length) return;
    enqueueSectionAssets(assets);
    void startProgressiveMediaLoader();
  }, [assets]);

  return null;
}

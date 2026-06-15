"use client";

import type { SectionMediaAsset } from "@/lib/section-assets";

const HERO_MEDIA_STARTED = "gaila:hero-media-started";
const IMAGE_CONCURRENCY = 3;
const VIDEO_METADATA_TIMEOUT_MS = 45_000;
const VIDEO_BUFFER_TIMEOUT_MS = 120_000;

type VideoPrefetchMode = "metadata" | "auto";

const prefetchedUrls = new Set<string>();
const heroManagedUrls = new Set<string>();
const prefetchListeners = new Set<(url: string) => void>();
let queue: SectionMediaAsset[] = [];
let running = false;
let started = false;
let currentSectionIndex = -1;

export function registerHeroMediaUrl(url: string) {
  if (url) heroManagedUrls.add(url);
}

export function isMediaPrefetched(url: string) {
  return prefetchedUrls.has(url);
}

export function onMediaPrefetched(callback: (url: string) => void) {
  prefetchListeners.add(callback);
  return () => {
    prefetchListeners.delete(callback);
  };
}

function markPrefetched(url: string) {
  prefetchedUrls.add(url);
  for (const listener of prefetchListeners) {
    listener(url);
  }
}

export function notifyHeroMediaStarted(url: string) {
  if (typeof window === "undefined") return;
  registerHeroMediaUrl(url);
  window.dispatchEvent(new CustomEvent(HERO_MEDIA_STARTED, { detail: { url } }));
}

function waitForHeroOrTimeout(timeoutMs: number): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener(HERO_MEDIA_STARTED, onHero);
      resolve();
    };

    const onHero = () => finish();
    window.addEventListener(HERO_MEDIA_STARTED, onHero, { once: true });
    window.setTimeout(finish, timeoutMs);
  });
}

function waitForPageLoad(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function prefetchImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.decoding = "async";
    img.fetchPriority = "low";
    img.src = url;
  });
}

function prefetchVideo(url: string, mode: VideoPrefetchMode): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = mode;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.style.cssText =
      "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;clip:rect(0,0,0,0)";

    const timeoutMs = mode === "auto" ? VIDEO_BUFFER_TIMEOUT_MS : VIDEO_METADATA_TIMEOUT_MS;
    let timeoutId = 0;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("error", onReady);
      video.removeAttribute("src");
      video.load();
      video.remove();
      resolve();
    };

    const onReady = () => cleanup();
    timeoutId = window.setTimeout(cleanup, timeoutMs);

    video.addEventListener("loadedmetadata", onReady, { once: true });
    if (mode === "auto") {
      video.addEventListener("canplaythrough", onReady, { once: true });
    }
    video.addEventListener("error", onReady, { once: true });

    document.body.appendChild(video);
    video.src = url;
    video.load();
  });
}

async function prefetchAsset(asset: SectionMediaAsset, isLastInSection: boolean) {
  if (prefetchedUrls.has(asset.url) || heroManagedUrls.has(asset.url)) {
    markPrefetched(asset.url);
    return;
  }

  if (asset.kind === "image") {
    await prefetchImage(asset.url);
  } else {
    const mode: VideoPrefetchMode = isLastInSection ? "auto" : "metadata";
    await prefetchVideo(asset.url, mode);
  }

  markPrefetched(asset.url);
}

async function runQueue() {
  if (running || queue.length === 0) return;
  running = true;

  const bySection = new Map<number, SectionMediaAsset[]>();
  for (const asset of queue) {
    const bucket = bySection.get(asset.sectionIndex) ?? [];
    bucket.push(asset);
    bySection.set(asset.sectionIndex, bucket);
  }

  const sectionIndices = [...bySection.keys()].sort((a, b) => a - b);

  for (const sectionIndex of sectionIndices) {
    if (sectionIndex <= 0) continue;
    currentSectionIndex = sectionIndex;
    const sectionAssets = bySection.get(sectionIndex) ?? [];
    const images = sectionAssets.filter((asset) => asset.kind === "image");
    const videos = sectionAssets.filter((asset) => asset.kind === "video");

    for (let i = 0; i < images.length; i += IMAGE_CONCURRENCY) {
      const batch = images.slice(i, i + IMAGE_CONCURRENCY);
      await Promise.all(batch.map((asset) => prefetchAsset(asset, false)));
    }

    for (let i = 0; i < videos.length; i++) {
      const asset = videos[i];
      if (!asset) continue;
      const isLast = i === videos.length - 1;
      await prefetchAsset(asset, isLast);
    }
  }

  running = false;
  queue = [];
}

export function enqueueSectionAssets(assets: SectionMediaAsset[]) {
  const incoming = assets.filter((asset) => asset.sectionIndex > 0);
  if (incoming.length === 0) return;

  const seen = new Set([...prefetchedUrls, ...heroManagedUrls]);
  for (const asset of incoming) {
    if (seen.has(asset.url)) continue;
    seen.add(asset.url);
    queue.push(asset);
  }

  queue.sort((a, b) => a.sectionIndex - b.sectionIndex);
}

export async function startProgressiveMediaLoader() {
  if (started) return;
  started = true;

  await waitForPageLoad();

  if (typeof window.requestIdleCallback === "function") {
    await new Promise<void>((resolve) => {
      window.requestIdleCallback(() => resolve(), { timeout: 1500 });
    });
  }

  await waitForHeroOrTimeout(2500);
  await runQueue();
}

export function getProgressiveLoaderSectionIndex() {
  return currentSectionIndex;
}

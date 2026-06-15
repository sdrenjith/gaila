import { AMBIENT_VIDEOS } from "@/components/sections/ambient-videos";
import { getContent } from "@/lib/cms";
import {
  getCategoryEditorialItems,
  resolveCaseStudyGridCategorySlug,
} from "@/lib/section-category-source";
import type { PageSection, SiteSettingsRecord } from "@/types/cms";

export type SectionMediaAsset = {
  url: string;
  kind: "image" | "video";
  sectionIndex: number;
  sectionId: string;
};

type StringRecord = Record<string, unknown>;

function sectionSettings(section: PageSection): StringRecord {
  return (section.settings && typeof section.settings === "object" ? section.settings : {}) as StringRecord;
}

function getString(settings: StringRecord | undefined, key: string, fallback = "") {
  const source = settings ?? {};
  const value = source[key];
  return typeof value === "string" ? value.trim() : fallback;
}

function getNumber(settings: StringRecord | undefined, key: string, fallback = 0) {
  const source = settings ?? {};
  const value = source[key];
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function getArray<T>(settings: StringRecord | undefined, key: string): T[] {
  const source = settings ?? {};
  const value = source[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

function pushImage(assets: SectionMediaAsset[], url: string, sectionIndex: number, sectionId: string) {
  if (url) {
    assets.push({ url, kind: "image", sectionIndex, sectionId });
  }
}

function pushVideo(assets: SectionMediaAsset[], url: string, sectionIndex: number, sectionId: string) {
  if (url) {
    assets.push({ url, kind: "video", sectionIndex, sectionId });
  }
}

/** Resolve preloadable media for a single section (mirrors section component defaults). */
export async function collectSectionMediaAssets(
  section: PageSection,
  sectionIndex: number,
  _siteSettings: SiteSettingsRecord | null,
): Promise<SectionMediaAsset[]> {
  const settings = sectionSettings(section);
  const assets: SectionMediaAsset[] = [];
  const { id: sectionId } = section;

  switch (section.type) {
    case "heroEditorial":
    case "heroSlider":
      // Hero manages its own video via requestIdleCallback; poster is preloaded in page metadata.
      break;

    case "ctaBanner": {
      const variantRaw = getString(settings, "variant", "dark");
      const isDark = variantRaw !== "light";
      const background = getString(settings, "background", "");
      const videoBackground = getString(settings, "videoBackground", "");
      if (videoBackground) {
        pushVideo(assets, videoBackground, sectionIndex, sectionId);
      } else if (isDark && !background) {
        pushVideo(assets, AMBIENT_VIDEOS.motionClip, sectionIndex, sectionId);
      } else if (background) {
        pushImage(assets, background, sectionIndex, sectionId);
      }
      break;
    }

    case "quote": {
      const image = getString(settings, "image", "");
      const videoBackground = getString(settings, "videoBackground", "");
      if (videoBackground) {
        pushVideo(assets, videoBackground, sectionIndex, sectionId);
      } else if (!image) {
        pushVideo(assets, AMBIENT_VIDEOS.editorialLoop, sectionIndex, sectionId);
      } else {
        pushImage(assets, image, sectionIndex, sectionId);
      }
      break;
    }

    case "imageText":
    case "logoCloud":
      pushImage(assets, getString(settings, "image", ""), sectionIndex, sectionId);
      break;

    case "gallery": {
      for (const item of getArray<{ image?: string }>(settings, "items")) {
        pushImage(assets, item.image?.trim() ?? "", sectionIndex, sectionId);
      }
      break;
    }

    case "servicesEditorial": {
      const limit = getNumber(settings, "limit", 6) || 6;
      const services = (await getContent("service", true)).slice(0, limit);
      for (const service of services) {
        pushImage(assets, service.coverImage ?? "", sectionIndex, sectionId);
      }
      break;
    }

    case "serviceGrid": {
      const services = await getContent("service", true);
      for (const service of services) {
        pushImage(assets, service.coverImage ?? "", sectionIndex, sectionId);
      }
      break;
    }

    case "caseStudyGrid": {
      const categorySlug = resolveCaseStudyGridCategorySlug(settings);
      const limit = getNumber(settings, "limit", 0);
      const { items } = await getCategoryEditorialItems(categorySlug, {
        limit,
        publishedOnly: true,
      });
      for (const item of items) {
        pushImage(assets, item.coverImage ?? "", sectionIndex, sectionId);
      }
      break;
    }

    default:
      break;
  }

  return assets;
}

/** Collect section media in document order, deduped by URL (first section wins). */
export async function collectPageSectionAssets(
  sections: PageSection[],
  siteSettings: SiteSettingsRecord | null,
): Promise<SectionMediaAsset[]> {
  const enabled = sections.filter((section) => section.enabled);
  const nested = await Promise.all(
    enabled.map((section, sectionIndex) =>
      collectSectionMediaAssets(section, sectionIndex, siteSettings),
    ),
  );

  const seen = new Set<string>();
  const ordered: SectionMediaAsset[] = [];

  for (const sectionAssets of nested) {
    for (const asset of sectionAssets) {
      if (seen.has(asset.url)) continue;
      seen.add(asset.url);
      ordered.push(asset);
    }
  }

  return ordered;
}

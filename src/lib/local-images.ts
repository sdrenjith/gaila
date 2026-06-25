/** Local Gaila event photography — organized from bulk upload (public/uploads/gaila). */
export const LOCAL_IMAGES = {
  weddings: [
    "/uploads/weddings/25-10-2024-19-32-12-014.jpg",
    "/uploads/weddings/celebration-hall-with-full-guests-012.jpg",
    "/uploads/weddings/dsc01191-002.jpg",
    "/uploads/weddings/dsc01205-003.jpg",
    "/uploads/weddings/dsc01377-004.jpg",
    "/uploads/weddings/dsc01564-005.jpg",
    "/uploads/weddings/dsc01612-006.jpg",
    "/uploads/weddings/dsc02472-007.jpg",
    "/uploads/weddings/dsc06598-1-008.jpg",
    "/uploads/weddings/dsc07507-009.jpg",
    "/uploads/weddings/dsc08458-001.jpg",
    "/uploads/weddings/dsc08592-010.jpg",
    "/uploads/weddings/dsc09459-enhanced-011.jpg",
    "/uploads/weddings/top-view-decorated-with-minimal-floral-bouquets--013.jpg",
  ],
  events: [
    "/uploads/events/dsc01193-002.jpg",
    "/uploads/events/dsc01245-003.jpg",
    "/uploads/events/dsc01458-1-004.jpg",
    "/uploads/events/dsc01570-005.jpg",
    "/uploads/events/dsc01645-006.jpg",
    "/uploads/events/dsc02856-007.jpg",
    "/uploads/events/dsc06598-008.jpg",
    "/uploads/events/dsc07585-009.jpg",
    "/uploads/events/dsc08459-001.jpg",
    "/uploads/events/dsc08594-010.jpg",
    "/uploads/events/zhs-8550-011.jpg",
  ],
  corporate: [
    "/uploads/corporate/11-04-2025-01-18-46-2-012.jpg",
    "/uploads/corporate/dsc01196-002.jpg",
    "/uploads/corporate/dsc01274-003.jpg",
    "/uploads/corporate/dsc01458-004.jpg",
    "/uploads/corporate/dsc01576-005.jpg",
    "/uploads/corporate/dsc01661-006.jpg",
    "/uploads/corporate/dsc03339-1-007.jpg",
    "/uploads/corporate/dsc06609-008.jpg",
    "/uploads/corporate/dsc08070-1-009.jpg",
    "/uploads/corporate/dsc08461-001.jpg",
    "/uploads/corporate/dsc08601-010.jpg",
    "/uploads/corporate/zhs-8557-011.jpg",
  ],
  gallery: [
    "/uploads/gallery/11-04-2025-01-18-46-4-013.jpg",
    "/uploads/gallery/dsc01174-002.jpg",
    "/uploads/gallery/dsc01198-003.jpg",
    "/uploads/gallery/dsc01291-004.jpg",
    "/uploads/gallery/dsc01526-005.jpg",
    "/uploads/gallery/dsc01580-1-006.jpg",
    "/uploads/gallery/dsc02465-007.jpg",
    "/uploads/gallery/dsc06586-008.jpg",
    "/uploads/gallery/dsc07111-009.jpg",
    "/uploads/gallery/dsc08076-010.jpg",
    "/uploads/gallery/dsc08464-001.jpg",
    "/uploads/gallery/dsc08658-011.jpg",
    "/uploads/gallery/zhs-9260-enhanced-012.jpg",
  ],
  content: [
    "/uploads/content/banner1-016.jpg",
    "/uploads/content/banner2-001.jpg",
    "/uploads/content/banner3-002.jpg",
    "/uploads/content/25-10-2024-19-14-08-017.jpg",
    "/uploads/content/dsc01190-006.jpg",
    "/uploads/content/dsc01202-007.jpg",
    "/uploads/content/dsc01368-008.jpg",
    "/uploads/content/dsc01555-009.jpg",
    "/uploads/content/dsc01588-010.jpg",
    "/uploads/content/dsc06589-012.jpg",
    "/uploads/content/dsc07418-013.jpg",
    "/uploads/content/dsc08584-enhanced-014.jpg",
    "/uploads/content/dsc08778-enhanced-015.jpg",
  ],
  desserts: [
    "/uploads/desserts/25-10-2024-18-56-37-1-012.jpg",
    "/uploads/desserts/dsc01188-001.jpg",
    "/uploads/desserts/dsc01200-002.jpg",
    "/uploads/desserts/dsc01367-003.jpg",
    "/uploads/desserts/dsc01550-004.jpg",
    "/uploads/desserts/dsc01580-005.jpg",
    "/uploads/desserts/dsc02467-006.jpg",
    "/uploads/desserts/dsc06587-007.jpg",
    "/uploads/desserts/dsc07387-008.jpg",
    "/uploads/desserts/dsc08222-009.jpg",
    "/uploads/desserts/dsc08661-enhanced-010.jpg",
    "/uploads/desserts/zhs-9265-enhanced-011.jpg",
  ],
} as const;

/** Curated picks for CMS defaults — replaces former Unsplash URLs. */
export const IMG = {
  heroDubai: LOCAL_IMAGES.content[0],
  studioTeam: LOCAL_IMAGES.content[4],
  corporate: LOCAL_IMAGES.corporate[0],
  conference: LOCAL_IMAGES.corporate[3],
  wedding: LOCAL_IMAGES.weddings[1],
  decor: LOCAL_IMAGES.weddings[13],
  production: LOCAL_IMAGES.events[5],
  gala: LOCAL_IMAGES.corporate[7],
  summit: LOCAL_IMAGES.corporate[10],
  yacht: LOCAL_IMAGES.events[10],
  cafe: LOCAL_IMAGES.desserts[0],
  flowers: LOCAL_IMAGES.weddings[12],
  hospitality: LOCAL_IMAGES.weddings[0],
  venue: LOCAL_IMAGES.weddings[1],
  experiential: LOCAL_IMAGES.events[8],
  featuredEvent: LOCAL_IMAGES.weddings[1],
  babyDecor: LOCAL_IMAGES.events[2],
  graduation: LOCAL_IMAGES.events[4],
  dessert: LOCAL_IMAGES.desserts[4],
  heroBackgrounds: [
    LOCAL_IMAGES.content[0],
    LOCAL_IMAGES.weddings[1],
    LOCAL_IMAGES.corporate[0],
    LOCAL_IMAGES.events[5],
    LOCAL_IMAGES.desserts[4],
    LOCAL_IMAGES.gallery[11],
  ],
  galleryHighlights: [
    ...LOCAL_IMAGES.weddings.slice(0, 2),
    ...LOCAL_IMAGES.events.slice(0, 2),
    ...LOCAL_IMAGES.corporate.slice(0, 2),
    ...LOCAL_IMAGES.desserts.slice(0, 2),
    ...LOCAL_IMAGES.gallery.slice(0, 2),
  ],
} as const;

export type SliderImageItem = { image: string; alt: string; caption?: string };

export function buildGalleryItems(
  images: readonly string[],
  altPrefix: string,
): SliderImageItem[] {
  return images.map((image, index) => ({
    image,
    alt: `${altPrefix} ${index + 1}`,
    caption: altPrefix,
  }));
}

export type GalleryCategorySlug = keyof typeof LOCAL_IMAGES;

export type GalleryCategoryItem = {
  slug: GalleryCategorySlug;
  label: string;
  items: SliderImageItem[];
};

export const GALLERY_CATEGORY_DEFS: ReadonlyArray<{
  slug: GalleryCategorySlug;
  label: string;
}> = [
  { slug: "weddings", label: "Weddings" },
  { slug: "events", label: "Events" },
  { slug: "corporate", label: "Corporate" },
  { slug: "gallery", label: "Gallery" },
  { slug: "content", label: "Content" },
  { slug: "desserts", label: "Desserts" },
];

export function buildDefaultGalleryCategories(): GalleryCategoryItem[] {
  return GALLERY_CATEGORY_DEFS.map(({ slug, label }) => ({
    slug,
    label,
    items: buildGalleryItems(LOCAL_IMAGES[slug], label),
  }));
}

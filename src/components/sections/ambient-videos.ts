/**
 * Ambient video assets shipped from `public/uploads/video/`.
 *
 * Single source of truth for cinematic background videos used across the
 * public site (hero + editorial sections). Editors can still override per
 * section via `settings.videoBackground` once that field is wired through
 * `default-content.ts` — these constants are component-level defaults.
 *
 * Sizes (approx, for ordering by bandwidth cost):
 *   - homeHero:       273 MB  (curated brand reel — only ever the hero)
 *   - motionClip:      12 MB  (1080p; cheapest, default for ambient bands)
 *   - editorialLoop:   22 MB  (4K, short loop)
 *   - brandAmbient:   103 MB  (4K mid-length)
 *   - cinematicWide:  328 MB  (4K long-form; opt-in only)
 */
export const AMBIENT_VIDEOS = {
  homeHero: "/uploads/video/home-hero.mp4",
  motionClip: "/uploads/video/motion-clip.mp4",
  editorialLoop: "/uploads/video/editorial-loop.mp4",
  brandAmbient: "/uploads/video/brand-ambient.mp4",
  cinematicWide: "/uploads/video/cinematic-wide.mp4",
} as const;

export type AmbientVideoKey = keyof typeof AMBIENT_VIDEOS;

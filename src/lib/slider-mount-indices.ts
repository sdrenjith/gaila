/** Indices to mount for a carousel: active slide plus immediate neighbors. */
export function sliderMountIndices(activeIndex: number, total: number): number[] {
  if (total <= 0) return [];
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const prev = (activeIndex - 1 + total) % total;
  const next = (activeIndex + 1) % total;
  return [prev, activeIndex, next];
}

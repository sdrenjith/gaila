/**
 * Run `callback` after the browser is idle so critical paint (LCP poster, text)
 * is not competing with heavy media downloads on first load.
 */
export function deferUntilIdle(callback: () => void, timeoutMs = 1200): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(callback, 0);
  return () => globalThis.clearTimeout(id);
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mount expensive media only after the element first enters (or nears) the viewport.
 * `hasEntered` stays true after the first intersection so content is not torn down on scroll-away.
 */
export function useInViewMount<T extends HTMLElement>(rootMargin = "200px 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      setHasEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin, threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView, hasEntered };
}

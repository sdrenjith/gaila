"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Roboto } from "next/font/google";
import type { GoogleReviewRecord } from "@/types/cms";

const robotoAvatar = Roboto({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

/** Google Maps reviewer avatar palette (deterministic by name). */
const GOOGLE_AVATAR_COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#607D8B",
] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function avatarColor(name: string): string {
  const index = hashString(name.trim().toLowerCase()) % GOOGLE_AVATAR_COLORS.length;
  return GOOGLE_AVATAR_COLORS[index];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ReviewerAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${robotoAvatar.className} grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-medium leading-none tracking-normal text-white`}
      style={{ backgroundColor: avatarColor(name) }}
    >
      {initials(name) || "?"}
    </span>
  );
}

function safeRating(rating: number): number {
  return Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Google"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ReviewCard({ review }: { review: GoogleReviewRecord }) {
  const stars = safeRating(review.rating);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-editorial)] border border-[var(--hairline)] bg-white p-6 shadow-[var(--shadow-card)] transition duration-500 hover:-translate-y-1 hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-card-hover)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
      <header className="flex items-start gap-3">
        <ReviewerAvatar name={review.author} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--ink)]">{review.author}</p>
          <p className="truncate text-xs text-[var(--ink-mute)]">{review.location}</p>
        </div>
        <GoogleIcon className="h-[18px] w-[18px] shrink-0" />
      </header>
      <div className="mt-4 flex items-center gap-1 text-sm leading-none text-[var(--gold)]">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} aria-hidden="true">★</span>
        ))}
        {Array.from({ length: 5 - stars }).map((_, i) => (
          <span key={`empty-${i}`} aria-hidden="true" className="text-[var(--hairline-strong)]">★</span>
        ))}
        <span className="sr-only">{stars} out of 5</span>
      </div>
      <p className="mt-4 line-clamp-5 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
        “{review.review}”
      </p>
      <footer className="mt-5 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-mute)]">
        {review.postedAt}
      </footer>
    </article>
  );
}

export function GoogleReviewsSlider({ reviews }: { reviews: GoogleReviewRecord[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState(1);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const compute = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setPageSize(4);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setPageSize(2);
      } else {
        setPageSize(1);
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));

  const goToPage = useCallback(
    (page: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(page, totalPages - 1));
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    },
    [totalPages],
  );

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    if (next !== activePage) setActivePage(next);
  };

  if (reviews.length === 0) {
    return (
      <p className="rounded-[var(--radius-editorial)] border border-dashed border-[var(--hairline-strong)] bg-white p-8 text-center text-sm text-[var(--ink-mute)]">
        No reviews yet. Add them from the admin panel.
      </p>
    );
  }

  const showControls = totalPages > 1;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-2 flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1"
        aria-roledescription="carousel"
      >
        {reviews.map((review, index) => (
          <div
            key={`${review.author}-${index}`}
            className="w-full shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/4"
            aria-roledescription="slide"
            aria-label={`Review ${index + 1} of ${reviews.length}`}
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {showControls && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const active = i === activePage;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-8 gold-gradient"
                      : "w-3 bg-[var(--hairline-strong)] hover:bg-[var(--ink-mute)]"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage === 0}
              aria-label="Previous reviews"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--hairline-strong)] bg-white text-[var(--ink-soft)] transition hover:border-[var(--gold)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--hairline-strong)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage === totalPages - 1}
              aria-label="Next reviews"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--hairline-strong)] bg-white text-[var(--ink-soft)] transition hover:border-[var(--gold)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--hairline-strong)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

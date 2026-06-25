"use client";

import Image from "next/image";
import { Roboto } from "next/font/google";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { GoogleReviewRecord } from "@/types/cms";

export type ScrollProgressStep = {
  eyebrow?: string;
  title?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
};

type ScrollProgressCircleProps =
  | {
      mode?: "story";
      steps: ScrollProgressStep[];
      reviews?: never;
      scrollHeightVh?: number;
      header?: never;
    }
  | {
      mode: "reviews";
      reviews: GoogleReviewRecord[];
      steps?: never;
      scrollHeightVh?: number;
      header?: {
        eyebrow?: string;
        title?: string;
        subtitle?: string;
      };
    };

const robotoAvatar = Roboto({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

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

const CIRCLE_SIZE = 420;
const STROKE_WIDTH = 5;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const LG_MEDIA_QUERY = "(min-width: 1024px)";
function subscribeToLgMediaQuery(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(LG_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function useIsLgUp() {
  return useSyncExternalStore(
    subscribeToLgMediaQuery,
    () => window.matchMedia(LG_MEDIA_QUERY).matches,
    () => false,
  );
}

/** Compact, fixed travel for reviews so the pinned section releases immediately after the final step. */
const REVIEWS_VH_PER_STEP = { desktop: 12, mobile: 10 } as const;

export function getReviewsScrollTravelVh(
  stepCount: number,
  _scrollHeightVh: number,
  compact: boolean,
): number {
  const vhPerStep = compact ? REVIEWS_VH_PER_STEP.mobile : REVIEWS_VH_PER_STEP.desktop;
  return stepCount * vhPerStep;
}

function getReviewsScrollTravelCss(stepCount: number, scrollHeightVh: number, compact: boolean) {
  const travelVh = getReviewsScrollTravelVh(stepCount, scrollHeightVh, compact);
  return `${travelVh}svh`;
}

function getActiveStepIndex(progress: number, stepCount: number): number {
  if (stepCount < 1) return 0;
  if (progress >= 1) return stepCount - 1;
  return Math.min(stepCount - 1, Math.max(0, Math.floor(progress * stepCount)));
}

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

function safeRating(rating: number): number {
  return Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
}

function useStepOpacity(
  scrollYProgress: MotionValue<number>,
  index: number,
  stepCount: number,
) {
  return useTransform(scrollYProgress, (value) => {
    const segment = 1 / stepCount;
    const start = index * segment;
    const end = (index + 1) * segment;
    const fade = segment * 0.12;

    if (value <= start) return index === 0 ? 1 : 0;
    if (value >= end) return index === stepCount - 1 ? 1 : 0;
    if (value < start + fade) return (value - start) / fade;
    if (value > end - fade) return (end - value) / fade;
    return 1;
  });
}

function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
  const stars = safeRating(rating);
  return (
    <div className={`flex items-center gap-1 text-lg leading-none ${className}`}>
      {Array.from({ length: stars }).map((_, i) => (
        <span key={i} aria-hidden="true" className="text-[var(--gold)]">
          ★
        </span>
      ))}
      {Array.from({ length: 5 - stars }).map((_, i) => (
        <span key={`empty-${i}`} aria-hidden="true" className="text-white/15">
          ★
        </span>
      ))}
      <span className="sr-only">{stars} out of 5</span>
    </div>
  );
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

function StepPanel({
  step,
  scrollYProgress,
  index,
  stepCount,
  isActive,
}: {
  step: ScrollProgressStep;
  scrollYProgress: MotionValue<number>;
  index: number;
  stepCount: number;
  isActive: boolean;
}) {
  const opacity = useStepOpacity(scrollYProgress, index, stepCount);
  const paragraphs = step.body ? step.body.split("\n").filter(Boolean) : [];

  return (
    <motion.div
      style={{ opacity }}
      aria-hidden={!isActive}
      className="absolute inset-0 flex flex-col justify-center"
    >
      {step.eyebrow && (
        <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-[var(--gold-deep)]/50" />
          {step.eyebrow}
        </p>
      )}
      {step.title && (
        <h2 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.06] tracking-[-0.02em] text-[var(--ink)]">
          {step.title}
        </h2>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-5 max-w-xl space-y-4 text-base leading-8 text-[var(--ink-soft)]">
          {paragraphs.map((paragraph, pIndex) => (
            <p key={`${step.title}-${pIndex}`}>{paragraph}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ReviewStepPanel({
  review,
  scrollYProgress,
  index,
  stepCount,
  isActive,
}: {
  review: GoogleReviewRecord;
  scrollYProgress: MotionValue<number>;
  index: number;
  stepCount: number;
  isActive: boolean;
}) {
  const opacity = useStepOpacity(scrollYProgress, index, stepCount);

  return (
    <motion.div
      style={{ opacity }}
      aria-hidden={!isActive}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="mb-4 inline-flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold-deep)] sm:gap-3 sm:text-[11px] sm:tracking-[0.38em]">
        <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-[var(--gold-deep)]/50 sm:w-10" />
        Google review
        <GoogleIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
      </p>
      <StarRating rating={review.rating} className="mb-4 sm:mb-5" />
      <blockquote className="max-w-full font-display text-[clamp(1.05rem,4.5vw,2rem)] leading-[1.45] tracking-[-0.01em] text-pretty break-words text-[var(--ink)] sm:max-w-xl">
        <span aria-hidden="true" className="mr-1 text-[var(--gold)]/70">
          &ldquo;
        </span>
        {review.review}
        <span aria-hidden="true" className="ml-1 text-[var(--gold)]/70">
          &rdquo;
        </span>
      </blockquote>
      <footer className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <cite className="not-italic text-base font-semibold text-[var(--ink)]">{review.author}</cite>
        <span className="text-sm text-[var(--ink-mute)]">{review.location}</span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">{review.postedAt}</span>
      </footer>
    </motion.div>
  );
}

function StepImage({
  step,
  scrollYProgress,
  index,
  stepCount,
  isActive,
  priority,
}: {
  step: ScrollProgressStep;
  scrollYProgress: MotionValue<number>;
  index: number;
  stepCount: number;
  isActive: boolean;
  priority?: boolean;
}) {
  const opacity = useStepOpacity(scrollYProgress, index, stepCount);
  const image = step.image?.trim();
  if (!image) return null;

  return (
    <motion.div
      style={{ opacity }}
      aria-hidden={!isActive}
      className="absolute inset-0 overflow-hidden rounded-full"
    >
      <Image
        src={image}
        alt={step.imageAlt || step.title || "Gaila event styling"}
        fill
        sizes="(max-width: 1024px) 280px, 380px"
        className="object-cover object-center"
        priority={priority}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.22),transparent_55%),linear-gradient(180deg,transparent_55%,rgba(8,0,20,0.55)_100%)]" />
    </motion.div>
  );
}

function ReviewCircleContent({
  review,
  scrollYProgress,
  index,
  stepCount,
  isActive,
}: {
  review: GoogleReviewRecord;
  scrollYProgress: MotionValue<number>;
  index: number;
  stepCount: number;
  isActive: boolean;
}) {
  const opacity = useStepOpacity(scrollYProgress, index, stepCount);
  const name = review.author.trim();

  return (
    <motion.div
      style={{ opacity }}
      aria-hidden={!isActive}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 sm:gap-5 sm:p-8"
    >
      <span
        aria-hidden="true"
        className={`${robotoAvatar.className} grid h-[clamp(5.5rem,18vw,7.5rem)] w-[clamp(5.5rem,18vw,7.5rem)] place-items-center rounded-full text-[clamp(2rem,5vw,2.75rem)] font-medium leading-none tracking-normal text-white shadow-[0_0_40px_rgba(168,85,247,0.35)]`}
        style={{ backgroundColor: avatarColor(name) }}
      >
        {initials(name) || "?"}
      </span>
      <StarRating rating={review.rating} className="text-xl" />
      <p className="max-w-[12rem] truncate text-center text-sm font-medium text-white/70">{name}</p>
    </motion.div>
  );
}

function ProgressRing({ progress }: { progress: MotionValue<number> }) {
  const strokeDashoffset = useTransform(progress, (value) => CIRCUMFERENCE * (1 - value));

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
      className="absolute inset-0 h-full w-full -rotate-90"
    >
      <defs>
        <linearGradient id="scroll-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--event-cyan)" />
          <stop offset="48%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-light)" />
        </linearGradient>
        <filter id="scroll-circle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={STROKE_WIDTH}
      />
      <motion.circle
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="url(#scroll-circle-gradient)"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        style={{ strokeDashoffset }}
        filter="url(#scroll-circle-glow)"
      />
    </svg>
  );
}

function ReducedMotionStoryFallback({ steps }: { steps: ScrollProgressStep[] }) {
  return (
    <section className="relative overflow-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 h-[28rem] w-[28rem] -translate-x-1/3 rounded-full bg-[var(--gold)]/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-[1480px] space-y-16">
        {steps.map((step, index) => {
          const paragraphs = step.body ? step.body.split("\n").filter(Boolean) : [];
          return (
            <article
              key={`${step.title}-${index}`}
              className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16"
            >
              <div>
                {step.eyebrow && (
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                    {step.eyebrow}
                  </p>
                )}
                {step.title && (
                  <h2 className="font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.06] tracking-[-0.02em] text-[var(--ink)]">
                    {step.title}
                  </h2>
                )}
                {paragraphs.length > 0 && (
                  <div className="mt-5 max-w-xl space-y-4 text-base leading-8 text-[var(--ink-soft)]">
                    {paragraphs.map((paragraph, pIndex) => (
                      <p key={`${step.title}-p-${pIndex}`}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
              {step.image && (
                <div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full border border-white/10 bg-[#120529] shadow-[0_0_60px_rgba(168,85,247,0.35)]">
                  <Image
                    src={step.image}
                    alt={step.imageAlt || step.title || "Gaila event styling"}
                    fill
                    sizes="360px"
                    className="object-cover object-center"
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReducedMotionReviewsFallback({
  reviews,
  header,
}: {
  reviews: GoogleReviewRecord[];
  header?: { eyebrow?: string; title?: string; subtitle?: string };
}) {
  return (
    <section className="relative overflow-x-hidden bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 h-[28rem] w-[28rem] -translate-x-1/3 rounded-full bg-[var(--event-cyan)]/10 blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-[1480px]">
        {(header?.eyebrow || header?.title || header?.subtitle) && (
          <header className="mb-14 max-w-full sm:max-w-2xl">
            {header.eyebrow && (
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-wrap break-words text-[var(--gold-deep)] sm:text-[11px] sm:tracking-[0.38em]">
                {header.eyebrow}
              </p>
            )}
            {header.title && (
              <h2 className="font-display text-[clamp(1.5rem,5vw,3.4rem)] leading-[1.06] tracking-[-0.02em] text-wrap break-words text-[var(--ink)]">
                {header.title}
              </h2>
            )}
            {header.subtitle && (
              <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">{header.subtitle}</p>
            )}
          </header>
        )}
        <div className="space-y-14">
          {reviews.map((review, index) => (
            <article
              key={`${review.author}-${index}`}
              className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16"
            >
              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                  Google review
                  <GoogleIcon className="h-3.5 w-3.5 opacity-80" />
                </p>
                <StarRating rating={review.rating} className="mb-5" />
                <blockquote className="max-w-full font-display text-[clamp(1.05rem,4.5vw,1.85rem)] leading-[1.45] text-pretty break-words text-[var(--ink)]">
                  &ldquo;{review.review}&rdquo;
                </blockquote>
                <footer className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <cite className="not-italic text-base font-semibold text-[var(--ink)]">
                    {review.author}
                  </cite>
                  <span className="text-sm text-[var(--ink-mute)]">{review.location}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                    {review.postedAt}
                  </span>
                </footer>
              </div>
              <div className="relative mx-auto flex aspect-square w-full max-w-[min(100%,280px)] flex-col items-center justify-center gap-4 rounded-full border border-white/10 bg-[#120529] shadow-[0_0_60px_rgba(168,85,247,0.35)] sm:max-w-[360px]">
                <span
                  aria-hidden="true"
                  className={`${robotoAvatar.className} grid h-28 w-28 place-items-center rounded-full text-3xl font-medium text-white`}
                  style={{ backgroundColor: avatarColor(review.author) }}
                >
                  {initials(review.author) || "?"}
                </span>
                <StarRating rating={review.rating} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollProgressStory({
  steps,
  scrollHeightVh = 33,
}: {
  steps: ScrollProgressStep[];
  scrollHeightVh?: number;
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const items = useMemo(
    () =>
      steps.filter(
        (step) =>
          (step.title ?? "").trim() ||
          (step.body ?? "").trim() ||
          (step.image ?? "").trim(),
      ),
    [steps],
  );

  const stepCount = items.length;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActiveIndex(getActiveStepIndex(value, stepCount));
  });

  if (stepCount < 1) return null;
  if (reduceMotion) return <ReducedMotionStoryFallback steps={items} />;

  const heightVh = 100 + scrollHeightVh;

  return (
    <section
      ref={containerRef}
      className="relative bg-transparent"
      style={{ height: `${heightVh}vh` }}
      aria-label="Gaila milestone story"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 sm:px-8 lg:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[var(--event-cyan)]/10 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[var(--gold)]/12 blur-[120px]"
        />

        <div className="relative mx-auto grid w-full max-w-[1480px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          <div className="relative min-h-[280px] sm:min-h-[320px] lg:min-h-[380px]">
            {items.map((step, index) => (
              <StepPanel
                key={`${step.title}-${index}`}
                step={step}
                scrollYProgress={scrollYProgress}
                index={index}
                stepCount={stepCount}
                isActive={activeIndex === index}
              />
            ))}

            <div
              aria-hidden="true"
              className="mt-8 flex items-center gap-3 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0"
            >
              {items.map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIndex === index
                      ? "w-10 bg-gradient-to-r from-[var(--event-cyan)] via-[var(--gold)] to-[var(--gold-light)] shadow-[0_0_18px_rgba(168,85,247,0.55)]"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                {String(activeIndex + 1).padStart(2, "0")} / {String(stepCount).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[min(100%,420px)] items-center justify-center">
            <div className="relative aspect-square w-full" style={{ maxWidth: CIRCLE_SIZE }}>
              <div className="absolute inset-[5%] overflow-hidden rounded-full bg-[#120529] ring-1 ring-white/10">
                {items.map((step, index) => (
                  <StepImage
                    key={`${step.image}-${index}`}
                    step={step}
                    scrollYProgress={scrollYProgress}
                    index={index}
                    stepCount={stepCount}
                    isActive={activeIndex === index}
                    priority={index === 0}
                  />
                ))}
              </div>
              <ProgressRing progress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsScrollSection({
  reviews,
  header,
  scrollTravel,
  enableTapNav,
  compact,
}: {
  reviews: GoogleReviewRecord[];
  header?: { eyebrow?: string; title?: string; subtitle?: string };
  scrollTravel: string;
  enableTapNav: boolean;
  compact: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const stepCount = reviews.length;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActiveIndex(getActiveStepIndex(value, stepCount));
  });

  const scrollToReview = (index: number) => {
    const section = containerRef.current;
    if (!section || stepCount < 1) return;

    const segment = 1 / stepCount;
    const progress = Math.min(1, Math.max(0, index * segment + segment * 0.5));
    const scrollDistance = section.offsetHeight - window.innerHeight;
    const top = section.offsetTop + progress * Math.max(0, scrollDistance);

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-x-hidden bg-transparent"
      style={
        {
          "--reviews-scroll-travel": scrollTravel,
          height: "calc(100svh + var(--reviews-scroll-travel))",
        } as CSSProperties
      }
      aria-label="Google reviews"
    >
      <div
        className={`sticky top-0 flex h-[100svh] flex-col overflow-x-hidden px-5 sm:px-8 lg:px-14 ${
          compact
            ? "justify-end pb-3 pt-5 sm:pb-4 sm:pt-6"
            : "justify-start py-8 lg:py-10"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[var(--event-cyan)]/10 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[var(--gold)]/12 blur-[120px]"
        />

        <div
          className={`relative mx-auto w-full max-w-full lg:max-w-[1480px] ${
            compact ? "" : "flex min-h-0 flex-1 flex-col"
          }`}
        >
          {(header?.eyebrow || header?.title || header?.subtitle) && (
            <header className="mb-6 max-w-full sm:mb-8 lg:mb-10 lg:max-w-2xl">
              {header.eyebrow && (
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-wrap break-words text-[var(--gold-deep)] sm:text-[11px] sm:tracking-[0.38em]">
                  {header.eyebrow}
                </p>
              )}
              {header.title && (
                <h2 className="font-display text-[clamp(1.5rem,5vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-wrap break-words text-[var(--ink)]">
                  {header.title}
                </h2>
              )}
              {header.subtitle && (
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base sm:leading-8">
                  {header.subtitle}
                </p>
              )}
            </header>
          )}

          <div className={compact ? undefined : "flex min-h-0 flex-1 flex-col justify-center"}>
            <div
              className={`grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-16 xl:gap-24 ${
                compact ? "items-end" : "items-center"
              }`}
            >
            <div
              className={`relative lg:min-h-0 lg:pb-12 ${
                compact ? "min-h-[9.5rem] sm:min-h-[14rem]" : "min-h-[12rem] sm:min-h-[18rem]"
              }`}
            >
              {reviews.map((review, index) => (
                <ReviewStepPanel
                  key={`${review.author}-${index}`}
                  review={review}
                  scrollYProgress={scrollYProgress}
                  index={index}
                  stepCount={stepCount}
                  isActive={activeIndex === index}
                />
              ))}

              <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0">
                {reviews.map((review, index) =>
                  enableTapNav ? (
                    <button
                      key={`dot-${review.author}-${index}`}
                      type="button"
                      aria-label={`Show review ${index + 1} of ${stepCount}`}
                      aria-current={activeIndex === index ? "true" : undefined}
                      onClick={() => scrollToReview(index)}
                      className={`h-1.5 shrink-0 rounded-full transition-all duration-500 ${
                        activeIndex === index
                          ? "w-8 bg-gradient-to-r from-[var(--event-cyan)] via-[var(--gold)] to-[var(--gold-light)] shadow-[0_0_18px_rgba(168,85,247,0.55)] sm:w-10"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  ) : (
                    <span
                      key={`dot-${index}`}
                      aria-hidden="true"
                      className={`h-1.5 shrink-0 rounded-full transition-all duration-500 ${
                        activeIndex === index
                          ? "w-8 bg-gradient-to-r from-[var(--event-cyan)] via-[var(--gold)] to-[var(--gold-light)] shadow-[0_0_18px_rgba(168,85,247,0.55)] sm:w-10"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  ),
                )}
                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-[10px] sm:tracking-[0.28em]">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(stepCount).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[min(100%,280px)] items-center justify-center sm:max-w-[min(100%,340px)] lg:max-w-[420px]">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-[5%] overflow-hidden rounded-full bg-[#120529] ring-1 ring-white/10 shadow-[0_0_60px_rgba(168,85,247,0.25)]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.18),transparent_60%)]"
                  />
                  {reviews.map((review, index) => (
                    <ReviewCircleContent
                      key={`circle-${review.author}-${index}`}
                      review={review}
                      scrollYProgress={scrollYProgress}
                      index={index}
                      stepCount={stepCount}
                      isActive={activeIndex === index}
                    />
                  ))}
                </div>
                <ProgressRing progress={scrollYProgress} />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollProgressReviews({
  reviews,
  scrollHeightVh = 0,
  header,
}: {
  reviews: GoogleReviewRecord[];
  scrollHeightVh?: number;
  header?: { eyebrow?: string; title?: string; subtitle?: string };
}) {
  const reduceMotion = useReducedMotion();
  const isLgUp = useIsLgUp();
  const compact = !isLgUp;
  const items = useMemo(
    () => reviews.filter((review) => (review.review ?? "").trim() && (review.author ?? "").trim()),
    [reviews],
  );

  const stepCount = items.length;
  const scrollTravel = getReviewsScrollTravelCss(stepCount, scrollHeightVh, compact);

  if (stepCount < 1) {
    return (
      <section className="px-5 py-16 sm:px-8 lg:px-14">
        <p className="rounded-[var(--radius-editorial)] border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-white/50">
          No reviews yet. Add them from Admin → Site details.
        </p>
      </section>
    );
  }

  if (reduceMotion) {
    return <ReducedMotionReviewsFallback reviews={items} header={header} />;
  }

  return (
    <ReviewsScrollSection
      key={isLgUp ? "reviews-desktop" : "reviews-mobile"}
      reviews={items}
      header={header}
      scrollTravel={scrollTravel}
      enableTapNav={compact}
      compact={compact}
    />
  );
}

export function ScrollProgressCircle(props: ScrollProgressCircleProps) {
  if (props.mode === "reviews") {
    return (
      <ScrollProgressReviews
        reviews={props.reviews}
        scrollHeightVh={props.scrollHeightVh}
        header={props.header}
      />
    );
  }

  return <ScrollProgressStory steps={props.steps ?? []} scrollHeightVh={props.scrollHeightVh} />;
}

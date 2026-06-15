export default function SiteLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[50vh] items-center justify-center px-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="h-px w-20 animate-pulse bg-[var(--gold)] motion-reduce:animate-none"
        />
        <span className="sr-only">Loading page…</span>
      </div>
    </div>
  );
}

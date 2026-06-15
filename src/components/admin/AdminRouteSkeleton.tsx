export function AdminRouteSkeleton({ variant = "split" }: { variant?: "split" | "dashboard" | "full" }) {
  if (variant === "dashboard") {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-stone-200" />
        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 rounded-2xl bg-stone-200" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-2xl bg-stone-200" />
          <div className="h-72 rounded-2xl bg-stone-200" />
        </div>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-56 rounded-lg bg-stone-200" />
        <div className="h-[32rem] rounded-2xl bg-stone-200" />
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-56 rounded-lg bg-stone-200" />
        <div className="h-9 w-28 rounded-full bg-stone-200" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
          <div className="h-5 w-24 rounded bg-stone-200" />
          <div className="h-3 w-16 rounded bg-stone-100" />
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-10 rounded-xl bg-stone-100" />
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
          <div className="h-5 w-32 rounded bg-stone-200" />
          <div className="h-4 w-full max-w-md rounded bg-stone-100" />
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-11 rounded-xl bg-stone-100" />
            ))}
          </div>
          <div className="h-40 rounded-xl bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  items: Crumb[];
  actions?: React.ReactNode;
};

export function Breadcrumbs({ items, actions }: Props) {
  const lastLabel = items.length > 0 ? items[items.length - 1].label : "";
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
      <div>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-400">
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link href={item.href} className="hover:text-stone-700">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-stone-700">{item.label}</span>
                )}
                {index < items.length - 1 && <span aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        {lastLabel && (
          <h1 className="mt-3 font-display text-3xl tracking-[-0.02em] text-stone-950">
            {lastLabel}
          </h1>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

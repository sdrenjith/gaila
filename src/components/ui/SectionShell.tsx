import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({ eyebrow, title, subtitle, children, className }: SectionShellProps) {
  return (
    <section className={cn("relative overflow-hidden bg-transparent px-5 py-24 sm:px-8 lg:px-14", className)}>
      <div className="mx-auto max-w-[1480px]">
        {(eyebrow || title || subtitle) && (
          <Reveal className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--gold-deep)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.04] tracking-[-0.02em] text-[var(--ink)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{subtitle}</p>
            )}
          </Reveal>
        )}
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}

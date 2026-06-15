import Link from "next/link";
import { DEFAULT_FOOTER_TAGLINE } from "@/lib/navigation";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/phone";
import type { NavigationRecord, SiteSettingsRecord } from "@/types/cms";

type SocialEntry = {
  label: string;
  href: string;
  short: string;
};

function SocialIcon({ label }: { label: string }) {
  const common = "h-4 w-4";
  switch (label) {
    case "Instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.5 9.5h3v11h-3v-11zm1.5-5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 9.5h2.9v1.5h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V20.5h-3v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21v6.21H10V9.5z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14 8.5h2.5l-.5 3H14v9h-3.5v-9H9v-3h1.5V7.2c0-2.2 1.3-3.4 3.3-3.4.95 0 1.75.07 2 .1v2.9H14c-.75 0-1 .38-1 1v1.7z" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.3 4h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6 7H2.2l7.9-9.1L2 4h7l4.8 6.4L17.3 4zm-1.2 16.5h1.9L7.1 5.9H5.1l11 14.6z" />
        </svg>
      );
  }
}

export function Footer({ settings, menu }: { settings: SiteSettingsRecord; menu: NavigationRecord }) {
  const items = menu.items.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  const phoneTel = phoneTelHref(settings.contact.phone) || "+971502827279";
  const phoneDisplay = formatPhoneDisplay(settings.contact.phone || phoneTel);
  const cta = menu.cta;
  const showCta = Boolean(cta?.visible && cta.label && cta.href);
  const footerTagline = settings.footer.tagline?.trim() || DEFAULT_FOOTER_TAGLINE;

  const socials: SocialEntry[] = [
    { label: "Instagram", short: "IG", href: settings.social.instagram },
    { label: "LinkedIn", short: "IN", href: settings.social.linkedin },
    { label: "Facebook", short: "FB", href: settings.social.facebook },
    { label: "X · Twitter", short: "X", href: settings.social.x },
  ].filter((entry) => Boolean(entry.href));

  return (
    <footer className="relative isolate overflow-hidden bg-[var(--ink)] px-5 pb-10 pt-24 text-white sm:px-8 lg:px-14 lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_70%_20%,rgba(200,163,91,0.18),transparent_55%),radial-gradient(70%_60%_at_15%_85%,rgba(139,106,38,0.18),transparent_55%)]"
      />
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {cta?.eyebrow ? (
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.38em] text-white/50">
                {cta.eyebrow}
              </p>
            ) : null}
            <h2 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.95] tracking-[-0.04em]">
              {cta?.headline || "Let's build something"}
              <br />
              <span className="text-[var(--gold-light)]">{cta?.headlineAccent || "that performs."}</span>
            </h2>
            {showCta && cta ? (
              <Link
                href={cta.href}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--gold)] px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--gold-light)]"
              >
                {cta.label}
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ) : null}
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-white/45">
                Explore
              </p>
              <ul className="grid gap-2">
                {items.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link href={item.href} className="text-base text-white/85 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-white/45">
                Studio
              </p>
              <pre className="whitespace-pre-wrap font-sans-display text-base leading-7 text-white/85">
                {settings.contact.address}
              </pre>
              <a href={`mailto:${settings.contact.email}`} className="mt-4 block text-base text-white/85 hover:text-white">
                {settings.contact.email}
              </a>
              <a href={`tel:${phoneTel}`} className="mt-1 block text-base text-white/85 hover:text-white">
                {phoneDisplay}
              </a>
              {socials.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-white/45">
                    Follow
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {socials.map((entry) => (
                      <li key={entry.label}>
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={entry.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[var(--gold-light)] hover:bg-white/10 hover:text-[var(--gold-light)]"
                        >
                          <SocialIcon label={entry.label.startsWith("X") ? "X" : entry.label} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">{settings.footer.copyright}</p>
          {socials.length > 0 && (
            <ul className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.32em] text-white/70">
              {socials.map((entry) => (
                <li key={`bar-${entry.label}`}>
                  <a className="hover:text-white" href={entry.href} target="_blank" rel="noopener noreferrer">
                    {entry.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">{footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}

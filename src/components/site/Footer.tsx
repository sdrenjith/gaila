import Link from "next/link";
import { DEFAULT_FOOTER_TAGLINE } from "@/lib/navigation";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/phone";
import type { NavigationRecord, SiteSettingsRecord } from "@/types/cms";

type SocialEntry = {
  label: string;
  href: string;
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
  const footerDescription = settings.footer.description?.trim();

  const socials: SocialEntry[] = [
    { label: "Instagram", href: settings.social.instagram },
    { label: "LinkedIn", href: settings.social.linkedin },
    { label: "Facebook", href: settings.social.facebook },
    { label: "X", href: settings.social.x },
  ].filter((entry) => Boolean(entry.href));

  return (
    <footer className="relative isolate overflow-hidden bg-[#080014] px-5 pb-10 pt-24 text-white sm:px-8 lg:px-14 lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_78%_12%,rgba(168,85,247,0.38),transparent_58%),radial-gradient(60%_50%_at_8%_88%,rgba(255,63,180,0.22),transparent_55%),radial-gradient(40%_40%_at_50%_50%,rgba(34,211,238,0.08),transparent_60%)]"
      />
      <div aria-hidden="true" className="editorial-noise pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/30 to-transparent"
      />

      <div className="mx-auto max-w-[1480px]">
        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {cta?.eyebrow ? (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-fuchsia-100/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--event-cyan)] shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                {cta.eyebrow}
              </p>
            ) : null}
            <h2 className="font-display text-[clamp(2.8rem,7.5vw,7rem)] uppercase leading-[0.9] tracking-[0.02em]">
              {cta?.headline || "Let's create something"}
              <br />
              <span className="gold-text-gradient">{cta?.headlineAccent || "unforgettable."}</span>
            </h2>
            {footerDescription ? (
              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">{footerDescription}</p>
            ) : null}
            {showCta && cta ? (
              <Link
                href={cta.href}
                className="group mt-10 inline-flex items-center gap-3 rounded-full gold-gradient cta-shadow px-7 py-4 text-[13px] font-black uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-white/25 transition hover:-translate-y-0.5 hover:brightness-110 cta-shadow-hover"
              >
                {cta.label}
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ) : null}
          </div>

          <div className="grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="flex h-full min-h-[18rem] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:min-h-[20rem] sm:p-7 lg:p-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-fuchsia-100/60">
                Explore
              </p>
              <ul className="grid flex-1 gap-2.5">
                {items.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-[15px] leading-7 text-white/78 transition hover:text-[var(--gold-light)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex h-full min-h-[18rem] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:min-h-[20rem] sm:p-7 lg:p-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-fuchsia-100/60">
                Studio
              </p>
              <div className="flex flex-1 flex-col">
                <p className="text-[15px] leading-7 text-white/78">{settings.contact.address}</p>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="mt-3 block text-[15px] leading-7 text-white/78 transition hover:text-[var(--event-cyan)]"
                >
                  {settings.contact.email}
                </a>
                <a
                  href={`tel:${phoneTel}`}
                  className="mt-1 block text-[15px] leading-7 text-white/78 transition hover:text-[var(--event-cyan)]"
                >
                  {phoneDisplay}
                </a>
                {socials.length > 0 && (
                  <div className="mt-auto pt-6">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-fuchsia-100/60">
                      Follow
                    </p>
                    <ul className="flex flex-wrap gap-2.5">
                    {socials.map((entry) => (
                      <li key={entry.label}>
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={entry.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition hover:border-[var(--event-cyan)]/50 hover:bg-[var(--event-cyan)]/10 hover:text-[var(--event-cyan)]"
                        >
                          <SocialIcon label={entry.label} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{settings.footer.copyright}</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}

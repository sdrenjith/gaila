"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { MenuItem, NavigationRecord, SiteSettingsRecord } from "@/types/cms";
import { isMenuItemActive } from "@/lib/navigation";
import { SiteLogo } from "@/components/site/SiteLogo";

function isActiveHref(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function visibleChildren(item: MenuItem): MenuItem[] {
  return (item.children ?? []).filter((child) => child.visible).sort((a, b) => a.order - b.order);
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type NavLinkTone = {
  overHero: boolean;
  active: boolean;
};

function desktopLinkClass({ overHero, active }: NavLinkTone) {
  return overHero
    ? active
      ? "text-white"
      : "text-white/70 hover:text-white"
    : active
      ? "text-[var(--ink)]"
      : "text-[var(--ink-mute)] hover:text-[var(--ink)]";
}

function DesktopNavItem({
  item,
  overHero,
  pathname,
  underlineClass,
}: {
  item: MenuItem;
  overHero: boolean;
  pathname: string;
  underlineClass: string;
}) {
  const active = isMenuItemActive(item, pathname);
  const children = visibleChildren(item);
  const linkClass = `group relative inline-flex items-center gap-1 whitespace-nowrap px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:px-2.5 lg:px-2.5 xl:px-4 xl:tracking-[0.22em] xl:text-[12px] ${desktopLinkClass({ overHero, active })}`;

  if (!children.length) {
    return (
      <Link href={item.href} prefetch aria-current={active ? "page" : undefined} className={linkClass}>
        <span className="relative inline-block">
          {item.label}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 ${underlineClass} ${
              active ? "scale-x-100" : ""
            }`}
          />
        </span>
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link href={item.href} prefetch aria-current={active ? "page" : undefined} className={linkClass}>
        <span className="relative inline-flex items-center gap-1">
          {item.label}
          <ChevronDown className="h-3 w-3 opacity-70 transition group-hover:rotate-180 group-focus-within:rotate-180" />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 ${underlineClass} ${
              active ? "scale-x-100" : ""
            }`}
          />
        </span>
      </Link>
      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[15.5rem] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0d0520]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_40px_rgba(168,85,247,0.22)] backdrop-blur-xl">
          <p className="px-3 pb-2 pt-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-fuchsia-100/55">
            {item.label}
          </p>
          <ul className="grid gap-0.5">
            {children.map((child) => {
              const childActive = isActiveHref(child.href, pathname);
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    prefetch
                    aria-current={childActive ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition ${
                      childActive
                        ? "bg-[image:linear-gradient(135deg,rgba(255,63,180,0.22),rgba(168,85,247,0.28))] text-white"
                        : "text-white/72 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{child.label}</span>
                    <span className={`text-[10px] ${childActive ? "text-[var(--event-cyan)]" : "text-white/30"}`}>→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  index,
  pathname,
  open,
  onClose,
  menuOpen,
}: {
  item: MenuItem;
  index: number;
  pathname: string;
  open: boolean;
  onClose: () => void;
  menuOpen: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const active = isMenuItemActive(item, pathname);
  const children = visibleChildren(item);

  useEffect(() => {
    if (!menuOpen) setExpanded(false);
  }, [menuOpen]);

  if (!children.length) {
    return (
      <li className={open ? "animate-header-link" : "opacity-0"} style={open ? { animationDelay: `${80 + index * 70}ms` } : undefined}>
        <Link
          href={item.href}
          prefetch
          onClick={onClose}
          aria-current={active ? "page" : undefined}
          className="group flex items-baseline justify-between gap-6 border-b border-white/10 py-5 outline-none transition-colors focus-visible:text-[var(--gold-light)]"
        >
          <span className="flex items-baseline gap-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.34em] text-white/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`font-display text-[clamp(2.1rem,7.5vw,3.5rem)] leading-[0.95] tracking-[-0.02em] transition-colors ${
                active ? "text-[var(--gold-light)]" : "text-white group-hover:text-[var(--gold-light)]"
              }`}
            >
              {item.label}
            </span>
          </span>
          <span aria-hidden="true" className="translate-x-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--gold-light)]">
            →
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li className={open ? "animate-header-link" : "opacity-0"} style={open ? { animationDelay: `${80 + index * 70}ms` } : undefined}>
      <div className="border-b border-white/10 py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="group flex w-full items-baseline justify-between gap-6 py-2 outline-none focus-visible:text-[var(--gold-light)]"
        >
          <span className="flex items-baseline gap-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.34em] text-white/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`font-display text-[clamp(2.1rem,7.5vw,3.5rem)] leading-[0.95] tracking-[-0.02em] transition-colors ${
                active ? "text-[var(--gold-light)]" : "text-white group-hover:text-[var(--gold-light)]"
              }`}
            >
              {item.label}
            </span>
          </span>
          <ChevronDown className={`h-5 w-5 shrink-0 text-white/50 transition ${expanded ? "rotate-180 text-[var(--event-cyan)]" : ""}`} />
        </button>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 pb-4 pl-10 pt-2">
              <li>
                <Link
                  href={item.href}
                  prefetch
                  onClick={onClose}
                  className="block rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-fuchsia-300/40 hover:text-white"
                >
                  All {item.label.toLowerCase()}
                </Link>
              </li>
              {children.map((child, childIndex) => {
                const childActive = isActiveHref(child.href, pathname);
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      prefetch
                      onClick={onClose}
                      aria-current={childActive ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                        childActive
                          ? "bg-[image:linear-gradient(135deg,rgba(255,63,180,0.18),rgba(168,85,247,0.24))] text-white"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span>{child.label}</span>
                      <span className="text-[9px] text-white/35">{String.fromCharCode(65 + childIndex)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Header({
  settings,
  menu,
}: {
  settings: SiteSettingsRecord;
  menu: NavigationRecord | null;
}) {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const items = useMemo<MenuItem[]>(
    () => (menu?.items ?? []).filter((item) => item.visible).sort((a, b) => a.order - b.order),
    [menu],
  );

  // ── scroll state ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = isHome && !scrolled && !open;
  const floating = scrolled && !open;

  // ── mobile overlay: body scroll lock, escape, focus trap, restore focus ────
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const html = document.documentElement;
    const prevBody = body.style.overflow;
    const prevHtml = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const toggleEl = toggleRef.current;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      const target =
        previouslyFocused && previouslyFocused.isConnected ? previouslyFocused : toggleEl;
      target?.focus({ preventScroll: true });
    };
  }, [open]);

  const onOverlayKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const root = overlayRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const socials = useMemo(
    () =>
      [
        { label: "Instagram", href: settings.social.instagram },
        { label: "LinkedIn", href: settings.social.linkedin },
        { label: "Facebook", href: settings.social.facebook },
        { label: "X / Twitter", href: settings.social.x },
      ].filter((entry) => Boolean(entry.href)),
    [settings.social],
  );

  // ── surfaces ───────────────────────────────────────────────────────────────
  // Outer header is a transparent positioning shell; the inner pill renders the surface.
  const pillSurface = overHero
    ? "border-white/15 bg-white/[0.07] text-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150"
    : "border-[var(--hairline)] bg-[var(--background)]/85 text-[var(--ink)] shadow-[0_1px_2px_rgba(14,14,14,0.04),0_18px_44px_-22px_rgba(14,14,14,0.18)] backdrop-blur-xl";

  const ctaSurface = "gold-gradient cta-shadow text-white hover:brightness-110 cta-shadow-hover";

  const toggleSurface = overHero
    ? "border-white/25 text-white hover:bg-white/10"
    : "border-[var(--hairline-strong)] text-[var(--ink)] hover:bg-[var(--cream-deep)]";

  const pillPadding = floating ? "px-4 sm:px-4 md:px-3" : "px-4 sm:px-5 lg:px-6";
  // Mobile: fixed py-3 + h-10 logo = 4rem bar height (matches SectionNav top offset).
  const pillVertical = floating ? "py-3 md:py-2" : "py-3 md:py-3.5";
  const outerPadding = floating
    ? "px-0 pt-[env(safe-area-inset-top)] md:px-6 md:pt-3 lg:px-10 lg:pt-5"
    : "px-0 pt-[env(safe-area-inset-top)] md:px-4 md:pt-4 lg:pt-5";
  const pillShape = floating
    ? "w-full max-w-none rounded-none md:mx-auto md:w-auto md:max-w-[1100px] md:rounded-full"
    : "w-full max-w-none rounded-none md:mx-auto md:w-auto md:max-w-[1480px] md:rounded-full";

  const underlineClass = overHero ? "bg-[var(--gold-light)]" : "bg-[var(--gold)]";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.22em] focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 transition-[padding] duration-500 ease-out ${outerPadding}`}
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-3 border transition-[background-color,box-shadow,border-color,max-width,padding,border-radius] duration-500 ease-out ${pillSurface} ${pillPadding} ${pillVertical} ${pillShape}`}
        >
          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label={`${settings.siteName} — home`}
            className="group flex shrink-0 items-center gap-3 outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <SiteLogo
              logo={settings.logo}
              logoText={settings.logoText}
              siteName={settings.siteName}
              overHero={overHero}
              floating={floating}
              showTagline={false}
            />
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-0 lg:gap-0.5 xl:gap-1">
              {items.map((item, index) => (
                <li key={`${item.href}-${index}`} className="relative">
                  <DesktopNavItem
                    item={item}
                    overHero={overHero}
                    pathname={pathname}
                    underlineClass={underlineClass}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* ── CTA + hamburger ───────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {menu?.cta?.visible && (
              <Link
                href={menu.cta.href}
                prefetch={true}
                className={`group relative hidden items-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:inline-flex xl:px-5 xl:tracking-[0.22em] ${ctaSurface}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-deep)] opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                />
                <span className="relative">{menu.cta.label}</span>
                <span
                  aria-hidden="true"
                  className="relative inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            )}

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden ${toggleSurface}`}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-0 h-px origin-center bg-current transition-transform duration-300 ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-px origin-center bg-current transition-transform duration-300 ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ─────────────────────────────────────── */}
      <div
        id={menuId}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onKeyDown={onOverlayKeyDown}
        className={`fixed inset-0 z-50 flex flex-col bg-[#080014] text-white transition-[opacity,transform] duration-500 ease-out md:hidden ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_15%,rgba(168,85,247,0.28),transparent_60%),radial-gradient(60%_50%_at_15%_90%,rgba(255,63,180,0.18),transparent_55%)]"
        />
        <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="flex items-center gap-3">
            <SiteLogo
              logo={settings.logo}
              logoText={settings.logoText}
              siteName={settings.siteName}
              variant="header-dark"
              showTagline={false}
            />
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-3.5">
              <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav
          aria-label="Mobile primary"
          className="relative flex flex-1 flex-col justify-between overflow-y-auto px-5 pb-10 pt-6 sm:px-8"
        >
          <ul className="flex flex-col gap-1">
            {items.map((item, index) => (
              <MobileNavItem
                key={`${item.href}-${index}`}
                item={item}
                index={index}
                pathname={pathname}
                open={open}
                onClose={closeMenu}
                menuOpen={open}
              />
            ))}
          </ul>

          <div
            className={`mt-12 grid gap-8 ${open ? "animate-header-link" : "opacity-0"}`}
            style={open ? { animationDelay: `${120 + items.length * 70}ms` } : undefined}
          >
            {menu?.cta?.visible && (
              <Link
                href={menu.cta.href}
                prefetch={true}
                onClick={closeMenu}
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-[var(--gold)] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] outline-none transition hover:bg-[var(--gold-light)] focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
              >
                {menu.cta.label}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}

            <dl className="grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.32em] text-white/45">Studio</dt>
                <dd className="mt-2 whitespace-pre-line text-sm leading-7 text-white/80">
                  {settings.contact.address}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.32em] text-white/45">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-sm text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    {settings.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.32em] text-white/45">Phone</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${settings.contact.phone}`}
                    className="text-sm text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    {settings.contact.phone}
                  </a>
                </dd>
              </div>
            </dl>

            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.28em] text-white/70">
                {socials.map((entry) => (
                  <li key={entry.label}>
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition hover:text-white"
                    >
                      {entry.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

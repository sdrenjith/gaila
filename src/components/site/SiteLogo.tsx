import Image from "next/image";

type SiteLogoProps = {
  logo?: string;
  logoText: string;
  siteName: string;
  tagline?: string;
  variant?: "header" | "header-dark" | "admin" | "admin-compact" | "login";
  overHero?: boolean;
  floating?: boolean;
  showTagline?: boolean;
};

export function SiteLogo({
  logo,
  logoText,
  siteName,
  tagline,
  variant = "header",
  overHero = false,
  floating = false,
  showTagline = true,
}: SiteLogoProps) {
  const initial = logoText.charAt(0).toUpperCase();

  if (variant === "login") {
    if (logo) {
      return (
        <div className="relative h-14 w-40">
          <Image src={logo} alt={siteName} fill sizes="160px" className="object-contain object-left" priority />
        </div>
      );
    }
    return (
      <div className="gold-gradient grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black text-black">
        {initial}
      </div>
    );
  }

  if (variant === "admin" || variant === "admin-compact") {
    const compact = variant === "admin-compact";
    if (logo) {
      return (
        <div className={`relative shrink-0 ${compact ? "h-8 w-24" : "h-10 w-28"}`}>
          <Image
            src={logo}
            alt={siteName}
            fill
            sizes={compact ? "96px" : "112px"}
            className="object-contain object-left"
            priority
          />
        </div>
      );
    }
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-[var(--ink)] font-display text-[var(--cream)] ${
          compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-lg"
        }`}
      >
        {initial}
      </span>
    );
  }

  const isDark = variant === "header-dark";
  const onLightHero = overHero && !isDark;

  if (logo) {
    const imageClass = onLightHero || isDark ? "brightness-0 invert" : "";
    const height = floating && !isDark ? "h-10 w-52 md:h-9 md:w-[12.35rem]" : "h-10 w-52 md:w-56";

    return (
      <>
        <span className={`relative block shrink-0 ${height}`}>
          <Image
            src={logo}
            alt={siteName}
            fill
            sizes="(max-width: 768px) 208px, 224px"
            className={`object-contain object-left ${imageClass}`}
            priority
          />
        </span>
        {showTagline && tagline && (
          <span className="flex flex-col leading-none">
            <span
              className={`mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.34em] ${
                isDark ? "text-white/60" : onLightHero ? "text-white/60" : "text-[var(--ink-mute)] hidden xl:block"
              }`}
            >
              {tagline}
            </span>
          </span>
        )}
      </>
    );
  }

  return (
    <>
      <span
        className={`relative grid place-items-center transition-[height,width] duration-500 ease-out ${
          floating && !isDark ? "h-10 w-10 md:h-9 md:w-9" : "h-10 w-10"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full transition duration-500 ${
            isDark
              ? "bg-white/[0.06] ring-1 ring-white/30"
              : onLightHero
                ? "bg-white/[0.06] ring-1 ring-white/30"
                : "bg-white ring-1 ring-[var(--hairline-strong)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]"
          }`}
        />
        <span
          className={`relative font-display text-[17px] font-medium leading-none tracking-[-0.02em] ${
            isDark || onLightHero ? "text-white" : "text-[var(--ink)]"
          }`}
        >
          {initial}
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[22px] tracking-[-0.02em] transition-colors md:text-[23px] ${
            isDark || onLightHero ? "text-white" : "text-[var(--ink)]"
          }`}
        >
          {logoText}
        </span>
        {showTagline && tagline && (
          <span
            className={`mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.34em] ${
              isDark ? "text-white/60" : onLightHero ? "text-white/60 hidden xl:block" : "text-[var(--ink-mute)] hidden xl:block"
            }`}
          >
            {tagline}
          </span>
        )}
      </span>
    </>
  );
}

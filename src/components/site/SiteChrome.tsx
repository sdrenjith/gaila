import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getNavigation, getPublishedPages, getSiteSettings } from "@/lib/cms";
import { mergeHeaderMenuWithPages, resolveFooterMenu } from "@/lib/navigation";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [settings, headerMenu, footerMenu, publishedPages] = await Promise.all([
    getSiteSettings(),
    getNavigation("header"),
    getNavigation("footer"),
    getPublishedPages(),
  ]);
  const resolvedHeaderMenu = mergeHeaderMenuWithPages(headerMenu, publishedPages);
  const resolvedFooterMenu = resolveFooterMenu(footerMenu);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: settings.siteName,
            url: process.env.APP_URL || "http://localhost:3000",
            address: settings.contact.address,
            email: settings.contact.email,
            telephone: settings.contact.phone,
            sameAs: Object.values(settings.social).filter(Boolean),
          }),
        }}
      />
      <Header settings={settings} menu={resolvedHeaderMenu} />
      <main id="main" className="min-h-screen bg-transparent">{children}</main>
      <Footer settings={settings} menu={resolvedFooterMenu} />
      <ScrollToTop />
    </>
  );
}

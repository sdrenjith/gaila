import { LoginForm } from "@/components/admin/LoginForm";
import { SiteLogo } from "@/components/site/SiteLogo";
import { getSiteSettings } from "@/lib/cms";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <main className="grid min-h-screen place-items-center bg-transparent px-5 text-stone-950">
      <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
        <SiteLogo
          logo={settings.logo}
          logoText={settings.logoText}
          siteName={settings.siteName}
          variant="login"
        />
        <h1 className="mt-6 text-3xl font-semibold">Gaila CMS login</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          Manage pages, sections, menus, content, media, leads, and site SEO from one protected admin panel.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}

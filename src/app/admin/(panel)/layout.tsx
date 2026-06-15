import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/cms";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [session, settings] = await Promise.all([requireAdmin(), getSiteSettings()]);

  return (
    <AdminShell
      session={session}
      logo={settings.logo}
      logoText={settings.logoText}
      siteName={settings.siteName}
    >
      {children}
    </AdminShell>
  );
}

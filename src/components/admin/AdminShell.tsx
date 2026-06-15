import Link from "next/link";
import { logoutAction } from "@/app/actions/admin";
import { ToastProvider } from "@/components/admin/Toaster";
import { AdminNav } from "@/components/admin/AdminNav";
import { SiteLogo } from "@/components/site/SiteLogo";
import type { AdminSession } from "@/lib/auth";

export function AdminShell({
  session,
  logo,
  logoText,
  siteName,
  children,
}: {
  session: AdminSession;
  logo: string;
  logoText: string;
  siteName: string;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50 text-stone-950">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white px-4 py-6 lg:flex">
          <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
            <SiteLogo logo={logo} logoText={logoText} siteName={siteName} variant="admin" />
            <span className="leading-tight">
              <span className="block font-display text-lg tracking-[-0.01em] text-stone-950">Gaila CMS</span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-stone-400">Dynamic website</span>
            </span>
          </Link>

          <AdminNav />

          <div className="mt-auto rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm">
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-400">Signed in</p>
            <p className="mt-1 truncate font-semibold text-stone-950">{session.name}</p>
            <p className="truncate text-xs text-stone-500">{session.role}</p>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href="/"
                className="flex-1 rounded-full border border-stone-300 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-700 hover:bg-stone-100"
              >
                Site
              </Link>
              <form action={logoutAction}>
                <button className="rounded-full bg-stone-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-stone-700">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="lg:pl-64">
          {/* Mobile bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3 lg:hidden">
            <Link href="/admin" className="flex items-center gap-2">
              <SiteLogo logo={logo} logoText={logoText} siteName={siteName} variant="admin-compact" />
              <span className="font-semibold">Gaila CMS</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-full border border-stone-300 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-700">
                Site
              </Link>
              <form action={logoutAction}>
                <button className="rounded-full bg-stone-900 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
                  Logout
                </button>
              </form>
            </div>
          </header>
          <div className="px-5 pb-12 pt-8 sm:px-8 lg:px-12">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}

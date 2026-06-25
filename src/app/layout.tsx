import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { resetHashScrollOnLoadScript } from "@/components/ui/ResetHashScrollOnLoad";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Gaila | Event Management Company in Dubai",
    template: "%s | Gaila",
  },
  description:
    "Gaila is a Dubai event management company for corporate events, conferences, weddings, galas, and experiential activations across the UAE.",
  verification: {
    google: "wRjCBU_RiwBV1TuyJE4-3mtJcL-9DDPK-SeOvM1xr0g",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: resetHashScrollOnLoadScript }} />
      </head>
      <body className="relative min-h-full bg-[var(--background)] text-[var(--ink)] font-sans selection:bg-[var(--gold)]/30 overflow-x-hidden">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
          <div className="glow-blob animate-float-slow-1 absolute -left-20 -top-20 h-[500px] w-[500px]" />
          <div className="glow-blob animate-float-slow-2 absolute -right-32 top-[40%] h-[600px] w-[600px]" />
          <div className="glow-blob animate-float-slow-1 absolute left-[20%] bottom-[-10%] h-[550px] w-[550px]" />
        </div>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}

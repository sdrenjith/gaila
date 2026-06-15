import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { resetHashScrollOnLoadScript } from "@/components/ui/ResetHashScrollOnLoad";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
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
      className={`${inter.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: resetHashScrollOnLoadScript }} />
      </head>
      <body className="min-h-full bg-white text-[var(--ink)] font-sans selection:bg-[var(--gold)]/30">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/chrome/Nav";
import SmoothScroll from "@/components/chrome/SmoothScroll";
import Footer from "@/components/chrome/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "S/V Sabbatical — Chicago to Old Saybrook, Summer 2027",
  description:
    "A 35-day, 1,700-nautical-mile passage from Chicago to Old Saybrook, CT, through the Great Lakes, the North Channel, the Erie Canal, the Hudson River and Long Island Sound.",
};

export const viewport: Viewport = {
  themeColor: "#03060c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="grain min-h-dvh antialiased">
        {/* Without JS, scroll-reveal content must not stay at its initial hidden state. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-abyss"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

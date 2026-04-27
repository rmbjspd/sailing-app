import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pirataOne = Pirata_One({ variable: "--font-pirata", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S/V Sabbatical — Chicago to Philadelphia 2027",
  description: "Sailing voyage planning: Chicago → Philadelphia via the Great Lakes, Erie Canal, Hudson River, and NJ coast. Summer 2027.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pirataOne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

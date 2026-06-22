import type { Metadata } from "next";
import { IM_Fell_English, Special_Elite, Pirata_One } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const imFellEnglish = IM_Fell_English({
  variable: "--font-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const specialElite = Special_Elite({
  variable: "--font-typewriter",
  weight: "400",
  subsets: ["latin"],
});
const pirataOne = Pirata_One({ variable: "--font-pirata", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S/V Sabbatical — Chicago to Old Saybrook 2027",
  description: "Sailing voyage planning: Chicago → Old Saybrook, CT via the Great Lakes, North Channel, Erie Canal, Hudson River, and Long Island Sound. Summer 2027.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${imFellEnglish.variable} ${specialElite.variable} ${pirataOne.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

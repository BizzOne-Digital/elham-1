import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { BRAND, BRAND_ASSETS } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: BRAND.name,
    description: BRAND.tagline,
  }),
  icons: {
    icon: BRAND_ASSETS.favicon,
    apple: BRAND_ASSETS.favicon,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-CA"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full max-w-full overflow-x-hidden bg-sand text-ink">{children}</body>
    </html>
  );
}

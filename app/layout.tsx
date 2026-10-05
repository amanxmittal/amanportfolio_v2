import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/ui/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Space Grotesk (display) and Inter (body) loaded as variable fonts and
// self-hosted by next/font. Each exposes only the CSS variable requested via
// `variable`; the literal family name matches no @font-face rule, so the
// design tokens in globals.css (--font-display / --font-body) reference these
// variables — not literal family-name strings (design.md §10, §4).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Foundation scaffold.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {/* Skip link is the first focusable element in the DOM (Req 12.2):
            visually hidden until focused, targets #main. */}
        <SkipLink />
        <Header />
        {/*
          <main> carries tabIndex={-1} so activating the skip link actually
          lands keyboard focus here (design.md §8) — the next Tab then
          continues into content, not back to the nav.

          The header is fixed (HeaderShell: `fixed inset-x-0 top-0`), so it is
          removed from normal flow and would otherwise overlap the top of the
          content. The unscrolled header is its tallest state: py-4 (16px top +
          16px bottom = 32px) around a 44px min-height control row ≈ 76px, so
          the previous 64px (pt-16) offset left the first content sitting under
          the header at the default scroll position (M-07). pt-20 (80px, an
          approved 8-point-scale step) clears the base header at both 375px and
          1440px. This is a plain static layout offset — NOT the deferred SC
          2.4.11 `scroll-padding-top` / `--header-height` mechanism (design.md
          §14 items 6–8), which remains out of scope for this milestone.
        */}
        <main id="main" tabIndex={-1} className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

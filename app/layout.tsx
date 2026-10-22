import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

// Self-hosted via next/font: font files are served from our own origin and the
// @font-face CSS is inlined at build time. This removes the render-blocking
// round-trip to fonts.googleapis.com (measured ~720 ms) and the extra RTT
// before the browser can even discover the woff2 URLs.
const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KICKFORGE — Where Motion Meets Craft",
  description: "Premium 3D shoe e-commerce. Scroll-driven hero, cinematic drops, instant checkout.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0F",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/hero-poster.jpg" fetchPriority="high" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Link href="/login" aria-label="Go to login" className="fixed top-6 left-6 z-[600] group">
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            background: "#0A0A0F",
            color: "#EDEDED",
            border: "3px solid #EDEDED",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow: "4px 4px 0px 0px #6EE7B7",
            transition: "transform 150ms ease, box-shadow 150ms ease"
          }} className="group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-active:translate-x-[2px] group-active:translate-y-[2px] group-hover:shadow-[6px_6px_0px_0px_#6EE7B7] group-active:shadow-[2px_2px_0px_0px_#6EE7B7]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 4v16M5 12l10-8M5 12l10 8" strokeLinecap="square" />
            </svg>
            KF
          </span>
        </Link>
        {children}
      </body>
    </html>
  );
}

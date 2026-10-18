import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

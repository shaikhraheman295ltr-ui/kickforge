import type { MetadataRoute } from "next";

/** Keep in sync with SITE_URL in app/sitemap.ts. */
const SITE_URL = "https://kickforge-xi.vercel.app";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

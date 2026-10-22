import type { MetadataRoute } from "next";
import products from "@/server/products.json";

/** Update this when the canonical domain changes (also mirrored in robots.ts). */
const SITE_URL = "https://kickforge-xi.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const productEntries: MetadataRoute.Sitemap = products.map(product => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...productEntries,
  ];
}

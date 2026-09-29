import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata/site";

// Robots policy for this milestone (design.md §9, Requirement 13.3). Allows
// crawling of all routes and points crawlers at the generated sitemap.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

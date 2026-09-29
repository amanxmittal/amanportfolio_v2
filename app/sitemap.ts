import type { MetadataRoute } from "next";
import { getAllCaseStudySlugs } from "@/lib/content";
import { siteUrl } from "@/lib/metadata/site";

// Sitemap for this milestone only (design.md §9, Requirement 13.3). Lists the
// static routes that exist now plus every resolved case-study route sourced
// dynamically from getAllCaseStudySlugs() so the two stay in sync. Routes that
// don't exist yet (/playground, /uses, /now) are intentionally absent, as are
// any case-study slugs beyond the single placeholder example.

// Static routes that exist this milestone.
const STATIC_PATHS = ["/", "/work", "/think", "/build", "/about"] as const;

function toAbsoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified,
  }));

  // Derive case-study routes from the content registry rather than hardcoding
  // the example slug separately.
  const caseStudyEntries: MetadataRoute.Sitemap = getAllCaseStudySlugs().map(
    (slug) => ({
      url: toAbsoluteUrl(`/work/${slug}`),
      lastModified,
    }),
  );

  return [...staticEntries, ...caseStudyEntries];
}

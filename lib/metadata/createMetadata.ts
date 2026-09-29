import type { Metadata } from "next";
import { defaultDescription, siteName, siteUrl } from "@/lib/metadata/site";

// Shared per-route Metadata helper (design.md §9). Every route's page.tsx
// calls this in its exported `metadata` rather than duplicating the shape.
//
// No social preview image is fabricated this milestone — `openGraph.images`
// is intentionally omitted and flagged as a follow-up once real OG art
// exists (design.md §9, Requirement 13.4).

export interface CreateMetadataParams {
  /** Per-route title. Combined with siteName via the template below. */
  title: string;
  /** Per-route description. Falls back to the approved default. */
  description?: string;
  /**
   * Route path (e.g. "/work"). Used to build the canonical + OG url from
   * siteUrl. Defaults to "/" (home). Leading slash optional.
   */
  path?: string;
}

function toAbsoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Collapse the home path so the canonical URL is the bare origin.
  return normalized === "/" ? siteUrl : `${siteUrl}${normalized}`;
}

export function createMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: CreateMetadataParams): Metadata {
  const url = toAbsoluteUrl(path);
  const fullTitle = `${title} · ${siteName}`;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url,
      siteName,
    },
  };
}

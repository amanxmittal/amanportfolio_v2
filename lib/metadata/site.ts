// Site-wide constants for SEO metadata. No fabricated data (design.md §9).
//
// `siteUrl` is env-driven, not a hardcoded production domain: the final domain
// is not yet confirmed (design.md §14 item 3), so we read it from
// NEXT_PUBLIC_SITE_URL and fall back to localhost for local development.
// `defaultDescription` is the approved positioning statement from product.md,
// not invented copy.

export const siteName = "Aman Mittal" as const;

export const siteUrl: string =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

// Approved positioning statement (product.md). Do not rewrite without approval.
export const defaultDescription =
  "Product designer building products, systems and experiences at scale." as const;

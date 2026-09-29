/**
 * Shape of the `meta` object each case-study MDX module exports.
 *
 * Intentionally has NO fixed "structure" enum — content.md requires each case
 * study to support a different narrative shape. The MDX body itself (headings
 * + custom components) carries the structure; only this metadata shape is
 * fixed.
 */
export interface CaseStudyMeta {
  title: string;
  slug: string;
  role: string;
  discipline: string;
  summary: string;
}

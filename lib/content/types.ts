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

/**
 * Summary of a flagship project as presented in the homepage Selected Work
 * section. ADDITIVE — deliberately separate from `CaseStudyMeta`, which
 * remains the frozen model for `/work/[slug]` case-study pages. A project may
 * appear in Selected Work long before a case study exists for it.
 */
export interface ProjectSummary {
  /** Project name. Approved identity (blueprint §10). */
  name: string;
  /** Aman's role. CR-1 — provisional until supplied. */
  role: string;
  /** Discipline(s). CR-1 — provisional until supplied. */
  discipline: string;
  /** Short value proposition. CR-1 — provisional until supplied. */
  valueProposition: string;
  /** Lower numbers lead. Expresses flagship hierarchy (Requirement 3.9). */
  order: number;
  /**
   * Case-study slug IF a real `/work/[slug]` page exists, else null. Null
   * entries render a non-interactive affordance rather than a link that 404s
   * (Requirement 3.4).
   */
  caseStudySlug: string | null;
  /**
   * Preview image metadata. Null → tokenized empty state sized to the same
   * aspect ratio, so there is no CLS and no fabricated screenshot
   * (Requirement 3.5).
   */
  preview: { src: string; alt: string; width: number; height: number } | null;
  /** True while any CR-1/CR-2 field is still a placeholder. */
  provisional: boolean;
}

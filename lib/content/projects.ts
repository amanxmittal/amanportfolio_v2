import type { ProjectSummary } from "./types";

/**
 * Selected Work content model (Requirement 3.8, 12.3; design.md §7).
 *
 * Project NAMES and their flagship ordering are approved content
 * (blueprint §10). Everything else — role, discipline, value proposition,
 * preview imagery, case-study slug — is CR-1/CR-2 and is NOT yet supplied.
 *
 * Per CLAUDE.md §17 and content.md, none of it is invented here. Each unknown
 * field carries an obviously-provisional value that could never be mistaken
 * for approved copy, and the UI renders those entries in a visibly provisional
 * state. Replacing these values with real content is a data change only — no
 * layout or structural rewrite is required.
 *
 * `caseStudySlug` is null for every entry: no real case study exists yet, and
 * the frozen `/work/[slug]` route 404s for unknown slugs, so linking would
 * produce a dead link (Requirement 3.4).
 */

const CONTENT_REQUIRED = "Content required" as const;

export const projects: ProjectSummary[] = [
  {
    name: "DigiLocker",
    role: CONTENT_REQUIRED,
    discipline: CONTENT_REQUIRED,
    valueProposition: CONTENT_REQUIRED,
    order: 1,
    caseStudySlug: null,
    preview: null,
    provisional: true,
  },
  {
    name: "UX4G",
    role: CONTENT_REQUIRED,
    discipline: CONTENT_REQUIRED,
    valueProposition: CONTENT_REQUIRED,
    order: 2,
    caseStudySlug: null,
    preview: null,
    provisional: true,
  },
  {
    name: "Entity Locker",
    role: CONTENT_REQUIRED,
    discipline: CONTENT_REQUIRED,
    valueProposition: CONTENT_REQUIRED,
    order: 3,
    caseStudySlug: null,
    preview: null,
    provisional: true,
  },
  {
    name: "Accessibility",
    role: CONTENT_REQUIRED,
    discipline: CONTENT_REQUIRED,
    valueProposition: CONTENT_REQUIRED,
    order: 4,
    caseStudySlug: null,
    preview: null,
    provisional: true,
  },
];

/** Projects in flagship order (lowest `order` leads). */
export function getProjectsInOrder(): ProjectSummary[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

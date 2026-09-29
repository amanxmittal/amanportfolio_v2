import type { ComponentType } from "react";
import type { CaseStudyMeta } from "./types";

/**
 * Static registry of case-study slugs for this milestone. There is exactly one
 * placeholder entry; real case studies are added in a later milestone. Kept as
 * a small static list rather than a filesystem scan so it works under the
 * bundler without Node `fs` access at request time.
 */
const CASE_STUDY_SLUGS = ["_example"] as const;

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

export interface CaseStudy {
  meta: CaseStudyMeta;
  /** Compiled MDX body — the module's default export, rendered as a component. */
  Body: ComponentType;
}

/**
 * Returns every known case-study slug, consumed by `generateStaticParams`.
 */
export function getAllCaseStudySlugs(): string[] {
  return [...CASE_STUDY_SLUGS];
}

function isCaseStudyMeta(value: unknown): value is CaseStudyMeta {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const meta = value as Record<string, unknown>;
  return (
    typeof meta.title === "string" &&
    typeof meta.slug === "string" &&
    typeof meta.role === "string" &&
    typeof meta.discipline === "string" &&
    typeof meta.summary === "string"
  );
}

/**
 * Dynamically imports a case study's MDX module, validates its `meta` export
 * against `CaseStudyMeta` at this single boundary, and returns the typed meta
 * plus the compiled MDX body component.
 *
 * Typing happens here — @types/mdx types only the default export, not named
 * exports like `meta`, so the module's `meta` arrives untyped and is narrowed
 * through an explicit runtime shape check. No `any` is used, and an invalid or
 * unknown slug returns `null` rather than throwing.
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!CASE_STUDY_SLUGS.includes(slug as CaseStudySlug)) {
    return null;
  }

  const mdxModule: { default: ComponentType; meta?: unknown } = await import(
    `@/content/work/${slug}/index.mdx`
  );

  if (!isCaseStudyMeta(mdxModule.meta)) {
    return null;
  }

  return {
    meta: mdxModule.meta,
    Body: mdxModule.default,
  };
}

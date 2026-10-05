import Image from "next/image";
import Link from "next/link";
import { Grid } from "@/components/layout/Grid";
import { Label } from "@/components/typography/Label";
import { ProjectMeta } from "./ProjectMeta";
import { cn } from "@/lib/utils/cn";
import type { ProjectSummary } from "@/lib/content/types";

/**
 * ProjectCard — Server Component (design.md §7).
 *
 * An editorial Selected Work entry, deliberately NOT a SaaS card: no elevated
 * surface, no border box, no dense chrome (blueprint §10/§22). Structure is
 * carried by the grid, the index number and type scale instead.
 *
 * Hierarchy (Requirement 3.9): the lead project (`featured`) spans the full
 * grid with a larger preview and name; subsequent entries use an offset
 * two-column composition that alternates side, giving editorial rhythm without
 * repeating an identical card.
 *
 * Responsive (Requirement 3.7): mobile stacks media over meta; tablet keeps a
 * single column with reduced offset; desktop uses the offset/alternating
 * composition. This is a genuine reflow, not the desktop layout shrunk.
 */

type ProjectCardProps = {
  project: ProjectSummary;
  index: number;
  featured?: boolean;
};

/**
 * Preview slot. When `preview` is null (CR-2 not yet supplied) this renders a
 * tokenized empty state sized to the same aspect ratio as a real preview would
 * occupy, so there is no layout shift when real art arrives (Requirement 3.5,
 * 10.5). No fabricated screenshot and no fabricated alt text.
 */
function ProjectPreview({
  project,
  priority,
}: {
  project: ProjectSummary;
  priority: boolean;
}) {
  if (project.preview) {
    return (
      <Image
        src={project.preview.src}
        alt={project.preview.alt}
        width={project.preview.width}
        height={project.preview.height}
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="aspect-video w-full rounded-lg object-cover"
      />
    );
  }

  return (
    <div
      className="flex aspect-video w-full items-end rounded-lg border border-border bg-surface p-6"
      data-provisional="preview"
    >
      <Label as="span" className="text-muted uppercase">
        Preview — content required
      </Label>
    </div>
  );
}

/**
 * Case-study affordance. Rendered as a real link only when a case study
 * actually exists. Every entry this milestone has `caseStudySlug: null`, so
 * this renders a non-interactive status instead of an <a> to a slug the frozen
 * /work/[slug] route would 404 (Requirement 3.4, 9.4).
 */
function CaseStudyAffordance({
  project,
  labelledBy,
}: {
  project: ProjectSummary;
  labelledBy: string;
}) {
  if (project.caseStudySlug) {
    return (
      <Link
        href={`/work/${project.caseStudySlug}`}
        aria-labelledby={labelledBy}
        // Hover affordance mirrored on :focus-visible (Requirement 3.6); the
        // global 2px focus ring still applies on top.
        className="group/link mt-8 inline-flex min-h-11 items-center gap-3 rounded-sm text-ink underline decoration-border underline-offset-8 transition-[color] duration-(--duration-fast) hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent"
      >
        <Label as="span" className="uppercase">
          Read case study
        </Label>
        <span
          aria-hidden="true"
          className="transition-transform duration-(--duration-fast) ease-standard group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1"
        >
          →
        </span>
      </Link>
    );
  }

  return (
    <p className="mt-8">
      <Label as="span" className="text-muted uppercase">
        Case study — coming soon
      </Label>
    </p>
  );
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const headingId = `project-${project.order}-name`;
  // Alternate the offset side for non-featured entries so the sequence reads
  // editorially rather than as a repeating template.
  const mediaFirst = index % 2 === 0;

  return (
    <article aria-labelledby={headingId} className="border-t border-border pt-8 lg:pt-12">
      <p className="mb-8">
        <Label as="span" className="text-muted tabular-nums">
          {String(project.order).padStart(2, "0")}
        </Label>
      </p>

      <Grid className="items-start gap-y-8">
        <div
          className={cn(
            "col-span-4 md:col-span-8",
            featured
              ? "lg:col-span-10"
              : mediaFirst
                ? "lg:col-span-7"
                : "lg:col-start-6 lg:col-span-7 lg:row-start-1",
          )}
        >
          <ProjectPreview project={project} priority={featured} />
        </div>

        <div
          className={cn(
            "col-span-4 md:col-span-8",
            featured
              ? "lg:col-span-7"
              : mediaFirst
                ? "lg:col-start-9 lg:col-span-4"
                : "lg:col-start-1 lg:col-span-4 lg:row-start-1",
          )}
        >
          <ProjectMeta project={project} headingId={headingId} featured={featured} />
          <CaseStudyAffordance project={project} labelledBy={headingId} />
        </div>
      </Grid>
    </article>
  );
}

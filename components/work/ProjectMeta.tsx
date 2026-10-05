import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";
import type { ProjectSummary } from "@/lib/content/types";

/**
 * ProjectMeta — Server Component (design.md §7).
 *
 * The textual half of a Selected Work entry: project name as an h3 beneath the
 * section's h2, role · discipline as non-essential muted meta, and the value
 * proposition.
 *
 * Provisional fields (CR-1) are rendered through `ProvisionalValue`, which
 * marks them visibly non-final. Nothing here fabricates a role, discipline or
 * value proposition (CLAUDE.md §17).
 */

type ProjectMetaProps = {
  project: ProjectSummary;
  headingId: string;
  /** The lead project gets a larger name treatment. */
  featured?: boolean;
};

function ProvisionalValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted italic">
      {children}
      <span className="sr-only"> (provisional placeholder — not final content)</span>
    </span>
  );
}

export function ProjectMeta({ project, headingId, featured = false }: ProjectMetaProps) {
  const { name, role, discipline, valueProposition, provisional } = project;

  return (
    <div>
      <Heading as="h3" size={featured ? "xl" : "l"} id={headingId}>
        {name}
      </Heading>

      <p className="mt-4">
        <Label as="span" className="text-muted uppercase">
          {provisional ? <ProvisionalValue>{role}</ProvisionalValue> : role}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {provisional ? (
            <ProvisionalValue>{discipline}</ProvisionalValue>
          ) : (
            discipline
          )}
        </Label>
      </p>

      <Body size={featured ? "l" : "m"} className="mt-6 max-w-prose">
        {provisional ? (
          <ProvisionalValue>{valueProposition}</ProvisionalValue>
        ) : (
          valueProposition
        )}
      </Body>
    </div>
  );
}

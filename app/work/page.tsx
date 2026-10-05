import { ProjectGrid } from "@/components/work/ProjectGrid";
import { createMetadata } from "@/lib/metadata/createMetadata";

/**
 * Work index — Server Component.
 *
 * Renders the same typed `projects` model as the homepage's Selected Work
 * section, through the same `ProjectGrid`, at `level={1}` so this page's
 * heading is its `h1` and project names are `h2`. No separate copy, model or
 * layout is introduced: the homepage section and this route are one component
 * with one content source, so real project content (CR-1/CR-2) lands in both
 * at once.
 *
 * Content state: entries are the approved project identities (blueprint §10)
 * with provisional role/discipline/value-proposition placeholders. No intro
 * or lede is written here, because none is approved (CLAUDE.md §17).
 *
 * The <main> landmark comes from the frozen root layout; this page renders
 * only its content.
 */
export const metadata = createMetadata({
  title: "Work",
  // Factual description of the page, built from the approved positioning
  // vocabulary (product.md) rather than new marketing copy.
  description:
    "Selected work by Aman Mittal — products, systems and experiences designed at scale.",
  path: "/work",
});

export default function Work() {
  return <ProjectGrid level={1} />;
}

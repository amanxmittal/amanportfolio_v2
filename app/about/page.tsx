import { About } from "@/components/sections/About";
import { createMetadata } from "@/lib/metadata/createMetadata";

/**
 * About — Server Component.
 *
 * Renders the same `About` section as the homepage at `level={1}`, so this
 * page's heading is its `h1` and the sub-items are `h2`. One component, one
 * content source: the approved positioning line (blueprint §16) is final, and
 * the four CR-4 items stay visibly provisional until real content is supplied
 * — at which point both the homepage section and this route update together.
 *
 * This page deliberately adds no biography, timeline, employer or tool list:
 * none is approved, and credentials must never be invented (CLAUDE.md §17).
 * When CR-4 lands, the fuller profile belongs here and the homepage section
 * becomes its summary — that split is a content decision, not made here.
 *
 * The <main> landmark comes from the frozen root layout.
 */
export const metadata = createMetadata({
  title: "About",
  // The approved positioning statement (blueprint §16, content.md), used
  // verbatim rather than paraphrased into new copy.
  description:
    "Product designer focused on creating clear, accessible and scalable digital experiences.",
  path: "/about",
});

export default function AboutPage() {
  return <About level={1} />;
}

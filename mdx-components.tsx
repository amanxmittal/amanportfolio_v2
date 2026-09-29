import type { MDXComponents } from "mdx/types";
import { Body } from "@/components/typography/Body";
import { Heading } from "@/components/typography/Heading";

/**
 * Root MDX component mapping, required by @next/mdx under the App Router.
 *
 * Every heading entry sets `as` explicitly so the semantic heading level
 * always matches the MDX source (## -> h2, ### -> h3, ...). Size and semantic
 * level are independent — a heading's visual size never dictates its level,
 * which keeps the document's heading hierarchy correct (WCAG 1.3.1) rather
 * than flattening everything to Heading's default h2.
 *
 * Kept intentionally minimal for this milestone: just enough to render the
 * placeholder case study using the design system's typography primitives.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <Heading as="h1" size="xl" {...props} />,
    h2: (props) => <Heading as="h2" size="l" {...props} />,
    h3: (props) => <Heading as="h3" size="m" {...props} />,
    h4: (props) => <Heading as="h4" size="s" {...props} />,
    p: (props) => <Body size="m" {...props} />,
    ...components,
  };
}

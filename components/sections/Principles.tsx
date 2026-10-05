import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Principles — Server Component (design.md §8; Requirement 4.5).
 *
 * The four approved principles with their approved one-line definitions
 * (blueprint §12), rendered verbatim. Each principle name is an h3 beneath the
 * section h2, so the hierarchy stays unbroken.
 *
 * Layout: 2x2 on desktop via the frozen Grid, stacked on mobile.
 */

// Approved principles and definitions (blueprint §12). Verbatim.
const PRINCIPLES = [
  { name: "Clarity", definition: "Reduce complexity without hiding it." },
  { name: "Systems", definition: "Solve recurring problems systematically." },
  {
    name: "Accessibility",
    definition: "Inclusion is part of the product, not an add-on.",
  },
  {
    name: "Scale",
    definition: "Design decisions should survive beyond a single screen.",
  },
] as const;

export function Principles() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <Heading as="h2" size="xl" id="principles-heading">
          Principles
        </Heading>

        {/*
          Rendered as grid cells rather than a <ul>: the frozen Grid primitive
          declares an `as` generic but its implementation signature resolves to
          "div" only, so `as="ul"` does not typecheck. Grid is a frozen
          Foundation file and is not modified here (reported separately).
          Heading structure carries the semantics, so no ARIA substitute is
          needed (CLAUDE.md §9 — ARIA only where semantics cannot do it).
        */}
        <Grid className="mt-16 gap-y-16 lg:mt-24">
          {PRINCIPLES.map(({ name, definition }, index) => (
            <Reveal
              key={name}
              index={index}
              className="col-span-4 md:col-span-4 lg:col-span-6"
            >
              <Heading as="h3" size="m">
                {name}
              </Heading>
              <Body size="m" className="mt-4 max-w-prose text-muted">
                {definition}
              </Body>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </section>
  );
}

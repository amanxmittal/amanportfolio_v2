import { Container } from "@/components/layout/Container";
import { Display } from "@/components/typography/Display";
import { Body } from "@/components/typography/Body";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Philosophy — Server Component (design.md §8; Requirement 4.1–4.4).
 *
 * Predominantly typographic with minimal chrome, per blueprint §11 and
 * content.md. All copy below is APPROVED and rendered verbatim — the primary
 * statement, the six progressive statements in their approved order, and the
 * closing statement. Nothing is reworded (CLAUDE.md §17).
 *
 * The section h2 IS the primary statement (design.md §8 recommendation), which
 * keeps a single page h1 (the Hero) and a valid hierarchy.
 */

// Approved progressive statements, in approved order (blueprint §11).
const PROGRESSIVE_STATEMENTS = [
  "I design how people understand systems.",
  "How they navigate complexity.",
  "How they recover from mistakes.",
  "How experiences remain consistent across products.",
  "How interfaces work for people with different abilities.",
  "And how all of it works at scale.",
] as const;

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <Display as="h2" size="m" id="philosophy-heading">
          I DON&rsquo;T DESIGN SCREENS.
        </Display>

        <div className="mt-16 flex flex-col gap-6 lg:mt-24">
          {PROGRESSIVE_STATEMENTS.map((statement, index) => (
            <Reveal key={statement} index={index}>
              <Body size="l" className="max-w-prose text-muted">
                {statement}
              </Body>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 lg:mt-24">
          <Body size="l" className="text-ink">
            That&rsquo;s what I design.
          </Body>
        </Reveal>
      </Container>
    </section>
  );
}

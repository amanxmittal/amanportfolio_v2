import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";
import { Reveal } from "@/components/motion/Reveal";

/**
 * About — Server Component (design.md §12).
 *
 * Only the positioning line is approved copy (blueprint §16, content.md) and
 * it is rendered verbatim as final. Everything blueprint §16 additionally asks
 * for — current focus, career timeline, design interests, tools/areas of
 * expertise — is CR-4 and has NOT been supplied.
 *
 * No employer, date, job title, client or tool is invented (CLAUDE.md §17).
 * Each outstanding item renders as a visibly provisional placeholder so the
 * structure is reviewable and real content is a pure data change.
 *
 * Kept concise — blueprint §16 explicitly says this is not a résumé page.
 */

// Structure approved by blueprint §16; the content for each is CR-4.
const ABOUT_ITEMS = [
  "Current focus",
  "Career timeline",
  "Design interests",
  "Tools and areas of expertise",
] as const;

/**
 * Used both as a homepage section (heading h2, sub-items h3) and as the whole
 * of `/about` (heading h1, sub-items h2). `level` shifts both together so the
 * approved positioning copy lives in one place and each route keeps a valid
 * heading hierarchy.
 */
type AboutProps = {
  /** 2 = homepage section (default), 1 = the /about page's own heading. */
  level?: 1 | 2;
};

export function About({ level = 2 }: AboutProps = {}) {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 lg:py-32">
      <Container>
        <Heading as={level === 1 ? "h1" : "h2"} size="xl" id="about-heading">
          About
        </Heading>

        {/* Approved positioning statement (blueprint §16) — final copy. */}
        <Body size="l" className="mt-12 max-w-prose text-ink lg:mt-16">
          Product designer focused on creating clear, accessible and scalable
          digital experiences.
        </Body>

        <Grid className="mt-16 gap-y-12 lg:mt-24">
          {ABOUT_ITEMS.map((item, index) => (
            <Reveal
              key={item}
              index={index}
              className="col-span-4 md:col-span-4 lg:col-span-6"
            >
              <Heading as={level === 1 ? "h2" : "h3"} size="s">
                {item}
              </Heading>
              <Body size="m" className="mt-4 max-w-prose text-muted italic">
                Content required
                <span className="sr-only">
                  {" "}
                  (provisional placeholder &mdash; not final content)
                </span>
              </Body>
            </Reveal>
          ))}
        </Grid>

        <Label as="p" className="mt-16 text-muted uppercase lg:mt-24">
          Profile content pending
        </Label>
      </Container>
    </section>
  );
}

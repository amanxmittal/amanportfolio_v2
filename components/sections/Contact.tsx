import { Container } from "@/components/layout/Container";
import { Display } from "@/components/typography/Display";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Contact — Server Component (design.md §13).
 *
 * The closing CTA and a valid anchor target for the Hero / nav (`#contact`).
 *
 * Approved copy (blueprint §17) rendered verbatim as final: the heading and
 * the supporting line. The three link destinations — Email, LinkedIn, Résumé —
 * are CR-6 and have NOT been supplied, so they render as non-interactive
 * provisional affordances rather than <a> elements pointing at a fabricated
 * address or URL (CLAUDE.md §17; Requirement 9.4 — no dead links).
 *
 * No contact form, per blueprint §17.
 */

// Link destinations are CR-6; the channel names themselves are approved
// (blueprint §17).
const CONTACT_CHANNELS = ["Email", "LinkedIn", "Résumé"] as const;

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <Display as="h2" size="m" id="contact-heading">
          HAVE A GOOD PROBLEM?
        </Display>

        <Reveal className="mt-8">
          <Body size="l" className="max-w-prose text-muted">
            Let&rsquo;s figure it out.
          </Body>
        </Reveal>

        <ul className="mt-16 flex flex-col gap-6 border-t border-border pt-12 lg:mt-24 lg:flex-row lg:gap-16">
          {CONTACT_CHANNELS.map((channel) => (
            <li key={channel}>
              <Label as="span" className="text-muted uppercase">
                {channel} &mdash; content required
                <span className="sr-only">
                  {" "}
                  (provisional placeholder &mdash; link not yet available)
                </span>
              </Label>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

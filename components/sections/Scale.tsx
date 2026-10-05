import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/typography/Heading";
import { Display } from "@/components/typography/Display";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";
import { scaleFigures, hasVerifiedScaleFigures } from "@/lib/content/scale";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Scale — Server Component (design.md §9; Requirement 5).
 *
 * The page's single tonal inversion: `bg-ink` surface with Canvas text and
 * Accent emphasis. No new colour token — all three are existing Foundation
 * tokens (Requirement 5.1, 11.1).
 *
 * CONTENT GATE (OD-4 = gated): no verified figures exist in the repository
 * (CR-3 outstanding), so the section renders a visibly gated state rather than
 * publishing the blueprint's illustrative numbers as fact. The section is NOT
 * removed — the approved homepage section order is preserved (prompt §8,
 * cross-cutting 4). When verified figures land in `lib/content/scale.ts`, the
 * figure list below renders automatically with no structural change.
 *
 * Figures use a <dl> so each value is programmatically associated with its
 * label in the accessibility tree rather than by visual proximity alone
 * (Requirement 5.5).
 *
 * COLOUR OVERRIDE NOTE: the frozen typography primitives hardcode `text-ink`
 * in their own class list. `cn()` only concatenates, and Tailwind resolves
 * same-specificity utilities by CSS source order rather than class order, so a
 * plain `text-canvas` passed via className LOSES to the primitive's `text-ink`
 * and the section renders Ink-on-Ink (invisible). The `!` important modifier
 * is used here to win that conflict. It is not an arbitrary value — the token
 * is still the approved `--color-canvas` / `--color-accent`. The underlying
 * primitive limitation is a frozen-Foundation issue and is reported, not
 * modified here.
 */
export function Scale() {
  const hasFigures = hasVerifiedScaleFigures();

  return (
    <section
      id="scale"
      aria-labelledby="scale-heading"
      className="bg-ink py-24 text-canvas lg:py-32"
    >
      <Container>
        <Heading as="h2" size="xl" id="scale-heading" className="text-canvas!">
          Scale
        </Heading>

        {hasFigures ? (
          <Grid className="mt-16 gap-y-12 lg:mt-24">
            {scaleFigures.map((figure) => (
              /*
                dt (the label) precedes dd (the value) because that is the
                order HTML requires inside a dl. `flex-col-reverse` presents
                the value above the label visually without breaking the
                document order or the accessibility pairing.

                Contrast note: Accent on Ink measures ~3.49:1 — it clears AA
                for LARGE text (3:1) at Display m and above, but NOT the 4.5:1
                normal-text threshold. Accent must not be used for body-size
                text on this dark surface.
              */
              <dl
                key={figure.label}
                className="col-span-4 flex flex-col-reverse md:col-span-4 lg:col-span-3"
              >
                <dt className="mt-4">
                  <Label as="span" className="text-canvas! uppercase">
                    {figure.label}
                  </Label>
                </dt>
                <dd>
                  <Display as="h3" size="m" className="text-accent!">
                    {figure.value}
                  </Display>
                </dd>
              </dl>
            ))}
          </Grid>
        ) : (
          <Reveal className="mt-16 lg:mt-24">
            <Body size="l" className="max-w-prose text-canvas!">
              Figures for this section are pending verification and are not yet
              published.
            </Body>
            <Label as="p" className="mt-6 text-canvas! uppercase">
              Awaiting verified figures
            </Label>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

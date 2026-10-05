import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Display } from "@/components/typography/Display";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";

/**
 * DesignSystem — Server Component (design.md §10; Requirement 6; OD-2).
 *
 * OD-2 resolved to INCLUDE at a shallow / editorial depth: this section exists
 * to communicate design-system thinking as portfolio storytelling, NOT to
 * become interactive documentation. Deliberately absent, per that ruling:
 * token playground, component explorer, documentation navigation, Storybook
 * substitute, or any client island. The whole section is server-rendered with
 * zero JavaScript.
 *
 * The demonstration is honest rather than illustrative: the swatch row below
 * renders THIS project's real Foundation colour tokens via their real Tailwind
 * utilities. Nothing here is a fabricated or mocked-up token.
 *
 * Approved title (blueprint §14) rendered verbatim. The chain and the six
 * areas are the approved structure from blueprint §14.
 */

// Approved relationship chain (blueprint §14).
const CHAIN = ["Token", "Component", "Pattern", "Product", "Ecosystem"] as const;

// Approved interactive-area names (blueprint §14). Rendered as an editorial
// index, not as controls — the shallow depth ruling (OD-2) excludes
// interactivity in this milestone.
const AREAS = [
  "Tokens",
  "Type",
  "Colour",
  "Components",
  "Patterns",
  "Accessibility",
] as const;

// Real Foundation colour tokens (globals.css @theme), shown via their real
// utilities. `border` is included because it is a genuine token in the system.
const COLOUR_TOKENS = [
  { name: "Canvas", className: "bg-canvas" },
  { name: "Surface", className: "bg-surface" },
  { name: "Ink", className: "bg-ink" },
  { name: "Muted", className: "bg-muted" },
  { name: "Border", className: "bg-border" },
  { name: "Accent", className: "bg-accent" },
] as const;

export function DesignSystem() {
  return (
    <section
      id="design-system"
      aria-labelledby="design-system-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <Display as="h2" size="m" id="design-system-heading">
          DESIGN IS A SYSTEM.
        </Display>

        {/* The approved relationship chain, as an editorial progression. */}
        <ol className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 lg:mt-24">
          {CHAIN.map((step, index) => (
            <li key={step} className="flex items-center gap-4">
              <Label as="span" className="text-ink uppercase">
                {step}
              </Label>
              {index < CHAIN.length - 1 ? (
                <span aria-hidden="true" className="text-muted">
                  &rarr;
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <Grid className="mt-16 gap-y-16 lg:mt-24">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            {/*
              Blueprint §14 approves this section's title, chain and area names
              but supplies no body copy, so none is written here (CLAUDE.md
              §17 — no section text beyond what is approved). Tracked as CR-9.
              The chain, the real token swatches and the area index carry the
              section without it.
            */}
            <Body size="m" className="max-w-prose text-muted italic">
              Supporting copy &mdash; content required
              <span className="sr-only">
                {" "}
                (provisional placeholder &mdash; not final content)
              </span>
            </Body>

            {/*
              Real tokens from globals.css @theme. Decorative: each swatch is
              labelled in text beside it, so the colour block itself carries no
              information of its own and needs no accessible name
              (Requirement 9.5/9.6 — never colour alone).
            */}
            <ul className="mt-12 flex flex-col gap-4">
              {COLOUR_TOKENS.map((token) => (
                <li key={token.name} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`inline-block size-8 shrink-0 rounded-sm border border-border ${token.className}`}
                  />
                  <Label as="span" className="text-ink">
                    {token.name}
                  </Label>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-start-8 lg:col-span-5">
            <Label as="p" className="text-muted uppercase">
              Areas
            </Label>
            <ul className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
              {AREAS.map((area) => (
                <li key={area}>
                  <Body size="m" className="text-ink">
                    {area}
                  </Body>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

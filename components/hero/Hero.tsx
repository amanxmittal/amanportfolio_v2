import { Fragment } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Display } from "@/components/typography/Display";
import { Body } from "@/components/typography/Body";
import { Label } from "@/components/typography/Label";
import { HeroReveal } from "./HeroReveal";

/**
 * Hero — Server Component (design.md §5; Requirement 1).
 *
 * Typography-only per OD-6: no imagery, video, canvas or 3D. The approved
 * headline (blueprint §8) is rendered verbatim across its five approved lines,
 * as the page's single <h1>. The approved supporting statement follows,
 * constrained to a readable measure.
 *
 * Static-first: all content is server-rendered and fully legible with no
 * JavaScript. The entrance animation (HeroReveal) is additive presence-only
 * and is NOT required to understand the content (Requirement 1.6, 1.9).
 * Headline, supporting statement and CTA stagger by --duration-fast so they
 * do not all animate at once (blueprint §24.2).
 *
 * The five lines are explicit <span className="block"> elements rather than
 * left to the browser, because the line breaks are approved content
 * (Requirement 1.1), not a styling preference. A plain space text node sits
 * between the lines: whitespace between block boxes renders nothing, so the
 * visual breaks are unchanged, but the heading's text content and accessible
 * name read "DESIGNING PRODUCTS, SYSTEMS & …" rather than running the words
 * together (audit F-08).
 *
 * Desktop sizing (Requirement 1.5, audit F-03): the section is ≈ exactly one
 * viewport, not one viewport plus the header offset. The frozen layout pads
 * <main> with `pt-20` to clear the fixed header; on desktop the Hero cancels
 * that with `lg:-mt-20` and re-applies it inside itself (`lg:pt-24` = the
 * 80px header offset + 16px), so `lg:min-h-svh` measures the whole viewport.
 * `lg:pb-4` (16px) mirrors the 16px above, and `justify-center` distributes
 * any remaining height evenly. All values are on the 8-point scale.
 * `min-h-svh` is a layout utility, not a design token (design.md §5). Mobile
 * does not force a full viewport, which would push the supporting statement
 * off-screen (design.md §5); mobile spacing is unchanged.
 */

const HEADLINE_LINES = [
  "DESIGNING",
  "PRODUCTS,",
  "SYSTEMS &",
  "EXPERIENCES",
  "AT SCALE.",
] as const;

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="flex flex-col justify-center py-24 lg:-mt-20 lg:min-h-svh lg:pt-24 lg:pb-4"
    >
      <Container>
        <HeroReveal index={0}>
          <Display as="h1" size="xl" id="hero-heading">
            {HEADLINE_LINES.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? " " : null}
                <span className="block">{line}</span>
              </Fragment>
            ))}
          </Display>
        </HeroReveal>

        <HeroReveal index={1} className="mt-12">
          <Body size="l" className="max-w-prose text-muted">
            Product designer working across digital products, design systems and
            accessible experiences used at scale.
          </Body>
        </HeroReveal>

        {/*
          Restrained in-page CTA (Requirement 1.7). Anchors to the Selected
          Work section, which exists in this milestone — never a dead link or
          an out-of-scope route. The hover affordance (Accent colour + arrow
          nudge) is mirrored on :focus-visible (Requirement 3.6, audit F-09);
          it sits alongside the global 2px focus ring, never replacing it.
        */}
        <HeroReveal index={2} className="mt-12 lg:mt-8">
          <Link
            href="#selected-work"
            className="group inline-flex min-h-11 items-center gap-3 rounded-sm text-ink transition-[color] duration-(--duration-fast) hover:text-accent focus-visible:text-accent"
          >
            <Label as="span" className="uppercase">
              Selected work
            </Label>
            <span
              aria-hidden="true"
              className="transition-transform duration-(--duration-fast) ease-standard group-hover:translate-y-1 group-focus-visible:translate-y-1"
            >
              ↓
            </span>
          </Link>
        </HeroReveal>
      </Container>
    </section>
  );
}

"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils/cn";

/**
 * Reveal — the single reusable entrance primitive (design.md §14; Task 2).
 *
 * A thin client wrapper that animates PRESENCE only. Children are built in
 * Server Components and passed through, so the content itself never enters the
 * client bundle — the same pattern the frozen HeaderShell uses.
 *
 * ---------------------------------------------------------------------------
 * Why this animates transform only, and not opacity
 * ---------------------------------------------------------------------------
 * design.md's motion tables originally specified `opacity 0 -> 1` plus a small
 * translateY (now amended — see requirements.md → Recorded resolutions). That
 * cannot be combined with the same spec's static-first rule
 * (Requirement 8.5; design.md §5: "if it fails to hydrate, the content is
 * already visible"), because Motion serialises `initial` into the server HTML.
 * Measured on this build: with `initial={{ opacity: 0 }}`, 21 elements shipped
 * as `style="opacity:0;transform:translateY(8px)"` — i.e. the homepage's
 * content is invisible to anyone whose JavaScript does not run.
 *
 * Two workarounds were implemented and measured, and both failed:
 *   1. Render a plain <div> pre-hydration and swap to <motion.div> after.
 *      SSR-safe, but React treats them as different component types and
 *      remounts the node; the IntersectionObserver behind `whileInView` then
 *      attached only intermittently and whole sections stayed stuck at
 *      opacity 0 — content hidden by a race.
 *   2. Keep one <motion.div> and swap only the variant definitions.
 *      Reliable, but Motion applies `initial` at mount only, so the hidden
 *      state is never armed and no animation runs at all (verified: inline
 *      style null, opacity 1 before scroll).
 *
 * Animating transform alone resolves it: Motion serialises
 * `transform: translateY(8px)`, which offsets content by 8px but never hides
 * it. No gate, no remount, one observer — so the reveal is reliable — and a
 * no-JS or failed-hydration visitor reads every word.
 *
 * STATUS: APPROVED. Aman approved transform-only as the resolution for the
 * Portfolio Experience milestone: static-first takes precedence over the
 * opacity-fade portion of design.md §14, because hiding server-rendered
 * content before hydration violates the intended no-JS behaviour.
 * Do NOT reintroduce `opacity: 0`, and do not attempt another SSR/hydration
 * workaround (component remounting, delayed motion replacement, CSS opacity
 * gates, hydration-dependent visibility, or JS visibility gates) — all were
 * evaluated and rejected. This decision is closed.
 *
 * ---------------------------------------------------------------------------
 * Reduced motion (Requirement 8.4) — same element in both modes
 * ---------------------------------------------------------------------------
 * The rendered element never changes with the motion preference. The server
 * cannot know the preference, so it always serialises `initial`
 * (`transform: translateY(8px)`). An earlier version returned a plain <div>
 * when reduced motion was set; React does not patch attribute mismatches
 * during hydration, so that left every wrapper stuck 8px down for
 * reduced-motion users (audit F-02).
 *
 * Two layers now resolve it, neither touching visibility:
 *   1. `motion-reduce:transform-none!` — a CSS reset that beats Motion's
 *      inline transform for reduced-motion users before hydration, without
 *      JavaScript, and for wrappers that never enter the viewport.
 *   2. `useReducedMotion()` → zero-duration transition, so Motion itself
 *      settles any reveal instantly instead of running the animation. The
 *      global CSS reduced-motion block cannot stop JS-driven motion, hence
 *      the JS branch. Only the transition config changes, not the markup.
 *
 * `transform` is compositor-only, so revealing causes no layout shift.
 *
 * ---------------------------------------------------------------------------
 * LazyMotion
 * ---------------------------------------------------------------------------
 * `m` + `LazyMotion features={domAnimation}` is Motion's officially supported
 * reduced-bundle configuration. `domAnimation` includes the `inView` gesture
 * behind `whileInView` and the animation feature; nothing else is needed.
 * `strict` makes accidental use of the full `motion.*` component an error.
 * `m` is imported from `motion/react-m` (Motion's documented entry for this
 * pattern): taking it from `motion/react` keeps the full `motion` component
 * in the bundle. Measured on `/` (gzip -9, vs. the Foundation-only /about):
 * full `motion.div` +44,895 B → `m` via motion/react +40,847 B →
 * `m` via motion/react-m +31,231 B.
 */

/**
 * Motion expresses time in seconds. These MUST equal the Foundation tokens —
 * the same approved values, not independent magic numbers:
 *   0.4 === --duration-standard (400ms)
 *   0.2 === --duration-fast     (200ms)
 * `easeOut` is the curve behind --ease-standard (`ease-out`).
 * Verified against the shipped stylesheet: --duration-standard:.4s,
 * --duration-fast:.2s, --ease-standard:ease-out.
 */
const DURATION_STANDARD = 0.4;
const STAGGER_STEP = 0.2;
const TRAVEL_PX = 8;
const MAX_STAGGER_STEPS = 4;

/**
 * Shared with HeroReveal so both wrappers resolve reduced motion identically.
 * `transform-none` with the important modifier is needed because Motion
 * writes the transform as an inline style.
 */
export const REDUCED_MOTION_RESET = "motion-reduce:transform-none!";
/** Settle instantly: Motion reaches the final state without animating. */
export const REDUCED_MOTION_TRANSITION = { duration: 0 } as const;

type RevealProps = {
  children: ReactNode;
  /**
   * Stagger position. Each step delays by --duration-fast so a group reveals
   * in sequence rather than all at once (blueprint §24.2). Capped so a long
   * list never accumulates a long wait.
   */
  index?: number;
  /** Forwarded so callers keep grid placement on the wrapper, not inside it. */
  className?: string;
};

export function Reveal({ children, index = 0, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={cn(REDUCED_MOTION_RESET, className)}
        initial={{ y: TRAVEL_PX }}
        whileInView={{ y: 0 }}
        // Fires once; never re-triggers disruptively on scroll-up (Req 8.6).
        viewport={{ once: true }}
        transition={
          prefersReducedMotion
            ? REDUCED_MOTION_TRANSITION
            : {
                duration: DURATION_STANDARD,
                delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP,
                ease: "easeOut",
              }
        }
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

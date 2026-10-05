"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

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
 * design.md §14's motion table specifies `opacity 0 -> 1` plus a small
 * translateY. That cannot be combined with the same spec's static-first rule
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
 * Reduced motion (Requirement 8.4) is branched in JS because the global CSS
 * reduced-motion block cannot stop JS-driven motion.
 *
 * `transform` is compositor-only, so revealing causes no layout shift.
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

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: TRAVEL_PX }}
      whileInView={{ y: 0 }}
      // Fires once; never re-triggers disruptively on scroll-up (Req 8.6).
      viewport={{ once: true }}
      transition={{
        duration: DURATION_STANDARD,
        delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  REDUCED_MOTION_RESET,
  REDUCED_MOTION_TRANSITION,
} from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

/**
 * HeroReveal — Hero entrance wrapper (design.md §5 motion table).
 *
 * Differs from `Reveal` in one respect only: the Hero is above the fold at
 * load, so its trigger is MOUNT, not scroll-into-view. The static-first
 * reasoning, the transform-only animated property, the reduced-motion
 * handling (same element in both modes; CSS reset + zero-duration
 * transition), the LazyMotion configuration and the token-equal timings are
 * identical — see components/motion/Reveal.tsx for the full rationale and the
 * measurements behind it.
 *
 * Static-first matters most here: the Hero carries the page's only <h1> and
 * the approved headline. It is server-rendered and fully legible before any
 * JavaScript runs; this wrapper only animates presence on top (Requirement
 * 1.9 — the animation never gates or delays content).
 *
 * Kept as a separate component rather than adding a `trigger` prop to
 * `Reveal`, because a two-mode primitive would be configuration where
 * composition is clearer (CLAUDE.md §4).
 */

// Token-equal values (see Reveal.tsx):
//   0.4 === --duration-standard (400ms), 0.2 === --duration-fast (200ms)
//   easeOut === the curve behind --ease-standard
const DURATION_STANDARD = 0.4;
const STAGGER_STEP = 0.2;
const TRAVEL_PX = 8;

type HeroRevealProps = {
  children: ReactNode;
  /** Stagger position: headline, then supporting statement, then CTA. */
  index?: number;
  className?: string;
};

export function HeroReveal({ children, index = 0, className }: HeroRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={cn(REDUCED_MOTION_RESET, className)}
        initial={{ y: TRAVEL_PX }}
        animate={{ y: 0 }}
        transition={
          prefersReducedMotion
            ? REDUCED_MOTION_TRANSITION
            : {
                duration: DURATION_STANDARD,
                delay: index * STAGGER_STEP,
                ease: "easeOut",
              }
        }
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

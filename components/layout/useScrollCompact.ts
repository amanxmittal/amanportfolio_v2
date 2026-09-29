import { useEffect, useState } from "react";

// No `"use client"` directive here: this hook is only imported by HeaderShell,
// which already carries the directive, and Requirement 11.7 restricts the
// `"use client"` files in components/ to HeaderShell.tsx and MobileNav.tsx.
// A hook module inherits the client boundary from its client consumer; it does
// not need (and per 11.7 must not add) its own directive.

/**
 * useScrollCompact — the one canonical scroll-state hook for the header
 * (design.md §7). Tracks a single boolean: whether the page has scrolled past
 * a small threshold. Consumed by HeaderShell to toggle `data-scrolled`, which
 * drives the CSS-only compaction/blur/border treatment.
 *
 * Performance (INP): Header sits in the root layout, so its listener runs on
 * every route and every scroll frame. To avoid firing a React state update on
 * every scroll event, the handler is:
 *   - registered with `{ passive: true }` (never blocks scrolling), and
 *   - rAF-throttled (one read per frame), and
 *   - gated by a threshold comparison so `setState` only runs when the boolean
 *     actually flips — not on every frame.
 */
export function useScrollCompact(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    let latest = scrolled;

    const evaluate = () => {
      frame = 0;
      const next = window.scrollY > threshold;
      // Gate the state update: only re-render when the boolean flips.
      if (next !== latest) {
        latest = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      // Coalesce multiple scroll events into a single read per frame.
      if (frame === 0) {
        frame = window.requestAnimationFrame(evaluate);
      }
    };

    // Sync once on mount in case the page is loaded already scrolled
    // (e.g. reload at an anchor, or restored scroll position).
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
    // `threshold` is the only input; `scrolled` is intentionally read once for
    // the initial `latest` seed and not a dependency (the ref-like `latest`
    // local tracks live state inside the effect).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return scrolled;
}

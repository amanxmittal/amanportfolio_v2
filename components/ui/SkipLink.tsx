import { cn } from "@/lib/utils/cn";

/**
 * SkipLink — Server Component (design.md §8, §12(A); Req 12.2).
 *
 * A plain anchor to `#main`, rendered as the FIRST focusable element in the
 * DOM (root layout composes it before Header). It is visually hidden until
 * focused via Tailwind's `sr-only` + `focus:not-sr-only` pair: `sr-only`
 * removes it from the visual layout while keeping it in the accessibility
 * tree and tab order, and `focus:not-sr-only` restores normal rendering the
 * moment it receives keyboard focus.
 *
 * On focus it becomes a visible, positioned control in the top-left, above
 * the fixed header (`z-[100]` clears the header's `z-50`). Activating it
 * moves focus to `#main`, which carries `tabIndex={-1}` in the layout so the
 * browser actually lands focus there — the next `Tab` then continues into
 * page content rather than returning to the nav.
 *
 * No client JS: this is just an anchor. The globally shared `:focus-visible`
 * outline (globals.css) provides the focus ring; token-backed accent
 * background + surface text give adequate contrast when shown.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only",
        "focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]",
        "focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-sm",
        "focus:bg-accent focus:px-4 focus:py-2 focus:font-body focus:text-surface",
      )}
    >
      Skip to content
    </a>
  );
}

import { cn } from "@/lib/utils/cn";

type GridTag = "div" | "section" | "ul" | "ol";

type GridProps<T extends GridTag = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "className"> & {
    className?: string;
  };

/**
 * Grid — Server Component. Renders the responsive column grid from
 * design.md §4, mobile-first:
 *
 *   base (<768px)  → grid-template-columns: repeat(4, 1fr)
 *   md:  (≥768px)  → repeat(8, 1fr)
 *   lg:  (≥1024px) → repeat(12, 1fr)
 *
 * Only `md:`/`lg:` variants are used — no `sm:`/`xl:`/`2xl:`. These map to the
 * explicit `--breakpoint-md` (768px) / `--breakpoint-lg` (1024px) tokens in
 * globals.css @theme.
 *
 * Children place themselves with `col-span-*` utilities
 * (e.g. `col-span-4 md:col-span-6`).
 *
 * Intentionally breaking the grid (design-system.md: "grid is a guide, not a
 * constraint", Requirement 6.4) is a documented opt-out: pass a `className`
 * that overrides the column definition (e.g. `className="grid-cols-1"` or a
 * non-grid layout) rather than it being the default behaviour.
 */
export function Grid({ as, children, className, ...rest }: GridProps) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

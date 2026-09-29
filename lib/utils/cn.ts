// Dependency-free classnames join. Deliberately NOT clsx + tailwind-merge:
// the typography and layout primitives apply a fixed size map plus an optional
// `className` override, so there is no conflicting-utility problem for
// tailwind-merge to solve and no conditional-class API needed from clsx.
// See design.md §5.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

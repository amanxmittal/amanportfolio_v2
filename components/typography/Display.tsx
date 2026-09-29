import { cn } from "@/lib/utils/cn";
import { typeScale } from "./scale";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type DisplaySize = "xl" | "l" | "m";

const sizeMap: Record<DisplaySize, string> = {
  xl: typeScale.displayXl,
  l: typeScale.displayL,
  m: typeScale.displayM,
};

type DisplayProps = {
  as?: HeadingTag;
  size?: DisplaySize;
} & Omit<React.ComponentPropsWithoutRef<HeadingTag>, "className"> & {
    className?: string;
  };

/**
 * Display — large expressive headlines. Renders a semantic heading element
 * (default h1). The clamp() size is applied inline (component-level clamp,
 * not a Tailwind text-* token per design.md §4); leading/tracking come from
 * token-backed utilities. Consuming site owns heading hierarchy via `as`.
 */
export function Display({
  as = "h1",
  size = "xl",
  children,
  className,
  style,
  ...rest
}: DisplayProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-display text-ink leading-display tracking-display", className)}
      style={{ fontSize: sizeMap[size], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

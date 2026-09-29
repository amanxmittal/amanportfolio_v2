import { cn } from "@/lib/utils/cn";
import { typeScale } from "./scale";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingSize = "xl" | "l" | "m" | "s";

const sizeMap: Record<HeadingSize, string> = {
  xl: typeScale.headingXl,
  l: typeScale.headingL,
  m: typeScale.headingM,
  s: typeScale.headingS,
};

type HeadingProps = {
  as?: HeadingTag;
  size?: HeadingSize;
} & Omit<React.ComponentPropsWithoutRef<HeadingTag>, "className"> & {
    className?: string;
  };

/**
 * Heading — section headings. Renders a semantic heading element (default h2).
 * The clamp() size is applied inline; leading/tracking come from token-backed
 * utilities. Consuming site owns heading hierarchy via `as`.
 */
export function Heading({
  as = "h2",
  size = "l",
  children,
  className,
  style,
  ...rest
}: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-display text-ink leading-heading tracking-heading", className)}
      style={{ fontSize: sizeMap[size], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

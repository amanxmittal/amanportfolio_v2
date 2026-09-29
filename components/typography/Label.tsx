import { cn } from "@/lib/utils/cn";
import { typeScale } from "./scale";

type LabelTag = "span" | "p";

type LabelProps = {
  as?: LabelTag;
} & Omit<React.ComponentPropsWithoutRef<LabelTag>, "className"> & {
    className?: string;
  };

/**
 * Label — eyebrow-style labels / captions at caption size. Renders a span by
 * default (or p). Uses the body font with caption leading/tracking tokens.
 */
export function Label({ as = "span", children, className, style, ...rest }: LabelProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-body text-ink leading-caption tracking-caption", className)}
      style={{ fontSize: typeScale.caption, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

import { cn } from "@/lib/utils/cn";

type ContainerTag = "div" | "section" | "article" | "main" | "header" | "footer";

type ContainerProps<T extends ContainerTag = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "className"> & {
    className?: string;
  };

/**
 * Container — Server Component. Centers content and applies the max-width +
 * responsive horizontal padding from design.md §4 (content-box reading).
 *
 * The inner content area caps at a true 1440px (`--grid-max-width`), with the
 * page margin (`--grid-margin`, clamp(20px, 4vw, 64px)) applied as additional
 * padding inside a wider outer box:
 *
 *   max-width:      calc(var(--grid-max-width) + 2 * var(--grid-margin))
 *   padding-inline: var(--grid-margin)
 *
 * so content width is not carved out of a 1440px outer box. Favors composition
 * (children/slots) over config props; `as` gives semantic flexibility and
 * `className` allows overrides. No visual styling beyond layout.
 */
export function Container({
  as,
  children,
  className,
  style,
  ...rest
}: ContainerProps) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn("mx-auto w-full", className)}
      style={{
        maxWidth: "calc(var(--grid-max-width) + 2 * var(--grid-margin))",
        paddingInline: "var(--grid-margin)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

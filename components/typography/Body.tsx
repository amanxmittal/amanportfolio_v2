import { cn } from "@/lib/utils/cn";
import { typeScale } from "./scale";

type BodySize = "l" | "m" | "s";

const sizeMap: Record<BodySize, string> = {
  l: typeScale.bodyL,
  m: typeScale.bodyM,
  s: typeScale.bodyS,
};

type BodyProps = {
  size?: BodySize;
} & Omit<React.ComponentPropsWithoutRef<"p">, "className"> & {
    className?: string;
  };

/**
 * Body — paragraph text. Renders a <p>. Static font sizes (no clamp needed);
 * leading/tracking come from token-backed body utilities. Uses the body font.
 */
export function Body({ size = "m", children, className, style, ...rest }: BodyProps) {
  return (
    <p
      className={cn("font-body text-ink leading-body tracking-body", className)}
      style={{ fontSize: sizeMap[size], ...style }}
      {...rest}
    >
      {children}
    </p>
  );
}

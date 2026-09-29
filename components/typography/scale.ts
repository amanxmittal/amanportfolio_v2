// Type scale — component-level clamp() values (not a Tailwind text-* token),
// since each level needs distinct min/preferred/max values to hit both the
// desktop reference (design-system.md) and the mobile target.
//
// Clamp arithmetic (design.md §4): each clamp's vw coefficient is derived so
// the value reaches its desktop-reference size at exactly the 1440px reference
// width. Display XL is the corrected entry:
//   at 1440px: 2.1rem (33.6px) + 6vw × 14.4px = 33.6 + 86.4 = 120.0px
//   at 375px:  33.6px + 6% × 375px (22.5px)   = 56.1px (≈56px)
export const typeScale = {
  displayXl: "clamp(3.5rem, 2.1rem + 6vw, 7.5rem)", // 56px @375 → 120px @1440
  displayL: "clamp(3rem, 2.5rem + 3.4vw, 5.5rem)", // 88px desktop
  displayM: "clamp(2.5rem, 2rem + 2.5vw, 4rem)", // 64px desktop
  headingXl: "clamp(2rem, 1.75rem + 1.5vw, 3rem)", // 48px desktop
  headingL: "clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)", // 40px
  headingM: "clamp(1.5rem, 1.35rem + 1vw, 2rem)", // 32px
  headingS: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)", // 24px
  bodyL: "1.25rem", // 20px — static, doesn't need clamp
  bodyM: "1rem", // 16px
  bodyS: "0.875rem", // 14px
  caption: "0.75rem", // 12px
} as const;

export type TypeScaleToken = keyof typeof typeScale;

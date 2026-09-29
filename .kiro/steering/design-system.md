---
inclusion: always
---

# Design System Tokens

Source of truth: `IMPLEMENTATION_BLUEPRINT.md` §18-26.

All colours, type sizes, spacing, radius and motion values used in
implementation must come from these tokens. Do not introduce arbitrary
one-off values inside components — extend the token set deliberately instead.

## Typography

Primary display font: Space Grotesk
Secondary font: Inter

Use variable font files where possible. Do not load unnecessary font weights.

Type scale (desktop reference, use `clamp()` for responsive scaling — not
rigid desktop/mobile breakpoint jumps):

| Token        | Size  |
|--------------|-------|
| Display XL   | 120px |
| Display L    | 88px  |
| Display M    | 64px  |
| Heading XL   | 48px  |
| Heading L    | 40px  |
| Heading M    | 32px  |
| Heading S    | 24px  |
| Body L       | 20px  |
| Body M       | 16px  |
| Body S       | 14px  |
| Caption      | 12px  |

Mobile Display XL target: approximately 56px.

## Colour

| Token   | Value   |
|---------|---------|
| Canvas  | #F5F5F2 |
| Surface | #FFFFFF |
| Ink     | #111111 |
| Muted   | #6B6B68 |
| Border  | #D9D9D4 |
| Accent  | #3155FF |

All colours must be tokens. Do not introduce arbitrary colours inside
components. Add semantic colours only where necessary.

## Grid

- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns
- Max content width: 1440px
- Page margin: `clamp(20px, 4vw, 64px)`

The grid is a guide, not a constraint — typography and imagery may
intentionally break it where that serves the editorial direction.

## Spacing

8-point foundation. Base values: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96,
128, 160, 192.

Large editorial sections may use bigger values where visually justified.
Avoid arbitrary one-off spacing values.

## Radius

| Token       | Value |
|-------------|-------|
| Small       | 8px   |
| Default     | 12px  |
| Large media | 20px  |
| Pills       | 999px |

Avoid excessive card treatment — this is an editorial site, not a SaaS
dashboard.

## Motion

Timing tokens:

| Token     | Duration    |
|-----------|-------------|
| Instant   | 100ms       |
| Fast      | 200ms       |
| Standard  | 400ms       |
| Slow      | 700ms       |
| Cinematic | 1000–1400ms |

Cinematic motion is reserved for major storytelling moments (e.g. the hero
signature transition), not general UI.

Default easing: `ease-out`. Use custom easing only where physically
justified.

### Motion principles (binding)

1. Content must work without animation.
2. Never animate everything simultaneously.
3. Do not delay content for animation.
4. Never use perpetual motion without purpose.
5. Respect `prefers-reduced-motion`.
6. Animations must remain interruptible.
7. Avoid excessive parallax.
8. Avoid scroll hijacking.
9. Keep animations GPU-friendly (transform/opacity, not layout properties).
10. Do not use animation to compensate for weak information architecture.

## Accessibility

Target: WCAG 2.2 AA.

Full WCAG validation requires manual testing with assistive technologies and
expert review — automated checks and this steering file support that process
but don't replace it.

Requirements:

- Semantic HTML
- Correct heading hierarchy
- Keyboard navigation
- Visible focus states
- Accessible names
- ARIA only when necessary (prefer semantic elements first)
- Colour contrast (AA)
- Reduced motion support
- Meaningful alt text
- Logical tab order
- Skip navigation link
- Accessible mobile navigation (focus management, Escape to close)
- Adequate touch targets
- No hover-only information
- No colour-only information

The portfolio itself is a demonstration of accessibility expertise — treat
accessibility bugs with the same severity as visual or functional bugs.

## Performance

Performance is a first-class requirement, not a phase-18 afterthought.

Priorities:

- Server Components by default
- Minimal client JavaScript
- Optimized images (responsive sizes, AVIF/WebP)
- SVG for diagrams/icons
- Minimal font weights loaded
- Lazy-load below-the-fold media
- Avoid unnecessary third-party scripts
- Avoid large dependencies
- Avoid hydration where unnecessary

Target excellent Core Web Vitals: LCP, CLS, INP.

Do not add loading screens purely for visual effect.

# Requirements — Portfolio Foundation

## Source of truth

`IMPLEMENTATION_BLUEPRINT.md` and `.kiro/steering/*.md` (product, design-system,
content, structure, tech, review-process). Where this document is silent or
ambiguous, those files govern. Any conflict must be flagged, not resolved
silently.

## Milestone intent

This is **Phase 1–4** of the blueprint's implementation order (§34): project
setup, design tokens, global typography/layout, and navigation shell. It
establishes the technical and visual foundation of the site — not the
homepage content, hero, or any section below the navigation shell.

A generic `/`, `/work`, `/work/[slug]`, `/think`, `/build`, and `/about` route
must exist and render without error, but their bodies are placeholder content
only (e.g. a heading and short "coming soon" style note), not final copy.

## Out of scope (explicit)

The following are **not** part of this milestone and must not be built,
scaffolded, or partially implemented as a side effect of foundation work:

- Complete homepage section stack (Hero, Signature transition, Selected Work,
  Philosophy, Principles, Scale, Design System, Playground, About, Contact)
- Hero copy, hero layout, or hero animation of any kind
- Scroll-driven / signature typography transition
- Case-study content, layout, or MDX rendering beyond the generic content
  pipeline plumbing needed to prove it works
- `/playground`, `/uses`, `/now` routes or any playground content
- Design-system playground (interactive token/component/pattern explorer)
- Final homepage or about/contact copy beyond what's approved in
  `content.md`
- Analytics/tracking of any kind
- Deployment configuration or Vercel-specific setup beyond what Next.js
  requires to build and run locally
- Any content, statistics, or metrics not already present in the blueprint
  or steering files

## Requirement 1 — Next.js App Router project setup

**User story:** As the implementation agent, I want a correctly initialized
Next.js App Router project, so that all future feature work has a working,
typed, lintable foundation to build on.

### Acceptance criteria

1. WHEN the project is initialized THEN the system SHALL use Next.js with the
   App Router (`app/` directory), not the Pages Router.
2. WHEN dependencies are selected THEN the system SHALL use only packages
   from the approved stack in `tech.md` (Next.js, React, TypeScript,
   Tailwind CSS, Motion for React, MDX, Lucide, `next/image`) plus the
   minimal supporting tooling (ESLint, type packages) needed to run them.
3. IF a dependency is not on the approved list THEN the system SHALL stop and
   request approval before adding it, per `tech.md` dependency policy.
4. WHEN the project is built THEN the system SHALL produce a successful
   production build (`next build`) with zero TypeScript errors and zero
   ESLint errors.
5. WHEN package versions are chosen THEN the system SHALL pin exact or
   narrowly-ranged versions in `package.json` rather than open ranges (e.g.
   `"next": "16.3.7"` not `"next": "*"`).
6. WHEN the repository is scaffolded THEN the system SHALL follow the
   directory structure defined in `structure.md`, creating only the
   directories needed for this milestone (no empty placeholder folders for
   out-of-scope features like `playground/` content or `system/` playground
   components).
7. WHEN the runtime is selected THEN the system SHALL require Node.js
   `>= 20.9` (the minimum supported by Next.js 16), and SHALL prefer
   Node.js 22 LTS for local development where the toolchain is compatible.
8. WHEN the project is initialized THEN the system SHALL verify the locally
   installed Node.js version meets the minimum before proceeding (e.g. via
   `node --version` check and/or an `engines` field in `package.json`).

## Requirement 2 — TypeScript configuration

**User story:** As a developer, I want strict TypeScript configuration, so
that type errors are caught early and content models are reliably typed.

### Acceptance criteria

1. WHEN `tsconfig.json` is created THEN the system SHALL enable `strict`
   mode.
2. WHEN path aliases are needed THEN the system SHALL configure a base import
   alias (e.g. `@/*` → project root) to avoid deep relative imports.
3. WHEN the project is type-checked (`tsc --noEmit`) THEN the system SHALL
   report zero errors.
4. IF a file requires `any` THEN the system SHALL avoid it in favor of a
   proper type, `unknown`, or a generic — `any` is a last resort and must be
   justified in a comment if used.

## Requirement 3 — Tailwind CSS setup

**User story:** As a developer, I want Tailwind CSS configured with the
project's design tokens, so that utility classes map directly to the
approved visual system instead of arbitrary values.

### Acceptance criteria

1. WHEN Tailwind is installed THEN the system SHALL use the current stable
   Tailwind CSS major version with its CSS-first (`@theme`) configuration
   approach.
2. WHEN design tokens are defined THEN the system SHALL express them as
   Tailwind theme extensions (colour, font size, spacing, radius, easing/
   duration) rather than hardcoding values inside components.
3. WHEN a component needs a one-off value THEN the system SHALL prefer an
   existing token; introducing a new arbitrary value SHALL require adding it
   to the token set first, per `design-system.md`.
4. WHEN global styles are loaded THEN the system SHALL include Tailwind's
   base/utilities in a single `app/globals.css` entry point.

## Requirement 4 — Design tokens

**User story:** As a developer, I want a single source of truth for colour,
type, spacing, radius, and motion tokens, so that visual consistency is
enforced structurally rather than by convention.

### Acceptance criteria

1. WHEN colour tokens are defined THEN the system SHALL implement exactly:
   Canvas `#F5F5F2`, Surface `#FFFFFF`, Ink `#111111`, Muted `#6B6B68`,
   Border `#D9D9D4`, Accent `#3155FF` — no additional colours unless a
   semantic need is documented (e.g. focus-ring derived from Accent).
2. WHEN spacing tokens are defined THEN the system SHALL implement the
   8-point scale: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192.
3. WHEN radius tokens are defined THEN the system SHALL implement: Small 8px,
   Default 12px, Large media 20px, Pills 999px.
4. WHEN motion timing tokens are defined THEN the system SHALL implement:
   Instant 100ms, Fast 200ms, Standard 400ms, Slow 700ms, Cinematic
   1000–1400ms, with default easing `ease-out`.
5. WHEN tokens are consumed THEN the system SHALL expose them through
   Tailwind theme values (e.g. `bg-canvas`, `text-ink`, `rounded-lg`) so
   components never hardcode hex values or pixel magic numbers. The
   approved 8-point spacing scale is consumed via Tailwind's **existing**
   numeric spacing utilities (`p-6` = 24px, `p-16` = 64px, per the mapping
   in `design.md` §4) — the system SHALL NOT redefine the `--spacing-*`
   namespace, since doing so silently changes the meaning of stock
   utilities like `p-4`/`gap-8`.
6. IF a token value in this spec conflicts with `design-system.md` THEN the
   system SHALL treat `design-system.md` as authoritative and flag the
   discrepancy.
7. WHEN motion duration tokens are consumed THEN the system SHALL reference
   them via the named custom properties defined in `design.md` §4 (e.g.
   `duration-(--duration-standard)`), NOT via a `--duration-*` `@theme`
   namespace (which Tailwind v4 does not provide) and NOT via arbitrary
   values like `duration-[400ms]`.

## Requirement 5 — Typography system

**User story:** As a developer, I want a typed, tokenized typography system,
so that headings and body text are consistent, responsive, and performant.

### Acceptance criteria

1. WHEN fonts are loaded THEN the system SHALL use Space Grotesk (display)
   and Inter (secondary) as variable fonts via `next/font`, loading only the
   weights actually used.
2. WHEN the type scale is implemented THEN the system SHALL provide tokens
   for Display XL/L/M, Heading XL/L/M/S, Body L/M/S, and Caption matching the
   desktop reference sizes in `design-system.md` (120/88/64/48/40/32/24/
   20/16/14/12px).
3. WHEN type scales render across viewports THEN the system SHALL use
   `clamp()`-based responsive sizing rather than fixed breakpoint jumps,
   with Display XL clamping down to approximately 56px on mobile.
4. WHEN typography primitives are built THEN the system SHALL expose them as
   reusable components (e.g. `Display`, `Heading`, `Body`, `Label`) in
   `components/typography/` per `structure.md`, rendering semantic HTML
   elements (`h1`–`h6`, `p`, `span`) rather than generic `div`s with visual
   styling only.
5. WHEN no content exists yet for a route THEN placeholder text SHALL use
   clearly provisional copy (e.g. "Work index — coming soon") and SHALL NOT
   be styled or worded to resemble final approved copy from `content.md`.
6. WHEN typography renders THEN the system SHALL apply the approved
   line-height (leading) and letter-spacing (tracking) tokens per level —
   Display: leading 0.95 / tracking −0.02em; Heading: leading 1.05 /
   tracking −0.015em; Body: leading 1.6 / tracking 0; Small/Caption:
   leading 1.5 / tracking 0. These SHALL be represented as explicit design
   tokens (`--leading-*` / `--tracking-*`, per `design.md` §4) and consumed
   as token-backed utilities (`leading-*`/`tracking-*`), NOT as arbitrary
   values (`leading-[0.95]`, `tracking-[-0.02em]`).

## Requirement 6 — Responsive grid system

**User story:** As a developer, I want a shared grid primitive, so that
every page and section aligns to the same column structure.

### Acceptance criteria

1. WHEN the grid is implemented THEN the system SHALL support 12 columns on
   desktop, 8 on tablet, 4 on mobile, using the explicit breakpoint
   boundaries fixed in `design.md` §4 (mobile base `<768px` = 4 cols;
   tablet `md:` `768–1023px` = 8 cols; desktop `lg:` `≥1024px` = 12 cols).
2. WHEN content width is constrained THEN the system SHALL cap max **content**
   width at a true 1440px with page margin `clamp(20px, 4vw, 64px)` as
   additional gutter outside that content width (the content-box reading
   fixed in `design.md` §4), not a margin carved out of a 1440px outer box.
3. WHEN the grid primitive is built THEN the system SHALL expose it as a
   reusable `Container`/`Grid` component in `components/layout/` usable by
   any route or section without duplicating grid CSS.
4. IF a section needs to intentionally break the grid (per
   `design-system.md`, "grid is a guide, not a constraint") THEN the system
   SHALL allow this as an explicit, documented opt-out rather than the
   default behavior.

## Requirement 7 — Spacing system

**User story:** As a developer, I want spacing values sourced from the
8-point token scale, so that vertical and horizontal rhythm stays consistent
across the site.

### Acceptance criteria

1. WHEN any component or layout applies margin, padding, or gap THEN the
   system SHALL use a spacing token (Tailwind spacing scale mapped to
   Requirement 4.2) rather than an arbitrary pixel value.
2. IF an editorial section requires a larger value than the base scale THEN
   the system SHALL extend the token scale deliberately (documented in
   `design.md`) rather than introducing an unregistered one-off value.

## Requirement 8 — Global styles

**User story:** As a developer, I want a single, predictable global
stylesheet, so that resets, base typography, and accessibility defaults are
consistent everywhere.

### Acceptance criteria

1. WHEN `app/globals.css` is created THEN the system SHALL define Tailwind
   layer imports, `:root` token custom properties (if needed for non-Tailwind
   consumers), base element styles (body background/ink colour, font
   smoothing), and a visible focus-state style.
2. WHEN a user has `prefers-reduced-motion: reduce` set THEN global styles
   SHALL disable or shorten non-essential transitions/animations by default.
3. WHEN focus is moved via keyboard THEN every interactive element SHALL show
   a visible, non-colour-only focus indicator meeting WCAG 2.2 AA contrast.
4. WHEN the page loads THEN there SHALL be no unstyled-content flash and no
   layout shift attributable to font loading (handled via `next/font`
   `display: swap`/fallback metrics).

## Requirement 9 — Basic routing

**User story:** As a visitor, I want the primary site routes to resolve, so
that navigation between top-level sections works even before full content
exists.

### Acceptance criteria

1. WHEN the app is built THEN the system SHALL provide working routes for
   `/`, `/work`, `/work/[slug]`, `/think`, `/build`, and `/about` per
   `structure.md`.
2. WHEN `/work/[slug]` is requested with an unknown slug THEN the system
   SHALL render a proper 404 (Next.js `notFound()`), not a crash.
3. WHEN routes are added THEN the system SHALL NOT scaffold `/playground`,
   `/uses`, or `/now` — these remain future routes per `structure.md`.
4. WHEN each route renders THEN it SHALL use the shared layout (navigation
   shell + footer placeholder) so the chrome is consistent, even though
   section content is placeholder.

## Requirement 10 — Reusable layout primitives

**User story:** As a developer, I want composable layout primitives, so that
future sections/pages don't duplicate structural markup or styling.

### Acceptance criteria

1. WHEN layout primitives are built THEN the system SHALL provide, at
   minimum: `Container`, `Grid`, `Header`, `Footer` in `components/layout/`
   per `structure.md`.
2. WHEN a primitive is authored THEN the system SHALL default it to a Server
   Component unless it requires client-side interactivity, per `tech.md`
   architecture rules.
3. WHEN a primitive's API is designed THEN the system SHALL favor composition
   (children/slots) over large configuration prop surfaces.
4. WHEN the footer placeholder is built THEN it SHALL contain only minimal,
   non-fabricated content (e.g. copyright line, links to available routes) —
   no invented contact details or social links beyond what's approved in
   `content.md`.

## Requirement 11 — Navigation shell

**User story:** As a visitor, I want a consistent, accessible navigation
header across all pages, so that I can move between sections at any time.

### Acceptance criteria

1. WHEN the desktop navigation renders THEN the system SHALL show `AM`,
   `WORK`, `THINK`, `BUILD`, `ABOUT`, `LET'S TALK` per `content.md`, with `AM`
   acting as the home link.
2. WHEN the user scrolls THEN the navigation SHALL remain fixed/sticky,
   compact after scrolling, apply a backdrop blur, and show a subtle border —
   without visually dominating page content.
3. WHEN the viewport is mobile-sized THEN the navigation SHALL collapse to
   `AM` + a menu button that opens a full-screen overlay.
4. WHEN the mobile overlay is open THEN focus SHALL be trapped inside it,
   `Escape` SHALL close it, and closing SHALL return focus to the trigger
   button.
5. WHEN the mobile overlay is open THEN the underlying page SHALL not be
   scrollable, and the overlay SHALL be reachable and dismissible via
   keyboard alone.
6. WHEN a navigation item corresponds to the current route THEN it SHALL be
   indicated to assistive technology (e.g. `aria-current="page"`).
7. WHEN navigation is implemented THEN only the interactive parts (scroll
   listener, mobile overlay toggle) SHALL be a Client Component; static
   markup SHALL remain server-rendered where possible. Specifically,
   `Header` SHALL remain a Server Component that passes server-rendered nav
   markup as `children` into a thin `"use client"` shell (`HeaderShell`)
   per `design.md` §7 — `"use client"` SHALL NOT be placed on `Header`
   itself, so `DesktopNav` and its links do not enter the client bundle.
   The only `"use client"` files in `components/` for this milestone SHALL
   be `HeaderShell.tsx` and `MobileNav.tsx`.

## Requirement 12 — Accessibility foundations

**User story:** As a visitor using assistive technology or a keyboard, I
want the foundation to be accessible by default, so that every future page
built on top of it inherits accessible behavior.

### Acceptance criteria

1. WHEN any page renders THEN it SHALL use semantic HTML landmarks (`header`,
   `nav`, `main`, `footer`) and a correct heading hierarchy starting at `h1`.
2. WHEN the page loads THEN the system SHALL provide a "skip to content"
   link that is keyboard-focusable and visible on focus.
3. WHEN any interactive element receives focus THEN it SHALL show a visible
   focus indicator (Requirement 8.3) and SHALL be reachable in a logical tab
   order.
4. WHEN colour is used to convey state (e.g. active nav item) THEN an
   additional non-colour cue SHALL also be present (e.g. underline, weight,
   `aria-current`).
5. WHEN touch targets are sized THEN interactive elements SHALL meet a
   minimum 44×44px (or WCAG 2.2 AA equivalent) touch target size on mobile
   viewports.
6. WHEN reduced motion is preferred THEN all foundation-level motion
   (nav transitions, overlay open/close) SHALL respect
   `prefers-reduced-motion`.
7. IF full WCAG 2.2 AA conformance is claimed THEN the system SHALL note that
   automated checks alone are insufficient and manual assistive-technology
   testing is still required — this milestone delivers the structural
   foundation for that, not a conformance certification.

## Requirement 13 — SEO foundations

**User story:** As a site owner, I want baseline SEO metadata on every route,
so that the site is indexable and shareable from day one.

### Acceptance criteria

1. WHEN any route is requested THEN the system SHALL define `title` and
   `description` via the Next.js Metadata API (`generateMetadata` or static
   `metadata` export).
2. WHEN metadata is defined THEN the system SHALL include a canonical URL
   and Open Graph fields (title, description, type, url) using a shared
   metadata utility rather than duplicating logic per route.
3. WHEN the app builds THEN the system SHALL generate `sitemap.xml` and
   `robots.txt` via Next.js's `sitemap`/`robots` metadata file conventions,
   reflecting only routes that exist in this milestone.
4. IF a social preview image is required THEN the system SHALL use a
   placeholder/generic image and SHALL NOT fabricate a final brand asset —
   flag this as a follow-up for real content.
5. WHEN metadata utilities are built THEN they SHALL live in `lib/metadata/`
   per `structure.md`, typed and reusable across routes.

## Requirement 14 — Image and font infrastructure

**User story:** As a developer, I want image and font handling set up
correctly from the start, so that Core Web Vitals aren't compromised as
content is added later.

### Acceptance criteria

1. WHEN any raster image is rendered THEN the system SHALL use `next/image`
   with explicit dimensions (or `fill` with a sized parent) to prevent
   layout shift.
2. WHEN fonts are loaded THEN the system SHALL use `next/font/google` (or
   local variable font files if self-hosting is preferred) so fonts are
   self-hosted/optimized by Next.js rather than loaded via a render-blocking
   `<link>` to an external CDN.
3. WHEN icons are needed THEN the system SHALL use Lucide React components
   (SVG) rather than icon fonts or raster icon images.
4. WHEN the `public/` directory is scaffolded THEN it SHALL follow
   `structure.md` (`images/`, `icons/`, `fonts/`) and SHALL NOT be populated
   with placeholder binary assets that aren't actually used yet.

## Requirement 15 — MDX / content infrastructure

**User story:** As a developer, I want a typed content pipeline for MDX, so
that case studies and future content can be added without hardcoding markup
into page components.

### Acceptance criteria

1. WHEN MDX support is added THEN the system SHALL configure `@next/mdx`
   with `@mdx-js/loader` and `@mdx-js/react` (the current Next.js App Router
   MDX setup) to render `.mdx` files within the App Router, using
   `@types/mdx` for typing.
2. WHEN case-study metadata is defined THEN the system SHALL export it as a
   typed `meta` object from each MDX module (e.g.
   `export const meta = { title, slug, role, discipline, summary }`) rather
   than relying on YAML frontmatter. `@next/mdx` does not parse YAML
   frontmatter out of the box, and no frontmatter-parsing dependency (e.g.
   `gray-matter`) SHALL be added unless a concrete requirement emerges that
   MDX exports cannot satisfy.
3. WHEN content models are defined THEN the system SHALL type the `meta`
   export shape (project title, role, discipline, slug, summary) using a
   TypeScript interface in `lib/content/`, per `structure.md`.
4. WHEN this milestone ships THEN the system SHALL prove the pipeline with
   at most one minimal placeholder MDX document — not a real case study, not
   invented project content — sufficient to demonstrate the plumbing works.
5. WHEN the content model is designed THEN it SHALL support project-specific
   structure (per `content.md`'s case-study philosophy) rather than forcing
   a single rigid schema — the MDX body itself carries the narrative
   structure; only the `meta` export shape is fixed.
6. WHEN `/work/[slug]` resolves a real content entry THEN it SHALL use
   `generateStaticParams` so case-study pages are statically generated,
   consistent with Server Components-first architecture.
7. WHEN MDX components are configured THEN the system SHALL provide a
   root-level `mdx-components.tsx` exporting `useMDXComponents`, per the
   Next.js App Router MDX file convention — this file is required for
   `@next/mdx` to work under the App Router and SHALL contain only the
   minimal component mapping needed for this milestone's placeholder
   content.

## Cross-cutting acceptance criteria

1. WHEN any requirement in this document conflicts with `IMPLEMENTATION_
   BLUEPRINT.md` or a steering file THEN the system SHALL flag the conflict
   and ask before proceeding, per `review-process.md`.
2. WHEN this milestone is considered complete THEN the system SHALL pass:
   `tsc --noEmit`, `npm run lint` (ESLint CLI via a flat `eslint.config.mjs`,
   not the removed `next lint` command), `next build`, responsive check
   (mobile/tablet/desktop), keyboard navigation check, reduced-motion check,
   and an accessibility spot-check — per `tech.md` testing requirements.
3. WHEN implementation is delegated to tasks THEN each task SHALL be scoped
   so it can be implemented and reviewed as an independent, working
   increment (per `review-process.md` "prefer vertical slices").
4. WHEN ESLint is configured THEN the system SHALL use ESLint's flat config
   format (`eslint.config.mjs`) with `eslint-config-next`, exposed via a
   `package.json` script `"lint": "eslint ."` — not the legacy `.eslintrc`
   format and not the `next lint` command, which Next.js 16 removed.

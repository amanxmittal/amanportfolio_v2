# Design — Portfolio Foundation

## 1. Overview

This design covers the technical and visual foundation for the Aman Mittal
portfolio: project setup, design tokens, typography, grid, spacing, global
styles, routing shell, layout primitives, navigation, accessibility/SEO
baseline, and image/font/MDX infrastructure. It corresponds to Phases 1–4 of
the blueprint's implementation order (§34), plus the cross-cutting
infrastructure (MDX, SEO, images) needed so later phases don't require
re-plumbing.

Everything below the navigation shell (hero, philosophy, principles, scale,
design system, playground, about, contact) is explicitly out of scope and
represented only as placeholder text inside route `page.tsx` files so routes
resolve.

## 2. Dependency decisions

Per `tech.md` and `review-process.md`, every dependency addition must state
why it's needed, why native capabilities are insufficient, and its
performance implications. Versions below reflect current stable releases as
of this spec (checked against npm registry, September 2026).

| Package | Version | Why |
|---|---|---|
| `next` | `16.3.7` | Approved stack, App Router, current stable. |
| `react` / `react-dom` | `19.3.0` | Required peer for Next 16.3.x. |
| `typescript` | `6.0.3` | **Not** TypeScript 7 (native Go compiler). TS 7.0 GA (Jul 2026) has no stable compiler API yet — `typescript-eslint`'s currently supported TypeScript range does not include TS 7 (tracked upstream, targeted for a future `typescript-eslint`/TS 7.1 pairing). Pinning to the last TS 6.x release keeps `eslint-config-next`'s typed linting working. Do not auto-upgrade to TS 7 — revisit only once `typescript-eslint` officially supports it. |
| `tailwindcss` + `@tailwindcss/postcss` | `4.3.3` | Approved stack. v4's CSS-first `@theme` config maps cleanly to our design tokens without a JS config file. |
| `motion` | `13.4.5` | Approved stack ("Motion for React"). Not installing `framer-motion` separately (tech.md explicitly disallows having both). |
| `lucide-react` | `1.48.0` | Approved stack for icons (nav menu icon, close icon, external-link icon). |
| `@next/mdx` | `16.3.7` | Version-matched to Next.js; the App Router's supported MDX integration. |
| `@mdx-js/loader` | `3.1.1` | Required alongside `@next/mdx` for the current App Router MDX setup — `@next/mdx` delegates the actual MDX-to-JS compilation to this webpack/Turbopack loader. |
| `@mdx-js/react` | `3.1.1` | Supplies the `useMDXComponents` context/provider mechanism consumed by root `mdx-components.tsx`. |
| `@types/mdx` | `2.0.14` | Type definitions for MDX modules (needed since MDX files aren't natively typed by `tsc`). |
| `eslint` | `9.39.5` | Use ESLint 9.x for the initial project implementation. Do not upgrade to ESLint 10 during the initial implementation phase. This is a conservative tooling choice while the Next.js ESLint ecosystem continues its transition toward ESLint 10 compatibility. Re-evaluate ESLint 10 during a future dependency update. |
| `eslint-config-next` | `16.3.7` | Version-matched Next.js ESLint ruleset, consumed via flat config (see §4a below) — not the legacy `next lint` command, which Next.js 16 removed. |
| `@eslint/eslintrc`, `@eslint/js` | latest matching `eslint@9.x` | **Conditional — dev-only.** Only installed if §4a's Option B (`FlatCompat` shim) is mechanically required by the installed `eslint-config-next@16.3.7`; not needed under Option A. Both are Next.js/ESLint-maintained bridging packages (typically already present via `create-next-app`'s own scaffold), not a new major dependency. |
| `@types/react`, `@types/node` | latest matching majors | Type support. |
| `prettier` | `3.9.9` (optional) | Not in the approved stack list explicitly, but is formatting-only tooling, not a runtime/UI dependency — flagged here for the user's approval before adding; foundation can ship without it if declined. |

No other dependency is introduced. Explicitly avoided per `tech.md`: GSAP
(no interaction yet requires it), Three.js/R3F/WebGL, Lenis, Lottie,
`framer-motion` as a separate package, and any full component library
(shadcn, MUI, Chakra, Ant). `gray-matter` is deliberately **not** added —
case-study metadata uses MDX module exports (`export const meta = {...}`)
instead of YAML frontmatter, so no frontmatter-parsing dependency is needed
(see §11).

**Flag for user approval:** `prettier` is a common companion to
`eslint-config-next` projects but is not named in `tech.md`'s approved list.
I'll omit it by default and rely on ESLint + editor formatting unless you'd
like it added — it's low-risk (dev-only, no runtime/UI impact) but I'm
flagging per the dependency policy anyway.

## 2a. Runtime requirement

- **Node.js `>= 20.9`** — the minimum supported by Next.js 16 (per Next.js's
  published `engines` requirement).
- **Prefer Node.js 22 LTS** for local development, since it's compatible
  with the pinned toolchain (Next.js 16.3.x, TypeScript 6.0.3, ESLint 9.x)
  and is the current active LTS line as of this spec.
- `package.json` SHALL declare `"engines": { "node": ">=20.9" }` so
  package managers warn on an incompatible Node version.
- Project setup (Task 1) SHALL include a `node --version` check as an
  explicit verification step before scaffolding proceeds, rather than
  discovering an incompatible runtime later via a confusing build failure.

## 3. Directory structure (this milestone only)

Per `structure.md`, only create what's needed now:

```
# Root config files (created by / reconciled during Task 1 — see §3a)
package.json
tsconfig.json
next.config.ts            # MDX (@next/mdx) wiring lives here (Task 13)
postcss.config.mjs        # @tailwindcss/postcss plugin
eslint.config.mjs         # flat ESLint config (see §4a)
.gitignore                # see §3a — currently only ignores .kiro/.DS_Store
mdx-components.tsx        # root-level, required by @next/mdx under App Router

app/
  layout.tsx              # root layout: fonts, <html>/<body>, Header, Footer, skip link
  page.tsx                # placeholder home page
  globals.css
  sitemap.ts
  robots.ts
  work/
    page.tsx              # placeholder work index
    [slug]/
      page.tsx            # renders MDX case study or notFound()
  think/
    page.tsx              # placeholder
  build/
    page.tsx              # placeholder
  about/
    page.tsx              # placeholder

components/
  layout/
    Container.tsx
    Grid.tsx
    Header.tsx
    HeaderShell.tsx        # "use client" — scroll-state shell (§7)
    useScrollCompact.ts    # scroll-state hook (§7)
    Footer.tsx
  typography/
    Display.tsx
    Heading.tsx
    Body.tsx
    Label.tsx
  navigation/
    DesktopNav.tsx
    MobileNav.tsx          # Client Component
  ui/
    SkipLink.tsx
    Link.tsx               # thin wrapper over next/link with token-based focus style

content/
  work/
    _example/
      index.mdx            # single placeholder MDX doc proving the pipeline

lib/
  content/
    types.ts                # CaseStudyMeta type (mirrors each MDX module's `meta` export)
    index.ts                 # getAllCaseStudySlugs(), getCaseStudyBySlug()
  metadata/
    site.ts                  # site-wide constants (name, base URL) — no fabricated data
    createMetadata.ts        # shared helper for per-route Metadata objects
  utils/
    cn.ts                    # dependency-free classnames join, see §5

public/
  fonts/                      # only if self-hosting; next/font/google may avoid this entirely
```

Not created yet (explicitly out of scope): `components/hero/`,
`components/work/ProjectCard|ProjectGrid|ProjectMeta|ProjectHero`,
`components/sections/*`, `components/motion/*`, `components/system/*`,
`content/playground/`, `app/work/[slug]` beyond the single example entry.

## 3a. Scaffolding method & repository hygiene

The previous draft of Task 1 was ambiguous about *how* the project comes
into existence: it said "scaffold `package.json`, `app/` directory,
`tsconfig.json`…" (implying a manual hand-roll) but then verified
"`next build` produces a working default page" (a `create-next-app`
outcome). Those are different repositories. Resolved:

- **Use `create-next-app`, then pin.** Initialize with
  `create-next-app` (TypeScript, ESLint, Tailwind, App Router, `@/*` alias),
  then **reconcile `package.json` to the exact pinned versions in §2**
  (`create-next-app` installs its own, newer, un-pinned versions — those
  must be overwritten to match §2's compatibility reasoning, notably the
  TypeScript 6.0.3 and ESLint 9.x pins). Delete the scaffolded demo
  page/CSS, and reconcile the generated `eslint.config.mjs` against §4a
  (this also supplies §4a/C7's ESLint packages, since `create-next-app`
  provides them). Do **not** hand-roll the scaffold — that is the reading
  that conflicts with the `next build` verification and risks a
  mixed/incomplete config nobody chose.
- **`.gitignore`.** The repository currently ignores exactly one path
  (`.kiro/.DS_Store`) — it has no `node_modules/`, `.next/`, or `.env*`
  entries, so the first `npm install` would leave `node_modules/`
  untracked in the working tree with only `tech.md`'s "stage specific
  files" discipline preventing a catastrophic commit. Task 1 must write a
  proper `.gitignore` covering at least `node_modules/`, `.next/`, `out/`,
  `.env*.local`, `.DS_Store`, `*.tsbuildinfo`, and `.vercel`, **while
  preserving the existing `.kiro/.DS_Store` entry.** (`create-next-app`
  generates most of these; the task is to confirm/merge, not necessarily
  hand-write.) Note: writing `.gitignore` is in scope here; **this spec
  does not modify the current `.gitignore` — that happens during Task 1
  implementation, which is out of scope for the present spec-only work.**
- **Node version.** Confirm `node --version` ≥ 20.9 (prefer 22 LTS) before
  scaffolding — see §2a.
- **File inventory.** The root config files (`package.json`,
  `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`,
  `eslint.config.mjs`, `.gitignore`) are now listed in §3's tree so the
  inventory is complete; the previous draft omitted them while a later task
  (MDX, Task 13) referenced `next.config.ts` as if it already existed.

## 4. Design tokens → Tailwind theme mapping

Tailwind v4 uses CSS-first configuration via `@theme` in `globals.css`
instead of `tailwind.config.ts`. This keeps tokens co-located with the CSS
that consumes them and avoids a JS config file becoming a second source of
truth.

```css
@import "tailwindcss";

@theme {
  /* Colour */
  --color-canvas: #F5F5F2;
  --color-surface: #FFFFFF;
  --color-ink: #111111;
  --color-muted: #6B6B68;
  --color-border: #D9D9D4;
  --color-accent: #3155FF;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* Motion — easing only. See "Motion timing tokens" below for why
     durations are NOT declared in this block. */
  --ease-standard: ease-out;

  /* Fonts — reference next/font CSS variables, not literal family names.
     See "Font tokens" below. */
  --font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Line height (leading) — approved by Aman, resolves the former open
     gap flagged in §12(C). --leading-* is a valid Tailwind v4 namespace
     (produces leading-display, leading-heading, leading-body,
     leading-caption utilities). */
  --leading-display: 0.95;
  --leading-heading: 1.05;
  --leading-body: 1.6;
  --leading-caption: 1.5;

  /* Letter spacing (tracking) — approved by Aman. --tracking-* is a valid
     Tailwind v4 namespace (produces tracking-display, tracking-heading,
     tracking-body, tracking-caption utilities). */
  --tracking-display: -0.02em;
  --tracking-heading: -0.015em;
  --tracking-body: 0em;
  --tracking-caption: 0em;
}
```

**Leading / tracking token application (approved).** These tokens resolve
the open design-system gap previously flagged in §12(C)/§14. They are
consumed as first-class Tailwind utilities — `leading-display` +
`tracking-display` on `Display`, `leading-heading` + `tracking-heading` on
`Heading`, `leading-body` + `tracking-body` on `Body`, `leading-caption` +
`tracking-caption` on `Label`/caption text — never as arbitrary values
(`leading-[0.95]`, `tracking-[-0.02em]`), which `design-system.md` forbids.
The four levels map to the four typography primitives:

| Primitive | Leading token | Tracking token | Values |
|---|---|---|---|
| `Display` | `--leading-display` | `--tracking-display` | 0.95 / −0.02em |
| `Heading` | `--leading-heading` | `--tracking-heading` | 1.05 / −0.015em |
| `Body`    | `--leading-body`    | `--tracking-body`    | 1.6 / 0 |
| `Label` / caption | `--leading-caption` | `--tracking-caption` | 1.5 / 0 |

**Spacing is intentionally absent from this block.** See "Spacing tokens"
immediately below — the approved 8-point scale is consumed via Tailwind's
*existing* spacing utilities, not by redefining the `--spacing-*` namespace.

### Spacing tokens — do not redefine `--spacing-*`

Tailwind v4's entire numeric spacing utility family (`p-*`, `m-*`, `gap-*`,
`w-*`, `h-*`, `space-y-*`, `inset-*`, etc.) is generated from a single base
variable, `--spacing` (default `0.25rem` = 4px), via `calc(var(--spacing) *
N)` for a utility like `p-N`. **Declaring `--spacing-4: 4px`,
`--spacing-8: 8px`, etc. in `@theme` does not add tokens alongside that
system — it overrides individual multiplier steps of it**, silently
redefining `p-4` from 16px to 4px, `p-8` from 32px to 8px, and so on, while
leaving untouched steps (`p-5`, `p-9`, …) generated from the original base.
This spec's earlier draft made exactly this mistake; it is corrected here.

**Resolution: do not touch `--spacing` or any `--spacing-*` key.** The
approved 8-point scale already maps 1:1 onto Tailwind's default multiplier
scale, because every approved value is a multiple of the 4px base:

| Design token (px) | Tailwind multiplier | Utility example |
|---|---|---|
| 4  | 1  | `p-1`, `gap-1`  |
| 8  | 2  | `p-2`, `gap-2`  |
| 12 | 3  | `p-3`, `gap-3`  |
| 16 | 4  | `p-4`, `gap-4`  |
| 24 | 6  | `p-6`, `gap-6`  |
| 32 | 8  | `p-8`, `gap-8`  |
| 40 | 10 | `p-10`, `gap-10` |
| 48 | 12 | `p-12`, `gap-12` |
| 64 | 16 | `p-16`, `gap-16` |
| 80 | 20 | `p-20`, `gap-20` |
| 96 | 24 | `p-24`, `gap-24` |
| 128 | 32 | `p-32`, `gap-32` |
| 160 | 40 | `p-40`, `gap-40` |
| 192 | 48 | `p-48`, `gap-48` |

Components use these stock utilities directly (`p-6` for 24px, `gap-16` for
64px, etc.). **Off-scale multipliers that don't appear in the table above
(`p-5`, `p-7`, `p-9`, `p-11`, …) are not part of the design system and must
not be used** — this is enforced by convention/review, not by a Tailwind
config change, since Tailwind v4 generates the full numeric range
dynamically and cannot be selectively restricted without also breaking the
table above.

If Requirement 7.2's "extend the scale deliberately" is ever exercised (an
editorial section needs a value larger than 192px), the extension must be a
**named** token (e.g. a hypothetical `--spacing-section: <value>`) added to
`@theme`, never a numeric `--spacing-<n>` key — named keys generate their
own utility (`p-section`) and cannot collide with the numeric namespace.
Per `CLAUDE.md` §8/§16, **adding a new spacing value is a token change and
requires Aman's approval before it's added** — this spec does not add one
now.

### Motion timing tokens — not a `@theme` namespace

Tailwind v4's `@theme` namespaces include `--ease-*` (which is why
`--ease-standard` above correctly produces the `ease-standard` utility) but
**there is no `--duration-*` theme namespace**. Transition-duration
utilities are generated from bare numeric values (`duration-150` →
`150ms`); declaring `--duration-standard: 400ms` inside `@theme` does not
produce a `duration-standard` utility — it is silently emitted as an inert
CSS custom property instead, and the failure is invisible (no build error,
no lint warning).

**Resolution:** declare the duration tokens as plain custom properties
outside `@theme` (in the `:root` block already anticipated by Requirement
8.1 "for non-Tailwind consumers"), and consume them via Tailwind v4's
documented `duration-(<custom-property>)` syntax, which expands to
`transition-duration: var(<custom-property>)`:

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-standard: 400ms;
  --duration-slow: 700ms;
  --duration-cinematic: 1200ms;
}
```

```html
<!-- consumption example -->
<div class="transition duration-(--duration-standard) ease-standard">
```

This is not an arbitrary value in the sense `design-system.md` prohibits —
`duration-(--duration-standard)` references the named, approved token; it
is the officially documented Tailwind v4 mechanism for consuming a CSS
custom property as a utility argument, not a hardcoded magic number like
`duration-[350ms]`.

**Cinematic range:** Requirement 4.4 specifies Cinematic as a **range**,
1000–1400ms, not a single value. `--duration-cinematic: 1200ms` above is a
documented **point value within that approved range**, provided for cases
that need a single default; nothing prevents a future consumer from using
`duration-(--duration-cinematic)` at 1200ms or reaching for the range's
endpoints directly when a specific moment calls for it. This point-value
choice does not invent a new design value — it resolves Requirement 4.6's
"flag the discrepancy" obligation by writing the interpretation down
explicitly rather than leaving §4's original silent collapse unexplained.
No foundation-milestone task actually consumes the cinematic token (it's
reserved for the hero/signature-transition milestone), so this is
documentation, not a blocking dependency.

Type scale is implemented as component-level `clamp()` values (not a fixed
Tailwind `text-*` token) since each level needs distinct min/preferred/max
values to hit both the desktop reference and the mobile target from
`design-system.md`. These live in `components/typography/` as a small
internal scale map.

**Clamp arithmetic constraint (corrected):** each clamp's `vw` coefficient
must be derived so the value reaches its desktop-reference size (from
`design-system.md`'s type table) at exactly the 1440px design/content
reference width defined below — not at some larger, undesigned viewport.
The previous draft of this map got this wrong for Display XL specifically:
`clamp(3.5rem, 3rem + 4vw, 7.5rem)` only reaches 120px (`7.5rem`) at a
1800px viewport (solving `48px + 0.04v = 120px`), so at the actual 1440px
reference it renders at 105.6px — 12% short of the approved size, on the
single largest, most visible element on the site. Every other row in the
original map (`displayL`, `displayM`, `headingXl/L/M/S`) was checked and
does reach its target at 1440px; **Display XL was the only broken entry.**

Corrected map — Display XL's coefficient is recalculated so
`min + coefficient × 1440px = 120px` at the 1440px reference, and
`min + coefficient × 375px = 56px` at a 375px mobile reference (the
`design-system.md` mobile target). All other rows are unchanged, since they
were already verified against the 1440px reference:

```ts
// components/typography/scale.ts
export const typeScale = {
  displayXl: "clamp(3.5rem, 2.1rem + 6vw, 7.5rem)", // 56px @375 → 120px @1440
  displayL:  "clamp(3rem, 2.5rem + 3.4vw, 5.5rem)", // 88px desktop
  displayM:  "clamp(2.5rem, 2rem + 2.5vw, 4rem)",   // 64px desktop
  headingXl: "clamp(2rem, 1.75rem + 1.5vw, 3rem)",  // 48px desktop
  headingL:  "clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)", // 40px
  headingM:  "clamp(1.5rem, 1.35rem + 1vw, 2rem)",  // 32px
  headingS:  "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)", // 24px
  bodyL: "1.25rem",   // 20px — static, doesn't need clamp
  bodyM: "1rem",      // 16px
  bodyS: "0.875rem",  // 14px
  caption: "0.75rem", // 12px
} as const;
```

Verification at 1440px: `2.1rem (33.6px) + 6vw × 14.4px/vw-unit (86.4px) =
120.0px`. Verification at 375px: `33.6px + 6% × 375px (22.5px) = 56.1px`
(≈56px). Task 4's Verify step is updated to check this numerically rather
than "approximately" (see `tasks.md`).

The **interpolation curve** between the two endpoints (i.e. that it's a
linear `vw`-based clamp rather than some other curve) remains a reasonable
implementation detail per `review-process.md` — only the two *endpoints*
are binding product values from `design-system.md`, and this correction
makes the implementation actually hit them.

### Grid, page-margin, and Container width — corrected ambiguity

`design-system.md` states two independent facts: "Max content width: 1440px"
and "Page margin: `clamp(20px, 4vw, 64px)`". It does not say whether the
1440px figure is the width of the content area itself or the outer
bounding box that also contains the margin — the previous draft of this
spec left that unstated, and the two readings differ by up to ~115px.

**Resolution (content-box reading):** 1440px is the width available to
grid content; the page margin is additional gutter outside that, not
carved out of it. This matches the plainest reading of "max content width"
as literally the content's width, and it's the reading that keeps the
12-column grid math (and any visual reference drawn at 1440px) consistent
without recomputing gutters:

```css
--grid-max-width: 1440px;
--grid-margin: clamp(20px, 4vw, 64px);
```

`Container` applies:

```css
max-width: calc(var(--grid-max-width) + 2 * var(--grid-margin));
padding-inline: var(--grid-margin);
```

so the inner content area caps at a true 1440px, with the margin as
additional padding inside a wider outer box — not a padding carved out of a
1440px outer box (which would leave only ~1325px of actual content width at
large viewports). `Grid`'s column tracks are children of this content
area, so they operate on the full 1440px, matching whatever reference
layout (e.g. Figma) was drawn at that width.

### Breakpoints — corrected: named tokens, not left to Tailwind defaults

`design-system.md` names three grid tiers (Desktop 12 / Tablet 8 / Mobile 4)
but gives no pixel boundaries, and the previous draft of this spec never
named them either — it wrote "at desktop" with no variant specified, leaving
Tailwind's stock breakpoints (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 /
`2xl` 1536) to apply by default and undocumented. Since this spec's own
1440px reference sits between `xl` and `2xl`, that ambiguity could produce
a different desktop/mobile switch point in the grid, the nav, and any later
component, and nobody would notice until they disagreed with each other.

**Resolution — explicit breakpoint tokens, added to `@theme`:**

```css
@theme {
  /* ...existing tokens... */
  --breakpoint-md: 768px;   /* tablet:  8-column grid engages */
  --breakpoint-lg: 1024px;  /* desktop: 12-column grid + desktop nav engage */
}
```

Stated explicitly, once, for the whole foundation: **mobile (base, <768px)
= 4 columns; tablet (`md:`, 768–1023px) = 8 columns; desktop (`lg:`,
≥1024px) = 12 columns.** The desktop/mobile navigation switch (Requirement
11.3) uses this same `lg:` boundary — not a separate one. Above 1440px the
`Container` simply caps and the margin grows per its `clamp()`; there is no
additional breakpoint, and foundation components must not introduce `sm:`,
`xl:`, or `2xl:` variants. These two pixel values (768, 1024) are not new
design decisions — they are Tailwind's own existing `md`/`lg` defaults,
made explicit and named rather than left implicit; no new breakpoint value
is being invented.

`Grid` applies `grid-template-columns: repeat(4, 1fr)` at the mobile base,
`repeat(8, 1fr)` at `md:`, `repeat(12, 1fr)` at `lg:` — mobile-first, so the
4-column definition is the default and larger breakpoints override it.

## 4a. ESLint configuration

Next.js 16 removed the `next lint` command entirely; linting is now the
project's own responsibility via the ESLint CLI. This foundation uses:

- **`eslint.config.mjs`** at the project root — ESLint's flat config format
  (the current standard as of ESLint 9+), not the legacy `.eslintrc.*`
  format. Flat config is used unless a specific plugin in the dependency
  chain technically requires the legacy format (none currently do).
- **`eslint`** pinned to the latest **9.x** release (see §2 for the peer-
  dependency reasoning — `eslint-config-next`'s own dependencies cap at
  ESLint 9).
- **`eslint-config-next`**, consumed via its flat-config-compatible export
  inside `eslint.config.mjs`. Two viable mechanisms exist, and which one
  applies depends on what `eslint-config-next@16.3.7` actually ships:

  **Option A — native flat export** (preferred if available): if
  `eslint-config-next` exports a flat-config-ready object/array directly,
  wire it with no compatibility shim:

  ```js
  // eslint.config.mjs — sketch, Option A
  import nextConfig from "eslint-config-next";

  export default [
    ...nextConfig,
  ];
  ```

  **Option B — `FlatCompat` shim** (if `eslint-config-next` still only
  ships its legacy `extends`-style config at implementation time): requires
  two additional dev dependencies not previously declared in §2 —
  `@eslint/eslintrc` (provides `FlatCompat`) and `@eslint/js` (provides the
  recommended flat base config `FlatCompat` composes against). Both are
  standard, small, `create-next-app`-provided dev dependencies, not a new
  major dependency requiring separate approval — they exist solely to
  bridge legacy-format shareable configs into flat config, which is exactly
  this situation.

  ```js
  // eslint.config.mjs — sketch, Option B
  import { FlatCompat } from "@eslint/eslintrc";

  const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

  export default [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ];
  ```

  (Note: the previous draft of this sketch also imported `@eslint/js` as
  `js` without using it — an unused-import lint error in the lint config
  itself. Option B above drops that unused import; only import `@eslint/js`
  if a rule set from it is actually composed in.)

  **Which option applies is determined at Task 1 by inspecting the
  installed `eslint-config-next@16.3.7` package** — this is not a design
  decision requiring Aman's approval, since both options produce the same
  documented outcome (`next/core-web-vitals` + TypeScript-aware rules,
  active via plain ESLint, never `next lint`) and differ only in which of
  two Next.js-documented wiring mechanisms is mechanically required by the
  installed version.

- **`package.json` script:**

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

- All verification steps in this spec (§13, and every task's "Verify" step)
  invoke `npm run lint`, never `next lint`.

## 5. Typography components

`components/typography/{Display,Heading,Body,Label}.tsx` — Server
Components. Each renders a semantic element based on a `level`/`as` prop and
applies the corresponding scale + `font-display`/`font-body` family and
`text-ink` colour by default (overridable via `className`).

### `cn()` — dependency-free, no `clsx`/`tailwind-merge`

The sketch below uses a `cn()` helper. **This is a small local utility, not
`clsx` + `tailwind-merge`.** Those two packages are absent from §2's
dependency table and are not being added: the typography and layout
primitives apply a fixed size map plus an optional `className` override —
there is no conflicting-utility-class problem for `tailwind-merge` to
solve, and `clsx`'s conditional-class API isn't needed for a fixed,
non-conditional join. `lib/utils/cn.ts`:

```ts
// lib/utils/cn.ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

If class-conflict resolution is ever genuinely required by a later
milestone, that is a new dependency request under `tech.md`/`CLAUDE.md` §12
— to be raised and approved at that time, not assumed now.

### Prop signature — extends intrinsic element props, not a closed set

The props below must extend the underlying intrinsic element's own props
(e.g. `React.ComponentPropsWithoutRef<"h2">`) rather than a hand-picked
closed list of `as`/`size`/`children`/`className`. MDX's `useMDXComponents`
mapping (§11) needs to spread through `id`, `ref`, and other
element-native props onto these components; a closed prop type would
either fail `tsc --noEmit` under `strict` when MDX spreads extra props, or
push the implementation toward `any` (disallowed by Requirement 2.4) to
work around it. Concrete signature:

```tsx
// Sketch — not final implementation
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type DisplayProps = {
  as?: HeadingTag;
  size?: "xl" | "l" | "m";
} & Omit<React.ComponentPropsWithoutRef<HeadingTag>, "className"> & {
  className?: string;
};

export function Display({ as = "h1", size = "xl", children, className, ...rest }: DisplayProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-display text-ink leading-display tracking-display",
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

Each primitive applies its approved leading + tracking tokens (§4) as
static utility classes: `Display` uses `leading-display tracking-display`,
`Heading` uses `leading-heading tracking-heading`, `Body` uses
`leading-body tracking-body`, and `Label`/caption uses `leading-caption
tracking-caption`. These are token-backed utilities, not arbitrary values.

`Heading` follows the same pattern, supports `xl|l|m|s`, and defaults to
`h2`; `Body` supports `l|m|s` and defaults to `p`; `Label` renders
`span`/`p` at caption size for eyebrow-style labels. None of these
components own page-level heading hierarchy — the consuming page (or, for
MDX bodies, the `mdx-components.tsx` mapping in §11) decides `as`, so
`h1`→`h2`→`h3` order stays correct per route (Requirement 12.1).

## 6. Layout primitives

- **`Container`** — Server Component. Centers content, applies max-width and
  responsive horizontal padding. No visual styling beyond that.
- **`Grid`** — Server Component. Renders a `<div>` with the responsive
  column definition above. Accepts `className` for column-span overrides on
  children (e.g. `col-span-4 md:col-span-6`).
- **`Header` / `HeaderShell`** — corrected composition (see §7 for the full
  rationale; this bullet states only the file-level shape). `Header`
  (`components/layout/Header.tsx`) is a **Server Component** that renders
  `<header>` and `<nav aria-label="Primary">` with the server-rendered
  `DesktopNav` markup, and passes that markup as `children` into
  `HeaderShell` (`components/layout/HeaderShell.tsx`, `"use client"`).
  `HeaderShell` owns the scroll listener and the `data-scrolled` attribute
  only — it does not know what its children are and does not re-render
  them; because the nav markup is constructed in the Server Component and
  passed through as `children`, it is **not** part of the client
  JavaScript bundle. `MobileNav` is a separate, self-contained client
  island composed alongside `DesktopNav` inside `Header`.
- **`Footer`** — Server Component. Minimal: current year, links to the
  primary routes, and (if approved in `content.md`) contact links. For this
  milestone, footer content is limited to route links + a copyright line;
  email/LinkedIn/Resume links from the Contact section are deferred since
  Contact itself is out of scope — adding them prematurely risks presenting
  unfinished content as final.

## 7. Navigation shell behavior

- `DesktopNav`: renders `AM`, `WORK`, `THINK`, `BUILD`, `ABOUT`, `LET'S TALK`
  as a semantic `<ul>` of `next/link`s inside `<nav aria-label="Primary">`.
  `AM` links to `/`. Active route gets `aria-current="page"` plus a visual
  underline (not colour-only).

### Header / scroll-compaction boundary (corrected)

The previous draft of this section described `Header` as a "Server
Component" whose scroll behaviour is "implemented as a small client-only
scroll listener isolated to a `useScrollState` hook consumed by `Header`'s
client boundary" — an undefined mechanism (a Server Component cannot call a
hook), and §6 named the hook differently (`useScrollState` vs. this
section's `useScrollCompact`), confirming the boundary was never actually
pinned down. Corrected, concrete architecture:

- **`components/layout/Header.tsx`** — Server Component. Renders
  `<header>` and `<nav aria-label="Primary">` containing the
  server-rendered `DesktopNav` (and composes `MobileNav` alongside it).
  Passes this server-rendered markup as `children` into `HeaderShell`.
- **`components/layout/HeaderShell.tsx`** — `"use client"`. Accepts only
  `children`; renders them unmodified inside its own root element. Owns the
  scroll listener via the `useScrollCompact` hook and sets `data-scrolled`
  on its own root element, driving CSS (`backdrop-blur`, reduced header
  height, border opacity via `[data-scrolled]` selectors). Because the nav
  markup is constructed server-side and passed through as `children` from
  a Server Component, it does not enter the client JavaScript bundle —
  only `HeaderShell`'s own (small) listener code does.
- **`components/layout/useScrollCompact.ts`** — the one canonical hook
  name (replacing both `useScrollState` and any other reference). Tracks a
  single boolean past a scroll threshold (e.g. 24px). The scroll listener
  is registered with `{ passive: true }`, and state updates are gated by a
  threshold check (or `requestAnimationFrame`) so the handler does not fire
  a React state update on every scroll event — this matters for INP, since
  `Header` sits in the root layout and its listener runs on every route.

This is the specific composition pattern any implementation of Task 7 must
follow: a Server Component `Header` wrapping server-rendered markup in a
thin, prop-minimal `"use client"` shell — never `"use client"` at the top
of `Header.tsx` itself, which would pull `DesktopNav`, its six `next/link`
elements, and the typography primitives they use into the client bundle on
every route (violating Requirement 11.7 and the site-wide "Server
Components by default" performance requirement, since `Header` is in the
root layout).
- `MobileNav`: Client Component. Hamburger button (Lucide `Menu`/`X` icons)
  toggles a full-screen overlay `<div role="dialog" aria-modal="true">`.
  Focus trap implemented with native focus management (store trigger ref,
  move focus to first link on open via `useEffect`, restore on close) —
  no dependency needed for this, it's a well-understood ~30 line pattern.
  `Escape` key listener closes it. Background scroll is locked via a CSS
  class toggling `overflow: hidden` on `<body>` while open.
- Reduced motion: overlay open/close transition and header compaction
  transition both wrap their transform/opacity changes in a
  `@media (prefers-reduced-motion: reduce)` override that removes the
  transition duration (per Motion Principle 5 and Requirement 11's reduced-
  motion criterion). Since these are simple show/hide and blur toggles, they
  don't require the Motion library — plain CSS transitions on
  `transform`/`opacity`/`backdrop-filter` are sufficient and cheaper, keeping
  Motion for React reserved for the hero/signature transition later.

## 8. Routing & placeholder pages

Each of `/`, `/work`, `/think`, `/build`, `/about` gets a minimal `page.tsx`:
a `Heading` announcing the section name and one sentence of placeholder copy
explicitly marked as provisional (e.g. "Selected work will live here."). No
attempt is made to preview final content, hero copy, or approved statements
from `content.md` — those belong to later milestones and using them now
would present unfinished layout as if it were the final section.

`app/work/[slug]/page.tsx`:
- Uses `generateStaticParams()` sourced from `lib/content` (reads the
  `content/work/*/index.mdx` directories).
- Renders the MDX body via `@next/mdx`'s configured loader.
- Calls `notFound()` for unknown slugs.
- Only one example entry (`content/work/_example`) exists this milestone,
  used purely to prove the pipeline — not one of the real case studies
  (DigiLocker/UX4G/Entity Locker), since writing those requires real,
  verified project content that hasn't been provided yet.

Root `app/layout.tsx` composes: skip link → `Header` → `<main id="main"
tabIndex={-1}>` → `Footer`. `<html lang="en">` set at the root.

**`tabIndex={-1}` on `<main>` (clarification, not a new criterion):**
`<main>` is not focusable by default; without `tabIndex={-1}`, several
browsers move the scroll position when the skip link is activated but
leave keyboard focus on the skip link itself, so the next `Tab` press
returns to the nav instead of continuing into page content. This is
required to correctly satisfy the **already-approved** Requirement 12.2
("jumps focus to `#main`") — it is an implementation detail of an existing
criterion, not a new one.

## 9. SEO foundation

- `lib/metadata/site.ts` exports typed constants: `siteName`, `siteUrl`
  (placeholder/env-driven, not a fabricated production domain — read from an
  env var with a local fallback), `defaultDescription` sourced from the
  approved positioning statement in `product.md` ("Product designer building
  products, systems and experiences at scale.") since that's already
  approved copy, not invented.
- `lib/metadata/createMetadata.ts` exports a `createMetadata({ title,
  description, path })` helper returning a Next.js `Metadata` object with
  `title`, `description`, `alternates.canonical`, and `openGraph` fields.
  Each route's `page.tsx` calls this in its exported `metadata` (static,
  since content is static placeholder) rather than duplicating the shape.
- `app/sitemap.ts` and `app/robots.ts` use the Next.js metadata file
  convention, listing only the routes that exist this milestone.
- No social preview image is designed/fabricated this milestone; `openGraph.
  images` is omitted or points to a neutral placeholder, flagged as a
  follow-up once real OG art exists.

## 10. Image & font infrastructure

- Fonts loaded via `next/font/google` for Space Grotesk and Inter (variable
  axes). **`next/font` self-hosts each font under a generated, obfuscated
  family name and exposes it only through the CSS variable requested via
  the `variable` option** — a literal string like `"Space Grotesk"` matches
  no `@font-face` rule in the output and silently falls through to the
  fallback stack. The two calls must explicitly request matching variable
  names:

  ```ts
  // Sketch — not final implementation
  import { Space_Grotesk, Inter } from "next/font/google";

  const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
  });

  const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
  });
  ```

  Both classes (`spaceGrotesk.variable`, `inter.variable`) are applied to
  `<html>` in `app/layout.tsx`, and `--font-space-grotesk`/`--font-inter`
  are exactly the variable names §4's `@theme` block's `--font-display`/
  `--font-body` tokens reference (`var(--font-space-grotesk)`,
  `var(--font-inter)`) — this is the connection the previous draft left
  implicit and got wrong (§4 hardcoded literal family-name strings that no
  `next/font` output ever registers). Only the weight ranges actually used
  by the type scale are requested (variable font, so this is a range, not
  discrete weight files).
- No case-study or hero imagery exists yet, so `next/image` usage in this
  milestone is limited to establishing the pattern (e.g. a placeholder
  neutral image component or none at all if no image is genuinely needed for
  placeholder pages) — no invented product screenshots are added.
- `public/images`, `public/icons` directories are created empty-but-tracked
  only if something concrete will use them this milestone (favicon/app
  icons); otherwise deferred to avoid empty scaffolding, per `structure.md`
  guidance not to scaffold unneeded structure.

## 11. MDX / content model

`@next/mdx` does **not** parse YAML frontmatter out of the box — there is no
automatic frontmatter-to-props pipeline in the current App Router MDX setup.
Rather than pull in a frontmatter parser (`gray-matter`) as an undeclared
transitive assumption, this foundation uses **MDX module exports** for
case-study metadata: each `index.mdx` file exports a typed `meta` object
directly, which is plain JS/MDX syntax and requires no additional parsing
dependency.

`content/work/_example/index.mdx` (sketch):

```mdx
export const meta = {
  title: "Example Project",
  slug: "_example",
  role: "Product Designer",
  discipline: "Interaction design",
  summary: "A placeholder entry proving the MDX content pipeline works.",
};

## This is placeholder content

Body content demonstrating the MDX pipeline renders. Not a real case study.
```

**MDX's ESM block compiles as plain JavaScript, not TypeScript.** `.mdx`
files are not passed through the TypeScript compiler for their embedded
`export const` statements — only plain JS/ESM syntax is valid there.
TypeScript-only constructs (`satisfies`, type annotations, `as const` with
an explicit type argument, etc.) will not parse inside an `.mdx` file. The
`meta` export above is deliberately plain JavaScript for this reason; do
not add TypeScript syntax to it.

### Typing `meta` at the consumption boundary — not at the MDX file itself

`@types/mdx` types an MDX module's **default export** (the compiled
component); it does not type arbitrary named exports like `meta`. So
`import { meta } from "./content/work/_example/index.mdx"` does not, by
itself, give `meta` the `CaseStudyMeta` type — there is no automatic link
between the interface below and the plain-JS object literal in the MDX
file. Typing must happen at the point where the module is consumed, in
`lib/content/`, not by trying to annotate the `.mdx` file itself:

`lib/content/types.ts`:

```ts
export interface CaseStudyMeta {
  title: string;
  slug: string;
  role: string;
  discipline: string;
  summary: string;
  // Intentionally no fixed "structure" enum — content.md requires each
  // case study to support a different narrative shape. The MDX body itself
  // (headings + custom components) carries structure, not the meta export.
}
```

`lib/content/index.ts` exposes:

- `getAllCaseStudySlugs()` — reads the `content/work/*` directory names (or a
  small static registry for this milestone, given there's only one entry) to
  produce the slug list consumed by `generateStaticParams`.
- `getCaseStudyBySlug(slug)` — dynamically imports the matching
  `content/work/<slug>/index.mdx` module, and **asserts/validates the
  shape of its `meta` export against `CaseStudyMeta` at this one boundary**
  (e.g. a small runtime shape check, or a typed wrapper function whose
  return type is explicitly annotated `CaseStudyMeta` rather than trusting
  the MDX module's inferred type) before returning it alongside the
  module's default export (the compiled MDX body) for rendering. This
  boundary function is the only place `CaseStudyMeta` and the MDX module's
  untyped `meta` value meet — no `any` is used; the untyped value is either
  narrowed through an explicit runtime check or annotated at the function's
  return type, never silently passed through as `any`.

Because metadata comes from a normal ES module export rather than parsed
frontmatter, no new dependency is needed to read it — `import()` /
Next.js's MDX loader already gives access to the module's exports once
`@types/mdx` is installed; the `CaseStudyMeta` typing itself is supplied by
`lib/content/`'s boundary function as described above, not by `@types/mdx`.

### Root `mdx-components.tsx`

Required by `@next/mdx` under the App Router — without it, MDX components
render unstyled/unmapped. Kept minimal for this milestone:

**Heading mappings must pass an explicit `as` prop matching the source
element, not size alone.** Per §5, `Heading` defaults to `as="h2"` when
`as` is omitted — so a mapping that only varies `size` (e.g. `h2: (props)
=> <Heading size="l" {...props} />` and `h3: (props) => <Heading size="m"
{...props} />`, with no `as`) renders **both** an MDX `##` and `###` as an
actual `<h2>` element, differing only in visual size. That flattens the
document's heading hierarchy — a WCAG 1.3.1 failure, and specifically the
kind of defect this portfolio cannot afford to ship given `design-
system.md`'s own framing of accessibility as something the site
demonstrates, not just claims. Corrected mapping — `as` and `size` are set
independently, matching each MDX heading level to the same semantic level:

```tsx
// mdx-components.tsx — sketch, not final implementation
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Map basic elements to existing typography primitives so MDX body
    // content automatically uses the token-based type scale. `as` is set
    // explicitly on every entry so heading level always matches the MDX
    // source (## -> h2, ### -> h3, ...) — size and semantic level are
    // independent, per §5.
    h1: (props) => <Heading as="h1" size="xl" {...props} />,
    h2: (props) => <Heading as="h2" size="l" {...props} />,
    h3: (props) => <Heading as="h3" size="m" {...props} />,
    h4: (props) => <Heading as="h4" size="s" {...props} />,
    p: (props) => <Body size="m" {...props} />,
    ...components,
  };
}
```

Because `Heading`'s props extend the intrinsic element's own props (§5),
`{...props}` here correctly passes through `id` (heading anchors), `ref`,
and any other element-native prop MDX supplies, without a `strict`
type error and without reaching for `any`.

This is intentionally small — just enough mapping so the one placeholder
MDX document renders using the design system's typography primitives, with
correct heading semantics, rather than unstyled browser defaults or a
flattened hierarchy. Richer MDX component mappings (callouts, image
galleries, custom case-study layout components) are deferred to the
milestone that builds real case-study content.

This keeps the model intentionally minimal: it proves slugs resolve, MDX
renders, and metadata is typed — without pre-designing a rich case-study
component system (`ProjectHero`, `ProjectMeta`, etc.) that belongs to a later
milestone once real case-study content and layout direction exist.

## 12. Accessibility approach

This section is split into **(A) implementation of already-approved
acceptance criteria** (Requirement 12 and `design-system.md`'s
accessibility section — these are binding) and **(B) open WCAG 2.2
recommendations from engineering review** (raised, *not* approved, *not*
acceptance criteria for this milestone — recorded so implementation is
aware of them and does not accidentally foreclose them). This split is
deliberate per `review-process.md`/`CLAUDE.md` §9: an audit recommendation
must not be silently promoted into a requirement.

### (A) Implementation of approved criteria

These map directly to the existing Requirement 12 acceptance criteria and
the approved `design-system.md` accessibility list — nothing new is
introduced here, only the implementation approach is pinned down:

- **Landmarks (Req 12.1):** `header`, `nav[aria-label="Primary"]`,
  `main#main`, `footer`.
- **Heading hierarchy (Req 12.1):** one `h1` per page; MDX bodies preserve
  semantic level via the corrected `mdx-components.tsx` mapping (§11).
- **Skip link (Req 12.2):** visually hidden until focused, first focusable
  element in the DOM, targets `#main`; `<main>` carries `tabIndex={-1}`
  (§8) so focus actually lands there.
- **Focus visibility (Req 12.3 / 8.3):** a single shared `:focus-visible`
  rule using the Accent colour as an outline, applied globally rather than
  per-component, so it can't be forgotten on a new interactive element.
- **Keyboard navigation & logical tab order (Req 12.3):** verified by the
  keyboard-only pass in the testing plan (§13) and Task 8/Task 16.
- **Non-colour-only state (Req 12.4):** active nav item uses underline +
  `aria-current="page"`, not colour alone.
- **Accessible mobile navigation (Req 11.4/11.5, 12.6):** `MobileNav`
  dialog uses `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`,
  focus trap, `Escape` handling, return focus to trigger on close, body
  scroll lock while open (§7).
- **Reduced motion (Req 8.2 / 12.6):** implemented as a concrete global
  block rather than left to interpretation — the previous draft only said
  "disable or shorten," which invites the blunt
  `* { transition: none !important }` that conflicts with Motion Principle
  6 (interruptible) and later fights Motion for React exit animations. Use:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

  Note: this CSS cannot stop JavaScript-driven animation. Any future Motion
  for React work must additionally branch on `useReducedMotion()` — the CSS
  block alone is not sufficient for the later hero/signature transition.
  (No JS-driven animation exists in this milestone; nav/overlay use CSS
  transitions, which the block above covers.)
- **Colour contrast (Req 12, `design-system.md`):** Ink-on-Canvas and
  Ink-on-Surface both need verification against WCAG AA (4.5:1 for body
  text) as an implementation-time check; Muted-on-Canvas needs particular
  attention since it's a lower-contrast token — confirm it's only used for
  non-essential text (captions, meta) and verify even then.
- **Touch targets (Req 12.5):** as currently approved, nav links and the
  mobile menu button are sized to at least 44×44px hit area (padding, not
  just content box). See (B) for the open WCAG-2.2-specific reinterpretation
  of this criterion — but the binding target for *this* milestone remains
  Requirement 12.5 as written.

This is structural groundwork, not a conformance claim — per `design-
system.md`, full WCAG 2.2 AA validation still requires manual testing with
assistive technology, which is out of scope for this implementation
milestone but should follow before launch.

### (B) Open WCAG 2.2 items — reviewed by Aman, DEFERRED to a later a11y pass

**These are recommendations, not acceptance criteria. Do not treat
non-compliance with them as a failure of this milestone, and do not
implement them as if Requirement 12 already required them.** Aman has
reviewed all three and **deferred** them: the approved Requirement 12 /
overlay behaviour is unchanged for this milestone, and these remain
documented open findings for a later dedicated accessibility pass. They are
recorded here (and in `CLAUDE.md` §9's "Open WCAG 2.2 findings") so
implementation does not accidentally make them harder to adopt later.

- **SC 2.4.11 Focus Not Obscured (Minimum) — AA, new in 2.2. DEFERRED.**
  Requirement 11.2 mandates a sticky header; a keyboard `Tab` into an
  element just below the fold can scroll it *under* the header. Mitigation
  would be `html { scroll-padding-top: calc(var(--header-height) + 1rem); }`
  with a `--header-height` token. Not implemented now — deferred per Aman;
  the approved requirement is not modified at this stage.
- **SC 2.5.8 Target Size (Minimum) — AA, new in 2.2. DEFERRED.** The 2.2 AA
  threshold is **24×24 CSS px** and applies at **all** viewports; approved
  Requirement 12.5 specifies **44×44px on mobile viewports** (the 2.1 AAA /
  2.5.5 figure). Requirement 12.5 is **unchanged** — the 44×44 mobile
  target stands for this milestone; the 2.2 finding stays open for later
  review per Aman.
- **`inert` on background content** while the mobile overlay is open, in
  addition to the approved `aria-modal` + focus trap. **DEFERRED** — the
  approved overlay requirement is not modified now; kept as an open
  accessibility enhancement per Aman.

### (C) Design-system gap — leading / letter-spacing tokens (RESOLVED)

`design-system.md`, the blueprint's typography section, and this spec's
original type scale defined type *sizes* but no line-height (leading) or
letter-spacing (tracking) values — a genuine design-system gap that at
Display XL (120px) left the five-line hero headline roughly 900px tall
under the browser default leading (relevant to SC 1.4.12). This was
previously flagged as an open decision reserved for Aman rather than filled
unilaterally.

**Aman has now approved explicit tokens for this**, defined in §4 and
applied by the typography primitives in §5:

| Level | Leading | Tracking |
|---|---|---|
| Display | 0.95 | −0.02em |
| Heading | 1.05 | −0.015em |
| Body | 1.6 | 0 |
| Small / Caption | 1.5 | 0 |

They are represented as `--leading-*` / `--tracking-*` design tokens
(valid Tailwind v4 namespaces) and consumed as `leading-*`/`tracking-*`
utilities — never as arbitrary `leading-[…]`/`tracking-[…]` values. This
gap is no longer blocking; Task 4 implements it directly rather than
stopping to ask.

## 13. Testing/verification plan for this milestone

Per `tech.md`:
- `node --version` — confirms `>= 20.9` before other checks run.
- `tsc --noEmit` — zero errors.
- `npm run lint` (ESLint CLI via flat `eslint.config.mjs` + `eslint-config-
  next` — **not** `next lint`, which Next.js 16 removed) — zero errors.
- `next build` — succeeds.
- **Token utility check (C1/C2):** confirm each token actually produces a
  working utility class, not merely a CSS variable — spot-check
  `bg-canvas`, `rounded-lg`, `ease-standard`, `font-display`, a spacing
  utility from the mapped scale (e.g. `p-6` = 24px), and the duration
  mechanism (`duration-(--duration-standard)` yields 400ms). A token that
  emits only an inert custom property is a failure.
- **Server/client boundary check (C5):** `grep -rn "use client" components/`
  returns only `HeaderShell.tsx` and `MobileNav.tsx`; `next build` route
  output shows no First Load JS increase for static routes beyond those two
  client islands.
- **Font wiring check (C3):** in devtools,
  `getComputedStyle(document.body).fontFamily` resolves to the
  next/font-generated family (e.g. `__Inter_…`), not `ui-sans-serif`; the
  Network panel shows self-hosted `.woff2` files under
  `/_next/static/media/`, not a `fonts.googleapis.com` request.
- Manual responsive check at mobile (375px), tablet (768px), desktop
  (1440px) breakpoints for grid, nav, and typography — **and at the
  breakpoint boundaries themselves: 767/768 and 1023/1024px** (C9), to
  confirm the column count switches at exactly `md`/`lg`.
- **Type-scale numeric check (C4):** at exactly 1440px viewport width, the
  computed `font-size` of Display XL is 120px ±1px; at 375px it is 56px
  ±1px (not an "approximate" eyeball check).
- Manual keyboard-only pass: tab through header, open/close mobile nav with
  keyboard only, confirm focus trap and return-focus; confirm the skip link
  lands focus in `<main>` (not left on the link).
- Manual reduced-motion check: enable `prefers-reduced-motion` in devtools,
  confirm nav/overlay transitions shorten/disable.
- **MDX heading-semantics check (C6):** on the rendered `/work/_example`
  page, the browser accessibility tree shows heading levels matching the
  MDX source (`##` → level 2, `###` → level 3), not all level 2.
- Manual accessibility spot-check: landmarks present, heading order correct,
  skip link works, contrast check on token colour pairs actually used.
- **Repo hygiene check (C10):** after `npm install` and `next build`,
  `git status` shows no `node_modules/`, `.next/`, or build artifacts as
  untracked/staged — the `.gitignore` covers them.
- Link validation: every nav link and footer link resolves to a real route
  (no dead links to out-of-scope routes like `/playground`).

No automated test framework is being introduced in this milestone unless the
user requests one — none currently exists in the repo, and `tech.md`/
`review-process.md` don't mandate one for the foundation phase specifically
(they mandate it for "adding new features or fixing bugs" generally, but
per the guardrail rules, tests are added when explicitly requested or when
justified by risk — the foundation's correctness is primarily verified via
typecheck/lint/build/manual passes above). This will be flagged again at
task-execution time in case the user wants Vitest/Playwright set up now
rather than later.

## 14. Open questions / flags for the user

Items 1–4 pre-date the architecture audit. Items 5–8 are the audit findings
that require an Aman decision rather than a mechanical spec fix — they are
**not** resolved in this spec; they are surfaced here (and, where relevant,
in `CLAUDE.md` §9/§19) so implementation does not silently pick a value.

1. **Prettier** — add or skip for now? (See §2.)
2. **Font self-hosting vs `next/font/google`** — defaulting to
   `next/font/google` for simplicity; flag if fully offline/self-hosted
   fonts are preferred instead (matters for the `public/fonts/` directory
   listed in `structure.md`).
3. **Site base URL** — `lib/metadata/site.ts` needs a real production
   domain eventually; using an env-var-driven placeholder for now since the
   final domain hasn't been confirmed.
4. **Example MDX case study** — confirm it's acceptable to use clearly
   fictitious/placeholder project content (e.g. "Example Project") for the
   one proof-of-pipeline MDX entry, distinctly separate from the three real
   case-study slugs, so nothing resembling real portfolio content is
   fabricated.
5. **(C8-A) Line-height / letter-spacing tokens — RESOLVED.** Aman
   approved explicit `--leading-*` / `--tracking-*` tokens (Display
   0.95 / −0.02em; Heading 1.05 / −0.015em; Body 1.6 / 0; Small/Caption
   1.5 / 0). Defined in §4, applied in §5, verified in Task 4. No longer
   blocking.
6. **(C8-B) SC 2.4.11 Focus Not Obscured (WCAG 2.2 AA, new) — DEFERRED.**
   The approved sticky header can obscure keyboard-focused elements;
   mitigation would be `scroll-padding-top` + a `--header-height` token.
   Aman's decision: **defer** — do not modify the approved requirement now;
   keep this documented as an open accessibility finding for a later
   accessibility pass. Not a criterion for this milestone.
7. **(C8-B) SC 2.5.8 Target Size (WCAG 2.2 AA, new) — DEFERRED.** Approved
   Requirement 12.5 (44×44 on mobile) is unchanged. Aman's decision:
   **defer** — keep the WCAG 2.2 Target Size finding (24×24 at all
   viewports) documented as an open item for later review; do not edit
   Requirement 12.5 now.
8. **(C8-B) `inert` on background content — DEFERRED.** Adding `inert` to
   background content while the mobile overlay is open, alongside the
   approved `aria-modal` + focus trap. Aman's decision: **defer** — do not
   modify the approved overlay requirement now; keep it as an open
   accessibility enhancement.

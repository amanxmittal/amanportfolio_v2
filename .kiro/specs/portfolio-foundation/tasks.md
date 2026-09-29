# Tasks — Portfolio Foundation

Each task is a small, independently reviewable increment. Complete and
verify one before starting the next. Requirement references point to
`requirements.md`. Do not execute these tasks yet — implementation happens
in a separate pass after this spec is approved.

- [x] 1. Initialize Next.js App Router project
  - Verify the local Node.js version meets `>= 20.9` (prefer Node 22 LTS)
    via `node --version` before scaffolding.
  - Initialize with `create-next-app` (TypeScript, ESLint, Tailwind, App
    Router, `@/*` alias) per `design.md` §3a — do **not** hand-roll the
    scaffold. Then reconcile `package.json` to the exact pinned versions in
    `design.md` §2 (`next@16.3.7`, `react@19.3.0`, `react-dom@19.3.0`,
    `typescript@6.0.3`, `eslint@9.39.5`, `eslint-config-next@16.3.7`, …),
    overwriting the newer/un-pinned versions `create-next-app` installs;
    add `"engines": { "node": ">=20.9" }`; delete the scaffolded demo
    page/CSS.
  - Reconcile the generated `eslint.config.mjs` against `design.md` §4a
    (flat config; Option A native export if `eslint-config-next@16.3.7`
    ships one, else Option B `FlatCompat` with `@eslint/eslintrc`). Ensure
    the `package.json` script is `"lint": "eslint ."`. Do not use
    `next lint` (removed in Next.js 16) or a legacy `.eslintrc.*` file.
  - Write/confirm `.gitignore` covers `node_modules/`, `.next/`, `out/`,
    `.env*.local`, `.DS_Store`, `*.tsbuildinfo`, `.vercel`, while
    **preserving the existing `.kiro/.DS_Store` entry** (`design.md` §3a).
  - Confirm the root config file inventory exists per `design.md` §3
    (`package.json`, `tsconfig.json` with strict mode + `@/*`,
    `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
    `.gitignore`).
  - Verify: `node --version` reports `>= 20.9`; `npm install` succeeds;
    `npx tsc --noEmit` runs clean on the scaffold; `npm run lint` runs
    (even if there's nothing to lint yet) without configuration errors;
    `next build` produces a working default page; `git status` shows no
    `node_modules/`/`.next/` untracked after install + build.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3_

- [x] 2. Configure Tailwind CSS v4 with design tokens
  - Install `tailwindcss` + `@tailwindcss/postcss`, wire into
    `app/globals.css` via `@import "tailwindcss"`.
  - Add the `@theme` block exactly as specified in `design.md` §4: colour,
    radius, `--ease-standard`, `--font-display`/`--font-body` (referencing
    the next/font variables, not literal family names), the
    `--breakpoint-md`/`--breakpoint-lg` tokens, and the approved
    `--leading-*` / `--tracking-*` typography tokens (Display 0.95 /
    −0.02em; Heading 1.05 / −0.015em; Body 1.6 / 0; Caption 1.5 / 0).
    **Do NOT add a `--spacing-*` block** — the 8-point scale maps onto
    Tailwind's existing numeric spacing utilities per §4's table. Declare
    the `--duration-*` values in a `:root` block (not `@theme`), consumed
    via `duration-(--duration-standard)` per §4.
  - Verify (C1/C2): a spacing utility from the mapped scale renders the
    correct px (`p-6` = 24px, `gap-16` = 64px) and stock `p-4` still = 16px
    (not silently overridden); `rounded-lg`, `ease-standard`,
    `duration-(--duration-standard)` (= 400ms), `leading-display` (= 0.95),
    and `tracking-display` (= −0.02em) each produce a working utility, not
    an inert CSS variable; `bg-canvas` renders the correct colour;
    `npm run lint` and `next build` still pass.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.7, 5.6_

- [x] 3. Set up fonts via `next/font`
  - Load Space Grotesk and Inter as variable fonts via `next/font/google`,
    each with an explicit `variable` (`--font-space-grotesk`,
    `--font-inter`) and `display: "swap"`, per `design.md` §10. Apply both
    `.variable` classes to `<html>` in `app/layout.tsx` (Task 10). These
    variable names are exactly what §4's `--font-display`/`--font-body`
    tokens reference.
  - Verify (C3): in devtools,
    `getComputedStyle(document.body).fontFamily` resolves to the
    next/font-generated family (e.g. `__Inter_…`), **not** `ui-sans-serif`;
    the Network panel shows self-hosted `.woff2` files under
    `/_next/static/media/`, not a `fonts.googleapis.com` request; no
    FOUC/layout shift on reload; only used weight ranges are fetched.
  - _Requirements: 5.1, 8.4, 14.2_

- [x] 4. Build typography primitives (`Display`, `Heading`, `Body`, `Label`)
  - Implement the corrected `clamp()` type scale map (Display XL =
    `clamp(3.5rem, 2.1rem + 6vw, 7.5rem)`) and the four Server Components
    per `design.md` §5. Each primitive applies its approved leading +
    tracking tokens as utilities (`Display`: `leading-display
    tracking-display`; `Heading`: `leading-heading tracking-heading`;
    `Body`: `leading-body tracking-body`; `Label`/caption: `leading-caption
    tracking-caption`) — token-backed, never arbitrary `leading-[…]`/
    `tracking-[…]` values. Props extend the intrinsic element's props
    (`React.ComponentPropsWithoutRef<…>`) so `id`/`ref`/ARIA pass through
    under `strict` without `any`. Add the dependency-free `lib/utils/cn.ts`
    join from §5 — **do not install `clsx` or `tailwind-merge`.**
  - Verify (C4): at exactly 1440px viewport width, computed `font-size` of
    Display XL is 120px ±1px; at 375px it is 56px ±1px (numeric, not
    "approximate"); computed `line-height`/`letter-spacing` match the
    approved tokens per level (Display 0.95 / −0.02em, etc.); heading
    levels are controllable per usage site.
  - _Requirements: 5.2, 5.3, 5.4, 5.6_

- [x] 5. Build layout primitives (`Container`, `Grid`)
  - Implement the responsive grid at the explicit breakpoints from
    `design.md` §4 (base 4 cols; `md:` 8 cols; `lg:` 12 cols) and the
    content-box `Container`
    (`max-width: calc(var(--grid-max-width) + 2 * var(--grid-margin))`,
    `padding-inline: var(--grid-margin)`) so content caps at a true 1440px.
    Use only `md:`/`lg:` variants — no `sm:`/`xl:`/`2xl:`.
  - Verify (C9): column count is correct at the boundaries — 767 vs 768px
    (4 → 8) and 1023 vs 1024px (8 → 12) — not only at the midpoints; at
    1440px the inner content area measures a true 1440px with the margin
    outside it; grid usable by placing test children with `col-span-*`.
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1_

- [x] 6. Write global styles (`app/globals.css`)
  - Add base element resets, body background/ink colour, font smoothing,
    the `:root` `--duration-*` block (§4), a shared `:focus-visible` style,
    and the concrete `prefers-reduced-motion` block specified in
    `design.md` §12(A) (short-duration override, not blanket
    `transition: none`).
  - Verify: keyboard-tabbing any interactive test element shows the focus
    ring; toggling reduced-motion in devtools shortens/disables nav/overlay
    transitions.
  - _Requirements: 8.1, 8.2, 8.3, 12.3, 12.6_

- [x] 7. Build `Header`, `HeaderShell`, and `DesktopNav`
  - Implement the corrected boundary from `design.md` §7: `Header`
    (Server Component) renders `<header>`/`<nav aria-label="Primary">` with
    server-rendered `DesktopNav`, and passes that markup as `children` into
    `HeaderShell` (`"use client"`), which owns the `useScrollCompact` hook
    and sets `data-scrolled` on its own root for CSS-driven
    blur/border/compaction. The scroll listener is `{ passive: true }` and
    threshold/rAF-gated. Desktop/mobile switch uses the `lg:` boundary.
  - Verify (C5): scrolling past threshold visibly compacts/blurs the
    header; active route shows `aria-current="page"` plus a non-colour cue;
    `grep -rn "use client" components/` returns only `HeaderShell.tsx` and
    (after Task 8) `MobileNav.tsx`; `next build` shows no First Load JS
    increase for static routes beyond those islands.
  - _Requirements: 11.1, 11.2, 11.6, 11.7, 12.4_

- [x] 8. Build `MobileNav` full-screen overlay
  - Implement hamburger trigger (Lucide icons), full-screen dialog overlay,
    focus trap, `Escape`-to-close, focus return to trigger, body scroll
    lock while open.
  - Verify: keyboard-only pass — Tab reaches the trigger, Enter/Space
    opens the overlay, focus moves inside, Tab cycles within it, Escape
    closes and returns focus to the trigger; reduced-motion removes the
    open/close transition.
  - _Requirements: 11.3, 11.4, 11.5, 12.6_

- [x] 9. Build `Footer`
  - Minimal Server Component with route links and a copyright line only
    (no fabricated contact/social content).
  - Verify: all footer links resolve to real routes; renders correctly at
    all breakpoints.
  - _Requirements: 10.1, 10.4_

- [x] 10. Assemble root layout (`app/layout.tsx`)
  - Compose skip link → `Header` → `<main id="main" tabIndex={-1}>` →
    `Footer`; set `<html lang="en">` with both next/font `.variable`
    classes applied; import `globals.css`.
  - Verify: skip link is the first focusable element, is visually hidden
    until focused, and — because `<main>` has `tabIndex={-1}` — actually
    moves focus into `#main` (the next `Tab` continues into content, not
    back to the nav); landmark structure confirmed via the browser
    accessibility tree.
  - _Requirements: 9.4, 12.1, 12.2_

- [x] 11. Add shared SEO metadata utilities
  - Implement `lib/metadata/site.ts` and `lib/metadata/createMetadata.ts`.
  - Verify: calling `createMetadata({ title, description, path })` in a
    scratch/test route produces a `Metadata` object with `title`,
    `description`, canonical `alternates.canonical`, and `openGraph`
    fields populated correctly.
  - _Requirements: 13.1, 13.2, 13.5_

- [x] 12. Create placeholder routes: `/`, `/work`, `/think`, `/build`, `/about`
  - Minimal `page.tsx` per route with one `Heading`/`Body` pair of clearly
    provisional copy; each exports `metadata` via the shared helper built
    in Task 11.
  - Verify: all five routes load without error, use the shared layout,
    show a correct single `h1` per page, and viewing page source confirms
    per-route `<title>`/meta description/canonical differ across routes.
  - _Requirements: 9.1, 5.5, 13.1, 13.2_

- [x] 13. Set up MDX pipeline and content model
  - Configure `@next/mdx` with `@mdx-js/loader` in `next.config.ts`;
    install `@mdx-js/react` and `@types/mdx`.
  - Add root-level `mdx-components.tsx` exporting `useMDXComponents` with
    the minimal mapping from `design.md` §11 — **each heading entry passes
    an explicit `as` matching its source level** (`h1`→`as="h1"`,
    `h2`→`as="h2"`, `h3`→`as="h3"`, `h4`→`as="h4"`), so semantic level is
    never flattened to `h2`-by-default.
  - Add `lib/content/types.ts` (`CaseStudyMeta` interface) and
    `lib/content/index.ts` (`getAllCaseStudySlugs`, `getCaseStudyBySlug`)
    per `design.md` §11. `getCaseStudyBySlug` types the MDX module's `meta`
    export against `CaseStudyMeta` at this boundary (explicit return-type
    annotation or a runtime shape check) — **no `any`.**
  - Add one placeholder MDX entry under `content/work/_example/index.mdx`
    exporting a **plain-JavaScript** `meta` object (no `satisfies` or other
    TS-only syntax inside `.mdx`; not YAML frontmatter) with clearly
    fictitious project content. Do not add `gray-matter` or any
    frontmatter-parsing dependency.
  - Verify (C6): `getAllCaseStudySlugs()` returns the example slug;
    `getCaseStudyBySlug("_example")` returns typed `meta` with no `any`;
    `tsc --noEmit` is clean (confirms the `.mdx` ESM parses and the
    boundary typing holds); on `/work/_example` the browser accessibility
    tree shows heading levels matching the MDX source (`##` → level 2,
    `###` → level 3), not all level 2.
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.7_

- [x] 14. Build `/work/[slug]` dynamic route
  - Implement `generateStaticParams` (sourced from
    `getAllCaseStudySlugs()`), render the MDX body for known slugs via
    `getCaseStudyBySlug`, call `notFound()` for unknown slugs.
  - Wire the shared metadata helper (Task 11) using each case study's
    `meta.title`/`meta.summary`.
  - Verify: `/work/_example` renders the MDX body and correct metadata; a
    nonexistent slug returns a real 404 page, not a crash.
  - _Requirements: 9.2, 15.6_

- [x] 15. Add `sitemap.ts` and `robots.ts`
  - Implement Next.js metadata-file conventions listing only routes that
    exist this milestone (including the resolved `/work/_example` entry).
  - Verify: `/sitemap.xml` and `/robots.txt` resolve and list the correct
    route set (no `/playground`, `/uses`, `/now`, no case-study slugs
    beyond the example).
  - _Requirements: 13.3_

- [x] 16. Full verification pass
  - Run `node --version` (confirm `>= 20.9`), `tsc --noEmit`,
    `npm run lint`, `next build` — in that order, all must pass cleanly.
  - Run the full verification plan in `design.md` §13, including the
    audit-driven checks: token-utility check (C1/C2), server/client
    boundary grep + First Load JS (C5), font-wiring check (C3),
    breakpoint-boundary check at 767/768 and 1023/1024px (C9), Display XL
    numeric size at 375/1440px (C4), MDX heading-semantics tree check (C6),
    and repo-hygiene `git status` check (C10).
  - Manual pass: keyboard-only navigation through header + mobile overlay
    (including skip-link focus landing in `<main>`); reduced-motion toggle;
    accessibility spot-check (landmarks, heading order, contrast on token
    pairs actually used, skip link); link check across nav/footer/sitemap.
  - Document results (pass/fail per check) before considering the
    milestone done.
  - _Requirements: all — cross-cutting acceptance criteria 2, 4_

## Explicitly not tasked (out of scope, do not implement)

- Hero, signature transition, Selected Work, Philosophy, Principles, Scale,
  Design System playground, Playground section/route, About/Contact final
  content.
- Real case-study content for DigiLocker, UX4G, or Entity Locker.
- Analytics, deployment configuration, Lighthouse/cross-browser passes
  (those belong to later blueprint phases per §34).
- `next lint`, legacy `.eslintrc.*` config, `gray-matter` or any other
  frontmatter-parsing dependency, `clsx`/`tailwind-merge`, TypeScript 7.
- Redefining Tailwind's `--spacing-*` namespace.
- The deferred decisions in `design.md` §14 items 6–8 (SC 2.4.11
  `scroll-padding-top`/`--header-height`, SC 2.5.8 24×24 reinterpretation,
  `inert` on overlay background) — Aman has **deferred** these to a later
  accessibility pass; they must NOT be implemented as requirements in this
  milestone. (Item 5, leading/tracking tokens, is now **approved** and is
  implemented in Tasks 2 and 4 — no longer deferred.)

# Review Findings — Portfolio Foundation

This document records independent architecture review findings.
It is not a source of truth, does not override IMPLEMENTATION_BLUEPRINT.md,
Kiro steering, or an approved Kiro Spec, and does not itself create
implementation requirements. Findings must be explicitly accepted,
rejected, or resolved before they become part of the implementation plan.

---

## About this record

| | |
|---|---|
| **Review scope** | `.kiro/specs/portfolio-foundation/{requirements,design,tasks}.md`, reviewed against `IMPLEMENTATION_BLUEPRINT.md` and `.kiro/steering/*` |
| **Reviewer role** | Independent engineering review (`.kiro/steering/review-process.md`) |
| **Overall assessment** | READY WITH CHANGES |
| **Findings recorded here** | C1–C10 — the audit's Section C "Critical Issues", listed as BLOCKING in the audit's Section J |
| **Not recorded here** | The audit's non-blocking findings (Sections D, E, F, G, H, I and J's NON-BLOCKING list). Those remain in the review output only. |
| **Status of every finding below** | OPEN |

All ten findings are edits to `design.md` and `tasks.md`. None requires
re-planning, re-scoping, or architectural rework.

### Index

| ID | Area | Severity | Status |
|---|---|---|---|
| C1 | Design tokens / Tailwind | Blocking | OPEN |
| C2 | Design tokens / Tailwind | Blocking | OPEN |
| C3 | Typography / fonts | Blocking | OPEN |
| C4 | Type scale / layout arithmetic | Blocking | OPEN |
| C5 | React architecture / client boundaries | Blocking | OPEN |
| C6 | MDX / accessibility / TypeScript | Blocking | OPEN |
| C7 | Dependencies / tooling | Blocking | OPEN |
| C8 | Accessibility (WCAG 2.2) | Blocking | OPEN |
| C9 | Responsive architecture | Blocking | OPEN |
| C10 | Project setup / repository hygiene | Blocking | OPEN |

---

## C1 — The `@theme` spacing block silently redefines Tailwind's entire spacing scale

- **ID:** C1
- **Area:** Design tokens / Tailwind
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §4 defines `--spacing-4: 4px`, `--spacing-8: 8px`, `--spacing-12: 12px` …
in `@theme`. In Tailwind v4, `--spacing-<n>` is the theme namespace that backs
`p-<n>`, `m-<n>`, `gap-<n>`, `w-<n>`, `h-<n>`, `space-y-<n>`, `inset-<n>` and more.
Defining `--spacing-4: 4px` does not *add* a token — it **redefines `p-4` from 16px
to 4px**, and `p-8` from 32px to 8px.

### Evidence / affected Spec section

- `design.md` §4 — the `/* Spacing (8pt scale) — extends default Tailwind spacing, doesn't replace it */`
  comment asserts the opposite of what the code does.
- `requirements.md` 4.5 — *"expose them through Tailwind theme values (e.g. `bg-canvas`,
  `text-ink`, `p-8`)"*. `p-8` is used as the example of a correctly-consumed token,
  while under this block it means 8px.
- The scale is incomplete, so the result is a **hybrid**: `p-4`=4px and `p-8`=8px
  (overridden) but `p-5`=20px, `p-6`=24px, `p-9`=36px (still generated from the
  untouched `--spacing` base of 0.25rem). Adjacent utilities then disagree about what
  their number means.
- `tasks.md` Task 2.

### Why it matters

Every developer and every coding agent carries Tailwind muscle memory where the number
is a 4px multiplier. Under this block `gap-8` is a hairline instead of 32px. The
failures are silent and visual, they will be spread across every component built in
Tasks 4–12, and the correction later is a full-codebase sweep. This is the
highest-expected-cost defect in the spec.

The override is entirely unnecessary. Every value in the approved scale already exists
in stock Tailwind — 4=`1`, 8=`2`, 12=`3`, 16=`4`, 24=`6`, 32=`8`, 40=`10`, 48=`12`,
64=`16`, 80=`20`, 96=`24`, 128=`32`, 160=`40`, 192=`48`.

### Required resolution

Delete the `--spacing-*` block from `design.md` §4. Replace with an explicit statement:

> The approved 8-point scale maps 1:1 onto Tailwind's default spacing scale
> (multiplier × 4px). Do not redefine `--spacing-*`. Use `p-2` for 8px, `p-6` for 24px,
> `p-16` for 64px, `p-48` for 192px. Off-scale steps (`p-5`, `p-7`, `p-9`, `p-11`…) are
> not part of the design system and must not be used.

If Requirement 7.2's "extend the scale deliberately" is ever exercised, add **named**
tokens (`--spacing-section: 240px`) which cannot collide with the numeric namespace.
Update Req 4.5's example from `p-8` to `bg-canvas`/`rounded-lg` to stop teaching the
wrong mapping.

---

## C2 — `--duration-*` is not a Tailwind v4 theme namespace

- **ID:** C2
- **Area:** Design tokens / Tailwind
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §4 places `--duration-instant`, `--duration-fast`, `--duration-standard`,
`--duration-slow`, `--duration-cinematic` inside `@theme`, and Requirement 4.4 requires
these to be consumable tokens. Tailwind v4's documented theme namespaces include
`--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--spacing-*`, `--breakpoint-*`,
`--ease-*`, `--animate-*` and others — but transition-duration utilities are generated
**dynamically from bare values** (`duration-400` → `400ms`), and there is no
`--duration-*` namespace that produces a `duration-standard` utility.

### Evidence / affected Spec section

- `design.md` §4 motion block, placed inside `@theme` alongside `--ease-standard`
  (which *is* a valid namespace and *will* produce `ease-standard`).
- `requirements.md` 4.4 + 4.5 — require motion timings to be consumed as tokens so
  components "never hardcode … magic numbers".
- `tasks.md` Task 2 — no task verifies a motion utility. Task 2's only verification is
  *"a test utility class (e.g. `bg-canvas`) renders the correct colour"* — a colour
  check that will pass while the motion tokens silently produce nothing.

### Why it matters

The variables will still be emitted as CSS custom properties, so `duration-standard`
will fail silently as a no-op class rather than erroring. The predictable agent response
is `duration-[400ms]` — an arbitrary value, which is precisely what `design-system.md`
forbids ("Do not introduce arbitrary one-off values inside components"). The motion
scale is the token set most likely to be consumed by the hero work in a later milestone,
so drift here compounds.

### Required resolution

Two edits:

1. In `design.md` §4, move the duration values out of `@theme` into a plain `:root` block
   (Requirement 8.1 already anticipates `:root` custom properties "for non-Tailwind
   consumers"), and define the utilities explicitly:

   ```css
   @utility duration-standard { transition-duration: var(--duration-standard); }
   ```

   …or simply consume them as `[transition-duration:var(--duration-standard)]` / in
   component CSS. Keep `--ease-standard` in `@theme` — that one works.

2. Add to Task 2's Verify step: *"confirm each motion, radius and font token produces a
   working utility class, not just a CSS variable — check `ease-standard`, `rounded-lg`,
   `font-display`, and the chosen duration mechanism, not only `bg-canvas`."*

Also resolve the range: Requirement 4.4 specifies Cinematic as **1000–1400ms**;
`design.md` §4 silently collapses it to a single `1200ms`. Per Req 4.6 that discrepancy
should have been flagged. Either state that 1200ms is the chosen point value within the
approved range, or define `--duration-cinematic-min`/`-max`.

---

## C3 — The font tokens hardcode family names that `next/font` never registers

- **ID:** C3
- **Area:** Typography / fonts
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §4 sets `--font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;`.
`design.md` §10 says fonts are loaded via `next/font/google` and "assigned to CSS variables
consumed by the `--font-display`/`--font-body` theme tokens." But `next/font` self-hosts
fonts under a **generated, obfuscated family name** (e.g. `__Space_Grotesk_a1b2c3`) and
exposes it only through the CSS variable you request via the `variable` option. The literal
string `"Space Grotesk"` matches no `@font-face` rule in the output.

### Evidence / affected Spec section

- `design.md` §4 — `@theme` font block (literal family names).
- `design.md` §10 — says the theme tokens consume next/font's variables; §4 does not.
- `requirements.md` 5.1 and 14.2 — both mandate `next/font`.
- `tasks.md` Task 3 — its Verify (*"fonts apply on a test page"*) is the only check, and it
  is manual and easy to eyeball wrong, since `ui-sans-serif`/`system-ui` on macOS renders as
  a clean neutral sans that a reviewer can mistake for Inter at body sizes.

### Why it matters

This is a **silent** failure: the build passes, lint passes, nothing warns, and the site
renders in the system font. Space Grotesk is the display face carrying the entire editorial
identity (`product.md`: "Editorial typography", "Large expressive headlines"). Worse, the
fallback happens to be *acceptable-looking*, so it can survive to production. Aman would be
shipping a portfolio whose typography — the thing it is selling — is not the specified
typography.

### Required resolution

In `design.md` §4, change the font tokens to reference the next/font variables:

```css
--font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
--font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

and in §10 state that the `next/font/google` calls must pass
`variable: "--font-space-grotesk"` / `variable: "--font-inter"`, with both classes applied
to `<html>` in `app/layout.tsx`.

Add to Task 3's Verify: *"in devtools, confirm `getComputedStyle(document.body).fontFamily`
resolves to the next/font-generated family, not `ui-sans-serif`; confirm the Network panel
shows two self-hosted `.woff2` files from `/_next/static/media/`, not a
`fonts.googleapis.com` request."*

---

## C4 — Specified arithmetic does not produce the specified design values

- **ID:** C4
- **Area:** Type scale / layout arithmetic
- **Severity:** Blocking
- **Status:** OPEN

### Finding

**Issue A — Display XL never reaches 120px.** `design.md` §4 defines
`displayXl: "clamp(3.5rem, 3rem + 4vw, 7.5rem)"` with the comment `// ~56px → 120px`.
Solving `48px + 0.04v = 120px` gives **v = 1800px**. The max content width is **1440px**.
At the 1440px design reference the headline renders at **105.6px**, not 120px — and it only
reaches 120px on a viewport wider than the design canvas was ever drawn for.

**Issue B — `Container` max-width is ambiguous, and one reading loses ~115px.**
`design-system.md` specifies *"Max content width: 1440px"* and
*"Page margin: `clamp(20px, 4vw, 64px)`"*. `design.md` §4 says *"`Container` applies
`max-width: var(--grid-max-width)` centered, with horizontal padding `var(--grid-margin)`."*
With `box-sizing: border-box`, that makes 1440px the **outer** width, so actual content width
at large viewports is `1440 − 2 × 57.6 = 1324.8px`.

### Evidence / affected Spec section

- `design.md` §4 — type scale map and the `Container` description.
- `design-system.md` — type table (Display XL = 120px) and grid section.
- Every other clamp in the map was checked — `displayL` (88.96px at 1440), `displayM`,
  `headingXl`, `headingL`, `headingM`, `headingS` all reach or exceed their targets within
  1440px. **Display XL is the only broken one**, and it is the most visible token on the site.
- `tasks.md` Task 4 — its Verify says *"matches the **approximate** min/max sizes"*; the word
  "approximate" means this will be waved through.

### Why it matters

Display XL is the hero headline. A 12% shortfall on the single largest type element is the
difference between the approved editorial direction and a merely large heading. And because
the clamp interpolation is described in the spec as "a reasonable-default implementation
detail… not a product decision," no one will re-derive it.

The Container ambiguity is the classic way an implementation ends up subtly narrower than the
design file, at which point the 12-column grid math stops matching anything drawn in Figma.

### Required resolution

1. Replace the Display XL clamp with one that actually hits both endpoints at the specified
   viewports:

   ```
   displayXl: "clamp(3.5rem, 2.1rem + 6vw, 7.5rem)"   // 56px @375 → 120px @1440
   ```

   (At 375px: 33.6 + 22.5 = 56.1px. At 1440px: 33.6 + 86.4 = 120.0px.)

2. Add to Task 4's Verify a numeric check rather than an eyeball one: *"at exactly 1440px
   viewport width, computed `font-size` of Display XL is 120px ±1px; at 375px it is 56px
   ±1px."* Replace "approximate" with the tolerance.

3. State explicitly in `design.md` §4 whether 1440px is the content box or the outer box.
   Recommended: content box — `Container` gets
   `max-width: calc(var(--grid-max-width) + 2 * var(--grid-margin))` with the margin as
   padding, so content caps at a true 1440px. Whichever is chosen, write it down; this is not
   an implementation detail.

---

## C5 — `Header` is specified as a Server Component that consumes a React hook

- **ID:** C5
- **Area:** React architecture / client boundaries
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §6 describes `Header` as a **Server Component** whose scroll behaviour is
*"implemented as a small client-only scroll listener isolated to a `useScrollState` hook
**consumed by `Header`'s client boundary**."* A Server Component cannot call a hook, and
"Header's client boundary" is not defined anywhere. The sentence describes an impossible
component.

### Evidence / affected Spec section

- `design.md` §6 (`useScrollState`) vs §7 (`useScrollCompact`) — **the same hook is given two
  different names in adjacent sections**, which confirms the mechanism was never actually
  pinned down.
- `requirements.md` 11.7 — *"only the interactive parts (scroll listener, mobile overlay
  toggle) SHALL be a Client Component; static markup SHALL remain server-rendered where
  possible."*
- `tasks.md` Task 7 — its Verify (*"no layout-affecting client JS beyond the boolean toggle"*)
  checks the *amount* of JS work, not the *boundary*, so a fully-client `Header` passes this
  check.

### Why it matters

This is the highest-probability drift point in the entire spec, and the resolution an agent
will reach for is the wrong one. Faced with "Server Component that needs a hook," the path of
least resistance is `"use client"` at the top of `Header.tsx` — which pulls `DesktopNav`, all
six `next/link` elements, and the typography primitives it touches into the client bundle.
That directly violates Req 11.7, and because `Header` is in the root layout, it applies to
**every route on the site**. The foundation's core performance claim ("Prefer Server
Components", "Keep hydration and client JS minimal — this is a performance requirement, not a
style preference") would be compromised on day one, invisibly.

### Required resolution

Specify the composition pattern concretely in `design.md` §6, and name the file:

> `components/layout/Header.tsx` — Server Component. Renders `<header>` and
> `<nav aria-label="Primary">`, and composes `<HeaderShell>{server-rendered nav markup}</HeaderShell>`.
>
> `components/layout/HeaderShell.tsx` — `"use client"`. Accepts `children` only. Owns the
> scroll listener, sets `data-scrolled` on its own root element, and renders `{children}`
> untouched. Because the nav markup is passed as `children` from a Server Component, it is
> **not** part of the client bundle.
>
> Hook name: `useScrollCompact`, in `components/layout/useScrollCompact.ts`. Delete the
> `useScrollState` reference in §6.

Change Task 7's Verify to something the boundary actually fails: *"`grep -rn 'use client'
components/` returns only `HeaderShell.tsx` and `MobileNav.tsx`; `next build` route output
shows no increase in First Load JS for static routes beyond the two client islands."*

Also specify `{ passive: true }` on the scroll listener and a `requestAnimationFrame` or
threshold guard so the handler cannot fire state updates on every scroll event (INP).

---

## C6 — The `mdx-components.tsx` mapping breaks heading hierarchy and will not typecheck

- **ID:** C6
- **Area:** MDX / accessibility / TypeScript
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §11's sketch maps MDX headings by **size only**, never by element:

```tsx
h2: (props) => <Heading size="l" {...props} />,
h3: (props) => <Heading size="m" {...props} />,
```

Per `design.md` §5, `Heading` **defaults to `as="h2"`**. So an `##` and a `###` in MDX both
render an `<h2>` element, differing only in visual size.

### Evidence / affected Spec section

- `design.md` §5 — *"`Heading` supports `xl|l|m|s` and **defaults to `h2`**"*.
- `design.md` §11 — mapping (no `as` prop passed).
- `requirements.md` 12.1 — *"a correct heading hierarchy starting at `h1`."*
- `design.md` §5 also states *"None of these components own page-level heading hierarchy — the
  consuming page decides `as`"* — and then §11 is a consuming site that doesn't decide `as`.
- Secondary: `DisplayProps`/`HeadingProps` in §5 accept only `as`, `size`, `children`,
  `className`. MDX spreads `{...props}` including `id` (from heading-anchor handling) and
  `ref`. Under `strict` (Req 2.1) this is a **compile error**, and it also silently drops
  heading `id`s.
- `tasks.md` Task 13 — its Verify (*"the MDX body renders using the mapped typography
  components"*) confirms the styling, not the semantics.

### Why it matters

Flattened heading hierarchy is a WCAG 1.3.1 failure and one of the first things a
screen-reader user notices, via heading-jump navigation. On a portfolio whose explicit pitch
includes *"Accessibility expertise"* and which `design-system.md` says *"is a demonstration of
accessibility expertise"*, shipping broken heading semantics inside the case studies is the
worst possible place for this bug. And case studies are the long-form content where heading
navigation matters most.

### Required resolution

1. Fix the mapping to pass both:

   ```tsx
   h2: (props) => <Heading as="h2" size="l" {...props} />,
   h3: (props) => <Heading as="h3" size="m" {...props} />,
   h4: (props) => <Heading as="h4" size="s" {...props} />,
   ```

2. In `design.md` §5, widen the typography component props to extend the intrinsic element's
   props (`React.ComponentPropsWithoutRef<'h2'>` or equivalent) so `id`/`className`/ARIA
   attributes pass through without `any`. Note that `as` + full prop passthrough needs a small
   amount of care under `strict` — specify the concrete signature in §5 rather than leaving it
   to implementation time, or the agent will reach for `any` (Req 2.4) or for a
   polymorphic-component generic (over-abstraction).

3. Add to Task 13's Verify: *"in the rendered `/work/_example` page, the browser accessibility
   tree shows heading levels matching the MDX source (`##` → level 2, `###` → level 3), not
   all level 2."*

---

## C7 — Three undeclared dependencies are required by the design sketches

- **ID:** C7
- **Area:** Dependencies / tooling
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design.md` §2 presents a closed dependency table and states *"No other dependency is
introduced."* Three sketches elsewhere in the same document require packages absent from that
table.

### Evidence / affected Spec section

1. **`@eslint/eslintrc` and `@eslint/js`** — `design.md` §4a's `eslint.config.mjs` sketch
   imports both. Neither is in §2. (`@eslint/js` is also imported and never used — an
   unused-import lint error in the lint config itself.)
2. **`cn()`** — used in the §5 `Display` sketch (`cn("font-display text-ink", sizeMap[size], className)`),
   while §3 lists `lib/utils/cn.ts` as *"small classnames helper (**only if needed; otherwise
   skip**)"*. It is needed — §5 uses it. And `cn` is, by near-universal convention in Tailwind
   projects, `clsx` + `tailwind-merge`.
- Also affected: `requirements.md` 1.2, 1.3; `tasks.md` Task 1, Task 4.

### Why it matters

`requirements.md` 1.3 mandates a **stop-and-ask** before adding any unapproved dependency, and
`tech.md` requires justification for each. Task 1 will hit this on its first file and either
(a) stop and block on an approval round-trip for two trivial ESLint packages, or (b) — far more
likely — install `clsx` and `tailwind-merge` without asking, because the code sketch uses `cn`
and every Tailwind codebase in its training data defines `cn` that way. Option (b) quietly
establishes that the dependency gate is advisory, which is the precedent that matters far more
than the two packages.

`tailwind-merge` is also a genuinely poor fit here: it exists to resolve conflicting utility
classes at runtime, adds ~6KB, and its class-conflict map is Tailwind-version-coupled. This
project's typography primitives have a fixed, small size map with no conflict problem to solve.

### Required resolution

1. Add `@eslint/eslintrc` and `@eslint/js` to the §2 table (dev-only, required by `FlatCompat`;
   note they are pulled in automatically by `create-next-app`'s default config), and remove the
   unused `js` import from the sketch — or drop `FlatCompat` entirely if
   `eslint-config-next@16.3.7` ships a native flat export, as §4a already allows.

2. Resolve `cn` explicitly in §3. Recommended wording:

   > `lib/utils/cn.ts` — a dependency-free join:
   > `export const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");`.
   > **Do not install `clsx` or `tailwind-merge`.** The typography and layout primitives apply a
   > fixed size map plus an optional `className` override; there are no class conflicts to merge.
   > If class-conflict resolution is ever genuinely required, that is a dependency request under
   > `tech.md`, not an implementation detail.

---

## C8 — WCAG 2.2-specific criteria are not addressed, and the sticky header creates the classic 2.4.11 failure

- **ID:** C8
- **Area:** Accessibility (WCAG 2.2)
- **Severity:** Blocking
- **Status:** OPEN

### Finding

The spec targets **WCAG 2.2 AA** but the accessibility plan (`design.md` §12, Req 12) is
essentially a WCAG 2.1 checklist. The criteria that are *new in 2.2* are absent, and one of them
is set up to fail by the spec's own navigation design.

### Evidence / affected Spec section

1. **SC 2.4.11 Focus Not Obscured (Minimum) — AA, new in 2.2.** Req 11.2 mandates a
   **fixed/sticky** header. Nothing in the spec mentions `scroll-padding-top` on the scroll
   container or `scroll-margin-top` on focusable targets. A sticky header plus keyboard `Tab`
   into an element just below the fold scrolls that element *underneath* the header — this is
   the single most common 2.4.11 failure in the wild, and it will apply to every route because
   the header is in the root layout.
2. **SC 2.5.8 Target Size (Minimum) — AA, new in 2.2.** Req 12.5 says 44×44px *"on mobile
   viewports."* Two problems: 2.5.8's AA threshold is **24×24 CSS px** (44×44 is 2.1 **AAA** /
   2.5.5), and it applies at **all** viewports, not just mobile. Desktop nav links at Body S /
   Caption size with tight padding are the likely failure site.
3. **Skip link focus.** `design.md` §12 says the skip link "targets `#main`" and Task 10 verifies
   it "jumps focus to `#main`". `<main>` is not focusable by default; without `tabIndex={-1}` on
   it, several browsers move the scroll position but leave focus in the skip link, so the next
   `Tab` returns to the nav. Neither `design.md` §8 nor Task 10 mentions `tabIndex={-1}`.
4. **Reduced-motion implementation is unspecified.** Req 8.2 says global styles "SHALL disable or
   shorten non-essential transitions/animations." The idiomatic agent output is
   `* { animation: none !important; transition: none !important; }`, which conflicts with Motion
   Principle 6 ("Animations must remain interruptible") and will later fight Motion for React's
   exit animations.
5. **No line-height or letter-spacing tokens exist** — not in `design-system.md`, not in
   `design.md` §4, not in the `typeScale` map. At Display XL (120px) the browser default of ~1.5
   makes the five-line hero headline roughly 900px tall. This is both a visual defect and an
   accessibility one (SC 1.4.12 Text Spacing).

### Why it matters

`product.md` lists "Accessibility expertise" as a thing the site must communicate, and
`design-system.md` says *"The portfolio itself is a demonstration of accessibility expertise —
treat accessibility bugs with the same severity as visual or functional bugs."* A portfolio that
claims WCAG 2.2 AA while failing a criterion that is *new in 2.2* is a credibility problem, not
just a bug — and it is exactly the kind of thing a design-systems interviewer would check.

Item 5 is also a drift magnet: with no leading/tracking tokens, every component will invent
`leading-[0.95] tracking-[-0.03em]` arbitrary values, which is precisely what
`design-system.md` prohibits.

### Required resolution

1. Add to `design.md` §12 and Req 12: *"`html { scroll-padding-top: calc(var(--header-height) + 1rem); }`
   with `--header-height` defined as a token and updated for the compacted state, satisfying SC
   2.4.11."* Add a keyboard check to Task 16: *"Tab through every focusable element on a scrolled
   page; confirm none is obscured by the sticky header."*

2. Reword Req 12.5: *"Interactive elements SHALL meet SC 2.5.8 (24×24 CSS px minimum) at **all**
   viewports; nav links and the mobile menu button target 44×44 as the project standard."*

3. Specify `<main id="main" tabIndex={-1}>` in `design.md` §8 and in Task 10.

4. Specify the reduced-motion block concretely:

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

   and add the note: *"This CSS cannot stop JS-driven animations. Any future Motion for React work
   must additionally branch on `useReducedMotion()` — the CSS block is not sufficient for the hero
   transition."*

5. **Add `--leading-*` and `--tracking-*` tokens** to `design.md` §4 and flag to Aman that
   `design-system.md` is silent on them — at minimum a tight display leading (~0.95–1.05), a
   comfortable body leading (~1.5–1.6), and negative display tracking. This is a genuine gap in
   the approved design system, not something the spec should invent unilaterally: **flag it for
   Aman's decision rather than having Kiro pick values.**

---

## C9 — The grid's breakpoints are never defined anywhere

- **ID:** C9
- **Area:** Responsive architecture
- **Severity:** Blocking
- **Status:** OPEN

### Finding

`design-system.md` names three grid tiers (Desktop 12 / Tablet 8 / Mobile 4) with **no pixel
boundaries**. `design.md` §4 names only one: *"`repeat(8, 1fr)` at tablet (`md:`)"* — the desktop
breakpoint is written as "at desktop" with no variant named. No `--breakpoint-*` tokens appear in
the `@theme` block, so Tailwind's defaults silently apply (sm 640 / md 768 / lg 1024 / xl 1280 /
2xl 1536).

### Evidence / affected Spec section

- `design.md` §4 — grid paragraph; the `@theme` block contains no `--breakpoint-*` entries.
- `tasks.md` Task 5 — verifies at **375 / 768 / 1440px**. 1440 sits above `xl` (1280) and below
  `2xl` (1536), so whether the 12-column grid engages at `lg:` or `xl:` is undetermined, and both
  choices pass Task 5's verification.
- `requirements.md` 6.1 — states the column counts but no viewports.
- `requirements.md` 11.3 — says "mobile-sized" with no threshold.

### Why it matters

This is a foundation-level constant with no owner. The agent will pick a variant in Task 5, then
pick possibly a different one in Task 7 for the nav's desktop/mobile switch, then a third in Task
12. Within a few milestones the site has three different definitions of "desktop", which manifests
as layout breaking in a narrow band that nobody tests. This is textbook responsive drift, and it is
cheap to prevent now and tedious to unpick later.

Related: `design-system.md` also doesn't define behaviour above 1440px ("large desktop"). The
Container handles it by growing gutters, which is fine — but it should be stated so an agent
doesn't invent a `3xl` breakpoint or a second max-width.

### Required resolution

Add explicit breakpoint tokens to `design.md` §4's `@theme` block and name the three tiers once:

```css
--breakpoint-md: 768px;   /* tablet:  8 columns */
--breakpoint-lg: 1024px;  /* desktop: 12 columns */
```

State in §4: *"Mobile (base, <768px) = 4 columns. Tablet (`md:`, 768–1023px) = 8 columns. Desktop
(`lg:`, ≥1024px) = 12 columns. The mobile/desktop navigation switch uses the same `lg:` boundary.
Above 1440px the Container caps and gutters grow — there is no additional breakpoint. Do not use
`sm:`, `xl:` or `2xl:` in foundation components."*

Add to Task 5's Verify: *"check column count at 767, 768, 1023 and 1024px — the boundaries, not
only the midpoints."*

---

## C10 — Task 1 does not say whether to run `create-next-app` or scaffold manually, and the repo has no usable `.gitignore`

- **ID:** C10
- **Area:** Project setup / repository hygiene
- **Severity:** Blocking
- **Status:** OPEN

### Finding

Task 1 says *"Scaffold `package.json`…, `app/` directory, `tsconfig.json`…"* (manual), then
verifies *"`next build` produces a working default page"* (a `create-next-app` outcome). The two
standard paths produce materially different repositories.

### Evidence / affected Spec section

- `tasks.md` Task 1 — bullets 2–4 vs its Verify bullet.
- `design.md` §3 — the directory tree omits `next.config.ts`, `postcss.config.mjs`, `package.json`,
  `tsconfig.json`, `.gitignore` entirely — yet Task 13 says *"Configure `@next/mdx` … in
  `next.config.ts`"*, a file the structure never introduces.
- **The repository `.gitignore` contains exactly one line: `.kiro/.DS_Store`.** No `node_modules/`,
  no `.next/`, no `.env*`. (Verified against the working tree at review time.)
- `requirements.md` 1.5 — `create-next-app` would install *its own* dependency versions, directly
  conflicting with Task 1's exact-pin list (`next@16.3.7`, `react@19.3.0`, …).

### Why it matters

Two concrete failure modes. First, `create-next-app` also scaffolds Tailwind and an ESLint config —
which would collide with Tasks 2 and 4a and produce a mixed configuration that nobody chose.
Second, and more immediately: with the current `.gitignore`, the first `npm install` puts
`node_modules/` in the working tree untracked, and `tech.md`'s git discipline ("stage specific
files, not blanket `git add`") is the only thing standing between that and a commit with tens of
thousands of files. Task 1 creates `package.json` but no task creates a `.gitignore`.

### Required resolution

1. State the method in Task 1 explicitly. Recommended: *"Run `npx create-next-app@16.3.7` with
   TypeScript, ESLint, Tailwind, App Router, and the `@/*` alias; then **pin `package.json` to the
   exact versions in `design.md` §2**, delete any scaffolded demo page/CSS, and reconcile the
   generated `eslint.config.mjs` against §4a. Do not hand-roll the scaffold."* (This also resolves
   C7's ESLint packages, which `create-next-app` provides.)

2. Add a Task 1 bullet: *"Write `.gitignore` covering `node_modules/`, `.next/`, `out/`,
   `.env*.local`, `.DS_Store`, `*.tsbuildinfo`, `.vercel` — preserving the existing
   `.kiro/.DS_Store` entry. Verify `git status` is clean of build output after `npm install` and
   `next build`."*

3. Add `next.config.ts`, `postcss.config.mjs`, `package.json`, `tsconfig.json`, `.gitignore` to
   `design.md` §3's tree so the file inventory is complete.

---

## Priority note (from the original audit)

The audit's Section K stated: if only three of these are addressed, they should be **C1**
(the spacing collision — highest expected cost), **C5** (the Header boundary — the drift that
undoes the project's core performance claim on every route), and **C3** (font tokens — a silent
failure that can reach production because the fallback looks fine).

The audit also noted that these should not be deferred and fixed during implementation: C1, C3 and
C9 are foundational constants that every subsequent task inherits, and C5 is a boundary that gets
harder to reverse with each component added above it.

---

Resolution authority: Aman Mittal.

# Tasks — Portfolio Experience

Implementation-ready task list for the homepage / primary portfolio experience.
Primary implementer: **Claude Code**. Each task is a small, independently
reviewable vertical slice that renders in the browser and must pass
`tsc --noEmit`, `npm run lint`, and `next build` before the next task starts
(`review-process.md`, `tech.md`). Requirement references point to
`requirements.md`; design references to `design.md`.

> **DO NOT implement yet.** This spec is specification-only. Implementation
> begins after approval and after the blocking Open Decisions are resolved
> (see "Preconditions").

## Preconditions (resolve before coding)

These gate specific tasks; the non-conditional spine (Tasks 1–6, 10–13) can
proceed with provisional content once OD-4 and the content-integrity approach
are confirmed.

- **OD-1** (signature transition) → gates Task 15.
- **OD-2** (Design System section) + **CR-8** → gates Task 16.
- **OD-3** (Playground section) → gates Task 17.
- **OD-4** (Scale provisional-visible vs. gated) → gates Task 9.
- **OD-6** (Hero media) → affects Task 5 (default: typography-only).
- Content **CR-1…CR-7** replace provisional placeholders later; their absence
  does **not** block building the sections against the typed models with
  clearly-provisional values. No fabrication (`CLAUDE.md` §17).

Every task inherits these global constraints (not repeated per task):
no new dependency; no new design token / arbitrary value (Requirement 11);
Server Components by default, `"use client"` only per `design.md` §15;
frozen Foundation files and the deferred WCAG items are not modified
(Requirement 9.9); approved copy used verbatim, gaps rendered as obviously
provisional.

---

- [ ] 1. Add the Selected Work content model (types + provisional data)
  - Add `ProjectSummary` to `lib/content/types.ts` **additively** — do NOT
    modify the frozen `CaseStudyMeta` interface or `lib/content/index.ts`'s
    `getCaseStudyBySlug`/`getAllCaseStudySlugs` (Requirement 12.3/12.4).
  - Create `lib/content/projects.ts` exporting a typed `projects:
    ProjectSummary[]` with the flagship entries (DigiLocker, UX4G, Entity
    Locker, Accessibility — blueprint §10 identity/order only). Every field
    that is CR-1 (role, discipline, valueProposition) uses a **clearly
    provisional** value (e.g. `"Role — content required"`); every entry has
    `caseStudySlug: null` (no real case study exists, so nothing links to a
    404ing slug) and `preview: null` (CR-2) and `provisional: true`.
  - Shape per `design.md` §7.
  - _Verify:_ `tsc --noEmit` clean; a scratch import of `projects` is typed;
    no value resembles final approved copy; no `caseStudySlug` points at a
    non-existent `/work/[slug]`.
  - _Requirements: 3.3, 3.8, 3.9, 11.1, 12.3, 12.4_

- [ ] 2. Build the reusable motion primitive `Reveal`
  - Create `components/motion/Reveal.tsx` (`"use client"`) per `design.md`
    §14: a thin wrapper using `motion` `whileInView` (`translateY(8px)→0`
    only — opacity intentionally not animated, per the transform-only
    resolution in `requirements.md`), `viewport={{ once: true }}`, with
    `useReducedMotion()` resolving to the final state without animation when
    reduced motion is set (same rendered element in both modes). Props: `children`, optional `delay`/`index` for stagger. Duration
    values equal the token values (0.4 = `--duration-standard`, 0.2 =
    `--duration-fast`) with a comment tying each to its token (Requirement
    8.2/8.4; `design.md` §14 motion-token discipline).
  - Children are passed through (server-rendered content stays out of the
    client bundle — same pattern as frozen `HeaderShell`).
  - _Verify:_ `tsc --noEmit`, `lint`, `build` clean; `grep "use client"
    components/motion/Reveal.tsx` is the only directive in that file; in the
    browser, a wrapped test element fades/translates in once on scroll, and
    with `prefers-reduced-motion` it is visible immediately with no transform.
  - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.6, 10.1_
  - _Depends on: none (independent primitive)_

- [ ] 3. Scaffold section components as static, server-rendered placeholders
  - Create Server Components with correct semantics and approved copy, no
    motion yet, in the approved order: `components/hero/Hero.tsx`,
    `components/sections/{Philosophy,Principles,Scale,About,Contact}.tsx`, and
    `components/work/{ProjectGrid,ProjectCard,ProjectMeta}.tsx`. Each
    `sections/*` renders a named `<section aria-labelledby>` wrapped in the
    frozen `Container`, with an `h2` heading via the typography primitives
    (explicit `as`). Hero renders the page `h1` (§5). Use only approved copy
    (Requirement 1.1/1.2, 4.1–4.5, 12 About/Contact anchors); everything else
    provisional.
  - This task establishes structure/semantics/hierarchy only — layout polish
    and motion come in later tasks. No conditional sections yet.
  - _Verify:_ importable without error; `tsc`/`lint`/`build` clean; browser
    a11y tree shows exactly one `h1` and `h2`s per section with no skipped
    levels (`design.md` §3 heading map).
  - _Requirements: 9.1, 9.2, 11.3, 11.5_
  - _Depends on: 1 (ProjectCard consumes `ProjectSummary`)_

- [ ] 4. Assemble `app/page.tsx` in the approved section order
  - Replace the placeholder home body with a Server Component that composes
    the sections from Task 3 in the blueprint §6 order (Hero → Selected Work →
    Philosophy → Principles → Scale → About → Contact), each with its anchor
    `id` (`#selected-work`, `#contact`, …). Keep the homepage `metadata` via
    `createMetadata({ title: "Home", description: <approved positioning>, path:
    "/" })`. Do NOT add a `<main>` (frozen layout owns it).
  - Leave empty slots (in approved position) for the conditional sections
    (signature transition after Hero; Design System after Scale; Playground
    after Design System) so later tasks drop in without reordering.
  - _Verify:_ `/` renders all spine sections in order; one `h1`; metadata/
    canonical/OG correct in page source; `tsc`/`lint`/`build` clean; `/` First
    Load JS captured as the baseline for later island tasks.
  - _Requirements: 9.1, 9.2, 11.4, 12.1, 12.5, cross-cutting 4_
  - _Depends on: 3_

- [ ] 5. Hero — composition, responsive, and entrance motion
  - Flesh out `components/hero/Hero.tsx` per `design.md` §5: five-line approved
    headline (explicit line structure) as `Display xl` `h1`; approved
    supporting statement in `Body`; ≈ one-viewport desktop composition
    (`min-h-dvh`/`svh` is a layout utility, allowed — not a token);
    grid-aligned; mobile reflow with headline dominant and no overflow.
  - Add the entrance via `components/hero/HeroReveal.tsx` (`"use client"`,
    §5 motion table: translateY only (no opacity), `--duration-standard`, `ease-standard`,
    `useReducedMotion()` → final state). Static-first: headline present/styled
    server-side; wrapper animates presence only.
  - CTA per OD-1/§5: a restrained anchor to `#selected-work` (and/or `#contact`)
    — never a dead link. If OD-6 = include Hero media, wire real art + alt
    (CR-5) via `next/image`, prioritized; default is typography-only.
  - _Verify:_ at 1440px Display XL computes 120px ±1 and at 375px ≈56px (frozen
    `typeScale`); ≈ one viewport desktop; no mobile overflow; reduced-motion
    shows final composition instantly; `tsc`/`lint`/`build` clean; First Load
    JS increase limited to the Hero island.
  - _Requirements: 1.1–1.9, 7, 8.1–8.5, 10.1–10.3_
  - _Depends on: 4_

- [ ] 6. Selected Work — editorial layout, previews, interaction
  - Flesh out `ProjectGrid`/`ProjectCard`/`ProjectMeta` per `design.md` §7:
    editorial desktop layout on the frozen `Grid` with the highest-`order`
    project given more visual weight; tablet/mobile reflow (not a shrunk
    desktop); `ProjectMeta` as `h3` name + role·discipline (`Label`/`Body s`
    muted) + value proposition (`Body`).
  - Preview: `next/image` with explicit dimensions, responsive `sizes`, lazy
    below the fold, `rounded-lg`; when `preview === null`, a tokenized
    empty-state (Border/Surface, sized to intended aspect ratio) with decorative
    `alt=""` — no fabricated screenshot/alt.
  - Case-study link slot renders only if `caseStudySlug !== null`; this
    milestone's entries are all `null`, so render a non-interactive "Case study
    — coming soon" affordance, not an `<a>` to a 404 (Requirement 3.4).
  - Hover affordance (transform/opacity) mirrored on keyboard focus; usable on
    touch; nothing hover-/colour-only.
  - Wrap the section's entries in `Reveal` (staggered) for scroll-in reveal.
  - _Verify:_ layouts reflow correctly at 375/768±1/1024±1/1440; no CLS (sized
    previews/placeholders); keyboard focus reaches each entry with visible ring;
    no dead links; reduced-motion shows entries immediately; `tsc`/`lint`/`build`
    clean.
  - _Requirements: 3.1–3.9, 7, 9.3–9.6, 10.3, 10.5_
  - _Depends on: 1, 2, 4_

- [ ] 7. Philosophy & Principles — typographic composition + staggered reveal
  - Flesh out `Philosophy.tsx` (approved primary/progressive/closing statements
    verbatim, predominantly typographic, minimal chrome; keep a single `h1` —
    the section `h2` carries the primary statement per `design.md` §8) and
    `Principles.tsx` (four approved principles as `h3` + one-line `Body`,
    2×2 desktop grid / stacked mobile).
  - Apply `Reveal` (staggered) to the progressive statements and the four
    principles — never all at once (blueprint §24.2).
  - _Verify:_ approved copy exact and in order; heading levels correct beneath
    `h1`; staggered reveal on scroll; reduced-motion shows all copy immediately;
    responsive reflow; `tsc`/`lint`/`build` clean.
  - _Requirements: 4.1–4.7, 7, 8.5, 9.1_
  - _Depends on: 2, 4_

- [ ] 8. (reserved — Principles folded into Task 7)
  - Principles is delivered in Task 7 as a single typographic slice with
    Philosophy; no separate task is needed. Left as an explicit no-op so the
    numbering matches the review conversation. Skip.

- [ ] 9. Scale / Experience & Impact — dark section + content gate (OD-4, CR-3)
  - Create `lib/content/scale.ts` (`ScaleFigure[]`) and flesh out `Scale.tsx`
    per `design.md` §9: `bg-ink` dark surface, Canvas/Surface text, Accent
    emphasis (no new colour token); figures as a `<dl>` (value/label
    programmatically paired); responsive reflow (4→2→1); AA contrast verified
    on the dark surface.
  - **Content gate:** render per OD-4 — either visibly-provisional placeholders
    (never the illustrative blueprint numbers as fact) or a gated "coming" state
    until CR-3 verified figures are supplied. Do NOT publish blueprint §13
    figures as final.
  - _Verify:_ dark surface meets AA contrast for all text; value/label pairing
    present in the a11y tree; reflow at breakpoints; no illustrative figure
    shown as fact; `tsc`/`lint`/`build` clean.
  - _Requirements: 5.1–5.6, 7, 9.7_
  - _Depends on: 2, 4 — **blocked on OD-4**_

- [ ] 10. About & Contact — approved anchors + provisional details
  - Flesh out `About.tsx` (approved positioning line as final; current focus /
    timeline / interests / tools as clearly-provisional CR-4 placeholders — no
    fabricated employers/dates/tools) and `Contact.tsx` (approved heading "HAVE
    A GOOD PROBLEM?" + "Let's figure it out."; Email/LinkedIn/Résumé as
    provisional/disabled affordances until CR-6 — no fabricated addresses; NO
    contact form). `#contact` is a valid Hero/nav anchor target.
  - Apply `Reveal` for restrained entrance.
  - _Verify:_ approved copy exact; no fabricated identity/contact data; links
    are provisional affordances, not dead `<a>`s; reduced-motion safe;
    responsive; `tsc`/`lint`/`build` clean.
  - _Requirements: 4 (About/Contact anchors), 8.5, 9.3–9.4, 12.2_
  - _Depends on: 2, 4_

- [ ] 11. Homepage motion & interaction polish pass
  - Review every animation added so far against `design.md`'s motion tables and
    Requirement 8: confirm each has a defined trigger/property/duration/easing/
    reduced-motion behaviour; durations/easing are token-equal; GPU-friendly
    properties only; nothing animates all-at-once; no scroll hijack/parallax; no
    Lenis/smooth-scroll library; reveals fire once and don't re-trigger
    disruptively.
  - No arbitrary timing values; `motion` values traceable to tokens via comments.
  - _Verify:_ motion audit documented (section → trigger/property/duration/
    easing/reduced-motion); reduced-motion pass across the whole page; INP not
    regressed by long tasks; `tsc`/`lint`/`build` clean.
  - _Requirements: 8.1–8.7, 10.6_
  - _Depends on: 5, 6, 7, 9, 10_

- [ ] 12. Accessibility pass (homepage)
  - Full-page audit against Requirement 9: one `h1` + unbroken hierarchy; each
    section a named region inside the frozen `main#main` (no second `<main>`);
    keyboard operability + logical order + visible `:focus-visible`; semantic,
    named, non-dead links; meaningful/decorative `alt`; non-colour cues; AA
    contrast (incl. dark Scale surface, Muted only non-essential); 44×44 mobile
    targets; reduced-motion.
  - Do NOT implement the deferred items (SC 2.4.11 `scroll-padding-top`/
    `--header-height`, SC 2.5.8 24×24, `inert`). If long-scroll SC 2.4.11 is
    observed to materially harm keyboard users, raise **OD-5** — do not fix
    silently.
  - _Verify:_ keyboard-only pass end to end; a11y tree heading check; contrast
    measurements recorded for Scale + Accent-on-dark; targets measured on
    mobile; results documented.
  - _Requirements: 9.1–9.10_
  - _Depends on: 5, 6, 7, 9, 10_

- [ ] 13. Performance & boundary verification pass
  - Confirm Server-Components-by-default; `grep -rn "use client" components/`
    returns only frozen `HeaderShell.tsx` + `MobileNav.tsx` plus the islands
    this milestone deliberately added (`Reveal`, `HeroReveal`, and any OD
    islands). Capture `/` First Load JS from `next build` and compare to the
    Task 4 baseline — increase limited to the deliberate islands. Confirm
    `next/image` usage (dimensions, `sizes`, lazy/priority), SVG icons, no
    third-party scripts, no loading screen, no CLS.
  - Token-fidelity grep: no `text-[`/`bg-[#`/`p-[`/`gap-[`/`duration-[`/
    `leading-[`/`tracking-[` in new files.
  - _Verify:_ boundary grep + First Load JS documented; image/CLS checks pass;
    token-fidelity grep clean; `tsc`/`lint`/`build` clean.
  - _Requirements: 10.1–10.7, 11.1, 11.4_
  - _Depends on: 5, 6, 7, 9, 10, 11_

### Conditional tasks (only if the Open Decision resolves to "include")

- [ ] 14. (reserved for OD-1 numbering alignment — see Task 15)

- [ ] 15. Signature transition **(only if OD-1 = include)**
  - Build `components/hero/HeroTransition.tsx` (`"use client"`) per `design.md`
    §6: scroll-progress-driven (`useScroll`/`useTransform`) resolve of the
    headline sequence into a structured grid entering Selected Work; NOT
    scroll-jacking; interruptible; mobile-degrading; `useReducedMotion()` →
    static end-state grid. Cinematic timing only here (Requirement 8.3). Drop
    into the reserved slot after Hero in `app/page.tsx`; reconcile with the
    Hero CTA/entrance (§5) so they don't conflict.
  - _Verify:_ scrolls normally (no hijack), interruptible; mobile shows static
    end state or a performant reduced sequence; reduced-motion shows end-state
    grid; Hero paint not delayed; First Load JS increase limited to this island;
    `tsc`/`lint`/`build` clean.
  - _Requirements: 2.1–2.6, 8.3, 8.4_
  - _Depends on: 5 — **blocked on OD-1 = include**_

- [ ] 16. Design System section **(only if OD-2 = include)**
  - Build `components/sections/DesignSystem.tsx` (Server shell, approved title
    "DESIGN IS A SYSTEM.") + any `components/system/*` client islands at the
    depth confirmed by CR-8, per `design.md` §10: demonstrate
    Token→Component→Pattern→Product→Ecosystem using the project's **real**
    tokens; interactive demos keyboard-operable, reduced-motion-aware,
    non-colour-only, degrading to static; isolated islands; no new dependency.
    Drop into the reserved slot after Scale.
  - _Verify:_ title exact; demos keyboard operable + reduced-motion safe +
    static-degrading; islands isolated (boundary grep); no new dependency;
    `tsc`/`lint`/`build` clean.
  - _Requirements: 6.1–6.5, 8, 9, 10.1_
  - _Depends on: 4, 9 — **blocked on OD-2 = include + CR-8**_

- [ ] 17. Playground section **(only if OD-3 = include)**
  - Build `components/sections/Playground.tsx` (Server) + `lib/content/
    playground.ts` per `design.md` §11: content-driven, extensible via MDX/
    content later; entries are CR-7 provisional placeholders; NO `/playground`
    route; onward link omitted/non-interactive until that route exists. Drop
    into the reserved slot after Design System.
  - _Verify:_ renders provisional entries; no dead link to `/playground`; easy
    to extend (model shape); `tsc`/`lint`/`build` clean.
  - _Requirements: 7.1–7.3_
  - _Depends on: 4 — **blocked on OD-3 = include**_

- [ ] 18. Final milestone verification
  - Run `tsc --noEmit`, `npm run lint`, `next build` clean; execute the full
    `design.md` §18 plan on the assembled homepage: live responsive at
    375/768±1/1024±1/1440; heading-tree; keyboard; reduced-motion; contrast;
    CLS/image; boundary grep + First Load JS; token-fidelity grep;
    content-integrity check (no fabricated final content; illustrative Scale
    figures not shown as fact).
  - Confirm the approved section order (blueprint §6) is intact and only
    OD-approved conditional sections are present. Document pass/fail per check.
  - _Verify:_ documented results; all gates pass; no frozen/Foundation file
    modified beyond the homepage composition this milestone owns.
  - _Requirements: all; cross-cutting 1–5_
  - _Depends on: all prior applicable tasks_

## Task dependency order (summary)

```
1 ─┐
2 ─┼─> 3 ─> 4 ─> 5 ─> 15 [OD-1]
   │           ├─> 6
   │           ├─> 7
   │           ├─> 9 [OD-4] ─> 16 [OD-2]
   │           ├─> 10
   │           └─> 17 [OD-3]
   └ (1 feeds 3/6; 2 feeds 6/7/9/10)
5,6,7,9,10 ─> 11 ─> 13
5,6,7,9,10 ─> 12
all applicable ─> 18
```

- **Spine (no OD blockers, buildable with provisional content):** 1 → 2 → 3 →
  4 → 5 → {6, 7, 10} → 11 → {12, 13} → 18.
- **OD-4** blocks Task 9 (Scale). **OD-1** blocks Task 15. **OD-2 + CR-8** block
  Task 16. **OD-3** blocks Task 17.
- Tasks 8 and 14 are intentional reserved no-ops kept only for numbering
  alignment with the design/review discussion — skip them.

## Explicitly not tasked (out of scope, do not implement)

- Full case studies / real case-study content (DigiLocker, UX4G, Entity Locker,
  Accessibility); the frozen `/work/[slug]` pipeline and `_example` entry are
  not modified.
- New routes (`/playground`, `/uses`, `/now`); `/work`, `/think`, `/build`,
  `/about` placeholder bodies.
- Any new design token, colour, type step, spacing value, breakpoint, easing,
  or dependency (GSAP, Three.js/R3F/WebGL, Lenis, Lottie, `framer-motion`
  separate package, UI libraries, state libraries, `clsx`/`tailwind-merge`).
- The Foundation's deferred WCAG 2.2 items (SC 2.4.11
  `scroll-padding-top`/`--header-height`, SC 2.5.8 24×24, `inert`).
- Deployment/Vercel config, analytics, Lighthouse/cross-browser passes.
- Modifying any frozen Foundation file, the Foundation spec, steering,
  blueprint, `CLAUDE.md`, or `REVIEW_FINDINGS.md`.

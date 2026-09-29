# CLAUDE.md — Claude Code operating instructions

This file defines **how Claude Code works** in this repository. It is not a
source of truth for product, design or content decisions. Where this file and
an authoritative source disagree, the authoritative source wins — stop and
flag the conflict.

---

## 1. Project overview

*Digest only — the referenced source governs; if they differ, the source wins
and the digest is stale.*

A modern, highly performant personal portfolio for **Aman Mittal, Product
Designer**. Creative direction, positioning, tone and the core principle are
defined in `.kiro/steering/product.md` — read it before any work touching
tone, positioning or creative direction.

The site is part of the pitch — it must itself demonstrate strong UX,
accessibility and performance, not merely describe them.

Stack: Next.js (App Router) · React · TypeScript · Tailwind CSS · Motion for
React · MDX · Lucide · Vercel. Server Components by default.
See `.kiro/steering/tech.md` for the authoritative stack and dependency policy.

---

## 2. Source-of-truth hierarchy

The approved direction is defined by this **set** of documents
(`.kiro/steering/review-process.md`):

1. `IMPLEMENTATION_BLUEPRINT.md`
2. `.kiro/steering/product.md`
3. `.kiro/steering/design-system.md`
4. `.kiro/steering/content.md`
5. `.kiro/steering/structure.md`
6. `.kiro/steering/tech.md`

…together with `.kiro/steering/review-process.md`, which defines that set and
the review/escalation rules, and the **currently approved Kiro Spec** for the
active feature (`.kiro/specs/<feature>/{requirements,design,tasks}.md`).

### The one established precedence rule

From `product.md`:

> If this steering file and the blueprint ever disagree, the blueprint wins —
> flag the conflict and ask before proceeding.

**That is the only precedence rule any source establishes.**

**Ordering among the steering files is undefined.** A conflict between two
steering files is **reported, never resolved.** Do not infer a ranking from
the order of the list above — it is the order `review-process.md` prints, not
an authority ladder.

### Standing of the active Spec

The Spec is **authoritative for its milestone where it is specific.** Per
`requirements.md`: *"Where this document is silent or ambiguous, those files
govern."* Steering governs the silences; the Spec governs its own explicit
decisions.

**A general steering statement does not override a specific, approved Spec
decision.** If a steering file appears to contradict a deliberate Spec choice,
**raise it as a finding** — do not implement the steering reading over the
Spec. In particular, a component, route or directory appearing in the
blueprint's or `structure.md`'s **target** tree is not authority to build it
now; `review-process.md` says the opposite.

### Where this file sits

**This file ranks below every document above.** It tells Claude how to operate
inside those constraints; it does not restate, rank or override their content.

Do not copy tokens, copy, metrics or structure into this file. Reference the
source instead — e.g. "Follow `.kiro/steering/design-system.md` for visual
tokens." Where a short digest is genuinely useful, mark it with the digest
notice used in §1.

### If instructions conflict

**Stop and report the conflict. Do not resolve it silently.** Name both
sources, quote the conflicting lines, state whether the one established
precedence rule applies, and ask. This applies even when one reading is
obviously more sensible — a silent resolution becomes an undocumented decision
that nobody approved.

---

## 3. Development principles

- Build incrementally, in reviewable vertical slices. Never implement the
  whole portfolio, or a whole phase, in one pass.
- Follow the implementation phase order in `.kiro/steering/structure.md`.
  Do not jump ahead.
- Implement only what the current task requires. Do not create routes,
  components or directories because they appear in the blueprint's or
  `structure.md`'s **target** tree — those describe the finished site, not
  the current milestone.
- Prefer the simplest maintainable solution when a detail is ambiguous but
  does not affect product direction. When it does affect product direction,
  ask (see **§16**).
- Do not modify files unrelated to the current task.

---

## 4. Architecture principles

- Next.js App Router. **Per `design.md` §8, route `page.tsx` and `layout.tsx`
  stay Server Components.** If one appears to need client behaviour, that is
  the signal to extract an island (§5), not to convert the file.
- Composition over configuration. Prefer `children`/slots to wide prop
  surfaces.
- Prefer an existing component over a new one. Prefer CSS over a new
  dependency. Prefer a browser-native API over a library.
- No premature abstraction. Do not build a generic solution for one caller.
  **Primitives mandated by an approved Spec are justified on creation
  regardless of caller count** — e.g. `Container`, `Grid`, `Header`, `Footer`
  under `requirements.md` 10.1. The rule targets speculative abstraction, not
  specified structure.
- Avoid giant components, deep conditional nesting, and unnecessary client
  state.
- Magic numbers are a bug. Every colour, size, space, radius and duration
  comes from a token.

---

## 5. Server vs Client Components

**Prefer Server Components. This is a performance requirement, not a style
preference.**

- A Client Component is justified only by interactivity that genuinely
  requires the browser: event listeners, browser APIs, React state driven by
  user input.
- **Keep Client Components narrowly scoped.** Push `"use client"` to the
  smallest possible leaf. Never mark a layout, a page, or a composing parent
  as a client component to give a descendant a hook.
- When a wrapper needs client behaviour but its contents do not, make the
  wrapper a thin `"use client"` component that accepts `children`, and pass
  server-rendered markup into it. Children created in a Server Component and
  passed as a slot do not enter the client bundle.
- Before adding `"use client"`, state in your response why the behaviour
  cannot be achieved with CSS, a server-rendered pattern, or a smaller
  island.
- Report bundle impact per §10 when a change could affect it.

---

## 6. TypeScript conventions

- `strict` mode. `tsc --noEmit` must be clean.
- **No `any`.** Use a real type, `unknown`, or a narrow generic. If `any` is
  genuinely unavoidable, justify it in a comment at the site of use.
- No unnecessary generics. Prefer a literal union of allowed values to a
  type parameter. Polymorphic-component generics need explicit approval.
- Content models are typed at the boundary where TypeScript can actually
  check them — **see §7 for MDX, which has real constraints here.**
- Use the `@/*` path alias; avoid deep relative imports.

---

## 7. MDX conventions

Respect the existing MDX architecture. Do not redesign it.

- Case-study metadata is a **typed `meta` module export** from each `.mdx`
  file. **Not YAML frontmatter.**
- **MDX files compile their ESM block as JavaScript, not TypeScript.**
  TypeScript-only syntax — `satisfies`, type annotations, `as const` with type
  arguments — **will not parse** inside an `.mdx` file. Write `meta` as plain
  JavaScript.
- **`@types/mdx` types only the default export.** Named exports from `.mdx`
  modules are not typed by it, so importing `meta` does not automatically give
  you `CaseStudyMeta`. Type it at the **consumption boundary** in
  `lib/content/`, or via module augmentation. Follow the active spec's
  `design.md` §11; if it leaves this unresolved, **raise it** rather than
  reaching for `any`.
- Per `requirements.md` 15.2, **no frontmatter-parsing dependency (e.g.
  `gray-matter`) may be added unless a concrete requirement emerges that MDX
  module exports cannot satisfy** — and then only with approval under §12.
  `@next/mdx` does not parse frontmatter; the module-export approach is the
  deliberate answer to that, not an oversight.
- The `meta` export shape is fixed. **The MDX body's structure is not.**
  Different case studies intentionally have different narrative structures
  (see `.kiro/steering/content.md`). Never force case studies into one
  template, and never add a `structure` enum or layout discriminator to the
  metadata type.
- Root `mdx-components.tsx` maps MDX elements to the project's typography
  primitives. Keep the mapping minimal and add to it only when real content
  needs it. Mapped headings must preserve their semantic level, not only
  their visual size.
- Case studies are content-driven. Never hardcode case-study markup inside
  page components.

---

## 8. Design-system usage

Follow `.kiro/steering/design-system.md` for all visual tokens — typography,
colour, grid, spacing, radius and motion. **Its own stated source of truth is
`IMPLEMENTATION_BLUEPRINT.md` §18-26.**

- Implemented token values must match that source exactly. **If the
  implementation and the source diverge, that is a conflict to report — do
  not treat the implemented value as authoritative.** No file in the
  application is a source of truth for tokens.
- **Never introduce an arbitrary value.** No `text-[120px]`,
  `bg-[#3155FF]`, `p-[18px]`, `duration-[350ms]`. If a needed value has no
  token, that is a design-system gap: **stop and raise it** (§16), do not
  paper over it.
- Adding or changing a token requires Aman's approval — see **§16**. Once
  approved, record it where the active Spec directs; if the Spec has no such
  section, **raise that gap** rather than choosing a location.
- The grid is a guide, not a constraint — but breaking it is an explicit,
  named opt-out, not an ad-hoc override.
- **Open decision affecting this area:** see §19.1 (line-height / letter-
  spacing tokens).

---

## 9. Accessibility requirements

**Target: WCAG 2.2 AA.** Treat accessibility defects with the same severity
as visual or functional ones. Accessibility is part of building a feature,
never a QA phase at the end.

Follow `.kiro/steering/design-system.md`'s accessibility section, and the
active Spec's acceptance criteria. Non-negotiable in every change:

- Semantic HTML and landmarks first; ARIA only where semantics cannot do it.
- Correct heading hierarchy — one `h1` per page, no skipped levels. Visual
  size and semantic level are separate decisions.
- Full keyboard operability and a visible, non-colour-only focus indicator.
- Logical tab order.
- Accessible names on every control. Meaningful `alt` text on every image.
- Touch targets meeting the criterion in the active Spec
  (`requirements.md` 12.5: 44×44 on mobile viewports).
- No information conveyed by colour alone. No hover-only information.
- Overlays: focus trap, `Escape` to close, focus returned to the trigger, per
  the active Spec's `design.md` §7/§12.
- Respect `prefers-reduced-motion`.

### Open WCAG 2.2 findings — raised, not yet approved

These came out of engineering review. They are **recommendations awaiting
Aman's decision, not acceptance criteria.** Do not fail a review, or block
Kiro's work, for non-compliance with them; cite them as findings instead.

- **SC 2.4.11 Focus Not Obscured (AA, new in 2.2)** — the sticky header can
  obscure a keyboard-focused element. Mitigation would be `scroll-padding-top`.
- **SC 2.5.8 Target Size Minimum (AA, new in 2.2)** — applies at all
  viewports at 24×24 CSS px, whereas `requirements.md` 12.5 scopes 44×44 to
  mobile.
- **`inert` on background content** while the mobile overlay is open,
  alongside the specified `aria-modal` and focus trap.

Never claim WCAG conformance. Automated checks and code review are not
sufficient — manual assistive-technology testing is required and is Aman's
call, not Claude's.

---

## 10. Performance requirements

Performance is a first-class requirement, not a late phase. Follow
`.kiro/steering/design-system.md`'s performance section.

- Server Components by default; minimal client JavaScript; minimal hydration.
- Fonts: `next/font` (self-hosted and optimised by Next), subset, minimal
  axes. Never a render-blocking `<link>` to an external font CDN.
- Images: `next/image` with explicit dimensions (or `fill` with a sized
  parent). AVIF/WebP for raster, SVG for diagrams and icons. Lazy-load
  below-the-fold media.
- Scroll and resize listeners are `passive` and throttled (rAF or a
  threshold). No layout reads or layout math in a scroll handler.
- **Animate GPU-friendly properties — transform and opacity. Do not animate
  layout properties** (width, height, top, left, margin). `backdrop-filter`
  is approved for the header per `requirements.md` 11.2 — implement it as
  specified and measure it on iOS rather than avoiding it.
- No unnecessary third-party scripts. No analytics without approval.
- Report First Load JS from `next build` when a change could affect it.

Target excellent LCP, CLS and INP. When a change plausibly regresses one,
say so rather than waiting to be asked.

---

## 11. Animation rules

Follow the motion principles in `.kiro/steering/design-system.md`. They are
binding, not advisory.

- **Static first.** Content must be complete and understandable without
  animation. Then add interaction. Then optimise.
- Animation never delays or gates content rendering.
- Animations must be interruptible. No scroll hijacking. No perpetual motion
  without purpose. Never animate everything at once.
- **Respect `prefers-reduced-motion`** — and note that a global CSS
  reduced-motion block cannot stop JavaScript-driven animation. Motion for
  React work must additionally branch on `useReducedMotion()`.
- **Cinematic timing** (the longest duration token) is reserved for major
  storytelling moments, per `design-system.md`. That is a constraint on the
  timing token, not on the library.
- **Motion for React is not restricted to the hero.** `structure.md` plans
  `components/motion/` (`Reveal`, `ImageReveal`, `TextTransform`,
  `ScrollProgress`). In the **foundation milestone specifically**, `design.md`
  §7 uses plain CSS transitions for nav and overlay — honour that scope
  without generalising it into a standing rule.
- Prefer plain CSS transitions for ordinary UI where they are sufficient —
  they are cheaper.
- **Never add a new animation to an approved design without asking** (§16).
  See `.kiro/steering/product.md` for the tone the site must not have.
- **Do not introduce Three.js, React Three Fiber, WebGL, Lenis, Lottie, or
  any additional animation library.** GSAP only with a demonstrated
  technical requirement that Motion for React cannot meet cleanly, agreed in
  advance.

---

## 12. Dependency rules

Follow `.kiro/steering/tech.md`'s dependency policy.

- **Do not add a major dependency without justification and approval.**
  State: why it is needed, why existing capabilities are insufficient, its
  performance and bundle implications, and whether a browser-native or CSS
  solution exists.
- This applies to small utility packages too. A three-line local helper beats
  a dependency.
- Never add a dependency solely for visual polish.
- Disallowed without a documented, agreed reason: Three.js / R3F / WebGL,
  Lenis, Lottie, `framer-motion` as a separate package, large UI component
  libraries (MUI, Chakra, Ant, a full shadcn install), state-management
  libraries, and analytics. For frontmatter parsers specifically, **§7
  governs** — that rule is narrower and comes from the Spec.
- Do not add a test framework unless asked.
- Pin exact or narrowly-ranged versions. Flag anything that looks
  typosquatted or unusual.
- Do not upgrade pinned major versions opportunistically. Version pins in the
  active spec encode compatibility reasoning (notably the TypeScript and
  ESLint caps) — read it before proposing a bump.

---

## 13. Testing and verification

*Digest only — the referenced source governs; if they differ, the source wins
and the digest is stale.* Authoritative list: `.kiro/steering/tech.md`
("Testing & verification"), plus the active Spec's verification plan.

Before presenting any change as done:

- `npx tsc --noEmit` — clean
- `npm run lint` — clean (**ESLint CLI via flat `eslint.config.mjs`; never
  `next lint`, never a legacy `.eslintrc.*`**)
- `next build` — succeeds
- Responsive check at mobile / tablet / desktop
- Keyboard-navigation check
- Reduced-motion check
- Accessibility spot-check (landmarks, heading order, focus, contrast)
- Image optimisation and link validation where relevant

`tech.md` additionally defines a heavier pre-deployment tier (Lighthouse,
cross-browser, device testing). Do not substitute one tier for the other.

**Report results honestly.** If a check fails, say so and show the output. If
a check was skipped or could not be run, say which and why. Never describe
work as verified when it was only written.

"It renders" is not done. See the definition of done in
`.kiro/steering/product.md`.

---

## 14. Git and change discipline

- **Commit only when explicitly asked.**
- Stage specific files. Never blanket `git add -A` or `git add .`.
- Small, logical commits. Never one commit for a whole phase.
- Conventional-style messages following `tech.md`'s examples: `feat:`,
  `fix:`, `perf:`, `a11y:`.
- Never commit build output, `node_modules`, or environment files.
- **Branching:** this file does not override the repository or host workflow.
  If the environment's workflow requires a branch before committing (e.g.
  when on `main`), follow it — that is not "creating a branch unasked."
  Absent such a requirement, do not create branches on your own initiative.
- Do not push, open PRs, or deploy unless asked.

---

## 15. AI-agent behaviour

1. Read the relevant steering files and the active spec **before**
   implementing. Not after.
2. Implement only the current task. Do not opportunistically "finish"
   adjacent work.
3. Explain significant architectural decisions in your response.
4. Prefer an existing component; prefer CSS; prefer a native API.
5. Keep Server Components server-side.
6. Validate responsive behaviour, accessibility and performance for every
   feature — not at the end of the milestone.
7. When you notice a problem outside the current task, **report it; do not
   fix it** unless asked.
8. State your uncertainty plainly. Do not present a guess as a verified fact,
   and do not claim a check you did not run.
9. **Do not convert your own review recommendations into requirements.** A
   finding stays a finding until Aman approves it. Record it in §19 or report
   it — do not enforce it against Kiro's work.

---

## 16. When to ask for approval

**Stop and ask** before anything affecting:

- Visual identity or the approved creative direction
- Information architecture, routes, or homepage section order
- Navigation or interaction model
- Animation concept, or any new animation
- Content or copy
- Technology stack
- Any major dependency
- **Any change to a token's value, or the addition of a new token — Aman is
  the approving authority** (§8 defers here)
- Scope beyond the current task or milestone

Also stop and ask when instruction files conflict (§2), when a required token
does not exist (§8), or when a task cannot be completed as specified.

Asking costs a message. A silent unilateral decision costs a direction.

---

## 17. What Claude must never invent

- **Portfolio content**: project details, case-study narrative, copy, or
  section text beyond what is approved in `.kiro/steering/content.md`.
- **Metrics and evidence**: statistics, research findings, user interviews,
  usability results, adoption numbers, business impact, or outcomes — for any
  project, in any context, including placeholders that read as real.
  Figures the blueprint or steering files describe as illustrative are
  **unverified**; per `content.md`, confirm real numbers with Aman before
  publishing. Do not validate, alter or substitute them yourself (§19.2).
- **Credentials and identity**: employers, clients, dates, titles, awards,
  contact details, social links, or a production domain.
- **Design decisions**: token values, type scale steps, breakpoints, easing
  curves, line-height or letter-spacing values, or layout rules that no
  authoritative source defines. A missing value is a gap to raise, not a
  blank to fill.

Placeholder content must be obviously provisional and must never resemble
final approved copy.

---

## 18. Working alongside Kiro

Kiro is the primary implementation agent. Claude Code is the independent
engineering reviewer, debugger and specialist implementer
(`.kiro/steering/review-process.md`).

- **Do not modify `.kiro/steering/*` unless explicitly asked.** Propose
  changes; let Aman decide.
- **Do not modify `IMPLEMENTATION_BLUEPRINT.md` unless explicitly asked.**
- **Do not modify `.kiro/specs/*` unless explicitly asked.** Reviewing a spec
  means reporting findings, not editing it.
- **Do not execute Kiro spec tasks unless explicitly asked.** A task list in
  `tasks.md` is Kiro's queue, not an instruction to Claude.
- When reviewing Kiro's work, be specific and evidence-based: cite the file
  and line, state the concrete failure, and recommend a change. Do not
  rewrite Kiro's approach because a different one is equally valid.
- **Review against the approved Spec, not against your own preferences.** If
  Kiro's output matches the Spec and you disagree with the Spec, the finding
  is against the Spec — say so, and raise it with Aman.
- When Kiro's plan is sound, say so. An independent review that only lists
  problems is not independent.
- Keep the repository in a state Kiro can resume from: no half-applied
  refactors, no uncommitted structural changes left unexplained.

---

## 19. Open decisions — awaiting Aman

Unresolved items raised by engineering review. **These are not rules and not
acceptance criteria.** Do not resolve them by choosing a value, and do not
enforce them against Kiro's work. Raise them at the point they block progress.

1. **Line-height and letter-spacing tokens are undefined.** Neither
   `design-system.md`, the blueprint's typography section, nor the active
   Spec's type scale defines leading or tracking. This is an **open
   design-system decision that must be resolved before implementation reaches
   typography-dependent work.** When a task requires a leading or tracking
   value and no token exists, **stop and ask** (§8, §16). Do not invent
   values, and do not record proposed values in this file.

2. **The Scale-section figures in `content.md` are unvalidated.** `content.md`
   marks them illustrative and requires confirmation before publishing. This
   is an **open content-validation item for Aman.** Do not validate, alter,
   substitute or publish them, and do not treat their presence in an
   always-loaded steering file as approval (§17).

3. Further engineering-review findings are recorded in the review output, not
   here. This section holds only decisions that must reach Aman before
   dependent implementation proceeds.

# Requirements — Portfolio Experience

## Source of truth

This milestone is governed, in order, by the authority model that already
governs the project (`.kiro/steering/review-process.md`, `CLAUDE.md` §2):

1. `IMPLEMENTATION_BLUEPRINT.md`
2. The approved Kiro Spec for the active milestone (this document and its
   sibling `design.md` / `tasks.md`)
3. The existing steering files (`product.md`, `design-system.md`,
   `content.md`, `structure.md`, `tech.md`, `review-process.md`)
4. `CLAUDE.md` as agent operating guidance

The **Portfolio Foundation** milestone is complete, verified, and FROZEN. Its
spec (`.kiro/specs/portfolio-foundation/*`), its implemented components,
tokens, architecture, accessibility decisions, and technical constraints are
treated as **established infrastructure**, not as decisions to reopen. Where
this document is silent or ambiguous, the sources above govern. Any conflict
is flagged as an OPEN DECISION (§ "Open decisions"), never resolved silently.

This milestone does **not** create a competing source of truth. It consumes
the Foundation's tokens, primitives, and architecture as-is.

## Milestone intent

Transform the completed technical/design foundation into the actual
**homepage / primary portfolio experience** — a distinctive, editorial,
product-design-led composition that makes the *work* the primary focus.

This corresponds to **Phases 5–12** of the blueprint's implementation order
(§34): Hero, Signature transition, Selected Work, Philosophy, Principles +
Scale, Design System section, Playground section, About + Contact — assembled
into the single approved homepage section stack (blueprint §6), plus the
supporting content model, motion, responsive, accessibility, and metadata work
the homepage needs.

The experience must satisfy the blueprint's tone (§1): editorial, precise,
systematic, modern, calm, fast, accessible — and must NOT feel like a generic
template, a developer portfolio, a Dribbble clone, an Awwwards animation
showcase, a government site, or an over-animated landing page. The core
principle (`product.md`) is binding: **structured underneath, expressive on
top** — never flashy surface effects over weak structure.

## Relationship to the approved homepage hierarchy

The blueprint (§6) defines an **approved homepage section order** that
`structure.md` says must not be reordered without asking:

1. Navigation → 2. Hero → 3. Signature transition → 4. Selected Work →
5. Philosophy → 6. Principles → 7. Scale → 8. Design System →
9. Playground → 10. About → 11. Contact → 12. Footer

Navigation (1) and Footer (12) already exist and are frozen Foundation work;
this milestone does not rebuild them. The remaining sections (2–11) are the
subject of this milestone. The prompt's scope areas map onto this approved
order as follows, and this mapping does **not** reorder or merge the approved
sections — it groups them for description only:

| Prompt scope area | Approved blueprint section(s) |
|---|---|
| Hero | 2. Hero (+ 3. Signature transition — see OD-1) |
| Selected Work | 4. Selected Work |
| Design Philosophy | 5. Philosophy, 6. Principles |
| Experience / Impact | 7. Scale |
| (not named in prompt scope) | 8. Design System section — see OD-2 |
| (not named in prompt scope) | 9. Playground section — see OD-3 |
| About / Personal introduction | 10. About |
| Contact / CTA | 11. Contact |

Three approved sections (Signature transition, Design System, Playground) are
either not named in the prompt's scope list or named as "where appropriate."
Because their inclusion/exclusion changes the approved information
architecture, they are raised as **Open Decisions OD-1/OD-2/OD-3** rather than
silently dropped or silently built. The requirements below are written so each
can be included or deferred without reworking the others.

## Out of scope (explicit)

The following are **not** part of this milestone and must not be built,
scaffolded, or partially implemented:

- **Full case studies.** Case-study *pages* (`/work/[slug]` bodies beyond the
  frozen `_example` proof-of-pipeline) are separate future work. Case studies
  remain individually structured; this milestone does not create a common
  case-study template (blueprint §30, `content.md`).
- **Real case-study content** for DigiLocker, UX4G, Entity Locker, or
  Accessibility (writing it requires verified project content not yet
  provided).
- `/think`, `/build`, `/work` index page redesigns — their placeholder bodies
  stay as the Foundation left them unless a homepage link target requires a
  minimal adjustment (none is anticipated).
- `/playground`, `/uses`, `/now` routes (`structure.md` — future routes).
- Deployment / Vercel configuration, analytics, Lighthouse/cross-browser
  passes (later blueprint phases §34, 15–19).
- Any new design token, colour, type-scale step, spacing value, breakpoint,
  easing curve, or dependency — see Requirement 11 and the dependency
  constraint below.
- Re-opening any frozen Foundation decision. If a genuine dependency makes the
  milestone impossible without a Foundation change, that is reported as an
  OPEN DECISION, not changed silently (per the prompt's authority model).
- The Foundation's **deferred** WCAG 2.2 items (SC 2.4.11
  `scroll-padding-top`/`--header-height`, SC 2.5.8 24×24 reinterpretation,
  `inert` on overlay background). These remain deferred (`CLAUDE.md` §9,
  foundation `design.md` §12(B)/§14) and must NOT be silently implemented as
  part of this milestone. See Requirement 9.9.

## Content integrity (non-negotiable)

Per `product.md`, `content.md`, `CLAUDE.md` §17, and blueprint §30/§35:

- **Only approved copy may be used as final copy.** The blueprint and
  `content.md` contain approved copy for the Hero, Philosophy, Principles,
  About positioning, and Contact. That approved copy — and only that — may be
  rendered as final. See each section's requirement for the exact approved
  strings.
- **Never fabricate** project details, roles, disciplines, value propositions,
  metrics, research, user interviews, outcomes, adoption, or business impact.
- The blueprint §13 **Scale figures are explicitly illustrative/unverified**
  (`content.md`, `CLAUDE.md` §19.2). They must NOT be published as final
  without Aman's confirmation. See Requirement 5 and CR-3.
- Where content needed to build a section does not exist, the section is built
  against a **typed content model with clearly-provisional placeholder values**
  and the gap is listed under "Content required from Aman" (CR-#). Placeholder
  values must be obviously provisional and must never resemble final approved
  copy (`CLAUDE.md` §17).

## Dependency & token constraint (binding)

Per `tech.md`, `design-system.md`, `CLAUDE.md` §8/§12, and the prompt:

- No new design system, component library, spacing system, typography scale,
  or colour system.
- No new dependency without Aman's prior approval. In particular: no GSAP,
  Three.js, R3F, WebGL, Lenis, Lottie, `framer-motion` (separate from
  `motion`), no large UI library, no state-management library.
- `motion` (Motion for React) is already an approved, installed dependency
  (foundation `design.md` §2) and MAY be used in this milestone where it
  materially improves the experience (Requirement 8). This is the first
  milestone that uses it; the Foundation reserved it deliberately.
- All colour, type, spacing, radius, and motion values come from the
  **existing Foundation tokens** (`globals.css` `@theme` + `:root`, and
  `components/typography/scale.ts`). Introducing a new value is a token change
  requiring Aman's approval (`CLAUDE.md` §16) and is raised as an OPEN
  DECISION, not added inline.

---

## Requirement 1 — Hero

**User story:** As a visitor landing on the homepage, I want an immediate,
confident statement of who Aman is and what he does, so that within one
viewport I understand the positioning before I scroll.

### Acceptance criteria

1. WHEN the homepage renders THEN the Hero SHALL display the **approved**
   headline exactly (blueprint §8), across its five lines:
   `DESIGNING` / `PRODUCTS,` / `SYSTEMS &` / `EXPERIENCES` / `AT SCALE.`
2. WHEN the Hero renders THEN it SHALL display the **approved** supporting
   statement exactly (blueprint §8): "Product designer working across digital
   products, design systems and accessible experiences used at scale."
3. WHEN the headline renders THEN it SHALL use the `Display` typography
   primitive at the `xl` size token (Display XL: 120px desktop reference,
   ~56px mobile, per the frozen `typeScale`), as a single `h1` landmark for
   the page (exactly one `h1`).
4. WHEN the Hero renders THEN it SHALL NOT contain résumé-style statistics or
   metrics (blueprint §8 — explicitly prohibited in the hero).
5. WHEN the Hero renders at desktop (`lg:` ≥1024px) THEN it SHALL occupy
   approximately one viewport height, with the headline as the dominant
   element and clear visual hierarchy over the supporting statement and any
   CTA (blueprint §8).
6. WHEN the Hero renders on mobile (base, <768px) THEN the headline SHALL
   remain legible and dominant without horizontal overflow, the five-line
   structure SHALL be preserved or reflow gracefully, and the section SHALL
   NOT require the entrance animation to be understood (static-first; blueprint
   §24.1).
7. IF a primary call-to-action is present in the Hero THEN it SHALL point to an
   existing in-milestone target (e.g. the Selected Work section anchor or the
   Contact section anchor) and SHALL NOT be a dead link or point to an
   out-of-scope route. (Whether the Hero carries an explicit CTA, versus
   relying on the scroll relationship to Selected Work, is OD-1-adjacent — see
   `design.md`.)
8. WHEN `prefers-reduced-motion: reduce` is set THEN the Hero SHALL present its
   final composition with no entrance motion (or motion reduced to the
   near-zero global override), and all content SHALL be fully readable.
9. WHEN the Hero entrance animation runs (reduced motion not set) THEN it SHALL
   NOT delay or block content rendering, SHALL be interruptible, and SHALL
   animate only GPU-friendly properties (transform/opacity) using existing
   motion duration/easing tokens (Requirement 8).

## Requirement 2 — Signature transition (CONDITIONAL — see OD-1)

**User story:** As a visitor scrolling from the Hero, I want the headline to
resolve into the structure that introduces the work, so that the site itself
demonstrates the "systems and structure" positioning.

> **Status:** This section is an approved blueprint item (§3/§9) but its
> inclusion in *this* milestone is OPEN DECISION **OD-1**. The acceptance
> criteria below apply **only if OD-1 resolves to "include in this
> milestone."** If OD-1 resolves to "defer," this requirement is dropped from
> this milestone with no effect on Requirements 1 or 3, and the Hero →
> Selected Work relationship is handled by an ordinary section boundary.

### Acceptance criteria (conditional on OD-1 = include)

1. WHEN the user scrolls past the Hero THEN the signature transition SHALL
   progress the typographic sequence `DESIGNING → PRODUCTS → SYSTEMS →
   EXPERIENCES → AT SCALE` and resolve into a structured grid that becomes the
   visual entry into Selected Work (blueprint §9).
2. WHEN the transition runs THEN it SHALL be smooth, performant, interruptible,
   and SHALL NOT hijack scrolling (blueprint §9, §24.8).
3. WHEN the transition runs THEN it SHALL work on mobile and SHALL NOT be
   required to understand the content (static-first; blueprint §9, §24.1).
4. WHEN `prefers-reduced-motion: reduce` is set THEN a reduced-motion fallback
   SHALL present the end state (or a static equivalent) without the scroll-
   driven animation, and content SHALL remain fully understandable.
5. WHEN the transition is implemented THEN it SHALL use `motion` (Motion for
   React) with `useReducedMotion()` branching (a CSS media query alone cannot
   stop JS-driven motion — foundation `design.md` §12(A) note), and SHALL NOT
   introduce GSAP or any other animation dependency.
6. WHEN the transition renders THEN it SHALL NOT delay first paint of the Hero
   content (blueprint §9, §24.3).

## Requirement 3 — Selected Work

**User story:** As a visitor evaluating Aman's work, I want to see the flagship
projects presented editorially with clear role/discipline framing, so that the
work is the primary focus and I can move into a case study when one exists.

### Acceptance criteria

1. WHEN the Selected Work section renders THEN it SHALL present the flagship
   projects as editorial entries (not SaaS-style cards; blueprint §10).
2. WHEN a project entry renders THEN it SHALL communicate, from a typed content
   model: project name, role, discipline, a short value proposition, a visual
   preview slot, and a case-study link slot (blueprint §10).
3. WHEN project content is not yet available THEN the entry SHALL render
   clearly-provisional placeholder values from the content model and the
   missing content SHALL be listed under "Content required from Aman" — the
   system SHALL NOT fabricate roles, disciplines, value propositions, or
   metrics (blueprint §10/§30, `content.md`).
4. WHEN a project entry's case-study link target does not yet exist as a real
   `/work/[slug]` page THEN the link SHALL either be omitted or rendered in a
   non-interactive/clearly-unavailable state — it SHALL NOT be a dead link to a
   non-existent route. (The frozen `/work/[slug]` route 404s for unknown slugs;
   entries must not point at slugs that 404.)
5. WHEN the visual preview is not yet available THEN the preview slot SHALL use
   `next/image` with an explicit sized placeholder (or a tokenized empty-state
   treatment) that reserves layout space and causes no CLS — no fabricated
   product screenshots (blueprint §29, `CLAUDE.md` §17).
6. WHEN a project entry is interactive on a pointer device THEN any hover
   affordance SHALL also be available without hover (keyboard focus / touch),
   conveying no information by hover or colour alone (blueprint §25,
   `design-system.md`).
7. WHEN the section renders on desktop (`lg:`) THEN entries SHALL use the
   Foundation `Grid`/`Container` with an editorial multi-column or offset
   layout; on tablet (`md:`) and mobile (base) they SHALL reflow to the
   8-/4-column structure respectively without simply shrinking the desktop
   layout (Requirement 7).
8. WHEN the content model is defined THEN it SHALL be data/content-driven and
   reusable so real projects can be added later without a structural rewrite
   (blueprint §28, Requirement 10), and SHALL NOT force every project into one
   case-study structure (blueprint §30).
9. WHEN project entries carry an ordering/priority THEN the model SHALL support
   expressing project hierarchy (e.g. a flagship ordering) so the most
   important work can lead.

## Requirement 4 — Design Philosophy (Philosophy + Principles)

**User story:** As a visitor, I want a concise, editorial statement of how Aman
thinks about product design, so that I understand his approach without reading
a résumé.

### Acceptance criteria

1. WHEN the Philosophy section renders THEN it SHALL display the **approved**
   primary statement exactly (blueprint §11): "I DON'T DESIGN SCREENS."
2. WHEN the Philosophy section renders THEN it SHALL display the **approved**
   progressive statements exactly and in order (blueprint §11): "I design how
   people understand systems." / "How they navigate complexity." / "How they
   recover from mistakes." / "How experiences remain consistent across
   products." / "How interfaces work for people with different abilities." /
   "And how all of it works at scale."
3. WHEN the Philosophy section renders THEN it SHALL display the **approved**
   closing statement exactly (blueprint §11): "That's what I design."
4. WHEN the Philosophy section renders THEN it SHALL be predominantly
   typographic with minimal imagery/UI chrome (blueprint §11, `content.md`).
5. WHEN the Principles section renders THEN it SHALL display the four
   **approved** principles exactly, each with its approved one-line definition
   (blueprint §12, `content.md`): **Clarity** — "Reduce complexity without
   hiding it."; **Systems** — "Solve recurring problems systematically.";
   **Accessibility** — "Inclusion is part of the product, not an add-on.";
   **Scale** — "Design decisions should survive beyond a single screen."
6. WHEN headings are rendered in Philosophy and Principles THEN they SHALL
   maintain a correct heading hierarchy beneath the page `h1` (no skipped
   levels; Requirement 9).
7. WHEN these sections animate (reduced motion not set) THEN any reveal of the
   progressive statements SHALL be a restrained entrance that does not animate
   everything simultaneously (blueprint §24.2) and SHALL respect
   `prefers-reduced-motion` (Requirement 8). The approved copy SHALL be fully
   present and readable without animation (static-first).

## Requirement 5 — Experience / Impact (Scale)

**User story:** As a visitor, I want a sense of the scale at which Aman has
worked, so that the breadth of impact is communicated — using only verified
figures.

### Acceptance criteria

1. WHEN the Scale section renders THEN it SHALL be presented as a **dark visual
   section** (blueprint §13) using existing tokens (e.g. Ink surface with
   Canvas/Surface text), with no new colour token introduced (Requirement 11).
2. WHEN the Scale section renders THEN the figures it displays SHALL come from
   a content model, and the section SHALL be built so figures can be populated
   from verified values at content time.
3. WHEN the final content is published THEN the system SHALL use **only
   verified figures** confirmed by Aman — the blueprint §13 figures (600M+
   digital users, 30+ ministries, 20+ products/websites audited, 50+
   design-system pages) are **illustrative and unverified** (`content.md`,
   `CLAUDE.md` §19.2) and SHALL NOT be shipped as final without confirmation.
   See CR-3 and OD-4.
4. WHEN verified figures are not yet confirmed THEN the section SHALL render
   clearly-provisional placeholders (visibly non-final) rather than presenting
   the illustrative figures as fact, OR the section SHALL remain gated until
   figures are confirmed — the chosen behaviour is specified in `design.md` and
   depends on OD-4.
5. WHEN a figure is displayed THEN its value and its label SHALL be
   programmatically associated (not conveyed by visual grouping alone) so the
   pairing is available to assistive technology.
6. WHEN the section renders responsively THEN the figures SHALL reflow across
   desktop/tablet/mobile per Requirement 7 and SHALL meet colour-contrast AA on
   the dark surface (Requirement 9).

## Requirement 6 — Design System section (CONDITIONAL — see OD-2)

**User story:** As a visitor who cares about design-systems expertise, I want
the homepage to demonstrate systems thinking, so that the claim is shown rather
than stated.

> **Status:** Approved blueprint item (§14), but inclusion in *this* milestone
> is OPEN DECISION **OD-2**. If OD-2 resolves to "defer," this requirement is
> dropped from this milestone. The blueprint frames this section as
> demonstrating the relationship Token → Component → Pattern → Product →
> Ecosystem, with interactive areas (TOKENS, TYPE, COLOUR, COMPONENTS,
> PATTERNS, ACCESSIBILITY) — a substantial interactive build. Its scope and
> depth are themselves part of OD-2.

### Acceptance criteria (conditional on OD-2 = include)

1. WHEN the section renders THEN it SHALL display the **approved** title exactly
   (blueprint §14): "DESIGN IS A SYSTEM."
2. WHEN the section renders THEN it SHALL communicate the relationship
   Token → Component → Pattern → Product → Ecosystem (blueprint §14), using the
   project's own real tokens (not fabricated ones) as the demonstration.
3. WHEN any interactive demonstration is present THEN it SHALL be keyboard
   operable, respect reduced motion, convey no information by colour alone, and
   degrade to a readable static presentation (blueprint §24/§25).
4. WHEN interactivity requires a Client Component THEN it SHALL be an isolated
   island, keeping the rest of the homepage server-rendered (Requirement 10).
5. WHEN the section is implemented THEN it SHALL use only existing tokens and
   primitives and SHALL NOT introduce a new dependency (Requirement 11).

## Requirement 7 — Playground section (CONDITIONAL — see OD-3)

**User story:** As a visitor, I want to see experimentation outside formal case
studies, so that I get a sense of range and curiosity.

> **Status:** Approved blueprint item (§15), but inclusion in *this* milestone
> is OPEN DECISION **OD-3**. If OD-3 resolves to "defer," this requirement is
> dropped. Note the distinction: the homepage *Playground section* (a teaser on
> `/`) is separate from the `/playground` *route*, which `structure.md` lists
> as a future route and is OUT OF SCOPE regardless of OD-3.

### Acceptance criteria (conditional on OD-3 = include)

1. WHEN the Playground section renders THEN it SHALL present experimentation
   entries from a content model that is easy to extend later via MDX/content
   files (blueprint §15, §28), without a structural rewrite.
2. WHEN no real playground content exists THEN entries SHALL be
   clearly-provisional placeholders and the gap SHALL be listed under "Content
   required from Aman" — no fabricated experiments.
3. WHEN the section links onward THEN it SHALL NOT link to the out-of-scope
   `/playground` route unless that route exists; otherwise the onward link is
   omitted or non-interactive (no dead links).

## Requirement 8 — Motion and interaction

**User story:** As a visitor, I want motion that clarifies hierarchy and
transitions, so that the experience feels intentional and calm rather than
decorative or noisy.

### Acceptance criteria

1. WHEN any animation is specified THEN it SHALL define, in `design.md`, its
   **trigger, animated property, duration, easing, and reduced-motion
   behaviour** — no animation is specified without all five (blueprint §23/§24,
   prompt requirement).
2. WHEN a duration or easing value is used THEN it SHALL be an existing motion
   token (`--duration-instant|fast|standard|slow|cinematic`, `--ease-standard`)
   consumed via the Foundation's documented mechanisms
   (`duration-(--duration-standard)`, `ease-standard`), never an arbitrary
   value like `duration-[350ms]` (foundation `design.md` §4,
   `design-system.md`).
3. WHEN Cinematic timing (1000–1400ms) is used THEN it SHALL be reserved for a
   major storytelling moment only (e.g. the signature transition if OD-1
   includes it), not general UI (blueprint §23, `design-system.md`).
4. WHEN motion is implemented with `motion` (Motion for React) THEN it SHALL
   branch on `useReducedMotion()` so reduced-motion users get the static/end
   state — the global CSS reduced-motion block does not stop JS-driven motion
   (foundation `design.md` §12(A)).
5. WHEN any section animates THEN content SHALL render and be understandable
   without animation (static-first), animation SHALL NOT gate or delay content,
   SHALL be interruptible, SHALL animate GPU-friendly properties
   (transform/opacity), SHALL NOT animate everything simultaneously, and SHALL
   NOT hijack scroll or use excessive parallax (blueprint §24).
6. WHEN viewport-triggered (scroll-into-view) reveals are used THEN they SHALL
   trigger once, SHALL not re-trigger disruptively on scroll-up, and SHALL have
   a reduced-motion path that shows content immediately.
7. WHEN navigation or section-to-section transitions are specified THEN they
   SHALL use the existing nav behaviour (frozen Header/HeaderShell) and SHALL
   NOT introduce scroll-hijacking or a smooth-scroll library (no Lenis).

## Requirement 9 — Accessibility

**User story:** As a visitor using assistive technology or a keyboard, I want
the homepage to be fully accessible, so that the portfolio demonstrates the
accessibility expertise it claims.

### Acceptance criteria

1. WHEN the homepage renders THEN it SHALL have exactly one `h1` (the Hero
   headline) and a correct, unbroken heading hierarchy for all sections beneath
   it (no skipped levels; blueprint §25, `CLAUDE.md` §9).
2. WHEN the homepage renders THEN each major section SHALL be a semantic region
   (`<section>` with an accessible name via `aria-labelledby` or
   `aria-label`), composed inside the existing `main#main` landmark from the
   frozen layout — this milestone SHALL NOT add a second `<main>` or alter the
   frozen landmark structure.
3. WHEN any interactive element (links, CTAs, interactive demos) is present
   THEN it SHALL be keyboard operable, in a logical tab order, with the
   Foundation's shared visible `:focus-visible` indicator (no colour-only
   focus; blueprint §25).
4. WHEN links are rendered THEN they SHALL have accessible names, SHALL use
   semantic `<a>`/`next/link`, and SHALL NOT be dead links (Requirements 3.4,
   7.3).
5. WHEN any image is rendered THEN it SHALL have meaningful `alt` text, or
   `alt=""` if genuinely decorative — and placeholder/empty-state visuals SHALL
   be marked decorative rather than given fabricated descriptive alt
   (blueprint §29, `CLAUDE.md` §17).
6. WHEN colour conveys state or meaning THEN a non-colour cue SHALL also be
   present (blueprint §25, `design-system.md`).
7. WHEN colour is used THEN text/background pairings SHALL meet WCAG 2.2 AA
   contrast (4.5:1 body, 3:1 large text), including on the dark Scale surface;
   Muted is used only for non-essential text and verified even then (foundation
   `design.md` §12(A)).
8. WHEN touch targets are sized THEN interactive elements SHALL meet the
   project standard of 44×44px hit area on mobile viewports (the frozen
   Requirement 12.5 standard — unchanged here).
9. WHEN this milestone is implemented THEN it SHALL NOT silently implement the
   Foundation's **deferred** WCAG 2.2 items (SC 2.4.11
   `scroll-padding-top`/`--header-height`; SC 2.5.8 24×24; `inert` on overlay
   background). If the homepage's longer scrolling content makes SC 2.4.11
   (focus obscured by the sticky header) materially worse, that SHALL be raised
   as an OPEN DECISION (OD-5), not fixed by silently adopting the deferred
   mechanism.
10. WHEN `prefers-reduced-motion: reduce` is set THEN every section's motion
    SHALL be removed/near-zero and all content SHALL remain fully usable
    (Requirement 8.4/8.5).

## Requirement 10 — Performance & server/client architecture

**User story:** As a site owner, I want the homepage to stay lightweight and
fast, so that Core Web Vitals remain excellent as the experience grows.

### Acceptance criteria

1. WHEN sections are authored THEN they SHALL be Server Components by default;
   `"use client"` SHALL be used only for genuinely interactive islands (e.g. a
   scroll-driven transition, an interactive design-system demo), pushed to the
   smallest leaf (blueprint §4/§26, `CLAUDE.md` §5).
2. WHEN the homepage is built THEN the number and size of client islands SHALL
   be reported from `next build` First Load JS, and the homepage SHALL NOT
   regress static-route First Load JS beyond the islands this milestone
   deliberately adds (foundation verification pattern, `CLAUDE.md` §10).
3. WHEN any raster image is rendered THEN it SHALL use `next/image` with
   explicit dimensions (or sized `fill` parent), responsive `sizes`, and
   AVIF/WebP where applicable; below-the-fold media SHALL lazy-load; the Hero's
   above-the-fold media (if any) SHALL be prioritized (blueprint §26/§29).
4. WHEN icons or diagrams are needed THEN they SHALL be Lucide SVG or inline
   SVG, not icon fonts or raster icons (blueprint §29).
5. WHEN the homepage renders THEN it SHALL cause no layout shift attributable to
   fonts (frozen `next/font` setup) or to unsized media (CLS target).
6. WHEN motion is added THEN it SHALL not introduce long tasks that regress INP;
   scroll/resize listeners (if any beyond the frozen `useScrollCompact`) SHALL
   be `passive` and rAF/threshold-gated (foundation pattern).
7. WHEN the homepage ships THEN it SHALL add no third-party scripts and no new
   dependency (Requirement 11); it SHALL NOT add a loading screen for visual
   effect (blueprint §26).

## Requirement 11 — Design-system fidelity (no new tokens/deps)

**User story:** As the design-system owner, I want the homepage to consume only
the approved system, so that visual consistency is structural.

### Acceptance criteria

1. WHEN any colour, type size, spacing, radius, or motion value is used THEN it
   SHALL be an existing Foundation token consumed via the Foundation's
   mechanisms (Tailwind utilities backed by `@theme`, the `typeScale` map, the
   `:root` duration vars). No arbitrary value (`text-[…]`, `bg-[#…]`, `p-[…]`,
   `duration-[…]`, `leading-[…]`, `tracking-[…]`).
2. WHEN a needed value has no existing token THEN implementation SHALL stop and
   raise it as an OPEN DECISION / token request for Aman (`CLAUDE.md` §8/§16) —
   it SHALL NOT be papered over with an arbitrary value.
3. WHEN typography is rendered THEN it SHALL use the existing `Display`,
   `Heading`, `Body`, `Label` primitives (and the `mdx-components.tsx` mapping
   for any MDX content), not ad-hoc styled elements.
4. WHEN layout structure is needed THEN it SHALL use the existing `Container`
   and `Grid` primitives; an intentional grid break SHALL be an explicit,
   documented opt-out, not an ad-hoc override (frozen Requirement 6.4).
5. WHEN a new reusable component is created under `components/` THEN it SHALL
   follow `structure.md`'s directory map (`components/hero/`,
   `components/work/`, `components/sections/`, `components/motion/`,
   `components/ui/`) and SHALL prefer composition over configuration
   (blueprint §31).

## Requirement 12 — Metadata & content model for the homepage

**User story:** As a site owner, I want the homepage and its content to be
SEO-sound and content-driven, so that it is indexable, shareable, and
maintainable.

### Acceptance criteria

1. WHEN the homepage route renders THEN it SHALL define `title`, `description`,
   canonical URL, and Open Graph fields via the frozen `createMetadata` helper
   (`lib/metadata/`), using approved positioning copy — not duplicating
   metadata logic (blueprint §27, frozen Requirement 13).
2. WHEN a social preview image is referenced THEN it SHALL use a real asset if
   one is provided, or OMIT the OG image with a note — it SHALL NOT fabricate a
   brand asset (frozen Requirement 13.4). Providing OG art is listed under
   "Content required from Aman" (CR-6).
3. WHEN homepage section content (Selected Work entries, Scale figures,
   Playground entries if OD-3) is modeled THEN it SHALL live in typed content
   modules under `lib/content/` and/or `content/` following the Foundation's
   pattern (typed `meta`-style exports, validated at a boundary; `CLAUDE.md`
   §7), so real content replaces placeholders without a structural rewrite.
4. WHEN the content model is extended THEN it SHALL NOT alter the frozen
   `CaseStudyMeta` type or the frozen `/work/[slug]` pipeline in a
   backward-incompatible way; new models are additive.
5. WHEN `sitemap.ts`/`robots.ts` are considered THEN they SHALL remain correct
   for the existing route set; this milestone adds no new routes, so no sitemap
   change is required unless a new route is introduced (none is).

---

## Cross-cutting acceptance criteria

1. WHEN any requirement here conflicts with `IMPLEMENTATION_BLUEPRINT.md` or a
   steering file THEN implementation SHALL flag the conflict and ask before
   proceeding (`review-process.md`, `CLAUDE.md` §2/§16) — not resolve it
   silently.
2. WHEN this milestone is built THEN each delivered section SHALL be a
   reviewable vertical slice that renders in the browser and passes
   `tsc --noEmit`, `npm run lint`, and `next build` before the next section is
   started (`review-process.md`, `tech.md`).
3. WHEN a section is considered done THEN it SHALL satisfy the blueprint §36
   definition of done: visual direction, responsive behaviour, accessibility,
   performance, semantic structure, maintainability, TypeScript, lint,
   production build, and content integrity — "it renders" is not done.
4. WHEN the approved homepage section order (blueprint §6) is assembled THEN it
   SHALL NOT be reordered or have approved sections silently added/removed;
   inclusion of the conditional sections is governed by OD-1/OD-2/OD-3.
5. WHEN placeholder content is used THEN it SHALL be obviously provisional and
   SHALL NOT resemble final approved copy (`CLAUDE.md` §17), and every gap SHALL
   appear under "Content required from Aman."

---

## Open decisions (require Aman before or during implementation)

These affect information architecture, interaction model, animation concept, or
content — all of which require approval per `CLAUDE.md` §16. They are raised,
not resolved.

- **OD-1 — Signature transition in this milestone?** The blueprint (§3/§9)
  approves a scroll-driven hero→grid signature transition as homepage section
  3. The prompt's Hero scope says "entrance animation" and "avoid excessive
  hero animation," and lists the signature transition only implicitly. Decide:
  (a) include the full signature transition now (Requirement 2 applies), (b)
  include a reduced/static "resolve into grid" boundary without the full
  scroll-driven sequence, or (c) defer the signature transition to a later
  milestone and ship Hero → Selected Work as an ordinary boundary. Affects
  Requirements 1.7, 2, 8.3.
- **OD-2 — Design System section in this milestone?** Blueprint §14 approves a
  "DESIGN IS A SYSTEM." section demonstrating Token→Component→Pattern→Product→
  Ecosystem with interactive areas — a substantial interactive build
  (`structure.md` even plans `components/system/`). The prompt's scope list
  does not name it. Decide: include (Requirement 6 applies, and at what depth —
  static editorial vs. fully interactive), or defer to its own milestone.
- **OD-3 — Playground *section* on the homepage in this milestone?** Blueprint
  §15 approves a homepage Playground teaser. The prompt scope does not name it,
  and the `/playground` route is out of scope regardless. Decide: include a
  content-driven homepage Playground teaser (Requirement 7 applies) or defer.
- **OD-4 — Scale figures: provisional-visible vs. gated.** The blueprint §13
  figures are illustrative/unverified and must not ship as final (CR-3). Until
  Aman confirms verified figures, decide whether the Scale section renders (a)
  with visibly-provisional placeholders, or (b) is withheld/gated until figures
  are confirmed. Requirement 5.4 depends on this.
- **OD-5 — SC 2.4.11 on long homepage scroll (conditional).** The homepage is
  far taller than any Foundation route, so keyboard focus moving to an element
  just below the sticky header is now a realistic occurrence. The mitigation
  (`scroll-padding-top` + `--header-height`) is a Foundation-**deferred** item
  (Requirement 9.9). If, during implementation, this is observed to materially
  harm keyboard users, raise it here for a decision rather than adopting the
  deferred mechanism silently.
- **OD-6 — Hero media.** Whether the Hero includes any imagery/visual beyond
  typography (blueprint §2 lists "large product imagery" as part of the visual
  identity, but §8's Hero is headline-led). If yes, real art is required
  (CR-5). Default assumption absent a decision: typography-led Hero, no raster
  media.

### Recorded resolutions (approved by Aman)

This records decisions already approved for this milestone; it adds no new
requirement. Where an earlier passage of this spec reads otherwise, the
resolution below governs.

- **OD-1 — deferred.** No signature transition in this milestone. Requirement 2
  does not apply; Hero → Selected Work is an ordinary section boundary and the
  slot is held empty in its approved position.
- **OD-2 — included.** The Design System section ships in this milestone
  (Requirement 6 applies). As implemented, it is shallow/editorial: a
  server-rendered section with no client islands.
- **OD-3 — deferred.** No homepage Playground section; Requirement 7 does not
  apply; the slot is held empty in its approved position.
- **OD-4 — gated.** The Scale section renders a visibly gated "pending
  verification" state until CR-3 verified figures are supplied. The
  blueprint §13 illustrative figures are not rendered.
- **OD-5 — not observed; remains deferred.** The deferred SC 2.4.11 mechanism
  is not adopted (Requirement 9.9).
- **OD-6 — typography-only Hero.** No Hero media; CR-5 does not apply.
- **Motion — transform-only reveals.** `Reveal` and `HeroReveal` animate
  `transform: translateY(8px) → 0` only; **opacity is intentionally not
  animated** and remains 1 throughout. Animating opacity from 0 serialises
  hidden content into the server HTML, which violates static-first
  (Requirement 8.5). Trigger, duration (`--duration-standard`), easing
  (`--ease-standard`) and stagger (`--duration-fast`) are as specified in
  `design.md`. Reduced motion resolves to the final composition without
  changing the rendered element.
- **F-01 — Hero reflow at 320 CSS px: known exception (closed for this
  milestone).** The approved Display XL typography is retained. No change is
  made to the global type scale, the breakpoints, or Hero-specific
  typography, and no workaround is implemented. At 320 CSS px the Hero
  headline word "EXPERIENCES" does not fit, so the page scrolls horizontally
  there (WCAG 2.2 SC 1.4.10 Reflow). This is recorded as a known
  responsive/accessibility exception for this milestone, because resolving it
  requires a design-system decision rather than an implementation fix. Measured
  constraint at 320 CSS px:
  - available content width: 280px
  - Display XL (approved, 56px floor): 340px word width
  - Display L: 309px (still overflows)
  - Display M: 243px (fits)

  Display M would solve the issue but would reduce the approved mobile
  Display XL target (~56px) substantially. **Future work (design-system
  decision, not this milestone):** whether to lower the Display XL minimum,
  introduce a Hero-specific type step, or otherwise resolve 320 CSS px reflow.

---

## Content required from Aman

Nothing below may be fabricated (`CLAUDE.md` §17). These are the inputs needed
to replace provisional placeholders with final content.

- **CR-1 — Selected Work project data.** For each flagship project (DigiLocker,
  UX4G, Entity Locker, Accessibility, per blueprint §10): exact project name,
  Aman's role, discipline(s), a short approved value proposition, and the
  intended case-study slug (or confirmation it has no case study yet).
- **CR-2 — Selected Work visuals.** Real, optimized preview imagery (AVIF/WebP,
  with intended dimensions) and meaningful alt text per project — or
  confirmation to ship with tokenized empty-state placeholders.
- **CR-3 — Verified Scale figures.** Confirmed, verifiable numbers and labels
  for the Experience/Impact section. The blueprint §13 figures are illustrative
  and must not be published as fact without confirmation.
- **CR-4 — About content.** Current focus, career timeline, design interests,
  and tools/areas of expertise (blueprint §16) — concise, not a résumé. Only
  the positioning line is pre-approved (Requirement — see About in `design.md`).
- **CR-5 — Hero media (only if OD-6 = include).** Real art + alt text.
- **CR-6 — Contact details & OG asset.** Real email, LinkedIn URL, and résumé
  link for the Contact section (blueprint §17); and a real Open Graph preview
  image if one is wanted (Requirement 12.2). Until provided, Contact links are
  provisional/omitted and no OG image is fabricated.
- **CR-7 — Playground entries (only if OD-3 = include).** Real experiment
  entries/content.
- **CR-8 — Design System section depth (only if OD-2 = include).** Confirmation
  of how interactive/deep the section should be for this milestone.
- **CR-9 — Design System section body copy.** Blueprint §14 approves the
  title, the Token → Component → Pattern → Product → Ecosystem chain and the
  area names, but no body copy. The section's supporting copy remains a
  visibly provisional placeholder until supplied.

## About & Contact — approved copy anchors

For the About (Requirement — blueprint §16) and Contact (blueprint §17)
sections, the following copy is **already approved** and may be used as final;
everything else in these sections is CR-4 / CR-6 and provisional until provided:

- About positioning (approved, `content.md`/blueprint §16): "Product designer
  focused on creating clear, accessible and scalable digital experiences."
- Contact heading (approved, blueprint §17): "HAVE A GOOD PROBLEM?"
- Contact supporting (approved, blueprint §17): "Let's figure it out."
- Contact SHALL avoid a contact form unless a clear future need exists
  (blueprint §17) — default is direct Email / LinkedIn / Résumé links.

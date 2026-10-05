# Design — Portfolio Experience

## 1. Overview

This design turns the frozen Foundation into the homepage / primary portfolio
experience: the approved section stack from blueprint §6, assembled on `/`,
consuming the Foundation's tokens, typography primitives, layout primitives,
navigation, footer, metadata helpers, and content pipeline **as-is**.

It covers blueprint phases 5–12. It does **not** build full case studies, does
not add routes, and does not reopen Foundation decisions. Where a decision
would change the approved information architecture, interaction model,
animation concept, or content, it is surfaced as an Open Decision in
`requirements.md` (OD-1…OD-6) and the design is written so each resolves
without reworking the others.

The guiding principle (`product.md`) is **structured underneath, expressive on
top**. The structure is the Foundation grid, tokens, and type scale; the
expression is editorial composition, restraint, and a small amount of
purposeful motion. The work is the focus — Selected Work is the compositional
climax the Hero leads into, not one card grid among many.

### What already exists and is consumed unchanged (frozen)

| Frozen asset | Role in this milestone |
|---|---|
| `app/layout.tsx` | Provides `SkipLink → Header → main#main (tabIndex -1, pt-20) → Footer`. The homepage renders **into** `main#main`. Not modified. |
| `components/layout/{Header,HeaderShell,Footer,Container,Grid}.tsx` | Nav chrome + layout primitives. Reused. `pt-20` header offset stays. |
| `components/navigation/*` | Desktop/mobile nav. Unchanged. |
| `components/typography/{Display,Heading,Body,Label}.tsx` + `scale.ts` | All homepage text uses these. No new type styles. |
| `components/ui/SkipLink.tsx` | Unchanged. |
| `lib/metadata/{site,createMetadata}.ts` | Homepage metadata uses `createMetadata`. |
| `lib/content/{types,index}.ts` | Case-study pipeline. New content models are **additive** and must not break `CaseStudyMeta` or `getCaseStudyBySlug`. |
| `globals.css` `@theme` + `:root` | All tokens (colour, radius, leading/tracking, breakpoints, durations, easing). No new token added here. |
| `motion` (installed, unused so far) | First use is this milestone, for section reveals and (if OD-1) the signature transition. |

### Section-to-source map (approved order preserved)

```
main#main  (frozen layout)
└── app/page.tsx  (Server Component — composes sections in approved order)
    1. (Navigation — frozen Header, already in layout)
    2. Hero                       components/hero/Hero.tsx
    3. Signature transition       components/hero/HeroTransition.tsx   [OD-1]
    4. Selected Work              components/work/ (ProjectGrid, ProjectCard, ProjectMeta)
    5. Philosophy                 components/sections/Philosophy.tsx
    6. Principles                 components/sections/Principles.tsx
    7. Scale                      components/sections/Scale.tsx
    8. Design System              components/sections/DesignSystem.tsx [OD-2]
    9. Playground                 components/sections/Playground.tsx   [OD-3]
    10. About                     components/sections/About.tsx
    11. Contact                   components/sections/Contact.tsx
    12. (Footer — frozen, already in layout)
```

This matches blueprint §6 and `structure.md`'s target component tree exactly.
Nothing is reordered. Conditional sections (3/8/9) occupy their approved slots
*if* their Open Decision resolves to "include"; otherwise the slot is empty and
the surrounding sections are unaffected.

## 2. Dependencies

**No new dependency is added.** The only not-yet-used approved dependency is
`motion` (Motion for React, pinned in foundation `design.md` §2), which this
milestone begins to use. Everything else — `next`, `react`, `tailwindcss`,
`lucide-react`, `@next/mdx` and friends — is already installed and pinned.

Explicitly not added (blueprint §3, `tech.md`, `CLAUDE.md` §12): GSAP,
Three.js, R3F, WebGL, Lenis (no smooth-scroll library — native scroll only),
Lottie, `framer-motion`-as-separate-package, any UI library, any
state-management library, `clsx`/`tailwind-merge`. If a section appears to need
one, that is an Open Decision / dependency request, not an inline addition.

## 3. Composition & page shell

`app/page.tsx` stays a **Server Component**. It:

- calls `createMetadata({ title, description, path: "/" })` with approved
  positioning copy for the homepage `metadata` export (Requirement 12.1);
- renders the sections in the approved order, each as its own semantic
  `<section>` with an accessible name;
- renders **only its content** — it does not add a `<main>` (the frozen layout
  owns `main#main`), matching how the existing placeholder pages work.

Each section component:

- is a **Server Component by default** (Requirement 10.1);
- wraps its content in the frozen `Container` (and `Grid` where columnar);
- exposes an `id` and is labelled by its heading via `aria-labelledby` so it is
  a named region (Requirement 9.2) and can be an in-page anchor target for a
  Hero CTA or nav (Requirement 1.7);
- renders fully without JavaScript (static-first). Motion is layered on top via
  a client wrapper only where justified (§10).

### Heading hierarchy (Requirement 9.1)

Exactly one `h1`: the Hero headline. Every section heading is an `h2`;
sub-structure within a section (e.g. a project title, a principle name) is `h3`.
This is enforced by passing explicit `as` to the typography primitives (the
primitives default `Heading` to `h2`, but each usage sets `as` deliberately,
exactly as the frozen `mdx-components.tsx` mapping does).

```
h1  Hero headline ("DESIGNING PRODUCTS, SYSTEMS & EXPERIENCES AT SCALE.")
h2  Selected Work            h2  Philosophy            h2  Principles
  h3  <project name> ×N        (progressive lines are    h3  Clarity
h2  Scale                       styled Body/Display,      h3  Systems
  h3  <figure label> (see §7)   not headings)            h3  Accessibility
h2  Design System [OD-2]      h2  About                  h3  Scale
h2  Playground [OD-3]         h2  Contact
```

Section accessible names come from each `h2` via `aria-labelledby`. The Hero's
`h1` names the Hero region.

## 4. Design-token usage (no new tokens)

All values are existing tokens. Concretely:

- **Colour:** Canvas/Surface/Ink/Muted/Border/Accent via `bg-*`/`text-*`
  utilities already produced by `@theme`. The Scale section's dark treatment
  uses **Ink** (`bg-ink`) as the surface with **Canvas**/**Surface** text and
  **Accent** for emphasis — no new "dark" token (Requirement 5.1, 11.1).
- **Type:** `Display` (xl/l/m), `Heading` (xl/l/m/s), `Body` (l/m/s), `Label`
  (caption), each already carrying its approved leading/tracking. No new scale
  entry. Large editorial headlines use `Display`.
- **Spacing:** section rhythm uses the 8-point scale via stock Tailwind
  utilities (`py-24` = 96px, `py-32` = 128px, `gap-6` = 24px, etc.), per the
  frozen §4 mapping. **Off-scale steps (`p-5`, `p-7`, `p-9`, …) are not used.**
  If an editorial section genuinely needs a value beyond the scale (e.g. a very
  large vertical gap > 192px), that is a **named** token request under
  `CLAUDE.md` §16 (OPEN DECISION), not an arbitrary value.
- **Radius:** `rounded-sm|md|lg|pill` for any media/preview framing;
  "avoid excessive card treatment" (blueprint §22) — Selected Work entries are
  editorial, not heavily-chromed cards.
- **Motion:** `--duration-*` via `duration-(--duration-standard)` etc., and
  `ease-standard`; `motion` variants reference the same numeric token values
  (see §10). No arbitrary timing.

### Section vertical rhythm

A single consistent vertical rhythm keeps the page systematic. Sections use a
large top/bottom padding token (recommended `py-24`/`py-32` depending on
density, both on-scale) and `Container` for horizontal insets. The exact rhythm
per section is a visual-polish detail chosen at implementation time from the
on-scale tokens — it is **not** a free value, and the implementer must not
reach for an off-scale or arbitrary padding.

## 5. Hero (§2 of the stack)

**Files:** `components/hero/Hero.tsx` (Server Component),
`components/hero/HeroReveal.tsx` (`"use client"`, optional entrance wrapper).

### Composition

- **Desktop (`lg:`):** The headline is the dominant element — `Display` at
  `xl`, rendered as the page `h1`, broken across the five approved lines
  (blueprint §8). The approved supporting statement renders below in `Body`
  at `l` or `m`, constrained to a readable measure (≈ 60–75ch) and aligned to
  the grid (e.g. starts at the same column as the headline). The section is
  sized to ≈ one viewport (`min-h-[...]` using a viewport unit is acceptable
  as it is not a design *token* value but a layout primitive;
  **clarification:** `min-h-svh`/`min-h-dvh` are layout utilities, not design
  tokens, and are permitted — they introduce no colour/size/spacing token).
  Content is vertically composed with the header offset already handled by the
  frozen `main` `pt-20`.
- **Mobile (base):** Headline `Display xl` clamps to ≈56px (frozen `typeScale`
  arithmetic), preserving the five-line structure; supporting statement full
  width within `Container`. No horizontal overflow. The section need not force
  a full viewport on mobile if that pushes the supporting statement off-screen
  — approximately one viewport, with the headline dominant, is the target.

### Line breaks

The five-line headline uses explicit line structure (e.g. each line in its own
block/`<span>` with `display:block`, or `<br>` inside the `Display`), so the
approved line breaks are preserved rather than left to the browser. This is
content fidelity (Requirement 1.1), not a style choice.

### CTA (Requirement 1.7, relates to OD-1/OD-6)

Default: a single restrained text link/`Button`-style CTA ("Selected work" /
downward affordance) anchoring to `#selected-work`, plus the nav's existing
`LET'S TALK`. If OD-1 includes the signature transition, the Hero→Work
relationship is carried by the transition and an explicit CTA may be
redundant — resolved under OD-1. No CTA points to a non-existent route.

### Entrance motion (Requirement 1.8/1.9, 8)

| Aspect | Value |
|---|---|
| Trigger | On mount (first paint), once |
| Property | `opacity` 0→1, `transform: translateY(8px)→0` (GPU-friendly) |
| Duration | `--duration-standard` (400ms); supporting line may stagger by `--duration-fast` (200ms) |
| Easing | `ease-standard` (ease-out) |
| Reduced motion | `useReducedMotion()` → render final state immediately, no transform/opacity animation |

Static-first: the headline HTML is fully present and styled server-side; the
`HeroReveal` client wrapper only animates presence. If it fails to hydrate, the
content is already visible. The animation never gates paint (Requirement 1.9,
8.5). This is a candidate to be the only Hero client island — or none at all if
OD-1's transition supersedes it.

## 6. Signature transition (§3 — CONDITIONAL, OD-1)

**File (if included):** `components/hero/HeroTransition.tsx` (`"use client"`).

Only built if OD-1 = include. Design intent (blueprint §9): as the user scrolls
past the Hero, the headline sequence `DESIGNING → PRODUCTS → SYSTEMS →
EXPERIENCES → AT SCALE` resolves into a structured grid that becomes the visual
entry into Selected Work.

| Aspect | Value |
|---|---|
| Trigger | Scroll progress over the Hero→Work boundary (Motion `useScroll` + `useTransform`), NOT scroll-jacking — the page scrolls normally; the animation is driven by native scroll position |
| Property | `opacity`/`transform` on the typographic layers and grid cells only (GPU-friendly); no layout-property animation |
| Duration | Scroll-linked (progress-driven), not a fixed duration; any discrete settle uses `--duration-slow`/`--duration-cinematic` (cinematic reserved for this storytelling moment per Requirement 8.3) |
| Easing | `ease-standard`; cinematic settle may use the token's curve |
| Reduced motion | `useReducedMotion()` → skip the scroll-linked animation; render the end-state grid statically as the Selected Work entry |

Hard constraints (blueprint §9, Requirement 2): interruptible, no scroll
hijack, works on mobile (or degrades to the static end state on small
viewports), never required to understand content, never delays Hero paint. If
OD-1 = defer, this file is not created and Hero → Selected Work is an ordinary
section boundary.

## 7. Selected Work (§4) — the compositional focus

**Files:** `components/work/ProjectGrid.tsx` (Server),
`components/work/ProjectCard.tsx` (Server),
`components/work/ProjectMeta.tsx` (Server). Content model in
`lib/content/projects.ts` (+ `types.ts` addition). These names match
`structure.md`'s target tree.

### Content model (Requirement 3.8, 12.3) — additive, does not touch CaseStudyMeta

New typed model, separate from the frozen `CaseStudyMeta`:

```ts
// lib/content/types.ts — ADDITIVE (frozen CaseStudyMeta is unchanged)
export interface ProjectSummary {
  name: string;              // CR-1
  role: string;              // CR-1
  discipline: string;        // CR-1
  valueProposition: string;  // CR-1 — short, approved
  order: number;             // project hierarchy (Requirement 3.9)
  /** Case-study slug IF a real /work/[slug] page exists; else null. */
  caseStudySlug: string | null;
  /** Preview image metadata; null → tokenized empty-state (Requirement 3.5). */
  preview: { src: string; alt: string; width: number; height: number } | null;
  /** Marks the entry as provisional so the UI can render a visible placeholder. */
  provisional: boolean;
}
```

```ts
// lib/content/projects.ts
// Provisional entries ONLY until CR-1/CR-2 are supplied. Values are clearly
// non-final (e.g. name: "Project — content required") so nothing resembles
// final approved copy. caseStudySlug is null for every entry this milestone
// (no real case studies exist), so no entry links to a slug that 404s.
export const projects: ProjectSummary[] = [ /* provisional placeholders */ ];
```

The flagship set (DigiLocker, UX4G, Entity Locker, Accessibility — blueprint
§10) defines the *number and identity* of entries, but their role/discipline/
value proposition/visuals are **CR-1/CR-2** and must not be fabricated. Until
provided, entries render provisional placeholders.

### Layout (Requirement 3.7, 7)

- **Desktop (`lg:`, 12 cols):** editorial, not a uniform card wall. Options the
  implementer may choose from, all grid-aligned via `Grid`: large alternating
  rows (image + meta offset), or a 2-up with the lead/flagship project spanning
  more columns. "Project hierarchy" (Requirement 3.9) is expressed by giving the
  highest-`order` project more visual weight (larger span / full-bleed media).
- **Tablet (`md:`, 8 cols):** entries reflow to a single column or 2-up with
  reduced offset — not the desktop layout shrunk.
- **Mobile (base, 4 cols):** stacked single column; media on top, meta below;
  comfortable tap targets.

### ProjectCard anatomy

- **Visual preview** (`next/image`, explicit `width`/`height` or sized `fill`
  parent, responsive `sizes`, lazy below the fold, `rounded-lg` media radius).
  When `preview === null`: a tokenized empty-state block (Border/Surface, sized
  to the intended aspect ratio) with `alt=""`/decorative treatment — **no
  fabricated screenshot, no fabricated alt** (Requirement 3.5, 9.5).
- **ProjectMeta:** `h3` project name (`Heading as="h3"`), role · discipline in
  `Label`/`Body s` (`text-muted`, non-essential), value proposition in
  `Body m`.
- **Case-study link:** rendered only when `caseStudySlug !== null`. This
  milestone ships all entries with `caseStudySlug: null`, so the link is a
  non-interactive "Case study — coming soon" affordance (not an `<a>` to a
  404ing slug) (Requirement 3.4). The slot and styling exist so enabling a link
  later is a data change, not a layout change.

### Interaction (Requirement 3.6)

Hover may lift/underline/zoom-media subtly (transform/opacity only), but the
same affordance is reachable via keyboard focus (`:focus-visible`) and the
entry is fully usable on touch. No information is hover-only or colour-only. If
the whole card is a link (when a case study exists), it uses one accessible
`<a>` wrapping the content with an accessible name, not nested interactive
elements.

## 8. Philosophy (§5) & Principles (§6)

**Files:** `components/sections/Philosophy.tsx`,
`components/sections/Principles.tsx` (both Server;
`components/motion/Reveal.tsx` client wrapper used for the progressive reveal).

### Philosophy (Requirement 4.1–4.4)

Predominantly typographic, minimal chrome. The approved copy renders exactly:

- Primary statement "I DON'T DESIGN SCREENS." as a large `Display` (m or l) —
  **but not an `h1`** (the Hero owns `h1`); rendered as `h2` for the section,
  or as a styled non-heading lead with the section's `h2` being a visually
  hidden/explicit label — the implementer picks one that keeps a single `h1`
  and a valid hierarchy. Recommended: the section `h2` *is* the primary
  statement.
- The six progressive statements render as a sequence of `Body l`/`Display m`
  lines (styled text, not headings), in the approved order.
- Closing "That's what I design." as an emphasized line.

### Principles (Requirement 4.5)

Four principles, each an `h3` name + one-line `Body` definition, laid out on the
grid (e.g. 2×2 on desktop via `Grid`, stacked on mobile). Exact approved copy
per `requirements.md` R4.5.

### Motion (Requirement 4.7, 8)

| Aspect | Value |
|---|---|
| Trigger | Scroll-into-view, once (Motion `whileInView`, `viewport={{ once: true }}`) |
| Property | `opacity` 0→1, small `translateY` on each progressive line / principle, **staggered** (never all at once — blueprint §24.2) |
| Duration | `--duration-standard` per item; stagger step `--duration-fast` |
| Easing | `ease-standard` |
| Reduced motion | `useReducedMotion()` → all lines visible immediately, no stagger |

The approved copy is fully present server-side; the reveal only affects
presence (static-first). This is where `components/motion/Reveal.tsx` earns its
place as a reusable client primitive (a thin wrapper that applies the
whileInView opacity/translate with reduced-motion branching), reused by other
sections rather than re-implemented per section.

## 9. Scale / Experience & Impact (§7)

**File:** `components/sections/Scale.tsx` (Server). Content model
`lib/content/scale.ts`.

### Treatment (Requirement 5.1)

Dark section: `bg-ink` surface, Canvas/Surface text, Accent for the numeric
emphasis. Full-bleed or inset per visual polish, grid-aligned. This is the one
tonal inversion on the page and provides editorial contrast before About.

### Figures model & the content-integrity gate (Requirement 5.2–5.4, OD-4, CR-3)

```ts
// lib/content/scale.ts
export interface ScaleFigure { value: string; label: string; }
// Values are CR-3. The blueprint §13 numbers are ILLUSTRATIVE/UNVERIFIED
// (content.md, CLAUDE.md §19.2) and must NOT ship as final without Aman.
export const scaleFigures: ScaleFigure[] = [ /* per OD-4 */ ];
```

**OD-4 governs rendering until figures are verified:**

- **OD-4 = provisional-visible:** render placeholders that are *obviously*
  non-final (e.g. "— figures pending verification —" or dashes), never the
  illustrative numbers presented as fact.
- **OD-4 = gated:** the section renders a minimal heading + "content coming"
  state, or is omitted from the stack, until CR-3 is supplied.

Either way, the illustrative blueprint figures are **not** rendered as final.

### Semantics (Requirement 5.5)

Each figure pairs value + label programmatically — e.g. a `<dl>` of
`<dt>`(label)/`<dd>`(value) or a figure/figcaption, so the pairing is in the
accessibility tree, not just visual proximity. Numbers use `Display`/`Heading`
sizing; labels use `Label`/`Body s`.

### Responsive & contrast (Requirement 5.6, 9.7)

Figures reflow (e.g. 4-up desktop → 2-up tablet → 1-up mobile) via `Grid`.
Canvas-on-Ink and Accent-on-Ink pairings are contrast-checked at implementation
time to meet AA.

## 10. Design System section (§8 — CONDITIONAL, OD-2)

**File (if included):** `components/sections/DesignSystem.tsx` (Server shell) +
`components/system/*` client islands (`TokenPlayground`, `ComponentPreview`,
`PatternPreview` — `structure.md` names). Built only if OD-2 = include; depth is
CR-8.

Approved title "DESIGN IS A SYSTEM." (`h2`). Demonstrates
Token→Component→Pattern→Product→Ecosystem using the project's **real** tokens
(it can literally display the Foundation's own colour/type/spacing tokens — a
genuine demonstration, nothing fabricated). Interactive demos are isolated
client islands (Requirement 6.4, 10.1); each is keyboard operable, reduced-
motion aware, non-colour-only, and degrades to a static readable presentation
(Requirement 6.3). No new dependency (Requirement 6.5) — interactivity is React
state + CSS, not a new library.

If OD-2 = defer, the slot is empty; the stack is unaffected.

## 11. Playground section (§9 — CONDITIONAL, OD-3)

**File (if included):** `components/sections/Playground.tsx` (Server). Content
model `lib/content/playground.ts`, structured for easy MDX/content extension
later (blueprint §15/§28). Built only if OD-3 = include; entries are CR-7
(provisional placeholders until supplied). Does **not** create the
`/playground` route (out of scope); any onward link is omitted/non-interactive
until that route exists (Requirement 7.3). If OD-3 = defer, slot empty.

## 12. About (§10)

**File:** `components/sections/About.tsx` (Server).

Concise, editorial, not a résumé (blueprint §16). The **approved** positioning
line may be used as final: "Product designer focused on creating clear,
accessible and scalable digital experiences." The rest — current focus, career
timeline, design interests, tools/areas of expertise — is **CR-4** and renders
as clearly-provisional placeholders until supplied (no fabricated employers,
dates, titles, or tools — `CLAUDE.md` §17). Section `h2`; sub-items `h3`/`Body`.
Grid-aligned; stacks on mobile.

## 13. Contact (§11)

**File:** `components/sections/Contact.tsx` (Server).

Approved copy used as final: heading "HAVE A GOOD PROBLEM?" (`h2`, `Display`
sizing), supporting "Let's figure it out." (`Body l`). Links: Email, LinkedIn,
Résumé (blueprint §17) — their real targets are **CR-6**; until supplied they
render as provisional/disabled affordances, not dead `mailto:`/URLs with
fabricated addresses. **No contact form** (blueprint §17) unless a clear future
need is approved. This section is a strong closing CTA and a valid Hero-CTA
anchor target (`#contact`).

## 14. Motion architecture (cross-section)

- **`components/motion/Reveal.tsx`** — `"use client"`. Thin reusable wrapper:
  `whileInView` opacity/translateY, `viewport={{ once: true }}`,
  `useReducedMotion()` → render children statically. Used by Philosophy,
  Principles, Scale, About, Contact for restrained entrance reveals. One island
  pattern, reused — not re-implemented per section.
- **`components/hero/HeroReveal.tsx`** — `"use client"`. Hero entrance (§5).
- **`components/hero/HeroTransition.tsx`** — `"use client"`, only if OD-1.
- Everything else is a Server Component. The client islands are small presence/
  scroll wrappers; the actual content (text, images, structure) is server-
  rendered and passed as `children`, so it does not enter the client bundle
  (the same pattern the frozen `HeaderShell` uses).
- `components/motion/{ImageReveal,TextTransform,ScrollProgress}.tsx` from
  `structure.md`'s target tree are **not** created unless a section concretely
  needs them (no premature abstraction, `CLAUDE.md` §4). `Reveal` covers the
  common case; add others only when a specific section's motion spec requires
  one. Any such addition is noted in that section's motion table.

**Motion token discipline:** Motion for React `transition` objects express
duration in seconds; the values used MUST equal the token values
(`--duration-standard` 400ms → `0.4`, `--duration-fast` 200ms → `0.2`,
`--duration-slow` 700ms → `0.7`, cinematic 1200ms → `1.2`), with a short
comment tying each back to its token so they are not read as arbitrary magic
numbers. Easing uses the ease-out curve matching `--ease-standard`. This keeps
JS motion values traceable to the approved tokens even though Motion doesn't
consume CSS custom properties directly.

## 15. Server/client boundary summary (Requirement 10.1/10.2)

| Component | Boundary | Reason |
|---|---|---|
| `app/page.tsx` | Server | Composition only |
| `Hero`, all `sections/*`, all `work/*` | Server | Static content |
| `HeroReveal`, `Reveal` | Client | Presence/scroll animation (presence only; children server-rendered) |
| `HeroTransition` | Client (OD-1) | Scroll-linked transition |
| `system/*` demos | Client (OD-2) | Interactive demo state |

Verification mirrors the Foundation's: `grep -rn "use client" components/`
should return the frozen `HeaderShell.tsx` + `MobileNav.tsx` **plus only** the
islands above that the resolved ODs actually include; `next build` First Load
JS for `/` is reported and must not exceed the Foundation baseline beyond these
deliberate islands.

## 16. Accessibility design (Requirement 9)

- **Landmarks/regions:** homepage content sits in the frozen `main#main`; each
  section is a named `<section aria-labelledby="...">`. No second `<main>`; the
  frozen landmark structure is untouched.
- **Headings:** single `h1` (Hero); sections `h2`; sub-items `h3` (§3 heading
  map). No skipped levels.
- **Keyboard & focus:** all links/CTAs/interactive demos keyboard operable in
  logical order; the global `:focus-visible` ring applies; no colour-only focus.
- **Links:** semantic, named, never dead (provisional links are non-interactive
  affordances, not `<a>`s to 404s).
- **Images:** meaningful `alt`, or decorative `alt=""` for placeholders/empty
  states; no fabricated alt.
- **Colour:** non-colour cues accompany any colour-coded state; AA contrast
  verified for all pairings including the dark Scale surface; Muted only for
  non-essential text.
- **Touch targets:** 44×44 mobile standard (frozen Req 12.5), unchanged.
- **Reduced motion:** every motion wrapper branches on `useReducedMotion()`;
  the global CSS block covers CSS transitions; JS motion is additionally gated.
- **Deferred items NOT silently implemented (Requirement 9.9):** no
  `scroll-padding-top`/`--header-height`, no SC 2.5.8 24×24 reinterpretation, no
  `inert`. If the long homepage scroll makes SC 2.4.11 materially worse, raise
  **OD-5**; do not adopt the deferred mechanism unilaterally.

## 17. Metadata (Requirement 12)

Homepage `metadata` uses `createMetadata({ title: "Home", description:
<approved positioning>, path: "/" })` (the helper already builds canonical +
OG). No OG image is fabricated (frozen Req 13.4); if Aman supplies one (CR-6),
it is wired via `openGraph.images`. `sitemap.ts`/`robots.ts` are unchanged (no
new routes). Content models live under `lib/content/` typed and validated at a
boundary, following the frozen pattern; the frozen `CaseStudyMeta`/`/work/[slug]`
pipeline is not altered (Requirement 12.3/12.4).

## 18. Verification plan (per section and overall)

Each section is a vertical slice; after each, run and record:

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (ESLint flat config; never `next lint`).
- `next build` — succeeds; capture `/` First Load JS and client-island count.
- **Token-fidelity grep:** no arbitrary values introduced — search for
  `text-[`, `bg-[#`, `p-[`, `gap-[`, `duration-[`, `leading-[`, `tracking-[`
  across new files returns nothing (Requirement 11.1).
- **Boundary grep:** `grep -rn "use client" components/` returns only the
  expected frozen + new islands (Requirement 10.2, §15).
- **Live responsive** at 375 / 768 (±1 at 767/768) / 1024 (±1 at 1023/1024) /
  1440: section layouts reflow per their responsive spec, no overflow, grid
  column counts correct at the boundaries.
- **Heading tree:** browser a11y tree shows one `h1` and the §3 hierarchy with
  no skipped levels.
- **Keyboard pass:** tab through all section interactive elements, logical
  order, visible focus, no dead links, provisional affordances not focusable as
  links.
- **Reduced-motion pass:** with `prefers-reduced-motion`, every reveal/
  transition shows end-state immediately; content fully usable.
- **Contrast check** on the Scale dark surface and any Accent-on-dark text.
- **CLS/image check:** every `next/image`/placeholder has reserved dimensions;
  no layout shift on load; below-the-fold media lazy-loads; Hero media (if any)
  prioritized.
- **Content-integrity check:** no fabricated project data, metrics, About
  details, or contact info is rendered as final; all gaps are provisional and
  listed in CR-#; illustrative Scale figures are not shown as fact.

Overall (end of milestone): full pass of the above on the assembled homepage,
plus confirmation the approved section order (blueprint §6) is intact and only
the OD-approved conditional sections are present.

## 19. Decisions that remain OPEN (not resolved by this design)

This design is written to accommodate every Open Decision without rework, but
it does **not** resolve any of them — they require Aman (`CLAUDE.md` §16):

- **OD-1** signature transition (include/reduced/defer) — §6 built-if-included.
- **OD-2** Design System section (include at what depth / defer) — §10.
- **OD-3** Playground homepage section (include/defer) — §11.
- **OD-4** Scale figures provisional-visible vs. gated — §9.
- **OD-5** SC 2.4.11 on long scroll (raise only if observed) — §16.
- **OD-6** Hero media (typography-only vs. with art) — §5; default typography-only.

And the content gaps CR-1…CR-8 (`requirements.md`) must be filled before the
corresponding sections can ship with final content; until then those sections
ship with clearly-provisional placeholders (or gated, per OD-4 for Scale).

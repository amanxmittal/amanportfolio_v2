# Content Inventory — Portfolio

Working document for the content phase that follows the frozen Foundation and
Portfolio Experience milestones. It records **what content exists, what is
provisional, and what is missing** so that real content can replace
placeholders as a data change.

This is a tracking document. It is **not** a source of truth and does not
create requirements (same standing as `REVIEW_FINDINGS.md`). The authoritative
sources remain `IMPLEMENTATION_BLUEPRINT.md`, the active Kiro Spec, and
`.kiro/steering/*`.

**Nothing in this file may be fabricated** (`CLAUDE.md` §17). Candidate values
recovered from the previous site are recorded as *unverified* and must be
confirmed by Aman before they are rendered as final.

## Status legend

| Status | Meaning |
|---|---|
| **APPROVED** | Approved copy in the blueprint/`content.md`; may ship as final |
| **PROVISIONAL** | Rendered today as a visibly non-final placeholder |
| **CANDIDATE** | Found on the previous site (amanmittal.me) — historical, **unverified**, needs Aman's confirmation |
| **MISSING** | Does not exist anywhere; must be supplied or written |

---

## 1. Selected Work (CR-1 / CR-2)

Model: `lib/content/projects.ts` → `ProjectSummary` (`lib/content/types.ts`).
Rendered by `components/work/*`.

The four entries and their order are approved identity (blueprint §10). Every
other field is a placeholder today: `role`, `discipline` and `valueProposition`
are all the string `"Content required"`, `preview` and `caseStudySlug` are
`null`, `provisional` is `true`.

### Per-project content needed

For each project below: **name · role · discipline · one-line value
proposition · timeline · organization · preview image + alt · case-study slug
(or "none yet") · any verified outcome.**

| # | Project | Name | Role | Discipline | Value prop | Preview | Case study | Verified outcome |
|---|---|---|---|---|---|---|---|---|
| 1 | DigiLocker | APPROVED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING |
| 2 | UX4G | APPROVED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING |
| 3 | Entity Locker | APPROVED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING |
| 4 | Accessibility | APPROVED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING |

### Notes per project

- **DigiLocker** — the brief lists a wide surface area (sign-in/sign-up,
  onboarding, nominee web flow, Verifiable Credentials, Aadhaar/PAN/DL, ABHA /
  Health Locker, ecosystem/partner, dark mode, APAAR, challan, shelf/lockers,
  Family Locker, help & support, tours, trust markers, AI-assisted). These are
  at **different stages** (shipped / explored / proposed) and must be labelled
  accordingly. **Do not present exploration as shipped.** Needed: which
  specific areas the case study covers and each one's stage.
- **UX4G** — Design System 2.0 and 3.0, tokens, components, patterns,
  documentation, accessibility (GIGW/WCAG), Storybook, Flutter/widget docs,
  migration/adoption, governance. Positioned toward India Design System.
  Needed: scope Aman personally owned vs. the team's, and which adoption
  claims are defensible.
- **Entity Locker** — no content of any kind yet.
- **"Accessibility"** — this entry is a **discipline, not a product**. It is
  fixed by blueprint §10, so it is not changed here, but it needs either a
  concrete project behind it or a decision from Aman (see
  "Open content decisions" below).

### Preview imagery (CR-2)

`public/` is **empty** — the repository contains no image assets at all. Every
preview renders the tokenized empty state. Needed per project: a real,
optimized preview (AVIF/WebP, intended dimensions) plus meaningful alt text,
or confirmation to ship the empty states.

Per the brief's image strategy: real screenshots, design explorations, selected
Figma frames, before/after, diagrams or system views — **never** fabricated or
generated product screenshots. Confidentiality must be checked per asset; the
previous site's case studies carried an explicit "sensitive data omitted and
figures obfuscated" notice.

---

## 2. Case studies

Pipeline: `content/work/<slug>/index.mdx` with a typed `meta` export, consumed
by `lib/content/index.ts` and `/work/[slug]`.

| Slug | Status |
|---|---|
| `_example` | PROVISIONAL — pipeline proof only, explicitly "not a real case study" |

**No real case study exists in this repository.** The registry
(`CASE_STUDY_SLUGS`) contains only `_example`, so every `caseStudySlug` is
`null` and Selected Work renders "Case study — coming soon".

### Material on the previous site (CANDIDATE, historical)

| Old page | Framing there | Reusable text? |
|---|---|---|
| `/ux4g` | "Transforming Government UX Standards" | **No** — 13 full-page images, ~500 characters of HTML text |
| `/digilocker` | "UX Improvement"; sections "My Task", "My research, findings and suggestions" | **No** — 7 images, ~140 characters of text |
| `/merrygo-case-study` | "Revamping the Delhi Metro Application" | **Partly** — ~3,600 characters: Overview, Goals, Kickoff, Research & Discoveries, Prototype, Team |
| `/impact` | "Case Study" | Not inspected in detail |
| `/impressions`, `/instahyre`, `/medical-icon`, `/blender-projects` | UI design / UX improvement / icons / 3D | Older, smaller pieces |

**Key finding:** the two flagship case studies are **image-based**. Their
narrative is baked into page images and cannot be extracted as editorial text.
Written narrative for DigiLocker and UX4G is therefore **MISSING** and must be
authored from Aman's input, not recovered.

**Verification flag:** the old DigiLocker page reads as a self-directed UX
improvement study ("my research, findings and suggestions"), which is a
different claim from professional product ownership at NeGD. Which one the new
case study makes must be confirmed.

---

## 3. About (CR-4)

Rendered by `components/sections/About.tsx`; route `/about` is still a
Foundation placeholder.

| Item | Status | Notes |
|---|---|---|
| Positioning line | **APPROVED** | "Product designer focused on creating clear, accessible and scalable digital experiences." — live as final |
| Current focus | PROVISIONAL | "Content required" |
| Career timeline | PROVISIONAL | "Content required" |
| Design interests | PROVISIONAL | "Content required" |
| Tools / areas of expertise | PROVISIONAL | "Content required" |

### Candidates from the previous site (unverified, and some likely stale)

- UX designer based in Delhi, India; bachelor's degree in Computer Science;
  working in the field since 2019.
- Described there as "UX Designer at **Digital India Corporation (DIC)**",
  working across DigiLocker, UX4G, Entity Locker, API Setu, National Academic
  Depository.
- Interests: side projects (UX and 3D modelling), podcasts, badminton, swimming.

**Conflict to resolve:** the previous site says Digital India Corporation (DIC);
the continuation brief says National e-Governance Division (NeGD), MeitY.
Employer, title and dates are credentials and must not be guessed
(`CLAUDE.md` §17). Aman to confirm the current, correct framing.

**Still MISSING:** dated timeline, current focus statement, tool list.

---

## 4. Contact (CR-6)

Rendered by `components/sections/Contact.tsx`. Heading and supporting line are
**APPROVED** and live. All three channels render as non-interactive provisional
affordances — no fabricated addresses.

| Channel | Status | Candidate from previous site (unverified) |
|---|---|---|
| Email | PROVISIONAL | `amanmittalux@gmail.com` |
| LinkedIn | PROVISIONAL | `linkedin.com/in/amanxmittal` |
| Résumé | PROVISIONAL | A PDF was served at the old site; Aman will supply the current one |
| OG / social image | MISSING | None; none fabricated |

Also unconfirmed: whether to carry over Dribbble, Behance, YouTube or Instagram,
and the **production domain** (`NEXT_PUBLIC_SITE_URL` is unset, so canonical
URLs currently resolve to `localhost`).

Nav note: `LET'S TALK` still points at `/about` as a provisional target; a
`#contact` anchor now exists on the homepage.

---

## 5. Scale (CR-3)

`lib/content/scale.ts` → `scaleFigures` is **deliberately empty**. The section
renders a visibly gated state (OD-4). The blueprint §13 illustrative figures
are intentionally not reproduced in the codebase.

| Candidate figure | Status | Needed |
|---|---|---|
| 600M+ digital users | UNVERIFIED (illustrative) | Source, date, exact definition — users of the platform, not of Aman's work |
| 30+ ministries | UNVERIFIED (illustrative) | What "ministries" counts, and of what |
| 20+ products/websites audited | UNVERIFIED (illustrative) | Scope and date |
| 50+ design-system pages | UNVERIFIED (illustrative) | Definition of "page" |

Each figure needs a **value, label, source and verification status**. Figures
describing a platform's scale rather than Aman's contribution should be worded
so the distinction is honest. Any figure that cannot be defended stays out.

---

## 6. Design System section (CR-9)

`components/sections/DesignSystem.tsx`. Approved and live: the title
"DESIGN IS A SYSTEM.", the Token → Component → Pattern → Product → Ecosystem
chain, the six area names, and a swatch row rendering the project's **real**
Foundation colour tokens.

| Item | Status |
|---|---|
| Title, chain, area names | APPROVED |
| Real token swatches | REAL (this project's own tokens) |
| Supporting body copy | PROVISIONAL — "Supporting copy — content required" |

Needed: short editorial body copy conveying systems thinking without becoming
UX4G documentation. Must stay shallow, editorial and server-rendered.

---

## 7. Open content decisions for Aman

1. **The fourth Selected Work entry.** "Accessibility" is a discipline, not a
   product. Keep it as a themed entry, or replace it with a concrete project?
   The set is fixed by blueprint §10, so changing it is a product decision.
2. **Employer / title framing.** NeGD (MeitY) vs. Digital India Corporation,
   plus current title and dates.
3. **DigiLocker claim.** Professional product ownership, or the earlier
   self-directed UX improvement study?
4. **Confidentiality.** What may be shown publicly, and what must be omitted or
   obfuscated, per project.
5. **Production domain**, for canonical URLs and OG metadata.
6. **Scale figures** — which are verifiable, and how each is worded.

---

## 8. What can proceed without missing content

- Case-study content architecture (MDX building blocks, typed `meta` at the
  consumption boundary) — structure only, no invented narrative.
- Image pipeline readiness (`public/` layout, `next/image` sizing conventions).
- SEO wiring that does not need the domain.

Items depending on content — Selected Work copy, previews, Scale figures,
About, Contact, Design System copy and every case study — stay blocked on the
inputs above.

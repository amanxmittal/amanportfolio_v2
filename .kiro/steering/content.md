---
inclusion: always
---

# Page Content & Copy

Source of truth: `IMPLEMENTATION_BLUEPRINT.md` §7-17, §28-30.

This file captures the approved copy and content structure for each section.
Treat the copy below as approved content, not placeholder — don't rewrite or
"improve" it without asking. Where the blueprint says content is illustrative
(e.g. Scale metrics), do not fabricate replacements.

## Navigation

Desktop items: `AM` · `WORK` · `THINK` · `BUILD` · `ABOUT` · `LET'S TALK`

`AM` acts as the home control (logo/home link).

Behaviour:
- Fixed/sticky, subtle, never visually dominates content
- Compacts after scrolling
- Backdrop blur after scrolling
- Subtle border after scrolling

Mobile: `AM` + menu button. Menu opens as a full-screen overlay. Keyboard
accessible, Escape closes it, focus must be managed correctly (trap focus in
overlay, return focus to trigger on close).

## Hero

Headline:

> DESIGNING
> PRODUCTS,
> SYSTEMS &
> EXPERIENCES
> AT SCALE.

Supporting statement:

> Product designer working across digital products, design systems and
> accessible experiences used at scale.

Rules:
- No résumé-style statistics in the hero.
- Hero occupies approximately one viewport.

## Signature hero interaction

Sequence: `DESIGNING → PRODUCTS → SYSTEMS → EXPERIENCES → AT SCALE`

As scrolling progresses, the typography transforms into a structured grid,
which becomes the visual transition into Selected Work.

Requirements: smooth, performant, interruptible, accessible, works on mobile,
reduced-motion fallback, must not block page rendering. Animation must never
be required to understand the content.

## Selected Work

Initial flagship projects: DigiLocker, UX4G, Entity Locker, Accessibility.

Do not assume every project uses the same case-study structure (see Case
Study Philosophy below).

Each project card communicates: project name, role, discipline, short value
proposition, visual, case-study link. Cards should feel editorial, not like
SaaS product cards.

## Philosophy

Primary statement:

> I DON'T DESIGN SCREENS.

Progressive statements:

> I design how people understand systems.
> How they navigate complexity.
> How they recover from mistakes.
> How experiences remain consistent across products.
> How interfaces work for people with different abilities.
> And how all of it works at scale.

Closing statement:

> That's what I design.

Keep this section predominantly typographic (minimal imagery/UI).

## Principles

Four principles, each with a one-line definition:

- **Clarity** — Reduce complexity without hiding it.
- **Systems** — Solve recurring problems systematically.
- **Accessibility** — Inclusion is part of the product, not an add-on.
- **Scale** — Design decisions should survive beyond a single screen.

## Scale

Dark visual section. Illustrative figures from the blueprint:

- 600M+ digital users
- 30+ ministries
- 20+ products/websites audited
- 50+ design-system pages

Only use verified figures in final content — confirm real numbers with the
user before publishing. Never invent or round up impact metrics.

## Design System section

Title:

> DESIGN IS A SYSTEM.

Interactive areas: `TOKENS` · `TYPE` · `COLOUR` · `COMPONENTS` · `PATTERNS` ·
`ACCESSIBILITY`

The interaction should demonstrate the relationship:
`Token → Component → Pattern → Product → Ecosystem`

This section exists to demonstrate design-system thinking, not merely to
display UI widgets.

## Playground

Purpose: show experimentation outside formal case studies.

Potential categories: AI UX, Motion, Design Tokens, Accessibility,
Prototyping, Interaction experiments, Figma experiments.

Content should be easy to add later through MDX/content files — build the
content model to support incremental additions, not a fixed hardcoded list.

## About

Positioning:

> Product designer focused on creating clear, accessible and scalable digital
> experiences.

Include: current focus, career timeline, design interests, tools/areas of
expertise. Keep concise — this is not a résumé page.

## Contact

Heading:

> HAVE A GOOD PROBLEM?

Supporting:

> Let's figure it out.

Links: Email, LinkedIn, Resume.

Avoid a contact form unless there's a clear future need.

## Content architecture

- Use MDX for case studies.
- Case studies are data/content-driven, not hardcoded inside page components.
- Individual case studies may have different structures — don't force a
  single template.
- The content model must support custom sections and components per case
  study.

## Case study philosophy

Each case study is an individual editorial experience. Possible structures
(pick per project, don't force one universally):

- Context → Problem → Decision → Solution → Impact
- Context → System → Adoption → Impact
- Challenge → Exploration → Prototype → Outcome
- Problem → Flow → Interaction → System

Never fabricate: metrics, research, user interviews, outcomes, adoption, or
business impact for any case study.

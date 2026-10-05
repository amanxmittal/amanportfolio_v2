---
inclusion: always
---

# Product Direction

Source of truth: `IMPLEMENTATION_BLUEPRINT.md` at the repo root. If this steering file
and the blueprint ever disagree, the blueprint wins — flag the conflict and ask
before proceeding.

## What this is

A modern, highly performant personal portfolio for Aman Mittal, Product Designer.

## What it must communicate

- Product design capability
- UX and interaction design
- Design-system expertise
- Accessibility expertise
- Product thinking
- Experience designing at significant scale
- Ability to work across complex digital ecosystems
- Curiosity around AI, emerging interfaces and technology

The website itself must demonstrate strong UX — the site is part of the pitch, not
just a container for it.

## Creative direction (approved)

**Systems × Scale + Designer × Builder**

Positioning statement:

> Product designer building products, systems and experiences at scale.

## Tone: must feel

Editorial, precise, systematic, modern, experimental, calm, fast, accessible.

## Tone: must NOT feel

- A generic UX portfolio template
- A developer portfolio
- A Dribbble clone
- An Awwwards-style animation showcase
- A government website
- An overly animated landing page

## Core principle

> Structured underneath. Expressive on top.

Every design and implementation decision should trace back to this: a rigorous,
systematic foundation (grid, tokens, type scale, content model) with expressive,
editorial execution on top of it — never the reverse (i.e. never flashy surface
effects papering over weak structure).

## Visual identity

- Editorial typography
- Strong grid
- Large expressive headlines
- Near-black and warm-white foundation
- Electric blue accent
- Minimal UI chrome
- Large product imagery
- Carefully selected motion
- System-oriented visual language

## Content integrity rules (non-negotiable)

- Never invent portfolio content, project details, or copy beyond what's provided
  or approved.
- Never invent metrics, statistics, research findings, user interviews, adoption
  numbers, or business impact. Only verified figures may appear (see Scale section
  in the blueprint).
- Never redesign or reinterpret the approved UX/creative direction without asking
  first. This steering file and the blueprint represent an approved direction, not
  a draft to iterate on unilaterally.

## Agent hierarchy (for context, not enforcement)

- ChatGPT: product/design/architecture direction, specification reconciliation and decision support
- Aman (the user): final creative, product and governance authority
- Kiro: specification and task-definition agent
- Claude Code: primary implementation agent for approved/frozen milestones
- Claude Code (review mode): independent engineering reviewer, debugger and specialist implementation support when explicitly asked

Claude Code operates in two modes — implementation (implements an approved/frozen
specification) and review (independently audits existing implementation when
explicitly asked).

No agent may independently redefine the approved product direction.

## Definition of done

A feature is not complete merely because it renders. It must satisfy:

- Visual direction
- Responsive behaviour
- Accessibility
- Performance
- Semantic structure
- Maintainability
- TypeScript correctness
- Lint cleanliness
- Production build success
- Content integrity (no fabricated content/metrics)

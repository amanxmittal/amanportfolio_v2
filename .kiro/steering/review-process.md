# Review & Decision Process

## Authority

The approved portfolio direction is defined by:

1. IMPLEMENTATION_BLUEPRINT.md
2. .kiro/steering/product.md
3. .kiro/steering/design-system.md
4. .kiro/steering/content.md
5. .kiro/steering/structure.md
6. .kiro/steering/tech.md

If an implementation decision conflicts with these sources, stop and flag
the conflict rather than silently changing the direction.

## Agent roles

ChatGPT:
Product, design and architecture direction and reconciliation.

Aman:
Final product, design and governance authority.

Kiro:
Specification and task definition — owns requirements, design and task
decomposition.

Claude Code:
Primary implementation agent for approved milestones; independent
engineering reviewer and debugger when explicitly operating in review mode.

### Role split

Claude Code has two modes, and keeping both is deliberate — the reviewer
capability is preserved, not replaced:

- **Kiro:** specification and task definition.
- **Claude Code (implementation mode):** primary implementation of an
  approved/frozen specification.
- **Claude Code (review mode):** independent engineering reviewer and
  debugger, entered only when specifically asked to audit Kiro's
  implementation.
- **Aman:** final product/design/governance authority.
- **ChatGPT:** product/design/architecture direction and reconciliation.

## Implementation behaviour

Build incrementally.

Do not implement the entire portfolio in one task.

Prefer vertical slices that can be reviewed in the browser.

After each meaningful feature:

1. Validate visual implementation.
2. Validate responsive behaviour.
3. Validate accessibility.
4. Validate performance implications.
5. Run typecheck.
6. Run lint.
7. Run production build when appropriate.

## Design decisions

Do not independently redesign approved UX.

If an implementation detail is ambiguous but does not affect product
direction, choose the simplest maintainable solution.

If a decision affects:

- visual identity
- information architecture
- navigation
- interaction model
- animation concept
- content
- technology stack
- major dependency

stop and ask for approval.

## Dependencies

Do not add a major dependency without explaining:

- why it is needed
- why existing capabilities are insufficient
- its performance implications
- whether a browser-native solution is possible

## Animation

Animation should be implemented progressively.

First establish the static experience.

Then implement interaction.

Then optimize.

Do not allow animation to delay content rendering.

## Case studies

Do not force all case studies into one template.

The content model should support project-specific layouts.

Never invent:

- metrics
- research
- user interviews
- outcomes
- adoption
- business impact

## Scope control

Do not modify unrelated files.

Do not create future routes or components merely because they are
listed in the blueprint.

Implement only what is required for the current task.
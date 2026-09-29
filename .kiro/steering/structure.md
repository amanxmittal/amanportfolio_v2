---
inclusion: always
---

# Project Structure & Routes

Source of truth: `IMPLEMENTATION_BLUEPRINT.md` §4-6, §27.

## Directory structure (target)

```
app/
  layout.tsx
  page.tsx
  globals.css

  work/
    page.tsx
    [slug]/
      page.tsx

  think/
    page.tsx

  build/
    page.tsx

  about/
    page.tsx

components/
  layout/        Header, Footer, Container, Grid
  typography/    Display, Heading, Body, Label
  navigation/    DesktopNav, MobileNav
  hero/          Hero, HeroTransition
  work/          ProjectCard, ProjectGrid, ProjectMeta, ProjectHero
  sections/      Philosophy, Principles, Scale, DesignSystem, Playground, About, Contact
  motion/        Reveal, ImageReveal, TextTransform, ScrollProgress
  system/        TokenPlayground, ComponentPreview, PatternPreview
  ui/            Button, Link, Image

content/
  work/
    digilocker/
      index.mdx
      assets/
    ux4g/
      index.mdx
      assets/
    entity-locker/
      index.mdx
      assets/
  playground/

lib/
  content/
  metadata/
  utils/

public/
  images/
  icons/
  fonts/

tests/
```

Follow this layout as new files are added. Don't scaffold directories that
aren't needed yet (e.g. `playground/` route, `/uses`, `/now`) — see routes below.

## Routes

Primary routes (build these):

- `/`
- `/work`
- `/work/[slug]`
- `/think`
- `/build`
- `/about`

Potential future routes — do not create until explicitly requested:

- `/playground`
- `/uses`
- `/now`

Case-study URLs (fixed slugs):

- `/work/digilocker`
- `/work/ux4g`
- `/work/entity-locker`

## Route intent

/think
A space for essays, observations, design thinking and selected writing.

/build
A space for experiments, prototypes, design-system explorations,
AI UX experiments and interaction work.

These routes should remain lightweight and content-driven.
Do not create unnecessary functionality until content exists.

## Homepage section order (approved, do not reorder without asking)

1. Navigation
2. Hero
3. Signature transition
4. Selected Work
5. Philosophy
6. Principles
7. Scale
8. Design System
9. Playground
10. About
11. Contact
12. Footer

## Implementation phase order

When building from scratch, follow this sequence (blueprint §34):

1. Project setup
2. Design tokens
3. Global typography/layout
4. Navigation
5. Hero
6. Signature transition
7. Selected Work
8. Philosophy
9. Principles + Scale
10. Design System playground
11. Playground
12. About + Contact
13. MDX case-study infrastructure
14. First real case study
15. Accessibility audit
16. Performance optimization
17. SEO
18. Final visual polish
19. Production deployment

Don't jump ahead in this sequence (e.g. building the Design System playground
before Navigation exists) unless explicitly asked to.

## SEO baseline

Every route must define:

- title
- description
- canonical URL
- Open Graph metadata
- social preview image where appropriate

Generate `sitemap` and `robots` metadata. Use semantic HTML throughout.

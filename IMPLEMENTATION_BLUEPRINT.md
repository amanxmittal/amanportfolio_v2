# Aman Mittal — Portfolio

## Implementation Blueprint v1.0

## 1. Product Objective

Build a modern, highly performant personal portfolio for Aman Mittal, Product Designer.

The portfolio should communicate:

* Product design capability
* UX and interaction design
* Design-system expertise
* Accessibility expertise
* Product thinking
* Experience designing at significant scale
* Ability to work across complex digital ecosystems
* Curiosity around AI, emerging interfaces and technology

The website itself must demonstrate strong UX.

The portfolio should feel:

* Editorial
* Precise
* Systematic
* Modern
* Experimental
* Calm
* Fast
* Accessible

It must NOT feel like:

* A generic UX portfolio template
* A developer portfolio
* A Dribbble clone
* An Awwwards-style animation showcase
* A government website
* An overly animated landing page

Core principle:

> Structured underneath. Expressive on top.

---

# 2. Approved Creative Direction

Creative direction:

## Systems × Scale + Designer × Builder

Positioning:

> Product designer building products, systems and experiences at scale.

Visual identity:

* Editorial typography
* Strong grid
* Large expressive headlines
* Near-black and warm-white foundation
* Electric blue accent
* Minimal UI chrome
* Large product imagery
* Carefully selected motion
* System-oriented visual language

---

# 3. Technology

Use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Motion for React
* MDX
* Lucide
* Next/Image
* Vercel

Optional:

* GSAP

Do NOT add GSAP unless a specific interaction requires capabilities that Motion cannot provide cleanly.

Do NOT introduce:

* Three.js
* React Three Fiber
* WebGL
* Lenis
* Lottie
* Framer Motion if Motion for React is already selected
* Large UI component libraries

unless there is a documented design or technical reason.

Prefer browser-native CSS and APIs where practical.

---

# 4. Architecture

Use the Next.js App Router.

Prefer Server Components.

Use Client Components only when interactivity requires them.

Suggested structure:

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
layout/
Header
Footer
Container
Grid

typography/
Display
Heading
Body
Label

navigation/
DesktopNav
MobileNav

hero/
Hero
HeroTransition

work/
ProjectCard
ProjectGrid
ProjectMeta
ProjectHero

sections/
Philosophy
Principles
Scale
DesignSystem
Playground
About
Contact

motion/
Reveal
ImageReveal
TextTransform
ScrollProgress

system/
TokenPlayground
ComponentPreview
PatternPreview

ui/
Button
Link
Image

content/
work/
digilocker/
index.mdx
assets/

```
ux4g/
  index.mdx
  assets/

entity-locker/
  index.mdx
  assets/
```

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

---

# 5. Routes

Primary routes:

/
/work
/work/[slug]
/think
/build
/about

Potential future routes:

/playground
/uses
/now

Do not create unnecessary routes initially.

---

# 6. Homepage

Approved hierarchy:

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

---

# 7. Navigation

Desktop:

AM
WORK
THINK
BUILD
ABOUT
LET'S TALK

AM is the home control.

Navigation:

* fixed/sticky
* subtle
* compact after scrolling
* backdrop blur after scrolling
* subtle border
* never visually dominates content

Mobile:

AM + menu button.

Mobile navigation opens as a full-screen overlay.

Keyboard accessible.

Escape closes the menu.

Focus must be managed correctly.

---

# 8. Hero

Hero headline:

> DESIGNING
> PRODUCTS,
> SYSTEMS &
> EXPERIENCES
> AT SCALE.

Supporting statement:

> Product designer working across digital products, design systems and accessible experiences used at scale.

Do not place résumé-style statistics in the hero.

Hero should occupy approximately one viewport.

---

# 9. Signature Hero Interaction

Hero interaction:

DESIGNING
→ PRODUCTS
→ SYSTEMS
→ EXPERIENCES
→ AT SCALE

As scrolling progresses, typography transforms into a structured grid.

The resulting grid becomes the visual transition into Selected Work.

Requirements:

* smooth
* performant
* interruptible
* accessible
* works on mobile
* reduced-motion fallback
* must not block page rendering

Animation must never be required to understand the content.

---

# 10. Selected Work

Initial flagship projects:

1. DigiLocker
2. UX4G
3. Entity Locker
4. Accessibility

Do not assume all projects use the same case-study structure.

Project cards should feel editorial rather than like SaaS cards.

Each project should communicate:

* project
* role
* discipline
* short value proposition
* visual
* case-study link

---

# 11. Philosophy

Primary statement:

> I DON'T DESIGN SCREENS.

Then progressively communicate:

> I design how people understand systems.

> How they navigate complexity.

> How they recover from mistakes.

> How experiences remain consistent across products.

> How interfaces work for people with different abilities.

> And how all of it works at scale.

Final statement:

> That's what I design.

Keep this section predominantly typographic.

---

# 12. Principles

Four principles:

## Clarity

Reduce complexity without hiding it.

## Systems

Solve recurring problems systematically.

## Accessibility

Inclusion is part of the product, not an add-on.

## Scale

Design decisions should survive beyond a single screen.

---

# 13. Scale Section

Dark visual section.

Initial information:

600M+
digital users

30+
ministries

20+
products/websites audited

50+
design-system pages

Only use verified figures in the final content.

Do not invent impact metrics.

---

# 14. Design System Section

Title:

> DESIGN IS A SYSTEM.

Interactive areas:

TOKENS
TYPE
COLOUR
COMPONENTS
PATTERNS
ACCESSIBILITY

Interaction should demonstrate the relationship:

Token
→ Component
→ Pattern
→ Product
→ Ecosystem

This section is intended to demonstrate design-system thinking rather than merely display UI.

---

# 15. Playground

Purpose:

Show experimentation outside formal case studies.

Potential categories:

* AI UX
* Motion
* Design Tokens
* Accessibility
* Prototyping
* Interaction experiments
* Figma experiments

Playground content should be easy to add later through MDX/content files.

---

# 16. About

Keep concise.

Positioning:

> Product designer focused on creating clear, accessible and scalable digital experiences.

Include:

* current focus
* career timeline
* design interests
* tools/areas of expertise

Do not turn the page into a résumé.

---

# 17. Contact

Heading:

> HAVE A GOOD PROBLEM?

Supporting:

> Let's figure it out.

Links:

* Email
* LinkedIn
* Resume

Avoid a contact form unless there is a clear future need.

---

# 18. Typography

Primary display font:

Space Grotesk

Secondary:

Inter

Use variable font files where possible.

Do not load unnecessary font weights.

Initial type scale:

Display XL: 120px
Display L: 88px
Display M: 64px
Heading XL: 48px
Heading L: 40px
Heading M: 32px
Heading S: 24px
Body L: 20px
Body M: 16px
Body S: 14px
Caption: 12px

Use responsive clamp() values rather than rigid desktop/mobile jumps.

Mobile Display XL target: approximately 56px.

---

# 19. Colour

Foundation:

Canvas:
#F5F5F2

Surface:
#FFFFFF

Ink:
#111111

Muted:
#6B6B68

Border:
#D9D9D4

Accent:

#3155FF

All colours must be tokens.

Do not introduce arbitrary colours inside components.

Semantic colours should be added only where necessary.

---

# 20. Grid

Desktop:

12 columns

Tablet:

8 columns

Mobile:

4 columns

Maximum content width:

1440px

Page margin:

clamp(20px, 4vw, 64px)

The grid is a guide, not a constraint.

Some typography and imagery may intentionally break the grid.

---

# 21. Spacing

Use an 8-point foundation.

Base values:

4
8
12
16
24
32
40
48
64
80
96
128
160
192

Large editorial sections may use larger values where visually justified.

Avoid arbitrary one-off spacing values.

---

# 22. Radius

Small:

8px

Default:

12px

Large media:

20px

Pills:

999px

Avoid excessive card treatment.

---

# 23. Motion

Motion must communicate hierarchy, continuity or interaction.

Timing:

Instant:
100ms

Fast:
200ms

Standard:
400ms

Slow:
700ms

Cinematic:
1000–1400ms

Cinematic motion is reserved for major storytelling moments.

Default easing:

ease-out

Use custom easing only where physically justified.

---

# 24. Motion Principles

1. Content must work without animation.
2. Never animate everything simultaneously.
3. Do not delay content for animation.
4. Never use perpetual motion without purpose.
5. Respect prefers-reduced-motion.
6. Animations must remain interruptible.
7. Avoid excessive parallax.
8. Avoid scroll hijacking.
9. Keep animations GPU-friendly.
10. Do not use animation to compensate for weak information architecture.

---

# 25. Accessibility

Target:

WCAG 2.2 AA.

Requirements:

* semantic HTML
* correct heading hierarchy
* keyboard navigation
* visible focus states
* accessible names
* appropriate ARIA only when necessary
* colour contrast
* reduced motion
* alt text
* logical tab order
* skip navigation
* accessible mobile navigation
* adequate touch targets
* no hover-only information
* no colour-only information

The portfolio itself should demonstrate accessibility expertise.

---

# 26. Performance

Performance is a first-class requirement.

Priorities:

* Server Components by default
* minimal client JavaScript
* optimized images
* responsive image sizes
* AVIF/WebP
* SVG for diagrams/icons
* minimal font weights
* lazy-load below-the-fold media
* avoid unnecessary third-party scripts
* avoid large dependencies
* avoid hydration where unnecessary

Target excellent Core Web Vitals:

* LCP
* CLS
* INP

Do not add loading screens merely for visual effect.

---

# 27. SEO

Every route must have:

* title
* description
* canonical URL
* Open Graph metadata
* social preview image where appropriate

Case-study URLs:

/work/digilocker
/work/ux4g
/work/entity-locker

Generate sitemap and robots metadata.

Use semantic HTML.

---

# 28. Content Architecture

Use MDX.

Case studies should be data/content driven rather than hardcoded inside page components.

Individual case studies may have different structures.

Do not force every case study into:

Problem → Research → Wireframe → UI → Impact.

The content model should support custom sections and components.

---

# 29. Image Architecture

Use:

* AVIF/WebP for photographic/UI raster content
* SVG for diagrams and vector illustrations
* optimized responsive images
* explicit image dimensions
* meaningful alt text

Never upload unnecessarily large Figma exports.

---

# 30. Case Study Philosophy

Each case study is an individual editorial experience.

Possible structures include:

Context → Problem → Decision → Solution → Impact

Context → System → Adoption → Impact

Challenge → Exploration → Prototype → Outcome

Problem → Flow → Interaction → System

The structure should be selected according to the actual project.

Never fabricate:

* metrics
* research
* user interviews
* outcomes
* adoption
* business impact

---

# 31. Engineering Principles

Prefer:

* simple components
* clear naming
* composition
* typed content
* reusable primitives
* server-first architecture
* progressive enhancement

Avoid:

* premature abstraction
* giant components
* deeply nested conditionals
* unnecessary state
* duplicated styling
* magic numbers
* unnecessary dependencies

---

# 32. Testing

At minimum:

* TypeScript check
* ESLint
* production build
* responsive validation
* keyboard navigation
* reduced-motion validation
* accessibility audit
* image optimization check
* link validation

Before production:

* Lighthouse/PageSpeed
* mobile testing
* desktop testing
* major browser testing

---

# 33. Git Strategy

Use small logical commits.

Examples:

feat: create portfolio shell

feat: add hero experience

feat: add selected work section

feat: add philosophy section

feat: add design system playground

fix: improve mobile navigation

perf: optimize project imagery

a11y: improve keyboard navigation

Do not make one giant commit containing the entire portfolio.

---

# 34. Implementation Order

PHASE 1
Project setup

PHASE 2
Design tokens

PHASE 3
Global typography/layout

PHASE 4
Navigation

PHASE 5
Hero

PHASE 6
Signature transition

PHASE 7
Selected Work

PHASE 8
Philosophy

PHASE 9
Principles + Scale

PHASE 10
Design System playground

PHASE 11
Playground

PHASE 12
About + Contact

PHASE 13
MDX case-study infrastructure

PHASE 14
First real case study

PHASE 15
Accessibility audit

PHASE 16
Performance optimization

PHASE 17
SEO

PHASE 18
Final visual polish

PHASE 19
Production deployment

---

# 35. Agent Behaviour

The coding agent must:

1. Read project steering instructions before implementation.
2. Never redesign approved UX without asking.
3. Never invent portfolio content.
4. Never invent metrics.
5. Prefer existing components before creating new ones.
6. Prefer CSS before adding a dependency.
7. Keep Server Components server-side where possible.
8. Validate responsive behaviour.
9. Validate accessibility.
10. Validate performance.
11. Run tests/checks after meaningful changes.
12. Explain significant architectural decisions.
13. Keep changes focused.
14. Avoid modifying unrelated files.
15. Ask for approval before introducing major dependencies.

---

# 36. Definition of Done

A feature is not complete merely because it renders.

It must satisfy:

* visual direction
* responsive behaviour
* accessibility
* performance
* semantic structure
* maintainability
* TypeScript
* lint
* production build
* content integrity

---

# 37. Agent hierarchy

ChatGPT:

Product/design direction

You:

Final creative authority

Kiro:

Primary implementation and structured development

Claude Code:

Independent engineering review, debugging and targeted implementation

No agent may independently redefine the approved product direction.

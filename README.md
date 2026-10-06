# Aman Mittal — Portfolio

A modern, highly performant personal portfolio for Aman Mittal, Product
Designer. The site is itself part of the pitch: it must demonstrate strong UX,
accessibility, and performance — not merely describe them.

Core principle: **structured underneath, expressive on top** — a rigorous,
systematic foundation (grid, tokens, type scale, content model) with editorial
execution on top of it.

> **Status:** The **Foundation** milestone is complete and frozen. The
> **Portfolio Experience** milestone (the homepage experience) is specified
> under `.kiro/specs/portfolio-experience/` and not yet implemented. Routes
> currently render provisional placeholder content.

## Tech stack

| Area | Choice | Pinned version |
|---|---|---|
| Framework | Next.js (App Router) | `16.3.7` |
| UI | React / React DOM | `19.3.0` |
| Language | TypeScript (strict) | `6.0.3` |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | `4.3.3` |
| Animation | Motion for React (`motion`) | `13.4.5` |
| Content | MDX (`@next/mdx` + `@mdx-js/*`) | `16.3.7` / `3.1.1` |
| Icons | `lucide-react` | `1.48.0` |
| Linting | ESLint 9 (flat config) + `eslint-config-next` | `9.39.5` / `16.3.7` |
| Fonts | Space Grotesk (display) + Inter (body), via `next/font` | — |
| Images | `next/image` | — |
| Deploy target | Vercel | — |

Server Components by default; client components are used only where
interactivity genuinely requires them, pushed to the smallest leaf.

Explicitly **not** used (per project policy): GSAP, Three.js / R3F / WebGL,
Lenis, Lottie, `framer-motion` as a separate package, large UI component
libraries, and state-management libraries. See `.kiro/steering/tech.md`.

## Requirements

- **Node.js `>= 20.9`** (Node 22 LTS preferred). Enforced via the `engines`
  field in `package.json`.
- npm (the repo tracks `package-lock.json`).

## Getting started

```bash
npm install
npm run dev        # start the dev server at http://localhost:3000
```

### Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev` | Local development server |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Serve the production build |
| `npm run lint` | `eslint .` | Lint (ESLint CLI via flat `eslint.config.mjs`) |

Type-check without emitting:

```bash
npx tsc --noEmit
```

> Linting uses the ESLint CLI (`eslint .`), not `next lint` (removed in
> Next.js 16) and not a legacy `.eslintrc.*` file.

### Environment

- `NEXT_PUBLIC_SITE_URL` — the site's base URL, used for canonical and Open
  Graph metadata. Falls back to `http://localhost:3000` when unset. The final
  production domain is not yet configured.

## Routes

| Route | Status |
|---|---|
| `/` | Home (provisional placeholder) |
| `/work` | Selected work index (provisional) |
| `/work/[slug]` | Case-study page — statically generated; `_example` proves the pipeline; unknown slugs 404 |
| `/think` | Essays/writing (provisional) |
| `/build` | Experiments/prototypes (provisional) |
| `/about` | About (provisional) |

`sitemap.xml` and `robots.txt` are generated via Next.js metadata-file
conventions. Future routes (`/playground`, `/uses`, `/now`) are intentionally
not created yet.

## Project structure

```
app/                 App Router: layout, routes, globals.css, sitemap.ts, robots.ts
components/
  layout/            Container, Grid, Header, HeaderShell, Footer
  typography/        Display, Heading, Body, Label (+ scale.ts)
  navigation/        DesktopNav, MobileNav (+ navItems.ts)
  hero/              Hero, HeroReveal
  work/              ProjectCard, ProjectGrid, ProjectMeta
  sections/          Philosophy, Principles, Scale, DesignSystem, About, Contact
  motion/            Reveal
  ui/                SkipLink
content/
  work/_example/     Placeholder MDX entry proving the content pipeline
lib/
  content/           Typed content models + case-study loaders
  metadata/          Shared SEO metadata helpers (site.ts, createMetadata.ts)
  utils/             cn() classnames helper
mdx-components.tsx   Root MDX component mapping (required by @next/mdx)
```

## Design system

All colour, type, spacing, radius, and motion values come from tokens defined
in `app/globals.css` (Tailwind v4 `@theme` + `:root`). Components never use
arbitrary one-off values.

- **Colour:** Canvas `#F5F5F2`, Surface `#FFFFFF`, Ink `#111111`, Muted
  `#6B6B68`, Border `#D9D9D4`, Accent `#3155FF`.
- **Type scale:** Display XL→Caption, responsive via `clamp()`
  (`components/typography/scale.ts`), consumed through the `Display`,
  `Heading`, `Body`, and `Label` primitives.
- **Spacing:** 8-point scale mapped onto Tailwind's default numeric utilities
  (the `--spacing-*` namespace is deliberately not redefined).
- **Radius:** 8 / 12 / 20 / 999px.
- **Motion:** Instant 100ms, Fast 200ms, Standard 400ms, Slow 700ms, Cinematic
  1000–1400ms; default easing `ease-out`. Durations are `:root` custom
  properties consumed via `duration-(--duration-standard)`.

See `.kiro/steering/design-system.md` for the authoritative token reference.

## Accessibility

Target: **WCAG 2.2 AA**. The portfolio treats accessibility defects with the
same severity as visual or functional ones. Baseline practices: semantic HTML
and landmarks, one `h1` per page with correct heading order, full keyboard
operability, a visible non-colour-only focus indicator, a skip link, accessible
mobile navigation (focus trap, Escape to close, focus restored to the trigger),
`prefers-reduced-motion` support, meaningful alt text, and 44×44 mobile touch
targets.

Full WCAG validation requires manual assistive-technology testing and expert
review — automated checks and this codebase support that process but do not
replace it.

## Verification

Before a change is considered done:

```bash
npx tsc --noEmit    # clean
npm run lint        # clean
npm run build       # succeeds
```

Plus: responsive check (mobile/tablet/desktop), keyboard-navigation check,
reduced-motion check, accessibility spot-check, image-optimization check, and
link validation. See `.kiro/steering/tech.md` for the full list.

## Governance & how this project is built

This project is spec-driven. The approved direction is defined, in order, by:

1. `IMPLEMENTATION_BLUEPRINT.md`
2. The approved Kiro Spec for the active milestone (`.kiro/specs/<milestone>/`)
3. Steering files (`.kiro/steering/`: `product.md`, `design-system.md`,
   `content.md`, `structure.md`, `tech.md`, `review-process.md`)
4. `CLAUDE.md` — agent operating guidance

Agent roles (`.kiro/steering/review-process.md`):

- **Aman** — final creative, product, and governance authority.
- **ChatGPT** — product/design/architecture direction and reconciliation.
- **Kiro** — specification and task definition (requirements, design, tasks).
- **Claude Code** — primary implementation agent for approved/frozen
  milestones; independent engineering reviewer and debugger when explicitly
  operating in review mode.

Content integrity is non-negotiable: project details, metrics, research,
outcomes, and contact details are never fabricated — only approved or verified
content ships. Illustrative figures must be confirmed before publishing.

## Specs

- `.kiro/specs/portfolio-foundation/` — Foundation milestone (complete, frozen).
- `.kiro/specs/portfolio-experience/` — Portfolio Experience milestone
  (specified; implementation pending decision resolution).

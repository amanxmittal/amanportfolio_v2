---
inclusion: always
---

# Technology & Engineering Standards

Source of truth: `IMPLEMENTATION_BLUEPRINT.md` §3, §31-35.

## Stack (approved)

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Motion for React (the library formerly known as Framer Motion, now `motion`)
- MDX
- Lucide (icons)
- `next/image`
- Vercel (deployment target)

Optional: GSAP — only if a specific interaction needs capabilities Motion for
React cannot provide cleanly. Document the reason when introducing it.

## Explicitly disallowed (unless a documented design/technical reason is agreed first)

- Three.js / React Three Fiber / WebGL
- Lenis
- Lottie
- Framer Motion as a separate package (Motion for React is already the choice —
  don't have both)
- Large UI component libraries (MUI, Chakra, Ant Design, shadcn full install, etc.)

Prefer browser-native CSS and Web APIs over a library when practical (e.g. CSS
`scroll-timeline`, native `<dialog>`, `prefers-reduced-motion`, `clamp()`).

## Dependency policy

- Ask for approval before introducing any new major dependency.
- Do not add any dependency solely for visual polish when the same result
can reasonably be achieved with CSS, Web APIs, or existing dependencies.
- Prefer an existing component before creating a new one.
- Prefer CSS before adding a dependency.
- Pin exact/reasonable versions; avoid unnecessary transitive bloat.
- Flag anything that looks like an unusual or typosquatted package name.

## Architecture

- Use the Next.js App Router.
- Prefer Server Components by default.
- Use Client Components only when interactivity genuinely requires them
  (e.g. hero scroll interaction, mobile nav overlay, design-system playground
  widgets).
- Keep hydration and client JS minimal — this is a performance requirement, not
  a style preference.

## Engineering principles

Prefer:
- Simple components
- Clear naming
- Composition over configuration
- Typed content (typed MDX frontmatter / content models)
- Reusable primitives
- Server-first architecture
- Progressive enhancement

Avoid:
- Premature abstraction
- Giant components
- Deeply nested conditionals
- Unnecessary client state
- Duplicated styling (use tokens — see `design-system.md`)
- Magic numbers (use the spacing/type/motion scales)
- Unnecessary dependencies

## Testing & verification

At minimum, before presenting a change as done:
- TypeScript check passes
- ESLint passes
- Production build succeeds
- Responsive behaviour validated
- Keyboard navigation validated
- Reduced-motion fallback validated
- Accessibility spot-check
- Image optimization check
- Link validation

Before production deployment, additionally:
- Lighthouse/PageSpeed pass
- Mobile + desktop manual testing
- Major browser testing

## Git strategy

- Small, logical commits — never one giant commit for the whole portfolio.
- Conventional-style messages matching the blueprint's examples:
  `feat: add hero experience`, `fix: improve mobile navigation`,
  `perf: optimize project imagery`, `a11y: improve keyboard navigation`.
- Only commit when explicitly asked; stage specific files, not blanket `git add`.

## Agent behaviour (binding)

1. Read steering before implementing.
2. Never redesign approved UX without asking.
3. Never invent portfolio content or metrics.
4. Prefer existing components before creating new ones.
5. Prefer CSS before adding a dependency.
6. Keep Server Components server-side where possible.
7. Validate responsive behaviour, accessibility, and performance for every
   feature.
8. Run checks (typecheck/lint/build) after meaningful changes.
9. Explain significant architectural decisions.
10. Keep changes focused; avoid touching unrelated files.
11. Ask for approval before introducing major dependencies.

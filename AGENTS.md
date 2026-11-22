# AGENTS.md

## Purpose

This repo is a design-sensitive Next.js portfolio/blog. Treat styling, spacing, typography, and route behavior as product decisions, not cleanup details.

When making UI changes:

- preserve the existing visual language of the route you are editing
- prefer extending shared tokens and primitives over adding one-off values
- keep layouts bounded and intentional across mobile, tablet, and desktop
- verify visible behavior, not just typecheck/build output

## Repo Shape

- `src/app/` contains App Router entrypoints and route wrappers
- `src/components/` contains shared (`Navigation`, `Footer`, `KertasActionList`) and route-level React components
- `src/data/experience.ts` is the shared source of truth for career history, skills, and selected projects across `/`, `/about`, and `/resume`
- `src/styles/_kertas.scss` defines the **Kertas & Dakwat** warm paper (`#faf8f5`, `#ffffff`, `#eeece7`) and bistre ink (`#1d1a16`, `#45423d`, `#6b6760`) design tokens, frosted pill mixins, and `840px` editorial spine helpers
- `src/styles/_variables.scss` holds core breakpoints/spacing tokens imported by preserved routes (`/gallery`, `/pantai-timor`) and `@forward`s `_kertas.scss`
- `src/styles/_mixins.scss` contains the shared container and breakpoint mixins
- `src/app/globals.scss` emits `:root` Kertas tokens, base typography (`:where()` low-specificity rules), focus rings, native modal `dialog` containment, `.skip-link`, Lenis rules, and reduced-motion fallbacks
- `src/app/globals.css` contains Tailwind utility-layer additions and `@layer base` resets (no OS dark-mode color-scheme inversion)

## Styling Rules

- Reuse the existing tokens in `src/styles/_kertas.scss` (for the main Kertas & Dakwat portfolio `/`, `/about`, `/resume`, `Navigation`, `Footer`) and `src/styles/_variables.scss` (for preserved routes) before introducing new colors, spacing values, shadows, radii, or transition timings.
- Keep frosted glass (`--pad-glass-fill` / `--pad-glass-dark` for pinned top nav pills, `--pad-glass-card-fill` via `kertas-glass-card` for `KertasActionList` grouped action cards) scoped to those shared primitives.
- Reuse the shared breakpoint and container mixins from `src/styles/_mixins.scss` instead of inventing route-local breakpoint logic.
- Use the font variables already wired in `src/app/layout.tsx` (`Caudex` via `--font-kertas-serif` / `@include kertas-heading` for large display and section headers across `/`, `/about`, `/resume`, and `/gallery` — `700` bold with `400` italic `em` emphasis — plus `Navigation` menu heading and `Footer` tagline; `Jost` via `--font-kertas-sans` across `/about`, `/resume`, `Navigation`, `Footer`, and `Kertas` controls/metadata; `Inter` via `--font-sans` for `/` home body copy/actions, `KertasActionList`, and `/gallery` UI/body text; route-local typography preserved on `/pantai-timor`). Do not introduce ad hoc font stacks in component code unless the route already requires a deliberate exception.
- Prefer SCSS modules or route-local component styling for reusable sections. Use global CSS only when the behavior truly needs global reach.
- Avoid mixing several styling systems inside a single component without a clear reason. This repo already uses SCSS, CSS modules, Tailwind utilities, and some inline motion-driven styles; add new styling in the smallest consistent layer possible.
- Do not add arbitrary visual values when an existing token is close enough. If a new token is necessary, add it centrally.

## Layout Constraints

- Keep horizontal overflow clipped (`overflow-x: clip`) unless the route explicitly owns a horizontal storytelling pattern.
- Preserve the centered `--column: 840px` editorial spine (`68ch` prose measure) across `/`, `/about`, and `/resume`; use the `container` mixin or `--footer-width: 1120px` for wide navigation/footer framing.
- Treat mobile as a first-class layout, not a later shrink pass. Check spacing, `44px` tap targets, sticky behavior, and safe-area handling on narrow screens.
- Use `100svh`/`100dvh`/safe-area-aware patterns where the surrounding shell already relies on them.
- Preserve the Kertas & Dakwat light editorial system on `/` and `/about`, while maintaining the dark cinematic/photobook systems on `/gallery` (`data-theme="dark"` triggering dark chrome in `Navigation` and `Footer`) and `/pantai-timor` (bespoke route shell).

## Route-Specific Guidance

### `/pantai-timor`

- Treat this route as a bespoke experience with its own scroll, overlay, and motion behavior.
- Check both the app-route implementation under `src/app/pantai-timor/` and the modular counterpart under `src/components/pantai-timor/` when touching shared Pantai Timor behavior.
- Preserve the route’s dark coastal/editorial system. Avoid generic modal chrome, generic cards, or dashboard-like spacing.
- For lightbox and scrolling bugs, visible browser behavior is the real acceptance criterion.

### `/terengganu`

- Preserve the photobook feel and fixed/sticky composition.
- Be careful with wrappers, transforms, and overflow changes because route-shell behavior can break the experience even when component code looks correct.

## Component Practices

- Keep components thin when they are route wrappers; move large route-specific UI into dedicated components.
- Prefer explicit props and clear section boundaries over hidden styling side effects.
- Keep motion purposeful. Use animation to support reading flow, transitions, and depth, not to decorate every element.
- Avoid local hacks that fight the app shell. If a component needs unusual scroll or overlay behavior, inspect the route template/layout first.

## Design-System Enforcement

Before shipping a styling change, check:

- Are colors, typography, spacing, and transitions coming from shared tokens or an intentional route-level system?
- Does the component align with the route’s existing visual language?
- Are content widths, gutters, and section spacing consistent with nearby sections?
- Does the layout remain stable on mobile and during overlay or sticky interactions?
- Did the change avoid introducing new global CSS unless it was actually necessary?

## Validation

Use the smallest command set that proves the change:

- `pnpm build` for app-level safety
- `pnpm exec eslint <target-files>` for targeted linting on touched files
- browser verification for route-specific interaction, animation, overflow, sticky, and overlay work

Do not treat a successful build as proof for visual or interaction fixes. For route-specific bugs, confirm the live rendered behavior.

## Documentation Maintenance

Keep this file current when the repo’s styling architecture, layout primitives, route structure, or validation expectations change. `AGENTS.md` is an operating guide, not static prose.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

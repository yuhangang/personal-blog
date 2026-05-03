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
- `src/components/` contains shared and route-level React components
- `src/styles/_variables.scss` is the primary SCSS design-token source
- `src/styles/_mixins.scss` contains the shared container and breakpoint mixins
- `src/app/globals.scss` defines base typography, spacing, and utility classes
- `src/app/globals.css` contains global CSS and Tailwind utility-layer additions

## Styling Rules

- Reuse the existing tokens in `src/styles/_variables.scss` before introducing new colors, spacing values, shadows, radii, or transition timings.
- Reuse the shared breakpoint and container mixins from `src/styles/_mixins.scss` instead of inventing route-local breakpoint logic.
- Use the font variables already wired in `src/app/layout.tsx`. Do not introduce ad hoc font stacks in component code unless the route already requires a deliberate exception.
- Prefer SCSS modules or route-local component styling for reusable sections. Use global CSS only when the behavior truly needs global reach.
- Avoid mixing several styling systems inside a single component without a clear reason. This repo already uses SCSS, CSS modules, Tailwind utilities, and some inline motion-driven styles; add new styling in the smallest consistent layer possible.
- Do not add arbitrary visual values when an existing token is close enough. If a new token is necessary, add it centrally.

## Layout Constraints

- Keep horizontal overflow clipped unless the route explicitly owns a horizontal storytelling pattern.
- Use the shared container rhythm. Default to the `container` mixin or existing route framing before widening sections to full bleed.
- Preserve readable line lengths for text-heavy sections. Use `$content-width`-style constraints for editorial copy rather than stretching prose across the viewport.
- Treat mobile as a first-class layout, not a later shrink pass. Check spacing, sticky behavior, and safe-area handling on narrow screens.
- Use `100dvh`/safe-area-aware patterns where the surrounding shell already relies on them.
- When building immersive routes such as `/pantai-timor` or `/terengganu`, maintain that route’s established editorial/photobook composition instead of falling back to generic app layouts.

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

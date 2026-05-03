# AGENTS.md

## Scope

This guide applies to the gallery route under `src/app/gallery/` and its paired shared components in `src/components/gallery/`.

Use it for:

- gallery landing-page layout and styling
- hero typography and motion
- collection-card composition, hover behavior, and media treatment
- changes to `src/config/gallery.ts` that affect gallery presentation

## Intent

The gallery page is an index of visual essays, not a generic card grid. It should feel curated, editorial, and restrained.

When editing this subproject:

- preserve the gallery’s dark, cinematic presentation
- prioritize image-led composition over dense UI chrome
- keep copy concise and readable
- make motion soft and supportive, not flashy

## Current Structure

- `src/app/gallery/page.tsx` owns the route shell and maps `GALLERY_PROJECTS`
- `src/app/gallery/gallery.module.scss` owns route-level layout and background treatment
- `src/components/gallery/GalleryHero.tsx` owns the route intro
- `src/components/gallery/CollectionCard.tsx` owns collection-card interaction and media layering
- `src/components/gallery/*.module.scss` own the component styling
- `src/config/gallery.ts` is the content/config source for the gallery index

## Styling Rules

- Reuse repo-level typography, spacing, and color tokens before inventing local values.
- Keep the visual direction dark and editorial. Avoid bright app-like accents unless the collection itself requires a deliberate exception.
- Favor large image surfaces, quiet typography, and strong negative space over dense overlays or badges.
- Preserve the existing filmic texture language where it already exists, including restrained overlay/noise usage.
- Keep text overlays legible against imagery with layering, contrast, and spacing instead of heavy opaque panels by default.

## Layout Constraints

- Treat the page as a curated index. Grid rhythm matters more than maximizing card count.
- Preserve clear spacing between hero and grid sections.
- Keep card aspect ratios and media framing intentional; avoid unpredictable heights that make the index feel noisy.
- On mobile, cards should stack cleanly without cramped overlay text or hover-only dependencies.
- Do not introduce horizontal overflow or awkward viewport-based widths in the gallery shell.

## Interaction Guidance

- Hover enhancements must degrade gracefully on touch devices.
- If a card has video preview behavior, keep playback quiet, immediate, and reversible; do not let hover logic create console noise or broken states.
- Motion should reinforce reveal and depth. Avoid layered animations that compete with the photography.
- Navigation clarity matters: each card should read as a direct entry point into a story.

## Content and Config Changes

- Keep `src/config/gallery.ts` as the source of truth for gallery items.
- When adding new entries, keep metadata consistent with the current schema: title, category, description, image, optional video, href, CTA, location, and year.
- Descriptions should read like editorial summaries, not marketing copy.

## Validation

- Run targeted lint on touched gallery files.
- Verify the route in a browser when changing layout, hover media, motion, or responsive behavior.
- Check both desktop and mobile presentation for card spacing, overlay readability, and image cropping.

## Maintenance

Update this guide when the gallery route gains new layout primitives, interaction patterns, or component boundaries.

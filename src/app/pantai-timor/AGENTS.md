# AGENTS.md

## Scope

This guide applies to the Pantai Timor route under `src/app/pantai-timor/` and the paired route-specific component layer under `src/components/pantai-timor/`.

Use it for:

- route layout, shell, and scroll behavior
- hero/title transitions
- local-section layout and carousel behavior
- lightbox, overlay, and gesture handling
- map and geography presentation
- component extraction or route-structure cleanup

## Intent

Pantai Timor is a bespoke editorial photobook experience. Treat it as a route-specific product surface, not a standard content page.

When editing this subproject:

- preserve the dark coastal/editorial visual language
- keep photography and pacing ahead of generic UI patterns
- prefer immersive composition over dashboard-style layout
- validate real visible behavior in-browser before considering the work done

## Current Architecture

- `src/app/pantai-timor/page.tsx` is the app-route entry
- `src/app/pantai-timor/components/` contains the active route implementation pieces
- `src/components/pantai-timor/` contains the modular counterpart for the same route family
- some interactions, especially lightbox behavior, have historically required mirrored fixes across both paths
- route shell behavior still interacts with app-level layout/template concerns, so do not debug this route in isolation from the shell

## Styling Rules

- Keep the route within its established dark, atmospheric, editorial system.
- Avoid generic modal styling, generic cards, or bright app-shell accents.
- Preserve the distinction between content layers, chrome layers, and background atmosphere.
- If glass/frosted treatment is used, keep the photo/content itself fully readable and apply blur/tint only to the intended background layers.
- Reuse shared repo tokens where practical, but allow Pantai Timor to stay more bespoke than standard routes.

## Layout Constraints

- Protect the route from accidental horizontal overflow unless a section explicitly owns a horizontal interaction.
- Keep section transitions intentional; large image-led sections need breathing room and stable viewport behavior.
- For editorial copy, preserve readable line lengths and separation from interactive media.
- Mobile behavior is part of the core experience. Check title scaling, sticky sections, overlays, and safe-area handling on narrow screens.
- Be careful with fixed, sticky, transformed, or overflow-managed layers because small shell changes can break the photobook feel.

## Lightbox and Overlay Rules

- Treat the lightbox as a single-frame image viewer, not a scrolling strip, unless the route is deliberately redesigned.
- Before patching lightbox behavior, inspect both:
  - `src/app/pantai-timor/components/Lightbox.tsx`
  - `src/components/pantai-timor/PantaiLightbox.tsx`
- If the bug is visible on the live route, do not assume a fix in only one file is sufficient.
- Prevent visible layout shift when the overlay opens.
- Gesture handling should belong to the overlay experience, including pinch/zoom ownership when that behavior is present.
- Browser proof is required for overlay, swipe, zoom, and scroll-lock fixes.
- The lightbox is a modal `role="dialog"`: while open it sets `inert` on every other `<body>` child, focuses Close, and returns focus to the opener on close. Keep that focus effect declared after the scroll-lock effect so the page is restored before focus returns.
- The grid view is one tab stop with arrow-key movement (roving `tabIndex`); arrow keys pan the grid to the focused cell and are stopped from reaching the page's previous/next handler.

## Focus

- The route draws its own `#e3e1da` focus ring, scoped to `html.pantai-timor-scroll` so it reaches the portalled lightbox. Don't replace it per component with `outline: none` or ad hoc rings.
- Clipping containers that hold focusable photos (`.local-sticky-container`, `.infinite-grid-container`) use `overflow: clip`, not `hidden`: a `hidden` box can still be scrolled by focus, which knocks transform-driven layouts out of step.

## Local Section Rules

- Keep the local archive/local section photo-first, with the framed horizontal carousel (`#pantai-timor-scroller`) and no overlaid copy or archive CTA.
- Preserve the established scroll container behavior around `#pantai-timor-scroller`.
- Carousel photos are buttons. Keyboard focus scrolls the page (through Lenis when active) to the point where the strip centres that photo; mouse focus does not move the page.
- Keep editorial copy, photo captions, and footer omitted so the route remains an image-led gallery with title and top navigation chrome only.

## Map and Geography Rules

- The map (`CoastalGeography`), text-led sections (`HistoryCulture`, `QuoteSection`), and `Footer` have been removed from the active `/pantai-timor` route.
- Navigation section links must target active sections (`#almanac`, `#memory`, `#village`, `#archive`).

## Validation

- Run targeted lint on the files you touched.
- Use build/type checks for safety, but do not treat them as proof for route behavior.
- Verify in a browser whenever you touch scrolling, sticky behavior, lightbox interaction, map interaction, hero transitions, or responsive composition.
- For regressions that the user calls out as “still not working,” escalate to live browser verification immediately.

## Maintenance

Update this guide when Pantai Timor’s active component boundary, overlay model, scroll architecture, or layout rules materially change.

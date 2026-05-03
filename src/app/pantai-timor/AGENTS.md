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

## Local Section Rules

- Keep the local archive/local section as two clear zones:
  - editorial header and supporting copy
  - framed interactive carousel/control area
- Preserve the established scroll container behavior around `#pantai-timor-scroller`.
- Do not collapse the section back into a crowded single block unless the route is being intentionally redesigned.

## Map and Geography Rules

- Map polish must stay inside the route’s editorial language.
- Interaction constraints such as zoom bounds are part of the route experience and should be verified live.
- Avoid turning the geography section into a generic app map embed.

## Validation

- Run targeted lint on the files you touched.
- Use build/type checks for safety, but do not treat them as proof for route behavior.
- Verify in a browser whenever you touch scrolling, sticky behavior, lightbox interaction, map interaction, hero transitions, or responsive composition.
- For regressions that the user calls out as “still not working,” escalate to live browser verification immediately.

## Maintenance

Update this guide when Pantai Timor’s active component boundary, overlay model, scroll architecture, or layout rules materially change.

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

- `src/app/pantai-timor/page.tsx` is the app-route entry (a client component); `layout.tsx` beside it only carries the route's `metadata` ("Pantai Timor | Yu Hang Ang"), since a client page cannot export it
- The route is linked from the `/gallery` series band and the footer's Pages list (`FOOTER_EXPLORE_LINKS`); the site `Navigation` and `Footer` stay hidden here
- `src/app/pantai-timor/story.ts` is the source of truth for the story: chapters, their plates (rows of one or two photos), per-plate aspect ratios, distances between chapters, and `STORY_PLATES` (every plate in story order, which the lightbox and its grid page through). Place names, frame codes and coordinates come from `GALLERY_MAP_PHOTOS` in `@/config/gallery`; don't restate locations by hand
- `src/app/pantai-timor/components/` contains the active route implementation pieces
- `src/components/pantai-timor/` contains the modular counterpart for the same route family (not routed)
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

## Photo Viewer Rules

- `components/Lightbox.tsx` is a plain single-frame viewer: a solid `#0c0d0b` ground (no blur, glow or vignette), a top bar with "n / 12" and the plate's place name on the left and text buttons "Index" and "Close" on the right, the photo at `object-fit: contain`, and "← Previous" / "Next →" text buttons below. Photos cross-fade; nothing slides or scales.
- Clicking the left 40% of the photo steps back and the rest steps forward (the cursor shows which); read the side from the click position, not from pointer-move state. Touch screens page by swiping, and a tap does not also step.
- "Index" swaps the photo for `components/ContactSheet.tsx`: every plate once, in story order, grouped under plain chapter names, each frame at its own ratio on a shared row height (two 3:2 frames per row on phones). The current plate is marked with a rule under it; picking one returns to the photo. It replaced the old draggable infinite grid.
- The page's keyboard handler pages with the arrow keys only in photo mode; Escape closes the viewer from either mode.
- The viewer is a modal `role="dialog"`: while open it sets `inert` on every other `<body>` child, focuses Close, and returns focus to the opener on close. Keep that focus effect declared after the scroll-lock effect so the page is restored before focus returns.
- `src/components/pantai-timor/PantaiLightbox.tsx` belongs to the unrouted modular counterpart; the live route doesn't use it.
- Browser proof is required for overlay, swipe and scroll-lock changes.

## Focus

- The route draws its own `#e3e1da` focus ring, scoped to `html.pantai-timor-scroll` so it reaches the portalled viewer. Don't replace it per component with `outline: none` or ad hoc rings.

## Story Structure

The route is a single unified horizontal editorial rail (`EditorialBook`, `#editorial-book`) inspired by a 1960s photobook/magazine (no artificial book fold), starting with the Cover (`Hero`) inline on the exact same horizontal line as all chapters:

1. **Cover (`#cover`)**: Inline first panel (`100svh`) on the rail. During its sticky dwell, `cover.mp4` expands from rounded card (`--hero-width × --hero-height`) to full viewport while `AnimatedTitle` glides into `Navbar`'s running head; the bottom running folio bar stays hidden on the cover and slides in as the rail advances horizontally into `CoastalAlmanac`.
2. **CoastalAlmanac (`#almanac`)**: Sticky dwell panel preserving the original blurred coastal backdrop, centered `4:5` window panning horizontally (`--almanac-x-travel`) with `DSC07763_1.jpg` → `DSC00590.JPG` cross-fade, and concentric water ripples.
3. **Prologue TOC (`#prologue`)**: Compact north-to-south contents column jumping directly to each chapter along the piecewise timeline.
4. **Chapter I (`#bachok`)**: Sticky dwell `ParallaxZoom` (`DSC00465.JPG` zooming `1 → 3×` and dissolving into `DSC00590.JPG`), four true-ratio `3:2` plates, stacked `VillageRhythms` counter-parallax diptych (`width: calc(var(--rail-h) * 0.75)` so both halves remain exact `3:2`), and sticky dwell `Memory` (`DSC00679.JPG` darkroom blur/brightness/saturation focus pull via `useMotionTemplate`).
5. **Chapter II (`#besut-setiu`)**: Chapter divider column with `3:2` `DSC01061.jpg` inset, road-pan `DSC01024.jpg` (`3:2`), `DSC00032.jpg` (`3:2`), and `DSC08014.jpg` (`3:4` portrait).
6. **Chapter III (`#kuala-terengganu`)**: Chapter divider column with `3:2` `DSC01218.jpg` inset, `DSC00052.jpg`, `DSC01109.jpg`, `DSC07705.jpg`, and Marang Coast golden sunset `DSC08133_1.jpg` (all true `3:2`).
7. **Chapter IV (`#dungun`) & `#epilogue`**: Chapter divider column, Rantau Abang plates (`DSC07670_1.jpg`, `DSC08235.jpg`), Kuala Dungun `1500/843` (~`16:9`) dusk horizon (`DSC07665_1.jpg`), and a compact colophon column ("← Back to gallery", "Back to cover ↑").

- On desktop (`>= 768px`, no reduced motion), `EditorialBook` builds a piecewise scroll timeline (`buildHorizontalTimeline`) whose `trackX` pauses on flat sticky-dwell plateaus at `#cover`, `#almanac`, `#bachok` (`ParallaxZoom`), and `#memory` while sliding smoothly across all true-ratio plates (`width: calc(var(--rail-h) * var(--plate-ratio))`) in between. Vertical scroll (Lenis / mouse wheel), horizontal trackpad wheel (`deltaX`), keyboard `ArrowLeft`/`ArrowRight`, and the bottom running folio bar all drive the same rail. On mobile (`< 768px`) and under `prefers-reduced-motion: reduce`, `.book-scroller` switches to native horizontal touch scrolling (`overflow-x: auto; scroll-snap-type: x proximity`) with `heroProgressMV` synced from `scrollLeft`.
- All 13 `STORY_PLATES` remain clickable buttons inside the rail that open `Lightbox` at their exact `STORY_PLATES` index (with inset `outline-offset: -3px` focus rings and `onFocus` scrolling the panel into view), separated by crisp `3px` seams with zero document horizontal overflow.
- Keep it raw and print-inspired: Cormorant Roman numerals and chapter titles, tabular plate counter (`01 / 13`), archive frame codes (`PT · 19`), and place names/distances from the archive. Don't invent narrative prose about places; ask for it.
- Unused legacy vertical components (`Hero`, `CoastalAlmanac`, `ParallaxZoom`, `VillageRhythms`, `Memory`, `CoastalPassage`, `CoastalFinale`, `StoryChapter`, `Epilogue`, `CoastalGeography`, `HistoryCulture`, `QuoteSection`, `Footer`) remain off the active route.

## Navbar Rules

- There is no menu. The navbar holds only the way back to `/gallery` on the left (`.nav-back`: an arrow alone on phones, arrow plus "Gallery" from tablet up; a `44px` target pulled back so the arrow sits on the gutter) and the centred title the hero heading lands on. The right slot stays empty to keep the title centred.

## Validation

- Run targeted lint on the files you touched.
- Use build/type checks for safety, but do not treat them as proof for route behavior.
- Verify in a browser whenever you touch scrolling, sticky behavior, lightbox interaction, map interaction, hero transitions, or responsive composition.
- For regressions that the user calls out as “still not working,” escalate to live browser verification immediately.

## Maintenance

Update this guide when Pantai Timor’s active component boundary, overlay model, scroll architecture, or layout rules materially change.

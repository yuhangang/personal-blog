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

The route reads as a drive down the east coast, north to south. Order in `page.tsx`:

1. `Hero` and the travelling `AnimatedTitle`
2. Prologue: `CoastalAlmanac` (`#prologue`), spanning the whole coast
3. Four `StoryChapter`s (`#bachok`, `#besut-setiu`, `#kuala-terengganu`, `#dungun`), each opened by the place name (Cormorant, left-aligned on the plate frame) and one plain line under it: the state, plus how far south of the previous chapter (straight-line km, `kmFromPrevious`)
4. `Epilogue` (`#epilogue`): two plain text links, "← Back to gallery" and "Back to top ↑"

- Keep it raw. No kickers or letter-spaced uppercase labels, stat lines, outlined numerals, pill buttons, centred display typography or decorative scroll gimmicks; the user rejected those as looking machine-made. Text is sentence case in the sans at small sizes, and the photographs carry the page.
- The immersive pieces sit in Chapter I because their photographs are all from Bachok: `ParallaxZoom` is its `lead` (arrival on the beach), `VillageRhythms` and `Memory` its `coda` (the dashboard view as the drive leaves Bachok). Place any new immersive piece in the chapter where its photo was taken.
- Plates are buttons that open the viewer at their `STORY_PLATES` index. Each sits at its true aspect ratio (`--plate-ratio`); a lone plate is capped to `82svh` tall, a pair shares one height, and phones stack them. Plates fade in (opacity only). The caption is just the place name ("Pantai Irama, Bachok").
- Copy is limited to place names and distances derived from the archive. Don't invent narrative prose about places; ask for it.
- The old horizontal archive carousel (`TheLocalSection`, `#archive`) has been replaced by the chapters. The map (`CoastalGeography`), text-led sections (`HistoryCulture`, `QuoteSection`), and `Footer` remain off the route.

## Navbar Rules

- There is no menu. The navbar holds only the way back to `/gallery` on the left (`.nav-back`: an arrow alone on phones, arrow plus "Gallery" from tablet up; a `44px` target pulled back so the arrow sits on the gutter) and the centred title the hero heading lands on. The right slot stays empty to keep the title centred.

## Validation

- Run targeted lint on the files you touched.
- Use build/type checks for safety, but do not treat them as proof for route behavior.
- Verify in a browser whenever you touch scrolling, sticky behavior, lightbox interaction, map interaction, hero transitions, or responsive composition.
- For regressions that the user calls out as “still not working,” escalate to live browser verification immediately.

## Maintenance

Update this guide when Pantai Timor’s active component boundary, overlay model, scroll architecture, or layout rules materially change.

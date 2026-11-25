# AGENTS.md

## Scope

This guide applies to the gallery route under `src/app/gallery/` and its paired shared components in `src/components/gallery/`.

Use it for:

- interactive Earth map gallery layout, camera behaviors, and clustering
- photo-as-label markers and native dialog lightbox presentation
- collection-card composition, hover behavior, and media treatment
- changes to `src/config/gallery.ts` that affect gallery presentation

## Intent

The gallery page is an immersive, Google Earth–style photographic atlas paired with an editorial essay index below the fold. Every marker on the map is a framed photograph anchored to its real GPS coordinates rather than a generic pin or text label.

When editing this subproject:

- preserve the gallery’s dark, cinematic presentation
- prioritize satellite Earth and image-led composition over dense UI chrome
- keep default basemap text labels hidden so photographs serve as the primary labels
- keep copy concise and readable
- make motion soft and supportive, and respect `prefers-reduced-motion`

## Current Structure

`src/app/gallery/page.tsx` opens on the shared `CinematicCover` touge reel (`variant="cover"`, `data-theme="dark"`), titled "Gallery" (bold Caudex, display size) centred in `--retro-yellow` (`align="center"`, `headlineSize="display"`, `headlineColor`) over the subtitle "Photographs and films from the road." It opens half open, then black bars slide off top and bottom. It is full-bleed on desktop; on portrait phones the title sits on a black band above a 3:4 video frame. Below it, `#collections-index` ("Selected *Series.*") lists `GALLERY_PROJECTS` as `CollectionCard variant="band"` cards — currently Pantai Timor, linking to `/pantai-timor`. New sections go below the cover. The previous atlas layout described next is kept, unrouted, in `src/app/gallery/_page.tsx`.

- `src/app/gallery/_page.tsx` (previous layout) owns the route shell, rendering `GalleryHero` (opening typographic header and locations strip under `#editorial-lead`), the bounded `#map-atlas` bordered rounded-rect map section containing `EarthGalleryMap`, and the `#collections-index` wide series showcase (`GALLERY_PROJECTS`)
- `src/app/gallery/gallery.module.scss` owns route-level section framing and spacing: the collections header and band stack sit in the `--footer-width` (`1120px`) frame with the `clamp(20px, 5vw, 40px)` gutter so they line up with `Navigation` and `Footer`; the old layout's `.mapFrame` keeps `1200px`
- `src/components/gallery/GalleryHero.tsx` owns the compact editorial header (`Caudex` bold/italic headline pairing, concise description, and locations strip) directly above the photo map
- `src/components/gallery/EarthGalleryMap.tsx` owns the bordered rounded-rect MapLibre GL globe/3D terrain card, card-local Liquid Glass HUD overlays (top-right camera toolbar + bottom chapter/filmstrip dock), cooperative gestures, region chapter jumps, guided flyover tour, and filmstrip dock
- `src/components/gallery/PhotoLabelMarker.tsx` owns photo-as-label map markers and stacked multi-frame indicators
- `src/components/gallery/photoClustering.ts` owns GPS spot grouping and zoom-aware screen-space clustering
- `src/components/gallery/PhotoLightboxDialog.tsx` owns the native top-layer `<dialog>` full-resolution photo viewer (`closedby="any"` + Safari fallback)
- `src/components/gallery/useHorizontalScrollHints.ts` provides `IntersectionObserver` horizontal edge-fade class fallbacks when CSS scroll-driven `animation-timeline: scroll()` is unsupported
- `src/components/gallery/CollectionCard.tsx` owns collection-card interaction and media layering (`variant="grid"` reused by `HomeGallery`, `variant="band"` used for the series plates on `/gallery`). A band is an editorial plate matching the site's covers and About bio: a clean photo (`16 / 7` desktop, `3 / 2` tablet, `4 / 3` mobile) carrying only a PageCover-style uppercase credit (`location · year`) over a light foot scrim, then a caption beneath — kicker (`01 —— category`), Caudex title, Jost description and an underlined text link with a plain `ArrowRight` (internal link), not glass badges or pills. Photo and hover video crop at `center 72%` (more sky than foreground). `--video-pillarbox` (from `videoPillarbox`) widens the video element so black side bars baked into a file fall outside the clipped frame; it needs `max-width: none` to beat Tailwind's media reset
- `src/config/gallery.ts` is the content/config source for `GALLERY_PROJECTS`, `GALLERY_CHAPTERS`, and `GALLERY_MAP_PHOTOS`

## Styling Rules

- Reuse repo-level typography, spacing, and color tokens before inventing local values, including the dark Liquid Glass primitives (`kertas-liquid-glass-dark`, `kertas-liquid-glass-dark-elevated`, `kertas-liquid-pill-dark`) in `src/styles/_kertas.scss` and horizontal mask properties (`--fade-start`, `--fade-end`) in `src/app/globals.scss`.
- Keep the visual direction dark and editorial (`#05070c` cosmic backdrop, `#f4f0e8` ivory ink, `Caudex` `700` bold + `400` italic hero/section display headers, `Inter` UI/body copy, and `Jost` / `Courier Prime` Kertas controls). Avoid bright app-like accents unless a collection requires a deliberate exception.
- Frame both the map card (`.mapStage`) and `/gallery` series plates (`.bandFrame`) inside bordered rounded rectangles (`--radius-glass` on desktop/tablet, `20px` on mobile, explicit `1px solid rgba(244, 240, 232, 0.2)` perimeter), centred within the `--footer-width` frame (bands) or `1200px` (map, old layout).
- Keep native modal `<dialog>` grid tracks bounded with `grid-template-columns: minmax(0, 1fr)` and `min-width: 0` on children so wide horizontal thumbnail strips never stretch the modal width.
- Keep `bottomDock` / `filmstripShell` constrained with `min-width: 0` and `max-width: 100%` so mobile viewports stay free of horizontal overflow.

## Layout Constraints

- Render `.mapStage` inside `.mapFrame` (`max-width: 1200px`) at `clamp(560px, 74dvh, 760px)` on desktop/tablet (`clamp(540px, 76dvh, 640px)` on mobile) using MapLibre `cooperativeGestures` without `data-lenis-prevent` so page scrolling glides smoothly over the embedded map card.
- Ensure section anchors (`#editorial-lead`, `#map-atlas`, `#collections-index`) use `scroll-margin-top` so programmatic or hash jumps clear the fixed `Navigation` bar.
- Treat mobile (`390px`) as first-class: keep camera controls clear of the top HUD and bottom filmstrip inside the bounded card height, keep the hero pill navigation single-row, and ensure interactive buttons meet `44px` tap targets.

## Interaction Guidance

- Clicking a multi-spot spatial cluster zooms/fits smoothly into that region until individual photo labels separate; clicking a single GPS spot opens `PhotoLightboxDialog`.
- Guided flyover tour and orbital intro flight must stop immediately on manual user interaction, pause when off-screen/hidden (`contentvisibilityautostatechange` / `IntersectionObserver` / `visibilitychange`), and disable when `prefers-reduced-motion` is active.
- Video previews in `CollectionCard` use `preload="none"` so hover media does not trigger aborted initial network fetches.

## Content and Config Changes

- Keep `src/config/gallery.ts` as the source of truth for gallery items, deriving geo-tagged frame data from `COASTAL_LOCATIONS` and `CAROUSEL_IMAGES` without duplicating URLs.
- Keep `GALLERY_PROJECTS` schema consistent (`title`, `category`, `description`, `image`, optional `video`, optional `videoPillarbox` (share of the video's width that is baked-in black bars per side), `href`, `cta`, `location`, `year`).

## Validation

- Run targeted lint on touched gallery files and `pnpm build`.
- Verify the route in a browser across desktop and mobile when changing map rendering, clustering, `<dialog>` lightbox, scroll behavior, or responsive HUD layout.

## Maintenance

Update this guide when the gallery route gains new layout primitives, interaction patterns, or component boundaries.

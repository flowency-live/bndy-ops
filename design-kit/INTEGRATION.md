# bndy frontstage — Marker Redesign Integration Guide

Audited: `C:\VSProjects\bndy-frontstage` · 2026-06-10
Pairs with: `marker-kit.html` (visual source of truth), `markers.css`, `BndyMapMarkers.jsx`

This doc tells the implementing agent exactly how the map is built today and how to
swap in the neon marker system. Read the whole thing before touching code.

---

## 1 · How it works today

**Live stack:** Mapbox GL JS v3 (`mapbox-gl@^3.22`) via `src/components/mapbox/*` and
`src/context/MapboxContext.tsx`. Leaflet, leaflet.markercluster, @maptiler and
@googlemaps packages are **dead code** from earlier refactors (see `BeforeLeafletMaps.zip`
etc. in repo root) — do not touch them, do not import them.

| Concern | File | Approach |
|---|---|---|
| Map init + theme | `src/context/MapboxContext.tsx` | `setStyle()` swaps `mapbox://styles/mapbox/dark-v11` ↔ `light-v11` from `isDarkMode` |
| Event markers | `src/components/mapbox/EventMarkerLayer.tsx` | GeoJSON source, `cluster: true, clusterMaxZoom: 11, clusterRadius: 40`; **circle paint layers**, not DOM: singles `circle-radius: 8, #F97316`; clusters `step` by count → 16/20/24px, `#F97316/#EA580C/#C2410C` |
| Venue markers | `src/components/mapbox/VenueMarkerLayer.tsx` | Same pattern: `clusterMaxZoom: 10, clusterRadius: 30`; singles colored by `hasEvents` (`case` expression); glow layer for active venues; symbol layer with stretchable `venue-pill-bg` image for name labels at zoom 11+ |
| Rasterized SVG images | `src/components/mapbox/MapboxMarkers.ts` | SVG string → canvas → `ImageData` → `map.addImage()`. Also `venuesToGeoJSON` / `eventsToGeoJSON` (keeps `hasEvents`, `locationKey` props) |
| User location | `src/components/mapbox/UserLocationMarker.tsx` | **Already an HTML `mapboxgl.Marker`** with CSS animation (`.mapbox-user-location-marker` in `src/app/globals.css`) — proof the HTML-marker pattern works in this app |
| Click → details | `src/components/overlays/EventInfoOverlay.tsx`, `VenueInfoOverlay.tsx` | Layer click handlers in the two Layer components; cluster click = `getClusterExpansionZoom` |

### ⚠️ Color semantics are FLIPPING (decided by Jason 2026-06-10)

Current code: `hasEvents → cyan #06B6D4 (glow)`, idle → `pink #FF1493 @ 60% opacity`.
**New system: `hasEvents → PINK full-bloom (--bndy-pink #ff2e88)`, idle → dim CYAN (--bndy-cyan #19d3f5).**
Every `["case", ["get", "hasEvents"], …]` expression and the pill border color must flip.
Don't "preserve existing behavior" here — the inversion is intentional.

---

## 2 · Why the rendering approach must change

The neon design needs CSS the paint-layer approach can't do: multi-layer box-shadow
bloom, `color-mix()`, breathe/sonar/orbit keyframe animations, hover scale-pop,
backdrop-blur glass, label pills with transitions. Mapbox circle/symbol paint can't
express any of that.

**Strategy: keep Mapbox's native clustering (sources stay), replace the circle/symbol
LAYERS with diffed HTML markers** — same pattern `UserLocationMarker.tsx` already uses.

### The diffed-HTML-marker pattern

1. Keep the GeoJSON sources exactly as they are (`cluster: true` and all thresholds
   unchanged) — but make the layers invisible or remove them; the source still clusters.
   If a layer is removed, keep ONE invisible layer per source so
   `querySourceFeatures` has data after style changes, or query the source directly.
2. On map `render`/`moveend`/`sourcedata`, call
   `map.querySourceFeatures(sourceId)` and build the wanted-marker set:
   - feature has `point_count` → ClusterMarker (count = `point_count`)
   - else → single (GigMarker / VenueMarker from feature properties)
3. Diff against a `Map<key, mapboxgl.Marker>` keyed by `cluster_id` or feature `id`:
   add missing, remove stale, update changed (`setLngLat`, swap classes). Never
   recreate unchanged markers — that's what kills perf and restarts CSS animations.
4. Marker element creation: use `createMarkerElement()` from `BndyMapMarkers.jsx`
   (port to TS as `src/components/mapbox/markerElements.ts`). The imperative factory
   fits this diffing loop better than portals.
5. Add `markers.css` content to `globals.css` (or import it from layout). Replace the
   old `.mapbox-user-location-marker` CSS with the kit's `.bndy-mk--user`.

### Cluster live/idle coloring (venue mode)

A venue cluster is "live" if ANY member venue has gigs. Cheap way — add to the venue
source definition:

```js
clusterProperties: { hasLive: ["any", ["to-boolean", ["get", "hasEvents"]]] }
```

Then cluster kind = `feature.properties.hasLive ? 'venue-live' : 'venue-idle'`.
Event clusters are always kind `'gig'`.

### Tier mapping (kit) vs old step thresholds

Kit tiers: sm 2–4 (32px) · md 5–9 (40px) · lg 10+ (48px) — replaces the old
16/20/24px circle steps. Counts come straight from `point_count`
(`point_count_abbreviated` for 1.2k-style display if counts get huge).

---

## 3 · File-by-file plan

1. **`src/styles/markers.css`** (new) — copy from design-kit `markers.css` verbatim.
   Import once in `src/app/layout.tsx` or append to `globals.css`.
2. **`src/components/mapbox/markerElements.ts`** (new) — TS port of
   `createMarkerElement` + `clusterTier` from `BndyMapMarkers.jsx`. Include
   `escapeHtml`. Export types for marker opts.
3. **`src/components/mapbox/useDiffedMarkers.ts`** (new) — the diffing hook described
   above; parameterized by sourceId + a `featureToMarkerOpts` callback. Used by both
   layers. Handle: map style reload (markers survive `setStyle`, sources don't — re-add
   sources on `style.load`, markers stay), component unmount cleanup, `selected` state.
4. **`EventMarkerLayer.tsx`** (rewrite internals) — keep source + props/API and the
   click → `EventInfoOverlay` flow. Singles: `type:'gig'`, `isTonight` =
   `event.date` is today (date logic exists in this file's GeoJSON props). Cluster
   click keeps `getClusterExpansionZoom` behavior (store `cluster_id` on the element's
   dataset).
5. **`VenueMarkerLayer.tsx`** (rewrite internals) — flip hasEvents semantics (§1 ⚠️).
   Venue name labels: at zoom ≥11 the old symbol-layer pills are replaced by the kit's
   hover label pill (`label` opt on the marker). If always-visible labels at high zoom
   are still wanted, add class `is-labeled` that forces `.bndy-mk-label { opacity: 1 }`
   past zoom 11 — decision for Jason at review.
6. **`UserLocationMarker.tsx`** — swap element to `createMarkerElement({type:'user'})`;
   delete old CSS.
7. **`MapboxMarkers.ts`** — `addMarkerImagesToMap`, all `create*SVG` functions and
   `getClusterImageName` become dead → delete after the layers stop referencing
   images. KEEP `venuesToGeoJSON` / `eventsToGeoJSON` (add nothing-burger change:
   `hasEvents` already present).
8. **Theme** — in `MapboxContext.setMapStyle`, alongside `setStyle()`, toggle
   `theme-light` class on `map.getContainer()`. That's the entire light-mode wiring;
   markers restyle via CSS.

## 4 · Gotchas

- **CRITICAL (hit in production 2026-06-10): never put `transform`/`transition`
  on the marker ROOT element.** Mapbox positions HTML markers via an inline
  `transform: translate(...)` on that element; a CSS transition on it makes
  markers swim during zoom. Wrap the visual: `.bndy-mk-anchor` root (style-inert,
  Mapbox owns it) → `.bndy-mk` inner (scale/hover/breathe). Also pin singles to
  exact stored coords, not `querySourceFeatures` geometry (tile-quantized).

- **`setStyle()` wipes sources/layers but NOT HTML markers.** Re-add sources on
  `style.load`; do not re-create markers (they'd lose animation phase). The old code
  rebuilt images on theme change — that whole path dies.
- **z-order:** HTML markers are siblings in the marker pane; kit CSS bumps z-index on
  hover (5) / selected (6). Don't add manual z management.
- **Perf:** Stockport-area venue mode renders ~100–200 visible points worst case —
  fine for DOM markers IF diffed properly. Verify no full clear-and-recreate on
  `render` events (the #1 mistake).
- **`prefers-reduced-motion`** is already handled in markers.css — don't re-implement.
- **Console logs:** existing layers log (`[VenueMarkerLayer] …`); keep that pattern.
- **Tests:** jest config exists; no tests currently assert marker classes (checked) —
  add a snapshot test for `createMarkerElement` outputs.
- `color-mix()` needs Chrome 111+/Safari 16.2+ — fine for target browsers.

## 5 · Out of scope (next phase)

`EventInfoOverlay` / `VenueInfoOverlay` redesign (floating card + mobile bottom
sheet per Jason's picks) — separate kit coming. Don't restyle them during the marker
swap; just keep the click flows working.

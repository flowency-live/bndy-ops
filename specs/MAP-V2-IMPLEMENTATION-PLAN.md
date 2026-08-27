# bndy Map v2 — Implementation Plan

**For:** a VSCode coding agent working in `C:\VSProjects\bndy-frontstage`
**Strategy:** surgical replacement of the map subsystem (not a rebuild)
**Scope:** the home map only — both **Gigs** and **Venues** modes. Venue profile pages, gig list view, artist pages and the event wizard are **out of scope** and must keep working untouched.
**Reference implementation:** `bndy-live-map.html` (working MapLibre hybrid prototype) + the three payload JSONs. Treat the prototype's engine/render code as the source of truth for the new map.
**Date:** 2026-07-03

---

## 1. Why surgical, not a rebuild

The frontstage app is a modern, healthy Next 15.1.7 / React 18 App Router codebase with a real shadcn/Radix design system, TanStack Query, `react-window` virtualization and react-hook-form. The gig list, venue/artist profiles, artist browse and event wizard all work.

The *only* thrashing subsystem is the map. Git history shows it rewritten three times in a week (HTML diffed markers → Deck.gl → Mapbox native layers) and still unsettled. That subsystem is fully isolated: ~13 files under `src/components/mapbox/` plus `MapboxContext`, with `mapbox-gl` imported in 8 files and `@deck.gl` in 3 — **all inside that folder**. Nothing else reaches into map internals.

So we unplug one module and drop in a clean MapLibre engine, add a small theme/skin layer, and leave the rest of the app alone. This is continuously shippable behind a flag and carries a fraction of a rebuild's risk.

A secondary win: MapLibre + CARTO basemaps need **no access token**, which removes the `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` dependency and the Mapbox tile bill entirely.

---

## 2. The integration seam (what the agent must respect)

| Concern | File today | Action |
|---|---|---|
| Home mount | `src/app/page.tsx` | Unchanged. Still `activeView === "map" ? <MapView/> : <ListView/>`. |
| Map wrapper + chrome | `src/components/MapView.tsx` | **Rewrite internals.** Keep the component name, its props-free public shape, and the surrounding chrome (`EventFilter`, `MapDateStrip`, `MapViewEventsFilter`, `AddEventButton`, `VenueModeIndicator`, `EventDisclaimer`). Swap `MapboxProvider`+`MapboxMap` for the new `<BndyMap/>`. |
| Mode + theme state | `src/context/ViewToggleContext.tsx` | **Extend, don't replace.** It already owns `activeView` (map/list), `mapMode` (events/venues), `isDarkMode`, `toggleTheme`, and persists to `localStorage`. Add `skin` + `setSkin` here. This stays the single source of truth. |
| Map engine + provider | `src/context/MapboxContext.tsx` | **Delete** after cutover. Replaced by the new map module's own init. |
| Map internals | `src/components/mapbox/*` (13 files incl. `DeckGl*`, `MapboxNativeLayers`, `EventMarkerLayer`, `VenueMarkerLayer`, `useDiffedMarkers`, `markerElements`, `MapboxMarkers`, `MapboxContainer`, `MapboxControls`, `MapboxMap`, `UserLocationMarker`, `index.ts`) | **Delete** and replace with `src/components/map/*` (see §4). |
| Detail sheets | `src/components/overlays/EventInfoOverlay.tsx`, `VenueInfoOverlay.tsx` | **Keep the click→overlay flow and props.** New map calls the same overlays. Re-skin is a later, separate task. |
| Data hooks | `src/hooks/useAllPublicEvents.ts`, `useVenues.ts` | **Reuse as-is for Phase 1.** Phase 4 swaps them for the viewport/geo path. |
| Artist mini-map (Leaflet) | `src/components/artist/ArtistEventsMap.tsx` | Port to the new MapLibre engine so Leaflet can be removed. Can trail the main work. |

**Rule:** the new map is a black box behind `<BndyMap/>`. It reads `mapMode`, `isDarkMode`, `skin` from `ViewToggleContext` and emits `onEventClick(events)` / `onVenueClick(venue)`. It must not export map internals to the rest of the app. Enforce with a single barrel `src/components/map/index.ts` exporting only `BndyMap`, the `Skin` type, and the skin registry.

---

## 3. Target architecture

**Engine:** MapLibre GL JS (`maplibre-gl`, v4.7+). One WebGL map instance, kept as a module singleton so it survives route changes (mirror the existing `window.__BNDY_MAP__` pattern).

**Basemap:** CARTO vector styles, no token — `dark-matter` (dark) / `positron` (light), swapped on theme change via `setStyle`. Re-add our sources+layers on `styledata` after any `setStyle` (setStyle wipes custom sources/layers).

**Rendering: hybrid (validated in the prototype).**
- The whole crowd — clusters, quiet dots, heat — is drawn as **GPU circle/heatmap layers** on native GeoJSON clustered sources. Handles ~4k points at 60fps.
- Only the **focused/selected** point becomes a **DOM neon marker** (`maplibregl.Marker`) for the rich bloom + sonar ring.
- This sidesteps the per-marker DOM diffing that caused the historical thrash and the `querySourceFeatures` fragility called out in the old integration guide.

**Sources & clustering** (from prototype, proven against MapLibre's official style-spec validator — 0 errors):
- `gigs`: clustered, `clusterRadius:46`, `clusterMaxZoom:12`, `clusterProperties:{tonight:["max",...]}`.
- `vens`: clustered, `clusterRadius:40`, `clusterMaxZoom:11`, `clusterProperties:{live:["max",...]}`.

**Colour semantics (locked):** gigs = orange `#ff7a1a`; venue with upcoming gigs = **pink `#ff2e88`**; idle venue = **cyan `#19d3f5`**. (This is the intentional pink/cyan inversion already decided; do not "preserve" the old cyan=live mapping.)

---

## 4. New module layout — `src/components/map/`

```
src/components/map/
  index.ts                 # barrel: BndyMap, Skin, SKINS
  BndyMap.tsx              # the <BndyMap/> component; owns the MapLibre instance
  engine/
    createMap.ts           # singleton init, CARTO style, controls, geolocate
    sources.ts             # gigsToGeoJSON / venuesToGeoJSON (port from prototype)
    layers.ts              # buildLayers(skin, mode): GPU circle/heat/cluster specs
    heroMarker.ts          # DOM neon marker for the focused point
    pulse.ts               # rAF pulse loop for "tonight" gigs
    interactions.ts        # cluster expand, click→overlay, hit layers
  skins/
    registry.ts            # SKINS: neon-dot | pulse | aurora, light+dark variants
    tokens.ts              # per-skin colour/gradient/basemap config
  useMapData.ts            # wraps useAllPublicEvents + useVenues (Phase 1)
```

Lift the engine/render code directly from `bndy-live-map.html` — it is already structured as `addSources` / `addLayers` / `applyMode` / `applyVariant` / `startPulse` / `wireInteractions` / `setHero`. Port each to a module above with the same behaviour. The prototype's `VAR` object becomes `skins/registry.ts`.

---

## 5. Theme + skin system (the product feature)

Goal: users pick **light/dark** and a **skin**, persisted. The map and app chrome read the same tokens.

1. **Tailwind:** set `darkMode: 'class'` in `tailwind.config.ts` (currently unset — dark: variants aren't wired). Toggle `class="dark"` on `<html>` from `isDarkMode`.
2. **Token contract:** consolidate map + app colour tokens as CSS custom properties in `globals.css` under `:root` and `.dark` (light/dark values already partly exist). The map's neon colours (`--bndy-orange/pink/cyan`) live here too so skins can override them.
3. **Skin registry** (`skins/registry.ts`): each skin = `{ id, label, basemap:{light,dark}, markerStyle:'dot'|'glow'|'ring', heat:boolean, pitch:number, tokens:{…} }`.
   - `neon-dot` — the **previous** design-kit look: DOM-bloom dots, `markers.css` semantics (ship this as a first-class skin; source `design-kit/markers.css`).
   - `pulse` — GPU glow + density heat (prototype Variant A).
   - `aurora` — 3D-tilted, ring markers, violet/cyan (prototype Variant B).
4. **State:** add `skin: Skin` + `setSkin` to `ViewToggleContext`, persisted to `localStorage` (`bndy-skin-preference`), default `pulse`. Changing `skin` or `isDarkMode` calls the map's `applySkin()` (rebuild layers) / `setStyle()` (basemap swap) — no full remount.
5. **Picker UI:** a small control (reuse shadcn `Popover` + `select`) in the map chrome. Light/dark toggle can reuse the existing `toggleTheme`.

---

## 6. Phased delivery (each phase independently shippable behind a flag)

**Phase 0 — Prep**
- Land the uncommitted perf/config WIP first (`npm install` to refresh the lockfile → `npm test` on Windows → build → commit). Don't start on top of dirty trees.
- `npm i maplibre-gl`. Add a feature flag `NEXT_PUBLIC_MAP_ENGINE=maplibre|mapbox` so `MapView` can switch old/new at runtime during migration.

**Phase 1 — New map, parity**
- Build `src/components/map/*` from the prototype. Wire `BndyMap` into `MapView` behind the flag. Consume existing `useAllPublicEvents`/`useVenues`.
- Parity checklist: Gigs + Venues modes, clustering, date strip filtering, search-to-fly, `EventInfoOverlay`/`VenueInfoOverlay` open with correct data, geolocate, tonight pulse.

**Phase 2 — Theme + skins**
- Tailwind `darkMode:'class'`, token contract, `ViewToggleContext` `skin` state, registry with all three skins, picker UI, persistence. Verify light/dark basemap swap re-adds layers correctly.

**Phase 3 — Delete the old engines**
- Remove `src/context/MapboxContext.tsx`, all of the old `src/components/mapbox/*`, the `DeckGl*` and `MapboxNativeLayers` experiments. Flip the flag default to `maplibre`; delete the flag branch once stable.
- Port `ArtistEventsMap.tsx` off Leaflet to the new engine.
- `npm rm mapbox-gl @deck.gl/core @deck.gl/layers @deck.gl/mapbox leaflet` (+ any remaining `@types` / leaflet css). Drop `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` from env + Amplify.

**Phase 4 — Viewport data path (perf)**
- Point the map at the existing backend geo endpoint (geohash6, slim projection — `events-lambda public.js:166-222`) and `/api/events/batch` instead of the three fetch-everything queries. Collapse to viewport-driven loading. Coordinate with the backend GSI/denormalisation work already in the audit backlog.

**Phase 5 — Polish**
- Re-skin `EventInfoOverlay`/`VenueInfoOverlay` to the new sheet design from the prototype. Repo hygiene: clear the root-level junk (`*.zip`, `c:temp*` literal-path files, stray dumps).

---

## 7. Gotchas (carried from production + prototype)

- **`setStyle` wipes sources & layers, not DOM markers.** Re-add sources/layers on `styledata`/`style.load`; keep the hero marker across swaps.
- **One WebGL context.** Do not run Deck.gl and a second GL overlay together — that was a documented crash source. The hybrid uses a single MapLibre context; keep it that way.
- **Marker root transform.** For any DOM marker, never put CSS `transform`/`transition` on the element MapLibre positions — wrap the visual in an inner node. (Prototype's `.hero` already animates a child pseudo-element, which is safe.)
- **SSR.** The map stays `dynamic(import, { ssr:false })`; MapLibre must not be imported from the root layout.
- **Truncation/size clamp** was observed writing large generated files on Windows — after any large write, verify the file tail is intact.
- **Style validity.** Before shipping, validate the generated style against `@maplibre/maplibre-gl-style-spec` (`validateStyleMin`) — the prototype passes with 0 errors; keep it that way.

---

## 8. Definition of done

- Home map renders both modes on MapLibre with no Mapbox token, at 60fps on mobile with the full ~1.4k venues / ~2.4k gigs.
- Light/dark toggle + skin picker (neon-dot, pulse, aurora) work and persist per user.
- `EventInfoOverlay`/`VenueInfoOverlay` flows unchanged from the user's perspective.
- `mapbox-gl`, `@deck.gl/*`, `leaflet` removed from `package.json`; `MapboxContext` and old `mapbox/*` deleted; build is green; `npm test` green on Windows.
- Gig list, venue profiles, artist pages, event wizard all still work (no regressions — they never touched the map module).

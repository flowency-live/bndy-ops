# bndy Map Marker System — Technical Spec
**Direction:** "After Dark" (v1 prototype: `bndy-fresh-prototype.html`)
**Status:** Draft for implementation · 2026-07-05
**Target:** MapLibre GL JS (CARTO basemap, no token) — HTML markers, per existing map module architecture

---

## 1. Overview

Two primary marker species plus a user-location marker:

| Type | Shape | Colour | Meaning |
|---|---|---|---|
| **Gig** | Circle, 16px | Acid lime `#C8FF2E` | An event happening on the selected date |
| **Gig · Tonight** | Circle + sonar ring | Acid lime | Gig happening *today* — the money marker |
| **Venue** | Rotated square (diamond), 14px | Ultraviolet `#8C5BFF` | A venue, regardless of schedule |
| **User** | White dot + expanding ring | White | Device location |

Design principles:

1. **One glance = one meaning.** Shape *and* colour differ between gigs and venues, so the layer is readable for colour-blind users and at small sizes.
2. **Tonight owns the map.** Only same-day gigs animate continuously (sonar). Everything else is static after entry, keeping the map calm and cheap to render.
3. **Light is the hierarchy.** Brightness of glow = urgency. Gig glow > venue glow > basemap.

---

## 2. Design tokens

```css
:root {
  /* colour */
  --mk-gig:        #C8FF2E;                    /* acid lime */
  --mk-gig-core:   #F2FFC9;                    /* hot centre */
  --mk-gig-edge:   #7EA80E;                    /* shaded rim */
  --mk-venue:      #8C5BFF;                    /* ultraviolet */
  --mk-venue-core: #E4D6FF;
  --mk-venue-edge: #4A2B99;
  --mk-label-bg:   rgba(8, 8, 11, 0.92);
  --mk-label-line: rgba(255, 255, 255, 0.12);

  /* geometry */
  --mk-gig-size:   16px;
  --mk-venue-size: 14px;
  --mk-hit-size:   44px;   /* invisible hit target — never smaller */

  /* motion */
  --mk-spring:     cubic-bezier(.34, 1.56, .64, 1);   /* entry pop */
  --mk-pop:        cubic-bezier(.2, .9, .3, 1.25);    /* hover */
  --mk-t-hover:    180ms;
  --mk-t-entry:    450ms;
  --mk-t-sonar:    2000ms;
  --mk-stagger:    60ms;   /* per-marker entry delay, cap total at 600ms */
}
```

---

## 3. DOM contract

MapLibre positions the marker root with an inline `transform: translate(...)`.
**The root element must carry no transform, transition, or animation of its own** or markers swim during zoom/pan (verified failure mode in the previous kit — same rule applies).

```html
<!-- root: given to new maplibregl.Marker({ element, anchor: 'center' }) -->
<div class="mk-anchor" role="button" tabindex="0" aria-label="Juno & The Wasps, The Old Ropeworks, 20:30, free entry">
  <div class="mk mk--gig mk--tonight" style="animation-delay: 120ms">
    <div class="mk-dot"></div>
    <div class="mk-label">Juno &amp; The Wasps · 20:30</div>
  </div>
</div>
```

- `.mk-anchor` — positioning root. Flex, no visuals, no transforms. Owns the 44px hit area (padding) and z-index promotion on hover/select.
- `.mk` — animation wrapper. Entry pop, hover scale, selected scale all live here.
- `.mk-dot` — the visible shape. Gradient fill, glow shadows, sonar pseudo-element.
- `.mk-label` — hover/focus flyout. `pointer-events: none`, hidden until hover/focus/selected.

---

## 4. Marker CSS (canonical)

```css
/* ---------- root / hit target ---------- */
.mk-anchor {
  display: flex; align-items: center; justify-content: center;
  width: var(--mk-hit-size); height: var(--mk-hit-size);
  cursor: pointer;
  /* NO transform, NO transition here — MapLibre owns this element's transform */
}
.mk-anchor:hover, .mk-anchor:focus-visible { z-index: 5; }
.mk-anchor.is-selected { z-index: 6; }
.mk-anchor:focus-visible { outline: 2px solid var(--mk-gig); outline-offset: 2px; border-radius: 50%; }

/* ---------- animation wrapper ---------- */
.mk {
  position: relative;
  animation: mk-entry var(--mk-t-entry) var(--mk-spring) both;
  transition: transform var(--mk-t-hover) var(--mk-pop);
  will-change: transform;
}
.mk-anchor:hover .mk  { transform: scale(1.25); }
.mk-anchor.is-selected .mk { transform: scale(1.3); }
@keyframes mk-entry { from { transform: scale(0); } to { transform: scale(1); } }

/* ---------- GIG dot ---------- */
.mk--gig .mk-dot {
  width: var(--mk-gig-size); height: var(--mk-gig-size); border-radius: 50%;
  background: radial-gradient(circle at 50% 38%,
    var(--mk-gig-core) 0%, var(--mk-gig) 55%, var(--mk-gig-edge) 100%);
  box-shadow:
    0 0 10px rgba(200, 255, 46, .90),   /* inner glow */
    0 0 26px rgba(200, 255, 46, .45),   /* mid bloom  */
    0 0 52px rgba(200, 255, 46, .20);   /* far bloom  */
}

/* ---------- GIG · TONIGHT sonar ---------- */
.mk--tonight .mk-dot::before {
  content: ''; position: absolute; inset: -6px; border-radius: 50%;
  border: 2px solid var(--mk-gig);
  animation: mk-sonar var(--mk-t-sonar) cubic-bezier(.25, .6, .3, 1) infinite;
  pointer-events: none;
}
@keyframes mk-sonar {
  from { transform: scale(.6);  opacity: .9; }
  to   { transform: scale(2.6); opacity: 0;  }
}

/* ---------- VENUE diamond ---------- */
.mk--venue .mk-dot {
  width: var(--mk-venue-size); height: var(--mk-venue-size);
  border-radius: 4px; transform: rotate(45deg);
  background: radial-gradient(circle at 50% 38%,
    var(--mk-venue-core) 0%, var(--mk-venue) 60%, var(--mk-venue-edge) 100%);
  box-shadow:
    0 0 10px rgba(140, 91, 255, .80),
    0 0 24px rgba(140, 91, 255, .40);
}
/* keep the 45° rotation when the wrapper scales — rotation lives on the dot,
   scale lives on .mk, so they never fight */

/* ---------- label flyout ---------- */
.mk-label {
  position: absolute; left: 50%; bottom: calc(100% + 8px);
  transform: translateX(-50%); white-space: nowrap;
  font: 700 11px/1 'Space Grotesk', sans-serif; color: #F2F2F7;
  background: var(--mk-label-bg); border: 1px solid var(--mk-label-line);
  padding: 5px 10px; border-radius: 8px;
  opacity: 0; pointer-events: none;
  transition: opacity var(--mk-t-hover), transform var(--mk-t-hover) var(--mk-pop);
}
.mk-anchor:hover .mk-label,
.mk-anchor:focus-visible .mk-label,
.mk-anchor.is-selected .mk-label {
  opacity: 1; transform: translateX(-50%) translateY(-3px);
}

/* ---------- USER location ---------- */
.mk--user .mk-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #fff; box-shadow: 0 0 12px rgba(255, 255, 255, .8);
}
.mk--user .mk-dot::before {
  content: ''; position: absolute; inset: -10px; border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, .5);
  animation: mk-sonar 3000ms ease-out infinite;
}
```

---

## 5. States

| State | Trigger | Effect |
|---|---|---|
| Entry | marker added / date filter change | `mk-entry` pop, staggered `animation-delay: index * 60ms`, capped at 600ms total |
| Idle | — | Static (no continuous animation) except `mk--tonight` sonar and user ring |
| Hover | pointer over hit area | wrapper `scale(1.25)`, label flyout in, z-index 5 |
| Focus | keyboard focus | same as hover + visible focus ring |
| Selected | tap/click (bottom sheet open) | wrapper `scale(1.3)`, label pinned visible, z-index 6 |
| Dimmed *(extension)* | another marker selected | `opacity: .45`, glow shadows removed — use a `.is-dimmed` class on `.mk` |

Selection is single: selecting a marker clears `is-selected` from all others and applies `is-dimmed` to the rest of the layer.

---

## 6. Motion rules

- **Entry stagger:** `delay = min(index * 60ms, 600ms)`. Re-run entry animation on every date-chip change and layer toggle (rebuild markers; do not try to morph).
- **Sonar budget:** sonar is `transform`/`opacity` only — compositor-friendly. No `box-shadow` animation anywhere (paint storms on mobile).
- **Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .mk { animation: none; }
  .mk--tonight .mk-dot::before, .mk--user .mk-dot::before { animation: none; opacity: .5; }
}
```

---

## 7. MapLibre GL integration

```ts
function addGigMarker(map: maplibregl.Map, gig: Gig, venue: Venue, index: number, isTonight: boolean) {
  const el = buildMarkerEl(gig, venue, index, isTonight);  // DOM per §3
  el.addEventListener('click', () => openGigSheet(gig.id));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGigSheet(gig.id); }
  });
  return new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([venue.lng, venue.lat])
    .addTo(map);
}
```

Rules:

1. `anchor: 'center'` for all dot/diamond markers (they have no tail).
2. Keep a registry `Map<gigId, maplibregl.Marker>`; on filter change, `.remove()` all and rebuild (marker counts here are small — see §9 — rebuild is cheaper than diffing).
3. Multiple gigs at one venue on the same date → render **one** marker for the first-sorted gig with the label `"3 gigs · The Old Ropeworks"`; tapping opens the venue's gig list for that day, not a single-gig sheet.
4. Never attach `transition`/`transform` to the element passed to `Marker` (§3). All motion goes on `.mk` inside it.
5. Layer toggle (Gigs ↔ Venues) is a full teardown/rebuild of the marker set.

---

## 8. Data mapping

| Marker field | Source |
|---|---|
| position | `venue.lng/lat` (gigs resolve through their venue) |
| `mk--tonight` | `gig.date === today` in venue-local time (Europe/London) |
| gig label | `${artist.name} · ${gig.time}` |
| venue label | `${venue.name} · ${upcomingCount} upcoming` |
| aria-label | `${artist}, ${venue}, ${time}, ${price === 'FREE' ? 'free entry' : price}` |

Venue markers with `upcomingCount === 0` *(extension, parity with old kit's idle-venue idea)*: reduce glow to ~40% and skip entry stagger — idle venues shouldn't compete with live ones.

---

## 9. Performance budget

- Design assumes ≤ **60 gig markers** or ≤ **150 venue markers** in viewport. Beyond that, cluster (§10).
- HTML markers are DOM nodes: keep each marker ≤ 4 elements (anchor, mk, dot, label). No images, no SVG per marker.
- Only `transform`/`opacity` animate. `will-change: transform` on `.mk` only.
- Continuous animations capped: sonar only on tonight markers + user dot. If >20 tonight markers visible, drop sonar on all but the 10 nearest viewport centre.

---

## 10. Clustering (extension — not in prototype)

At zoom < 11 or when >60 markers would render:

- Cluster chip: pill, `border-radius: 999px`, background `--mk-label-bg`, 1px lime border, text `"12 ●"` in mono 11px, lime dot.
- Cluster carries max(child urgency): any tonight child → cluster gets the sonar ring.
- Tap → `map.easeTo` zoom +2 centred on cluster.

---

## 11. Accessibility

- Every marker: `role="button"`, `tabindex="0"`, descriptive `aria-label` (§8), Enter/Space activation.
- Hit target 44×44px regardless of visual size (padding on `.mk-anchor`).
- Shape encodes type (circle vs diamond) — never colour alone.
- Focus order: markers sorted by time then name, not DOM insertion order (set `tabindex` sequence on rebuild).
- Contrast: lime on the dark CARTO basemap ≈ 12:1; violet ≈ 5:1 — both pass for graphical objects (3:1).

---

## 12. QA checklist

- [ ] Markers stay pinned during pan/zoom/rotate (no swim) — verifies §3 transform rule
- [ ] Entry stagger runs on every date change and layer toggle
- [ ] Sonar visible on today's gigs only; respects reduced motion
- [ ] Hover label doesn't clip at map edges (flip below marker when within 60px of top)
- [ ] 44px hit target verified on touch device
- [ ] Keyboard: tab through markers, Enter opens sheet, focus ring visible
- [ ] Same-venue multi-gig collapses to one marker with count label
- [ ] 60fps pan with 60 markers on a mid-range Android

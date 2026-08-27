# bndy Skins System — Implementation Spec for `bndy-app`

**Status:** Ready for implementation · 2026-07-07
**Reference implementation (visual source of truth):** `Projects/bndy/bndy-skins-v4.html`
**Companion docs:** `GREENFIELD-REBUILD-PLAN.md` (§2 foundations), `marker-spec-after-dark.md` (MapLibre marker rules)
**Target:** `bndy-app` (Next 15 App Router, React 18.3, TS, Tailwind `darkMode:'class'`) per the greenfield plan.

The prototype is the spec for *look, feel and motion*. Where this document and the prototype disagree on a visual detail, **the prototype wins** — open it side-by-side and match it. This doc adds the architecture, integration and acceptance criteria the prototype can't express.

---

## 1. Concept

One app, nine user-selectable skins. A skin = **a token block (colour/type/shape) + a family (structure)**. Users pick a skin from an in-app picker; the choice persists; the entire UI re-themes live, including the map.

| Skin key | Name | Family | Mode | One-liner |
|---|---|---|---|---|
| `print` | Print Run | `print` | light | Poster & ink, riso red/cobalt/yellow, hard offset shadows, stamped rotations. **Default skin.** |
| `bndy-light` | bndy Light | `soft` | light | Live-site brand by day: slate-50, orange `#F97316`, cyan-600. |
| `bndy-dark` | bndy Dark | `soft` | dark | Live-site brand by night: `#0F1729`, glowing orange/cyan map pins. |
| `openair` | Open Air | `soft` | light | Mint daylight, teal + pink, park-session freshness. |
| `goldenhour` | Golden Hour | `soft` | mid | Sunset paper, burnt orange + dusk violet. |
| `solar` | Solar Fade | `soft` | mid | Solarized-Light sepia, muted orange/teal/mustard. |
| `synthwave` | Synthwave Stage | `soft` | dark | '84 retro neon: hot pink + cyan on deep purple, strongest pin glow. |
| `blackout` | Blackout | `mono` | dark | DICE-style stark: pure black, white, one electric blue `#4D7CFE`. |
| `hyper` | Hyperwave | `hyper` | light | Iridescent violet→magenta→cyan gradient on white chrome. |

Balance rule (product decision): **6 light/mid : 3 dark.** Any future additions should hold roughly this ratio.

---

## 2. Architecture

### 2.1 Attributes on `<html>`

```html
<html data-theme="print" data-family="print" class="">   <!-- class="dark" for dark skins -->
```

- `data-theme` — selects the **token block** (colours, fonts, radii, shadows, map palette, pin treatment).
- `data-family` — selects **structural CSS** shared by skins of the same shape-language: `print | hyper | soft | mono`.
- Tailwind's `.dark` class — set **in addition** for `bndy-dark`, `synthwave`, `blackout` so lifted shadcn components behave. Add `mode: 'light'|'mid'|'dark'` to the skin registry; `dark` sets the class.

**Why family exists:** colour must never be branched in component code, and structure must never be duplicated per skin. Adding skin #10 = one token block + one registry entry, zero component edits. This is an acceptance criterion (§9).

### 2.2 Token contract

Every component styles itself exclusively from these custom properties. Full values for all nine skins are in the prototype `<style>` head — **copy them verbatim** into `app/skins.css` (one `:root` block for `print`, one `[data-theme="…"]` block per other skin).

| Token | Meaning / where used |
|---|---|
| `--bg` `--card` `--card2` | Screen background; card surface; secondary surface (pressed/ghost). |
| `--ink` `--t2` `--t3` | Primary text; secondary text; tertiary/meta text. |
| `--line` `--bw` | Border colour; border width (2.5px print, 1.5px mono, 1px others). |
| `--rad` `--rad-lg` | Radius for controls/cards; radius for sheets. |
| `--sh` `--sh-lg` `--sh-hover` | Card shadow; prominent shadow; hover shadow. Print uses hard offset (`3px 3px 0 ink`); others soft/glow. |
| `--acc` `--on-acc` | Primary accent + text-on-it. Used by: gig pins, follow button, TONIGHT badge & day header, active date chip (soft/mono), splash accent, section-title italics. |
| `--acc2` `--on-acc2` | Secondary accent. Used by: venue pins, venue icon tiles, "follow venue", mono-family highlights. |
| `--hl` `--on-hl` | Highlight. Used by: FREE badge, venue gig-count chip, print/hyper active chip, `<mark>` hero highlight (print), tonight pin head (print/hyper). |
| `--disp` `--disp-wt` `--disp-case` | Display font family / weight / text-transform. (Archivo Black · Chakra Petch · Inter 800/900 per skin.) |
| `--ui` `--meta` `--ital` | Body font; mono metadata font (Space Mono everywhere); accent-italic font (Instrument Serif in print; disabled via `font-style:normal` overrides in soft/mono/hyper). |
| `--tick-bg` `--tick-fg` `--tick-hl` | Ticker + day-header strip colours (blackout inverts: white bar, black text). |
| `--m-bg` `--m-block` `--m-road1` `--m-road2` `--m-river` `--m-park` `--m-lab` `--m-lab-p` `--m-lab-r` | Map palette (see §6). |
| `--pin-bd` `--pin-sh` `--pin2-sh` `--pin-stem` | Pin border, gig-pin shadow/glow, venue-pin shadow/glow, stem colour. Dark skins define glows here — **no per-skin CSS rules for pins.** |
| `--grad` `--ring-c` | Hyper only: signature gradient; tonight-ring colour override. |
| `--pop` `--spring` | Easing tokens: `cubic-bezier(.2,.9,.3,1.25)` and `cubic-bezier(.34,1.56,.64,1)`. |
| `--stage` `--phone-border` `--phone-sh` | Desktop showcase only — not needed in the real app. |

### 2.3 Family structural rules (port from prototype selectors)

- **print** — hard shadows; ±0.35–0.5° card rotations (alternating nth-child); rotated stamps/badges; dashed spinning tonight ring; `<mark>` yellow hero highlight; halftone overlay class active; sheet corners square.
- **soft** — pill buttons (`border-radius:999px` on follow/icon/toggle), no rotations, borderless badges as pills, section headings plain text (no ink bar), halo-pulse tonight ring, accent-tinted nav pill.
- **mono** — radius ~0–2px, uppercase 900 display, inverted white ticker, nav active = bottom border in `--acc2`, badges square with 1.5px borders, `--acc2` takes over "hot" roles (tonight day-header, hearts) because `--acc` is white.
- **hyper** — gradient (`--grad`) replaces flat accent on: active chip, follow button, TONIGHT badge, day header, venue count chip, sheet CTA, nav tint, gradient-clipped text on section italics/hero mark.

### 2.4 Skin registry (TS)

```ts
export type SkinFamily = 'print' | 'hyper' | 'soft' | 'mono';
export interface Skin {
  key: string; name: string; desc: string;
  family: SkinFamily; mode: 'light' | 'mid' | 'dark';
  dots: [string, string, string];        // picker swatches
  pal: [string, string][];               // artist palette pairs (5 per skin — values in prototype THEMES)
}
export const SKINS: Skin[] = [ /* order = picker order: print, bndy-light, bndy-dark, openair, goldenhour, solar, synthwave, blackout, hyper */ ];
```

### 2.5 ThemeProvider + no-flash

- Context: `{ skin, setSkin }`. Persist to `localStorage['bndy-theme']` **and** to the user preference API when authenticated (so it roams devices).
- Setting a skin: write `data-theme`, `data-family`, toggle `.dark`, persist. Trigger the **wipe transition** (§7) around the swap (swap attributes at ~260ms into a 700ms fade-through-`--bg` overlay).
- **No-flash:** inline `<script>` in root layout `<head>` reads localStorage and sets all three attributes before first paint (same pattern as next-themes). Default `print`; unknown/legacy stored keys fall back to default silently.
- Tailwind: map semantic colours to the vars in `tailwind.config` (`colors: { bg:'var(--bg)', card:'var(--card)', ink:'var(--ink)', acc:'var(--acc)', … }`) so lifted shadcn components re-tokenise by alias, per plan §2. Also alias shadcn's own vars (`--background:var(--bg); --foreground:var(--ink); --primary:var(--acc); --border:var(--line); --radius:var(--rad)`) in `skins.css` so unmodified shadcn components inherit.

---

## 3. App chrome components

### 3.1 Splash (`<Splash/>`)
Full-screen `--bg`; wordmark letters stamp in sequentially (`stampin` keyframe, 0.5s `--spring`, 90ms/letter delay, 5th char = `--acc`); tagline pill "Keeping **LIVE** music alive!" (LIVE in `--acc2`) stamps at +0.6s; hint fades at +1.4s. Dismiss: tap anywhere or auto at 2.8s (fade 0.5s). Show on first load per session only. Respect `prefers-reduced-motion`: skip animations, show 1s static splash.

### 3.2 Ticker (`<LiveTicker/>`)
Full-width strip under masthead. `--tick-bg`/`--tick-fg`, Space Mono 10px, letter-spacing 3px, uppercase. Content from live data: `KEEPING LIVE MUSIC ALIVE ★ {n} GIGS TONIGHT ★ {v} VENUES ★ {a} ARTISTS ★ …` repeated; CSS `translateX(-50%)` loop, 24s linear infinite. Duplicate content ≥2× for seamless loop. `aria-hidden="true"` (decorative); pause on `prefers-reduced-motion`.

### 3.3 Masthead (`<Masthead/>`)
Wordmark `bndy.` in `--disp` (bndy skins: whole mark `--acc`, dot `--acc2` — matches live-site logo); right side: stacked mono date (weekday / d-mon-yyyy) + **theme button** (40px, conic swatch of `--acc/--acc2/--hl` — this is the skin-picker entry point, always visible).

### 3.4 Bottom nav
4 tabs (Map/Gigs/Artists/Venues), mono 8.5px uppercase labels, 22px stroke icons. Active states per family (§2.3). Existing router keeps state per tab; profiles push on top with back button (42px, top-left, `--card` + `--sh`).

### 3.5 Theme picker (`<SkinPicker/>`)
Bottom sheet (§5.4 behaviour) containing: title "Choose your skin", sub "Same gigs · your vibe · switches live", then a **2-column grid** of cards: 3 swatch dots (`dots`), name, one-line desc, "CURRENT" tag on active. Tap → `setSkin` + wipe + sheet closes. Keyboard: cards focusable, Enter selects. This is a first-class feature — keep it one tap from every screen.

---

## 4. Screens (port order follows greenfield plan §4)

All screens already exist in the prototype with full behaviour; re-implement with real data hooks (`useAllPublicEvents`, `useEventsForList`, `useVenues`, `useArtist`, `useVenue`) and keep these interactions:

1. **Map (home)** — date bar of 7 chips (TODAY + next 6; `--disp` day number, mono weekday; active = skin-styled per §2.3); Gigs/Venues layer toggle (pill, `--acc`/`--acc2` active fills); live count chip top-right (`--tick-bg`); pins per §6.
2. **Gig list** — search field (border → `--acc` on focus); sticky day headers (`--tick-bg` bar; TODAY variant = `--acc`; label TONIGHT/TOMORROW/weekday + mono date right); gig cards: 52px palette-gradient avatar with initials, artist name, venue · area (italic in print only), time mono, badge (TONIGHT `--acc` pulsing / FREE `--hl` / price outlined). Entrance stagger 40ms capped 360ms.
3. **Artists** — search + 2-col grid; card = 104px palette hero with initials, name, mono tags, "next: tonight at {venue}" teaser in `--acc`.
4. **Venues** — search + rows: 46px `--acc2` icon tile, name, area · capacity, gig-count chip (`--hl`).
5. **Artist profile** — hero (giant outline initials in bg, name in `--disp` w/ per-family mark treatment, tags/town line in `--acc`); follow (pill/stamp per family; toggling updates count) + heart + share icon buttons; stats row (followers/upcoming/rating); bio (print gets drop-cap); upcoming gigs (reuse gig cards, with date); "Live moments" 3×3 media grid (real images when present; palette-gradient tiles as fallback); social links row (Instagram/Facebook/Website).
6. **Venue profile** — hero (name marked in `--acc2` family treatment), follow-venue (`--acc2`), address card with "tap for directions", minimap snippet with venue pin, "What's on here" gig list.
7. **Gig bottom sheet** — see §5.4.

Empty states: display-font headline + one supportive line (copy in prototype).

---

## 5. Shared behaviours

### 5.1 Search
Client-side filter over name/venue/area/tags (reuse frontstage fuzzy-search util). Re-render with entrance stagger. Empty state as in prototype.

### 5.2 Follow / heart / plans
Optimistic local toggle with `fbpop`-style spring scale on change; wire to real endpoints when available. One `Set` per concern keyed by entity id (prototype behaviour), backed by user prefs when authed.

### 5.3 Stagger rule
List/grid/pin entrances: `animation-delay = min(index × 40–60ms, 360–600ms)`, `fadeup .35s ease both`. Re-run on every filter/skin change (rebuild, don't morph).

### 5.4 Bottom sheet
Slides up 0.4s `--pop`; dim backdrop `rgba(0,0,0,.45)`; drag handle; pointer-drag follows finger (clamp dy ≥ 0), release >80px dismisses, else springs back; tap backdrop closes; `max-height:80%`, inner scroll. Gig sheet content: avatar + artist/venue row; 3 fact tiles (TONIGHT-style day in `--acc`, doors time, entry price); CTA row ("+ I'm going" toggle + Share ghost); links to artist/venue profiles.

### 5.5 Screen transitions
Tab switch: `scrIn` (fade + 8px rise, 0.32s). Profile push: `pushIn` (fade + 56px slide-left, 0.36s `--pop`). Back = re-show previous (no reverse animation needed).

---

## 6. Map integration (MapLibre)

The prototype's SVG city is a stand-in. In `bndy-app`, the v2 map module renders the real basemap; the skin system supplies:

1. **Basemap per skin:** map module's skin registry gains an entry per app skin. Minimum viable: dark skins (`bndy-dark`, `synthwave`, `blackout`) → CARTO dark-matter; light/mid → CARTO positron/voyager. Ideal: tint via a style layer recolour pass using the `--m-*` tokens (bg/roads/water/park/labels) so Golden Hour's map is warm sepia, Open Air's is mint, Blackout's is near-black. `--m-*` values in the prototype are the colour targets.
2. **Markers:** lollipop DOM markers styled by tokens only (`--acc`/`--acc2` heads, `--pin-bd`, `--pin-sh`/`--pin2-sh` glow, `--pin-stem`). Tonight ring per family (print dashed spin / others halo pulse / hyper `--ring-c`). **All MapLibre mechanics — anchor wrapper transform rule, 44px hit targets, entry stagger, multi-gig-per-venue collapse, clustering, a11y — follow `marker-spec-after-dark.md` §3–§11 unchanged.** That spec's colour values are superseded by tokens; its rules are not.
3. **Date bar + toggle + count** float over the map exactly as prototype (top gradient scrim from `--bg`).

---

## 7. Motion reference

| Name | What | Duration / easing |
|---|---|---|
| `stampin` | splash letters & tagline: scale 2.2 rot −8° → overshoot .94 → settle | .5s `--spring` |
| `pinstamp` / `pinstamp-v` | pin entry: scale 2 (+rot for gigs) → settle, staggered 50–60ms | .4s `--spring` |
| `halo` | tonight ring (soft/mono/hyper): scale .9→1.35, fade .9→.25, loop | 2.2s ease-in-out |
| `spinring` | print tonight ring (dashed) + user-dot ring rotation | 6s / 10s linear |
| `fadeup` | list/grid/profile-section entrances | .35–.45s ease |
| `scrIn` / `pushIn` | tab / push transitions | .32s ease / .36s `--pop` |
| `wipego` | theme-change wipe: overlay `--bg` fades in-hold-out; attrs swap mid-way | .7s ease, swap at ~260ms |
| `tick` | ticker loop | 24s linear |
| hover/active | cards translate(−2,−2) + `--sh-hover`; active scale .96–.98; print uses shadow-collapse press | .15–.18s `--pop` |

`prefers-reduced-motion: reduce` → kill splash/stamp/halo/ticker/marquee/stagger; keep instant state changes. Animate only `transform`/`opacity`; never animate `box-shadow`.

---

## 8. Artist palettes (avatars & media fallbacks)

Each skin ships 5 colour pairs (`pal`). Assignment must be **deterministic**: `index = hash(artistId) % pal.length` (prototype uses array index; use a stable id hash in production so pagination doesn't recolour). Usage: avatar/hero = `linear-gradient(135deg, p0, p1)` (print: solid `p0` + halftone class); media-grid fallback tiles alternate the pair with rotating gradient angle. Real artist images (FB-enriched avatars) take precedence; palette is the no-image fallback, so the app never shows a grey square.

---

## 9. Acceptance criteria

1. **Zero hard-coded colours in components.** Grep for `#[0-9a-fA-F]` in component files → only `skins.css` and the registry may match.
2. **Add-a-skin test:** a new skin (token block + registry entry, no component edits) renders correctly on every screen. Do this once in review with a throwaway skin.
3. Skin persists across reload and (when authed) across devices; no flash of wrong theme on cold load (verify with dark skin + hard refresh).
4. All 9 skins × 7 surfaces (map, gigs, artists, venues, artist profile, venue profile, sheet/picker) pass a visual sweep against the prototype — same hierarchy, spacing, motion.
5. Contrast: body text ≥ 4.5:1 and accent-on-surface ≥ 3:1 in every skin (the shipped values pass; re-check any tweaks — mid skins are the tight ones).
6. Map markers obey marker-spec (no swim on pan/zoom, 44px targets, keyboard operable, reduced-motion clean).
7. Lighthouse mobile ≥ 90 perf on the home map route with skins CSS in place (it's one static stylesheet — no runtime cost beyond attribute swap).
8. Theme switch completes in <1s including wipe, with no layout shift after the wipe clears.

---

## 10. Suggested build order (maps to greenfield slices)

1. **Foundation PR:** `skins.css` (9 token blocks + family rules ported from prototype), skin registry, ThemeProvider + no-flash script, Tailwind var aliases, shadcn re-tokenisation, SkinPicker + wipe. *Acceptance #1–3 land here.*
2. **Chrome PR:** Splash, LiveTicker, Masthead, bottom nav, screen-transition wrappers.
3. **Map PR:** marker restyle to tokens + basemap-per-skin + floating date bar/toggle/count (with map module owner).
4. **Screens PRs:** gig list → venues → artist grid → profiles → gig sheet (each = port + re-skin, per plan §4).
5. **QA PR:** 9×7 sweep, contrast pass, reduced-motion pass, acceptance #4–8.

---

*Everything visual lives in `bndy-skins-v4.html` — keep it open while building. When in doubt, match the prototype.*

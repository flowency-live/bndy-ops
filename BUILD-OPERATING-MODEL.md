# bndy-app — Build Operating Model

How the greenfield rebuild is executed by multiple agents without diverging. Pairs with `GREENFIELD-REBUILD-PLAN.md` (what/why) — this is the how.

---

## 1. Orchestration model

**Sequence: Foundation (solo) → Slices (parallel) → Review gate → Merge. Wizard solo, last.**

- **Phase A — Foundation (single agent, sequential).** One coherent pass. Nothing parallel here — the foundation must be singular. Deliverables: Next 15 app config, design-token contract + light/dark + skin system, root providers (react-query, theme/skin, tenant), lifted data layer (hooks/services/types), tokenised shadcn kit, nav/chrome shell, the map module wired, home route live. **Frozen** at the end of Phase A — slices build against it and do not change it without an orchestrator-approved change.
- **Phase B — Slices (parallel agents, isolated git worktrees).** Independent verticals, one agent each, no shared-file edits:
  - `slice/gig-list`
  - `slice/venue-profile`
  - `slice/artist-profile`
  - `slice/artist-browse`
- **Phase C — Wizard (solo, last).** Too interdependent to parallelize (Google Places, multi-step, react-hook-form). Until done, "Add event" deep-links to the old app.

**Orchestrator** (lead) owns: Phase A, the shared contracts, spawning slice agents, running the review gate, and integration/merge. Slice agents never merge their own work.

**Isolation rule:** each slice agent works in its own worktree and touches only `src/app/<route>/**` and `src/features/<domain>/**` (its own domain module) + its tests. Shared files (`domain/`, `components/ui`, tokens, providers) are **read-only** to slices; changes there go through the orchestrator.

---

## 2. Architecture conventions (all agents)

- **DDD-lite.** `src/domain/<entity>/` holds domain types + pure logic (Event, Venue, Artist, Act, Festival) using the backend's ubiquitous language. No React, no fetch in `domain/`. `src/features/<entity>/` holds the UI + hooks for that vertical. `src/lib/services/` does I/O. UI stays dumb.
- **One map engine.** MapLibre via the `map` module only. No Mapbox/Deck.gl/Leaflet.
- **Tokens, not hex.** All colour/surface/spacing via CSS-var tokens (`:root` + `.dark`). **No hardcoded colours** in components — reviewer rejects them. Skins override tokens.
- **Mobile-first, always.** Design at a 380px baseline first; every component works thumb-reachable on mobile before desktop. Cutting-edge + mobile-optimised is the bar on every screen.
- **Rendering.** Static/ISR by default; tenant detection in middleware; public pages use `revalidate`, never `no-store`; no data-fetching in the root layout.
- **No fetch-everything.** Lists are viewport/paginated or virtualized; the map is viewport-driven against the geo endpoint.
- **Env, not literals.** All API calls via the service layer + `NEXT_PUBLIC_API_URL`. No hardcoded `api.bndy.co.uk`.

---

## 3. Testing strategy

- **TDD (test-first) for logic:** `domain/*`, data transforms (DynamoDB→domain), hooks, filter/grouping/date utils, services. Red → green → refactor.
- **Behaviour tests (React Testing Library) for components:** interactions, states, a11y roles — not pixel snapshots.
- **Visual + mobile checks:** screenshot the route at 380px and desktop; verify against the design language.
- **Gates:** `tsc --noEmit` clean; unit + component suites green; domain-layer coverage target ≥ 90%; no console errors on the route.

---

## 4. Definition of Done (per slice)

1. Route renders with real data from the live API via the service layer.
2. Domain logic test-first, ≥ 90% covered; component behaviour tests pass.
3. `tsc --noEmit` clean; lint clean; no console errors.
4. Mobile-first verified at 380px + desktop screenshot attached.
5. Tokens only (no hardcoded colours); light + dark both correct.
6. Visual parity to the new design language; matches the map's chrome vocabulary.
7. SEO metadata present for public pages (venue/artist profiles).
8. Passed the review gate (§5).

---

## 5. Code review gate

- Every slice diff is reviewed by a **dedicated reviewer agent** (not the author) against the DoD + conventions checklist before merge.
- Auth/data-touching slices additionally run **`/security-review`**.
- Reviewer checks: token compliance, mobile at 380px, no fetch-everything, a11y, TS-strict, test coverage, no dead/over-engineered components carried over, no hardcoded URLs.
- **Merge only on green.** Author never self-merges. Orchestrator integrates.

---

## 6. Cutover

- `bndy-app` on a preview origin; **per-route reverse proxy** — new app serves migrated routes, proxies the rest to the old app, so users see one site.
- Flip a route only when it hits DoD. Retire the old app after the wizard lands and all routes have flipped.

---

## 7. Migration order (value vs risk)

Foundation + home map → gig list → venue profile → artist profile → artist browse → **wizard (last)** → about/chat/dropzone.

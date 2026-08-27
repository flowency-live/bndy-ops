# GIG WIZARD — public "Add a gig" for bndy-app

**v1.0 · 2026-08-06 · Author: Claude (CTO session) · Status: SPEC — approved decisions baked in, 3 open questions at bottom**
**Builds on:** audit of bndy-serverless-api community endpoints + RUNBOOK v2.8 (vault) + review-queue PRD (CTO-DECISION-02). No prior wizard spec exists; old frontstage `PublicGigWizard` (route `/new`) informs concepts only — NOTHING is ported.

---

## 1. Product frame

Public, no-auth (auth wraps the route later — build so gating is one layout guard). Users are non-technical. One gig = one artist + one venue + one date/time (MVP). The wizard's signature: **the gig card builds itself live** as you answer — the same GigSheet card users already see on the map assembles step by step, so they always understand what they're making.

**Locked decisions (Jason 2026-08-06):**
1. Publish = **live + flagged**: writes go straight to bndy, stamped `needsReview: true` (+ `source: 'community_wizard'`) so the godmode review queue (BUILD-BRIEF-02, not yet built) can audit later. Flags live on records now; queue UI later.
2. New artists: **create with enrichment prompts** (graceful degrade to minimal): location always required; FB URL / genres / actType asked for but skippable. Backend dupe-gate has final say.
3. Poster: **URL field only** (generated bndy posters = phase 2).
4. No submitter capture. No auth. (Later: auth wrapper supplies identity → trust precedence.)

**MVP excludes:** multi-artist lineups, open mic, poster generation, event editing after publish, recurring gigs. The community event endpoint already supports `artistIds[]` + `isOpenMic`, so phase 2 is additive.

---

## 2. Entry points (3)

| From | Trigger | Prefill |
|---|---|---|
| Artist profile | `+ Add a gig` button beside the events header | artist locked (step skipped, shown as done) |
| Venue profile | `+ Add a gig` beside "What's on" | venue locked |
| Anywhere | `+` item in the app nav (map/gigs/artists/**add**) | nothing |

Route: **`/add`** (`?artistId=` / `?venueId=` for prefills). A real route, not a sheet: survives refresh, shareable, deep-linkable from socials ("list your gig on bndy" campaigns later).

---

## 3. Flow — 4 steps + done

Progress = 4 dots across the top (skin accent). Steps render in the app shell, mobile-first, one primary action per screen. **Right rail (desktop) / collapsed header card (mobile): the live gig-card preview**, assembling as fields land. Back always works; state survives refresh (sessionStorage).

### Step 1 — WHERE (venue)
- Search box, instant results from the **cached venues list** (client-side, zero latency — app already loads all venues): name + town + a mini map thumb per row.
- Secondary affordance: **"Pick from the map"** — slim embedded MapView (venue mode, diamonds + name pills, tap to select).
- No match → **"Search everywhere"** → Google Places (NEW proxy endpoints, §6) UK-biased autocomplete → picking a result shows a confirm card: Google's name + address + map pin, copy: *"This is what we found — is this your venue?"* → confirm calls `POST /api/venues/find-or-create` (passes `googlePlaceId` explicitly).
  - Ladder returns an existing bndy venue (place_id gate) → silently use it ("Already on bndy ✓").
  - Google finds nothing (422 `needsReview`) → friendly dead-end: *"We couldn't verify that venue. Double-check the name/town — or pick the venue on the map."* NEVER free-text venue creation (RUNBOOK §0.8: no venue without a place_id; no guessed towns).
- Name-mismatch discipline (§3): the confirm card exists precisely so the user rejects a wrong pub. Wrong-town same-name pubs ("Golden Lion" problem) are covered because selection is place-backed, never name-backed.

### Step 2 — WHO (artist)
- Type-ahead over the **cached artists list**, fuzzy client-side: normalise like the backend (lowercase, strip punctuation/whitespace, strip leading "The", strip trailing Band/Duo/Trio, `&`↔`and`) + contains/startsWith ranking. **Every candidate row shows name + location + gig count** — this is the Ant Hill Mob defence: typing "ant hill" surfaces all three, distinguishable by place, and the user picks theirs.
- Nothing right → **"Add a new artist"** inline mini-form:
  1. Name (pre-filled with what they typed).
  2. **Location — required**, placeholder "Home town (e.g. Stoke-on-Trent)". Copy: *"Where are they based? This is how we tell same-named acts apart."*
  3. Facebook page URL — optional but sold hard: *"Paste their Facebook page — we'll pull their photo and details."* (FB URL = strongest identity key, §1/§1A.2.)
  4. Genres (chips, enum from `artists-lambda/lib/genres.js` — free text is a 400) + act type chips (Covers / Originals / Both — skippable; **never silently default** per §0.18/§2A.2: skipped = blank).
  - Submit → `POST /api/artists/find-or-create` **with `dryRun: true` first** (NEW flag, §6):
    - `matched` → *"Found them! ✓"* → use existing id (billing aliases resolve here via nameVariants).
    - `review` → **"Did you mean…?" cards** (candidates w/ location + recent venues). Explicit *"No — mine is a different act"* → allowed only when the new location resolves to a different region (client pre-check + server verdict) → re-submit with `confirmNew: true`. Same region → the UI does not offer create at all (§1A: same name + same region = same act, ever): *"That name's taken in {region} — if this is a different act, tell us where they're based."*
    - clear → real create (`confirmNew` not needed). 409 `DUPLICATE` → treat as matched, never as an error.
  - All wizard-created artists: `needsReview: true` stamped (backend, §6) → enrichment agent + review queue top up later. This is the sanctioned §2A degrade for humans: the two-surface FB search bar is an *agent* obligation; the wizard captures what the user actually knows and flags the record.

### Step 3 — WHEN (+ extras)
- Date: calendar (future only), today/tomorrow/next-Fri quick chips.
- Start time: pre-selected smart default by day (§5.6: Fri/Sat 21:00 · Sun 19:00 · weekdays 20:00), wheel/dropdown to change. Optional end time behind "+ end time".
- Ticketed toggle (default off — free is bndy's default): on → ticket URL + short ticket info. Ticket stub appears on the live preview immediately.
- "+ More" reveals: further info (textarea), poster image URL.

### Step 4 — CHECK & PUBLISH
- The completed gig card (GigSheet Body, exact same component) full-size. **Title shown editable-on-tap**, pre-inferred `{Artist} @ {Venue}` and kept in sync until the user overtypes (then frozen — track a `titleTouched` flag).
- Publish → orchestration (§5) → success screen: big tick, the card, **Share button** (existing share flow), *"See it on the map"* deep-link centred on the venue with the date filter set. Instant gratification is the whole point of decision 1.
- Dupe 409 from the event gate → *"Good news — this gig's already listed!"* + the existing gig's card + share. A dupe attempt ending in delight, not an error.

---

## 4. Identity rules → wizard behaviours (runbook mapping)

| Runbook | Wizard translation |
|---|---|
| §1 venue UID = place_id | Selection is always bndy-venue or Places-confirmed. No free-text venues. |
| §1/§1A artist same-name | Candidates always show location; same-region create is impossible in UI AND rejected server-side (409). Different-region create requires explicit "mine is different" (= `confirmNew`). |
| §1A.5 billing aliases | `find-or-create` matches nameVariants automatically — wizard inherits it free. |
| §1A.7 review ≠ dupe | "Did you mean…?" cards + sanctioned `confirmNew` path. |
| §2A enrichment | Prompted (FB/genres/actType), not forced; `needsReview` flags the record for the agent bar. Blank beats wrong: no silent defaults. |
| §3 name-mismatch = reject | The Places confirm card. |
| §5.2 isPublic | Community endpoint defaults `isPublic: true` ✓ (verified in code). |
| §5.6 default times | The smart-default start time. |
| §0.12 no QA notes in public fields | Wizard writes flags only in `needsReview`/`source`, never in text fields. |

---

## 5. Submit orchestration (frontend)

Sequenced, each step idempotent-safe, spinner copy per phase ("Checking the venue…", "Finding the artist…", "Publishing…"):
1. Venue: existing id OR `find-or-create` result (may have happened in step 1 — cache it; re-submit is safe, ladder returns same id).
2. Artist: existing id OR `find-or-create` (real run; `dryRun` verdict already previewed).
3. Event: `POST /api/events/community` `{ artistId, venueId, date, startTime, endTime?, title (if touched), ticketed?, ticketUrl?, ticketInformation?, imageUrl?, description?, source: 'community_wizard' }`.
4. Error map: 409 → "already listed" happy path · 422 `DATA_QUALITY`/`LOCATION_UNRESOLVABLE` → inline field guidance · 400 `INVALID_GENRES` → shouldn't happen (enum chips) · network → retry with state intact.

---

## 6. Backend work needed (VSCode agent — the wizard is 80% frontend, these unblock the rest)

| # | Change | Where | Why |
|---|---|---|---|
| B1 | **Places proxy**: `GET /api/places/suggest?q=&lat=&lng=` + `GET /api/places/details?placeId=` — UK-biased, session tokens, 60s cache, key from existing Secrets Manager wiring | venues-lambda (key + client already there); check 25-route cap | No public Places access exists; never ship the key client-side |
| B2 | **CORS fix**: `getCommunityHeaders()` hard-codes `live.bndy.co.uk` on `/api/artists/search`, `/community`, `/find-or-create` → switch to the dynamic allowlist (add gigmap.bndy.co.uk + localhost) | artists-lambda handler.js:3719 | Wizard is dead on arrival without it |
| B3 | **`dryRun: true`** on `POST /api/artists/find-or-create`: full resolution verdict, zero writes | artists-lambda :2459 | Type-ahead resolution preview without create side-effects |
| B4 | **`needsReview: true` stamps** on community-created artist + event (+ newly created venue via find-or-create when caller is the wizard — pass `source: 'community_wizard'` through) | all three lambdas | Decision 1 (live + flagged); feeds BUILD-BRIEF-02 queue |
| B5 | Remove dead `POST /api/venues/community` route from template.yaml (no handler — 404s) | template.yaml:458 | Hygiene; avoid accidental use |
| B6 | Export genres enum to a shared constant consumed by bndy-app (comment linking `lib/genres.js` as source of truth) | docs/frontend | Free-text genres are rejected |

Existing endpoints reused as-is: `GET /api/artists/search` (first-pass candidates), `POST /api/artists/find-or-create`, `POST /api/venues/find-or-create`, `POST /api/events/community`. Gates stay in enforce — the wizard treats 409s as answers, not errors.

## 7. Frontend build (Claude)

New: `src/app/add/page.tsx` + `src/features/wizard/` — `WizardShell` (dots, back, preview), `StepVenue` (cached-list search / map picker / Places), `StepArtist` (fuzzy + resolve cards + mini-form), `StepWhen`, `StepReview`, `livePreview` (GigSheet Body reuse), `fuzzy.ts` (client normaliser mirroring backend `normaliseKey`), `api.ts` additions (findOrCreateArtist/Venue, createCommunityEvent, placesSuggest/Details), entry buttons in ArtistProfile / VenueProfile / app-shell nav. All skin-token styled; every interactive ≥44px; AA everywhere (existing token pairs).

## 8. Acceptance (agent verifies before deploy)

1. tsc clean; all three entry points prefill correctly; refresh mid-wizard keeps state.
2. Ant Hill test: type "ant hill" → all three existing acts listed with locations; same-region create impossible; `confirmNew` path works cross-region.
3. Venue test: known venue via cache, new venue via Places confirm card, garbage venue name → friendly dead-end, no record created.
4. Dupe gig → "already listed" card. New gig → live on map within 60s (cache TTL), `needsReview: true` + `source: 'community_wizard'` on record.
5. Mobile (390px) + desktop, 3 skins minimum (print, bndy-dark, poole).

## 9. Open questions — ANSWERED (Jason 2026-08-06)

1. **Nav entry**: `+` as 4th nav item. ✅ Confirmed.
2. **Rate limiting**: recommend + apply → **B7 for the agent**: AWS WAF WebACL on the API Gateway stage, rate-based rule ~100 req/5min per IP scoped to `POST /api/artists/find-or-create`, `POST /api/artists/community`, `POST /api/venues/find-or-create`, `POST /api/events/community`, and the two new `/api/places/*` GETs (Places quota protection). Block action, default allow elsewhere. Record the WebACL ARN in DEPLOYMENT.md.
3. **Step order**: venue-first stands. ✅ Confirmed.

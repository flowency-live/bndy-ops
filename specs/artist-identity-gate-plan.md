# bndy — Stopping Duplicate Artists for Good
### Enforcing artist identity by **name + location (+ Facebook)** across every entry point
_Written 2026-07-03. Context: a second "Not Guilty" (Yorkshire) was created with zero collision check against the existing Stoke "Not Guilty"; the API returned "created (legacy community path)". This is the same failure that produced the ~120 duplicates just cleaned up and the 97+33 orphaned events._

---

## 1. The one rule we are enforcing (the invariant)

> **Two artist records may share a name only if they are distinguishable — by a different non-empty location/region, or by a different Facebook URL. Otherwise they are the same artist and must be one record.**

Concretely, for any two artists A and B:

- If `normalise(A.name) == normalise(B.name)` **and** same region **and** no distinguishing Facebook URL → they are the **same artist**. Never two records. Reuse.
- Same normalised name, **different** non-empty region → **allowed** (distinct acts, e.g. Not Guilty Stoke vs Not Guilty Yorkshire).
- Same normalised name where **either record has no location** → **not allowed to coexist**. A create in this state must be blocked and sent to review, because the two cannot be told apart.
- **Exact Facebook URL match = same artist**, regardless of name spelling (strongest signal).

**Location is a first-class, mandatory identity attribute** — not an optional differentiator. Every artist record must carry a usable location/region; identity is `normalise(name)` **+ region** (**+ Facebook** as the strongest key). A record without a location cannot participate in identity resolution, so no artist may exist without one. This makes the existing-data enrichment in Layer 7 a **prerequisite**, not a nice-to-have.

Supporting definitions (must be identical everywhere — backend, MCP, scripts, frontend):

- **normalise(name)** = lowercase → `&`→`and` → strip punctuation/apostrophes → strip leading `the ` → strip trailing tokens {band, duo, trio, acoustic, live, music, uk} → collapse whitespace → leet-fold (`3`→`e`, `0`→`o`, `1`→`i`, `5`→`s`).
- **region bucket** = canonicalise a location string (or lat/lng) to a coarse area (NE, Staffs, Hants, NW, Derby, …). `"stoke-on-trent"`, `"staffordshire"`, `"newcastle-under-lyme"` → same bucket. **Unknown/empty never counts as a match** (so a location-less record can't be silently merged into a real one).

---

## 2. Why it happens today (root cause)

1. **`create_artist` has a "legacy community path" that inserts blind.** The ADR-014 find-or-create resolver that is *supposed* to match/refuse/review is not engaging — every create falls through and just writes a new row. No name check, no location check. (Proven live today.)
2. **The only dedup in the live pipeline is advisory, in the import prompts.** They call `search_artist`, which ranks by **name** (Levenshtein); region is an *optional* filter a caller can omit. So a name-only hit attaches a Yorkshire gig to a Stoke band — or wrongly merges two different-region bands.
3. **Location is optional and frequently empty.** Many existing artists have no location, so even a location-aware check has nothing to compare — they are permanent landmines.
4. **Multiple independent writers** (5 scheduled imports, discovery/spider, MCP, Backstage manual, dropzone) each create artists their own way. There is no single chokepoint, so a rule can be enforced in one place and bypassed in four others.

No single fix is enough. The plan below is **defense in depth**: make the safe path the *only* path, then back it with a hard database constraint, then validate at every edge.

---

## 3. The fix, layer by layer

### Layer 1 — One backend resolver, and make it the ONLY way to create an artist  *(this is the real fix)*
Everything that creates an artist — MCP, every script, Backstage, dropzone — must call a **single** `resolveArtist()` service in `serverless-api`. Delete/disable the legacy community path so there is literally no other way in.

`resolveArtist({ name, location|region, facebookUrl, ...})` returns one of:

- **`matched`** → an existing artist is the same act; return it, create nothing. Triggered by: exact Facebook URL match; OR same `normalise(name)` + compatible region.
- **`created`** → genuinely new; only allowed when **location is present** AND (no same-name record exists, OR a same-name record exists but in a **different** non-empty region). On create, store the normalised key and, if a same-name sibling exists, record it in `nameVariants`/a "disambiguated from" note.
- **`review`** → ambiguous; **do not write**. Return the candidate(s) to the caller and enqueue for human resolution. Triggered by: same name + one side has no location; same name + region unknown; fuzzy near-miss (edit-distance ≤2) on the normalised key.

Resolver requirements:
- **Location is mandatory.** Reject any create with empty location (→ `review`, "location required").
- Use the existing `name_lower` / `name_prefix` attributes (already on the table) as the lookup index; add a **GSI on `facebookUrl`** for FB-identity matching.
- Same normalisation + region code as §1, shared as one library (not re-implemented per caller).

### Layer 2 — A hard database constraint so duplicates are physically impossible
Application logic can have bugs; the datastore should refuse to store a duplicate regardless.

- Add attribute **`identity_key = normalise(name) + '#' + region_bucket`** to every artist.
- Writes use a **DynamoDB conditional put (`attribute_not_exists(identity_key)`)** — or a companion "identity" item written in a `TransactWriteItems` with the artist. Two creates that resolve to the same name+region can no longer both succeed; the second fails and routes to `matched`/`review`.
- This closes the race between concurrent imports and guarantees the §1 invariant at the storage layer.

### Layer 3 — Facebook URL as a first-class identity key
- Normalise FB URLs (strip trailing slash, `/about`, query params, lowercase host) and store `facebook_key`.
- Exact `facebook_key` match ⇒ same artist, even if the names differ ("Not Guilty" vs "Not Guilty Band"). This is often more reliable than the name and should be checked **first** in `resolveArtist`.

### Layer 4 — MCP tools (`mcp__bndy-events__*`)
- `create_artist` must call the fixed `resolveArtist` (not the legacy path) and **faithfully return `matched | created | review`** with candidate details. Today it claims to do this in its description but doesn't — fix the wiring.
- Keep `location` required (schema already requires it) **and** have the server reject empty/whitespace.
- When the resolver returns `review`, the tool returns the candidates and creates nothing — the agent/caller must choose.
- **Fix `edit_event(artistId=…)`** while in here: it currently returns fake success without persisting the reassignment (this orphaned 33+97 events). Either fix it or remove it so no one trusts it.

### Layer 5 — Import scripts & scheduled tasks (KLMA, Scenic Eye, On The Case, Gigs-news, discovery)
- Stop the ad-hoc "search then maybe create." Every artist touch goes through `resolveArtist` with **name + a derived region** (from the gig's venue city/geography) + any Facebook URL found during enrichment.
- **Never create without a resolved location.** If the source and venue give no location, the run must **queue the act for review**, not create a location-less record.
- Regression check: something changed in these prompts ~4 weeks ago (they ran clean before). Diff the current prompt text against the last-known-good version and restore the region-aware pre-create step. (Read-only audit first; I can do this.)

### Layer 6 — Manual creation (Backstage owner tool, and /dropzone)
This is where you create artists by hand, so it needs the same gate:
- **Make `location` a required field** on the create form — cannot submit without it.
- On submit, call `resolveArtist`. If a same-name artist exists, **show it inline**: *"A 'Not Guilty' already exists in Stoke-on-Trent. Is this the same act?"* → **[Use existing]** or **[Create as new]**. "Create as new" is only enabled if the new record has a **distinct** location **and** the existing one also has a location.
- Never let the client write directly to Dynamo; it must go through the same API resolver as everything else.

### Layer 7 — Location backfill (PREREQUISITE — location is a mandatory identity key)
Because location is now part of identity, no artist may exist without one, so this must happen **before** strict enforcement can be switched on. Measured scope (from the current data): **331 of ~1,985 artists have no usable location** (224 blank + 107 just "UK"). Only **12** artists anywhere are geocoded — locations are bare text labels — so the backfill should also add lat/lng.

Tiered method (most of it is automatic):

1. **From their own gigs — 149 artists (no Facebook needed).** Every event already carries venue geo (lat / geohash). Infer the artist's region from where they actually play (majority/centroid of their venue locations). Zero manual work, no Chrome; run from data.
2. **From Facebook — 137 artists** (no gigs, but have a FB page). Read the town/city from the FB profile (Chrome, bndy profile logged in) and geocode it.
3. **Manual / other-source — 45 artists** (no gigs, no Facebook). Check website/other socials; otherwise a short review list for you. Small enough to eyeball.

Then, for **all** rows: backfill `identity_key`, `name_lower`, `facebook_key`, `nameVariants`, and lat/lng. Finally resolve the remaining known duplicates (the 13 staged + 7 old from the current cleanup) so the table starts clean.

> Note: the MCP `list_artists(missingLocation:true)` filter is unreliable — it reported 77 when the true blank-location count is 224. Use a full-table scan (or the identity check in Layer 8) for this, not that filter.

### Layer 8 — Standing guardrail (so it never silently regresses)
- A scheduled integrity check (daily) that reports: any two artists sharing a normalised name where either lacks a location; any same-name-same-region pair; any event whose `artistId` isn't a live artist (orphan detector — would have caught the 97 months ago).
- Log every `resolveArtist` call with `action` + reason; surface the `review` queue and alert on any `created` that collided with an existing normalised name.

---

## 4. Suggested rollout order

1. **Backfill locations** on existing artists (Layer 7) — location is now an identity key, so enforcement is impossible until every artist has one. 149 auto from gigs, 137 from Facebook, 45 manual. Highest leverage, lowest risk; start here.
2. **Build `resolveArtist` + the DB conditional constraint** (Layers 1–3) — the chokepoint and the hard guarantee.
3. **Point MCP + all scripts at it** and disable every legacy/direct-write path (Layers 4–5). Also fix `edit_event`.
4. **Backstage/dropzone form**: required location + collision prompt (Layer 6).
5. **Turn on the daily integrity guardrail** (Layer 8).

Steps 1, 2, 4, 8 are backend/Vincent. Steps 3 and the script/prompt regression I can drive.

---

## 5. Decisions for you

- **Region granularity:** enforce match at coarse bucket (NE / Staffs / Hants…) or finer (town)? Coarser = fewer accidental duplicates but occasionally merges two same-name acts in one region (rare); finer = the opposite. Recommend coarse bucket + Facebook URL as the tie-breaker.
- **Location-less legacy artists:** block all creates now (strict) or allow a grace period while the backfill runs? Recommend backfill first, then strict.
- **Who owns `resolveArtist`:** confirm this sits in `serverless-api` as the single write path and every client loses its direct-create ability.

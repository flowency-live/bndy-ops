# VSCODE AGENT TASK — Make `nameVariants` a real alias key (+ two small fixes)

**Raised:** 2026-08-01 by the CTO session · **Owner:** Jason
**Repos:** `bndy-serverless-api` (artists + venues lambdas) · `bndy-MCPServer`

---

## 0. The problem, in one real case

Lemonrock listed a band as **`Pv Rocks`**. The act is actually **Poole Vigilantes** (`facebook.com/pvrecordingsinc`, 897 followers, "Classic Heavy Rock from Dorset", own site `pvrocks.co.uk`). Jason corrected the name in bndy by hand.

**Nothing currently stops the next import re-creating "Pv Rocks" as a second artist.**

`nameVariants` exists on the artist record and is returned by `get_by_id` — but it is **dead weight**:

1. **It is absent from the `edit_artist` MCP tool schema.** Passing it is silently ignored: the write succeeds, `updatedFields` doesn't list it, no error is raised. Verified live 2026-08-01 on two records.
2. **Identity resolution never reads it.** `artists-lambda/lib/identity.js` builds keys via `buildArtistUniqueKeys(name, location, facebookUrl)` — a normalised name key plus an optional Facebook key. There is **no occurrence of `nameVariants` or `name_variants`** in `identity.js` or `unique-gate.js`.

So today the **only** working alias mechanism is `facebookUrl` — `create_artist` matches on `facebook_key` (confirmed live: NU CALL returned `action: "matched", matchedBy: "facebook"`). That works, but it only helps once an act has been enriched, and it can't express "this billing string means this artist".

---

## 1. What to build

### 1a. Expose `nameVariants` on the MCP write path
Add to **`edit_artist`** and **`create_artist`** tool schemas:
```
nameVariants: string[]   // alternative names / billing strings that mean THIS artist
```
Persist as `name_variants` (match the lambda's existing snake_case convention). **Additive merge by default**, mirroring `externalIds`, with a `replaceNameVariants` boolean for the replace case. Never silently drop an unknown parameter — see §3.

### 1b. Make the resolver consult it — the actual point
In `artists-lambda/lib/identity.js`, `buildArtistUniqueKeys()` currently returns a name key + optional facebook key. Extend so that **each entry in `name_variants` also produces a name key** for that artist, normalised identically to the primary name.

Result: an incoming `Pv Rocks` normalises to the same key as the stored variant `Pv Rocks` on the **Poole Vigilantes** record, so find-or-create returns `action: "matched"` and reuses it.

**Constraints that must hold:**
- A variant key must **never** override an exact primary-name match. Primary wins.
- Two different artists must not be allowed to claim the same variant key in the same region — that recreates the ambiguity the sentinel gate exists to prevent. On collision, return `action: "review"` with both candidates rather than guessing.
- Variant keys participate in the uniqueness gate, so adding a variant that collides with an existing primary name must be **rejected on write**, not discovered later at import time.

### 1c. Backfill the known aliases
Once 1a and 1b land, the alias tables stranded in markdown can finally migrate. Seed from `sources/*.md`:
- `Pv Rocks` → **Poole Vigilantes** (`791a1d3a-fdfd-41c7-9801-b8eb40faa3d0`)
- `Zoe Schwarz Bluez Party`, `Zoe Schwarz Blue Commotion` → **Zoe Schwarz** (`404e13b8-718f-4561-8495-c752d852ddab`)
- `Funky Friday with Barclay` → **Barclay** (`113b211f-226e-45d8-8a84-c6883c90b451`)
- Plus the documented billing aliases: Danny Brab (`FIT600aoQ5lpNSejGctN`), Rachel Shenton (`vOcRqNQmZpVLd5T4X5o9`), Tanky (`a603777d-25f1-4f4c-9d13-866a4a0fe49c`), The Vanz (`7a16a3b6-ed61-4d0f-8191-1d89fdcf440f`), Russ Tippins, Dog In A Box, Rock and Roll Preachers.

These are exactly the "LearnedRule / alias" records in the Review Queue PRD (`BUILD-BRIEF-02`). **This task is its prerequisite** — the rule store has nowhere to write until `nameVariants` is settable and honoured.

### 1d. Same treatment for venues
`venues-lambda` has the identical `nameVariants` field and the same gap. Venue identity is `google_place_id`, so the dedup risk is lower, but venue name variants ("The Swan" vs "Swan Inn, Stone") are a documented match problem and belong in the same mechanism.

---

## 2. Genre validation — shipped and working, one defect

Verified live 2026-08-01. **Both halves work:**
- `["rock", "Soul"]` → stored as `["Rock", "Soul"]`. Case-insensitive normalisation to the canonical form. ✅
- `["Nonsense"]` → rejected, not written. ✅

**Defect: an invalid genre returns `HTTP 500: Internal server error`.** It should be **`400`** with a message naming the offending value and, ideally, the allowed list — e.g. `"Invalid genre 'Nonsense'. Allowed: Rock, Rock n Roll, …"`. A 500 is indistinguishable from a genuine server fault, so a caller can't tell bad input from an outage and will retry pointlessly. Cheap fix, and it makes the guard self-documenting.

While here: confirm the same validation and normalisation is applied on the **bulk-import path** (`events-agent-lambda/handler.js` writes `genres: artistData.genres || []` straight through), not just on the artist create/update routes. That path is where LLM-generated genre strings enter.

---

## 3. Cross-cutting: stop silently dropping unknown parameters

`edit_artist` accepted `nameVariants`, returned `success: true`, and discarded it. That is the worst possible failure mode — the caller believes the write landed. **Reject unknown parameters with a 400 naming them**, across the MCP surface. This one behaviour cost a full session's confidence in what had actually been written.

---

## 4. Acceptance

1. `edit_artist(nameVariants: [...])` persists, and `updatedFields` lists it.
2. `create_artist` with a name matching an existing artist's `nameVariants` returns `action: "matched"` with that artist's id — **no new record**. Test literally with `Pv Rocks` against Poole Vigilantes.
3. An exact primary-name match still wins over any variant match.
4. Adding a variant that collides with another artist's primary name in the same region is rejected on write.
5. Two artists claiming the same variant in one region → `action: "review"` with both candidates, never a silent pick.
6. Invalid genre returns **400** naming the value, not 500.
7. Unknown MCP parameters return 400 rather than being ignored.
8. Venue `nameVariants` behaves equivalently.

## 5. Traps

- Read every write back with `get_by_id`. `search_artist` and `search_event` both have documented false-negative modes — never confirm with them.
- `edit_event(externalIds)` **replaces and dedupes to one id per source**; don't copy that pattern for nameVariants, which must merge.
- Don't touch owner-managed records (§0.16).

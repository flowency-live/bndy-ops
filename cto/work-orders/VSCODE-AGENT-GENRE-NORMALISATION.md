# VSCODE AGENT TASK — Genre vocabulary: enforce it, then clean it

**Raised:** 2026-07-31 by the CTO session · **Owner:** Jason
**Repos:** `bndy-backstage` · `bndy-serverless-api` · `bndy-types` · `bndy-MCPServer`
**Why now:** the enum exists and is correct. Nothing enforces it, so every write path can and does bypass it.

---

## 0. The situation, measured

The canonical list is **26 values** in `bndy-backstage/client/src/lib/constants/genres.ts`:

```
Rock · Rock n Roll · Grunge · Metal · Punk · Alternative · New Wave · Pop · Indie ·
Britpop · Mod · Blues · R&B · Country · Americana · Folk · Soul · Funk · Motown ·
Electronic · Dance · Jazz · Classical · Reggae · Latin · Other
```

Title-case, case-sensitive everywhere. (The file header comment says "25 genres"; the array holds 26. Fix the comment.)

**Nothing enforces it:**
- `isValidGenre()` is declared in that same file and has **zero call sites**. Dead code.
- `GenreSelector`'s props are `selectedGenres: string[]`, not `Genre[]` — off-list values round-trip through the UI untouched.
- `artists-lambda/handler.js` does `genres: Array.isArray(genres) ? genres : []` and writes straight to DynamoDB. No membership test, no normalisation. Same on the update path (duplicated at ~1160 and ~3283).
- `openapi-integration.yaml` declares `genres: {type: array, items: {type: string}}` — **no `enum:`**, unlike `artistType` and `actType` which are properly constrained.
- `events-agent-lambda/handler.js` bulk import writes `genres: artistData.genres || []` — LLM output verbatim. Note the adjacent line `.toLowerCase()`s `act_type`. Genre got nothing.
- `bndy-types/src/artist.ts` holds a **second, stale 12-value `MusicGenre` union** including `Disco`, mirrored by hand in `utils.ts`. `bndy-backstage` does not depend on `bndy-types` at all. It is abandoned but still misleads.

**Live data — 992 artists, 2,071 genre assignments:**

| Class | Distinct | Assignments | |
|---|---|---|---|
| Exact canonical | 23 | 1,052 | 51% — fine |
| **Case-only mismatch** | 22 | **438** | 21% — purely mechanical |
| **Off-list** | 182 | **581** | 28% — needs judgement |

---

## 1. Fix the code first — do NOT clean data before this

Cleaning without enforcement means it re-drifts within days.

1. **Wire up `isValidGenre()`.** Filter or reject off-list values on write in `artists-lambda` (create AND both update paths). Decide with Jason whether an off-list value is a `400` or is silently dropped — **recommend 400**, so bad input is visible rather than swallowed.
2. **Normalise case on write.** Map case-insensitively onto the canonical value before storing (`rock` → `Rock`). This alone fixes 438 assignments permanently and stops the largest source of drift.
3. **Add `enum:` to `openapi-integration.yaml`** for `genres.items`, matching `artistType`/`actType`.
4. **Constrain the MCP tool schema** — `create_artist` / `edit_artist` `genres` should be an enum array, not `{type: string}`.
5. **Guard the bulk-import path** in `events-agent-lambda` — it is the most likely drift source, since it writes model output directly.
6. **Type the UI.** `GenreSelectorProps.selectedGenres` → `Genre[]`. Surface off-list legacy values as removable rather than silently valid.
7. **Kill or sync `bndy-types`' `MusicGenre`.** It has `Disco`, the canonical list does not. Since backstage doesn't depend on the package, **recommend deleting the union and the `getAvailableMusicGenres()` mirror** rather than maintaining a third copy. If it must live, re-export from the canonical file — never duplicate.

---

## 2. Then clean the data — three separate problems, not one

### 2a. Case-only — 438 assignments, mechanical, no judgement
`rock`→`Rock` (165) · `pop`→`Pop` (68) · `indie`→`Indie` (42) · `blues`→`Blues` (26) · `soul`→`Soul` (19) · `folk`→`Folk` (19) · `punk`→`Punk` (16) · `americana` (12) · `alternative` (11) · `metal` (11) · `country` (9) · `funk` (7) · `britpop` (6) · `new wave` (5) · `mod` (5) · `grunge` (4) · `jazz` (3) · `electronic` (3) · `dance` (2) · `reggae` (2) · and 2 more.

Safe to run unattended once §1.2 is in.

### 2b. Field leakage — ~92 assignments that are not genres at all
- **`covers` (47) + `Covers` (25) + `tribute` (5)** → these are **`actType`** values. Move them: if the artist's `actType` is empty, set it from this; then drop from `genres`. Do not simply delete — it is real information in the wrong column.
- **`Acoustic` (8) + `acoustic` (7)** → this is the **`acoustic` boolean** on the artist. Set the flag, drop from genres.

### 2c. Off-list genres — needs a Jason ruling before executing

**Recommend ADDING to the canonical list:**
- **`Ska`** — 31 assignments (`Ska` 26 + `ska` 5). A genuine genre, distinct from Reggae, and well represented on this circuit. Strong candidate.

**Recommend MAPPING to canonical parents** (sub-genres — the list is deliberately flat):
`Classic Rock`/`classic rock` (50) · `hard rock`/`Hard Rock` (27) · `Glam Rock`/`glam rock` (16) · `Indie Rock`/`indie rock` (16) · `Alternative Rock`/`alternative rock` (14) · `blues rock` (13) · `Progressive Rock`/`progressive rock` (11) · `Pop Rock` (8) · `heavy metal` (7) · `pop punk` (6) · `Post-Punk` (5) → `Rock`, `Metal`, `Punk`, `Indie`, `Alternative`, `Blues` as appropriate.
`rock and roll`/`Rock and Roll` (16) → **`Rock n Roll`** (note the canonical spelling — no apostrophes, lowercase `n`).
`Disco` (10) → legacy `bndy-types` value. Map to `Dance`, or add it back — Jason's call.

**Recommend DROPPING** (not genres):
`80s` (20) · `60s` (9) · `70s` (4) and other decade tags. If Jason wants era as a facet, that is a **new field**, not a genre value.

The full 182-value off-list inventory with counts is at `/tmp/genre-audit.json` from the audit run — regenerate with `list_artists` if needed.

---

## 3. Acceptance

1. An artist write with an off-list genre is rejected (or normalised) — verifiable by attempting `"rock"` and `"Nonsense"` via MCP and via the API.
2. `isValidGenre()` has call sites.
3. Zero case-only mismatches remain in live data.
4. `covers`/`tribute`/`acoustic` no longer appear in any `genres` array, and the information survived in `actType`/`acoustic`.
5. Only one genre list exists in the codebase.
6. A re-run of the audit shows 100% of assignments in the canonical set.

## 4. Traps

- **Read every write back** — the MCP `search_*` tools have documented false-negative modes; use `get_by_id`.
- **Do not touch owner-managed records** (§0.16) — check before writing.
- Back up before the data pass; these are public fields on 992 artists.
- `'R&B'` and `'Rock n Roll'` have exact spellings that a naive title-caser will mangle (`R&b`, `Rock N Roll`). Special-case them.

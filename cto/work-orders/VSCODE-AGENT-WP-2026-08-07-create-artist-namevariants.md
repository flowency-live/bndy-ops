# WORK PACKAGE — `create_artist` drops `nameVariants` (+ the drift that let it happen)

**Raised:** 2026-08-07, Sugarmill supervised import (`cto-2026-08-07-sugarmill-import`)
**Owner:** VSCode agent · **Reviewer:** Jason
**Repos:** `bndy-MCPServer` (all changes) · `bndy-serverless-api` (read-only — verified correct, do not touch)
**Size:** WP-1 is ~6 lines. WP-2 is ~20. WP-3 is the one that stops this recurring.

---

## Verdict up front

**This is an MCP defect, not a backend defect.** The Lambda already accepts, persists and *keys* on `nameVariants`. The MCP tool advertises the parameter in its JSON schema and then silently throws it away before the HTTP call. Nothing in the backend needs changing.

---

## Verified facts

Each of these was checked against the working tree on 2026-08-07, not inferred.

| # | Fact | Evidence |
|---|---|---|
| 1 | `create_artist`'s MCP input schema advertises `nameVariants` | `bndy-MCPServer/src/index.ts` — `create_artist` block, property `nameVariants` with description *"Alternative names / billing strings that mean THIS artist. These are used for identity resolution…"* |
| 2 | The handler's own param interface omits it | `src/tools/create-artist.ts` — `interface CreateArtistParams` has 14 fields; the schema has 15. `nameVariants` is the only one missing. |
| 3 | The handler never references it anywhere | `grep -c nameVariants src/tools/create-artist.ts` → **0** |
| 4 | So it is never placed on `artistData` and never reaches the API | `const artistData = {…}` in `createArtist()` — no `nameVariants` key |
| 5 | `create_event` and `create_venue` are **clean** | 21/21 and 8/8 schema properties consumed. This is a one-field defect, not a systemic leak of many fields. |
| 6 | The backend create path **does** accept it | `artists-lambda/handler.js:1928` — `handleCreateCommunityArtist` destructures `nameVariants` (and `actType`) from the body |
| 7 | …persists it | `handler.js:2075` — `name_variants: nameVariants \|\| []` |
| 8 | …**and builds the dedup sentinel keys from it** | `handler.js:2091` — `buildArtistUniqueKeys(name, location, facebookUrl, nameVariants)` |
| 9 | find-or-create forwards the raw body, so no backend plumbing is missing | `handler.js:2459` `handleFindOrCreateArtist` → `handler.js:~2550` `const created = await handleCreateCommunityArtist(event)` — the whole `event` is passed through |
| 10 | `actType` is accepted and persisted by the Lambda but is **absent from the MCP schema entirely** | `handler.js:1928` destructures it, `handler.js:2060` writes `actType: actType \|\| null`; no `actType` property exists in the `create_artist` schema in `index.ts` |

### Live reproduction

Sugarmill run, 2026-08-07. Five acts created via `create_artist` with `nameVariants` supplied:

| Artist | Passed on create | `get_by_id` read-back | After `edit_artist` |
|---|---|---|---|
| Skids `c3c82387` | `["The Skids"]` | `[]` | `["The Skids"]` |
| Elvana `de720169` | 2 variants | `[]` | `["Elvana: Elvis Fronted Nirvana"]` |
| Dookie `a9c244c0` | 2 variants | `[]` | `["Dookie UK","Dookie - Green Day Tribute"]` |
| NME'd `5aa94a4c` | 2 variants | `[]` | `["NME'D - A Tribute To 00's NME Classics"]` |
| The Year Grunge Broke `9a157b8b` | 2 variants | `[]` | `["THE YEAR GRUNGE BROKE"]` |

`edit_artist` persists them correctly, which is what proves the field works end-to-end and isolates the fault to the create handler.

## Why this matters more than a missing display field

`nameVariants` are not cosmetic. Fact 8 above: they are an **input to `buildArtistUniqueKeys`**, the DynamoDB sentinel transaction that is the hard duplicate gate (the "even when a caller's 'this is a new artist' logic is wrong, the sentinel bounces the write" guard).

So the failure is precisely inverted from where you want it. At create time — the one moment we hold the source's billing string, know it is an alias, and could write a sentinel that blocks the duplicate forever — the alias is discarded. The gate is never armed. The next import that meets `THE YEAR GRUNGE BROKE` in a different casing or with its tour suffix has nothing to match against and creates a second record.

This is the same class as the §1A.3 Ant Hill Mob incident: identity data that existed at the point of capture and was not persisted.

Secondary cost, already measured: every `create_artist` currently needs a follow-up `edit_artist` to be correct (nameVariants + actType). The Sugarmill run turned 22 creates into 44 writes.

---

## WP-1 — Forward `nameVariants` in `create_artist` (the fix)

**File:** `bndy-MCPServer/src/tools/create-artist.ts`

Three edits:

```diff
 interface CreateArtistParams {
   name: string;
   artistType: 'band' | 'solo' | 'duo' | 'trio' | 'group' | 'dj' | 'collective';
   location: string;
   locationType?: 'city' | 'regional';
   bio?: string;
   profileImageUrl?: string;
   genres?: string[];
   facebookUrl?: string;
   instagramUrl?: string;
   spotifyUrl?: string;
   externalIds?: Array<{ source: string; id: string }>;
+  nameVariants?: string[];
   resolveTo?: string;
   confirmNew?: boolean;
   verifiedSourceName?: boolean;
 }
```

```diff
-  const { name, artistType, location, locationType, bio, profileImageUrl, genres, facebookUrl, instagramUrl, spotifyUrl, externalIds, resolveTo, confirmNew, verifiedSourceName } = params;
+  const { name, artistType, location, locationType, bio, profileImageUrl, genres, facebookUrl, instagramUrl, spotifyUrl, externalIds, nameVariants, resolveTo, confirmNew, verifiedSourceName } = params;
```

```diff
       externalIds: normalizedExternalIds,
+      // Identity resolution: these feed buildArtistUniqueKeys server-side (handler.js:2091),
+      // so they must be supplied AT CREATE or the dedup sentinel for the alias is never written.
+      ...(nameVariants?.length ? { nameVariants } : {}),
       // AI creation flags (CRITICAL for the review queue)
       ai_created: true,
```

Conditional spread, not `nameVariants: nameVariants || []` — on the `resolveTo` path no create happens and we should not send an empty array that could be read as an instruction to clear.

## WP-2 — Expose `actType` on `create_artist`

The Lambda already stores it (fact 10). Only the MCP side is missing.

**`src/index.ts`** — add to the `create_artist` `properties` block, alongside `genres`:

```ts
actType: {
  type: 'array',
  items: { type: 'string', enum: ['originals', 'covers', 'tribute'] },
  description: 'Whether the act plays its own material, covers, or is a tribute act. Set this on create — it is not inferable later.',
},
```

**`src/tools/create-artist.ts`** — add `actType?: Array<'originals'|'covers'|'tribute'>;` to the interface, destructure it, and add `...(actType?.length ? { actType } : {})` to `artistData`.

⚠ **Verify before closing:** the Lambda writes `actType` in camelCase (`handler.js:2060`) while its siblings are snake_case (`name_variants`, `external_ids`). Confirm the read path in `get_by_id` returns it — for `nameVariants` the read does `entity.nameVariants || entity.name_variants`, and `actType` may not have the equivalent tolerance. If the read path is inconsistent, fix the read, don't rename the stored attribute (there is live data on it).

## WP-3 — Stop schema/handler drift recurring (the actual root cause)

The bug was possible because a tool's parameters are declared **twice, independently, by hand**: once as a JSON Schema literal in `index.ts` and once as a TypeScript `interface` in `tools/*.ts`. Nothing links them. TypeScript cannot catch the omission because the interface is self-consistent — it simply describes a smaller object. The compiler was never going to find this, and neither was code review; it took a read-back on live data.

**Do WP-3a now (cheap guard). Propose WP-3b for a later sprint (durable fix).**

### WP-3a — a drift test

Add `src/tools/schema-drift.test.ts`. For each entry in the tool list, assert every top-level `inputSchema.properties` key is referenced in the corresponding handler's source file:

```ts
import { readFileSync } from 'node:fs';
import { TOOLS } from '../index.js'; // export the tool array if it isn't already

const HANDLERS: Record<string, string> = {
  create_artist: 'src/tools/create-artist.ts',
  create_event:  'src/tools/create-event.ts',
  create_venue:  'src/tools/create-venue.ts',
  edit_artist:   'src/tools/edit-artist.ts',
  edit_event:    'src/tools/edit-event.ts',
  edit_venue:    'src/tools/edit-venue.ts',
  // …extend to every tool
};

for (const [tool, file] of Object.entries(HANDLERS)) {
  it(`${tool}: every advertised parameter is consumed by its handler`, () => {
    const schema = TOOLS.find(t => t.name === tool)!.inputSchema as any;
    const src = readFileSync(file, 'utf8');
    const dropped = Object.keys(schema.properties)
      .filter(p => !new RegExp(`\\b${p}\\b`).test(src));
    expect(dropped).toEqual([]);
  });
}
```

Crude (a source-text search, so it proves the identifier is *mentioned*, not that it is forwarded) but it would have caught this exact defect, costs nothing, and fails loudly the next time someone adds a schema property without wiring it.

### WP-3b — single source of truth

Define each tool's parameters once as a zod schema; derive the JSON Schema for MCP from it (`zod-to-json-schema`) and the handler's param type via `z.infer`. Drift becomes unrepresentable rather than merely tested for. Larger change; raise as its own item rather than smuggling it into this fix.

---

## Acceptance

1. `create_artist({name, artistType, location, nameVariants: ["Foo Bar","FOO BAR"]})` → `get_by_id` returns the variants (deduped by the backend's normalised merge — expect one survivor for case-only duplicates; that is correct behaviour, not a bug).
2. `create_artist({… actType: ["tribute"]})` → `get_by_id` returns `actType: ["tribute"]`.
3. A create supplying a variant writes the corresponding uniqueness sentinel: a second `create_artist` whose `name` equals that variant, same region, is **bounced as a duplicate** rather than creating a second record. *This is the acceptance test that actually matters — it is the behaviour the defect was costing us.*
4. The `resolveTo` and `confirmNew` paths are unchanged — no `nameVariants` key is sent when the array is absent or empty.
5. Drift test passes, and fails if you delete the `nameVariants` line from `create-artist.ts`. Verify by deliberately breaking it.

## Backfill

**None required, and do not run one.** Only the five Sugarmill acts in the table above are known to have lost variants, and all five were repaired in-session via `edit_artist`. Earlier runs mostly did not pass `nameVariants` at all, so there is nothing to recover. Per the OPEN-RULINGS standing note — *"before reporting a rule violation as a defect: check the harm is actually occurring"* — measure before proposing any sweep.

---

## Also re-confirmed this run (already logged, not part of this WP)

- **`search_event` returns `externalIds: []` regardless of stored value.** Third independent confirmation. All 19 Sugarmill events showed `[]` in the venue listing while `get_by_id` showed them present. It also concealed a pre-existing `klma-stoke-gig-list` id on event `c664d9ae`, which only surfaced in the `edit_event` response. This tool is actively misleading during audits and should be fixed or have the field removed from its response rather than lying.
- **`get_by_id` does not return `locationType`**, so the §6B location/locationType pairing cannot be verified on read-back.

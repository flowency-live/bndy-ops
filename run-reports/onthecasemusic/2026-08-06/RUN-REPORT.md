# RUN REPORT — onthecasemusic — 2026-08-06

**Status: COMPLETED.** Snapshot written (§6A.7 fail-closed gate satisfied). Validator exit 0 (§6A.8).

---

## ADDENDUM — Jason's rulings received and executed, 2026-08-07

**Ruling: "never hide. delete and fix. delete and recreate. do what you need to if it's obvious."**
Supersedes §5.4 (cancellations → hide) and the hide-based half of §0.17.

All three events this run had hidden are **DELETED** via the API route (sentinels released), each
confirmed gone by `get_by_id`, **no 401**:

| Event | id | Why |
|---|---|---|
| Fossil @ Crown and Cannon, 2026-08-07 | `fe0fed33-ca35-44ef-8806-6883bde892a1` | slot re-billed to Face Value Duo |
| Brit Pack @ New Hartley Memorial Hall, 2026-08-08 | `be957485-e03e-49bc-b018-1009955804eb` | source bills slot "Cancelled" |
| Dakota @ New Hartley Memorial Hall, 2026-08-15 | `7086e9e3-3803-4bb9-8dda-a704e0b95df9` | source bills slot "Cancelled" |

Gig `126270` now resolves to exactly one bndy event — `9b9a525d-ec06-4dc1-a77e-fac3405de9e8`
(Face Value Duo), carrying the §6D slug, which is the mandated form for this source.

**⚠ Runbook §5.4 and §0.17 still say "hide, never delete" and now contradict this ruling.** A run
reading §5.4 tomorrow will still hide. Not edited here — the runbook is not a scheduled task's file
(§6F ownership). **Needs a CTO edit.**

**Re-billing made mechanical (the obvious fix, applied).** The snapshot row format now carries the
**source gig id as its first field**, and `sources/onthecasemusic.md` specifies diffing on
`(date, gigid)` *before* text: same id + changed text = CHANGED row → delete stale event, create the
correct one; id absent = genuine drop (§0.17); id new = added row. Snapshot re-verified: 275 rows,
116 dates, **0 rows without a gig id**.

**externalId back-fill (ruling 2).** Recommendation implemented as a spec constraint in
`sources/onthecasemusic.md`: three event conventions are live, `edit_event` dedupes to one id per
source so a naive sweep would destroy the numeric ids, venue lookups can't rely on
`get_by_external_id`, and `search_event` negatives must be confirmed with `get_by_id`. The blanket
"all onthecase events are empty" open item is withdrawn as overstated.

**Evidence file (ruling 3).** Already resolved by your RUNBOOK **v2.9** (per-run
`enrichment-evidence-<date>-<slug>.jsonl`, with an §6F ownership lane) — written by another session
while this run was working. `scripts/enrichment_validate.py` updated to match: `--evidence` accepts a
file, a glob, or a comma-separated list. Tested — scoped file exit 0, day glob exit 0, comma list
exit 0, non-matching path **exit 2**, wrong evidence file **exit 1** (fail-closed preserved).

Revised totals: **3 artists created, 9 events created, 3 events deleted, 0 events hidden.**

---

- Runbook read in full: **v2.8** (task floor ≥ v2.4 — PASS; current floor line also v2.8).
- Source spec read in full: `sources/onthecasemusic.md`.
- `OPEN-RULINGS.md` STANDING RULINGS read and applied (no stubs; report measures quality).
- Capture: Chrome DOM (`fetch` + `DOMParser`, reading `a[href]` — §0.22 respected, no `get_page_text` used for collection).
- Cap: 50 creates. **Used 12** (3 artists + 9 events). Not reached.

---

## 1. Headline counts

| | |
|---|---|
| Source rows captured | **275** over 116 dates (2026-08-06 → 2027-12-18) |
| Snapshot rows (previous) | 273 |
| Rows ADDED (after normalisation) | 25 |
| Rows REMOVED (after normalisation) | 23 (19 simply past-dated and rolled off) |
| Artists created | **3** |
| Artists matched/reused | 11 |
| Artists staged | 0 |
| Venues created | **0** (all 9 resolved to existing records) |
| Events created | **9** |
| Events already present (409) | 5 — provenance back-filled, no siblings created |
| Events hidden (cancellations / re-billing) | 3 |
| Rows skipped by filter | 10 |
| Rows beyond horizon (kept in snapshot, not imported) | 1 |
| Gate bounces worked around | **0** |

---

## 2. THE CAPTURE-FORMAT TRAP — read this before trusting any onthecase diff

**The raw diff was 100 added / 99 removed on a feed that had barely changed.** The scheduled-task prompt
warned that hundreds of added rows means a capture-format problem and to HOLD. This was that signal at
smaller scale, and it was a format artifact, not churn. It was **not** imported as 100 new rows.

Cause: the site emits a trailing `/` in the address when a venue has no phone number
(`North Road / Durham City /`). The 2026-07-31 snapshot was captured with `get_page_text`, which
dropped it (`North Road / Durham City`). **Every row at a phone-less venue therefore differed by two
characters and diffed as removed+added.** A second, smaller artifact: curly vs straight apostrophes
(`Sugar B's`). A third: the old snapshot carried a `--- BEYOND 12-MONTH HORIZON ---` annotation row
*inside the data*, which a mechanical diff has to special-case.

Fix applied, and it is now written into the snapshot header so the next run reproduces it:
normalise **both sides** — collapse whitespace, straighten apostrophes, drop empty `/` segments.
After normalisation: **25 added / 23 removed**, which is the sane diff the prompt predicted.
The new snapshot re-diffs against today's capture at **0 added / 0 removed**.

The new snapshot also carries **no annotation rows** — headers and gig rows only.

**Transport note (verified, not assumed).** `javascript_tool` truncates its return at ~1 KB, so the
31 KB capture could not be read out of Chrome in one piece. The page was also fetched in the sandbox
and parsed with the identical algorithm; the two results were compared before either was used —
same length (30,792), same two rolling hashes (609454866 / 2061344722), same first and last 40
characters. The sandbox copy is therefore a faithful transport of the Chrome-rendered capture, not a
substitute for it. Chrome remained the capture surface, per the spec.

---

## 3. Artists — QUALITY BREAKDOWN (§6 / STANDING RULING 2026-08-01)

### 3a. Created WITH a verified page — 3 of 3

Every create carried a page meeting the §2A.1 evidence bar, plus bio, avatar, genres and location.
**Zero stubs. Zero name-only records.**

| Artist | id | Facebook (verified) | Evidence that cleared §2A.1 |
|---|---|---|---|
| **Stone Idols** | `9f3f1292-2834-4465-ae08-6e96059c13b6` | `facebook.com/StoneIdols` (2.4K) | Page posts **"THIS FRIDAY AT THE SEVEN STARS"** — the exact gig being imported (2026-08-07, Seven Stars Ponteland). Also posts about The Lambton Hotel (Chester-le-Street). |
| **Spanish Battery** | `d30d2f79-efce-4fbc-a680-8aa6dfb1a15b` | `facebook.com/SpanishBattery` (274) | Page states **"Rock and Blues from Newcastle"**; category Musician/band; page's own genre matches the source's structured genre (`Rock / Blues`) exactly. |
| **The Bandits** | `96c912d4-a355-4a6f-ab94-625b709bb1a8` | `facebook.com/p/The-Bandits-100064729312427/` (595) | The act's own post: **"This SATURDAY 8th August at The Tyne Bar … From 3pm"** — exact date, venue and time of the imported row. Corroborated by Billy Bootleggers Newcastle posting about them. |

**Both surfaces were searched for all three, per §2A.1 item 3b.** This mattered:

- **The Bandits: Facebook page search found NOTHING usable.** `"The Bandits Newcastle"` returned zero
  pages; `"The Bandits band"` returned only *Michelle And The Bandits Band* and a `RockinTeenBoys`
  page — neither the act. **Google found the real page first**, via its post about this very gig.
  This is the `AudioShift` / `Bone Idol` pattern in the v2.8 ruling, reproduced exactly. Had this run
  used Facebook search alone it would have recorded a false "no page found", or worse, attached one
  of the two wrong pages.
- **Spanish Battery:** `"Spanish Battery band"` on Facebook returned nothing relevant; the plain name
  surfaced it. Note the near-miss: `friendsofthespanishbattery` is the **Tynemouth headland
  conservation group**, not the act — a name-match-only attach would have been wrong.
- **Stone Idols:** found on both surfaces.

### 3b. Created with an EVIDENCED BLANK — 0

None. No act reached create with an unresolved page.

### 3c. Staged — 0 artists

### 3d. Fields, and what was NOT invented

- **Bios are verbatim quotations** (§2A.1 item 8), copied character-for-character, including
  `............` in the Stone Idols press quote and `rock'n'roll` unaltered in The Bandits'. Nothing
  reworded, re-punctuated or converted to third person. Raw scrapes were written to
  `data/state/enrichment-evidence-2026-08-06.jsonl` **before** the bndy writes.
- **`actType` LEFT EMPTY on The Bandits** — their page says only that they "play a bit of rock'n'roll",
  which does not establish covers vs originals, and the source gives no description. §0.18 outranks
  the `["covers"]` default: unknown beats wrong on a public field. Stone Idols → `["covers"]`
  (source lists a covers setlist, corroborated by Google). Spanish Battery → `["covers","originals"]`
  (source: *"We also have a few original songs thrown in too"*).
- **Genres** are the only inferred field, all from the enum: Stone Idols `Rock/Indie/Pop`,
  Spanish Battery `Rock/Blues`, The Bandits `R&B` (source's structured field) + `Rock n Roll` (their
  own page's wording).
- **Locations:** Spanish Battery and The Bandits → `Newcastle upon Tyne` (city). Stone Idols →
  `North East` + `locationType: regional` (§6B Kilmarnock pairing observed) — its footprint spans
  Newcastle, Sunderland, Northumberland and Ponteland with no single home town declared.

### 3e. Matched and reused — 11 (no creates, no near-name twins)

`Face Value Duo` `f01a16e2-35af-402e-9f36-f48e48a597e6` · `GodZZ of Wor` `a51444bb-bd21-4ba0-b5e0-154c2bc64b95` ·
`Four Letter Word` `aadc0f12-b30b-48fd-a712-4e725bfca388` · `Small Wonder` `0f40ca01-73a1-4eb0-b0cf-8acdc4de5df3` ·
`Distant Suns` `6881e494-f527-4023-9c3b-78f5a1b892c6` · `The Flames` `b840d474-c280-4cc7-9c3a-a5c57f32d6c7` ·
`West Coast Band` `fd4071de-5487-40c8-9658-6924bcb9edf0` · `The Zone` `2b832e36-e476-4e53-b80f-8f69a4b8ff1a` ·
`Trilogy` `5fa2d40b-035c-4859-b86f-6c5a23618b5e` · `Hard River` `6dffcb83-d8de-4f51-8757-68526a772b50` ·
`Midnight Echoes` `eef00c7f-c711-41ed-aca7-9e703baf53bd`

**Near-name candidates correctly REJECTED (§1A.7 — a fuzzy hit is not a collision):**

- `Stone Idols` was held against **`Bone Idol`** (`67244e1b-…`, **Poole, Dorset**, 73%). Different
  name, different act, opposite end of the country. Created as new — not resolved to it.
- `Hard River` returned `HardDrive` (Stoke-on-Trent, 80%) and `Hard Wired` (North East, 70%). Neither
  is the act; the 100% `Hard River` NE record was reused.

---

## 4. Names sanitised or refused under §0.6 / §0.4 — 10 rows

No act name required stripping this run. Ten rows were refused as non-acts:

| Rows | Billing | Disposal |
|---|---|---|
| 8 | **"Buskers night"** at Old Fat Ox (gig ids 131409, 131410, 131411, 131412, 131413, 131414, 131415, 131416) | §0.4 placeholder + source spec skip list (`artist_external_id 30015`). Open-mic night, not an act. No artist, no event. |
| 2 | **"Cancelled"** at New Hartley SMC, 2026-08-08 and 2026-08-15 (gig ids 130190, 130184) | §0.4 — cancellation is an event-status change, never an artist. Handled in §6 below. |

Also present in the feed and correctly left alone: `to be confirmed` (2026-12-20, Crown and Cannon)
and `Undecided Acoustic Duo` (spec skip, Jason 2026-07-29).

---

## 5. Events created — 9 (all verified by read-back)

All `isPublic: true`, all titled `«Artist» @ «Venue»`, all carrying
`{source: "onthecasemusic", id: "<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}` per §6D.
**No start time was defaulted — the source published an explicit time for every row (§5.6 not exercised).**

| Date | Event | id |
|---|---|---|
| 2026-08-07 | Face Value Duo @ Crown and Cannon | `9b9a525d-ec06-4dc1-a77e-fac3405de9e8` |
| 2026-08-07 | Stone Idols @ Seven Stars | `95990fc8-321b-4ee9-b868-c6033b8534b6` |
| 2026-08-07 | GodZZ of Wor @ Live Lounge | `202f7573-ebd0-46d2-b53b-747b6e641db8` |
| 2026-08-08 | The Bandits @ The Tyne Bar | `2b322526-e424-494f-9f65-99bf0f5a770f` |
| 2026-08-08 | Four Letter Word @ The Turbinia | `0cc00768-6231-4c9c-a2e7-e38b01098e60` |
| 2026-08-08 | Small Wonder @ Live Lounge | `d6fffd72-70c3-4678-8f92-caa9ebc6c3d3` |
| 2026-08-08 | Spanish Battery @ The Quakerhouse | `c468d6af-7c2d-4dbf-adc2-c464b1a193d3` |
| 2026-08-31 | The Flames @ Old Fat Ox | `9a42dd77-d394-4960-b814-47019e342e1b` |
| 2027-04-10 | Midnight Echoes @ Murton Club (Official) — `ticketed: true`, £2.50 | `49fb0d03-751f-441f-b814-6df9e0e5ac06` |

**Beyond horizon, deliberately NOT imported (1):** 2027-11-28 Midnight Echoes @ Murton Officials Club
(gig 131418) — 2027-11-28 is past the 12-month ceiling of 2027-08-06. It stays in the snapshot and
will enter via a later diff (§6E). The 2027-04-10 sibling **is** in horizon and was imported.

---

## 6. Gate bounces — 5, all verbatim, none worked around

All five are `DUPLICATE_EVENT` (409) on artist+venue+date, all with `matchedExternalId: null`, and
**all five turned out to be lemonrock-created events for the same real gig** — cross-source overlap,
exactly as §6C documents for the NE. In each case the existing event was read with `get_by_id`, the
complete intended array written in ONE call (§6B), and **both** source ids retained. No siblings created.

```
DUPLICATE_EVENT — Distant Suns @ Old Fat Ox 2026-08-28 — existing 181ef706-ad0d-4397-b470-c94ab213a0b6 — matchedExternalId: null
DUPLICATE_EVENT — West Coast Band @ Bebside Inn 2026-09-04 — existing 38945120-6f43-44bc-b9ab-c639859856db — matchedExternalId: null
DUPLICATE_EVENT — The Zone @ Old Fat Ox 2026-09-19 — existing 5f41d2ed-acf7-480b-a596-f8bac633dbff — matchedExternalId: null
DUPLICATE_EVENT — Trilogy @ Bebside Inn 2026-09-19 — existing 61ebc14f-b3f1-413e-b7b8-5dde015a8dc0 — matchedExternalId: null
DUPLICATE_EVENT — Hard River @ Bebside Inn 2026-09-26 — existing db9be9a5-a412-447e-bf42-c84115fd20a5 — matchedExternalId: null
```

Provenance back-filled on all five (lemonrock id kept + onthecasemusic §6D slug added), verified on
read-back. This is five more instances of the standing empty-`externalIds` finding, and five fewer.

---

## 7. Removed future rows (§5.7 / §0.17) — 4, and one of them is a NEW FAILURE MODE

Nineteen of the 23 removed rows were simply **past-dated** (2026-07-31 → 2026-08-02) and rolled off
the front of the feed. A row disappearing because its date passed is not a cancellation. Four were
future-dated:

### 7a. Two explicit CANCELLATIONS — hidden, not deleted (§5.4)

The source did not silently drop these; it **re-billed the slot as the literal act name "Cancelled"**.

| Event | id | Action |
|---|---|---|
| Brit Pack @ New Hartley Memorial Hall, 2026-08-08 | `be957485-e03e-49bc-b018-1009955804eb` | `isPublic: false` |
| Dakota @ New Hartley Memorial Hall, 2026-08-15 | `7086e9e3-3803-4bb9-8dda-a704e0b95df9` | `isPublic: false` |

§5.4 governs cancellations (hide, never delete), so §0.17's delete route was **not** used. Both
verified on read-back.

⚠ **`search_event` false-negative reproduced again.** It reported `externalIds: []` for the Brit Pack
event; `get_by_id` showed a real stored id, `{onthecasemusic, brit-pack-2026-08-08-newhartley}` — a
legacy convention, not the §6D slug. Had this run trusted the search result it would have concluded
"no provenance" and reasoned from there. §6B's warning earned its place. **Also note: the "every
onthecasemusic event has empty externalIds" claim in the open rulings is too broad** — several events
touched today had real ids.

### 7b. One placeholder — nothing to do

`to be confirmed` @ Old Fat Ox 2026-09-19 was never imported (§0.4), so nothing was removed. That slot
is now billed **The Zone**, which was picked up as an added row.

### 7c. ⚠ ONE ROW WAS NOT A DROP AT ALL — THE SOURCE RE-BILLED A LIVE GIG ID. STAGED FOR RULING.

`Fossil @ Crown and Cannon Winlaton, 2026-08-07` left the feed and `Face Value Duo` appeared at the
same venue, same date, same 21:00. Treated as removed+added by any set diff. **It is neither.**

**Both rows are source gig id `126270`.** The existing bndy event
`fe0fed33-ca35-44ef-8806-6883bde892a1` already carried `{onthecasemusic, 126270}` — the numeric id,
not a slug. The source kept one booking and changed who is playing it.

§0.17 says *"Time/detail changes on a source = EDIT the existing event (found via externalId), never
create a sibling."* **This run created a sibling before spotting it** — the diff pipeline compares
normalised text rows, and the gig id is not in the text. That is a real defect in this run and it is
reported rather than quietly tidied.

What was done, and deliberately not done:

- **Hidden:** `fe0fed33-…` set `isPublic: false`. Fossil is not playing that night, and leaving it
  public is wrong data. Reversible.
- **Kept:** `9b9a525d-…` (Face Value Duo) stays live. Face Value Duo genuinely is playing, and bndy's
  event identity is (venue, artist, date), so the record is correct in its own right.
- **NOT deleted.** §0.11 forbids deletion during an import run, and §0.17's carve-out is for
  source-*dropped* events — gig 126270 was not dropped.
- **NOT merged or re-pointed.** Moving the numeric id onto the live event, or repointing the old
  event's `artistId`, are identity decisions. §0.2 says identity is never decided by mid-import
  reasoning. Editing `artistId` would also have collided with the new event's sentinel.

**Net state:** one hidden event holding the numeric provenance `126270`, one live event holding the
§6D slug, for one real gig. That split needs a ruling — raised in `OPEN-RULINGS.md`.

---

## 8. Venues — 0 created, 9 reused

`Crown and Cannon` `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` · `Seven Stars` `2ac411a0-2782-4768-8b1c-1bac40890c41` ·
`Live Lounge` `e368931e-fbd0-4033-ae7c-0be68e01ad0c` · `The Tyne Bar` `4b558591-3e2a-4f73-93f5-869ec7f4bc81` ·
`The Turbinia` `8d652f5f-24b5-47c7-b1a6-22e19231ccec` · `The Quakerhouse` `fd39c951-e61f-4903-ba4a-c80c1f03ce18` ·
`Old Fat Ox` `c1a763b7-6496-4a93-843b-99a0ecba9a58` · `Bebside Inn` `b23c91b9-b467-4df3-b6e8-73b5621d8d8e` ·
`Murton Club (Official)` `05272a47-5018-4769-8ec2-1b1aa2842423` (spec's learned mapping, full UUID confirmed)

Three matched below the confidence threshold and were accepted **only** on address agreement per §3.4,
not on the score: `Tyne Bar` → `The Tyne Bar` (67%, Maling St NE6 agrees), `Turbinia` → `The Turbinia`
(67%, Newton Aycliffe DL5 agrees), `The Quaker` → `The Quakerhouse` (67%, Mechanics' Yard DL3 agrees).
All postcodes checked against expected county (§0.24).

⚠ **Venue externalIds for this source use at least three conventions** — `crown-and-cannon-winlaton`
(bare slug), `otc-venue-seven-stars-ponteland` (prefixed), `new-hartley-smc` — and several venues carry
none. `get_by_external_id` is therefore unreliable for venues here; `search_venue` + address agreement
was used instead.

---

## 9. Validator (§6A.8)

```
[ ok ] Stone Idols  9f3f1292-2834-4465-ae08-6e96059c13b6
[ ok ] Spanish Battery  d30d2f79-efce-4fbc-a680-8aa6dfb1a15b
[ ok ] The Bandits  96c912d4-a355-4a6f-ab94-625b709bb1a8

3 records · 3 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0 against the source-scoped evidence file
`data/state/enrichment-evidence-2026-08-06-onthecasemusic.jsonl` (3 records). Written before the bndy
writes; `artistId` back-filled immediately after each create, since the id does not exist until the
create returns.

⚠ **SELF-REPORT — I performed the same shared-file rewrite that cost tonight's gigs-news run 7 evidence
records.** The evidence contract's single-file-per-date path (`enrichment-evidence-<date>.jsonl`) is a
single-writer design, and four source runs were writing this vault tonight. To back-fill `artistId`
after create I read the whole shared file, rewrote it, and appended — a read-modify-write on a file I
do not own. **Nothing was lost in this instance** (verified afterwards: all 11 pre-existing records
were preserved, and 24 further records appended by another session after my write are present), but
that was luck, not design — any append landing between my read and my write would have been destroyed.
Remediation: this run's 3 records were **copied** to a source-scoped file and the shared file was left
untouched thereafter. The 3 records remain in the shared file as well; that duplication is harmless to
a validator keyed on `artistId`, and removing them would have meant another rewrite. gigs-news has
already raised the underlying design issue as an open ruling — this is a second, independent instance
of it, which is worth knowing.

**Judgment-class sample (§6A.8, not machine-checkable):** all 3 of 3 bios re-read against the live
page after writing — verbatim. All 3 page identifications re-checked against gig footprint.

---

## 10. Concurrency (§6F)

**A second session was writing this vault during this run.** `OPEN-RULINGS.md` was 38,657 bytes at
23:54 with fresh `gigs-news` entries that were not present when this run read it at ~23:38. No
collision occurred: this run only **appended** to `OPEN-RULINGS.md` (sanctioned) and otherwise wrote
only files in its own ownership lane — `data/state/onthecasemusic-last-page.txt`,
`data/raw/onthecasemusic/2026-08-06/`, `data/normalized/onthecasemusic/2026-08-06/`. The snapshot was
size/mtime-checked immediately before writing (31,026 / 2026-07-31 23:46 — unchanged since read).
No other source's spec or snapshot was touched.

Also noted: `data/state/enrichment.lock` contains a RELEASED sentinel from 2026-08-04, left in place
because the platform blocked deletion. Not a live lock.

---

## 11. Open items for Jason

1. **The re-billed gig id (§7c)** — needs a rule. Raised in `OPEN-RULINGS.md`.
2. **`search_event` false negatives** — third independent confirmation, and the first showing a
   *legacy-convention* id being masked. Already open; strengthened.
3. **The "all onthecase events have empty externalIds" open item is overstated** — several events
   touched today carry real ids in at least three conventions (numeric `126270`, legacy
   `brit-pack-2026-08-08-newhartley`, §6D slug). A back-fill plan built on "they're all empty" would
   be wrong. Noted in `OPEN-RULINGS.md`.

## 12. Artefacts

- `data/raw/onthecasemusic/2026-08-06/gigs-raw.html` (362,956 bytes)
- `data/raw/onthecasemusic/2026-08-06/capture-normalised.txt`
- `data/raw/onthecasemusic/2026-08-06/records.json` (275 records with gig/venue/band ids)
- `data/state/onthecasemusic-last-page.txt` (32,002 bytes, 275 rows / 116 dates)
- `data/state/enrichment-evidence-2026-08-06.jsonl`

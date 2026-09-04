# ENRICHMENT RUN — 2026-08-01 (supervised, first real run of v3)

**Spec:** `ENRICHMENT-TASK-v3.md` · **Runbook:** v2.3b · **Cohort:** artists created in the last 24h
**Mode:** supervised, batch size increased progressively (3 → 10 → 25) to build confidence before scheduling.

## Cohort

`list_artists(createdSince)` returns **0** — the filter is broken, and `createdAt` is **null on every record** the list endpoint returns. Cohort was therefore derived by **diffing artist ids against a snapshot taken at 22:00 the previous night**: 1,565 → 1,741 = **176 new artists**.

| | count |
|---|---|
| New in 24h | 176 |
| From `lemonrock` (carrying a slug externalId) | 130 |
| **No externalId at all** | **46** ⚠ |
| Needing Phase A (genres and/or actType) | 79 |

## Result

**36 records written. Zero errors, zero gate bounces, every write verified by read-back.**

- **34 via Phase A** — genres, actType and website harvested from the act's own lemonrock band page. **No Facebook required for any of them.**
- **2 via Phase B** — source-declared Facebook URL visited and verified before attaching.

**32 Phase A writes remain** (identical mechanical pattern, 34/34 clean so far) plus **4 Facebook candidates** still to verify.

## Phase A validated at scale

The v3 bet holds. Lemonrock publishes `Genres`, `Originals/Covers`, `Based in`, `Web` and sometimes Facebook as structured fields on `/<band-slug>`. Same-origin `fetch()` harvested all 79 band pages in three batched calls — no per-artist Chrome navigation, no Facebook search, no identification risk.

Genre mapping to the canonical 26 was clean: `Blues`, `Rock`, `Pop`, `Folk`, `Jazz` map exactly; `Soul / Funk` splits to `Soul` + `Funk`.

## Judgement calls that prevented bad data

1. **The `Info` field is boilerplate, not a bio.** *"Available for weddings, private parties, corporate events… own PA, own lights, insured (PLI)"* appears near-identically across bands. Using it would have stamped the same marketing text onto hundreds of public records. **Bios left empty** for every Phase-A-only record.
2. **Dogleg's declared "website" is `hearnow.com/settings/vaalb02569322#nt_base_menu`** — an internal admin/settings URL the band mis-pasted into their listing. **Rejected**; publishing it would expose a nonsense link.
3. **`Ska` is off-list** and was dropped from `fifo` (`Ska / Reggae` → `Reggae`). It then appeared again in One Foot in the Groove's own self-description. **Two independent data points in one run — strengthens the case to ADD Ska to the canonical 26** (see the genre normalisation brief).
4. **Truncated UUID caught by its own rule.** A write was attempted against an id reconstructed from an 8-character prefix and correctly 404'd. Full UUIDs only — the rule earned its keep within an hour of being written.
5. **`Mostly covers` mapped to `["covers"]`**, not `["covers","originals"]` — the declared primary mode, without inflating a claim. Flagged as a minor rule question.

## The two Facebook attachments (Tier A: source-declared AND page verified)

**One Foot in the Groove** `ea64e9fb-898d-4be0-ae4c-a937de6f547b`
Page `facebook.com/onefootinthegrooveband` — Musician/band, 722 followers, *"Exeter band, 15yrs experience…"*, lives in Exeter, Devon, service area Taunton · Tiverton · Plymouth · Exeter · Exmouth · Barnstaple, matching the lemonrock footprint precisely.
Two corrections the page forced: **name → "One Foot in the Groove"** (the act's own casing wins, §2A.5/§0.6), and **genres → Soul, Funk, Pop** — the act describes itself as *"Soul, Funk, Ska, Pop"*, with no Rock, where lemonrock had assigned `Pop, Rock`. **The act's own words beat the source's category.**

**Footloose Band** `4b8b57c3-c363-4773-a140-fb2ba1c07ba8`
Source gave a `/share/` link — the documented Motley Crude trap, where a share link can resolve to an **event** page whose owner is the host, not the act. **Checked: it resolved to a genuine band page.** Musician/band, 352 followers, Exeter, matching the record. **Canonical `profile.php?id=100091552269658` written back**, not the share link.

## Defects found

| Defect | Impact |
|---|---|
| **`list_artists(createdSince)` returns 0** and `createdAt` is null on every returned record | "Artists added since X" is not answerable from the API. The scheduled task cannot select its own cohort — it would need a stored id snapshot. **Blocks unattended scheduling until fixed.** |
| **46 of 176 new artists carry NO externalId** | Created by the overnight run with no provenance. They cannot be Phase-A enriched (no slug to look up) and cannot be matched on re-import. Needs a slug back-fill. |
| `edit_artist` does not re-host an external `profileImageUrl` to S3 | Source images would be stored as third-party hotlinks. Not expiring, but fragile. |
| Facebook **page search works** in an automation tab despite `document.hidden` | Not a defect — a correction to §6B. The stall is infinite feeds only. |

## Not done

- 32 remaining Phase A writes — proven pattern, safe to complete.
- 4 Facebook candidates: `charlinched`, `revisionparty` (`TheRevisionPartyband`), `dogleg` (`DoglegNorthDevon`), `sparkwood21` (a `/share/` link — must be resolved and checked for the event-page trap).
- **Avatars for all 36.** Numeric page ids are now known for two; the graph-picture placeholder check (`84628273_…`) must run per record before any image is written.
- The 46 provenance-less records.

## Verdict on scheduling

**Not yet.** The quality discipline held — 36 writes, zero errors, five separate catches that prevented wrong or junk data. But the cohort-selection defect is disqualifying: a scheduled run cannot currently ask "what changed since last night". Fix `createdSince`/`createdAt`, or give the task a persisted id-snapshot, and this is schedulable.

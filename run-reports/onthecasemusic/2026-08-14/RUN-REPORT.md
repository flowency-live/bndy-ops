# onthecasemusic — RUN REPORT 2026-08-14

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-13T23-56-38Z` |
| fired (UTC) | 2026-08-13T23:56:38Z |
| local date (§6A step 1) | 2026-08-14 (`date +%Y-%m-%d`; the box is BST, so the UTC date is one day behind) |
| runbook read | `RUNBOOK.md` H1 **v2.27** |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md` (in full) |
| CTO-INBOX read | yes, fingerprints checked before any append |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-13T23-56-38Z.json` |
| claim | `data/state/claims/onthecasemusic.json`, acquired from a released record (`heldBy: null`, released 2026-08-12T08:26:46Z). **No takeover.** TTL 90 minutes. |

---

## 1. Counts

| | n |
|---|---|
| Events created | **23** |
| Events edited (re-bill) | 1 |
| Events deleted | 0 |
| Artists created | **3** |
| Artists topped up (§1A.4 / provenance) | 5 |
| Venues created | **0** |
| Rows skipped | 0 |
| Gate bounces (409/422/500) | 0 |
| Creates against the 50 cap | 26 of 50 |

## 2. Capture (§6A step 4)

- URL `https://onthecasemusic.co.uk/gigs`, fetched with `curl` in the sandbox. 383,343 bytes.
- Parser `data/raw/onthecasemusic/2026-08-14/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` — byte-identical to the 2026-08-08 and 2026-08-12 parsers. Gig ids read from `a[href]` per §0.22. No `get_page_text`, no synthetic ids.
- **294 rows over 114 dates, 2026-08-13 → 2027-12-26.** 29 rows carry no `band_id` (the `noimage` placeholder).
- Raw + normalised capture: `data/raw/onthecasemusic/2026-08-14/{gigs.html,capture-normalised.txt,records.json}`.

⚠ The spec says `/gigs` is client-rendered and Chrome is mandatory. It is not, and a curl capture reproduced the feed in full. Already in CTO-INBOX as `otcm-chrome-not-mandatory`. The spec was NOT edited by this run.

## 3. Diff (§6A step 5, §5.7)

Diffed on `(date, gig_id)` first, then on the row text, per the spec's DIFF AND CAPTURE SAFETY item 2.

| | n |
|---|---|
| Snapshot rows (2026-08-12) | 271 |
| Capture rows (2026-08-14) | 294 |
| **Added** | **23** |
| **Removed** | **0** |
| **Changed** | **1** |
| gig ids that moved date | 0 |

23 added on a 271-row feed is a normal week, not the "hundreds of added rows" capture bug the spec warns about. All 23 are two venues opening their autumn diaries in one go: 15 Sunday-afternoon rows at the Sea Horse Club and 8 Friday rows at the Ivy House.

**§5.7(a) SELF-DIFF GATE: the new snapshot re-diffed against the capture it was written from at 0 added / 0 removed / 0 changed.** The gate passes. The run deleted nothing anyway, because the diff reported no removed rows.

### §0.29 mode

The spec declares **no mode**. §0.29 names onthecase as qualifying for `delta` on evidence, and this run produced the 0/0 self-diff that §0.29 requires. The question did not become load-bearing: **zero removed rows, so no deletion decision arose.** Raised in CTO-INBOX as `otcm-mode-not-declared`.

## 4. The changed row — a re-bill, EDITED not duplicated

| | |
|---|---|
| gig id | `126595` |
| date / venue / time | 2026-08-15, Clousden Hill, 21:00, FREE — all unchanged |
| act was | Sceptre Duo (`cd99e6f7-2e20-421e-8dad-5e87b59385f4`) |
| act now | Babel Fish (`0e25b84c-4100-4780-94db-74d95f3e8593`) |
| bndy event | `d7346c29-6efb-40fb-a3e9-d2714a56e736` |
| action | **`edit_event`** — `artistId` and `title` changed in place. Verified by `get_by_id`: title `Babel Fish @ Clousden Hill`, `updatedAt` 2026-08-14T00:07:34Z, externalId `onthecasemusic:126595` intact. |

**A correction, and it is a rule conflict I resolved rather than escalated.** The 2026-08-12 snapshot header instructed a run to *"delete the stale bndy event and create the correct one"* on a changed row. Two higher authorities say otherwise and say it in the same words: RUNBOOK **§0.17** (*"time/detail changes on a source = EDIT the existing event (found via externalId), never create a sibling"*) and `sources/onthecasemusic.md` DIFF SAFETY item 2 (*"the source changed who is playing ONE booking. EDIT the existing event"*). A state file is not a rules file (§0.25). I edited. An edit is not a hide, so the "never hide" half of the 2026-08-06 ruling is honoured, and the outcome is one record for one booking rather than the two that the 2026-08-07 incident left behind. **The snapshot header is corrected in this run's snapshot; the snapshot is this source's own file (§6F ownership), so no other file was touched.**

## 5. Venues

| source venue | bndy venue | id | action |
|---|---|---|---|
| Sea Horse Club at Whitley Bay FC (6074) | Seahorse Sports Bar | `a5f246ed-33d4-465f-8a7b-6f482493f500` | matched 100%, learned mapping in the spec |
| Ivy House Sunderland (6130) | Ivy House | `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` | matched 100% |
| Clousden Hill Forest Hall (6028) | Clousden Hill | `a1d31424-4293-4187-83b0-5b940b853053` | matched 100% |

**Zero venues created.** No `search_venue` miss occurred, so the §3 three-probe fallback was not needed.

## 6. Artists created — 3, all with a verified page or an evidenced blank

### 6.1 The Revolutionaires — `9ce438f8-79cf-4c9d-a939-d5f797dd32f5` — VERIFIED PAGE
- externalId `onthecasemusic:157`. nameVariant `Revolutionaires`.
- Facebook `https://www.facebook.com/TheRevolutionairesOfficial`, avatar `graph.facebook.com/TheRevolutionairesOfficial/picture?type=large`.
- Bio quoted character for character from the page Intro. Location `North East`, `locationType: regional` (§6B Kilmarnock pairing). Genres `Rock n Roll`, `R&B`. **actType LEFT EMPTY** — nothing on either surface says covers or originals, and §0.18 outranks the covers default.
- Name: the act's own page reads *"The Revolutionaires official"*. `official` is a page-name tail, so the act is **The Revolutionaires** (§0.6, §0.20) and the source's billing `Revolutionaires` became a nameVariant. Songkick, Ents24 and a Twinwood Festival billing all use the same name.
- Evidence beyond the name: the source's own band page describes a 1940s/1950s rhythm-and-blues act *"Established within the 'hotbed' of the North East music scene"*, which the UK listings repeat. Page live (posts dated August 2026), 8.3K followers.
- ⚠ `create_artist` returned `action: "review"` against **Revolution** (Greater Manchester, 67%) and **The Voltaires** (Portsmouth, 60%). Different names, so not a collision — resolved with `confirmNew: true` per §1A.7. This is the sanctioned path, not a §0.9 workaround.
- ⚠ The website the page links, `revolutionaires.co.uk`, is parked at IONOS. Not stored.

### 6.2 Big TED — `5d25b783-fd8e-47bc-884b-390269d80bfd` — VERIFIED PAGE, strongest evidence of the run
- externalId `onthecasemusic:820`. nameVariant `Big Ted`.
- Facebook `https://www.facebook.com/bigtedband`, avatar `graph.facebook.com/bigtedband/picture?type=large`.
- The page Intro states *"North East based rock band"* and a post dated 10 May reads *"great to be back with all our friends in Whitley - thanks so much! We'll be back later in the year at the Seahorse"* — **the act's own page naming the exact venue this run imported.**
- Bio quoted character for character, including the page's own line breaks and member list. Location `North East`, regional. Genres `Rock`, `Metal` (page) + `Pop` (source). actType `covers` from the source's structured field per §2A.5(b).
- Name: the act's own page spells it `Big TED`; that wins over the source's `Big Ted` (§0.20). The billing `Big Ted` is in the event title.

### 6.3 Reload — `d6d088f2-1a7d-4d06-95d7-310fba749cdb` — **EVIDENCED BLANK**
- externalId `onthecasemusic:710`. Socials, bio and avatar **empty** — blank beats wrong.
- Variants tried, **both surfaces** (§2A.1 item 3b):
  - Google: `"Reload" rock covers band north east england facebook`
  - Facebook page search: `reload band`, `reload band north east`
  - Candidates opened and REJECTED: `facebook.com/fwreload` — a US act; its own feed carries *"Defiance Main Street and Visitors Bureau"*, Defiance, Ohio (§2A.1 item 1). `facebook.com/reloadedcovers` — a different name (*Reloaded*) and Yorkshire. `reloadtheband.co.uk` and its `profile.php?id=61589059680984` — a UK function band that states no location and shows no North East footprint.
- ⚠ **Tool limitation, named per §6B:** the Facebook page-search surface returned `No text content found` in the MCP tab on both queries. That is the hidden-tab / lazy-feed guard, not a source fault. Two attempts, then stop — the Google surface and three opened candidate pages carried the work.
- Genre `Rock` and actType `covers` come from the source's structured band page (§2A.5(b)).
- **This is a second record named Reload, and it is correct.** §1A.2 was run in full: the existing `Reload` `138107b9-a894-4dc8-9dff-6140dbc957cc` is Staffordshire and its entire event history is one gig at Cosey Club, **Crewe** — a footprint disjoint from the North East (§1A.2 step 4). `confirmNew: true`.

## 7. Records topped up (§1A.4 repair-on-contact, and provenance back-fill)

| record | id | what was added |
|---|---|---|
| Reload (Staffordshire) | `138107b9-a894-4dc8-9dff-6140dbc957cc` | `locationType: regional` on `Staffordshire UK`. §1A.4 — the pair must end distinguishable on **both** sides, and an unpaired regional string geocodes to Kilmarnock (§6B). |
| Pretty Weeds | `f403789c-f79d-4725-92bc-04f048005032` | externalId `onthecasemusic:832` |
| Urban StaRz | `82cb24d4-6df3-4f82-bd38-a561ab068b45` | externalId `onthecasemusic:147` |
| Reviver | `bb436395-34cf-44a2-b84b-77d0c61d7268` | externalId `onthecasemusic:1189` |
| The 3rd Half | `97298965-2ab5-4ebb-b74e-2fb199af7ec2` | externalId `onthecasemusic:30018`, nameVariant `The Third Half` |

All five verified on read-back. Every existing externalId was preserved — each call passed the complete intended array with `replaceExternalIds: true` after a `get_by_id`, rather than trusting append semantics.

### 7.1 The Third Half → The 3rd Half — same act, reused
`search_artist("The Third Half")` returned **The 3rd Half** at 79% — below any auto-match bar, and a name that normalises differently. §1A.2 Step 0 settled it: the existing record's Facebook page `61557472551018` posts *"We are at The Stone Trough in Low Fell tonight"* with a Gateshead address. Gateshead and Whitley Bay are the same canonical region with an overlapping footprint, so §1A.2 step 3 makes them the **same act**. Reused, no third record, and the billing `The Third Half` is now a nameVariant so no future run asks again (§1A.5).

⚠ The record now carries **two** `onthecasemusic` band ids, `31093` and `30018`. That is deliberate and follows the live precedent on Dog In A Box (`112` and `28950`). Whether the source genuinely lists this act twice is not established; it does not block anything.

## 8. Events created — 23

All: `isPublic: true`, times taken from the source (never defaulted — §5.6 was not needed), externalId in the §6D slug form `{source:"onthecasemusic", id:"<date>-<artist-slug>-<venue-slug>"}` with the artist slug taken from the **bndy** record name, `eventUrl` set to the source gig URL. All 23 verified by `get_by_id`.

### Seahorse Sports Bar `a5f246ed-33d4-465f-8a7b-6f482493f500` — 16:00, £4.00, `ticketed: true`

| date | billing | artist id | event id |
|---|---|---|---|
| 2026-09-06 | Four Letter Word | `aadc0f12-b30b-48fd-a712-4e725bfca388` | `898941fe-fb23-4ebe-a4f5-0d1d3c2f30d3` |
| 2026-09-13 | The Third Half | `97298965-2ab5-4ebb-b74e-2fb199af7ec2` | `490c5adf-b989-4fcc-a8c6-bf7438966934` |
| 2026-09-20 | Six Card Trick | `cd61cff9-0d45-46de-a836-433922dd580c` | `fce981b7-b32d-4485-be1e-4a04a8cdfb10` |
| 2026-09-27 | Revolutionaires | `9ce438f8-79cf-4c9d-a939-d5f797dd32f5` | `de27099a-8be0-475c-81c2-69804be80f04` |
| 2026-10-04 | Dog In A Box | `e9e0b454-daf9-4044-a0d1-5f508eb87abf` | `ba23ae52-b475-4287-9846-1ba2bd929e1a` |
| 2026-10-11 | 7 Sins | `f1903d5b-c5ea-49bc-bca3-d57c641b4d83` | `43fca5c9-65c9-4fee-9dfd-de9ea898fb69` |
| 2026-10-18 | Big Ted | `5d25b783-fd8e-47bc-884b-390269d80bfd` | `d6018962-f718-4ac7-8a76-db9109d1cce1` |
| 2026-10-25 | Reload | `d6d088f2-1a7d-4d06-95d7-310fba749cdb` | `cd95e847-b38e-40c3-b9b5-877a74e37bb7` |
| 2026-11-01 | Babel Fish | `0e25b84c-4100-4780-94db-74d95f3e8593` | `b9b16ecb-ba5a-42b5-848e-bdf158692049` |
| 2026-11-08 | GodZZ of Wor | `a51444bb-bd21-4ba0-b5e0-154c2bc64b95` | `4625a5eb-c5bd-405c-8a0b-7a9947e40742` |
| 2026-11-15 | Mugshot | `49a44817-cd55-4f94-8290-c4feff794739` | `b73336f2-deb9-4338-8e14-e822b647ca4a` |
| 2026-11-22 | Small Wonder | `0f40ca01-73a1-4eb0-b0cf-8acdc4de5df3` | `8655328c-59e8-4469-ab62-45f6b6364629` |
| 2026-11-29 | Stormy Monday | `e31a39c2-3c4b-43ac-a35c-d2ab6ce3ea4f` | `72f7bd2b-dbcb-417b-be33-5a02fa1d02e7` |
| 2026-12-06 | Hot Sauce | `9c499721-d963-40a8-9fad-574b0ab14e17` | `8d7f1f0c-f3ac-46c5-926c-86ddd5c4f9aa` |
| 2026-12-20 | Tubesnake | `f8aa9069-a885-4934-b2bf-b35728444422` | `5cb9dc5c-f65c-4238-809b-524d61fb42d4` |

### Ivy House `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` — 20:00, FREE, `ticketed: false`

| date | billing | artist id | event id |
|---|---|---|---|
| 2026-08-21 | Face Value Duo | `f01a16e2-35af-402e-9f36-f48e48a597e6` | `4159336a-b604-441c-a6d9-f4877fc584b9` |
| 2026-09-11 | Justuzfor | `62d06f64-b67c-41c5-96a0-38414415c822` | `86fe1000-2acd-4f97-bfb6-2d9e5d9d0bdb` |
| 2026-09-18 | The Substitutes | `5982cd16-4824-42ce-b3f8-2bece6b6afe5` | `600fe050-658f-488a-8ef5-cbb60aba993c` |
| 2026-10-02 | Pretty Weeds | `f403789c-f79d-4725-92bc-04f048005032` | `11d7c162-4f26-4ba2-9a92-b760a68f9338` |
| 2026-10-16 | Urban Starz | `82cb24d4-6df3-4f82-bd38-a561ab068b45` | `19db54fb-02fc-42b3-8934-e3c0bab76ca0` |
| 2026-10-23 | Steel Blue | `1c0c24cc-0dfc-426a-a176-5b1f7ac00555` | `c556539c-ee70-4d10-94a3-f4051294eda7` |
| 2026-11-06 | Reviver | `bb436395-34cf-44a2-b84b-77d0c61d7268` | `a4675ec2-cceb-4770-a696-48df4b4f9079` |
| 2026-12-04 | Undercover Band | `8573e476-7041-48c4-975b-e8651e01f9f0` | `c5a2d970-4820-478d-8a83-05ff9e5acdc8` |

**Billing vs record name (§1A.5 — the billing lives in the event title, the artist id never changes).** `Revolutionaires` → The Revolutionaires · `Big Ted` → Big TED · `The Third Half` → The 3rd Half · `Urban Starz` → Urban StaRz.

**Defaulted times: none.** Every row published an explicit time and it was used as the stage time (§0.28). No `14:00-20:00`-style window appeared, so §0.28's window rule was not engaged.

## 9. Tombstone check (§5.4, v2.19)

`data/state/cancellations.jsonl` read before the first create. It holds one real entry, `PULS @ Arden Arms 2026-08-08`. **No artist + venue + date in this run matches it.** Nothing was TOMBSTONED. Nothing was appended — this run deleted nothing.

## 10. Names sanitised or staged as non-acts (§0.6)

**None.** All 24 billings were clean act names. No promo tail, no lineup string, no placeholder. `Buskers night` appears in the feed but only on rows that were already in the snapshot, so it never reached the pipeline.

Two names were **corrected to the act's own page spelling**, which is a §0.20 correction and not a sanitisation: `Revolutionaires` → `The Revolutionaires`, `Big Ted` → `Big TED`. Both spellings are preserved as nameVariants.

## 11. Gate bounces

**None.** Zero 409, zero 422, zero 500. One `action: "review"` on `create_artist` (The Revolutionaires), resolved with `confirmNew` per §1A.7 — a review is not a bounce.

⚠ Two known CTO-INBOX defects did **not** reproduce on this run: `create-artist-500-namevariants` was avoided by creating first and adding nameVariants with a separate `edit_artist` call, and `edit-artist-409-namevariants` did not fire — three `edit_artist` calls carrying `nameVariants` all returned success. Recorded here, not raised again.

## 12. Validator (§6A step 8)

Evidence file written **before** the bndy writes: `data/state/enrichment-evidence-2026-08-14-onthecasemusic.jsonl` (6 lines — 3 pre-write captures, 3 post-write lines carrying the artistId).

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-14/records.json \
  --evidence data/state/enrichment-evidence-2026-08-14-onthecasemusic.jsonl

[ ok ] The Revolutionaires  9ce438f8-79cf-4c9d-a939-d5f797dd32f5
[ ok ] Big TED  5d25b783-fd8e-47bc-884b-390269d80bfd
[ ok ] Reload  d6d088f2-1a7d-4d06-95d7-310fba749cdb

3 records · 3 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0.

**Judgment-class sample (§6A step 8, the rules a script cannot check).** All three creates were checked by hand against source: is this the right act's page (Big TED names the venue; The Revolutionaires matches the source's own description; Reload has no page and got none), is the name a billing string (no), is an inferred genre correct (the two inferred values are `R&B` for The Revolutionaires, from the page's own "rhythm & blues" lineage, and `Metal` for Big TED, from the page's own "heavy rock and metal").

## 13. Quality summary (§6, v2.5 — not an error count)

| measure | n |
|---|---|
| Artists created **with a verified page** | **2** of 3 |
| Artists created with an **evidenced blank** | **1** of 3, variants recorded on both surfaces |
| Artists created as a **stub** (no page, no evidenced blank) | **0** |
| Bios written | 2, both quoted character for character |
| Bios paraphrased or composed | **0** |
| Records staged | **0** — §0A. The run decided every row. |
| Names sanitised under §0.6 | 0 |
| Rows skipped as non-acts | 0 |

## 14. Raised to CTO-INBOX

| fingerprint | kind | why it is new |
|---|---|---|
| `otcm-mode-not-declared` | RULE | §0.29 requires the spec to declare `delta` or `append-only`. It declares neither. Four sibling entries exist for sceniceye, gigs-news, klma and insangel; none for otcm. |
| `otcm-externalid-form-mixed` | DEFECT | Three externalId forms are live on this source's events. Distinct from the `externalid-slug-drift` entry, which is filed against gigs-news. |

Nothing else was raised. `record_run` was not called — `SOURCE_RUNS_TOKEN` is still unset and that is already in the inbox as `record-run-token-missing`. It is not blocking; `run-summary.jsonl` is the dashboard's input and it was appended.

## 15. Open, for the next run

1. **The externalId form on this source is not uniform.** Event `d7346c29` carries the bare gig id `126595`; four Seahorse events carry `<artist>-<date>-<venue>` or a truncated venue slug (`2026-08-31-assassin-sea-horse-club-at-whitley-bay-`). A future run must not read "no externalId match" as "the event is absent" — resolve by venue plus date range as this run did. Written into the snapshot header as well.
2. **29 of 294 rows carry no `band_id`.** Today one of them mattered (The Third Half) and the band id was recovered from the venue detail page `/venues/6074/...`, which cross-links `/bands/{id}/{slug}`. That recovery route works and should be the standard fallback.
3. **The feed's first date is 2026-08-13, a day behind the local date.** The site appears to hold the previous day briefly. No past-dated row was imported (§0.14); the earliest row this run wrote is 2026-08-21.

## 16. Files written

| file | what |
|---|---|
| `data/raw/onthecasemusic/2026-08-14/gigs.html` | raw capture |
| `data/raw/onthecasemusic/2026-08-14/capture-normalised.txt` | normalised capture, the self-diff input |
| `data/raw/onthecasemusic/2026-08-14/records.json` | parsed rows |
| `data/raw/onthecasemusic/2026-08-14/parse.py` | the parser used, md5 `4910da5ad72576c5a50959966ca4adc3` |
| `data/state/onthecasemusic-last-page.txt` | **new snapshot, 294 rows, self-diff 0/0/0** |
| `data/state/enrichment-evidence-2026-08-14-onthecasemusic.jsonl` | evidence, written before the writes |
| `data/normalized/onthecasemusic/2026-08-14/records.json` | validator input |
| `data/normalized/onthecasemusic/2026-08-14/RUN-REPORT.md` | this file |
| `data/state/run-summary.jsonl` | one appended line |
| `20-Daily/2026-08-14.md` | one appended line |
| `CTO-INBOX.md` | two appended lines |

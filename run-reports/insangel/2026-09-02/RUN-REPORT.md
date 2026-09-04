# insangel — RUN REPORT 2026-09-02

- **runId**: `insangel-2026-09-02T05-02-36Z`
- **outcome**: COMPLETED. All in-scope rows were written. The 50-create cap was not reached.
- **runbook version read**: v2.27. **CURRENT FLOOR (§6A)**: v2.19. Above floor.
- **prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **claim**: `data\state\claims\insangel.json`. Previous state `heldBy: null`, released by the 2026-09-01 run. Acquired clean. No takeover.
- **heartbeat**: `data\state\heartbeat\insangel-2026-09-02T05-02-36Z.json`
- **mode**: `append-only`. The spec declares no §0.29 mode, so no removal was actioned.

## 1. Headline

| measure | count |
|---|---|
| events created and read back | 9 |
| artists created and read back | 1 |
| venues created | 0 |
| venues matched to an existing record | 6 |
| artists matched to an existing record | 8 |
| rows deferred at the cap | 0 |
| rows skipped, stated reason | 0 |
| 409 or 422 bounces | 0 |
| validator | 1 record, 1 clean, **0 FAIL, 0 WARN** |

**Creates this run: 10 of 50. The cap was not reached and no row was left unwritten.**

Quality split (§6): **0** artists created with a verified page · **1** artist created with an evidenced blank · **0** artists staged · **0** names sanitised under §0.6 · **0** rows staged as non-acts.

## 2. Capture

- `web_fetch` on `https://insangel.co.uk/venues` remains unusable for this host. Chrome was the surface, as on 2026-08-21 and 2026-09-01.
- `list_connected_browsers` returned one browser, `bndy`.
- Collection used DOM `a[href]` reads inside `javascript_tool`, per §0.22. `get_page_text` was not used for extraction.
- Raw capture: `data\raw\insangel\2026-09-02\venues-body.txt`.

Raw page: **67 venue cards, 989 gig rows, 1000 artist-gig anchors.**
In scope after filters: **66 venues, 644 artist-gig pairs.**
Out of scope: 6 rows dated before capture, 349 rows on the five declared placeholder band slugs, 1 duplicate pair collapsed.

`javascript_tool` output guards behaved exactly as §6B records. The `=` guard blocked any raw return, so every returned string was transformed. Output truncated near 1000 characters, so the snapshot body was paged out in venue-line ranges. Two ranges over-ran and were re-requested split by pair index (`the-denton--newcastle`, 64 pairs; `the-high-crown--chester-le-street`, 46 pairs). **Neither is a source fault.**

## 3. Self-diff gate (§5.7a)

The snapshot body was hashed in the page and again on disk.

```
SHA-256 8338b5f230ace5b1355bffff0fa5c9cdd74e43e28e9b3174feb3dbff28cafa57
16750 bytes, both sides. 0 added / 0 removed. GATE PASSES.
```

The page-side hash was computed with `crypto.subtle.digest` before any transfer. The disk-side hash was computed after the paged reassembly. They agree, so the 25-chunk transfer is proven lossless.

## 4. Diff against the stored snapshot

Previous snapshot: `insangel-2026-09-01T19-50-24Z`, captured 2026-09-01T20:00:00Z.

- venues added: **0**
- venues removed: **0**
- pairs added: **3**
- pairs removed: **0**

| added pair | written as |
|---|---|
| `the-denton--newcastle 2026-12-05:krank-it-up` | event 1 below |
| `the-endeavour--middlesbrough 2026-12-11:mark-carter` | event 2 below |
| `the-high-crown--chester-le-street 2027-07-10:mac-3` | event 3 below |

**No row vanished from the source today.** §5.7 removed-row handling and §0.17 deletion did not run, both because the mode is `append-only` and because there was nothing to action.

## 5. The 2026-09-01 backlog was written first

Yesterday's run stopped at the 50-create cap with 6 rows unwritten. The snapshot records those rows as seen, so today's diff cannot re-offer them — the standing defect `insangel-snapshot-hides-backlog`. **The six rows were taken from §9 of the 2026-09-01 report, which is the documented workaround.**

Every one of the six externalIds in that table was recomputed from the D-05 formula `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]` before use. **All six reproduced exactly.** The table was therefore trusted, not merely copied.

## 6. Dates and times — the venue detail page again decided both

The listing page prints no year and no time. The venue detail page prints both, and it was fetched for every venue written to. Six detail pages were read: `the-denton--newcastle`, `the-endeavour--middlesbrough`, `the-high-crown--chester-le-street`, `g-w-horners--chester-le-street`, `the-rosedene--sunderland`, `the-seaton-lane-inn--seaton`.

**Every one of the nine rows was confirmed by the detail page, in both year and time.** Examples, verbatim from the page:

- `Saturday 5th December 2026 | 20:00 - Krank It Up`
- `Friday 11th December 2026 | 19:00 - Mark Carter | The Big Man with The Big Voice`
- `Saturday 10th July 2027 | 19:00 - Mac 3 | Amazing 3-Piece Cover Band`
- `Saturday 31st July 2027 | 21:00 - Reviver | North-East 90s Indie/Brit-Pop Cover Band`

**No row used a §5.6 default start time. No time was defaulted and no time was invented.** All nine carry a published stage time (§0.28). No listing published a doors time or an opening window, so `ticketInformation` was not needed.

This is the third consecutive run in which the detail page settled the year without ambiguity. The open items `insangel-year-rule-underdates-13mo` and `insangel-weekday-proves-2027-year` already cover the rule change. No new item is raised.

## 7. Venues

**Created: 0.** Every venue in today's nine rows already exists in bndy and was matched by its stored record.

| venue | id | city |
|---|---|---|
| The Denton | `cdac6734-32df-4f95-b2d9-e262d4a9185a` | Newcastle |
| Endeavour | `36c35f24-a878-4bbf-ae60-6ba1ec82dbec` | Middlesbrough |
| The High Crown | `fb1faaca-ed16-4f3f-8d7e-a907417635dd` | Chester-le-Street |
| GW Horners | `35b992a2-2903-4172-be1b-11d8e9ca35ec` | Chester-le-Street |
| Rosedene | `05adcd18-a961-465d-a862-55bdd541ed83` | Sunderland |
| The Seaton Lane Inn Seaham | `29feef76-622d-4385-9bf8-3ffb1322bee7` | Seaton |

Each city was read back on the event record and agrees with the source's own venue page. No venue name was searched and no venue was created, so the §3 v2.16 fallback probes were not needed this run.

## 8. Artists

### Created with an evidenced blank (1)

| artist | id | artistType | location | externalId |
|---|---|---|---|---|
| Krank It Up | `9d0569cc-d4e1-44d7-8da7-49b86ee96df5` | band | Newcastle upon Tyne, `city` | `{source:"insangel", id:"krank-it-up"}` |

**Search variants tried, both surfaces (§2A.1 item 3b), bare name first (§2A.1 item 3c):**

1. Google `"krank it up" band` — returns a Houston production company, a Medford MA car-audio shop, a Colorado covers-band mention, a Spotify track by "Krank It Up Boyz", and a Florida magazine. **No UK act.**
2. Google `"krank it up" band north east gigs` — the first result is the insangel listing itself. Every other result is US or unrelated. **No UK act.**
3. Facebook page search `krank it up` — Facebook auto-corrected to "crank it up" and returned seven pages: a Houston record label, a 15-follower community, a Florida magazine, a Massachusetts car-audio shop, an Idaho photographer, an Ohio golf fundraiser, and a cycling group. **None is a music act, and none is UK.**

**Result: an evidenced blank.** `facebookUrl`, `bio`, `genres` and `actType` are all empty. Blank beats wrong (§2A.1 item 1).

The insangel band page `https://insangel.co.uk/bands/krank-it-up` publishes **no bio, no genre, no set list content and no social link** — only the single gig. So the §2A.5(b) structured-source exception supplies nothing for this act either. `location` therefore falls back to the most-played venue's city per the spec, which is Newcastle. That is one gig at The Denton, Newcastle.

⚠ **`artistType: band` is an inference from the name shape**, per the spec's own mapping (no ` Duo` / ` Trio` tail, more than one word). The tool requires the field. This is the standing `artisttype-required-forces-an-inference` item; no new item is raised.

**Note on the Facebook surface.** `facebook.com/search/pages/?q=` **worked normally today** and returned a full result set. The 2026-08-14 item `facebook-page-search-not-found` recorded that surface as down. It is up. Recorded here rather than in the inbox, because a working tool is not an item.

### Matched (8)

| source slug | artist | id | how matched |
|---|---|---|---|
| `mark-carter` | Mark Carter | `50530f7a-09c1-4afc-8172-e5bc52fd64cf` | normalised name equality, 100%. Barnard Castle, County Durham — inside the source's own region. |
| `mac-3` | Mac 3 | `5f62427f-dd16-4ca1-a203-63c7d79e318b` | normalised name equality, 100%, sole result. North East. |
| `the-tonic` | The Tonic | `361d13c3-fc6d-4bb0-ad07-1c7f605443b7` | resolved by the 2026-09-01 run; id re-verified on read-back. |
| `small-wonder` | Small Wonder | `0f40ca01-73a1-4eb0-b0cf-8acdc4de5df3` | as above |
| `toastbloke` | toastbloke | `b01b546a-7036-4bcc-a297-48a59c984d46` | as above |
| `kaitlin-lee-robson` | Kaitlin Lee Robson | `20e12f89-e16d-47bf-9037-35c8b981fa73` | as above |
| `reviver` | Reviver | `bb436395-34cf-44a2-b84b-77d0c61d7268` | as above |
| `parrk` | Parrk | `ed9f23bf-593d-4b6b-81cd-2ddc144efbdf` | as above |

**The near-name ladder was applied, not the score.** `search_artist("Krank It Up")` returned **KRANKT `74c9ba75-d11b-42c9-9502-62220bc32e8d` at 55%**, a Willenhall (West Midlands) band with its own Facebook page. Under the deleted ≥80 auto-link rule this would not have linked, but the score is high enough to tempt. It is a **different name in a different canonical region with a disjoint footprint**, so it is a different act (§1A.2 rule 4). `Krank It Up` and `KRANKT` both carry a location and the pair ends distinguishable on both sides (§1A.4). No top-up was owed: the existing KRANKT record already holds a location and a Facebook page.

`search_artist("Mark Carter")` returned **Get Carter `d379f5a2-3838-4405-9c73-ee79a7ae2500` (North East, 64%)**. Different name, different act, no link — the same class the source spec's ladder was rewritten for.

`nameVariants` was not written on any record. `create-artist-500-namevariants` and `edit-artist-409-namevariants` are both open defects.

## 9. Events created (9), oldest first — all verified by `get_by_id`

| # | date | time | event | id | externalId |
|---|---|---|---|---|---|
| 1 | 2026-12-05 | 20:00 | Krank It Up @ The Denton | `ccef7bc8-3a28-471a-902b-a617a5354df7` | `26ce071d4ea4` |
| 2 | 2026-12-11 | 19:00 | Mark Carter @ Endeavour | `7a7057ee-6919-493c-bc1e-d67a3e57b8ea` | `268a2b977a72` |
| 3 | 2027-07-03 | 21:00 | The Tonic @ GW Horners | `052a80f7-a268-479c-9318-edfaad4ccae1` | `1da1cab92da2` |
| 4 | 2027-07-10 | 19:00 | Mac 3 @ The High Crown | `5e1f39fe-a54a-422e-bbf6-7a0fea10a23f` | `784215497f27` |
| 5 | 2027-07-17 | 19:00 | Small Wonder @ The High Crown | `e59ed7d4-5de1-4055-9414-79c0fb8854f4` | `4de03d98936a` |
| 6 | 2027-07-30 | 20:00 | toastbloke @ Rosedene | `5633a0b5-bc61-4adf-a322-ba8fd6120aa1` | `a1ac5773e02d` |
| 7 | 2027-07-30 | 20:00 | Kaitlin Lee Robson @ The Seaton Lane Inn Seaham | `635e9d4e-ae7b-4691-948d-8da54ce48a41` | `91b88e124e9c` |
| 8 | 2027-07-31 | 21:00 | Reviver @ GW Horners | `655bd5e5-731f-4c9e-9899-6e621826628f` | `56191eaa8791` |
| 9 | 2027-07-31 | 19:00 | Parrk @ The High Crown | `966df0ce-2c38-4c2a-96b1-fa608d873480` | `b97bca1341c5` |

Every event is `isPublic: true`, carries the title form `«Artist» @ «Venue»`, and read back with its externalId stored. Every externalId is the §6D-exception sha1 form ruled final by D-05.

**Horizon (§6E): 12 months from capture, so 2027-09-02.** The latest row written is 2027-07-31. Nothing was beyond the horizon this run.

**Tombstone check (§5.4, v2.19).** `data\state\cancellations.jsonl` was read before the first create. **17 entries. Zero matched an artist plus venue plus date in this batch.**

**409 or 422 bounces: none.** All nine rows were genuinely absent from bndy.

## 10. Not written

**Nothing was deferred and nothing was skipped this run.**

Three rows remain permanently unwritable at `hornby-park--seaton-carew` (Jade Sanders 2026-10-18, Dave Ridley 2026-12-09, Kaitlin Lee Robson 2026-12-19). The venue publishes no address and no postcode, and §0.8 forbids the guess. They are already in the snapshot and so never appear in a diff. This is the open item `insangel-hornby-park-no-address`, raised 2026-09-01. Same for `houghton-golf-club` (`insangel-houghton-golf-club-no-address`).

Two named non-places remain in the capture and are never imported: `private-function` (§0.23) and the band slug `tbc` at `the-raven--cleadon` on 2026-09-30 (§0.4). Both classes are already logged — `insangel-private-function-bare-slug` and `insangel-placeholder-list-incomplete`. **No new item.**

## 11. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/raw/insangel/2026-09-02/validator-records.json \
  --evidence data/state/enrichment-evidence-2026-09-02-insangel.jsonl

[ ok ] Krank It Up  9d0569cc-d4e1-44d7-8da7-49b86ee96df5

1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
EXIT 0
```

**First pass, no corrections needed.** The evidence line was written before the bndy write and records the raw band-page text plus the three search variants that produced the blank.

## 12. Files written

- `data\raw\insangel\2026-09-02\venues-body.txt` — the capture
- `data\raw\insangel\2026-09-02\validator-records.json` — working file
- `data\state\insangel-last-page.txt` — the new snapshot, with its normalisation rules in the header
- `data\state\enrichment-evidence-2026-09-02-insangel.jsonl` — 1 record
- `data\state\run-summary.jsonl` — one appended line
- `20-Daily\2026-09-02.md` — one appended line
- `CTO-INBOX.md` — **no line appended.** Nothing was found that an existing item does not already cover (inbox rules 3, 4 and 5).

`record_run` was not called. `SOURCE_RUNS_TOKEN` is still missing (`record-run-token-missing`, already in the inbox).

## 13. What the next run should do first

1. Nothing is deferred. Start from the diff.
2. The detail-page fetch is now proven for a third run. Six fetches settled year and time for nine rows with no ambiguity. It should become the standard capture step for this source rather than a per-run choice.
3. The snapshot transfer costs about 25 `javascript_tool` returns because of the ~1000-character output truncation. Two venues exceed one return on their own. A next run should page by **pair index**, not by venue index, and avoid the two re-requests this run needed.

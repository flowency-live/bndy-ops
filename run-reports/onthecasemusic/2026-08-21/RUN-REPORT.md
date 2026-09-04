# onthecasemusic — RUN REPORT 2026-08-21

Run id: `onthecasemusic-2026-08-21T00-42-30Z`
Heartbeat: `data\state\heartbeat\onthecasemusic-2026-08-21T00-42-30Z.json`
Outcome: **completed**

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written before any gate. Rewritten `completed` at the end. |
| §6A step 1 date | `2026-08-21` from the sandbox shell. |
| §6A step 2 runbook | `RUNBOOK.md` H1 reads **v2.27**. Read in full. |
| §6A step 2a floor | CURRENT FLOOR **v2.19**. Runbook v2.27. **PASS.** The task prompt states no number of its own, so there is no drift to report this run. |
| §6A step 2b claim | `data\state\claims\onthecasemusic.json` read `heldBy: null`. Acquired at 00:42:30Z, TTL 90 min, `expiresAt` 02:12:30Z, `heartbeatFile` named. No takeover. |
| §6A step 3 tools | bndy MCP reachable. **Claude in Chrome CONNECTED** (`list_connected_browsers` returned one local browser) and Facebook read normally. The 38-firing outage has ended. |
| Spec | `sources\onthecasemusic.md` read in full. |
| CTO-INBOX | Read in full. Fingerprints checked before any new item. |

## 2. Capture

Curl plus the regex parser, per the method fixed on 2026-08-08 and unchanged since.

- URL `https://onthecasemusic.co.uk/gigs`, HTTP 200, 381,100 bytes.
- Parser `data/raw/onthecasemusic/2026-08-21/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` — byte-identical to the 2026-08-19 parser.
- **293 rows, 113 dates, 2026-08-20 → 2027-12-26.** 293 unique gig ids. 30 rows carry no band id.
- Gig ids read from `a[href]` (§0.22). No synthetic id was written.

## 3. Diff (§5.7, §5.7(a))

Both sides normalised identically before comparison. The five rules are written into the snapshot header.

**Against the 2026-08-19 snapshot: 6 added / 0 removed / 3 changed.**

**SELF-DIFF GATE: the new snapshot re-diffed against the capture it was written from returns 0 added / 0 removed / 0 changed.** The gate passes.

No row was removed, so no deletion decision arose and §0.29 mode did not become load-bearing this run.

### 3.1 The three changed rows

| gig | change | action |
|---|---|---|
| 131373 | Address gained the venue phone `0191 261 0989` | None. Venue detail, not event data. |
| 131372 | Address gained the venue phone `0191 261 0989` | None. Same. |
| **126346** | **Copperhead 2026-08-29 MOVED VENUE:** Old Fat Ox Holywell → Red Lion Earsdon. Same date, same 17:00. | Handled as a change. See §5. |

## 4. Rows pipelined

All six added rows are future-dated and inside the 12-month horizon. All six were **already in bndy** — created at 00:16–00:17Z today by the unclaimed writer that `unclaimed-writer-16-acts-17-gigs-0015z` records, with **empty externalIds**. This run did not create duplicates. It back-filled the provenance.

| gig | act | venue | date | bndy event | action |
|---|---|---|---|---|---|
| 131479 | Koolrock Uk | The Frog & Ferret | 2026-08-21 | `ea60a777-9edd-4cfa-9daa-494df4265b33` | externalId back-filled |
| 131477 | The 441's | The Red Lion | 2026-08-22 | `de1cb75a-c23e-4965-a606-fb7d34a60428` | externalId back-filled |
| 131480 | Diamond Dogs | The Frog & Ferret | 2026-08-22 | `89f4194a-fbbd-47e9-b083-88a20d500ff3` | externalId back-filled |
| 131481 | The Substitutes | Live Lounge | 2026-08-23 | `40e3d36f-5485-4a65-bd28-6883a0a5ab98` | externalId back-filled **+ startTime 19:00 → 16:30** |
| 131478 | Blue Moon Band | The Red Lion | 2026-08-23 | `752e0125-9abe-405b-b2bc-2df3033eb09b` | externalId back-filled |
| 131482 | Audios | Ivy House | 2026-08-28 | `cd149109-191d-40fa-a32e-c5025974bf3e` | externalId back-filled |

**The Substitutes time correction.** bndy held 19:00, which is the §5.6 Sunday default. The source publishes `4:30 PM`. §0.28 makes `startTime` the stage time and the source's published time wins over a default. Corrected to 16:30 and read back.

Every externalId written is the §6D date-slug form `{source:"onthecasemusic", id:"<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}`, with the venue slug taken from the **bndy** venue name, which is the form the majority of this source's live records already use.

### 4.1 Carried-over row, now cleared

`131476` — **Eli at Crown and Cannon Winlaton, 2026-09-05.** Skipped by three prior runs because Chrome was unreachable and §2A.1 item 5 forbids a bare artist create. Chrome was available this run.

**Enrichment evidence.** The source's own band page `https://onthecasemusic.co.uk/bands/1111/eli` links `facebook.com/Eli.music.11` — the source linking to the page is a §2A.1 hard signal. The page was then VISITED in Chrome, not merely linked: page name `Eli`, 1.9K followers, category `Arts & entertainment`, website `elisounds.co.uk`, and a bio whose wording matches the source's own listing ("Fesival anthems from Stone Roses, Arctic Monkeys, Oasis…" against the source's "Festival anthems by The Stone Roses, Arctic Monkeys, Oasis…"). Identification bar met.

- **Artist `5a00f621-559b-45b7-ba6b-f433071f45cc`** — name `Eli`, band, `North East UK` + `locationType: regional` (§6B Kilmarnock trap), genres `["Indie"]` from the source's own structured field, `actType: ["covers"]` (the act's own copy lists other bands' songs), facebookUrl `https://www.facebook.com/Eli.music.11`, avatar `graph.facebook.com/Eli.music.11/picture?type=large`, externalId `onthecasemusic:1111`. Read back clean.
- **Event `08f006e6-a74d-4db5-9cac-fd3a43bc2d71`** — Eli @ Crown and Cannon, 2026-09-05, 21:00 (source-published, not defaulted), FREE, `isPublic:true`, externalId `onthecasemusic:2026-09-05-eli-crown-and-cannon`. Read back clean.
- **`bio` LEFT EMPTY, deliberately.** Facebook renders this page's bio truncated mid-word at "…Kasab". §2A.1 item 8 permits a cut only at a sentence or line boundary. A mid-word quotation is not a quotation. `elisounds.co.uk` was tried for the full text and is unreachable (403 through the sandbox proxy, error page in Chrome). Recorded as the validator's one WARN, not a defect.
- Location is the spec's regional fallback. No page, search or site states a town for this act.

## 5. The Copperhead venue move (gig 126346)

The source moved one booking. It did not drop one and add another. §0.17 and the spec's §2 rule both say EDIT, never create a sibling.

1. `570fe867-7067-4174-abc7-be9fafde362b` — Copperhead at Old Fat Ox Holywell, 2026-08-29, held externalId `onthecasemusic:126346`. An edit moving its `venueId` to the Red Lion returned **HTTP 409 Duplicate event**, verbatim: `{"success": false, "error": "HTTP 409: Duplicate event", "message": "Failed to update event"}`.
2. §0.9: a 409 is a match signal, never something to work around. The record it matched is `331e2766-f2f3-4139-98a8-11fbc9c76ea8` — Copperhead @ The Red Lion, 2026-08-29, 17:00, same artist `43a2411f`, created 00:17:27Z today by the same unclaimed writer, with no externalIds.
3. The live record `331e2766` now carries `onthecasemusic:2026-08-29-copperhead-the-red-lion`.
4. The superseded record `570fe867` was **hidden** (`isPublic:false`), not deleted, and tombstoned in `data\state\cancellations.jsonl`. It keeps id `126346` as historical provenance.

⚠ **Known consequence, stated plainly:** `get_by_external_id(event, onthecasemusic, "126346")` now resolves to the HIDDEN record. A future run looking that id up will find the Old Fat Ox row. The live row answers to the date-slug form instead. This is the `otcm-externalid-form-mixed` problem doing real work, and it is already on file — not raised again.

## 6. Quality measures (§6)

| Measure | Count |
|---|---|
| Artists created **with a verified page** | **1** (Eli — page visited in Chrome, source-declared, content corroborated) |
| Artists created with an **evidenced blank** | 0 |
| Artists staged | 0 |
| Names sanitised or skipped as non-acts | 0 sanitised. `Buskers night` and `Cancelled` rows remain skipped by the standing skip list; neither appeared as an added row. |
| Venues created | 0 — all six venues resolved to existing records |
| Events created | 1 |
| Events edited | 8 |
| 409 / 422 bounces | 1 (quoted verbatim in §5) |
| Times defaulted | 0. One default was CORRECTED to a source-published time. |

**Venue resolution, all six by externalId or a checked search:**

| source slug | bndy venue |
|---|---|
| `frog-and-ferret-spennymoor` | The Frog & Ferret `ed952b1e-e294-4894-a1b7-b5f1c19c60ca` |
| `red-lion-earsdon-whitley-bay` | The Red Lion `7dd36d63-114c-4a5a-8e27-69f8d2c97244` |
| `live-lounge-sunderland` | Live Lounge `e368931e-fbd0-4033-ae7c-0be68e01ad0c` |
| `ivy-house-sunderland` | Ivy House `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` |
| `crown-and-cannon-winlaton` | Crown and Cannon `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` |
| `old-fat-ox-holywell` | Old Fat Ox `c1a763b7-6496-4a93-843b-99a0ecba9a58` |

⚠ The Red Lion did **not** answer to `get_by_external_id(onthecasemusic, red-lion-earsdon-whitley-bay)` — its stored id is `red-lion-earsdon`, a shorter slug. `search_venue("Red Lion","Whitley Bay")` returned it at **67% low_confidence**. §3's rule held: the low-confidence hit was opened, not dismissed. No duplicate venue was created. This is the same measurement the 2026-08-19 run recorded.

## 7. Tombstone check (§5.4)

`data\state\cancellations.jsonl` was read before any event write. No line matches any of this run's artist + venue + date triples. One line was **appended** by this run (§5).

## 8. Validator (§6A step 8)

Evidence file written BEFORE the bndy write: `data\state\enrichment-evidence-2026-08-21-onthecasemusic.jsonl`, 2 lines (one pre-write, one id-bearing line appended after the create). Append-only.

```
python3 scripts/enrichment_validate.py --records data/normalized/onthecasemusic/2026-08-21/records.json \
  --evidence data/state/enrichment-evidence-2026-08-21-onthecasemusic.jsonl
1 records · 0 clean · 0 FAIL · 1 WARN   [mode=gate]     EXIT=0
```

**0 FAIL.** The single WARN is `STUB_NO_BIO` on Eli — the deliberate empty bio explained in §4.1. It is the correct outcome under §2A.1 item 8, not a defect.

## 9. CTO-INBOX

Two items appended. Both fingerprints were searched first and neither exists.

- `otcm-unclaimed-writer-wrote-this-source-rows` (DEFECT) — the six added rows and the Copperhead venue-move row were all written to bndy at 00:16–00:17Z by a writer with no claim, no heartbeat and no externalIds, before this task's own firing. This run back-filled seven records' provenance. It is the same 00:15Z writer that `unclaimed-writer-16-acts-17-gigs-0015z` reports on gigs-news, now confirmed to be writing onthecasemusic rows too.
- `otcm-gigid-strands-on-venue-move` (RULE) — when a source moves a booking to another venue, the bndy record holding the source's gig id cannot follow it: the artist+venue+date sentinel 409s against the record that already holds the new venue. The gig id then points at the superseded row.

Not raised (already on file): `otcm-mode-not-declared`, `otcm-chrome-not-mandatory`, `otcm-externalid-form-mixed`, `otcm-rebill-stale-events-six-live`, `skipped-row-swallowed-by-snapshot`, `record-run-token-missing`.

## 10. State written

| File | Written |
|---|---|
| `data\state\onthecasemusic-last-page.txt` | 455 lines, 293 rows, header carries the normalisation rules and the 0/0 self-diff |
| `data\state\cancellations.jsonl` | 1 line appended |
| `data\state\enrichment-evidence-2026-08-21-onthecasemusic.jsonl` | 2 lines appended |
| `data\state\run-summary.jsonl` | 1 line appended |
| `data\state\claims\onthecasemusic.json` | released, `heldBy: null` |
| `20-Daily\2026-08-21.md` | 1 line appended |

`record_run` was not attempted. `record-run-token-missing` records the missing `SOURCE_RUNS_TOKEN` and it is not blocking.

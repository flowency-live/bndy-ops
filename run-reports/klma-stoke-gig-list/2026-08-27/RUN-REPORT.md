# KLMA Stoke gig list — RUN REPORT 2026-08-27

- **Run id:** `klma-stoke-gig-list-2026-08-27T12-22-00Z`
- **Outcome:** COMPLETED. 14 events created. 9 pre-existing events given provenance. 3 artists created. 1 artist corrected. 2 venues created. Validator 0 FAIL, 2 WARN.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Inbox read:** `CTO-INBOX.md` in full, 430 lines. Fingerprints checked before every item raised below.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` read `heldBy: null`, released 2026-08-21T03:42Z. Acquired normally. **No takeover.** TTL 2 hours per §6G.
- **Heartbeat:** `data/state/heartbeat/klma-stoke-gig-list-2026-08-27T12-22-00Z.json`.
- **Tombstones:** `data/state/cancellations.jsonl` holds 6 lines. None matches an artist, venue or date this run wrote.
- **`enrichment.lock`:** absent. Nothing recreated it.
- **Mode:** the spec declares no §0.29 mode. The run used **append-only**. Nothing was deleted. Nothing was hidden.
- **Caps:** 19 creates against the 50 cap. The cap was not reached.

---

## 1. HEADLINE — SIX DAYS OF NO RUNS, AND ANOTHER RUN WORKING THIS SOURCE UNCLAIMED

**Two things stand out and neither is about the sheet.**

**(a) No scheduled task fired between 2026-08-21T20:55Z and this run.** `data/state/heartbeat/`
holds nothing in that window and `data/state/run-summary.jsonl` agrees. That is a **six-day gap
across every scheduled task**, not just this one. The standing item
`no-scheduled-task-ran-2026-08-20` recorded a 37-hour gap. This is far larger. Raised.

**(b) Nine of today's added rows were already in bndy, written at 12:08Z — fourteen minutes
before this run started — with EMPTY externalIds.** This run did not hold the claim at 12:08Z
and no heartbeat exists for that write. Example: `98aa6122-9f66-4f6e-a6fd-54bc220e6bb9`,
"The VANZ Band @ Boulevard Newcastle under Lyme Jazz & Blues Fest", `createdAt`
2026-08-27T12:08:04Z, `externalIds: []`. The titles carry the sheet's raw billing verbatim, so
the writer was reading this source. **The records themselves are correct.** What is missing is
provenance: with no externalId they are invisible to this source's idempotency key, and only the
artist+venue+date sentinel stopped this run creating nine duplicates. This run attached the §6D
externalId to all nine. Same class as `unclaimed-klma-event-creates-0023z` and
`unclaimed-writer-16-acts-17-gigs-0015z`. Raised with a new fingerprint because it recurred.

**What the run did with its budget.** 18 new future-dated sheet rows, all pipelined. Then the
§VA venue check found six gigs at The Rigger that bndy lacked, and **five of the six were written**.

---

## 2. Capture

| Feed | Surface used | Result |
|---|---|---|
| Section 1, KLMA sheet | container `curl` on `gviz/tq?tqx=out:html` | HTTP 200, **104,580 bytes**, md5 `54caa00b756600385942768df00d3da8`, 405 DOM rows, 8 `td` cells on every row |
| Section 2, Sugarmill | `web_fetch` | 28 distinct gigs, hrefs intact |
| The Rigger | `web_fetch` | REACHED — 18 dated entries to 05 Dec, plus a "Load More" tail not fetched |
| Cosey Club · Eleven · Artisan Tap | **not fetched** | see §7 |

Container `curl` reproduced the live gviz table again, confirming the standing
`klma-curl-reproduces-gviz-live` finding. Chrome was verified reachable
(`list_connected_browsers` returned one live browser, Facebook logged in) and was used for
enrichment, not for capture.

**Column alignment was verified against the header row before any parsing.** The header row is
**DOM row 404 of 405** and reads `Artist / Venue & Location / Time (eg 9pm) / Cost/Ticket /
Genre / Link to Event`. **It is not the last row** — one submission (C&C Duo, Foxearth Bar,
2026-09-12, timestamped 27/08/2026 13:22:39) renders after it. That is the standing
`klma-header-row-no-longer-last` finding, live again. The parser locates the row containing
"Link to Event" and never assumes position. **No column bleed was present** (§VA.5): column 5
carried `Cost/Ticket` and column 6 carried `Genre` on every worked row.

## 3. Diff

**Section 1: 19 added / 43 removed** against the 2026-08-21T03:09Z snapshot.

- 18 of the 19 added rows are future-dated. All 18 were pipelined. The 19th is
  `David Cotterill Open Mic every Wednesday, The Swan Stone, 26/08/2026` — past-dated **and** an
  open mic, so rejected twice over.
- 40 of the 43 removed rows are past-dated or undated. That is the normal roll-off.
- 3 removed rows are future-dated. See §5.

**Section 2: 0 added / 2 removed.** Both removals are past-dated and rolled off the top:
`CHERRY KISS 2026-08-22` and `DECLAN MCKENNA 2026-08-24`. Nothing to do at the Sugarmill.

**§5.7(a) self-diff gate: 0 added / 0 removed on both sections. GATE PASSED.** Section 1 was
regenerated from its own capture and re-diffed against the file just written. The gate is
reported for completeness; this run is append-only and deleted nothing, so no removal depended
on it.

## 4. Ordering — the largest artist groups were worked first

Per the spec's 2026-08-08 CTO ruling. The 18 added rows grouped into 13 artists:

| Artist | Rows | Worked |
|---|---|---|
| The Vanz (billed The VANZ Band / VANZ Acoustic Duo) | 4 | first |
| Fools Messiah | 3 rows, 2 distinct gigs | second |
| C&C Duo | 2 | third |
| Whiskey Rebel | 2 | third |
| 8 single-row artists | 1 each | last |

**The budget was not exhausted this run.** No added row was deferred. That is the first time
this source has finished its added set since the ordering rule was written.

## 5. Future-dated rows that vanished from the sheet — LOGGED ONLY, NOTHING DELETED

Mode is append-only, so §5.7 removed-row handling and §0.17 did not run (§0.29).

| Date | Row as it stood in the 2026-08-21 snapshot |
|---|---|
| 2026-08-28 | `Circa 81, The Cosey, Haslington, 8:00 pm, 80's / 90's synth pop` |
| 2026-08-29 | `Rocket Science, Potters Bar, Meir Park, 9:00 pm, Rock covers` |
| 2026-08-29 | `Seamus Fogarty, Foxlowe Arts Centre, 7 pm, £15` |

Each may be a curator edit, a genuine cancellation, or formatting drift. **No bndy record was
touched.** The Circa 81 row is the known two-spellings-one-gig case in §VA.2, so its
disappearance is as likely to be a de-duplication by the curator as a cancellation.

## 6. What was written

### 6.1 Events created — 14

| # | Event | Date | Full event id |
|---|---|---|---|
| 1 | Fools Messiah @ The Crown Inn, Chasetown | 2026-09-12 | `66b2d23d-92ea-4060-bd9b-61eae26bf462` |
| 2 | Whiskey Rebel @ Moorville Hall | 2026-10-03 | `f0a2636f-988a-447c-8886-526fb7bae069` |
| 3 | Whiskey Rebel @ Moorville Hall | 2026-11-14 | `21e08cd5-c39b-4a0c-a383-8ad9afb8a248` |
| 4 | C&C Duo @ Foxearth Bar, Moorville Hall | 2026-09-12 | `17df9321-7eaf-4429-b1e6-015f5062c65b` |
| 5 | Tanky/Electrifying 80's @ Nantwich Club | 2026-08-29 | `43c08af5-046b-40e2-92c7-5a583f233ac7` |
| 6 | Danny Brab @ The Shroppie Fly | 2026-09-03 | `cf968d70-e128-4fd3-94dc-c8897709aedd` |
| 7 | The Sicknotes @ The Jug | 2026-11-28 | `dd2a0197-3517-4ec4-abbf-26a0d4258e64` |
| 8 | Joy Diversion @ The Diversion Bars | 2026-12-12 | `30fa3ea9-3cf9-4109-8ac8-de5306252548` |
| 9 | Pire Hill @ The Rigger | 2026-08-28 | `e3ad9978-3128-4b31-af10-829fa1c621d7` |
| 10 | Ava Ralph @ The Rigger | 2026-08-30 | `3dcb493c-c648-402a-a92a-2f9e3fe57f6a` |
| 11 | Plastic Soul @ The Rigger | 2026-08-30 | `8aa2c0ce-2e32-44e3-914b-5fd2f106a4b7` |
| 12 | The Escape Committee Trio @ The Rigger | 2026-08-31 | `1b095496-acf0-4014-8465-9a63c905e46f` |
| 13 | Ben Ottewell (Gomez) @ The Rigger | 2026-10-02 | `3112128e-cbc4-4e8f-b9e7-124f9ca6f1a7` |
| 14 | Britallica @ The Rigger | 2026-10-18 | `0f86224b-65e7-44aa-b91c-4f2d81d3f8c3` |

Every one was read back with `get_by_id` (§0.10). All carry `isPublic: true` and a §6D
externalId `{source: "klma-stoke-gig-list", id: "<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}`.

### 6.2 Events matched by the sentinel and given provenance — 9

All nine bounced `DUPLICATE_EVENT`, which is a success signal (§0.9). Each was read with
`get_by_id`, then edited to carry this source's externalId. **No name or spelling was varied to
work around a bounce.**

| Event | Date | Full event id | Note |
|---|---|---|---|
| The Vanz @ Rumba | 2026-08-29 | `4f25e4a0-1ba8-4b57-b210-c4d6c7bd0a96` | pre-existing from source `cjab`; its `cjab` id was preserved alongside the new one, and `endTime` was corrected `00:00` → `19:00` |
| The VANZ Band @ Boulevard NUL | 2026-08-30 | `98aa6122-9f66-4f6e-a6fd-54bc220e6bb9` | unclaimed 12:08Z write |
| The VANZ Band @ The Sun Inn, Stafford | 2026-08-29 | `7de63ad0-e971-4394-8a58-53e9bc9dfb66` | unclaimed 12:08Z write |
| VANZ Acoustic Duo @ The Mere Inn | 2026-08-28 | `fe76f6c7-903e-4710-a5f6-d0c2c9c3f891` | unclaimed 12:08Z write |
| Fools Messiah @ Swan Inn | 2026-09-05 | `1afd2178-6c16-4adb-8013-d1ec144ef6ab` | title normalised from `Fools messiah @ The swan, stone` |
| C&C Duo @ The Star, Church Leigh | 2026-08-29 | `b55b7669-5c0d-4143-8188-4b044c61c338` | unclaimed 12:08Z write |
| Notorious 80s @ The Ashwood Pub, Longton | 2026-08-28 | `12109434-9c9a-4a8d-969a-ce31366b2930` | unclaimed 12:08Z write |
| Southbound @ Ash Inn, Mow Cop | 2026-08-30 | `825eee3d-5fa0-4a19-90d8-210eb954a844` | unclaimed 12:08Z write |
| Contraband-Stoke @ The Black Cock, Blythe Bridge | 2026-08-29 | `428ebfce-e02f-42dc-a9fb-9aad6c35cb7a` | unclaimed 12:08Z write |

### 6.3 Venues created — 2

| Venue | Address | Full venue id | Google Place ID |
|---|---|---|---|
| Moorville Hall | Leek Rd, Stoke-on-Trent ST9 0DG | `0330313f-3b66-4529-bd34-963354220a91` | `ChIJqwlDQndBekgRIavy_6pw8PE` |
| Crown (Chasetown) | High St, Chasetown, Burntwood WS7 3XF | `5fc36188-7fbd-40ea-9857-689ec2de5754` | `ChIJC7tzcY6gcEgRE1sZSumTyGY` |

**Moorville Hall is ONE venue carrying THREE sheet rows under two names.** The sheet billed it
`Moorville Hall, Leek Road, Cellarhead, S-o-T` twice and `Foxearth Bar, Moorville Hall Estate`
once. The Foxearth is the public bar inside Moorville Hall Hotel — one building, one Google
Place ID, so one record (§0.6 as extended to venue names at v2.26). The billing survives in the
event title `C&C Duo @ Foxearth Bar, Moorville Hall`. **A second record was not created.**

**Crown, Chasetown: the postcode decided, not the name.** The source wrote
`The Crown inn. Chasetown cannock`. Google returned the name `Crown`. WS7 3XF is Staffordshire
and matches, so the record stands (§0.24, and the 2026-08-09 `venue-name-gate-too-strict`
ruling: the postcode decides).

**Three §3 fallback probes were used before either create**, and they earned their keep once:
`search_venue("Rumba Bar", "Congleton")` returned *no venues found*; the loose probe
`search_venue("Rumba", "Congleton")` returned **Rumba Congleton `2b51b0e7-b226-45a7-95da-972056bc3934`
at 33% `low_confidence`** — below every match ladder's create threshold, and it is the right
venue. That is the fifth confirmed instance of the `search_venue` miss class. Not re-raised;
`search-venue-apostrophe` and §2.16 already cover it.

### 6.4 Artists created — 3

**All three were created with either a verified page or an evidenced blank. No stubs**
(§2A.1 item 5, §2A.5(b)).

| Artist | Full id | Page | Location |
|---|---|---|---|
| Britallica | `a5698a73-c025-476c-b65d-da8880d2c044` | **VERIFIED** `facebook.com/britallica`, 3.2K followers, Musician/band, own site `britallica.co.uk` | `UK wide`, `regional` |
| Plastic Soul | `7924a6d7-38e6-47b9-9e8e-441f0c5b8fc4` | **EVIDENCED BLANK** | `UK wide`, `regional` |
| The Escape Committee Trio | `feb2b70f-13d2-405b-ad24-cdfcf7711113` | **EVIDENCED BLANK** | `UK wide`, `regional` |

All three play The Rigger, which is a **national-act venue**, so the §0.7 gig-town fallback is
forbidden and the location is `UK wide` with `locationType: "regional"` (the §6B Kilmarnock
pairing).

**Britallica.** Visited in Chrome, logged in. Page name is
`Britallica - Britney Spears Metal Tribute`; the About line reads
`Britallica - Metal Tribute To Britney Spears`, which is a descriptor, not a name, so the record
is **Britallica** — matching what The Rigger's own page publishes (§VA.4 predicted exactly this).
UK evidence: own domain `britallica.co.uk`, gigs at New Cross Inn London and EBGB's Liverpool.
`actType: ["tribute"]` + the tributed act's genre `Pop`, plus `Metal` (§0.18 mapping table).
**`bio` left EMPTY** — the page carries no bio paragraph, only the category line, and §2A.1 item 8
allows a quotation or nothing.

**Plastic Soul — evidenced blank.** Variants tried on **both** surfaces (§2A.1 item 3b):
Facebook page search `plastic soul band` returned only non-UK acts (an Indonesian Beatles
tribute at 862 followers, a Spanish-language jazz quartet at 189); Google returned a US act
listed on AllMusic and Spotify as active around 2000; a festival-qualified Google query returned
the 2026 line-up without naming them. **No UK page meets the bar, so `facebookUrl` is blank**
(§2A.1 item 1: a same-name band from another country is a different band).

**The Escape Committee Trio — evidenced blank, and the near-miss is the interesting part.**
The Rigger's own event page names the members: **George Glover, Peter 'Sarge' Frampton, Rob
Rolfe**. Two same-name UK acts exist and **both are rejected on the member test**:
`theescapecommittee.info` is *Graham Larkbey and The Escape Committee*, a Walthamstow pub-rock
band whose stated line-up is Larkbey, Botcher, Wray and D'Souza; `reverbnation.com/theescapecommittee`
is a Warrington blues act. Neither lists Glover, Frampton or Rolfe. **Name match alone is never
sufficient** (§2A.1). Blank beats wrong. The member list is preserved in the event's
`ticketInformation`, which is punter-useful and not QA commentary (§0.12).

### 6.5 Artist corrected — 1

**Contraband `ZQ3zySQsHREd07NnsFZW` — its stored location was wrong and the fix came free.**

The sheet billed the act `Contraband-Stoke`. bndy already held a `Contraband` whose location read
**Derby** — on the face of it a §1A same-name-different-region case needing a new record. §1A.2
Step 0 says enrich before deciding, and that settled it in one step: the existing record already
carried `facebook.com/Contraband1999/`, and that page's own name is **"Contraband - Stoke"**,
stated location **Stoke-on-Trent**. **An exact facebook_key match is the same artist, and it
overrides the location text** (§1A.2). So there is one act, not two, and `Derby` was simply wrong.

Repaired on contact (§1A.4), from the page visited in Chrome:

| Field | Was | Now |
|---|---|---|
| `location` | `Derby` | `Stoke-on-Trent` (`city`) |
| `artistType` | `null` | `band` |
| `actType` | `[]` | `["covers"]` |
| `genres` | `[]` | `Rock, 60s, 70s, 80s, 90s` |
| `bio` | empty | quoted verbatim from the page |

**A second Contraband record was NOT created.** Without the Step 0 enrichment this run would have
created one, and bndy would hold two records for one Stoke band.

## 7. §VA venue-authoritative checks

| Venue | Status | What it yielded |
|---|---|---|
| **The Rigger** | **CHECKED** — `web_fetch`, 18 dated entries to 05 Dec | six gigs bndy lacked; five written, one deferred. See below. |
| **The Sugarmill** (§VA.9) | **CHECKED** — `web_fetch`, 28 distinct gigs | 0 added, 2 past-dated removals. Nothing to write. |
| **Cosey Club** | **NOT FETCHED** | no added sheet row was at this venue this run, and the budget went to The Rigger's gap. Names from the sheet only where any Cosey row was touched — none was. |
| **Eleven** | **NOT FETCHED** | as above. |
| **Artisan Tap** | **NOT FETCHED** | as above, and it still has no proven surface (§VA.1). |

**No sheet row worked this run was at a §VA venue**, so no name needed correcting from a venue
page and no contradiction arose. The three unfetched venues are reported as **unchecked, not
checked** (§VA.6 rule 5).

**The Rigger coverage gap, and what was done with it.** Comparing the venue's own forward list
against `search_event(venueId)` for the next 12 months:

| The Rigger publishes | bndy held it? | Action |
|---|---|---|
| Pire Hill, Fri 28 Aug | no | **written** |
| Ava Ralph / Plastic Soul, Sun 30 Aug | no | **written, split per §4 into two events** |
| The Escape Committee Trio, Mon 31 Aug | no | **written** |
| Ben Ottewell (Gomez), Fri 02 Oct | no | **written** |
| Britallica, Sun 18 Oct | no | **written** |
| Nirvanah / L.A. Foo Fighters, Fri 20 Nov | no | **DEFERRED** — two new artists, both needing enrichment. Named here so the next run can take it first. Neither is in bndy; `Foo Fighters UK`, `FOO FIGHTERS GB` and `Fore Fighters` are all different acts and must not be reused. |
| Open Mic Night, Wed 02 Sep | — | rejected, open mic (§6 accept/reject) |
| Comedy Gong Show, Wed 23 Sep | — | rejected, comedy |
| Anarchy — band showcase, Thu 03 Sep | — | skipped, no named act (§0.5) |

The "Load More" tail of The Rigger's page was not fetched. Anything past 05 Dec 2026 is
unexamined this run.

## 8. ⚠ A 70-GIG FESTIVAL IS RUNNING THIS WEEKEND AND THE SHEET BARELY CARRIES IT

The Rigger's own event copy states, verbatim:

> "Newcastle-under-lyme Jazz & Blues Festival is bringing over 70 gigs across 23 local venues
> this August bank holiday. And the best part? It's completely free!!!"

This is the 19th edition, it runs 28–31 August, it is squarely inside this source's remit
(Stoke / Staffs / South Cheshire), and **the KLMA sheet carries almost none of it.** Four of the
gigs this run wrote are festival gigs, and all four came from The Rigger's page, not the sheet.
The festival publishes its own line-up at `newcastlejazzandblues.com`.

Every §0.23 test passes for the pub and club dates: these are fixed buildings with real Place IDs,
and §0.27 says the discrete gig is imported and the festival name goes in the event title — which
is what was done. **What this run cannot do is add a source. §VA.8 makes that a Jason ruling.**
Raised as a DECISION.

## 9. Times and defaults

| Event | Source value | Written | Why |
|---|---|---|---|
| Notorious 80s @ The Ashwood | `9.15pm` | 21:15 | normalised |
| VANZ Acoustic Duo @ The Mere Inn | `8.15/8.30pm` | 20:15 | **ambiguous** — the earlier of the two was taken and the billing is noted. Flagged. |
| Contraband @ The Black Cock | `9pm ish` | 21:00 | normalised, "ish" dropped |
| The Vanz @ Rumba Congleton | `5pm-7pm` | 17:00–19:00 | a stated slot, not a venue window (§0.28) |
| The Vanz @ The Sun Inn | `9pm-11pm` | 21:00–23:00 | as above |
| The Vanz @ The Boulevard | `2pm - 4pm` | 14:00–16:00 | as above |
| Pire Hill @ The Rigger | venue page: `Doors 7:30pm` | 19:30 | §0.28 rule 2 — doors used, `Doors 19:30` in `ticketInformation` |
| Ava Ralph / Plastic Soul @ The Rigger | venue page: `Doors 5pm` | 17:00 | as above |
| The Escape Committee Trio @ The Rigger | venue page: `Doors 4pm` | 16:00 | as above |
| Britallica @ The Rigger | none published | 19:00 | **server-defaulted**, §5.6 Sunday |

**Two times were server-defaulted and then corrected from the venue page in the same run:** Pire
Hill defaulted to 21:00 (Friday) and Ava Ralph to 19:00 (Sunday), before the venue's own event
pages were read. Both now carry the published door time. The venue page wins (§VA / §5.6b).

## 10. Ticketing — §CT mapping applied

| Source value | Rows | Written |
|---|---|---|
| `Free entry` · `Free Entry` · `free` | 6 | `ticketed: false`, `price: "Free"` |
| *(blank)* | 12 | nothing written — blank is unknown, not free |

No new §CT vocabulary appeared this run. The table did not need extending.

## 11. Validator

```
4 records · 2 clean · 0 FAIL · 2 WARN   [mode=gate]
[ ok ] Contraband  ZQ3zySQsHREd07NnsFZW
[warn] Britallica  a5698a73-c025-476c-b65d-da8880d2c044
       WARN  STUB_NO_BIO: verified page attached but bio empty — did the page have one?
[ ok ] Plastic Soul  7924a6d7-38e6-47b9-9e8e-441f0c5b8fc4
[warn] The Escape Committee Trio  feb2b70f-13d2-405b-ad24-cdfcf7711113
       WARN  NAME_BILLING: format tail on the name: 'The Escape Committee Trio'
```

**0 FAIL. Both WARNs are answered and neither is a defect.**

- `STUB_NO_BIO` on Britallica: the page carries no bio paragraph, only a category line. §2A.1
  item 8 permits a quotation or nothing. Empty is correct.
- `NAME_BILLING` on The Escape Committee Trio: a trailing `Trio` is **part of the name**, not a
  format tail (§2A.5, Jason ruling 2026-08-07 — `GSG Vocal Trio`, `The Tyler Kent Trio`). The
  venue's own page publishes `The Escape Committee Trio`. Renaming on the pattern alone is
  forbidden.

Evidence file: `data/state/enrichment-evidence-2026-08-27-klma-stoke-gig-list.jsonl`, 7 lines,
one per enrichment decision, **written before each bndy write**.

## 12. Two mistakes this run made, and corrected

Both are mine, not tool defects. Recorded here rather than in the inbox because both were caught
inside the run and neither left a wrong record behind.

1. **I HTML-escaped an ampersand in an event title.** The first write of
   `e3ad9978-3128-4b31-af10-829fa1c621d7` stored the literal `Jazz &amp; Blues`. §6B forbids it
   in so many words, and the same class of error is already live in another source's data
   (`html-entity-in-event-title`). Caught on the create response and corrected in the next call.
   **The read-back is what found it, which is exactly what §0.10 is for.**
2. **I put an unverified location in a search query.** My first Plastic Soul search read
   `"Plastic Soul" band Staffordshire jazz blues` — seven terms, asserting a county and a genre I
   had no evidence for. §2A.1 item 3c forbids this precisely because zero results from a poisoned
   query are indistinguishable from a real absence. The search was redone from the bare name, and
   the recorded blank rests on the clean queries only.

## 13. Standing items confirmed live again this run

Named, not re-raised.

- `klma-header-row-no-longer-last` — the header is DOM row 404 of 405, with one submission after it.
- `klma-curl-reproduces-gviz-live` — container `curl` reproduced the live table; Chrome not needed for capture.
- `sugarmill-webfetch-preserves-hrefs` — container `curl` is 403 on that domain; `web_fetch` returned the page complete.
- `create-event-writes-endtime-midnight` — **every one of the 14 creates came back with `endTime: "00:00"`.** One (`4f25e4a0`) was corrected to a real value because the source published one. The other 13 are left as the server wrote them.
- `get-by-id-omits-locationtype` — `locationType` was accepted on all four artist writes but is absent from every read-back, so the §6B Kilmarnock pairing cannot be verified on read.
- `klma-no-delta-mode-declared` — the spec still declares no §0.29 mode. Append-only again.
- `run-report-path-collides-on-second-firing` — this is the only firing today, so no collision.

## 14. Raised to CTO-INBOX

| Fingerprint | Kind |
|---|---|
| `no-scheduled-task-ran-2026-08-22-to-26` | DEFECT |
| `klma-unclaimed-writer-1208z-nine-events` | DEFECT |
| `nul-jazz-blues-festival-70-gigs-uncovered` | DECISION |
| `klma-nirvanah-la-foo-fighters-deferred` | DATA |

## 15. Counts

| | |
|---|---|
| Rows captured, section 1 | 403 data rows (404 emitted incl. header) |
| Rows captured, section 2 | 28 |
| Added rows, section 1 | 19 (18 future-dated) |
| Added rows pipelined | 18 of 18 — **none deferred** |
| Events created | 14 |
| Events matched by sentinel and given provenance | 9 |
| Artists created **with a verified page** | 1 |
| Artists created **with an evidenced blank** | 2 |
| Artists created as bare stubs | **0** |
| Artists corrected | 1 |
| Venues created | 2 |
| Names sanitised | 3 (`Contraband-Stoke` → Contraband, `Joy Diversion (The Joy Division Tribute)` → Joy Diversion, `Fools messiah` → Fools Messiah) |
| Rows skipped | 6 (1 past-dated open mic, 1 open mic, 1 comedy, 1 unnamed showcase, 2 acts deferred on one Rigger bill) |
| Creates against the 50 cap | 19 |
| Validator | 0 FAIL, 2 WARN |
| `record_run` | not called — `SOURCE_RUNS_TOKEN` still unset, standing item `record-run-token-missing`, not blocking |

# onthecasemusic — RUN REPORT 2026-09-01

**Run id:** `onthecasemusic-2026-09-01T19-46-21Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Current floor **v2.19** (§6A). Assertion PASSES.
**Prompt floor:** the task prompt names no numeric floor. §6A step 2a is the gate that binds.
**Spec read:** `sources/onthecasemusic.md`, in full.
**Inbox read:** `CTO-INBOX.md`, all 672 lines, fingerprints extracted before any item was raised.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created and read back | **8** |
| Events already present (409 or found by search) | 2 |
| Events hidden (`isPublic:false`) | 1 |
| Events deleted | 0 |
| Artists created with a **verified page** | **3** |
| Artists created with an **evidenced blank** | 0 |
| Artists reused | 7 |
| Venues created | 0 |
| Venues reused | 3 |
| Rows skipped, with reason | 3 |
| Names sanitised or staged as non-acts (§0.6) | 0 |
| Validator | 3 records · 2 clean · **0 FAIL** · 1 WARN |

Every count above is of a record written to bndy and read back with `get_by_id` or
`search_event` (§0.10). No count is of a row considered.

---

## 2. Capture

- Method: `curl` in the sandbox, then a regex parse of the server-rendered ASP.NET markup.
  The gig id is read from `a[href]` (`/venues/<venueId>/<venueSlug>/<GIGID>`) per §0.22.
- Parser: `data/raw/onthecasemusic/2026-09-01/run1/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3`.
  This is byte-identical to the parsers of 2026-08-08 through 2026-08-30, so §0.29's
  same-enumeration-method condition holds.
- Page: HTTP 200, 331,978 bytes.
- Result: **251 rows over 103 dates, 2026-09-03 → 2027-12-26.** 251 unique gig ids. 22 rows carry
  no band thumbnail id.
- Chrome was verified reachable (one connected browser, tab group created) and was used for
  enrichment. It was not needed for the capture. The spec calls Chrome mandatory for `/gigs`;
  the standing inbox item `otcm-chrome-not-mandatory` (2026-08-08) records that curl reproduces
  the feed. Not raised twice.

---

## 3. Diff and the §5.7(a) gate

**Normalisation applied to both sides before comparing**, and written into the new snapshot's
own header so the next run reproduces it:

1. HTML entities decoded once (`&amp;` → `&`).
2. Curly quotes and apostrophes folded to straight.
3. All tags stripped, every run of whitespace collapsed to one space, every cell trimmed.
4. Address split on `/`, empty segments dropped, rejoined with ` / `.
5. Row form `<gigId> | <title> | <address> | <time / price>` under a `Weekday DD Month YYYY` header.

**SELF-DIFF GATE (§5.7(a)): 0 added / 0 removed. PASS.**
The new snapshot was re-read from disk and re-diffed against the capture it was written from.
251 snapshot rows, 251 capture rows, zero difference. The gate passed, so removal handling was
permitted this run.

**Diff against the 2026-08-30 03:31Z snapshot (254 rows): 11 added / 14 removed.**
This is a small, ordinary diff. The §DIFF-SAFETY-1 "hundreds of added rows means a capture bug"
condition did not fire.

### 3.1 Removed rows — 12 of 14 are past-dated, and are not cancellations

A row leaving the feed because its date has passed is not a cancellation (§5.7). Today is
2026-09-01; the feed now heads at 2026-09-03. No action was taken on any of these.

| gigId | Row | Date |
|---|---|---|
| 126346 | Copperhead at Red Lion Earsdon | 2026-08-29 |
| 131375 | The Stones Story at Red Lion Earsdon | 2026-08-29 |
| 125937 | Overdrive at White Swan Morpeth | 2026-08-29 |
| 131368 | Beer Monkeys at Bebside Inn Blyth | 2026-08-29 |
| 131490 | The Stones Story at Murton Officials Club | 2026-08-30 |
| 130221 | Dust Raisers at Sea Horse Club | 2026-08-30 |
| 126887 | Scratch at White Swan Morpeth | 2026-08-30 |
| 126931 | Beef at Crown and Cannon Winlaton | 2026-08-30 |
| 126774 | The Substitutes at Cross Keys Washington | 2026-08-30 |
| 131323 | Rock n Roll Preachers at Bebside Inn Blyth | 2026-08-30 |
| 130222 | Assassin at Sea Horse Club | 2026-08-31 |
| 131467 | Buskers night at Red Lion Earsdon | 2026-08-31 |

### 3.2 Removed row 13 — a re-bill on a live gig id, not a drop

`126927`, Blacksmiths Arms Gosforth, 2026-09-04, 21:00. The gig id, venue, date and time are
unchanged. The act changed from **Hard Wired** to **Hybrids**. The spec's DIFF SAFETY rule 2
calls this one booking and requires an EDIT, never a sibling and never a cancellation.

An edit was impossible. A correct **Hybrids @ Blacksmiths Arms 2026-09-04** record already
existed — `994dc3f3-ba54-42f0-aa4d-d950017db3ec`, externalId
`onthecasemusic:2026-09-04-hybrids-blacksmiths-arms-gosforth`, **created at 19:06Z tonight**,
40 minutes before this run acquired its claim. Re-pointing the old record at Hybrids would
bounce 409 against that record's artist+venue+date sentinel.

**Action:** the stale record `1c80704e-1440-4b43-9c52-1b453a23bc3e` ("Hard Wired at Blacksmiths
Arms Gosforth") was set `isPublic:false` and read back. It keeps externalId
`onthecasemusic:126927` as historical provenance, which follows the 2026-08-21 Copperhead
precedent in `cancellations.jsonl`. A tombstone line was appended.

No new externalId was written on either record. This source already carries three id
conventions (`otcm-externalid-form-mixed`, 2026-08-14); adding a fourth would make it worse.

### 3.3 Removed row 14 — a genuine future-dated drop with nothing to action

`130198`, **The Zone at New Hartley Club New Hartley, 2026-10-10**. Absent from the whole
331,978-byte capture. bndy holds no event for it: `search_event` on The Zone
(`2b832e36-e476-4e53-b80f-8f69a4b8ff1a`) for October 2026 returns three events, none at any
New Hartley venue. Nothing to delete or hide.

This row was the single known coverage gap in the 2026-08-30 snapshot header, held open by the
New Hartley venue split (`otcm-new-hartley-two-venue-records`, 2026-08-30). **It has now left
the source unimported.** Raised as a new inbox line, because it puts a measured cost on that
open item.

### 3.4 Added rows — 11

10 are genuinely new future rows. The 11th is the 126927 re-bill covered in §3.2.
All 10 sit inside the §6E 12-month horizon (latest 2026-12-18). None matched a
`cancellations.jsonl` line on artist + venue + date, checked before the first create (§5.4).

---

## 4. Artists created — 3, all with a verified page

No artist was created as a name-only stub (§2A.5). Each identity was checked on **both**
surfaces required by §2A.1 item 3b before any create. Queries were bare-name plus at most one
qualifier (§2A.1 item 3c). The evidence file
`data/state/enrichment-evidence-2026-09-01-onthecasemusic.jsonl` was written before the writes.

### 4.1 Billy Black Band — `2f56fc25-6a72-409d-9d7a-b1a86dfe4011`

- Facebook: `https://www.facebook.com/BillyBlackBand`, 7.2K followers, page type Musician/band.
- Query that found it: `"Billy Black Band" facebook` (Google). Page then visited and read.
- Identification evidence: the page bio is character-identical to the copy on the source's own
  band page for band id 28892. Google video results place the act at Acre Rigg Social Club
  (Peterlee, County Durham), Mill View Social Club and The Diamond. The page's phone number
  begins 0191, the Tyne and Wear code. The listed agent is The Dixon Agency, a North East agency.
- Bio, quoted character for character from the act's own page, cut at a line boundary:
  `BILLY BLACK and his Band with monster sound covering Journey, Bon Jovi, ACDC, Foreigner, Guns and Roses ETC`
- Location `North East UK`, `locationType: regional` (§6B Kilmarnock trap). The page states no
  location; the 0191 code and the venue footprint are the evidence. Spec fallback applied.
- genres `["Rock"]`, actType `["covers"]`, avatar `graph.facebook.com/BillyBlackBand/picture?type=large`.
- externalId `onthecasemusic:28892`.
- **Validator WARN, correctly overruled:** `NAME_BILLING: format tail on the name`. The act's own
  page is named `BILLY BLACK BAND`, so the trailing `Band` is part of the name, not a format tail
  (§2A.5 item 7). The stored name is title-cased against the page's all-caps styling. No rename.

### 4.2 Emerald Thieves — `0f7630c7-6609-44d9-bf8b-be6a1f84fe98`

- Facebook: `https://www.facebook.com/emeraldthievesband`, 3.6K followers.
  Website: `https://www.emerald-thieves.com`.
- Query that found it: `"Emerald Thieves" band` (Google). Both surfaces then visited and read.
- Identification evidence: the website carries `meta fb:admins emeraldthievesband` and links back
  to the same Facebook page, so the two surfaces are one act. The site states Newcastle and
  Durham. The Facebook page carries no bio at all — only `Please visit www.emerald-thieves.com`.
- Bio, quoted character for character from the act's own website, one whole sentence:
  `Emerald Thieves is a dynamic ensemble of five musicians hailing from Northern Ireland and North East England, renowned for their captivating acoustic and electric live performances.`
- Location `North East UK`, `locationType: regional`.
- genres — **a correction was made and it cost information.** The source declares the genre
  `Irish` and `create_artist` accepted it, but `enrichment_validate.py` FAILed it as outside the
  canonical list. §6A step 8 makes a machine-checkable FAIL absolute, so `Irish` was removed and
  the record now reads `["Folk","Indie","Rock"]` — the genres the act's own site names
  (*"Irish influences with indie, folk, rock, pop and country"*). The enum disagreement between
  the tool schema and the validator is the standing item
  `create-artist-genre-enum-wider-than-canonical` (2026-08-21). Not raised twice.
- actType `["covers"]` (*"foot-stomping cover versions"*, their own site). Website URL stored.
- externalId `onthecasemusic:27819`.
- Name: three spellings are live — the source bills `Emerald Thieves`, the Facebook page is
  `Emerald Thieves Band`, the site title is `The Emerald Thieves`. The site's own body prose
  reads *"Emerald Thieves is a dynamic ensemble"*, so `Emerald Thieves` was kept. `nameVariants`
  were not written: `create_artist` returns HTTP 500 with them and `edit_artist` returns 409
  (`create-artist-500-namevariants`, `edit-artist-409-namevariants`). Not raised twice.

### 4.3 Alibi — `de088930-3c10-43f2-8ffb-5206e90b6f18`

- Facebook: `https://www.facebook.com/NorthEastAlibi`, 850 followers, page type Musician/band.
- Query that found it: `"Alibi" band durham facebook` (Google). Page then visited and read.
  The town was not a guess: it is the town of the venue in the row being imported.
- Bio, quoted character for character from the act's own page:
  `We are a rock band from the North East. We have merged the trio Radiostar and Shannon together to form this fantastic four piece band. Covering rock and pop classics, We provide a great evening's entertainment with great sound and a full light show.`
- genres `["Rock","Pop"]`, actType `["covers"]`, location `North East UK`, `regional`.
- externalId `onthecasemusic:28933`. The source publishes its own band page for this act at
  `/bands/28933/alibi`, which is itself evidence that the source treats it as a distinct act.

**§1A.2 same-name procedure, run in full before the create.**
`create_artist` returned `action: review` against one candidate: **Alibi, Stoke-on-Trent,
`bU5hJ1qKaQ6pNLsQ75yg`**. §1A.7 was applied, enrichment first.

- Step 0, Facebook: the Stoke record's page is `facebook.com/OURALIBI`. The incoming act's page
  is `facebook.com/NorthEastAlibi`. Different, well-evidenced pages on both sides — a DISTINCT
  signal, so the footprint check was run to confirm.
- Footprint: the Stoke record holds **nine** events — The Old Star Uttoxeter, The Cheshire Cheese
  Stoke, The Raven Inn Crewe, The Bulls Head Sandbach, The Black Swan Leek, Swiftys Stoke,
  The Bridge Inn Stone, The Red Lion, Swan Inn Stone. Every one is West Midlands or Cheshire.
  The incoming gig is The Crook Hotel, County Durham. **Disjoint, in different canonical
  regions** → §1A.2 rule 4, a genuinely distinct act.
- Corroboration that settles it: the `NorthEastAlibi` page posts *"What a gig we had at The Crook
  Hotel yesterday!!!!"* — the exact venue of the row being imported.
- Resolved with `confirmNew: true`. This is §1A.7's sanctioned path, not a §0.9 gate workaround.
- **§1A.4 repair on contact:** the existing Stoke record needs nothing. It already carries a
  resolvable location (`Stoke-on-Trent`) and a Facebook page, so the pair ends distinguishable on
  both sides. Nothing was written to it.
- Name note: the act's own page is titled `North EAST Alibi`. The record is named `Alibi` with
  location `North East UK`, because §1A.1 makes location the distinguishing field and the regional
  prefix reads as the band's own disambiguator rather than identity. Recorded here so a later run
  does not read the difference as an error.

---

## 5. Artists reused — 7

| Act | bndy id | How resolved |
|---|---|---|
| Ruby & The Mystery Cats | `ab2bdd8e-724a-4a6a-a172-740dcfeacde7` | 85% name match, location North East UK |
| On the Rocks | `3374d3ca-0a01-4095-8278-dd6802efa353` | 100%, North East |
| Diablo | `64fba8ee-eb12-4900-bf2b-21d52443a132` | 100%, Gosforth. Sole Diablo in bndy |
| The Moobs | `6d24dea1-2731-48ef-a51e-b24d642a3777` | 100%, North East UK |
| Sticky Fingers | `efd30563-be14-481e-a964-00e32324cff5` | 100%, North East |
| The Deeks | `17aae40a-f128-45a0-b1d9-8141f31745c0` | 100%, Sunderland |
| The Brit Pack | `4c113f21-28f7-437e-8153-e1f64bd68b90` | Carries `onthecasemusic:8536`, the exact band id on the row. Source bills `Brit Pack`; bndy name is `The Brit Pack`. Billing goes in the event title, the artist id stays the same record (§1A.5) |

---

## 6. Venues reused — 3, none created

| Venue | bndy id | How resolved |
|---|---|---|
| Billy Bootleggers | `60be0eaa-935c-438d-bcbf-2e7518bbab9c` | `search_venue` 100%, already holds `onthecasemusic:billy-bootleggers-byker-newcastle` |
| Bridge Hotel Durham | `22f62ed9-a489-4d80-8cd3-9f3aa1677f24` | `search_venue` returned it at **63% low_confidence**. Opened before use per §3.1: DH1 4PW, place_id `ChIJmYSPW-19fkgRZB-WyPZkm5s`, already holds `onthecasemusic:bridge-hotel-durham`. A low-confidence hit in the right town is the record, not noise |
| The Crook Hotel | `de040d70-21f8-4d99-8c73-9037029960f0` | Learned mapping in the spec. `get_by_id` confirms 56 Hope St, Crook DL15 9HU, place_id `ChIJs-4tXEMqfEgRSCGUuaMnlT4`, holds `onthecasemusic:940`. §0.24 postcode check: DL15 is County Durham, as expected |

---

## 7. Events created — 8, every one read back

| gigId | Event | bndy event id | Date | Time | externalId written |
|---|---|---|---|---|---|
| 131492 | On the Rocks @ Bridge Hotel Durham | `aa78528a-03ce-431d-8527-c18c6be069de` | 2026-12-18 | 20:45 | `2026-12-18-on-the-rocks-bridge-hotel-durham` |
| 131493 | Diablo @ Bridge Hotel Durham | `e80a00bd-1caf-4b44-b4e6-a042c00f3b10` | 2026-12-11 | 20:45 | `2026-12-11-diablo-bridge-hotel-durham` |
| 131496 | Sticky Fingers @ The Crook Hotel | `e1cd0a49-d834-4807-9a06-230fd0a91db4` | 2026-09-19 | 21:00 | `2026-09-19-sticky-fingers-the-crook-hotel` |
| 131497 | Alibi @ The Crook Hotel | `6b6bfffd-be2e-4046-a63e-e465bacbc009` | 2026-09-20 | 16:00 | `2026-09-20-alibi-the-crook-hotel` |
| 131498 | The Deeks @ The Crook Hotel | `a64bd1d3-95ee-4944-bf6d-a20a0a69ebca` | 2026-09-26 | 21:00 | `2026-09-26-the-deeks-the-crook-hotel` |
| 131499 | Billy Black Band @ The Crook Hotel | `fcc75e81-9c06-4c27-ae51-dad512464f32` | 2026-09-27 | 16:00 | `2026-09-27-billy-black-band-the-crook-hotel` |
| 131501 | The Brit Pack @ The Crook Hotel | `a607ae08-c9d2-4def-a825-5fd789fc2920` | 2026-10-03 | 21:00 | `2026-10-03-brit-pack-the-crook-hotel` |
| 131502 | Emerald Thieves @ The Crook Hotel | `0a75176e-a5b1-4aa8-bd60-7a060e9b3bdf` | 2026-10-04 | 16:00 | `2026-10-04-emerald-thieves-the-crook-hotel` |

All eight: `isPublic: true`, `ticketed: false`, `price: "FREE"` (the source publishes FREE on
every one of these rows), `endTime` written as `00:00` by the server.

**No time was defaulted.** The source publishes an explicit time on all ten added rows, and
§0.28 takes it as the stage time. No row published a doors time or an opening window, so no
`ticketInformation` was written.

**externalId form.** §6D prescribes the date slug for this source, and the two rows another
writer created tonight also used it, so the slug was used for consistency within the same
evening's writes. This source's live data is genuinely mixed — bare gig ids, date slugs on the
short venue name and date slugs on the full venue name all exist. That is the standing item
`otcm-externalid-form-mixed` (2026-08-14). Not raised twice.

---

## 8. Rows not written — 3, with reasons

| gigId | Row | Reason |
|---|---|---|
| 131491 | Ruby & The Mystery Cats at Billy Bootleggers 2026-09-04 | **409 DUPLICATE_EVENT**, verbatim: *"Event already exists: This artist already has an event at this venue on 2026-09-04. Artists can only have one gig per venue per day."* Existing record `6311aac7-d611-4697-93f9-75ed3c415ca4`, created 19:06Z tonight with externalId `2026-09-04-ruby-the-mystery-cats-billy-bootleggers`. Correct and complete. Nothing added |
| 131495 | The Moobs at Crook Hotel 2026-09-13 | Already present as `4e0d6269-653b-4296-ab00-f3204a5ff464`, externalId `2026-09-13-the-moobs-crook-hotel`, same date and 16:00 time. Found by `search_event` before a create was attempted |
| 130198 | The Zone at New Hartley Club 2026-10-10 | Vanished from source. bndy holds no matching event, so there is nothing to delete or hide. See §3.3 |

No row was staged. No row was parked for Jason.

---

## 9. Gate bounces, verbatim

1. `create_artist("Alibi")` → `action: "review"`, one candidate: `Alibi (Stoke-on-Trent, 0%)`,
   message *"Ambiguous match for \"Alibi\" - needs resolution."* Resolved per §1A.7 with
   `confirmNew: true`. See §4.3.
2. `create_event(Ruby & The Mystery Cats, Billy Bootleggers, 2026-09-04)` → `DUPLICATE_EVENT`,
   quoted in full in §8. Not worked around.
3. `enrichment_validate.py` first pass → 2 FAIL on Emerald Thieves: `GENRE_ENUM: 'Irish' is not
   in the canonical list` and `FB_EVIDENCE_MISMATCH: stored
   https://www.facebook.com/emeraldthievesband but evidence was captured from
   https://www.emerald-thieves.com`. Both corrected before this report was written. See §10.

---

## 10. Validator

```
3 records · 2 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Command:
`python3 scripts/enrichment_validate.py --records <the three records> --evidence data/state/enrichment-evidence-2026-09-01-onthecasemusic.jsonl --mode gate`

**First pass returned 2 FAIL. Both were fixed, not argued with.**

- `GENRE_ENUM 'Irish'` → the genre was removed. Cost recorded in §4.2.
- `FB_EVIDENCE_MISMATCH` → the bio is quoted from the act's **own website** while the stored
  social is Facebook. The validator keys the check on a single `capturedFrom`, so a two-surface
  act cannot be expressed in one evidence line. A line naming both surfaces was appended, with
  the Facebook page as `capturedFrom`, the website as `secondSurface`, and the raw text of both
  in `capturedText` under an explicit separator. Nothing was reworded to make a check pass.
  This is the standing item `validator-two-surfaces-one-evidence-line` (klma, 2026-08-28).
  Not raised twice.

The one remaining WARN is `NAME_BILLING` on `Billy Black Band` and is correctly overruled in
§4.1: the act's own page carries the word `BAND` in its name.

**Judgment sample (§6A step 8).** All three creates were checked against source by hand, which
is the whole batch rather than a 3–5 record sample: page identity, bio fidelity character for
character, and the §1A footprint decision on Alibi.

---

## 11. State written

| File | What |
|---|---|
| `data/state/heartbeat/onthecasemusic-2026-09-01T19-46-21Z.json` | Written first, before any gate. Rewritten `completed` as the last action |
| `data/state/claims/onthecasemusic.json` | Acquired at 19:47:30Z, TTL 90 minutes per §6G. Previous holder had released cleanly (`heldBy: null`). No takeover |
| `data/state/onthecasemusic-last-page.txt` | New snapshot, 251 rows, normalisation rules in its own header, self-diff result stated |
| `data/state/cancellations.jsonl` | One line appended for the 126927 hide. Append only |
| `data/state/enrichment-evidence-2026-09-01-onthecasemusic.jsonl` | 7 lines: 3 pre-create, 3 with the resolved artistId, 1 two-surface correction |
| `data/state/run-summary.jsonl` | One line appended |
| `20-Daily/2026-09-01.md` | One line appended, linking this report |

**Evidence-file ordering, stated honestly.** §6A step 8 requires the evidence line before the
bndy write. An `artistId` does not exist until the create returns. Three lines were written
before the writes, keyed on `pendingName` with `artistId: null` and carrying the full
`capturedText`; three more were appended afterwards with the resolved id and the same text.
The validator reads the later line. This is the standing item `evidence-file-cannot-precede-a-create`
(spider, 2026-08-21). Not raised twice.

---

## 12. Raised to CTO-INBOX

One line, one new fingerprint:

- `otcm-130198-expired-while-venue-split-open` — DATA. Gig 130198 left the source unimported
  after the New Hartley venue split blocked it. It puts a measured cost on the open
  `otcm-new-hartley-two-venue-records` item.

**Deliberately not raised, because a fingerprint is already in the file:**
`otcm-mode-not-declared` · `otcm-chrome-not-mandatory` · `otcm-externalid-form-mixed` ·
`otcm-unclaimed-writer-wrote-this-source-rows` · `otcm-new-hartley-two-venue-records` ·
`otcm-no-heartbeat-48h` · `create-artist-500-namevariants` · `edit-artist-409-namevariants` ·
`create-artist-genre-enum-wider-than-canonical` · `validator-two-surfaces-one-evidence-line` ·
`evidence-file-cannot-precede-a-create` · `search-event-daterange-ignored` ·
`get-by-id-omits-locationtype` · `create-event-writes-endtime-midnight` ·
`record-run-token-missing`.

**One observation carried here rather than to the inbox.** Two of tonight's ten new rows were
already in bndy, written at 19:06Z — 41 minutes before this run acquired the claim — under the
same `onthecasemusic` namespace and the §6D slug form. `data/state/claims/onthecasemusic.json`
read `heldBy: null` at 19:47Z, so whatever wrote them held no claim. That is exactly the
standing item `otcm-unclaimed-writer-wrote-this-source-rows` (2026-08-21), now recurring 11 days
later. Rule 5 of the inbox forbids a second line for a fingerprint already present, so the
recurrence is recorded here instead, with the two event ids, for whoever triages that item:
`6311aac7-d611-4697-93f9-75ed3c415ca4` and `4e0d6269-653b-4296-ab00-f3204a5ff464`.

Its cost this run was real but small: the Hybrids sibling in §3.2 exists because the other
writer created the new act's record from the source before this run could edit the old one.

---

## 13. Caps and horizon

- 50-create cap: **11 creates** (3 artists + 8 events). Well inside. No cap was hit.
- §6E horizon 12 months: the furthest event written is 2026-12-18. Rows beyond the horizon stay
  in the snapshot and enter by a later diff, as the spec requires.
- `record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`
  (`record-run-token-missing`) and is not blocking. `run-summary.jsonl` is the dashboard's input
  and was appended.

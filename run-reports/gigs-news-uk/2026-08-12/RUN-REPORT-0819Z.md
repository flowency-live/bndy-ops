# gigs-news — RUN REPORT — 2026-08-12T08:19Z

**Outcome: COMPLETED.** Second firing of this task today. The first ran at 00:17–01:30Z and its
report is `RUN-REPORT.md` in this folder. This report does not replace it.

- Run id: `gigs-news-2026-08-12T08-19-08Z`
- Heartbeat: `data\state\heartbeat\gigs-news-2026-08-12T08-19-08Z.json`
- Claim: `data\state\claims\gigs-news.json`, acquired 08:19:08Z, TTL 90 minutes (§6G). Clean acquire.
  The previous holder released correctly. No takeover.

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written first, before any gate |
| §6A step 1 date | `2026-08-12` from the shell |
| §6A step 2 runbook | `RUNBOOK.md` read in full. H1 = **v2.27** |
| §6A step 2a floor | §6A CURRENT FLOOR = **v2.19**. 2.27 >= 2.19. **PASS.** Task prompt states no number, so no drift to report |
| §6A step 2 spec | `sources\gigs-news-uk.md` read in full |
| CTO-INBOX | Read in full. Fingerprints checked before raising anything |
| §6A step 2b lock | `claims\gigs-news.json` held `heldBy:null`. Acquired |
| §6A step 3 tools | bndy MCP reachable. Chrome connected. No `enrichment.lock` found |
| §6A step 5 snapshot | Present, written by the 01:30Z run today |
| §5.7(a) self-diff gate | **0 added / 0 removed** on both sections |
| §6A step 8 validator | **7 records · 7 clean · 0 FAIL · 0 WARN** |

## 2. §0.29 mode — append-only

`sources\gigs-news-uk.md` **declares no `delta` / `append-only` mode**. The run defaulted to
**append-only**: it added and edited, and it removed nothing. §5.7 removed-row handling and
§0.17 deletion did not run.

Runbook §0.29 states that gigs-news *qualifies* for `delta`. The mode must live in the spec, and
it does not. A run does not edit a rule. Already raised as `gigs-news-mode-undeclared`
(CTO-INBOX, 2026-08-12) by the 01:30Z run. **Not raised again.**

## 3. Capture

| Page | Method | Rows |
|---|---|---|
| `gigs-news.uk` week view | Chrome, `document.body.innerText` | 93 lines |
| `gigs-news.uk/branded.htm` forward list | Chrome, `innerText`, first dated section only | 27 rows |

Raw capture: `data\raw\gigs-news-uk\2026-08-12\capture-0819Z-section1-weekview.txt` and
`...-section2-branded.txt`. Previous snapshot preserved as `PREV-snapshot-0130Z.txt`.

**branded.htm archive boundary held.** `innerText` produced `gigs 2026` (lowercase) at line 15 and
`Gigs 2026` (capitalised, the first archive) at line 159. The forward list is lines 16–42, 27 rows,
ending at `Thursday 31st December`. Line 43 is setlist prose. The ordinal rule in the spec worked.
186 archive rows were excluded, as designed.

**Chrome visibility.** The tab reported `document.hidden === true` with `innerHeight` 728. §6B's
visibility rule governs lazy-loaded and infinite-scroll sources. This page is static HTML 3.2 with no
lazy load, and `innerText` returned the same 93 lines as `get_page_text`. Not a stalled capture.

## 4. Diff against the 01:30Z snapshot

**Section 1 (week view): 0 added, 0 removed, 10 changed.**
**Section 2 (branded forward list): 0 added, 0 removed, 1 changed.**

The curator filled in ten act names during the morning. Every changed row is the *same* row gaining
an artist, not a new or a lost row.

| Date | Was | Now | Action |
|---|---|---|---|
| 2026-08-14 | `- Acoustic Lounge Poynton` | `LP Acoustic - Acoustic Lounge Poynton` | imported |
| 2026-08-14 | `- Queens Hotel Macclesfield` | `Twisted Lick - Queens Hotel Macclesfield` | imported |
| 2026-08-14 | `- the Railway Greenfield` | `Recoil - the Railway Greenfield` | imported |
| 2026-08-14 | `- Hare & Hounds New Mills` | `James is Elvis - Hare & Hounds New Mills` | imported |
| 2026-08-15 | `- Acoustic Lounge Poynton` | `Ska Council - Acoustic Lounge Poynton` | imported |
| 2026-08-15 | `- Queens Hotel Macclesfield` | `Giant Dwarfs - Queens Hotel Macclesfield` | imported |
| 2026-08-15 | `- Hare & Hounds New Mills` | `Outer Limits - Hare & Hounds New Mills` | imported |
| 2026-08-16 | `4pm - Railway Greenfield` | `Cooper & the Makerfields 4pm - Railway Greenfield` | imported |
| 2026-08-16 | `7pm - Acoustic Lounge Poynton` | `private party 7pm - Acoustic Lounge Poynton` | **rejected** |

**The tenth change is a normalisation artifact, not a source change.** Section 2's stored row read
`Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved (cancelled - United match)`.
The live `branded.htm` row carries no parenthetical; the `(cancelled - United match)` text sits on
the **week view** page as its own line. The 01:30Z run merged a week-view line into a branded.htm
row. Nothing changed at source. The row is sponsorship-meta and is skipped either way, so no record
is affected. The new snapshot stores the branded.htm row as published.

**Nothing was deleted.** The source is append-only, and there were no removals to consider.

## 5. Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` grepped for `2026-08-1[456]` before the first event create.
**No hit.** Today's other run reports and `20-Daily\2026-08-12.md` were read before any write, so no
absent record was read as a coverage gap.

## 6. Rejected rows

| Row | Reason |
|---|---|
| `private party 7pm - Acoustic Lounge Poynton`, 2026-08-16 | `private party` is a booking state, not an act (§0.23 named non-places, §0.5 placeholder). No artist created, no event. The venue already exists |

The 60-plus unchanged skip rows (open mics, karaoke, quiz, DJ-only, `live bands`, blank-act rows,
`Jazz at the Railway`, branded/Reserved, sponsorship-meta) were unchanged from the 01:30Z snapshot
and were not re-worked.

## 7. Venues — 0 created, 4 matched

| Source label | bndy record | id | Evidence |
|---|---|---|---|
| Acoustic Lounge Poynton | The Acoustic Lounge | `Ha5zokxmGzIi6miASzO0` | SK12 1RE, matches the source's own sponsorship row |
| Queens Hotel Macclesfield | Queen's Hotel | `6HroN1Vgsv281M7bbbKR` | SK11 6JW, matches the source's own sponsorship row |
| the Railway Greenfield | The Railway | `NwEtqexKQqLHyBcPVgJF` | OL3 7JZ. Learned mapping in the spec, confirmed by `get_by_id` |
| Hare & Hounds New Mills | Hare & Hounds | `i0ZMEN0agqL6JOTMhSEm` | SK22 4LS. Learned mapping in the spec, confirmed by `get_by_id` |

§0.24 postcode check passed on all four.

## 8. Artists — 3 created, 5 matched, 4 topped up

### Created with a verified page (2)

**Twisted Lick** — `bd25af1d-0555-4444-ae41-d8ad8fef15c0`
Page `facebook.com/twistedlick`, 376 followers, category Musician/band, **visited, not snippeted**.
Bio quoted verbatim: *"A North West-based band playing Classic Rock, Funk and more."*
Location `North West UK`, `locationType: regional` (§6B Kilmarnock pairing) — taken from the page's
own words. Google also returned BandMix (*Manchester, England, SK6*) and Visit New Mills
(*5 piece classic rock band from Manchester*); the page's own wording was preferred.
Genres `Rock`, `Funk` — §0.18 maps `Classic Rock` to `Rock`. actType `covers`.
Avatar `graph.facebook.com/twistedlick/picture?type=large`.

**Cooper & The Makerfields** — `126d2780-f384-49ef-8911-49bfe1553028`
Page `facebook.com/cooperandthemakerfields`, 262 followers, **visited**.
Bio quoted verbatim: *"Old Bottles, New Wines. A Blues Band for the Modern Times"*.
Own site `cooperandthemakerfields.com` **lists the exact gig being imported**: *"Cooper & The
Makerfields at The Railway in Greenfield. Sunday, August 16 @ 4:00PM"* — the strongest form of the
§2A.1 evidence bar. Location `Manchester` (`city`), from their own site.
Genres `Blues`. actType `originals` and `covers` — a 2022 album of originals on Bandcamp plus BB King
and John Mayall covers on their own YouTube. Name taken from the page, capital `T` in `The`.

⚠ **Correction made during the run.** This record was created with the name HTML-escaped as
`Cooper &amp; The Makerfields` — my error, and exactly the §6B fault that rule warns about. It was
caught by the §0.10 read-back and corrected by `edit_artist` within one call. The stored name is now
`Cooper & The Makerfields`. Verified.

### Created with an evidenced blank (1)

**James is Elvis** — `ca1df2f4-c307-40a4-bca0-4ebc426eb8ed`
No page found. Variants tried, **both surfaces** per §2A.1 item 3b:
- Facebook page search `James is Elvis` — returned `Elvis James`, `Tyler James as Elvis and The
  Memphis Experience`, `James Elvis Austin for House of Delegates`, `Elvis James` (clothing brand).
  None is this act.
- Google `"james is elvis"` — returned Andy James (Midlands) and Gary Lee James (Benidorm).
- Google `"hare and hounds" new mills "james is elvis"` — one hit, a gigs-news repost reading
  *"James is Elvis - Marple Con & Social Club"*.

That third hit is why the record was created rather than skipped: it evidences **the act name and a
recurring North West footprint**, independently of this week's row. Bio EMPTY, facebookUrl EMPTY —
blank beats wrong. Location `Greater Manchester UK`, `locationType: regional`, the source default,
because no page states one. actType `tribute`, genres `Rock n Roll` and `50s` per the §0.18 tribute
mapping.

### Matched, no create (5)

| Artist | id | Basis |
|---|---|---|
| LP Acoustic | `dec2e49a-94d6-4be7-b4e6-cd65b03f4342` | 100% name, North West England |
| Recoil | `rIaiaGTvG3buiSJLD8gf` | 100% name, North West England |
| Ska Council | `d5ec0b9b-c8b7-4285-ad87-dcf716cb08a5` | 100% name, Manchester |
| Outer Limits | `e61dc26c-3f1a-4dce-a343-c64dad214496` | 100% name, North West UK |
| the Giant Dwarfs | `9964ca12-1e42-478a-bcb5-23942e93b98d` | 75%. Source bills `Giant Dwarfs`; the record is Sandbach, Cheshire. §1A.2 rule 3 — Macclesfield is inside a Cheshire footprint. Reused, no twin created |

No `review` verdict was returned. No 409 or 422 on any artist call.

### Topped up (§2A.2, §1A.4) — 4

Every matched record held a page and an avatar and an **empty bio**. Each page was visited and its
own text quoted.

| Artist | Field | Value |
|---|---|---|
| Outer Limits | bio | *"Dynamic live band for pubs, clubs, parties and functions. We've been rockin' and partyin' the North West since 2009 - we'd love to play for you!"* |
| LP Acoustic | bio | *"Piano and acoustic guitar duo covering songs ranging from Country to Indie and Rock & Pop."* |
| Recoil | bio | *"Punk Rock Covers of a Distinct Quality, Appearing at a Venue Near You Soon..."* |
| the Giant Dwarfs | bio, actType, genres | *"The giant dwarfs, a four piece cover band, based around and about Sandbach in Cheshire"*; `covers`; `Rock` |

Ska Council already held a bio and needed nothing.

Two judgement calls, recorded so they can be overruled:
- **the Giant Dwarfs genre.** The page states no genre. `Rock` is inferred from the act's own page
  handle `giantdwarfsrock`. Genres is the only field a run may infer (§2A.1 item 8).
- **the Giant Dwarfs name.** The page title is `The giant dwarfs`, all lower case. The bndy record
  reads `the Giant Dwarfs`. Not renamed: §0.20 says punctuation and casing are not identity, and
  lower-casing a public name on a casing difference alone is not an improvement.

No `nameVariants` were written on any call. `edit-artist-409-namevariants` and
`create-artist-500-namevariants` are open in CTO-INBOX and were not retried.

## 9. Events — 8 created, 0 bounced

All `isPublic: true`. All verified by read-back (§0.10) with `search_event` by venue.

| id | Title | Date | Start | externalId (`gigs-news`) |
|---|---|---|---|---|
| `df5aac26-3af1-4805-ad4b-9e221f73a6d0` | LP Acoustic @ The Acoustic Lounge | 2026-08-14 | 21:00 | `2026-08-14-lp-acoustic-the-acoustic-lounge` |
| `9cf483ea-1a3b-4c43-a27c-9060678f016c` | Twisted Lick @ Queen's Hotel | 2026-08-14 | 21:00 | `2026-08-14-twisted-lick-queens-hotel` |
| `50f9b217-d93d-4a35-8936-1ef5241869b5` | Recoil @ The Railway | 2026-08-14 | 21:00 | `2026-08-14-recoil-the-railway-greenfield` |
| `4d9389ee-8bc0-4eb8-9ba8-22f72e26111c` | James is Elvis @ Hare & Hounds | 2026-08-14 | 21:00 | `2026-08-14-james-is-elvis-hare-hounds` |
| `6a044e3a-2922-4cf8-932c-87aa4e2e58d8` | Ska Council @ The Acoustic Lounge | 2026-08-15 | 21:00 | `2026-08-15-ska-council-the-acoustic-lounge` |
| `16ed29d0-12c6-4455-b17a-125556971fdb` | the Giant Dwarfs @ Queen's Hotel | 2026-08-15 | 21:00 | `2026-08-15-the-giant-dwarfs-queens-hotel` |
| `4ecb142d-487f-4dc8-b429-9279d0345250` | Outer Limits @ Hare & Hounds | 2026-08-15 | 21:00 | `2026-08-15-outer-limits-hare-hounds` |
| `fc8e1682-02aa-4db6-9381-1ebae3d7cafe` | Cooper & The Makerfields @ The Railway | 2026-08-16 | 16:00 | `2026-08-16-cooper-and-the-makerfields-the-railway-greenfield` |

### Start times (§0.28, §5.6)

- **Six defaulted to 21:00** — the four Friday rows and two of the Saturday rows. The source
  publishes no time for any of them. §5.6 Fri/Sat default. **Correctable.**
- **Outer Limits, 2026-08-15, 21:00 — NOT defaulted.** Confirmed by the venue's own Facebook event,
  surfaced during the Twisted Lick search: *"Sat, Aug 15 at 9:00PM BST. Band. Outer Limits."*
  The default and the published time agree.
- **Cooper & The Makerfields, 2026-08-16, 16:00 — source-stated `4pm`**, and corroborated by the
  act's own site: *"Sunday, August 16 @ 4:00PM"*. Two independent surfaces agree.

No doors time was published anywhere, so `ticketInformation` is empty on all eight. `endTime` was
not supplied; the backend set `00:00` on all eight, which is this source's existing convention.

### externalId form

The §6D date-slug form was used, with the venue segment derived from the **bndy record name**.
`The Railway` carries a `-greenfield` suffix because bndy holds a second `The Railway` at Handforth
in this same source, and the bare slug would collide.

⚠ This source already runs **two** live venue-segment styles — `2026-08-01-stella-vision-hare-and-hounds-new-mills`
and `2026-08-08-off-the-record-hare-hounds` sit at the same venue eight days apart. This run followed
the later, plainer style rather than adding a third. Already raised as `externalid-slug-drift`
(CTO-INBOX, 2026-08-08). **Not raised again.**

## 10. Quality summary (§6)

| Measure | Count |
|---|---|
| Events created, verified | 8 |
| Artists created **with a verified page visited** | 2 |
| Artists created with an **evidenced blank** | 1 |
| Artists matched and reused | 5 |
| Existing records topped up from their own page | 4 |
| Venues created | 0 |
| Venues matched | 4 |
| Rows rejected as non-acts | 1 |
| Rows staged | 0 |
| 409 / 422 / gate bounces | 0 |
| Deletions | 0 |
| Validator | 7 records, 0 FAIL, 0 WARN |

No stub was created. Every artist write carried either a visited page or a recorded set of search
variants across both surfaces.

## 11. Artefacts written

- `data\state\gigs-news-uk-last-page.txt` — new snapshot, 124 lines, two sections, normalisation
  rules in its own header
- `data\state\enrichment-evidence-2026-08-12-gigs-news.jsonl` — 7 records appended (12 → 19 lines)
- `data\state\run-summary.jsonl` — one line appended
- `data\raw\gigs-news-uk\2026-08-12\` — both captures plus the previous snapshot
- `data\normalized\gigs-news-uk\2026-08-12\records-0819Z.json` — validator input
- `20-Daily\2026-08-12.md` — one entry appended

## 12. Raised to CTO-INBOX

One item, fingerprint `html-entity-in-event-title`. It is another source's record, so §6F says raise
it, never fix it in place.

Not raised, because the fingerprint is already open: `gigs-news-mode-undeclared`,
`externalid-slug-drift`, `edit-artist-409-namevariants`, `create-artist-500-namevariants`,
`record-run-token-missing`.

## 13. Known non-blockers

- `record_run` was not called. `SOURCE_RUNS_TOKEN` is unset and the failure is already in CTO-INBOX
  as `record-run-token-missing`. `run-summary.jsonl` is the dashboard input and was appended.

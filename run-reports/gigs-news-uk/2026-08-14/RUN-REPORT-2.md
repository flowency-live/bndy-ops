# gigs-news — RUN REPORT 2 — 2026-08-14

- **Run id:** `gigs-news-2026-08-14T04-06-45Z`
- **Outcome:** completed
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. The assertion passes.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/gigs-news-uk.md`, in full.
- **CTO-INBOX read:** all fingerprints, before the first write.
- **Second firing today.** Run 1 finished at 00:12Z and wrote nothing. This report uses `RUN-REPORT-2.md` so run 1's report stays intact. The path collision is already open as `run-report-path-collides-on-second-firing`.

---

## 1. Counts

| Metric | Count |
|---|---|
| Events created | 13 |
| Artists created | 9 |
| Venues created | 0 |
| Existing artists reused | 4 |
| Existing venues reused | 10 |
| Records enriched (edits) | 3 |
| Rows rejected by filter | 25 |
| Deletions | 0 |
| 409 / 422 bounces | 0 |
| Validator | 9 records · 6 clean · **0 FAIL** · 3 WARN |
| Creates against the 50 cap | 22 |

## 2. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | `data\state\heartbeat\gigs-news-2026-08-14T04-06-45Z.json` |
| §6A step 2a version floor | v2.27 ≥ v2.19. Pass. |
| §6A step 2b claim | `claims\gigs-news.json` held `null`. Acquired. No takeover. |
| §6A step 3 tools | bndy MCP reachable. Chrome connected. |
| §5.7(a) self-diff | **0 added / 0 removed.** Pass. |
| §5.4 tombstone check | `cancellations.jsonl` holds one line, PULS @ Arden Arms 2026-08-08. No row in this run matches. |
| Snapshot written | Yes. `data\state\gigs-news-uk-last-page.txt`, 125 lines. |

## 3. Capture

Chrome, `innerText`, both pages.

- Week view `https://www.gigs-news.uk/` — 118 lines. Header still reads *What's on This Week 12 - 16 August*.
- Forward list `https://www.gigs-news.uk/branded.htm` — the first dated section only, `gigs 2026` at line 18, rows 19 to 45. The next header `Gigs 2026` sits at line 162 and opens the archive. 367 archive lines excluded by ordinal position, as the spec requires.
- Raw capture: `data\raw\gigs-news-uk\2026-08-14\capture-04-06Z.txt`.

Section 2 was verified by checksum, not by eye. A djb2 hash of the 27 live `branded.htm` rows and a hash of the 27 stored rows both read `e5a00499`. Section 2 is unchanged.

## 4. Diff against the 2026-08-14T00:05Z snapshot

**Section 1 (week view): 14 added, 13 removed.**
**Section 2 (forward list): 0 added, 0 removed.**

The curator filled in 13 act names that were blank yesterday. Every removed row is the blank or time-only form of a row that is now named. No row disappeared.

| Removed row | Replaced by | Date |
|---|---|---|
| `- the Swan Inn Wilmslow` | `Jack Woodward - the Swan Inn Wilmslow` | 14 Aug |
| `- the Dog Inn Chadderton` | `Samm Hewitt - the Dog Inn Chadderton` | 14 Aug |
| `- the Swan Inn Wilmslow` | `Emma Gilmour - the Swan Inn Wilmslow` | 15 Aug |
| `- Coach & Horses Oldham` | `Billy No Mates - Coach & Horses Oldham` | 15 Aug |
| `- the Billy Goat Mossley` | `Carlo Sax - the Billy Goat Mossley` | 15 Aug |
| `- Stockport Town Hall Tavern` | `the Grey Dogs - Stockport Town Hall Tavern` | 15 Aug |
| `- the Railway Handforth` | `Charlie Farley band - the Railway Handforth` | 15 Aug |
| `- Marple Con & Social Club` | `James is Elvis - Marple Con & Social Club` | 15 Aug |
| `- Crown Bredbury` | `Northside Brothers of Soul - Crown Bredbury` | 15 Aug |
| `- Rising Sun Hazel Grove` | `Jackie Dijon - Rising Sun Hazel Grove` | 15 Aug |
| `4pm - the Steelworks Bredbury` | `Simon Langley 4pm - the Steelworks Bredbury` | 16 Aug |
| `6pm - the Dog Inn Chadderton` | `Steve James 6pm - the Dog Inn Chadderton` | 16 Aug |
| `8pm - Coach & Horses Oldham` | `Elvis show 6pm - Coach & Horses Oldham` | 16 Aug |

One added row is new, not a fill-in: `Velvet Sun band 8pm - the Steelworks Bredbury` on 14 Aug.

**No deletion was actioned.** Every removed row was a blank-act or time-only row. The reject filter had already excluded all 13 from event creation, so no bndy event exists for any of them. §0.17 has nothing to act on. The spec still declares no §0.29 mode; that is open as `gigs-news-mode-undeclared` and is not re-raised.

## 5. Rows excluded from the pipeline

Wednesday 12 and Thursday 13 August are past. §0.14 forbids importing them. 20 rows skipped on date.

| Reason | Rows |
|---|---|
| Blank act name | 11 |
| Time-only row | 4 |
| Karaoke / disco | 4 |
| Open mic / jam | 1 |
| `live bands`, no named act | 3 |
| `branded - looking for a venue/cancellation` | 3 |
| Themed night (`Jazz at the Railway`) | 1 |
| Private booking (`private party 7pm`) | 1 |
| No real act name (`Elvis show 6pm`) | 1 |

`Elvis show 6pm - Coach & Horses Oldham` is the one judgement call worth naming. §0.5 forbids inventing an artist name and §0.20 makes the act's own page the naming authority. The source states no performer, so the row is skipped, not guessed. The venue already exists, so nothing is lost.

`Reserved 5pm - Whittles Oldham` appears twice on Sunday 16 August and is already in bndy from an earlier run. It was not re-offered.

## 6. Artists created — 9

**Created with a verified page — 3**

| Artist | Id | Location | Page | Evidence |
|---|---|---|---|---|
| Jack Woodward | `695cbd7d-ace5-48e6-a652-bd0d2ff6d19d` | Manchester (city) | `facebook.com/jackwoodwardmusic` | Page visited. Category `Musician/band`, 1.6K followers, active 5 August, own site `jackwoodwardmusic.com`. Location Manchester taken from the Google result snippet for that page. |
| Samm Hewitt | `5ed3e1d4-9949-416f-bed4-69147aac0b17` | Manchester (city) | `facebook.com/SammHewittMusic` | Page visited. The page itself states **Manchester**. 3.4K followers, active today. |
| Emma Gilmour | `2a89eb46-32c4-446e-b676-3e6f5314b5a7` | Knutsford (city) | `facebook.com/emmagilmourofficial` | Page visited. Category `Musician`. Location Knutsford taken from her Last Minute Musicians member listing, which also states pop covers from the 1970s to the 2000s and availability in Cheshire and Greater Manchester. Knutsford is 8 miles from the gig venue in Wilmslow. |

**Created with an evidenced blank — 6**

| Artist | Id | Location | Variants tried |
|---|---|---|---|
| Charlie Farley Band | `dd2c6a34-bbfb-499e-a0e5-6563f380ebaa` | Cheshire (regional) | `"Charlie Farley" band facebook Manchester`. Own site `charliefarleyband.co.uk` found and read. |
| Velvet Sun | `6b4e2895-c556-408a-a6d0-0cd794824ba6` | Greater Manchester UK (regional) | `"Velvet Sun" band facebook`; `"Velvet Sun" band Stockport Manchester gigs` |
| Billy No Mates | `461e126d-9cc2-4bbc-9a7d-a7f85e47799e` | Greater Manchester UK (regional) | `"Billy No Mates" band Oldham facebook` |
| Jackie Dijon | `fa7d1a05-63a5-45c6-9f67-9c7e0fd61c9e` | Greater Manchester UK (regional) | `"Jackie Dijon" singer facebook`; `"Jackie Dijon" Stockport Hazel Grove live music` |
| Simon Langley | `0fa7d5e6-9936-491d-adf2-1eb15d3b7a9d` | Greater Manchester UK (regional) | `"Simon Langley" musician facebook` |
| Steve James | `2d125c1e-121a-4705-837b-8aadcae0e24c` | Greater Manchester UK (regional) | `"Steve James" singer Oldham Chadderton acoustic facebook` |

Why each blank is a blank, not a miss:

- **Charlie Farley Band.** `facebook.com/CharlieFarleyMusic` does not render logged out. The same handle belongs to `charliefarleymusic.com`, a US country-rap store. §2A.1 item 1 forbids attaching a possible non-UK same-name page. The band's own site was used instead: it names them *Charlie Farley Band*, a rock, pop and blues covers band based in Cheshire. `websiteUrl` is set from that site.
- **Velvet Sun.** Every page found is US or non-UK: `velvetsunus`, `VelvetSuns`, Velvet Sunrise of Cincinnati. A 2024 Manchester Music Club Social listing for a *Velvet Sun* gig corroborates a Greater Manchester act but names no page.
- **Billy No Mates.** The named candidates are a Doncaster band and a South East England band. Neither footprint reaches Oldham.
- **Jackie Dijon.** No page under this name on either surface.
- **Simon Langley.** Only personal profiles and a digital-artist page. §2A.1 item 4 forbids linking a personal profile.
- **Steve James.** Results are dominated by the late US roots-blues musician of that name. No North West act surfaced.

**Surface (a) was down for the whole run.** `facebook.com/search/pages/?q=` returned `Not Found` on every attempt. Direct act pages still read. This is already open as `facebook-page-search-not-found` and is not re-raised. Chrome is also logged out of Facebook, which is open as `bv2a-facebook-not-logged-in`. Both blanks above therefore rest on Google plus a direct page visit, and each blank names its variants. No blank rests on surface (a) alone.

**Names sanitised under §0.6 — 2**

- `Velvet Sun band` → **Velvet Sun**. `band` is a description.
- `the Grey Dogs` → matched the existing **Grey Dogs** record. The article is not identity.

**Name kept against the §0.6 pattern — 1**

- `Charlie Farley band` → **Charlie Farley Band**. The act's own site titles itself *Charlie Farley Band*. §0.20 makes the act's own page the naming authority, so the tail is kept. The validator WARNs on this and the WARN is correct to fire.

**Artists reused — 4**

| Source billing | bndy artist | Id | Basis |
|---|---|---|---|
| `Carlo Sax` | Carlo Sax | `1efdfd36-38c4-4e1a-b9d6-3f6577c1777b` | 100%, Manchester |
| `the Grey Dogs` | Grey Dogs | `f6a91ee3-b923-4a31-b5cf-ed75ba9794b1` | 100%, Manchester |
| `James is Elvis` | James is Elvis | `ca1df2f4-c307-40a4-bca0-4ebc426eb8ed` | 100%, Greater Manchester UK |
| `Northside Brothers of Soul` | Northside Brothers of Soul | `zOUHlg6ULcjhBWWZXtJ1` | 100%, North West UK. Treated as ONE act per the spec's explicit warning. |

No `review` verdict was returned. No same-name footprint conflict arose: every new name returned a top candidate under 55% with a different name.

## 7. Enrichment edits — 3

| Artist | Field | Value |
|---|---|---|
| Samm Hewitt | `bio` | Quoted character for character from the page Intro, line breaks preserved. Written by `edit_artist` because `create_artist` returns HTTP 500 on a bio containing emoji — the open `create-artist-500-emoji` defect. The workaround held. |
| Jack Woodward | `genres`, `websiteUrl` | `Indie`, `Pop`; `jackwoodwardmusic.com` |
| Charlie Farley Band | `websiteUrl` | `charliefarleyband.co.uk` |

## 8. Venues

**0 created. 10 reused.** No `create_venue` call was made.

| Source name | bndy venue | Id |
|---|---|---|
| the Steelworks Bredbury | The SteelWorks Bredbury | `4a3a6ff5-4695-4b45-99f4-74f852788c74` |
| the Swan Inn Wilmslow | The Swan Inn | `pq6Rk3XQeVXCU5nxcvd9` |
| the Dog Inn Chadderton | The Dog Inn | `q2zJ4l8YAdshgCuXhseR` |
| Coach & Horses Oldham | The Coach and Horses | `1efc325d-207c-4883-a18d-ff38a928df84` |
| the Billy Goat Mossley | The Billy Goat | `5HtnKXxZrHoI6904D8xq` |
| Stockport Town Hall Tavern | Town Hall Tavern | `BmQg5orKKV613HpsCjge` |
| the Railway Handforth | The Railway, Handforth | `mm0bQZ6jFLr1FR4huxcW` |
| Marple Con & Social Club | Marple Con Club | `bbzzpFPYsOVE4bcHU60s` |
| Crown Bredbury | The Crown Inn | `3AynHVShOedKil6wTesE` |
| Rising Sun Hazel Grove | The Rising Sun | `SzE46SL9phccWWNprHhb` |

Three of these returned as **low confidence** and would have failed a 50% create-new threshold: The SteelWorks 43%, The Crown Inn Bredbury 38%, The Railway Handforth 32%. Each was opened before use, as §3 requires, and each already carries a `gigs-news-uk` externalId. §2.16 governs and no new item is raised. The two learned-mapping ids from the spec were confirmed by `get_by_id` before use.

The Crown Inn Bredbury and The Crown Inn Stockport are two different pubs. This run touched only the Bredbury record, `3AynHVShOedKil6wTesE`, SK6 2AA.

## 9. Events created — 13

| # | Event | Id | Date | Time | externalId |
|---|---|---|---|---|---|
| 1 | Velvet Sun @ The SteelWorks Bredbury | `ee959c0d-3c54-4177-a3bd-8794c2eaf5fb` | 2026-08-14 | 20:00 | `2026-08-14-velvet-sun-the-steelworks-bredbury` |
| 2 | Jack Woodward @ The Swan Inn | `928ff061-01ae-4b31-bcaa-ff02f5c7eaf5` | 2026-08-14 | 21:00 | `2026-08-14-jack-woodward-the-swan-inn` |
| 3 | Samm Hewitt @ The Dog Inn | `2838592f-fe0f-4718-82a4-def7767d2898` | 2026-08-14 | 21:00 | `2026-08-14-samm-hewitt-the-dog-inn` |
| 4 | Emma Gilmour @ The Swan Inn | `5d0e410a-caa7-4351-8675-e9b8178a32c5` | 2026-08-15 | 21:00 | `2026-08-15-emma-gilmour-the-swan-inn` |
| 5 | Billy No Mates @ The Coach and Horses | `ec67622c-db3a-4bf7-82ac-e02384a22c16` | 2026-08-15 | 21:00 | `2026-08-15-billy-no-mates-the-coach-and-horses` |
| 6 | Carlo Sax @ The Billy Goat | `bf09740b-2f90-4798-9c41-8fc46e1dce2a` | 2026-08-15 | 21:00 | `2026-08-15-carlo-sax-the-billy-goat` |
| 7 | Grey Dogs @ Town Hall Tavern | `8192b698-b3c1-47c9-a776-69e3f4de6675` | 2026-08-15 | 21:00 | `2026-08-15-grey-dogs-town-hall-tavern` |
| 8 | Charlie Farley Band @ The Railway, Handforth | `5e9b72d0-187c-453f-a3d9-693a8d3e18b1` | 2026-08-15 | 21:00 | `2026-08-15-charlie-farley-band-the-railway-handforth` |
| 9 | James is Elvis @ Marple Con Club | `09a5fb80-0215-4e4f-88ea-350d463d09e3` | 2026-08-15 | 21:00 | `2026-08-15-james-is-elvis-marple-con-club` |
| 10 | Northside Brothers of Soul @ The Crown Inn | `0f5eabdf-83bf-4b4d-a34d-dbfe9a15030f` | 2026-08-15 | 21:00 | `2026-08-15-northside-brothers-of-soul-crown-bredbury` |
| 11 | Jackie Dijon @ The Rising Sun | `e58c0e31-0e0f-48a4-8292-5b8e6e3ec05b` | 2026-08-15 | 21:00 | `2026-08-15-jackie-dijon-the-rising-sun` |
| 12 | Simon Langley @ The SteelWorks Bredbury | `b205648e-c1e0-420c-b06a-b3b2e384e860` | 2026-08-16 | 16:00 | `2026-08-16-simon-langley-the-steelworks-bredbury` |
| 13 | Steve James @ The Dog Inn | `3a0174b9-6536-417e-a80f-44e996d6fe7b` | 2026-08-16 | 18:00 | `2026-08-16-steve-james-the-dog-inn` |

Every event carries `isPublic: true` and the `gigs-news` namespace, in the §6D slug form. Every event was read back with `get_by_id` and every field matched.

### Start times

Three times are stated by the source and are used as stage times (§0.28 case 1):

- Velvet Sun `8pm` → 20:00
- Simon Langley `4pm` → 16:00
- Steve James `6pm` → 18:00

Ten times are **defaulted** under §5.6 and are correctable:

- Friday 14 August, 2 events → 21:00
- Saturday 15 August, 8 events → 21:00

No source published a doors time, so `ticketInformation` is empty on all 13. No row carried a window, so no `endTime` was set.

## 10. Validator

```
python3 scripts/enrichment_validate.py \
  --records data/state/validator-input-2026-08-14T04-40-00Z-gigs-news.json \
  --evidence data/state/enrichment-evidence-2026-08-14-gigs-news.jsonl

9 records · 6 clean · 0 FAIL · 3 WARN   [mode=gate]     EXIT=0
```

The evidence file was written before the bio edit, not after. Nine lines, one per created artist, at `data\state\enrichment-evidence-2026-08-14-gigs-news.jsonl`.

**Three WARNs, each explained:**

1. `STUB_NO_BIO` — **Jack Woodward.** The page Intro carries no bio text in the logged-out view. Chrome is not signed into Facebook. A bio invented from the Google snippet would break §2A.1 item 8. Left empty.
2. `STUB_NO_BIO` — **Emma Gilmour.** Facebook truncates her Intro mid-word behind *See more*: *"...Songwriter and Voice Over Art"*. §2A.1 item 8 permits a cut only at a sentence or line boundary. Cutting at the first sentence yields *"Hi my name's Emma Gilmour."*, which carries no information. Left empty.
3. `NAME_BILLING` — **Charlie Farley Band.** The tail is part of the name, on the act's own site. See §6.

**Judgement sample, 3 of 13 rows checked against source:** row 23 of the capture (`Velvet Sun band 8pm - the Steelworks Bredbury`), row 63 (`the Grey Dogs - Stockport Town Hall Tavern`) and row 84 (`Simon Langley 4pm - the Steelworks Bredbury`). All three match the written event on artist, venue, date and time.

## 11. Corrections applied

None. No act page contradicted a source date or time this run.

## 12. Raised to CTO-INBOX

**Nothing.** Every candidate is already open under an existing fingerprint, or a standing rule answers it:

| Candidate | Disposal |
|---|---|
| Facebook page search returns `Not Found` | Open: `facebook-page-search-not-found` |
| Chrome not signed into Facebook | Open: `bv2a-facebook-not-logged-in` |
| Spec declares no §0.29 mode | Open: `gigs-news-mode-undeclared` |
| Second firing overwrites the run report path | Open: `run-report-path-collides-on-second-firing` |
| `create_artist` 500 on an emoji bio | Open: `create-artist-500-emoji`. The `edit_artist` workaround still holds. |
| `search_venue` returns the right venue below 50% | Answered by §3 and §2.16. Three instances this run, all opened before use. |
| `record_run` fails on a missing token | Open: `record-run-token-missing`. Not blocking. |
| `Elvis show` has no real act name | Answered by §0.5 and §0.20. Skipped, not guessed. |

## 13. Files written

- `data\raw\gigs-news-uk\2026-08-14\capture-04-06Z.txt`
- `data\state\gigs-news-uk-last-page.txt` (125 lines, snapshot gate satisfied)
- `data\state\enrichment-evidence-2026-08-14-gigs-news.jsonl` (9 lines appended)
- `data\state\validator-input-2026-08-14T04-40-00Z-gigs-news.json`
- `data\state\heartbeat\gigs-news-2026-08-14T04-06-45Z.json`
- `data\state\claims\gigs-news.json`
- `data\state\run-summary.jsonl` (1 line appended)
- `20-Daily\2026-08-14.md` (1 entry appended)
- this report

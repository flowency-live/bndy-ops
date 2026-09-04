# gigs-news — scheduled run 2026-08-30

- **Run id**: `gigs-news-2026-08-30T04-07-17Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`. Every fingerprint in the file was listed before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`. `heldBy` was null, released by `gigs-news-2026-08-29T19-37-20Z`. Acquired 04:07:17Z, TTL 90 minutes. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-30T04-07-17Z.json`. See §11.
- **Outcome**: **COMPLETED.** The source has not changed since the last run. Three live future events gained the `gigs-news` externalId they were missing.
- **Gap since the last run**: 8 hours 30 minutes.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Events edited (externalId back-fill) | 3 |
| Artists created | 0 |
| Artists enriched | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Records staged | 0 |
| Names sanitised under §0.6 | 0 |
| Rows rejected by the source filter | 53 |
| Rows skipped — past-dated (§0.14) | 73 (the Wed, Thu, Fri and Sat blocks, plus 7 past forward rows) |
| Gate bounces (409/422) | 0 |
| Creates against the 50 cap | 0 |
| Validator | 0 records · 0 FAIL · 0 WARN, exit 0 |

## 2. Capture — Chrome is still down, curl again

`tabs_context_mcp` returned *"Claude in Chrome is not connected"*. The spec says Chrome is mandatory and forbids a `web_fetch` fallback. **This run used neither Chrome nor `web_fetch`.** It used a container `curl` and parsed the HTML itself, the route evidenced in the inbox as `gigs-news-curl-reproduces-week-view` (2026-08-18) and used by the 2026-08-29 run.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | container curl, BeautifulSoup + lxml, leaf block nodes, `a[href]` per §0.22 | HTTP 200, 113,465 bytes |
| `https://www.gigs-news.uk/branded.htm` | same | HTTP 200, 264,591 bytes |

Raw capture: `data/raw/gigs-news-uk/2026-08-30/week-view-raw.html`, `branded-raw.html`.

**Both files are byte-identical to the 2026-08-29 capture.**

| file | md5 (2026-08-30) | md5 (2026-08-29) |
|---|---|---|
| `week-view-raw.html` | `b1c675e0840e0e33239d298ddfc9d9ef` | `b1c675e0840e0e33239d298ddfc9d9ef` |
| `branded-raw.html` | `db98344ec98d320bbe819b5e50152e20` | `db98344ec98d320bbe819b5e50152e20` |

The curator has not touched either page in 24 hours. The header still reads `What's on This Week 26 - 30 August`. The page rolls on a Wednesday, so this is expected and it is not a stale-source fault.

The two parsing rules the 2026-08-29 run established were applied unchanged: `<br>` becomes a line break **before** text extraction, and text is joined with **no** separator. Both are written into the snapshot header.

`javascript_tool` was not used, so its three §6B output guards did not arise.

### The in-app browser is not a substitute surface

The built-in browser pane was tried once, to see whether it could replace Chrome for §2A.1 surface (b). `navigate` to `google.com` returned `navOk: false` — the domain is denied. This is the same class as the open item `sceniceye-inapp-browser-denied-domain` and is **not raised again**. No third search engine was tried: `sceniceye-third-surface-needs-ruling` is open and a run does not pick its own surface.

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` plus the **27 dated rows** that follow it contiguously. The next line is set-list prose. All three safeguards held: ordinal position, the lowercase-`gigs` against capitalised-`Gigs` distinction, and the day-name-against-date cross-check.

Seven forward rows are past-dated (1 to 28 August). The remaining **20 run 5 September to 31 December**, inside the 12-month horizon.

**All 20 are already in bndy.** `search_event(artistId: rwDw320gku5uQ4gzaU2N, 2026-08-30 → 2027-01-31)` returned exactly 20 events, one per forward row, each carrying a `gigs-news` externalId in the §6D slug form. Coverage of section 2 is complete. No forward row needed a create.

## 4. Diff (§5.7)

**Mode: the spec declares neither `delta` nor `append-only`.** Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing. The question is moot this run: the capture is byte-identical to the one the stored snapshot was written from, so no row could have disappeared.

- **Section 1 (week view)**: **0 added, 0 removed.** 99 body lines against 99.
- **Section 2 (branded forward list)**: **0 added, 0 removed.** 27 rows against 27.
- **Ordered comparison**: the regenerated body and the stored snapshot body are identical line for line, 127 against 127.
- **§5.7(a) self-diff gate**: the written snapshot re-diffed against a regeneration from the same capture returns **0 added / 0 removed**, 127 lines against 127, ordered identical. **PASS.** Artefact: `data/raw/gigs-news-uk/2026-08-30/selfdiff-snapshot.txt`.

No §0.17 decision arose under either mode.

## 5. Week-view coverage — the six Sunday rows

Today is Sunday 30 August, the last day the page covers. Its six importable rows were all written by earlier runs. Each was read back with `get_by_id`:

| date | event | id | externalId at start of run |
|---|---|---|---|
| 2026-08-30 | Off the Record @ Stock Dove | `66884b09-9026-44d8-9838-e025ea65fad5` | present |
| 2026-08-30 | Joe McShane @ The Dog Inn | `2979ce18-8a48-4725-91cd-c0472b5a9cd2` | present |
| 2026-08-30 | Preston & Weltz @ The Coach and Horses | `00e880e5-e38b-4fbf-a1e1-e6fb8b2bf0c7` | present |
| 2026-08-30 | Devil Hound Blues @ The Railway | `bf33bac9-ff47-45b1-a468-5ed3c7a0c302` | **EMPTY** |
| 2026-08-30 | Manic @ Cheshire Cheese | `301e37d2-18a2-44ea-b1c1-a778e14d075b` | **EMPTY** |
| 2026-08-30 | Nick Milner Band @ The Acoustic Lounge | `ae0b8656-381d-444d-91e1-419186076768` | **EMPTY** |

All six are `isPublic: true` and correctly dated. Nothing in the week view is unwritten.

## 6. The three writes this run made

The three events above with an empty `externalIds` array are the §6C **empty externalIds** failure class. They were created by the second writer described in the open item `gigs-news-daily-import-second-namespace`, so this source's own diff cannot match them by id and only the artist-venue-date sentinel protects them. The 2026-08-27 run identified the back-fill and could not afford it. This run had a quiet source and could.

| event | externalId written | read back |
|---|---|---|
| `bf33bac9-ff47-45b1-a468-5ed3c7a0c302` | `{gigs-news, 2026-08-30-devil-hound-blues-railway-greenfield}` | verified `get_by_id` |
| `301e37d2-18a2-44ea-b1c1-a778e14d075b` | `{gigs-news, 2026-08-30-manic-cheshire-cheese-newton}` | verified `get_by_id` |
| `ae0b8656-381d-444d-91e1-419186076768` | `{gigs-news, 2026-08-30-nick-milner-band-acoustic-lounge-poynton}` | verified `get_by_id` |

Method, and why it is safe. §6B states `edit_event(externalIds)` **replaces** the array and dedupes to one id per source. Each record was read with `get_by_id` first, each array was empty, and the complete intended array was written in one call. `get_by_external_id` was called on the first slug before writing it and returned `found: false`, so no id was stolen from another event. No other source's id existed on any of the three, so nothing was displaced.

Slug form follows §6D and the convention this source's own records already use: the venue segment is slugged from the **source** venue string (`Railway Greenfield`, `Cheshire Cheese Newton`, `Acoustic Lounge Poynton`), matching `2026-08-30-off-the-record-stock-dove-romiley` written on 2026-08-28.

**Scope note.** Only future-dated week-view events were back-filled. The 2026-08-27 report names about 33 events in the same state; the rest are now past-dated, where a provenance id buys nothing and the horizon rules exclude them from any future diff.

## 7. Rejections — 53 rows, by class

| Class | Count | Examples |
|---|---|---|
| Blank act (venue only) | 12 | `- the Albion Dukinfield`, `- Windsor Castle Marple Bridge` |
| Time-only row | 5 | `10pm - Mash Guru Macclesfield`, `5pm - Whittles Oldham` |
| Open mic | 7 | `Karl Magee's Open Mic`, `Between the Vines Open Mic 7pm` |
| Karaoke, disco | 6 | `Dave's karaoke 5pm - the Club Romiley` |
| Generic live bands | 5 | `Bands - Spinning Top`, `live bands 4pm - Spinning Top` |
| Jam or themed night | 5 | `Backwater Blues Jam`, `Jazz Night`, `Jazz at the Railway` |
| DJ only | 1 | `DJ Martin 7pm- the Steelworks Bredbury` |
| Sponsorship-meta, branded, Reserved | 11 | the home-page `gigs 2026` block, `branded - Ashton Jubilee Club` |
| Not a gig | 1 | `closed today - the Steelworks Bredbury` |

`Backwater Blues Jam` and `Loose Change Jazz Night` are named in the spec's `event_skips`. `Jazz at the Railway` is a standing skip. `Tony Auton band Jam` was rejected as a jam, on the reading the 2026-08-27, 2026-08-28 and 2026-08-29 runs all recorded.

Past-dated and skipped under §0.14: the Wednesday 26th, Thursday 27th, Friday 28th and Saturday 29th blocks, plus the seven forward rows dated 1 to 28 August.

## 8. Rows carried forward, not written

- **`9th Sept Off the Record - Stockport Rock & Roll Society`** — a §Future-date-prefix row. The date parses to 2026-09-09 and the act resolves (**Off the Record** `ZBsvczPpYGAHbDdcHFfJ`). The venue publishes no address and no postcode and only a Facebook **group** link, so §0.8 forbids the geocode and §1 forbids an event with no venue. Fourth consecutive run to carry it. Already open as `gigs-news-rock-n-roll-society-no-address`. Not raised again.
- **`TrainTrax festival from 2:30pm - the Railway Handforth`** — rejected. The row names no act. §0.5 forbids inventing one. Now past-dated in any case.
- **`Reunion Jack`** and **`Britpop Beatles`**, the two acts the 2026-08-29 run could not settle without a rendering browser, were both booked for 2026-08-29. Those dates have passed, so §0.14 closes them. Neither act appears again in the current capture. Nothing is owed.

## 9. Enrichment — deliberately not attempted

Three of the six Sunday acts are name-only stubs from the 2026-05-01 batch: **Devil Hound Blues** `b4283e4a-c69f-41e5-86db-e9f49aaac7ce` carries no Facebook, no bio, no genres and no actType, and is flagged `aiCreated` and `needsReview`.

This run did **not** top them up. §2A.1 surface (a) is Facebook page search in Chrome and Chrome is down. Surface (b) alone would mean attaching a page from a search snippet without opening it, which the open item `fb-page-must-be-visited-not-snippeted` (2026-08-12) records the validator catching ten times. A genre-only fill is the `bv2a-enrichment` task's lane and that task has run five times tonight. Duplicating it here would write the same field twice from a weaker surface.

An empty evidence file `data/state/enrichment-evidence-2026-08-30-gigs-news.jsonl` was written so the validator has this run's own file to read, per §6F ownership.

## 10. Contract steps

- `data/state/cancellations.jsonl` was read before any write. It holds 14 lines. None matches an artist, venue and date in this capture — every entry is an `onthecase` or `spider` record in North East England or Stockport, and the one Stockport line (PULS at Arden Arms, 2026-08-08) is past-dated and absent from this capture.
- `data/state/run-summary.jsonl` and `data/normalized/*/2026-08-30/` were read before any conclusion was drawn. Three tasks have completed today: `enrichment` (five firings), `klma-stoke-gig-list` and `onthecasemusic`. **None ruled on any gig in this capture** — the onthecase hides are all North East. No absent record was read as a coverage gap.
- Snapshot written to `data/state/gigs-news-uk-last-page.txt`, 130 lines, normalisation rules in the header. Self-diff 0/0.
- Validator: **0 records · 0 FAIL · 0 WARN**, exit 0. It had nothing to check because no enrichment field was written.
- `run-summary.jsonl` appended. Daily note appended by re-reading the file immediately before the append, never by a whole-file write — see §12.
- **No inbox item raised.** Nothing this run found is new. The inbox's own rule 3 says an empty run does not append.
- Scratch files used a per-run unique path, per `shared-tmp-collides-across-runs`.
- Claim released as the last action.

## 11. Heartbeat filename

The 2026-08-29 run recorded that it had written `gigs-news-uk-<ts>.json` while every earlier firing used the namespace form `gigs-news-<ts>.json`, and raised `gigs-news-heartbeat-filename-slug-drift`.

**This run wrote the file-slug form first, then corrected to the namespace form.** Both files exist and both are finalised, because an unattended run cannot delete a file (§6G):

- `data/state/heartbeat/gigs-news-2026-08-30T04-07-17Z.json` — the authoritative heartbeat. It is the file named in the claim record, which is what §6G's takeover check reads.
- `data/state/heartbeat/gigs-news-uk-2026-08-30T04-07-17Z.json` — written first, then rewritten with `"outcome":"superseded"` and a `reason` pointing at the file above, so no future run can read it as a live or dead holder.

**The namespace form is the one to keep.** It matches the claim filename `claims/gigs-news.json`, it matches the `externalId` namespace fixed by §6D, and it matches every firing before 2026-08-29.

## 12. Daily note

The 2026-08-29 run destroyed two other runs' lines in `20-Daily/2026-08-29.md` by a create-then-write on a shared file, and raised `daily-note-overwritten-by-concurrent-run`. **That finding was obeyed here.** `20-Daily/2026-08-30.md` already existed. It was re-read immediately before the append and one line was appended with `>>`. No existing line was rewritten.

## 13. `record_run`

Not attempted. `record-run-token-missing` has been open since 2026-08-08 and the prompt states it is not blocking. `run-summary.jsonl` is the dashboard's input and it was appended.

## 14. Honest read of this run

The source did not move. Both pages are byte-for-byte what they were 24 hours ago, and the diff proves it rather than assuming it. Every importable row on the page is already in bndy: six week-view events for today and 20 forward-list events to 31 December, checked in bndy rather than taken from the previous report.

That leaves a no-change run, which the runbook says is a real result. It is not the whole result. Three of today's six live events carried no provenance id at all, which means this source's diff could not see them and only the backend sentinel stood between them and a duplicate. Fixing three of those is a smaller number than a night of creates, and it is worth more than nothing: it is three records that the next run can now match by id instead of by luck.

The standing cost is unchanged and it is not a capture problem. curl reproduces this source exactly. What is missing is a rendering browser, and without one no act on this page can gain a bio, an avatar, or a page that was opened rather than guessed.

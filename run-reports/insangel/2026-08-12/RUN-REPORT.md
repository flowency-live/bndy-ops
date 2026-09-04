# insangel — RUN REPORT — 2026-08-12

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `insangel-2026-08-12T00-39-28Z` |
| task | `insangel` |
| runbook read | `RUNBOOK.md` **v2.27** |
| floor asserted | §6A **v2.19**. The prompt names no number. v2.27 is at or above the floor. |
| claim | `data\state\claims\insangel.json` was released (`heldBy: null`, `lastRun` `insangel-2026-08-09T19-03-55Z`). Acquired at 00:39:28Z, TTL 90 minutes. No takeover. |
| heartbeat | `data\state\heartbeat\insangel-2026-08-12T00-39-28Z.json` |
| evidence file | `data\state\enrichment-evidence-2026-08-12-insangel.jsonl` (14 records) |
| source mode (§0.29) | **NOT DECLARED in the spec.** The run treated the source as `append-only`. It removed nothing. Raised to `CTO-INBOX.md`. |
| caps | 50 creates. **36 used.** 3 venues, 14 artists, 19 events. |

## 1. Counts

| measure | count |
|---|---|
| events created | 19 |
| artists created | 14 |
| artists linked to an existing record | 1 (Spirit of 97) |
| venues created | 3 |
| venues reused | 8 |
| existing records topped up | 0 |
| rows skipped | 1 |
| 409 / 422 bounces | 0 |
| deletions | 0 |
| validator | 14 records · 14 clean · **0 FAIL** · 0 WARN |

### Quality split (§6, v2.5)

| class | count | records |
|---|---|---|
| created with a **verified page** | 5 | Tahnee, Simply Lisa, Shaun Chipp, Lily Rose, Sam Shields |
| created with an **evidenced blank** | 9 | John Haswell, Aiva Walmsley, Mark Carter, Mike Simpson, Gary Gibson, Steven Robertson, Joe Devanny, Terry Gorman, Derrin Atkins |
| staged | 0 | — |
| names sanitised under §0.6 | 3 | `Tahnee - vocalist NE` → **Tahnee**; `Simply Lisa - Music` → **Simply Lisa**; `Shaun Chipp Music` → **Shaun Chipp** |
| rows skipped as a non-place (§0.23) | 1 | `hornby-park--seaton-carew` |

5 verified pages plus 9 evidenced blanks is 14. No artist was created as a stub.

## 2. Capture

The sandbox proxy returns **HTTP 403** for `insangel.co.uk`. `web_fetch` returns an empty body for the same host. This repeats the condition behind the open item `insangel-egress-blocked` and is **not re-raised**.

Chrome reached the site normally. Collection used `document.querySelectorAll` with direct `a[href]` reads, per §0.22. No text extraction was used for ids.

| measure | value |
|---|---|
| raw page | 75 venue cards, 1135 gig rows, 1144 artist-gig pairs |
| stale rows dated before capture | 4 |
| declared-placeholder pairs excluded | 486 |
| beyond the 12-month horizon | 0 |
| unparseable dates | 0 |
| **in-scope after filters** | **72 venues, 654 artist-gig rows** |

Start times came from the venue detail pages (`/venues/<slug>`), which publish a real time per gig. **No time was defaulted under §5.6.** Every time in section 5 is the source's own published time, and §0.28 treats it as the stage time.

## 3. Diff (§5.7)

Snapshot compared: `data\state\insangel-last-page.txt`, written by `insangel-2026-08-09T19-03-55Z` (71 venues, 663 pairs).

Both sides were normalised before comparison, per §5.7(a): whitespace runs collapsed, cells and rows trimmed, a trailing comma, full stop or slash stripped, trailing country and county suffixes case-normalised, HTML entities decoded once. The rules are written into the new snapshot's header.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from: 0 added / 0 removed, 654 pairs.** The gate passes. No deletion was taken anyway, because the source declares no §0.29 mode and the run therefore behaved as `append-only`.

| | count |
|---|---|
| venues added | 1 (`townfoot-cafe--rothbury`) |
| venues removed | 0 |
| pairs added | 20 |
| pairs removed | 29 |

### 3.1 Removed rows — no action taken

**5 removed rows are dated 2026-08-09.** That date has passed. §5.7 states plainly that a row disappearing because its date passed is not a cancellation.

**24 removed rows are future-dated.** 23 of them sit at `washington-arms--washington`, whose forward listing fell from 40 entries to 19. **Seven of the rows it lost reappear at `the-rattler--south-shields` on the same dates**, and one reappears at `hornby-park--seaton-carew`:

| row | was | is now |
|---|---|---|
| 2026-09-17 joe-devanny | washington-arms (via 2026-08-09 row) | the-rattler |
| 2026-09-24 terry-gorman | washington-arms | the-rattler |
| 2026-10-02 aiva-walmsley | washington-arms (2026-08-23) | the-rattler |
| 2026-10-11 derrin-atkins | washington-arms | the-rattler |
| 2026-11-01 mark-carter | washington-arms | the-rattler |
| 2026-11-08 lily-rose | washington-arms | the-rattler |
| 2026-12-13 tahnee | washington-arms | the-rattler |
| 2026-10-18 jade-sanders | washington-arms | hornby-park |

This is a venue-attribution shift between the two captures, not 24 cancelled gigs. **An `append-only` run deletes nothing, so the ambiguity cost nothing.** A `delta` run on this evidence would have proposed 24 future-dated deletions, and at least 8 of them are demonstrably live at a different venue. This is the same class as `whitespace-diff-drift` and `index-parser-phantom-removals`. It is recorded here rather than raised, because §0.29 already governs it and the correct behaviour was taken.

## 4. Venues

### Reused (8)

| slug | bndy id | name |
|---|---|---|
| `annitsford-welfare-club` | `4082b952-b9e3-4f81-acc0-2dd9f41fdcef` | Annitsford Welfare Club |
| `newton-grange--durham` | `d9d9b0c9-1200-4ce7-8f98-a7ad8bedd510` | Newton Grange |
| `the-blake-arms--seghill` | `3d1735fc-c283-4f83-abfa-5c7fd06df36e` | The Blake Arms |
| `the-denton--newcastle` | `cdac6734-32df-4f95-b2d9-e262d4a9185a` | The Denton |
| `the-dirty-bottles--alnwick` | `d6276d3a-2201-4de3-b1bd-f3064772a31d` | Dirty Bottles |
| `the-hairy-lemon--alnwick` | `63eafe7a-a59d-4c80-8977-0c6b1cb43205` | The Hairy Lemon |
| `the-rattler--south-shields` | `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler |
| (artist link) `spirit-of-97` | `ee447481-ed68-42cf-93e4-083fdfd608e4` | Spirit of 97 — already carries the `insangel` externalId. No top-up needed. |

### Created (3)

| bndy id | name | address | place_id | postcode check (§0.24) |
|---|---|---|---|---|
| `b6289d09-9684-4508-abd9-3d049f14bc05` | Poetic License Bar | Roker Terrace, Roker, Sunderland SR6 9NB | `ChIJsd4iuUNmfkgRgQKGUUNkEzQ` | SR6 is Sunderland. Correct. |
| `78871b2f-3127-45bd-abb7-b5869cee1f1b` | The Chapel Park | Hartburn Dr, Newcastle upon Tyne NE5 1TE | `ChIJW5wkVzR2fkgRxBYOiZdjRTU` | NE5 is Newcastle. Correct. |
| `cec5afc7-dbf2-46a9-9c74-5e8f6bb6b1c5` | Townfoot Café and Bar | The Old Motor House, Town Foot, Rothbury, Morpeth NE65 7SN | `ChIJ6eBBAwD7fUgRQ_iZyLgRFig` | NE65 is Northumberland. Correct. |

**Two name mismatches were accepted, and the postcode decided both** (`venue-name-gate-too-strict`, resolved 2026-08-09).

- Asked for `The Park`, Google returned **The Chapel Park**. The venue's own insangel page calls itself *"The Chapel Park in Newcastle Upon Tyne"*. Same building, same postcode.
- Asked for `Townfoot Cafe`, Google returned **Townfoot Café and Bar**. Same address, same postcode.
- Asked for `Poetic License`, Google returned **Poetic License Bar** at SR6 9NB where the source published SR6 9ND. Same street, same building.

**Search discipline before each create (§3, v2.16).** `get_by_external_id` missed all three. `search_venue` on the stripped name plus city missed all three. The single-distinctive-word probe and `list_venues(city:…)` also missed. Only then were they created.

### Skipped (1)

**`hornby-park--seaton-carew` — SKIPPED under §0.23.** Hornby Park is a public park in Seaton Carew, not a fixed building. The venue detail page publishes no address and the two gigs are Sunday afternoons (16:45 and 15:00), which fits an outdoor bandstand booking. bndy's venue UID is a Google Place ID, and no correct one exists for a park. **One row is not imported: `2026-10-18 Jade Sanders`.** No venue was created, no placeholder venue was created, and the gig was not written without a venue.

## 5. Events created (19)

All carry `isPublic: true` and the `{source:"insangel", id:"<sha1[:12] of venue_slug|date|artist_slug>"}` externalId form ruled final by Jason on 2026-08-08 (D-05). Every id was read back with `get_by_id` on a sample of three; all 19 create calls returned the stored record.

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 1 | `05ac38b9-f98c-4b67-9726-2ee4d963376a` | John Haswell @ Annitsford Welfare Club | 2026-10-03 | 17:00 | `3901c0524d2d` |
| 2 | `e3dd15a9-d1c4-4552-a9aa-461af53344f1` | Aiva Walmsley @ Newton Grange | 2026-12-18 | 19:30 | `fc016f7244b7` |
| 3 | `63c24b73-0d38-432d-a10f-9ecbeab37117` | Mark Carter @ Poetic License Bar | 2027-01-29 | 19:30 | `cc5136afa03e` |
| 4 | `ce8c7cf4-7746-4f1a-b4f3-fd045c60e562` | Tahnee @ Poetic License Bar | 2027-03-05 | 19:30 | `7e4dfea7c6a6` |
| 5 | `5e15ef5f-1c87-458c-94d4-45efe2f8a93d` | John Haswell @ The Blake Arms | 2027-01-16 | 19:00 | `f39a49a225ea` |
| 6 | `e8ee554e-2919-4d96-9aac-01d89d361b70` | Simply Lisa @ The Blake Arms | 2027-01-30 | 19:00 | `9c31a16bd578` |
| 7 | `86b55970-1b7c-439a-b655-ce0c310d4626` | Spirit of 97 @ The Denton | 2027-04-24 | 20:00 | `eaf77201dfea` |
| 8 | `ff40427d-80c8-46fd-a3f6-cdc3880f5366` | Mike Simpson @ Dirty Bottles | 2026-12-31 | 19:00 | `ddbf830eb300` |
| 9 | `53a63cf4-32a1-425b-bfef-ed8f5a2a917c` | Gary Gibson @ The Hairy Lemon | 2026-08-22 | 20:00 | `943864b64ffb` |
| 10 | `e6e6ce6e-930c-4387-b4d2-d2a8ed7e36c3` | Shaun Chipp @ The Hairy Lemon | 2026-12-19 | 20:00 | `b426f690f418` |
| 11 | `406bfce6-7678-4906-aa0e-a45f28bdf8a9` | Steven Robertson @ The Chapel Park | 2026-08-15 | 19:00 | `93a60bbf1376` |
| 12 | `3c53875b-085f-4df5-a634-d507ba175ee1` | Joe Devanny @ The Rattler | 2026-09-17 | 20:00 | `ec36330045b8` |
| 13 | `04d56939-583f-447c-a165-459439dc3fcd` | Terry Gorman @ The Rattler | 2026-09-24 | 20:00 | `f7c49b6ffe21` |
| 14 | `af473254-7ef2-41b2-b74e-479d3f8ba5a4` | Aiva Walmsley @ The Rattler | 2026-10-02 | 20:00 | `dba1a4526289` |
| 15 | `5f08c297-4f1b-4996-ad9a-389d666c2ebd` | Derrin Atkins @ The Rattler | 2026-10-11 | 17:00 | `76959e8ae930` |
| 16 | `594dbd1e-244a-44f7-a59d-8cc784c8f3ad` | Mark Carter @ The Rattler | 2026-11-01 | 17:00 | `ff7663bfb4ec` |
| 17 | `21828b09-39e9-4ece-9c9c-2fb6c081f03f` | Lily Rose @ The Rattler | 2026-11-08 | 17:00 | `00d54de0b53d` |
| 18 | `c381527d-9fad-412e-9288-287a7c66ead0` | Tahnee @ The Rattler | 2026-12-13 | 17:00 | `36d44e730e26` |
| 19 | `d3f0b19c-e2d8-424d-a26a-8b053918866d` | Sam Shields @ Townfoot Café and Bar | 2026-08-15 | 17:00 | `913d600d0130` |

**Tombstone check (§5.4, v2.19).** `data\state\cancellations.jsonl` holds one real entry: PULS @ Arden Arms 2026-08-08. No artist, venue and date in this batch matches it. Nothing was tombstoned.

## 6. Artists

### Created with a verified page (5)

| bndy id | name | location | page | actType | genres |
|---|---|---|---|---|---|
| `0f2aa9ee-4351-4ea2-a89b-d9985030c627` | Tahnee | South Shields (city) | `facebook.com/p/Tahnee-vocalist-NE-61583636457151/` | covers | — |
| `c75cbf96-2892-4d3e-9edc-0b263326435e` | Simply Lisa | South Shields (city) | `facebook.com/p/Simply-Lisa-Music-100087021356499/` | covers | Pop, Rock |
| `400ff8b2-0d05-4dc6-a733-89a448d2c31b` | Shaun Chipp | North East England (regional) | `facebook.com/people/Shaun-Chipp-Music/61584527601085/` | — | — |
| `3d38d76b-9c15-408e-9b50-b08587f77e6d` | Lily Rose | South Shields (city) | `facebook.com/lilyrsmusic/` | covers | — |
| `3bd6130d-66a1-4bb8-b1c5-3d89f03cdbea` | Sam Shields | Northumberland (regional) | `facebook.com/SamShieldsSingerSongwriter/` | originals | — |

All five bios are quotations of the act's own page, character for character (§2A.1 item 8). All five avatars use the stable `graph.facebook.com/<id>/picture?type=large` form. No `scontent.*` URL was stored.

**Identification evidence, per act:**

- **Tahnee** — page states *South Shields, United Kingdom*. Google returned posts about The Charles Palmer and Wheelhouse Camerons Brewery, both Hartlepool. Page location overrides the gig-town fallback (§2A.3).
- **Simply Lisa** — page posts carry `#northeast #solosinger` and an Amy Winehouse cover. The insangel About says *"I'm based in South Shields… solo backing track singer… I can sing from pop to rock"*. Google also returned a Seaton Lane Inn post naming her, and Seaton Lane Inn is an insangel venue.
- **Shaun Chipp** — Google returned an `amvlivemusicnewcastle` booking video for him and a GigPig listing at The Botanist Newcastle. Both are North East and match the gig footprint. The page states only *England, UK*, so the location stays regional with `locationType: regional` (§6B Kilmarnock trap).
- **Lily Rose** — the Google result set for this page names Last Orders, the Ship and Royal and Wyvestows in South Shields. Last Orders is an insangel venue. The page itself states no location, so South Shields comes from the search result and from the gig footprint. This is named here because §2A.1 3b requires it.
- **Sam Shields** — Google returned a Hexhamtv video, *"Sam Shields live at today's #Hexham #Northumberland bandstand sessions"*, and Songwriter Circle North Shields videos. The gig is at Rothbury, Northumberland.

### Created with an evidenced blank (9)

Each blank was searched on **both surfaces** before it was recorded (§2A.1 item 3b). The variants are in the evidence file.

| bndy id | name | location | why blank |
|---|---|---|---|
| `103b1cfe-db86-4cea-a1e0-5a3dd73872b2` | John Haswell | Cramlington (city) | Google returned `pipedreambanduk` (a different act he plays in) and `john.haswell.9`, a personal profile. §2A.4 never links a personal profile. Facebook page search returned no pages. |
| `c2e86482-dbec-4036-9fb6-085cad647d23` | Aiva Walmsley | North East England (regional) | Facebook page search returned *"We didn't find any results"*. Google returned only third-party posts, one of which praises her set at The Rattler, South Shields. |
| `50530f7a-09c1-4afc-8172-e5bc52fd64cf` | Mark Carter | Barnard Castle (city) | See the note below. |
| `8ada978b-ce54-4762-bde3-d62a491648ac` | Mike Simpson | Alnwick (city) | No act page on either surface. Common name. |
| `d63a9194-fe74-4b65-a020-804356f3232c` | Gary Gibson | North East England (regional) | The only pages found are a **US** bluegrass act around Kerrville, Texas. §2A.1 item 1 forbids attaching a non-UK same-name act. |
| `f08b2aa5-0086-4708-96d0-d166a49af7c0` | Steven Robertson | North East England (regional) | A Tan Hill Inn post welcomes him, which corroborates identity, but a venue page is not the act's page. Facebook page search returned only unrelated pages. |
| `9437042a-721c-41f8-92d7-d04a8493b65f` | Joe Devanny | North East England (regional) | Langley Park Hotel and Seaton Lane Inn both post about him. Both are insangel venues. Neither is his page. |
| `007df8f5-dc54-4da4-8aab-b96b49ff55d6` | Terry Gorman | North East England (regional) | Songwriter Circle North Shields hosts his videos on YouTube. That channel belongs to a third party. |
| `49fe19a8-97a3-4b84-af02-85ef239001ed` | Derrin Atkins | North East England (regional) | `derrin.atkins` is a personal profile. `dnrliveuk` (DNR Acoustic Mayhem) and `Elemental Acoustic` are differently named acts he appears with. |

**Mark Carter — a judgment call, recorded so it is not repeated blind.** Google returned `facebook.com/markcartercarehomeentertainer`, a Product/service page reading *"Professional Care Home singer entertainer…"*. It is the same performer: the insangel About places him in Barnard Castle, County Durham, and the search results place that page on the North East clubland circuit. **It is not the act surface for a pub gig.** The field was left blank under §2A.1 blank-beats-wrong, and the candidate is written into the evidence file so a later run does not spend the search again.

### Name sanitisation (§0.6)

| source or page billing | stored name | why |
|---|---|---|
| `Tahnee - vocalist NE` (page name) | **Tahnee** | `- vocalist NE` is a descriptor, not identity. |
| `Simply Lisa - Music` (page name) | **Simply Lisa** | `- Music` is a descriptor. |
| `Shaun Chipp Music` (page name) | **Shaun Chipp** | `Music` is a descriptor. |

No trailing `Duo`, `Trio`, `Acoustic` or `Solo` was stripped from any name. None appears in this batch.

### Same-name discipline

`search_artist` was the probe for every act, never `get_by_external_id` — the spec records that 3 of 4 sampled insangel acts carry no externalIds at all, so an externalId probe reports "absent" for records that exist.

**Only one act linked, and it linked on exact normalised-name equality**: `Spirit of 97` at 100%, located Newcastle, already carrying the `insangel` externalId and `facebook.com/SpiritOf97/`.

No act was linked on a similarity score. The spec's ladder is explicit that any name divergence never auto-links, and that for names of 12 characters or fewer an edit distance of 1 to 2 is a different act. The near-misses this run declined:

- `John Haswell` held against **John Bramwell** at 77%. Different act.
- `Mark Carter` held against **P J Carter** and **Get Carter** at 64%. Different acts.
- `Mike Simpson` held against **Mike Gatto**, **Mike Bess**, **Mike Jones** at 50%. Different acts.

## 7. Corrections made during the run

**One, and the validator found it.** The first write of Shaun Chipp's bio carried a musical-note emoji. The captured page text does not hold that character — the emoji came from a search-result rendering, not from the page read. The validator returned `BIO_VERBATIM: bio is NOT a substring of the captured page text`, the bio was rewritten to the captured characters exactly, and the batch was re-validated to 0 FAIL. **This is the validator doing precisely the job §6A step 8 exists for.** An agent cannot police its own fidelity.

`create_artist` was called with `externalIds` and without `nameVariants` throughout, to avoid the open HTTP 500 recorded as `create-artist-500-namevariants`. No 500 occurred.

## 8. Validator

```
14 records · 14 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Records: `/tmp/insangel_records.json`. Evidence: `data\state\enrichment-evidence-2026-08-12-insangel.jsonl`.

## 9. Open items and what remains

### Raised to `CTO-INBOX.md`

| fingerprint | kind | one line |
|---|---|---|
| `insangel-mode-not-declared` | RULE | §0.29 requires a declared mode. The spec declares none. The run defaulted to append-only. |
| `insangel-snapshot-hides-backlog` | RULE | The 2026-08-09 run stopped on time budget with 633 rows unwritten and still wrote a full snapshot. The diff can never surface them. |

### The backlog, stated plainly

The source publishes **654 in-scope artist-gig rows**. bndy now holds **35** of them: 16 from 2026-08-09 and 19 from this run. **619 remain, and the two-sided diff will never offer them**, because the 2026-08-09 snapshot already records them as seen. §6A step 5 warns about exactly this: *"recording today's page as 'seen' would make tomorrow's diff silently swallow every row."*

This run stayed inside the diff and did not expand scope, because §5.4 (v2.19) requires a run to read the day's other reports before it treats an absent record as a coverage gap, and forbids expanding scope on that reading. The day file and `run-summary.jsonl` were read. The absence is not another run's deletion — it is the 2026-08-09 snapshot write. That is a rule problem, not a row problem, so it is raised rather than worked around.

**Two venues now in bndy carry a large unimported forward listing:** Poetic License Bar (25 rows at source, 2 written) and The Chapel Park (3 rows, 1 written). The venues exist now, so a backlog pass would be cheap.

### Not raised, because a rule already answers it

- `hornby-park--seaton-carew` skipped. §0.23 answers it.
- The sandbox 403 on `insangel.co.uk`. `insangel-egress-blocked` is already open, and Chrome is a working route.
- The 24 future-dated phantom removals. §0.29 answers it: no declared mode means append-only, and an append-only run deletes nothing.

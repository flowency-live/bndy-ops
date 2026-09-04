# Enrichment run report — 2026-08-15, 07:20Z firing

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Last 3 reports at start of this run, newest first:
1. `2026-08-15/RUN-REPORT-06.md` — COMPLETED. Validator `43 records · 17 clean · 0 FAIL · 52 WARN`.
2. `2026-08-14/RUN-REPORT-09.md` — COMPLETED. Validator `40 records · 14 clean · 0 FAIL · 50 WARN`.
3. `2026-08-14/RUN-REPORT-08b.md` — COMPLETED. Validator `24 records · 13 clean · 0 FAIL · 22 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

**Note on task-prompt paths.** The task prompt gives the project root as `bndy-population\` directly under the vault; the real path (confirmed by locating RUNBOOK.md, ENRICHMENT-TASK-v3.md, CTO-INBOX.md, the scripts and all state/report directories) is `C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\`. Used the real path throughout, per RUNBOOK §6A's own rule that a spec/prompt path is never a reason to write outside the vault path. Not logged as a new fingerprint — it is a path-prefix issue in this orchestrator prompt, not a runbook or tool defect.

## Step 1/2 — runbook and task spec

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full this firing: §0A, §0 (items 1–29), §1/§1A, §2A.1 in full (including item 3b — both search surfaces before any blank — and item 8 — bio is quoted, never composed), §2A.2, §3, §6/§6A/§6F/§6G, changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — live fingerprints noted, none re-logged as new (`bv2a-facebook-not-logged-in` [cleared as of 06:46Z firing], `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`, `bv2a-edit-artist-409-on-facebookurl-write`).

**Task-prompt claim path is stale** (`data\state\claims\enrichment.json` — never existed). Used the real path per the already-logged `bv2a-claim-path-stale-in-prompt` fingerprint / RUNBOOK §6A step 2b / TTL table: `data\state\claims\bv2a-enrichment.json`.

**Safety verification performed before any write** (per the orchestrator's own instruction): confirmed the claims-based concurrency mechanism is genuinely documented (RUNBOOK §6F/§6G, with a full incident history explaining exactly why file-delete-based locks don't work in this environment), confirmed `scripts\enrichment_validate.py` and `scripts\vault_claim.py` exist and are non-trivial real files, confirmed `data\state\claims\bv2a-enrichment.json` exists with a real prior-run history consistent with the run reports. Nothing was fabricated or inconsistent. Proceeded.

## Step 2b — concurrency

`data\state\enrichment.lock` does not exist — not honoured, not recreated. Claim file `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-15T08:08:00Z",...,"lastRun":"bv2a-enrichment-2026-08-15T06-46-43Z"}` — released. Acquired cleanly:
`{"heldBy":"bv2a-enrichment-2026-08-15T07-20-09Z","acquiredAt":"2026-08-15T07:20:09Z","expiresAt":"2026-08-15T10:20:09Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-15T07-20-09Z.json"}`
No takeover needed.

⚠ **Clock note.** This run's own `date -u` reads ~07:20–07:38Z throughout, consistent with live file mtimes observed on disk (UTC+1 local, converted). The prior firing's report (`RUN-REPORT-06.md`) states timestamps of 06:46Z–08:08Z, but that report's own file mtime converts to ~07:05Z UTC — i.e. its self-reported "Z" timestamps read about one hour ahead of the filesystem's actual UTC record, consistent with a local-time/UTC labelling slip in that run rather than anything wrong with this one. Not logged as a new fingerprint since it doesn't affect correctness here (state was read by content, not by clock), but worth a human eye if it recurs.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected (`list_connected_browsers`, exactly one, selected by deviceId). Navigated to `facebook.com`: logged-in home feed (Jason Jones's profile) — confirmed via `get_page_text`. Full artist work available.

## Selection

1. **Artists created <24h, missing socials** — 22 found. This is the same 22-name cohort the 06:46Z firing worked through (its 8 verified + 5 blank + Tanky are all still present in this list because Tanky's `facebookUrl` write is blocked by a known 409 and blanks aren't yet cooldown-excluded from this filter). Excluded the 5 already evidenced-blank in the immediately-preceding firing (Dave Legg, Northwestern, Paul Gibson, Morning's Thief, Rob Black — checked against today's ledger before selecting, per the ledger's 90-day cooldown intent) and Tanky (already flagged, known-blocked, not re-attempted). Worked the remaining 16 fresh names; one of those (Danny & Friends) turned out to be a duplicate of an existing record and was skipped rather than enriched (see below), leaving **15 artists actually enriched** (7 verified, 8 evidenced blank) plus 1 skipped.
2. **Venues created <24h, missing socials** — 174 found (a large fresh "Amber Taverns"/"Robinsons Brewery" chain-pub import batch, distinct venues from the 06:46Z firing's batch). Worked the first 30 in list order, reaching the venue cap.
3. **Backlog venues oldest-first** — not reached; venue cap (30) filled entirely by Priority 2.
4. **Backlog artists oldest-first** — not reached; artist work went to Priority 1's fresh cohort.
5. **Genre-only top-up** — not reached; budget went to Priorities 1 and 2.

## Venues — verified (30 of 30)

All via `WebSearch` per FP.2, no Chrome needed (no bio field for venues under this task). Every venue is part of the same national Amber Taverns/Robinsons Brewery chain-pub rollout seen in the prior firing, confirmed venue-by-venue against the stored street address against CAMRA/whatpub/pubsgalore/the chain's own site.

| Venue | id | Field(s) written | Evidence |
|---|---|---|---|
| The Welcome Inn | `9f6c9416-489f-4ecc-9a6b-e4b61a8658e4` | facebookUrl | facebook.com/WelcomeInnPubOldham/ |
| The Donkey Social | `b0ae955a-5250-4bcd-8836-e5d5ca54350e` | facebookUrl | facebook.com/thedonkeysocialweymouth/ |
| The Old Post Office, Byker | `04dab141-1b47-44bc-8267-8ae46c9a4a5f` | facebookUrl, website | facebook.com/TheOldPostOfficeByker/ |
| King Of Prussia | `4b9e0800-e8da-46b5-bf04-93685967ce3b` | facebookUrl | facebook.com/KingOfPrussiaHeanor/ |
| Hogarths (Preston) | `eb780e9c-babd-4c31-badd-e84aeae1b690` | facebookUrl, website | facebook.com/HogarthsPreston/ |
| The Jack 'Jigger' Taylor | `ecd98466-6b07-4367-982b-1aa08ee541d8` | facebookUrl, website | facebook.com/thejackjiggertaylor/ |
| Hogarths Tamworth | `8472def5-2682-4d30-98f5-687e7f7248d1` | facebookUrl, website | facebook.com/HogarthsTamworth/ |
| The Kinmel Arms | `3da1611c-ff99-4d1d-9220-2fc3e4823318` | facebookUrl, website | facebook.com/p/The-Kinmel-Arms-100063503352472/ |
| Tin Mill | `20555189-5bfd-4d80-92e1-12901e397e0a` | facebookUrl, website | facebook.com/tinmillcardiff/ |
| The Bears Paw | `5d231d29-743d-483b-8e31-1cd70f22f938` | facebookUrl, website | facebook.com/TheBearsPawPreston/ |
| The Ardwick | `e6c9bd07-4ba4-4a7f-9657-622d03fc8610` | facebookUrl, website | facebook.com/TheArdwick/ |
| Bulkeley Arms | `ce97ab92-59f6-41ee-905b-8888fdc6bfa4` | facebookUrl, website | facebook.com/thebulkeleyarms/ |
| The Eagle Social Tap | `48c6b5e4-af2a-4524-807f-091de7cde3c0` | facebookUrl, website | facebook.com/theeaglesocialtap/ |
| Last Orders (Sunderland) | `7edc7bb7-30d8-40bb-a4db-63cf84a03e25` | facebookUrl, website | facebook.com/LastOrdersSunderland/ |
| The Freemasons | `bc6cea76-ee3f-4538-8277-dc94e53fca88` | facebookUrl, website | facebook.com/FreemasonsFarnworth/ |
| The Black Swan | `8679c2b7-4377-4c4c-874a-f31f5d5520bb` | facebookUrl | facebook.com/theblackswandirtyduck |
| Prince Of Orange | `d299039a-536a-4285-a84f-1266d0e10596` | facebookUrl, website | facebook.com/princeoforangeashton/ |
| The Black Bull | `9b88850a-85ea-401d-b0c1-ed9bcf75de74` | facebookUrl, website | facebook.com/blackbullinn/ (own name page, not the AI-summarised "theblackbulldoncaster" URL that appeared nowhere in the raw search results) |
| The Armoury, Shaw Heath | `89c207f7-1d69-4d63-89de-b77b267384e5` | facebookUrl, website | facebook.com/TheArmouryShawHeath/ |
| The Tubwell Tap | `382b8b5a-e564-4fbe-9a1e-0f858bdd1aa6` | facebookUrl, website | facebook.com/TheTubwellTap/ |
| The Old Post Office (Bromsgrove) | `d770e951-4f10-48ee-aaa2-9aba024e4d5c` | facebookUrl, website | facebook.com/TheOldPostOfficeBromsgrove/ |
| Bulls Head, Castleton | `e9bb6f07-1592-4b54-be2f-b9d9afeaaa99` | facebookUrl, website | facebook.com/bullsheadcastleton/ — independently owned, own site bullsheadcastleton.co.uk, not part of the chain |
| The Iron Duke | `72d5fa51-f35f-47df-a99b-49d57a4b43f8` | facebookUrl | facebook.com/TheIronDukePontypool/ |
| Two Bells | `78f4f67d-0bd6-4c42-9a4b-9dfa2e9161ea` | facebookUrl, website | facebook.com/twobellsbarry/ |
| Three Brass Monkeys Swansea | `b70c62eb-62aa-4b35-bb31-c36511fd7958` | facebookUrl, website | facebook.com/ThreeBrassMonkeysSwansea/ |
| Tap & Tun | `a4ef6f33-0e76-481b-9a08-f88e03a9e2d7` | facebookUrl, website | facebook.com/tapandtun/ |
| The Forresters | `7eff5092-5b26-4911-874e-98757697ff18` | facebookUrl, website | facebook.com/ForrestersSmallthorne/ |
| The Tap & Tanner | `b37b739b-89cf-42b6-a312-1028962c738f` | website | ambertaverns.co.uk/pub/the-tap-tanner/ — a Facebook events link surfaced but no confidently-matched dedicated page URL; left blank rather than guess |
| Lord Byron | `efdbbc8a-17c8-4690-b8b1-befa8cf60fe4` | website | robinsonsbrewery.com/pubs/lord-byron-macclesfield/ — no confidently-matched dedicated FB page across two searches, left blank |
| The Caledonian | `1bd2ab08-28ad-4d2c-8b29-3ed6c691ec64` | website | ambertaverns.co.uk/pub/caledonian/ — no confidently-matched dedicated FB page across two searches, left blank |

No venue this run was left with nothing at all — every one of the 30 gained at least a website or a Facebook page.

## Artists — verified (7 of 15 worked)

All via `WebSearch` first (Google), Chrome to visit and quote confirmed pages, per FP.3.

| Artist | id | Field(s) written | Evidence / signal |
|---|---|---|---|
| Nu Call | `c488fd88-1c9f-4f15-abad-3c93a53dbddb` | bio, genres, actType, location (facebookUrl **blocked**, see below) | facebook.com/lastcallswindon — "NU CALL - Nu-Metal Tribute Band", Musician/band, exact match to the RUNBOOK's own known `lastcallswindon` example (repurposed-handle case). Location corrected from the stored Staffordshire gig-town donation to **UK wide** per §0.7 — the gig was at **The Rigger**, one of the RUNBOOK-listed national-act venues where the gig town must not donate location. |
| Guitar Heads | `b8620d09-7c42-4168-96ff-364cbd1d4fb7` | facebookUrl, websiteUrl, genres, actType | facebook.com/p/Guitar-Heads-61556359244895/ + own site guitarheads.co.uk — professional touring "greatest hits from the golden age of electric guitar" covers act (ex-Thunder/Tyketto/Status Quo members). No clean single-paragraph bio found on either surface, so bio left empty rather than stitched from a member bio and a tagline (§0.0). |
| Camens (renamed from "Camems") | `f3605b24-1a34-4cb5-9068-de260f684de7` | **name correction**, facebookUrl, bio, genres, actType | facebook.com/camensuk1/ — Stoke-on-Trent indie four-piece, UK #9 charting album. Stored name "Camems" does not exist anywhere in search; "Camens" (own FB/Bandcamp/Instagram/X handle `camensuk`) is a one-letter-different, exact location-matching, uniquely findable act — corrected under §0.6/§2A.5 (act's own page name wins). |
| Oh! Gunquit | `02db7c08-e6a0-46e1-b5b7-4e2e94e907b0` | facebookUrl, bio, instagramUrl, genres, actType | facebook.com/ohgunquit/ — London-based sci-fi surf-punk 5-piece since 2010, own albums/tours, page-stated location London matches the stored record exactly. |
| Seamus Fogarty | `3825c03c-2a57-4e57-abb5-d59f301b2f3a` | facebookUrl, websiteUrl | facebook.com/seamusfog/ + seamusfogarty.com — Domino/Lost Map recording artist, London-based per press bio, matches stored location. No populated intro/about text on the page itself, so bio left empty rather than composed from post fragments. |
| Jessie & The Revolvers | `1095ca3a-d992-4953-9866-93bc0befa222` | facebookUrl, genres, actType, **location precision upgrade** | facebook.com/p/Jessie-The-Revolvers-61571918052116/ — page states "Stoke-on-Trent, United Kingdom" explicitly; location tightened from the stored region-level "Staffordshire UK" to the city "Stoke-on-Trent" per §7 (city preferred over region, page-stated wins). No flowing bio paragraph on the page (only badge-style "Best Young Act" / contact details), left empty rather than treat a badge as a bio. |
| Hels Pattison | `de159f5f-faaf-4961-885f-265ad3b301ad` | facebookUrl, bio, genres, actType, **location correction** | facebook.com/helspattisonmusic/ — page's own intro states "North East based Singer/Songwriter with Indie Folk influences." Location corrected from the stored Staffordshire gig-town donation to **North East** per §2A.3 (page-stated location beats gig-town inference). |

**Nu Call — facebookUrl write blocked, same defect as Tanky.** `edit_artist` with only `facebookUrl` set returns `HTTP 409: Duplicate artist`; isolated by testing the remaining fields together without `facebookUrl`, which succeeded cleanly. This is the same defect the 06:46Z firing raised as `bv2a-edit-artist-409-on-facebookurl-write` (against Tanky) — not re-logged, per the inbox's own "don't append the same item twice" rule, but recorded here as a second same-day instance for whoever picks that fingerprint up.

## Artists — evidenced blank (8 of 15 worked)

Both surfaces (Google +, where relevant, prior Facebook-page evidence already in hand) tried in every case; variants in the evidence file. Per §2A.1 item 3c, bare-name-plus-one-qualifier queries were used first; a location was never asserted in a query.

- Bound By Burdens (`575f7f51-9deb-41e7-84bc-2b13c2a4edcf`) — confirmed as a real Newcastle-under-Lyme band (Planetmosh review), matching the stored Staffordshire location, but no Facebook page surfaced across three query variants. Left blank; location left unchanged since it's already correct.
- Bring Me The Horizon UK (`ba67daa6-b62c-4118-850d-042267938ba3`) — high collision risk with the globally famous Sheffield band of (almost) the same name. Search surfaced only the real band and several differently-named tribute acts (Empire, Sleepwalkers, MANTRA); no page found bearing this exact name as its own identity. Left blank rather than risk attaching the wrong act's socials.
- Charlotte (`1b13c7cd-da1a-4c2e-adae-a6a96acc9634`) — generic single first name, multiple same-area candidates (Charlotte Mary Sings, Charlotte Day, Charlotte Singer Catering), none uniquely identifiable as this record. Tier C per RUNBOOK §5.2 — name match alone is never sufficient. Left blank.
- Laura Evans (`ba988aec-5386-40f3-a80d-5ca581f69ef7`) — two candidates found (London-based singer-songwriter, New Zealand-based "Laura Evans Music"), neither matches the stored Staffordshire location; the actual Staffordshire-based "Laura Evans"-adjacent artist is a differently-named act (Laura Welsh). Left blank.
- Vulgaris (`0df54c4a-9cea-4d07-b65f-eea882ebb554`) — this record is part of the exact "Die Ego, Vulgaris, and Bound By Burdens @ Riff Factory" lineup RUNBOOK §0.3 itself uses as its worked example of correct lineup-splitting. Only candidate found for "Vulgaris" is an unrelated London band. Left blank rather than risk a wrong-act attachment on a same-name collision.
- Die Ego (`7995dc31-0e72-43a3-9653-111dfd9268f4`) — same bill as Vulgaris above. Only candidate found is an unrelated London metal band with members from Italy/Israel/Argentina. Left blank for the same reason.
- Jorge Wilson (`2d73c91f-3a43-483c-aba1-f71e914e1d6b`) — found only as a brief wedding/function-circuit directory listing (East Midlands), no own Facebook page across two searches. Left blank.
- The Complaint That Creeps (`5625c4bf-7132-49be-8f95-e5390cc170f9`) — no candidates of any kind on Google across two searches. Distinctive enough a name that a real page would likely have surfaced. Left blank.

## Artists — skipped (1 of 16 candidates)

- **Danny & Friends** (`d27e100b-9372-415f-9cf8-1986e0437387`) — `search_artist("Danny Brab")` returns a 100%-confidence existing match, `FIT600aoQ5lpNSejGctN`, a Manchester-born, Staffordshire-based singer-guitarist whose own bio and press coverage match this billing exactly. This is a duplicate record of RUNBOOK §1A.5's own worked example — "Danny & Friends" / "Danny Brab & Friends" / "Danny Brab" are all the same artist, the billing belongs in the event title, not a second artist record. Enriching "Danny & Friends" as if it were a distinct act would have compounded the duplicate rather than fixed it. Not enriched, not merged (merges are Jason-authorised cleanup, out of scope for this task, and this task must never create or delete records). Logged to `CTO-INBOX.md` as a new fingerprint (`danny-and-friends-duplicate-of-danny-brab`) for a human/CTO merge session.

## Names corrected under §0.6

- **Camems → Camens** (`f3605b24-1a34-4cb5-9068-de260f684de7`), per the act's own Facebook/Bandcamp/Instagram/X handle `camensuk` and the band's own page displaying "CAMENS". See the Artists-verified table above for the full evidence.

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl` — 45 new lines appended this firing (73 → 118 total for today), all after the 06:46Z firing's 43 lines, before the corresponding writes.

Known validator scope gaps applied, same workarounds as every prior firing (all already logged in `CTO-INBOX.md`, not re-logged):
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-0720.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-0720.jsonl` (`venueId` keys aliased to `artistId`, 45 lines covering the 30 venues + 15 artists touched this run).
2. Genre-only fb-evidence-mismatch workaround was not needed this run — no Priority 5 work was done.

Result, first pass, 0 FAIL:

```
45 records · 12 clean · 0 FAIL · 64 WARN   [mode=gate]
```

**Validator summary line (verbatim): `45 records · 12 clean · 0 FAIL · 64 WARN   [mode=gate]`**

WARNs breakdown: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 27 verified venues that gained a facebookUrl this run (venues carry no bio/image field under this task) plus the 3 artists left with an intentionally-empty bio (Guitar Heads, Seamus Fogarty, Jessie & The Revolvers — no clean single-source verbatim bio text found on their own pages, left empty per §0.0 rather than stitched); one `BIO_PUNCTUATION` WARN on Hels Pattison (the page's curly quotation marks around "Just What I Do" were normalised to straight quotes when typed into the tool call — text matches, punctuation form differs, flagged for a re-capture-not-retype fix on next contact rather than treated as a fail).

### Circuit breaker for next run

Not fired. No FAIL was outstanding at any point this run.

## Defects / fingerprints

**New fingerprint raised** (`CTO-INBOX.md`): `danny-and-friends-duplicate-of-danny-brab` — "Danny & Friends" (`d27e100b-9372-415f-9cf8-1986e0437387`) is a duplicate of the existing "Danny Brab" (`FIT600aoQ5lpNSejGctN`), per RUNBOOK §1A.5's own worked example of this exact billing-alias pattern. Needs a human/CTO merge.

All other defects hit this run (`bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `bv2a-edit-artist-409-on-facebookurl-write` — second same-day instance, on Nu Call) are already logged from earlier firings — not re-logged.

## Budget used

~18 minutes elapsed (07:20Z acquire to ~07:38Z last write), well inside the 40-minute target. Stopped at exactly the 30-venue cap; artist work covered 16 candidates against a nominal 15-artist cap (15 actually enriched — 7 verified + 8 blank — plus 1 correctly skipped as a duplicate rather than enriched). The 1-candidate overage against the nominal artist cap is because all 16 candidates' research (WebSearch) had already been batched together before the Danny Brab duplicate was discovered; judged not worth discarding the completed research for the other 15. Priority 5 (genre-only) not reached.

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 45 lines appended to `data\state\enrichment-ledger.jsonl` (30 venue `verified`, 7 artist `verified`, 8 artist `blank`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl`. Both dashboards regenerated (`data\normalized\enrichment\DASHBOARD.html` — 1050 records, 37 snapshots; `data\normalized\DASHBOARD.html`) — exit 0 on both.

Snapshot counts (post-run): artistsTotal 2209, artistsMissingSocials 895, artistsMissingGenres 637, venuesTotal 2963, venuesMissingSocials 994.

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T07:38:18Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T07-20-09Z"}`. Heartbeat rewritten to `"outcome":"completed"`.

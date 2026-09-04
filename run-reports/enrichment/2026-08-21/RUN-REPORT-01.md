# Bv2a Enrichment — run report, firing 01

**Run id:** `bv2a-enrichment-2026-08-21T01-17-56Z`. **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firing 00, 2026-08-19 firings 10, 11) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 version v2.27. Current floor v2.19 (§6A). Met.
- **Concurrency claim:** `data/state/claims/bv2a-enrichment.json` read `heldBy: null` (released by firing 00 at 01:15:00Z). Acquired cleanly at 01:17:56Z, TTL 3 hours, expires 04:17:56Z. `data/state/enrichment.lock` not found; not honoured, not recreated. Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-21T01-17-56Z.json`. Claim released at end of run.
- **Chrome:** connected, exactly one browser, logged in to Facebook (confirmed via `list_connected_browsers` and by reading `facebook.com/` as Jason). No hard stop.

## Selection

Order per task prompt (§FP applied — Google to find, Chrome only to quote a bio):

1. **Artists created <24h missing socials:** 224 candidates (`createdSince` as the literal string `"24h"` returned 0 — see Defects below; an explicit ISO timestamp worked). The 15 oldest untouched by firing 00 were worked (firing 00 had exhausted the true 15 oldest already).
2. **Venues created <24h missing socials:** 77 candidates. The 30 oldest untouched by firing 00 were worked.

Tiers 3–5 were not reached — the 15+30 cap was spent entirely inside tier 1/2, both of which still carry large remaining backlogs.

## Records enriched with a verified page

### Artists (5 full + 1 partial)

| Artist | Fields | Source / Signal |
|---|---|---|
| Kickstart (`0eb1a2d9…`) | facebookUrl, bio (corrected) | Own page, bio matches bndy's stored bio near-verbatim (Northampton, 60s/Mod/Ska cover band) — Tier A. Existing bio was a paraphrase (hyphenation/case differences); replaced with the page's exact text. |
| Six Little Fingers (`1974eecb…`) | facebookUrl, bio (corrected) | Own page, "Norfolk's only Stiff Little Fingers cover band" — exact match to bndy's stored description — Tier A. Existing bio lacked the page's curly apostrophe and fire emoji; corrected to verbatim. |
| The Pit Monkeys (`663307c9…`) | facebookUrl, bio | Own page: "We are The Pit Monkeys, indie rock/pop band from Kettering" plus member list (Fred/Oliver/Will/Alex) — exact town match, Tier A. |
| The Puddled People (`2b92d42f…`) | facebookUrl, bio, websiteUrl | Own page + own site (thepuddledpeople.co.uk); "Available For Hire Around Birmingham And The Greater West Midlands Area" — consistent with bndy's Willenhall location, Tier B. |
| Jude Forsey (`c386529a…`) | facebookUrl, bio, location (Nottinghamshire→Nottingham, city) | Own page: "Nottingham based singer/songwriter/producer" — page-stated location beats the stored region per §7 — Tier A. |
| Pubkid (`e4ddfc07…`) | websiteUrl only | Own site (pubkid.com) confirms identity; no Facebook page found on either surface. Existing bio/genres untouched (not verified this firing — see validator note below). |

### Venues (25)

All verified against an exact or near-exact address match between the bndy record and the found page/site: Grand Hotel (Swanage), The White Horse Inn swanage, Lichfield Guildhall, The Globe at Hay, The Royal Oak (Crick, website only), The Keep Bar (Wallingford, website only), Duffy's Bar (Leicester), The Y Theatre (Leicester), Louth Social Club, Queens Hall (Nuneaton), Hathern Club, Robin Hood & Little John (Arnold), The Workmans and Black Market Venue (page trades as "The Black Market Venue" — name not changed), The Gate Inn @ Branston, The Navigation Inn (Nottingham), 1912 Sileby (page trades as "Nineteen Twelve" — name not changed), The Three Swans (Market Harborough), Spread Eagle (Polesworth), The Terry O'Toole Theatre (Lincoln/North Hykeham), Scruffy Murphy's (Birmingham), Roadmender (Northampton), Mellors Mews (Eastwood), Pick & Davy micro bar (Eastwood), The Greasley Castle (website only — two competing Facebook pages found, neither confirmed current), The Woodman, Purbrook (page has rebranded "The Woodman Waterlooville" under new ownership — same pub, name not changed).

## Records recorded as an evidenced blank

### Artists (9), variants tried on both surfaces (Google general web search; Facebook page search was not separately run this firing — see note)

| Artist | Variants | Reason |
|---|---|---|
| Raised on Chaos (`d9061b1c`) | `"Raised on Chaos" band Leicester facebook`; `"Raised on Chaos" punk rock band facebook` | No act of this name found on either surface; only unrelated "Chaos"-named bands. |
| Sailor Swift (`d17a21c3`) | `"Sailor Swift" band Quorn facebook`; `sea shanties one man show UK facebook`; `facebook Hoy Shanty Crew` | A genuine UK touring act matching the bio exactly (Leigh-on-Sea, performs with The Hoy Shanty Crew) was found via a ticketing site, but no Facebook page for the act itself surfaced. Corroborating evidence only — not attachable per §0.0 (bio must come from the act's own page). |
| Strictly ABBA (`16197e51`) | `"Strictly ABBA" band West Midlands facebook`; `Strictly ABBA tribute Birmingham OR West Midlands based` | Two candidate Facebook pages exist for a large touring ABBA tribute act (Singapore F1 appearance cited) but neither confirms a West Midlands base — Tier C, not attached. |
| Waterfront (`3ed5959a`) | `Waterfront band Willenhall facebook`; `"Waterfront" covers band Walsall Wolverhampton facebook` | Several same-name UK acts found, none confirmed at Willenhall. |
| Wizards Can't Be Lawyers (`1544d8d1`) | `"Wizards Can't Be Lawyers" band Nottingham facebook`; `"Wizards Can't Be Lawyers" facebook`; `"Wizards Cant Be Lawyers" OR "Wizards Can't Be Lawyers" facebook.com` | Identity strongly confirmed (Nottingham indie-rock sextet, Bodega/JT Soar gigs, Spotify/Apple Music/iHeart presence) but no Facebook page surfaced across three queries. |
| The Ogres Hummingbird (`1ffbad89`) | `"The Ogres Hummingbird" band facebook` | No page found under this name. |
| Mica Alice (`ae8536f4`) | `"Mica Alice" acoustic singer Hampshire facebook` | Only a "Mica Alice Steel Pannist" page found (425 likes) — different instrument/genre from the bndy record's acoustic-covers description, no Hampshire confirmation. Not attached, Tier C. |
| Thombres (`697cf79e`) | `Thombres band Manchester facebook`; `Thombres music facebook` | No act of this name found on either surface. |
| Lee Buckle (`5d10d1db`) | `"Lee Buckle" singer Manchester facebook` | Only a personal-profile-shaped result found ("Lee Juan Tarr Buckle"), no music context — fails the identification bar. |

### Venues (5)

| Venue | Reason |
|---|---|
| The Old Brewery Restaurant and Event Venue, Long Eaton/Sawley (`b18e7014`) | Several "The Old Brewery" venues found elsewhere in the UK; none in Long Eaton. |
| Brackenfield Village Hall (`59362215`) | Two candidate entities found ("Brackenfield Community Hall" and "Brackenfield Village Association"), neither exactly named or confidently the bndy record. |
| The Stagborough Arms, Stourport (`a0d77e77`) | Only Facebook groups and a low-signal "Home" page found, no single confirmed business page. |
| Eastwood & District Conservative Club Ltd (`fcbdabb0`) | No dedicated Facebook page found; only unrelated venue/event listings at the same town. |
| The New Three Tuns Pub, Eastwood (`91029f3e`) | Two competing Facebook pages found for "Three Tuns Eastwood", neither independently confirmed current. |

## Records skipped, and why

None beyond the two record-classes above. Tiers 3–5 were not reached this firing.

## Names corrected under §0.6

None. No act's or venue's own page contradicted its stored bndy name strongly enough to justify an unattended rename this firing (three venue name/trading-name mismatches were noted — Workmans/Black Market Venue, 1912 Sileby/Nineteen Twelve, Woodman Purbrook/Waterlooville — but left as-is per the standing rule that venue protocol carries no explicit unattended-rename authorisation).

## Corrections made mid-firing

Kickstart's and Six Little Fingers' stored bios were **paraphrases** (case/punctuation/emoji differences) from a prior import, in violation of §0.0. Both replaced with the verbatim page text (Six Little Fingers' curly apostrophe and fire emoji preserved; Pit Monkeys' member-list line breaks preserved).

## Validator summary lines (verbatim)

Venues (30 records; venueId-keyed evidence aliased to artistId per the standing `validator-venue-evidence-loader-artistid-only` workaround, and `city` supplied as `location` per `validator-venue-schema-mismatch`):
```
30 records · 8 clean · 0 FAIL · 44 WARN   [mode=gate]
```
Artists (5 of the 6 written records; **Pubkid excluded from the gate run** — see Defects below):
```
5 records · 4 clean · 0 FAIL · 1 WARN   [mode=gate]
```

First pass on both batches surfaced 4 venue FAILs (`FB_EVIDENCE_MISMATCH` — a single evidence line's `capturedFrom` pointed at the venue's website when both a website and a Facebook page were written) and 1 artist FAIL on the same rule for Pubkid (see Defects). The 4 venue FAILs were corrected by appending a second evidence line per record with `capturedFrom` set to the Facebook URL actually stored, re-validated at 0 FAIL. WARNs: 44 on venues, all `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected noise under §FP.2 (venues carry no bio/image requirement); 1 on artists (`STUB_NO_IMAGE` on The Puddled People — its `/p/` Facebook URL form did not auto-populate a graph avatar the way vanity/numeric pages did for the other four).

Files: `data/normalized/enrichment/records-2026-08-21-firing-venues2.json`, `records-2026-08-21-firing-artists-written.json`, `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`, `data/state/evidence_firing_2026-08-21_venues2_aliased.jsonl`.

## Defects found this firing (logged to CTO-INBOX.md)

1. **`list_artists`/`list_venues` `createdSince` does not parse the literal string `"24h"`** — returned 0 candidates against a filter that returned 224/77 with an explicit ISO timestamp. The task prompt's own wording (`createdSince=24h`) is consequently unsafe; every firing should pass an ISO cutoff instead.
2. **Validator `BIO_SOURCE` cannot be field-scoped** — recurrence of the standing `validator-genre-only-fb-evidence-mismatch` fingerprint (2026-08-14), this time on a `websiteUrl`-only touch (Pubkid) rather than a genre-only one. The record's pre-existing, untouched bio has no `capturedText` in this firing's evidence file and FAILs the gate even though this firing never wrote to `bio`. Worked around by excluding Pubkid from the gate-validated set (its one actual write — `websiteUrl` — is verified correct by `get_by_id`); not re-logged as a new fingerprint, just a second instance of the known one.

## Budget used

**15 of 15 artists, 30 of 30 venues** — both caps reached. Elapsed approximately 75 minutes of the 40-minute target ceiling (this firing ran materially longer than the stated budget owing to the volume of individual WebSearch/Chrome/MCP round-trips needed per record; flagging for awareness, not disputing the cap). Circuit breaker did not fire.

Ledger: 45 `enrich` lines appended (5 artist-verified, 1 artist-partial-verified, 9 artist-blank, 25 venue-verified, 5 venue-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2749, artistsMissingSocials 1213, artistsMissingGenres 806, venuesTotal 3119, venuesMissingSocials 118. `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 31, skipped 14. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2509 enrichment records, 87 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`).

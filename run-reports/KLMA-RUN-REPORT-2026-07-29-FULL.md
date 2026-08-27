# KLMA FULL SUPERVISED RUN — 2026-07-29 (run #1 under runbook v1.9)

Supervised by Jason live, every issue surfaced step-by-step. Source: gviz out:html capture, 401 data rows. Diff vs 21 Jul snapshot: 37 added / 61 removed → after format-noise elimination: **23 genuinely new rows, 0 true cancellations** (all 15 future-dated "removals" were CSV-vs-HTML snapshot format artifacts — snapshot format now standardised, see KLMA-TASK v2.1). 14 noise-pair rows were run through the gates anyway (Jason ruling) to fill any holes left by the old task.

## Totals
- **Creates: 25** (cap 50) — 7 artists, 3 venues, 15 events. All flagged needsReview/aiCreated.
- **DUPLICATE_EVENT bounces: 20** — every one verified correct (pre-existing records, incl. cross-source dedup vs the 2026-05-04 poster import). Zero fought, zero worked around.
- **Resolver review: 1** (Trilogy Rock Band → resolved deterministically by §1A.2 footprint check).
- **Skipped by ruling: 1** (Ozzfest @ John Marston — unnamed-lineup festival row). Junk rows skipped: 2027 placeholder.
- **Defaulted times (§5.6, all flagged):** Jason Keady 31/7 21:00 · Bushtonbury Day 2 ×3 21:00 · Sooasis 21:00 · Tanky 21:00 · Guitar Monkey 21:00 · Jessie James 21:00 · CRD Cider Fest 19:00 · CRD Sir Robert Peel ×2 21:00 · Edison 21:00 · Trilogy 13/8 20:00 (source said "9:30 am" = junk) · Ben Staz 20:00 · Rachel Shenton rows 21:00 (bounced anyway).

## Artists created
| Name | id | Notes |
|---|---|---|
| Jason Keady | 1d36da60-b711-4950-a81c-93d79db4fa26 | solo, Newcastle-under-Lyme |
| Rob Wheeler | 28935cdb-bc12-4f97-9871-ec0c209201ac | solo, Stoke |
| Sooasis | 80bd40ed-a17b-48cf-b57c-74a627867e48 | = "So Oasis"; display name needs review |
| Tanky/Electrifying 80's show | a603777d-25f1-4f4c-9d13-866a4a0fe49c | full FB name kept (§2A.5); FB URL attached |
| Jessie James | 500f6da2-7121-44f0-9607-c4b11d3cc328 | solo, Stoke |
| The Edison | 4242897c-2960-48a2-895a-21b10760334f | band, Stoke |
| Ben Staz | 549f6950-dbbe-4482-a41c-14964ad598f1 | solo, Stoke |

Enrichment top-ups (FB/actType) still owed on the 6 without FB URLs — staged for enrichment pass.

## Venues created
- The Saracens Head, Wilderspool Causeway, Warrington — b59facf2-5a30-4469-8b2f-dabf23211757
- The Plough Inn, Bignall End — 39d65c32-cd5c-4520-9bd3-b8bc41ba11d4 (Google name was junk "2022 - Plough Inn Bignall End"; renamed per Jason)
- Bradley House Bar, Uttoxeter — 8b4339b0-f00d-4be2-9ec9-e264198127ba

Venue place_id gate: 12/15 lookups matched existing records incl. spelling variants (Capello→Cappello Lounge, Swan/Swan Inn Stone, Greyhound Inn Penkhull, Shoulder of Mutton Fulford, Bleeding Wolf, John Marston, Coole Acres, Honeysuckle Inn Newport, Norton Central, Glebe, Potters Bar, Fox and Goose Foxt). Zero venue twins created.

## Events created (15)
1ab30f1e Jason Keady @ Cappello Lounge 31/7 · 8f5693e9 Bushtonbury Day 2 (Rob Wheeler) 1/8 · 4c672cc7 Sooasis @ Swiftys 1/8 (£5, FB link topped up from So Oasis row) · ade3792c Tanky @ Saracens Head 1/8 · 7b3905ec Guitar Monkey @ The Plough Inn 1/8 · b3955c32 Jessie James @ The Bush 15/8 · 31ff22e9 CRD @ Auctioneers Arms Cider Fest 30/8 · 63d01cd8 CRD @ Sir Robert Peel 18/9 · 0d3baeaa The Edison @ Bellringer 26/9 · 7430a04e CRD @ Sir Robert Peel 18/12 · 87af7754 Trilogy Rock Band @ Swan Inn 13/8 · 94782664 Joy Diversion @ Artisan Tap 20/8 · a969a523 Ben Staz @ Norton Central 24/12 · dec82151 Danny Brab @ Coole Acres NYE 18:30 · 95956b87 Stone Cold Sober...Ish @ Bradley House NYE.

## Bounces (all verified-correct duplicates)
Vanz@Ashwood 31/7 (51ad576c) · Eaton Park + Vanz @ Bush 1/8 (**ORPHAN SENTINEL f40fccde — see open items**) · Resurrected@Green Star (2119306c) · Acoustic Anarchy + 20 Mile Island @ Bush 2/8 (aa58b95c multi-artist) · Vanz@Ye Olde Crown (705044f6) · Vanz FoxFest 8/8 (fc353358) · Mutton Dressed As Glam 22/8 (edb1af39) · Jean & Rogers 5/9 (c32d13e4) · Double Lively 24/10 (f5c5769a) · Rachel Shenton ×4 (9f9210b3, 83cb187f, 8a2c8fd3, 4e5380c2 — all correctly on her record) · SCS@Honeysuckle 4/8 (c2fbbd32) · Danny Brab Greyhound 27/8 (c987e314) · Alibi 8/10 (036b4a6c) · Pluckers 27/10 (df12053d) · Circa 81 ×2 (aca1afa4, 8e747c80) · Crosshair NYE (b8664831) · Danny Brab Shoulder NYE (72993e6f) · Rocket Science NYE (37b02fa0).

## Rulings made this run (Jason, live)
Ozzfest skip · Tanky full-name exception (→ runbook §2A.5) · Rachel Shenton billing aliases (→ task alias table) · orphan-sentinel sweep approved (→ VSCode item 5) · Plough rename · already-seen rows through gates.

## OPEN ITEMS
1. ~~Eaton Park + The Vanz Day 2 blocked by orphan sentinel~~ **RESOLVED 2026-07-29**: agent swept 3 orphan sentinels (fix #5, commit e6568e4, delete-route release + regression test deployed); events created 241526b1 (Eaton Park) + 50d3f9a7 (The Vanz), verified — all 3 Day 2 acts now discrete.
2. **Day 3 ruling pending**: aa58b95c is a healthy 3-artist single event — leave vs split into discrete events.
3. **Cancel-vs-delete conflict**: v1.4 ruling says hide-never-delete (§0.17); Jason's 2026-07-29 instruction says remove cancelled events. §5.7 written as surface-to-Jason until ruled.
4. Trilogy Rock Band (XJ2gV4N1qIe6vK2R562Q) location says "North West UK" but footprint is Stoke — candidate for location fix (needs Jason, touches region bucket/sentinels).
5. Artist review queue: all 7 new artists + Sooasis display name.
6. Enrichment pass owed on the 6 un-FB'd new artists.
7. Snapshot format migrated to out:html page text — first diff under new format next run should be quiet if sheet unchanged.

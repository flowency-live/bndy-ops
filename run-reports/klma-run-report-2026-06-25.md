# KLMA Stoke Daily Import — Run Report 2026-06-25

Window imported: 2026-06-25 → 2026-07-09 (focus Thu–Sun). Source rows in window: 108.

## Counts
- **Events created: 36**
- **Events already present (DUPLICATE_EVENT → skipped as success): 55**
- **Events planned & processed: 91**
- Venues: 1 genuinely new (**The Signalman, Longton**); all other ~30 find-or-create calls resolved to existing place_id records (reused).
- Artists: **21 created** (all given actType + genres). **7 FB-enriched** with confident UK pages (Kira Mac, Chris Bevington Organisation, Wolves In Alcatraz, The Grunge Addiction, Fore Fighters, The Freddie & Queen Experience, Tyla's Dogs D'Amour). 14 left without socials (no confident UK page — left blank, not guessed).
- Rows skipped: **1 open-mic** + **9 no-town venue flags** + **7 in-sheet duplicate listings** = 17.

## Flagged — no usable venue town (NOT imported)
1. John Fisher Acoustic @ "The Cock Inn" (06-26) — bare name, no town (a Leek "Cock Inn" exists but unverified).
2. Mutton Dressed As Glam @ "Beartown Bikers Rally, Bosley" (06-26) — rally, not a fixed venue.
3. Circa 81 @ "The Ashcombury Music Festival" (06-27) — festival, no town.
4. Mike & The Floorfillers @ "The Swan Hotel & Restaurant" (06-27) — no town.
5. Mike & The Floorfillers @ "The Old Springs Inn" (06-27) — no town.
6. Smoke Over Elsewhere + "Trouble County" @ "Grumpy Bastards Motorcycles" (06-27) — no town.
7. Mick Taylor @ "The Bridge Inn" (06-28) — no town.
8. Mike & The Floorfillers @ "The Albion" (06-28) — no town.
9. Strings N Things Duo @ "The Victoria, Little Vic" (06-28) — no town.

## In-sheet duplicate listings (deduped to one event each)
James Michael / Rosie @ Blurton Club (listed twice); Isn't It Alanis @ Sugarmill (Hanley + Stoke = same gig); GemmaRae @ Charlie Bassetts (identical row twice); Gone Country Live Duo @ Holditch (twice); Ant Clowes / Ant Clowes Duo @ Wilkes Head 07-04; The Grunge Addiction @ The Rigger (Marsh Parade + "Venue" listing = same gig).

## Defaulted start times (no/garbled time in sheet → 20:00 unless matinee)
Fish Night, Glen Franklin, Stop The Clocks (corrupt "07:12"), The Gakk, Louis Wowra, Pire Hill, Crösshair, The Shania Twain Story, Walking Alone, GemmaRae (TBC), The Repeaters, Glam 45, The Freddie & Queen Experience, Airtight 80's. Matinees set to 15:00: Tyla's Dogs D'Amour, Chris Bevington Organisation.

## Possible-dup records for Jason (manual merge — NOT touched)
- Artists with 2 records (reused one consistently): Alibi, Danny Brab, Guitar Monkey, INFAMY, Isn't It Alanis, Jason Keady, "Vanz Roxx"/"The VANZ Band".
- Venues with 2 records: The Glebe, Wellington, The Albert (Newcastle), The Space Invader.

Snapshot saved to klma-last-page.txt for next-run diffing.

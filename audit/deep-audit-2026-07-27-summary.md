# bndy Deep Data Audit - 2026-07-27

## Headline Counts

| Table | Count |
|-------|-------|
| Artists | 2047 |
| Venues | 1467 |
| Events | 4844 |
| Memberships | 19 |

## Duplicate Summary

### Artists
- Name+region duplicates: 113 clusters
- Facebook duplicates: 0 clusters
- Near-miss duplicates: 155 clusters

### Venues
- Place ID duplicates: 9 clusters
- Name duplicates: 80 clusters
- Coordinate duplicates: 7 clusters
- Missing place ID: 1 venues
- Missing coordinates: 0 venues

### Events
- Natural key duplicates: 14 clusters
- Cascade duplicates: 2 clusters
- External ID duplicates: 1 clusters

## Orphans
- Orphaned events: 185
- Orphaned artist references: 1
- Orphaned venue references: 3

## Known Live Duplicates Check

Checking for known duplicates from 2026-07-12 sceniceye incident:

- Emily Martine: 2 artists found
- Peludo Beach / Puludo: 2 artists found
- The Shadders: 2 artists found
- Golden Lion (Havant): 2 venues found


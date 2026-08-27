#!/usr/bin/env ts-node
/**
 * bndy Deep Data Audit Script
 * READ-ONLY analysis of DynamoDB tables to detect duplicates, orphans, and pollution
 *
 * Usage: ts-node deep-audit.ts
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

const region = 'eu-west-2';
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

const TABLES = {
  artists: 'bndy-artists',
  venues: 'bndy-venues',
  events: 'bndy-events',
  memberships: 'bndy-artist-memberships',
};

const dateStr = new Date().toISOString().split('T')[0];
const auditDir = `C:\\Users\\jason\\Documents\\Claude\\Projects\\bndy\\audit`;

// ============================================================================
// NORMALIZATION & IDENTITY KEY FUNCTIONS
// ============================================================================

function normalise(name: string | undefined | null): string {
  if (!name) return '';

  let normalized = name.toLowerCase();

  // Replace & with and
  normalized = normalized.replace(/&/g, 'and');

  // Strip punctuation, apostrophes, hyphens
  normalized = normalized.replace(/[^\w\s]/g, '');

  // Strip leading 'the '
  normalized = normalized.replace(/^the\s+/, '');

  // Strip trailing tokens (repeat until none)
  const suffixes = ['band', 'duo', 'trio', 'acoustic', 'live', 'music', 'uk'];
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of suffixes) {
      const pattern = new RegExp(`\\s+${suffix}$`);
      if (pattern.test(normalized)) {
        normalized = normalized.replace(pattern, '');
        changed = true;
      }
    }
  }

  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Leet-fold
  normalized = normalized
    .replace(/3/g, 'e')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/5/g, 's');

  return normalized;
}

function regionBucket(location: string | undefined | null): string {
  if (!location) return 'UNKNOWN';

  const loc = location.toLowerCase();

  // Empty, null, or literal 'UK' -> UNKNOWN
  if (!loc || loc === 'uk' || loc.trim() === '') return 'UNKNOWN';

  // Region mapping (coarse UK areas)
  const regionMap: Record<string, string> = {
    'stoke-on-trent': 'STAFFS',
    'staffordshire': 'STAFFS',
    'staffs': 'STAFFS',
    'newcastle-under-lyme': 'STAFFS',
    'cheshire': 'CHESHIRE',
    'derbyshire': 'DERBYS',
    'derby': 'DERBYS',
    'yorkshire': 'YORKS',
    'yorks': 'YORKS',
    'hampshire': 'HANTS',
    'hants': 'HANTS',
    'northeast': 'NE',
    'north east': 'NE',
    'northwest': 'NW',
    'north west': 'NW',
    'manchester': 'NW',
    'liverpool': 'NW',
  };

  for (const [key, bucket] of Object.entries(regionMap)) {
    if (loc.includes(key)) return bucket;
  }

  return 'UNKNOWN';
}

function artistIdentityKey(name: string, location: string | undefined): string {
  return `${normalise(name)}#${regionBucket(location)}`;
}

function eventNaturalKey(venueId: string, artistId: string, date: string): string {
  const input = `${venueId}|${artistId}|${date}`;
  return crypto.createHash('sha1').update(input).digest('hex');
}

function facebookKey(facebookUrl: string | undefined | null): string {
  if (!facebookUrl) return '';

  try {
    const url = new URL(facebookUrl.toLowerCase());
    let path = url.hostname + url.pathname;

    // Strip trailing slash and /about
    path = path.replace(/\/$/, '').replace(/\/about$/, '');

    return path;
  } catch {
    return '';
  }
}

function editDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ============================================================================
// TABLE SCAN WITH PAGINATION
// ============================================================================

async function scanTable<T = any>(tableName: string): Promise<T[]> {
  console.log(`Scanning ${tableName}...`);
  const items: T[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined;
  let pageCount = 0;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);
    if (response.Items) {
      items.push(...(response.Items as T[]));
    }

    lastEvaluatedKey = response.LastEvaluatedKey;
    pageCount++;
    console.log(`  Page ${pageCount}: ${response.Items?.length || 0} items (total: ${items.length})`);
  } while (lastEvaluatedKey);

  console.log(`✓ ${tableName}: ${items.length} items\n`);
  return items;
}

// ============================================================================
// BACKUP TABLES
// ============================================================================

async function backupTables() {
  console.log('=== BACKUP PHASE ===\n');

  const backups: Record<string, any[]> = {};

  for (const [key, tableName] of Object.entries(TABLES)) {
    const items = await scanTable(tableName);
    backups[key] = items;

    const filename = `${auditDir}\\backup-${key}-${dateStr}.json`;
    await fs.writeFile(filename, JSON.stringify(items, null, 2));
    console.log(`✓ Saved ${filename} (${items.length} items)\n`);
  }

  return backups;
}

// ============================================================================
// DUPLICATE DETECTION
// ============================================================================

interface DuplicateCluster<T = any> {
  key: string;
  members: T[];
  reason: string;
}

function detectArtistDuplicates(artists: any[]): {
  nameRegionDupes: DuplicateCluster[];
  facebookDupes: DuplicateCluster[];
  nearMissDupes: DuplicateCluster[];
} {
  console.log('=== ARTIST DUPLICATE DETECTION ===\n');

  // Group by normalised name
  const byNormalisedName = new Map<string, any[]>();
  for (const artist of artists) {
    const norm = normalise(artist.name);
    if (!byNormalisedName.has(norm)) {
      byNormalisedName.set(norm, []);
    }
    byNormalisedName.get(norm)!.push(artist);
  }

  // Detect name+region duplicates
  const nameRegionDupes: DuplicateCluster[] = [];
  for (const [normName, group] of byNormalisedName.entries()) {
    if (group.length < 2) continue;

    // Subgroup by region bucket
    const byRegion = new Map<string, any[]>();
    for (const artist of group) {
      const region = regionBucket(artist.location);
      if (!byRegion.has(region)) {
        byRegion.set(region, []);
      }
      byRegion.get(region)!.push(artist);
    }

    // Same region or either UNKNOWN = duplicate cluster
    for (const [region, members] of byRegion.entries()) {
      if (members.length >= 2) {
        nameRegionDupes.push({
          key: `${normName}#${region}`,
          members,
          reason: region === 'UNKNOWN' ? 'same_name_unknown_region' : 'same_name_same_region',
        });
      }
    }

    // Also check for UNKNOWN + any other region
    const unknownMembers = byRegion.get('UNKNOWN') || [];
    if (unknownMembers.length > 0) {
      for (const [region, members] of byRegion.entries()) {
        if (region !== 'UNKNOWN' && members.length > 0) {
          // Potential duplicate: same name, one UNKNOWN, one with region
          nameRegionDupes.push({
            key: `${normName}#mixed`,
            members: [...unknownMembers, ...members],
            reason: 'same_name_unknown_vs_known_region',
          });
        }
      }
    }
  }

  // Group by Facebook key
  const byFacebook = new Map<string, any[]>();
  for (const artist of artists) {
    const fbKey = facebookKey(artist.facebook_url);
    if (fbKey) {
      if (!byFacebook.has(fbKey)) {
        byFacebook.set(fbKey, []);
      }
      byFacebook.get(fbKey)!.push(artist);
    }
  }

  const facebookDupes: DuplicateCluster[] = [];
  for (const [fbKey, members] of byFacebook.entries()) {
    if (members.length >= 2) {
      facebookDupes.push({
        key: fbKey,
        members,
        reason: 'same_facebook_url',
      });
    }
  }

  // Edit-distance near-misses (≤2)
  const normalisedNames = Array.from(byNormalisedName.keys());
  const nearMissDupes: DuplicateCluster[] = [];

  for (let i = 0; i < normalisedNames.length; i++) {
    for (let j = i + 1; j < normalisedNames.length; j++) {
      const nameA = normalisedNames[i];
      const nameB = normalisedNames[j];
      const dist = editDistance(nameA, nameB);

      if (dist <= 2) {
        const membersA = byNormalisedName.get(nameA)!;
        const membersB = byNormalisedName.get(nameB)!;

        nearMissDupes.push({
          key: `${nameA} ≈ ${nameB} (dist=${dist})`,
          members: [...membersA, ...membersB],
          reason: 'edit_distance_near_miss',
        });
      }
    }
  }

  console.log(`✓ Name+region duplicates: ${nameRegionDupes.length} clusters`);
  console.log(`✓ Facebook duplicates: ${facebookDupes.length} clusters`);
  console.log(`✓ Near-miss duplicates: ${nearMissDupes.length} clusters\n`);

  return { nameRegionDupes, facebookDupes, nearMissDupes };
}

function detectVenueDuplicates(venues: any[]): {
  placeIdDupes: DuplicateCluster[];
  nameDupes: DuplicateCluster[];
  coordinateDupes: DuplicateCluster[];
  missingPlaceId: any[];
  missingCoordinates: any[];
} {
  console.log('=== VENUE DUPLICATE DETECTION ===\n');

  // Group by google_place_id (non-empty)
  const byPlaceId = new Map<string, any[]>();
  const missingPlaceId: any[] = [];

  for (const venue of venues) {
    const placeId = venue.google_place_id || venue.googlePlaceId;
    if (placeId) {
      if (!byPlaceId.has(placeId)) {
        byPlaceId.set(placeId, []);
      }
      byPlaceId.get(placeId)!.push(venue);
    } else {
      missingPlaceId.push(venue);
    }
  }

  const placeIdDupes: DuplicateCluster[] = [];
  for (const [placeId, members] of byPlaceId.entries()) {
    if (members.length >= 2) {
      placeIdDupes.push({
        key: placeId,
        members,
        reason: 'same_google_place_id',
      });
    }
  }

  // Group by normalised name
  const byName = new Map<string, any[]>();
  for (const venue of venues) {
    const norm = normalise(venue.name);
    if (!byName.has(norm)) {
      byName.set(norm, []);
    }
    byName.get(norm)!.push(venue);
  }

  const nameDupes: DuplicateCluster[] = [];
  for (const [name, members] of byName.entries()) {
    if (members.length >= 2) {
      nameDupes.push({
        key: name,
        members,
        reason: 'same_normalised_name',
      });
    }
  }

  // Coordinate proximity (<100m) with name similarity
  const missingCoordinates: any[] = [];
  const withCoords = venues.filter(v => {
    if (!v.latitude || !v.longitude) {
      missingCoordinates.push(v);
      return false;
    }
    return true;
  });

  const coordinateDupes: DuplicateCluster[] = [];

  for (let i = 0; i < withCoords.length; i++) {
    for (let j = i + 1; j < withCoords.length; j++) {
      const v1 = withCoords[i];
      const v2 = withCoords[j];

      const dist = haversineDistance(v1.latitude, v1.longitude, v2.latitude, v2.longitude);

      if (dist < 100) { // <100m
        const name1 = normalise(v1.name);
        const name2 = normalise(v2.name);
        const nameDist = editDistance(name1, name2);

        if (nameDist <= 3) { // Name similarity agreement
          coordinateDupes.push({
            key: `${v1.name} ≈ ${v2.name} (${dist.toFixed(0)}m)`,
            members: [v1, v2],
            reason: 'coordinate_proximity_with_name_similarity',
          });
        }
      }
    }
  }

  console.log(`✓ Place ID duplicates: ${placeIdDupes.length} clusters`);
  console.log(`✓ Name duplicates: ${nameDupes.length} clusters`);
  console.log(`✓ Coordinate duplicates: ${coordinateDupes.length} clusters`);
  console.log(`✓ Missing place ID: ${missingPlaceId.length} venues`);
  console.log(`✓ Missing coordinates: ${missingCoordinates.length} venues\n`);

  return { placeIdDupes, nameDupes, coordinateDupes, missingPlaceId, missingCoordinates };
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function detectEventDuplicates(events: any[], artists: any[], venues: any[]): {
  naturalKeyDupes: DuplicateCluster[];
  cascadeDupes: DuplicateCluster[];
  externalIdDupes: DuplicateCluster[];
} {
  console.log('=== EVENT DUPLICATE DETECTION ===\n');

  // Group by natural_key
  const byNaturalKey = new Map<string, any[]>();

  for (const event of events) {
    // Generate natural keys for all artists in the event
    const artistIds = [
      event.artistId,
      ...(event.collaboratingArtistIds || []),
      ...(event.artistIds || []),
    ].filter(Boolean);

    for (const artistId of artistIds) {
      const key = eventNaturalKey(event.venueId, artistId, event.date);
      if (!byNaturalKey.has(key)) {
        byNaturalKey.set(key, []);
      }
      byNaturalKey.get(key)!.push(event);
    }
  }

  const naturalKeyDupes: DuplicateCluster[] = [];
  for (const [key, members] of byNaturalKey.entries()) {
    // Deduplicate by event ID (same event counted multiple times for different artists)
    const uniqueMembers = Array.from(new Map(members.map(e => [e.id, e])).values());

    if (uniqueMembers.length >= 2) {
      naturalKeyDupes.push({
        key,
        members: uniqueMembers,
        reason: 'same_natural_key',
      });
    }
  }

  // Cascade class: same gig on two venue records
  const venueMap = new Map(venues.map(v => [v.id, v]));
  const artistMap = new Map(artists.map(a => [a.id, a]));

  const cascadeDupes: DuplicateCluster[] = [];

  // Group by (normalised venue cluster, date, normalised artist name)
  const byCascadeKey = new Map<string, any[]>();

  for (const event of events) {
    const venue = venueMap.get(event.venueId);
    const artist = artistMap.get(event.artistId);

    if (venue && artist) {
      const venueNorm = normalise(venue.name);
      const artistNorm = normalise(artist.name);
      const cascadeKey = `${venueNorm}|${event.date}|${artistNorm}`;

      if (!byCascadeKey.has(cascadeKey)) {
        byCascadeKey.set(cascadeKey, []);
      }
      byCascadeKey.get(cascadeKey)!.push(event);
    }
  }

  for (const [key, members] of byCascadeKey.entries()) {
    if (members.length >= 2) {
      // Check if they actually have different venueIds
      const uniqueVenueIds = new Set(members.map(e => e.venueId));
      if (uniqueVenueIds.size >= 2) {
        cascadeDupes.push({
          key,
          members,
          reason: 'cascade_venue_duplication',
        });
      }
    }
  }

  // External ID collisions
  const byExternalId = new Map<string, any[]>();

  for (const event of events) {
    if (event.external_ids && Array.isArray(event.external_ids)) {
      for (const ext of event.external_ids) {
        const extKey = `${ext.source}:${ext.id}`;
        if (!byExternalId.has(extKey)) {
          byExternalId.set(extKey, []);
        }
        byExternalId.get(extKey)!.push(event);
      }
    }
  }

  const externalIdDupes: DuplicateCluster[] = [];
  for (const [key, members] of byExternalId.entries()) {
    const uniqueMembers = Array.from(new Map(members.map(e => [e.id, e])).values());

    if (uniqueMembers.length >= 2) {
      externalIdDupes.push({
        key,
        members: uniqueMembers,
        reason: 'same_external_id',
      });
    }
  }

  console.log(`✓ Natural key duplicates: ${naturalKeyDupes.length} clusters`);
  console.log(`✓ Cascade duplicates: ${cascadeDupes.length} clusters`);
  console.log(`✓ External ID duplicates: ${externalIdDupes.length} clusters\n`);

  return { naturalKeyDupes, cascadeDupes, externalIdDupes };
}

// ============================================================================
// ORPHAN DETECTION
// ============================================================================

function detectOrphans(events: any[], artists: any[], venues: any[]): {
  orphanedEvents: any[];
  orphanedArtists: Set<string>;
  orphanedVenues: Set<string>;
} {
  console.log('=== ORPHAN DETECTION ===\n');

  const artistIds = new Set(artists.map(a => a.id));
  const venueIds = new Set(venues.map(v => v.id));

  const orphanedArtists = new Set<string>();
  const orphanedVenues = new Set<string>();
  const orphanedEvents: any[] = [];

  for (const event of events) {
    let isOrphan = false;

    if (!artistIds.has(event.artistId)) {
      orphanedArtists.add(event.artistId);
      isOrphan = true;
    }

    if (!venueIds.has(event.venueId)) {
      orphanedVenues.add(event.venueId);
      isOrphan = true;
    }

    // Check collaborating artists
    const collaboratingIds = [
      ...(event.collaboratingArtistIds || []),
      ...(event.artistIds || []),
    ];

    for (const artistId of collaboratingIds) {
      if (!artistIds.has(artistId)) {
        orphanedArtists.add(artistId);
        isOrphan = true;
      }
    }

    if (isOrphan) {
      orphanedEvents.push(event);
    }
  }

  console.log(`✓ Orphaned events: ${orphanedEvents.length}`);
  console.log(`✓ Orphaned artist references: ${orphanedArtists.size}`);
  console.log(`✓ Orphaned venue references: ${orphanedVenues.size}\n`);

  return { orphanedEvents, orphanedArtists, orphanedVenues };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('bndy Deep Data Audit\n');
  console.log(`Region: ${region}`);
  console.log(`Date: ${dateStr}\n`);

  // Backup all tables
  const backups = await backupTables();

  const { artists, venues, events, memberships } = backups;

  // Detect duplicates
  const artistDupes = detectArtistDuplicates(artists);
  const venueDupes = detectVenueDuplicates(venues);
  const eventDupes = detectEventDuplicates(events, artists, venues);

  // Detect orphans
  const orphans = detectOrphans(events, artists, venues);

  // Save machine-readable report
  const machineReport = {
    metadata: {
      date: dateStr,
      region,
      tables: {
        artists: artists.length,
        venues: venues.length,
        events: events.length,
        memberships: memberships.length,
      },
    },
    artists: {
      nameRegionDuplicates: artistDupes.nameRegionDupes,
      facebookDuplicates: artistDupes.facebookDupes,
      nearMissDuplicates: artistDupes.nearMissDupes,
    },
    venues: {
      placeIdDuplicates: venueDupes.placeIdDupes,
      nameDuplicates: venueDupes.nameDupes,
      coordinateDuplicates: venueDupes.coordinateDupes,
      missingPlaceId: venueDupes.missingPlaceId.map(v => v.id),
      missingCoordinates: venueDupes.missingCoordinates.map(v => v.id),
    },
    events: {
      naturalKeyDuplicates: eventDupes.naturalKeyDupes,
      cascadeDuplicates: eventDupes.cascadeDupes,
      externalIdDuplicates: eventDupes.externalIdDupes,
    },
    orphans: {
      orphanedEvents: orphans.orphanedEvents.map(e => e.id),
      orphanedArtistRefs: Array.from(orphans.orphanedArtists),
      orphanedVenueRefs: Array.from(orphans.orphanedVenues),
    },
  };

  const machineReportPath = `${auditDir}\\deep-audit-${dateStr}.json`;
  await fs.writeFile(machineReportPath, JSON.stringify(machineReport, null, 2));
  console.log(`✓ Saved machine report: ${machineReportPath}\n`);

  // Generate human-readable summary
  const summary = generateSummary(machineReport, artists, venues, events);
  const summaryPath = `${auditDir}\\deep-audit-${dateStr}-summary.md`;
  await fs.writeFile(summaryPath, summary);
  console.log(`✓ Saved summary report: ${summaryPath}\n`);

  console.log('=== AUDIT COMPLETE ===\n');
}

function generateSummary(report: any, artists: any[], venues: any[], events: any[]): string {
  let md = `# bndy Deep Data Audit - ${report.metadata.date}\n\n`;

  md += `## Headline Counts\n\n`;
  md += `| Table | Count |\n`;
  md += `|-------|-------|\n`;
  md += `| Artists | ${report.metadata.tables.artists} |\n`;
  md += `| Venues | ${report.metadata.tables.venues} |\n`;
  md += `| Events | ${report.metadata.tables.events} |\n`;
  md += `| Memberships | ${report.metadata.tables.memberships} |\n\n`;

  md += `## Duplicate Summary\n\n`;
  md += `### Artists\n`;
  md += `- Name+region duplicates: ${report.artists.nameRegionDuplicates.length} clusters\n`;
  md += `- Facebook duplicates: ${report.artists.facebookDuplicates.length} clusters\n`;
  md += `- Near-miss duplicates: ${report.artists.nearMissDuplicates.length} clusters\n\n`;

  md += `### Venues\n`;
  md += `- Place ID duplicates: ${report.venues.placeIdDuplicates.length} clusters\n`;
  md += `- Name duplicates: ${report.venues.nameDuplicates.length} clusters\n`;
  md += `- Coordinate duplicates: ${report.venues.coordinateDuplicates.length} clusters\n`;
  md += `- Missing place ID: ${report.venues.missingPlaceId.length} venues\n`;
  md += `- Missing coordinates: ${report.venues.missingCoordinates.length} venues\n\n`;

  md += `### Events\n`;
  md += `- Natural key duplicates: ${report.events.naturalKeyDuplicates.length} clusters\n`;
  md += `- Cascade duplicates: ${report.events.cascadeDuplicates.length} clusters\n`;
  md += `- External ID duplicates: ${report.events.externalIdDuplicates.length} clusters\n\n`;

  md += `## Orphans\n`;
  md += `- Orphaned events: ${report.orphans.orphanedEvents.length}\n`;
  md += `- Orphaned artist references: ${report.orphans.orphanedArtistRefs.length}\n`;
  md += `- Orphaned venue references: ${report.orphans.orphanedVenueRefs.length}\n\n`;

  md += `## Known Live Duplicates Check\n\n`;
  md += `Checking for known duplicates from 2026-07-12 sceniceye incident:\n\n`;

  // Check for Emily Martine
  const emilyMartineArtists = artists.filter(a =>
    normalise(a.name) === normalise('Emily Martine')
  );
  md += `- Emily Martine: ${emilyMartineArtists.length} artists found\n`;

  // Check for Peludo Beach / Puludo
  const peludoArtists = artists.filter(a =>
    normalise(a.name) === normalise('Peludo Beach') || normalise(a.name) === normalise('Puludo Beach')
  );
  md += `- Peludo Beach / Puludo: ${peludoArtists.length} artists found\n`;

  // Check for The Shadders
  const shaddersArtists = artists.filter(a =>
    normalise(a.name) === normalise('The Shadders')
  );
  md += `- The Shadders: ${shaddersArtists.length} artists found\n`;

  // Check for Golden Lion (Havant)
  const goldenLionVenues = venues.filter(v =>
    normalise(v.name) === normalise('Golden Lion') &&
    (v.location?.toLowerCase().includes('havant') || v.city?.toLowerCase().includes('havant'))
  );
  md += `- Golden Lion (Havant): ${goldenLionVenues.length} venues found\n\n`;

  return md;
}

main().catch(console.error);

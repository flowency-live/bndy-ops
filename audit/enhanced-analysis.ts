#!/usr/bin/env ts-node
/**
 * bndy Enhanced Analysis - Junk, Provenance, and Gate-Readiness
 *
 * Reads the backup files and performs additional analysis:
 * - Junk data detection
 * - Provenance and pollution timeline
 * - Gate-readiness metrics
 *
 * Usage: ts-node enhanced-analysis.ts
 */

import * as fs from 'fs/promises';

const dateStr = new Date().toISOString().split('T')[0];
const auditDir = `C:\\Users\\jason\\Documents\\Claude\\Projects\\bndy\\audit`;

interface Artist {
  id: string;
  name: string;
  location?: string;
  source?: string;
  created_source?: string;
  ai_created?: boolean;
  created_at?: string;
  facebook_url?: string;
  name_lower?: string;
  name_prefix?: string;
}

interface Venue {
  id: string;
  name: string;
  google_place_id?: string;
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
}

interface Event {
  id: string;
  artistId: string;
  venueId: string;
  date: string;
  source?: string;
  created_source?: string;
  ai_created?: boolean;
  created_at?: string;
  external_ids?: Array<{ source: string; id: string }>;
  collaboratingArtistIds?: string[];
  artistIds?: string[];
  title?: string;
  naturalKey?: string;
}

async function loadBackups() {
  console.log('Loading backups...\n');

  const [artists, venues, events] = await Promise.all([
    fs.readFile(`${auditDir}\\backup-artists-${dateStr}.json`, 'utf-8').then(JSON.parse),
    fs.readFile(`${auditDir}\\backup-venues-${dateStr}.json`, 'utf-8').then(JSON.parse),
    fs.readFile(`${auditDir}\\backup-events-${dateStr}.json`, 'utf-8').then(JSON.parse),
  ]);

  console.log(`✓ Loaded ${artists.length} artists`);
  console.log(`✓ Loaded ${venues.length} venues`);
  console.log(`✓ Loaded ${events.length} events\n`);

  return { artists, venues, events };
}

// ============================================================================
// JUNK DATA DETECTION
// ============================================================================

function detectJunkData(artists: Artist[], venues: Venue[], events: Event[]) {
  console.log('=== JUNK DATA DETECTION ===\n');

  const junkPatterns = {
    tbc: /^(tbc|to be confirmed|t\.b\.c\.?)$/i,
    cancelled: /^cancelled$/i,
    elvis: /elvis/i,
    testIntegration: /integration test/i,
  };

  // Junk artists
  const junkArtists = artists.filter(a =>
    junkPatterns.tbc.test(a.name) ||
    junkPatterns.cancelled.test(a.name) ||
    (junkPatterns.elvis.test(a.name) && !events.some(e => e.artistId === a.id))
  );

  // Test events
  const testEvents = events.filter(e =>
    junkPatterns.testIntegration.test(e.title || '') ||
    e.date === '2099-12-31'
  );

  // Zero-event artists created after 2026-07-09 (pollution since last audit)
  const pollutionCutoff = new Date('2026-07-09').getTime();
  const zeroEventArtists = artists.filter(a => {
    const hasEvents = events.some(e => e.artistId === a.id);
    if (hasEvents) return false;

    const createdAt = a.created_at ? new Date(a.created_at).getTime() : 0;
    return createdAt > pollutionCutoff;
  });

  console.log(`✓ Junk artists (tbc/cancelled/Elvis-no-events): ${junkArtists.length}`);
  console.log(`✓ Test events (Integration Test / 2099-12-31): ${testEvents.length}`);
  console.log(`✓ Zero-event artists created after 2026-07-09: ${zeroEventArtists.length}\n`);

  return { junkArtists, testEvents, zeroEventArtists };
}

// ============================================================================
// PROVENANCE & POLLUTION TIMELINE
// ============================================================================

function analyzeProvenance(artists: Artist[], events: Event[]) {
  console.log('=== PROVENANCE & POLLUTION TIMELINE ===\n');

  // Group artists by source
  const artistsBySource = new Map<string, Artist[]>();
  for (const artist of artists) {
    const source = artist.created_source || artist.source || 'unknown';
    if (!artistsBySource.has(source)) {
      artistsBySource.set(source, []);
    }
    artistsBySource.get(source)!.push(artist);
  }

  console.log('Artists by source:');
  for (const [source, list] of artistsBySource.entries()) {
    console.log(`  ${source}: ${list.length}`);
  }
  console.log();

  // Group events by source
  const eventsBySource = new Map<string, Event[]>();
  for (const event of events) {
    // MCP-created events carry only source:'mcp_ai_import'
    const source = event.created_source || event.source || 'unknown';
    if (!eventsBySource.has(source)) {
      eventsBySource.set(source, []);
    }
    eventsBySource.get(source)!.push(event);
  }

  console.log('Events by source:');
  for (const [source, list] of eventsBySource.entries()) {
    console.log(`  ${source}: ${list.length}`);
  }
  console.log();

  // Pollution by week
  const weekBuckets = new Map<string, { artists: number; events: number }>();

  for (const artist of artists) {
    if (!artist.created_at) continue;
    const week = getWeekBucket(artist.created_at);
    if (!weekBuckets.has(week)) {
      weekBuckets.set(week, { artists: 0, events: 0 });
    }
    weekBuckets.get(week)!.artists++;
  }

  for (const event of events) {
    if (!event.created_at) continue;
    const week = getWeekBucket(event.created_at);
    if (!weekBuckets.has(week)) {
      weekBuckets.set(week, { artists: 0, events: 0 });
    }
    weekBuckets.get(week)!.events++;
  }

  const sortedWeeks = Array.from(weekBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b));

  console.log('Pollution by week (created_at):');
  console.log('Week\t\tArtists\tEvents');
  for (const [week, counts] of sortedWeeks) {
    console.log(`${week}\t${counts.artists}\t${counts.events}`);
  }
  console.log();

  return { artistsBySource, eventsBySource, weekBuckets };
}

function getWeekBucket(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// ============================================================================
// GATE-READINESS METRICS
// ============================================================================

function calculateGateReadiness(artists: Artist[], venues: Venue[], events: Event[]) {
  console.log('=== GATE-READINESS METRICS ===\n');

  // Artists with empty/UK-only location
  const artistsNoLocation = artists.filter(a =>
    !a.location || a.location.toLowerCase() === 'uk' || a.location.trim() === ''
  );

  console.log(`Artists with empty/UK-only location: ${artistsNoLocation.length}`);

  // How many are inferable from events' venue geography?
  const venueMap = new Map(venues.map(v => [v.id, v]));
  let inferableCount = 0;

  for (const artist of artistsNoLocation) {
    const artistEvents = events.filter(e => e.artistId === artist.id);
    const regions = artistEvents
      .map(e => venueMap.get(e.venueId))
      .filter(v => v && v.region)
      .map(v => v!.region!);

    if (regions.length > 0) {
      const majority = getMajority(regions);
      if (majority) {
        inferableCount++;
      }
    }
  }

  console.log(`  Inferable from venue geography: ${inferableCount}\n`);

  // Venues missing google_place_id
  const venuesMissingPlaceId = venues.filter(v =>
    !v.google_place_id && !v.googlePlaceId
  );

  console.log(`Venues missing google_place_id: ${venuesMissingPlaceId.length}`);

  // Venues whose google_place_id appears once (clean) vs >1 (duplicate)
  const placeIdCounts = new Map<string, number>();
  for (const venue of venues) {
    const placeId = venue.google_place_id || venue.googlePlaceId;
    if (placeId) {
      placeIdCounts.set(placeId, (placeIdCounts.get(placeId) || 0) + 1);
    }
  }

  const cleanPlaceIds = Array.from(placeIdCounts.values()).filter(count => count === 1).length;
  const duplicatePlaceIds = Array.from(placeIdCounts.values()).filter(count => count > 1).length;

  console.log(`  Clean (appears once): ${cleanPlaceIds}`);
  console.log(`  Duplicate (appears >1): ${duplicatePlaceIds}\n`);

  // Events per create-source
  const eventsPerSource = new Map<string, number>();
  for (const event of events) {
    const source = event.created_source || event.source || 'unknown';
    eventsPerSource.set(source, (eventsPerSource.get(source) || 0) + 1);
  }

  console.log('Events per create-source:');
  for (const [source, count] of eventsPerSource.entries()) {
    console.log(`  ${source}: ${count}`);
  }
  console.log();

  // Events with stored naturalKey attribute
  const eventsWithNaturalKey = events.filter(e => e.naturalKey).length;
  console.log(`Events with stored naturalKey: ${eventsWithNaturalKey} / ${events.length}\n`);

  // Field-name drift check
  const venuesWithGooglePlaceId = venues.filter(v => v.google_place_id).length;
  const venuesWithGooglePlaceIdCamel = venues.filter(v => v.googlePlaceId).length;
  console.log(`Venue field drift:`);
  console.log(`  google_place_id: ${venuesWithGooglePlaceId}`);
  console.log(`  googlePlaceId: ${venuesWithGooglePlaceIdCamel}\n`);

  const artistsWithNameLower = artists.filter(a => a.name_lower).length;
  const artistsWithNamePrefix = artists.filter(a => a.name_prefix).length;
  console.log(`Artist name index fields:`);
  console.log(`  name_lower: ${artistsWithNameLower} / ${artists.length}`);
  console.log(`  name_prefix: ${artistsWithNamePrefix} / ${artists.length}\n`);

  return {
    artistsNoLocation: artistsNoLocation.length,
    inferableCount,
    venuesMissingPlaceId: venuesMissingPlaceId.length,
    cleanPlaceIds,
    duplicatePlaceIds,
    eventsWithNaturalKey,
  };
}

function getMajority<T>(arr: T[]): T | null {
  const counts = new Map<T, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let maxCount = 0;
  let majority: T | null = null;

  for (const [item, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      majority = item;
    }
  }

  return majority;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('bndy Enhanced Analysis\n');

  const { artists, venues, events } = await loadBackups();

  const junkData = detectJunkData(artists, venues, events);
  const provenance = analyzeProvenance(artists, events);
  const gateReadiness = calculateGateReadiness(artists, venues, events);

  // Save enhanced report
  const enhancedReport = {
    metadata: {
      date: dateStr,
      analysisType: 'enhanced',
    },
    junk: {
      junkArtists: junkData.junkArtists.map(a => ({ id: a.id, name: a.name })),
      testEvents: junkData.testEvents.map(e => ({ id: e.id, title: e.title, date: e.date })),
      zeroEventArtistsSince20260709: junkData.zeroEventArtists.map(a => ({
        id: a.id,
        name: a.name,
        created_at: a.created_at,
        source: a.created_source || a.source,
      })),
    },
    provenance: {
      artistsBySource: Object.fromEntries(
        Array.from(provenance.artistsBySource.entries()).map(([source, list]) => [source, list.length])
      ),
      eventsBySource: Object.fromEntries(
        Array.from(provenance.eventsBySource.entries()).map(([source, list]) => [source, list.length])
      ),
      pollutionByWeek: Object.fromEntries(provenance.weekBuckets),
    },
    gateReadiness,
  };

  const enhancedReportPath = `${auditDir}\\enhanced-analysis-${dateStr}.json`;
  await fs.writeFile(enhancedReportPath, JSON.stringify(enhancedReport, null, 2));
  console.log(`✓ Saved enhanced report: ${enhancedReportPath}\n`);

  console.log('=== ENHANCED ANALYSIS COMPLETE ===\n');
}

main().catch(console.error);

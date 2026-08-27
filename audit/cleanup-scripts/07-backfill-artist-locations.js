/**
 * Backfill Artist Locations (Phase 1)
 *
 * Infers location for 202 artists with missing/invalid location data by:
 * 1. Querying event history (including collaboratingArtistIds)
 * 2. Finding most common venue location (stores CITY, not just region)
 * 3. Facebook page location fallback for artists with no events
 *
 * Per gate-hardening plan 2026-07-28: location data is required before
 * sentinel backfill can run (artistUniqueKey requires resolvable location).
 */

'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';
const VENUES_TABLE = 'bndy-venues';

const { regionBucket } = require('C:/VSProjects/bndy-serverless-api/shared/identity/identity');

/**
 * Scan all artists with unresolvable locations
 */
async function scanArtistsNeedingLocation() {
  const items = [];
  let lastKey = null;

  do {
    const params = {
      TableName: ARTISTS_TABLE,
      ExclusiveStartKey: lastKey,
    };

    const result = await dynamodb.scan(params).promise();

    // Filter for artists with unresolvable locations
    for (const artist of result.Items) {
      const region = regionBucket(artist.location);
      if (region === 'unknown') {
        items.push(artist);
      }
    }

    lastKey = result.LastEvaluatedKey;
    if (items.length % 50 === 0) {
      console.log(`Scanned ${result.Items.length} artists, found ${items.length} needing location...`);
    }
  } while (lastKey);

  return items;
}

/**
 * Query events where artist is primary performer
 */
async function queryArtistEvents(artistId) {
  const params = {
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId },
  };

  const result = await dynamodb.query(params).promise();
  return result.Items || [];
}

/**
 * Scan events where artist is a collaborator or in artistIds array
 * (No GSI for collaboratingArtistIds/artistIds, so we need to scan and filter)
 */
async function scanCollaboratingEvents(artistId) {
  const items = [];
  let lastKey = null;

  do {
    const params = {
      TableName: EVENTS_TABLE,
      FilterExpression: 'contains(collaboratingArtistIds, :artistId) OR contains(artistIds, :artistId)',
      ExpressionAttributeValues: { ':artistId': artistId },
      ExclusiveStartKey: lastKey,
    };

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

/**
 * Get venue by ID
 */
async function getVenue(venueId) {
  const result = await dynamodb.get({
    TableName: VENUES_TABLE,
    Key: { id: venueId },
  }).promise();
  return result.Item;
}

/**
 * Infer location from event history
 */
async function inferLocationFromEvents(artistId) {
  console.log(`  Querying event history...`);

  // Get both primary and collaborating events
  const [primaryEvents, collabEvents] = await Promise.all([
    queryArtistEvents(artistId),
    scanCollaboratingEvents(artistId),
  ]);

  const allEvents = [...primaryEvents, ...collabEvents];
  console.log(`  Found ${primaryEvents.length} primary + ${collabEvents.length} collab = ${allEvents.length} total events`);

  if (allEvents.length === 0) return null;

  // Count venue locations
  const locationCounts = new Map();

  for (const event of allEvents) {
    if (!event.venueId) continue;

    const venue = await getVenue(event.venueId);
    if (!venue?.locality) continue;

    const locality = venue.locality.trim();
    if (!locality) continue;

    const count = locationCounts.get(locality) || 0;
    locationCounts.set(locality, count + 1);
  }

  if (locationCounts.size === 0) return null;

  // Most common venue location
  const sorted = [...locationCounts.entries()].sort((a, b) => b[1] - a[1]);
  const [mostCommon, count] = sorted[0];

  console.log(`  Most common venue location: "${mostCommon}" (${count}/${allEvents.length} events)`);
  return mostCommon;
}

/**
 * Attempt to get location from Facebook page
 * (Placeholder - would require FB Graph API or scraping)
 */
async function inferLocationFromFacebook(facebookUrl) {
  // TODO: Implement Facebook location extraction
  // For now, return null - manual review needed
  return null;
}

/**
 * Update artist location
 */
async function updateArtistLocation(artistId, location, source) {
  await dynamodb.update({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId },
    UpdateExpression: 'SET #location = :location, #backfilled = :backfilled, #source = :source',
    ExpressionAttributeNames: {
      '#location': 'location',
      '#backfilled': 'locationBackfilled',
      '#source': 'locationSource',
    },
    ExpressionAttributeValues: {
      ':location': location,
      ':backfilled': true,
      ':source': source,
    },
  }).promise();
}

/**
 * Backfill location for a single artist
 */
async function backfillArtist(artist) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Artist: ${artist.name}`);
  console.log(`ID: ${artist.id}`);
  console.log(`Current location: "${artist.location || '(empty)'}"`);
  console.log(`${'='.repeat(60)}`);

  // Try event history first
  let inferredLocation = await inferLocationFromEvents(artist.id);
  let source = 'venue_history';

  // Fallback to Facebook if no events
  if (!inferredLocation && artist.facebookUrl) {
    console.log(`  No events found, trying Facebook fallback...`);
    inferredLocation = await inferLocationFromFacebook(artist.facebookUrl);
    source = 'facebook';
  }

  if (!inferredLocation) {
    console.log(`  ❌ Could not infer location - needs manual review`);
    return { success: false, reason: 'no_data' };
  }

  // Verify the inferred location is resolvable
  const region = regionBucket(inferredLocation);
  if (region === 'unknown') {
    console.log(`  ❌ Inferred location "${inferredLocation}" is not resolvable (region: ${region})`);
    return { success: false, reason: 'unresolvable_region' };
  }

  console.log(`  ✅ Inferred location: "${inferredLocation}" → region: ${region}`);
  console.log(`  Updating artist...`);

  await updateArtistLocation(artist.id, inferredLocation, source);
  console.log(`  ✅ Updated`);

  return { success: true, location: inferredLocation, region, source };
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Phase 1: Artist Location Backfill                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning artists with unresolvable locations...\n');
  const artists = await scanArtistsNeedingLocation();
  console.log(`\nFound ${artists.length} artists needing location data\n`);

  const results = {
    total: artists.length,
    succeeded: 0,
    failed: 0,
    noData: 0,
    unresolvable: 0,
    spotCheck: [], // Sample city→region mappings for verification
  };

  for (const artist of artists) {
    try {
      const result = await backfillArtist(artist);
      if (result.success) {
        results.succeeded++;
        // Collect spot-check samples (first 10)
        if (results.spotCheck.length < 10) {
          results.spotCheck.push({
            artist: artist.name,
            city: result.location,
            region: result.region,
            source: result.source,
          });
        }
      } else {
        results.failed++;
        if (result.reason === 'no_data') results.noData++;
        if (result.reason === 'unresolvable_region') results.unresolvable++;
      }
    } catch (error) {
      console.log(`\n❌ ERROR processing ${artist.name}:`);
      console.log(error.message);
      results.failed++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total artists needing location:  ${results.total}`);
  console.log(`Successfully backfilled:          ${results.succeeded}`);
  console.log(`Failed (no data):                 ${results.noData}`);
  console.log(`Failed (unresolvable region):     ${results.unresolvable}`);
  console.log(`Failed (other):                   ${results.failed - results.noData - results.unresolvable}`);
  console.log('');
  console.log(`Remaining for manual review:      ${results.failed}`);

  if (results.spotCheck.length > 0) {
    console.log(`\n${'='.repeat(60)}`);
    console.log('SPOT-CHECK: City→Region Mappings (First 10 Successful)');
    console.log(`${'='.repeat(60)}`);
    for (const sample of results.spotCheck) {
      console.log(`${sample.artist}`);
      console.log(`  City: "${sample.city}" → Region: "${sample.region}" (${sample.source})`);
    }
  }
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('Run with --execute to perform actual backfill\n');

  (async () => {
    console.log('Scanning artists with unresolvable locations...\n');
    const artists = await scanArtistsNeedingLocation();
    console.log(`\nWould process ${artists.length} artists:\n`);

    // Show first 10 as examples
    for (const artist of artists.slice(0, 10)) {
      console.log(`- ${artist.name} (${artist.id})`);
      console.log(`  Current location: "${artist.location || '(empty)'}"`);
    }

    if (artists.length > 10) {
      console.log(`\n... and ${artists.length - 10} more\n`);
    }
  })().catch(console.error);
} else {
  main().catch(console.error);
}

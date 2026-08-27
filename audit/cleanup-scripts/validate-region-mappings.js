/**
 * Validate Region Mappings - Phase 2 Validation Sweep
 *
 * Scans all artists and venue cities to find locations that fall back to
 * slugs instead of canonical regions. Each slug-fallback indicates a missing
 * city mapping in REGION_PATTERNS.
 *
 * Per gate-hardening plan: run until zero slug-fallbacks before sentinel phase.
 */

'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const VENUES_TABLE = 'bndy-venues';

const { regionBucket } = require('C:/VSProjects/bndy-serverless-api/shared/identity/identity');

// Canonical 13 regions (should be the ONLY valid outputs)
const CANONICAL_REGIONS = new Set([
  'north-east',
  'north-west',
  'yorkshire',
  'east-midlands',
  'west-midlands',
  'east',
  'south-east',
  'south-west',
  'london',
  'wales',
  'scotland',
  'northern-ireland',
  'unknown',
]);

/**
 * Scan all artists
 */
async function scanAllArtists() {
  const items = [];
  let lastKey = null;

  do {
    const params = {
      TableName: ARTISTS_TABLE,
      ExclusiveStartKey: lastKey,
    };

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;

    if (items.length % 500 === 0) {
      console.log(`Scanned ${items.length} artists...`);
    }
  } while (lastKey);

  return items;
}

/**
 * Scan all venues
 */
async function scanAllVenues() {
  const items = [];
  let lastKey = null;

  do {
    const params = {
      TableName: VENUES_TABLE,
      ExclusiveStartKey: lastKey,
    };

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;

    if (items.length % 500 === 0) {
      console.log(`Scanned ${items.length} venues...`);
    }
  } while (lastKey);

  return items;
}

/**
 * Check if a region is a slug-fallback (not canonical)
 */
function isSlugFallback(region) {
  return region !== 'unknown' && !CANONICAL_REGIONS.has(region);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Phase 2: Region Mapping Validation Sweep                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Scan artists
  console.log('Scanning all artists...\n');
  const artists = await scanAllArtists();
  console.log(`\nTotal artists: ${artists.length}\n`);

  // Scan venues
  console.log('Scanning all venues...\n');
  const venues = await scanAllVenues();
  console.log(`\nTotal venues: ${venues.length}\n`);

  // Collect slug-fallbacks
  const slugFallbacks = new Map(); // city → count

  // Check artist locations
  let artistsChecked = 0;
  for (const artist of artists) {
    if (!artist.location) continue;

    artistsChecked++;
    const region = regionBucket(artist.location);

    if (isSlugFallback(region)) {
      const count = slugFallbacks.get(artist.location) || 0;
      slugFallbacks.set(artist.location, count + 1);
    }
  }

  // Check venue cities
  let venuesChecked = 0;
  for (const venue of venues) {
    if (!venue.city) continue;

    venuesChecked++;
    const region = regionBucket(venue.city);

    if (isSlugFallback(region)) {
      const count = slugFallbacks.get(venue.city) || 0;
      slugFallbacks.set(venue.city, count + 1);
    }
  }

  // Sort by frequency (most common first)
  const sorted = [...slugFallbacks.entries()]
    .sort((a, b) => b[1] - a[1]);

  // Display results
  console.log('═'.repeat(60));
  console.log('SLUG-FALLBACK LOCATIONS (Missing from REGION_PATTERNS)');
  console.log('═'.repeat(60));

  if (sorted.length === 0) {
    console.log('✅ ZERO SLUG-FALLBACKS - All locations map to canonical regions!');
  } else {
    console.log(`Found ${sorted.length} locations falling back to slugs:\n`);

    for (const [city, count] of sorted) {
      const region = regionBucket(city);
      console.log(`${city}`);
      console.log(`  Slug: "${region}" | Count: ${count}`);
      console.log(`  Should map to: [NEEDS_REVIEW]`);
    }
  }

  console.log('\n═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Artists checked:       ${artistsChecked}`);
  console.log(`Venues checked:        ${venuesChecked}`);
  console.log(`Slug-fallbacks found:  ${sorted.length}`);
  console.log('');

  if (sorted.length > 0) {
    console.log('⚠️  ACTION REQUIRED:');
    console.log('Add these cities to REGION_PATTERNS in identity.js');
    console.log('Then re-run this sweep until zero slug-fallbacks.\n');
  }
}

main().catch(console.error);

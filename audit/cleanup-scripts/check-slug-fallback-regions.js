/**
 * Check for Slug-Fallback Regions
 *
 * Scans all artists and identifies any with regions that are NOT one of
 * the canonical 13 regions. These are slug-fallbacks (unmapped towns)
 * that need to be added to REGION_PATTERNS.
 *
 * Standing rule: slug-fallback count must be ZERO before sentinel backfill.
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const { regionBucket } = require('C:/VSProjects/bndy-serverless-api/shared/identity/identity');

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
  'unknown'
]);

async function scanAllArtists() {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: 'bndy-artists',
      ExclusiveStartKey: lastKey
    }).promise();

    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;

    if (items.length % 100 === 0) {
      console.log(`Scanned ${items.length} artists...`);
    }
  } while (lastKey);

  return items;
}

async function main() {
  console.log('Scanning all artists for slug-fallback regions...\n');
  const artists = await scanAllArtists();

  const slugFallbacks = [];

  for (const artist of artists) {
    if (!artist.location) continue;

    const region = regionBucket(artist.location);

    // Slug-fallback = not in canonical regions (excluding 'unknown')
    if (!CANONICAL_REGIONS.has(region)) {
      slugFallbacks.push({
        id: artist.id,
        name: artist.name,
        location: artist.location,
        region,
        backfilled: artist.locationBackfilled || false,
        source: artist.locationSource || 'original'
      });
    }
  }

  console.log(`\nTotal artists: ${artists.length}`);
  console.log(`Slug-fallback regions: ${slugFallbacks.length}\n`);

  if (slugFallbacks.length === 0) {
    console.log('✅ ZERO slug-fallbacks - ready for sentinel backfill!\n');
    return;
  }

  console.log('═'.repeat(80));
  console.log('SLUG-FALLBACK REGIONS (unmapped towns)');
  console.log('═'.repeat(80));

  // Group by region for easier pattern identification
  const byRegion = new Map();
  for (const artist of slugFallbacks) {
    if (!byRegion.has(artist.region)) {
      byRegion.set(artist.region, []);
    }
    byRegion.get(artist.region).push(artist);
  }

  // Sort by count (most common first)
  const sorted = [...byRegion.entries()].sort((a, b) => b[1].length - a[1].length);

  for (const [region, artists] of sorted) {
    console.log(`\nRegion: "${region}" (${artists.length} artists)`);
    for (const artist of artists) {
      console.log(`  - ${artist.name}`);
      console.log(`    Location: "${artist.location}"`);
      console.log(`    Source: ${artist.source}${artist.backfilled ? ' (backfilled)' : ''}`);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('ACTION REQUIRED');
  console.log('═'.repeat(80));
  console.log('Add these towns to REGION_PATTERNS:');
  console.log('');

  for (const [region] of sorted) {
    console.log(`  - "${region}"`);
  }

  console.log('');
  console.log('Standing rule: slug-fallback count must be ZERO before sentinel backfill.');
}

main().catch(console.error);

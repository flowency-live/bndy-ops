/**
 * Fix Venue Locality & place_id
 *
 * For all venues:
 * 1. Extract locality from address (village/town/city)
 * 2. Normalize place_id fields (googlePlaceId → google_place_id)
 * 3. Update venue records
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const VENUES_TABLE = 'bndy-venues';

/**
 * Extract locality from UK address
 * "Market Hall, 32 Market St, New Mills, High Peak SK22 4AE, UK"
 * → "New Mills"
 */
function extractLocality(address) {
  if (!address || typeof address !== 'string') return null;

  // Split by comma
  const parts = address.split(',').map(p => p.trim());

  if (parts.length < 2) return null;

  // Remove "UK" / "United Kingdom" if present
  const lastPart = parts[parts.length - 1];
  if (/^(uk|united kingdom)$/i.test(lastPart.trim())) {
    parts.pop();
  }

  // Remove postcode (last part usually has postcode pattern)
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (/[A-Z]{1,2}\d{1,2}\s*\d[A-Z]{2}/i.test(lastPart)) {
      parts.pop();
    }
  }

  if (parts.length === 0) return null;

  // Street name patterns to skip
  const STREET_PATTERNS = /\b(street|st|road|rd|lane|ln|avenue|ave|drive|dr|close|way|place|square|yard|hill|row)\b/i;

  // Filter out parts that are clearly streets or buildings
  const candidates = parts.filter(part => {
    // Skip if contains numbers (likely building number or street number)
    if (/^\d+/.test(part.trim())) return false;
    // Skip if looks like a street name
    if (STREET_PATTERNS.test(part)) return false;
    // Skip single letters or very short strings
    if (part.trim().length < 3) return false;
    return true;
  });

  // Return the LAST candidate (closest to the end, after filtering)
  // This is usually the locality before the county/district
  if (candidates.length > 0) {
    return candidates[candidates.length - 1];
  }

  // Fallback: if we filtered everything out, take 2nd from end (before county)
  if (parts.length >= 2) {
    const candidate = parts[parts.length - 2];
    if (candidate && candidate.trim().length >= 3) {
      return candidate;
    }
  }

  return null;
}

/**
 * Get normalized place_id (prefer google_place_id, fallback to googlePlaceId)
 */
function getPlaceId(venue) {
  return venue.google_place_id || venue.googlePlaceId || '';
}

/**
 * Scan all venues
 */
async function scanAllVenues() {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: VENUES_TABLE,
      ExclusiveStartKey: lastKey
    }).promise();

    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

/**
 * Update venue with locality and normalized place_id
 */
async function updateVenue(venueId, updates) {
  const updateParts = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (updates.locality) {
    updateParts.push('#locality = :locality');
    expressionAttributeNames['#locality'] = 'locality';
    expressionAttributeValues[':locality'] = updates.locality;
  }

  if (updates.google_place_id) {
    updateParts.push('#google_place_id = :google_place_id');
    expressionAttributeNames['#google_place_id'] = 'google_place_id';
    expressionAttributeValues[':google_place_id'] = updates.google_place_id;
  }

  if (updateParts.length === 0) return;

  await dynamodb.update({
    TableName: VENUES_TABLE,
    Key: { id: venueId },
    UpdateExpression: `SET ${updateParts.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  }).promise();
}

async function main() {
  console.log('Scanning all venues...\n');
  const venues = await scanAllVenues();

  const needsUpdate = [];

  for (const venue of venues) {
    const placeId = getPlaceId(venue);
    const locality = venue.locality || extractLocality(venue.address);

    // Check if updates needed
    const updates = {};

    // Need to add locality?
    if (!venue.locality && locality) {
      updates.locality = locality;
    }

    // Need to normalize place_id?
    if (placeId && !venue.google_place_id) {
      updates.google_place_id = placeId;
    }

    if (Object.keys(updates).length > 0) {
      needsUpdate.push({
        venue,
        updates
      });
    }
  }

  console.log(`${venues.length} total venues`);
  console.log(`${needsUpdate.length} venues need updates\n`);

  // Show what will be updated
  console.log('═'.repeat(80));
  console.log('VENUES TO UPDATE');
  console.log('═'.repeat(80));

  for (const { venue, updates } of needsUpdate.slice(0, 20)) {
    console.log(`\n${venue.name}`);
    console.log(`  ID: ${venue.id}`);
    console.log(`  Address: ${venue.address}`);
    if (updates.locality) {
      console.log(`  → ADD locality: "${updates.locality}"`);
    }
    if (updates.google_place_id) {
      console.log(`  → COPY googlePlaceId → google_place_id`);
    }
  }

  if (needsUpdate.length > 20) {
    console.log(`\n... and ${needsUpdate.length - 20} more`);
  }

  // Execute updates (DRY RUN by default)
  const DRY_RUN = !process.argv.includes('--execute');

  if (DRY_RUN) {
    console.log('\n' + '═'.repeat(80));
    console.log('🔍 DRY RUN MODE - No changes made');
    console.log('Run with --execute to perform updates');
    console.log('═'.repeat(80));
  } else {
    console.log('\n' + '═'.repeat(80));
    console.log('EXECUTING UPDATES...');
    console.log('═'.repeat(80));

    let updated = 0;
    let failed = 0;

    for (const { venue, updates } of needsUpdate) {
      try {
        await updateVenue(venue.id, updates);
        updated++;
        if (updated % 10 === 0) {
          console.log(`Updated ${updated}/${needsUpdate.length} venues...`);
        }
      } catch (error) {
        console.error(`Failed to update ${venue.name}: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log('SUMMARY');
    console.log('═'.repeat(80));
    console.log(`Total venues:     ${venues.length}`);
    console.log(`Updated:          ${updated}`);
    console.log(`Failed:           ${failed}`);
  }
}

main().catch(console.error);

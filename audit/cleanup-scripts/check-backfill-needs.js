const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function scanTable(tableName) {
  const items = [];
  let lastKey = null;
  do {
    const result = await dynamodb.scan({
      TableName: tableName,
      ExclusiveStartKey: lastKey
    }).promise();
    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Backfill Needs Assessment                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Check venues
  const venues = await scanTable('bndy-venues');
  const venuesWithoutPlaceId = venues.filter(v => !v.google_place_id && !v.place_id);
  console.log(`Venues: ${venues.length} total`);
  console.log(`  Missing place_id: ${venuesWithoutPlaceId.length}\n`);

  // Check events
  const events = await scanTable('bndy-events');
  const eventsWithoutNaturalKey = events.filter(e => !e.naturalKey);
  console.log(`Events: ${events.length} total`);
  console.log(`  Missing naturalKey: ${eventsWithoutNaturalKey.length}\n`);

  // Sample events to understand structure
  if (events.length > 0) {
    const sample = events[0];
    console.log('Sample event structure:');
    console.log(`  Has artistId: ${!!sample.artistId}`);
    console.log(`  Has venueId: ${!!sample.venueId}`);
    console.log(`  Has date: ${!!sample.date}`);
    console.log(`  Has naturalKey: ${!!sample.naturalKey}`);
  }
}

main().catch(console.error);

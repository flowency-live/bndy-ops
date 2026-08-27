const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function scanVenuesWithoutPlaceId() {
  const items = [];
  let lastKey = null;
  do {
    const result = await dynamodb.scan({
      TableName: 'bndy-venues',
      ExclusiveStartKey: lastKey
    }).promise();

    for (const venue of result.Items) {
      if (!venue.google_place_id && !venue.place_id) {
        items.push(venue);
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function countVenueEvents(venueId) {
  const result = await dynamodb.query({
    TableName: 'bndy-events',
    IndexName: 'venueId-date-index',
    KeyConditionExpression: 'venueId = :venueId',
    ExpressionAttributeValues: { ':venueId': venueId },
    Select: 'COUNT'
  }).promise();
  return result.Count || 0;
}

async function main() {
  console.log('Scanning venues without place_id...\n');
  const venues = await scanVenuesWithoutPlaceId();

  console.log(`Found ${venues.length} venues without place_id\n`);

  const withEvents = [];
  const orphaned = [];

  for (const venue of venues) {
    const eventCount = await countVenueEvents(venue.id);

    const venueInfo = {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      eventCount
    };

    if (eventCount > 0) {
      withEvents.push(venueInfo);
    } else {
      orphaned.push(venueInfo);
    }
  }

  console.log('═'.repeat(60));
  console.log('VENUES WITH EVENTS (need place_id backfill)');
  console.log('═'.repeat(60));
  console.log(`Count: ${withEvents.length}\n`);

  for (const v of withEvents) {
    console.log(`${v.name} (${v.city || 'no city'})`);
    console.log(`  ID: ${v.id}`);
    console.log(`  Events: ${v.eventCount}\n`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('ORPHANED VENUES (can be deleted)');
  console.log('═'.repeat(60));
  console.log(`Count: ${orphaned.length}\n`);

  for (const v of orphaned) {
    console.log(`${v.name} (${v.city || 'no city'})`);
    console.log(`  ID: ${v.id}\n`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Venues without place_id:     ${venues.length}`);
  console.log(`With events (need backfill): ${withEvents.length}`);
  console.log(`Orphaned (can delete):       ${orphaned.length}`);
}

main().catch(console.error);

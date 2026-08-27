/**
 * Fetch Duplicate Artist Examples
 *
 * Fetch specific artist records to understand data structure for merge logic
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// Known duplicates to examine
const EXAMPLES = [
  { id: 'ecf4ea0b-9c1a-4d6c-94c1-aceab96299ce', name: 'Emily Martine (richer)' },
  { id: 'c838fc07-1f5d-4b91-9b00-18a6f45ce63b', name: 'Emily Martine (has events)' }
];

async function getArtist(artistId) {
  const result = await dynamodb.get({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
  return result.Item;
}

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Fetch Duplicate Artist Examples                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const example of EXAMPLES) {
    console.log('━'.repeat(60));
    console.log(`${example.name}`);
    console.log(`ID: ${example.id}`);
    console.log('━'.repeat(60));

    const artist = await getArtist(example.id);
    const events = await getArtistEvents(example.id);

    if (!artist) {
      console.log('❌ Not found\n');
      continue;
    }

    console.log('\nArtist Data:');
    console.log(JSON.stringify(artist, null, 2));

    console.log(`\nEvents: ${events.length}`);
    if (events.length > 0) {
      events.forEach(e => {
        console.log(`  - ${e.title || e.date} @ ${e.venueId} (${e.id})`);
      });
    }
    console.log('');
  }
}

main().catch(console.error);

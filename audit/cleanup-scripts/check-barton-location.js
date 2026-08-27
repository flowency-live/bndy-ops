/**
 * Check which Barton (there are several in UK)
 * by looking at Anthill Mob's event venue locations
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function getArtistByName(name) {
  const result = await dynamodb.scan({
    TableName: 'bndy-artists',
    FilterExpression: '#name = :name',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: { ':name': name }
  }).promise();
  return result.Items[0];
}

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: 'bndy-events',
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function getVenue(venueId) {
  const result = await dynamodb.get({
    TableName: 'bndy-venues',
    Key: { id: venueId }
  }).promise();
  return result.Item;
}

async function main() {
  const artist = await getArtistByName('Anthill Mob');
  if (!artist) {
    console.log('Artist not found');
    return;
  }

  console.log(`Artist: ${artist.name}`);
  console.log(`ID: ${artist.id}`);
  console.log(`Location: ${artist.location}`);
  console.log(`Backfilled: ${artist.locationBackfilled || false}`);
  console.log(`Source: ${artist.locationSource || 'original'}`);
  console.log('');

  const events = await getArtistEvents(artist.id);
  console.log(`Events: ${events.length}\n`);

  const venueLocations = new Map();

  for (const event of events) {
    if (!event.venueId) continue;

    const venue = await getVenue(event.venueId);
    if (!venue) continue;

    const location = venue.locality || venue.city || venue.address || '(unknown)';
    const count = venueLocations.get(location) || 0;
    venueLocations.set(location, count + 1);

    console.log(`Event: ${event.title || '(no title)'}`);
    console.log(`  Date: ${event.date}`);
    console.log(`  Venue: ${venue.name}`);
    console.log(`  Address: ${venue.address}`);
    console.log(`  Locality: ${venue.locality || '(none)'}`);
    console.log('');
  }

  console.log('Venue location frequency:');
  const sorted = [...venueLocations.entries()].sort((a, b) => b[1] - a[1]);
  for (const [location, count] of sorted) {
    console.log(`  ${location}: ${count} events`);
  }
}

main().catch(console.error);

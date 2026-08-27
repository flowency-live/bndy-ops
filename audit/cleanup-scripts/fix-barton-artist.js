/**
 * Fix Barton Artist - Per-Record Resolution
 *
 * Barton is ambiguous (Barton-upon-Humber, Barton near Preston, Barton Warwickshire).
 * Venue evidence shows Anthill Mob plays at "The Cottage of Content, 15 Welford Rd,
 * Barton, Alcester B50 4NP" = Barton, Warwickshire.
 *
 * Update location to "Warwickshire" (unambiguous, already in west-midlands pattern).
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function fixBartonArtist() {
  const artistId = '04ec8d8d-f16a-4edf-8449-b11ce8ace95d'; // Anthill Mob

  console.log('Updating Anthill Mob location from "Barton" to "Warwickshire"...\n');

  await dynamodb.update({
    TableName: 'bndy-artists',
    Key: { id: artistId },
    UpdateExpression: 'SET #location = :location',
    ExpressionAttributeNames: { '#location': 'location' },
    ExpressionAttributeValues: { ':location': 'Warwickshire' }
  }).promise();

  console.log('✅ Updated');
  console.log('Location: "Warwickshire" → region: west-midlands');
}

fixBartonArtist().catch(console.error);

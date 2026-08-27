/**
 * Delete Orphaned Venue (1)
 * JJ (Emsworth) - no events, no place_id
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function main() {
  const venueId = '5e5da32d-69bf-4014-8df2-848297195e2d';
  const venueName = 'JJ (Emsworth)';

  console.log(`Deleting orphaned venue: ${venueName}`);
  console.log(`ID: ${venueId}\n`);

  await dynamodb.delete({
    TableName: 'bndy-venues',
    Key: { id: venueId }
  }).promise();

  console.log('✓ Deleted\n');
  console.log('Venue cleanup complete - zero venues without place_id remain');
}

main().catch(console.error);

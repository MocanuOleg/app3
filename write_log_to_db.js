<<<<<<< HEAD
const Kafka = require('node-rdkafka');
const db = require('./db_config');


db.connect();

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'my-consumer-group',
  'metadata.broker.list': 'localhost:9092',
  'auto.offset.reset': 'earliest'
}, {});

consumer.connect();

consumer
  .on('ready', () => {
    console.log('Kafka Consumer ready');
    consumer.subscribe(['logs']);

    
    setInterval(() => {
    consumer.consume(1);
    }, 1000);
  })
  .on('data', async (message) => {
  try {
    const rawValue = message.value.toString(); // Kafka message value as string

    const parsed = JSON.parse(rawValue);       // parse JSON object

    const business_id = parsed.business_id
   
    const utcTimestamp = parsed.timestamp; 
 
    const source = parsed.source; 
      

    await db.query(
      'INSERT INTO logs (user_id, source, time_stamp) VALUES ($1, $2, $3)',
      [business_id, source, utcTimestamp]
    );

    console.log('Inserted into DB:', {business_id, source, utcTimestamp });
  } catch (err) {
    console.error('Error processing Kafka message:', err);
  }
})
.on('event.error', (err) => {
  console.error('Kafka error:', err);
});
=======
const Kafka = require('node-rdkafka');
const db = require('./db_config');


db.connect();

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'my-consumer-group',
  'metadata.broker.list': 'localhost:9092',
  'auto.offset.reset': 'earliest'
}, {});

consumer.connect();

consumer
  .on('ready', () => {
    console.log('Kafka Consumer ready');
    consumer.subscribe(['logs']);

    
    setInterval(() => {
    consumer.consume(1);
    }, 1000);
  })
  .on('data', async (message) => {
  try {
    const rawValue = message.value.toString(); // Kafka message value as string

    const parsed = JSON.parse(rawValue);       // parse JSON object

    const business_id = parsed.business_id
   
    const utcTimestamp = parsed.timestamp; 
 
    const source = parsed.source; 
      

    await db.query(
      'INSERT INTO logs (user_id, source, time_stamp) VALUES ($1, $2, $3)',
      [business_id, source, utcTimestamp]
    );

    console.log('Inserted into DB:', {business_id, source, utcTimestamp });
  } catch (err) {
    console.error('Error processing Kafka message:', err);
  }
})
.on('event.error', (err) => {
  console.error('Kafka error:', err);
});
>>>>>>> 2adfcb3bf2126d333ab6808f60a7621f030f726a

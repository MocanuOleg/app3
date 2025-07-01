const Kafka = require('node-rdkafka');
const db = require('./db');

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'my-group',
  'metadata.broker.list': 'localhost:9092',
  'enable.auto.commit': true,         
  'auto.offset.reset': 'earliest'     
}, {});

consumer.connect();

consumer
  .on('ready', () => {
    console.log('Kafka consumer ready');
    consumer.subscribe(['query']);

    // Poll for messages every second
    setInterval(() => {
      consumer.consume(10); 
    }, 1000);
  })
  .on('data', async (message) => {
    try {
      const data = JSON.parse(message.value.toString());
      await db('address').insert(data);
      console.log('Data written to DB:', data);
    } catch (err) {
      console.error('DB write failed or invalid JSON:', err);
    }
  })
  .on('event.error', (err) => {
    console.error('Kafka error:', err);
  })
  .on('disconnected', () => {
    console.log('Kafka disconnected');
  });




const Kafka = require('node-rdkafka');
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const logSchema = require("C:/Users/mocan/Documents/RegistrySchema1.json");

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(logSchema);

const producer = new Kafka.Producer({
  'metadata.broker.list': 'localhost:9092',
  dr_cb: true,
});

producer.connect();

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready');
});

producer.on('event.error', function(err) {
  console.error('Kafka error:', err);
});

function logKafka(source, business_id) {
  const message = {
    source,
    business_id: parseInt(business_id, 10),
    timestamp: new Date().toISOString()
  };

  const isValid = validate(message);

  if (!isValid) {
    console.error('Invalid Kafka message:', validate.errors);
    return;
  }

  try {
    producer.produce(
      'logs',  
      null,
      Buffer.from(JSON.stringify(message)),
      null,
      Date.now()
    );
    console.log('Message sent to Kafka (logs):', message);
  } catch (err) {
    console.error('Kafka logging failed:', err);
  }
}

function sendQueryMessage(data) {
  try {
    producer.produce(
      'query',  
      null,
      Buffer.from(JSON.stringify(data)),
      null,
      Date.now()
    );
    console.log('Message sent to Kafka (query):', data);
  } catch (err) {
    console.error('Kafka query message failed:', err);
  }
}

module.exports = { logKafka, sendQueryMessage };

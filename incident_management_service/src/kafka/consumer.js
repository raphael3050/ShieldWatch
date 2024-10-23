// microserviceB/consumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'incident-management-service',
  brokers: ['localhost:9092'],  // TODO: adresse Kafka
});

const consumer = kafka.consumer({ groupId: 'microservice-b-group' });

const consumeMessages = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: 'events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

export default consumeMessages;
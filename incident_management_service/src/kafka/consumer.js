// consumer.js
import { Kafka } from 'kafkajs';
import manageEvent from '../manager.js';

const kafka = new Kafka({
  clientId: 'incident-management-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'incident-group' });

const consumeMessages = async () => {
  try {
    await consumer.connect();
    console.log('[+] Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka', error);
    return;
  }


  await consumer.subscribe({ topic: 'events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
      await manageEvent(JSON.parse(message.value.toString()));
    },
  });
};

export default consumeMessages;
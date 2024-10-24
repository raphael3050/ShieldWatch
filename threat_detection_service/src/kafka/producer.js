//producer.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'threat-detection-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const sendMessage = async (message) => {
  await producer.connect();
  
  // Envoyer le message au topic 'events'
  await producer.send({
    topic: 'events',
    messages: [
      { value: message },
    ],
  });

  console.log(`Message envoyé : ${message}`);
  await producer.disconnect();
};

export default sendMessage;

// microserviceA/producer.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'threat-detection-service',
  brokers: ['localhost:9092'],  // TODO: adresse Kafka
});

const producer = kafka.producer();

const sendMessage = async (message) => {
  await producer.connect();
  
  // Envoyer le message à un topic
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

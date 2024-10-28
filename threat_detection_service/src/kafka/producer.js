import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'threat-detection-service',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'threat-detection-group' });

let isKafkaConnected = false;

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    isKafkaConnected = true;
    console.log('[+] Successfully connected to Kafka');

    // Démarrer le consommateur pour écouter le sujet "responses"
    await consumer.subscribe({ topic: 'responses', fromBeginning: true });

    // Traitement des messages du consommateur
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const receivedMessage = message.value.toString();
        console.log(`[+] Received response on topic ${topic}: ${receivedMessage}`);
        
        // Ajouter ici le traitement de la réponse
        handleResponse(receivedMessage);
      },
    });

  } catch (error) {
    isKafkaConnected = false;
    console.error('[-] Failed to connect to Kafka', error);
  }
};

export const sendMessage = async (message) => {
  if (!isKafkaConnected) {
    throw new Error('Producer is not connected to Kafka');
  }
  await producer.send({
    topic: 'events',
    messages: [{ value: message }],
  });
  console.log(`[+] Message sent: ${message}`);
};

// Fonction pour traiter les réponses reçues
const handleResponse = (message) => {
  // Traitement des réponses reçues ici
  console.log(`[+] Processing response: ${message}`);
  // Ex. : Mise à jour de la base de données, log, ou notification
};

export default { isKafkaConnected };

// consumer.js
import KafkaService from './kafka.js';
import manageEvent from '../manager.js';  

const kafkaService = new KafkaService();

// Utilisation de la classe KafkaService pour se connecter au service Kafka
export const initializeConsumer = async () => {
  await kafkaService.connectConsumer('events');

  await kafkaService.runConsumer(async ({ topic, partition, message }) => {
    const receivedMessage = message.value.toString();
    console.log(`[+] Received message on topic ${topic}: ${receivedMessage}`);
    manageEvent(receivedMessage);
  });
};

// Fonction pour vérifier si le consumer est connecté
export function getConsumerStatus() {
  return kafkaService.isConsumerConnected;
}


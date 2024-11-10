// consumer.js
import kafkaService from './kafka.js';
import { handleThreatResponse } from '../response.js';

export const initializeConsumer = async () => {
  await kafkaService.connectConsumer('events');

  await kafkaService.runConsumer(async ({ topic, partition, message }) => {
    const receivedMessage = message.value.toString();
    console.log(`[+] Received threat alert on topic ${topic}: ${receivedMessage}`);
    handleResponse(receivedMessage);
  });
};

const handleResponse = (message) => {
  // Traitement de la réponse
  try {
    handleThreatResponse(message);
  } catch (error) {
    console.error('[-] Error handling response:', error);
  }
};

export function getConsumerStatus() {
  return kafkaService.isConsumerConnected;
}


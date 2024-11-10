import kafkaService from './kafka.js';
import { pendingResponses } from './producer.js';

export const initializeConsumer = async () => {
  await kafkaService.connectConsumer('responses');

  await kafkaService.runConsumer(async ({ topic, partition, message }) => {
    const receivedMessage = message.value.toString();
    console.log(`[+] Received message on topic ${topic}: ${receivedMessage}`);

    try {
      const { correlationId, message: responseMessage } = JSON.parse(receivedMessage);

      // Vérifier si le consumer a une promesse en attente pour ce correlationId
      if (pendingResponses[correlationId]) {
        console.log(`[+] Response received for correlationId: ${correlationId}`);

        // Résoudre la promesse
        pendingResponses[correlationId].resolve(responseMessage);
        
        
        delete pendingResponses[correlationId];
      } else {
        // Si aucune promesse n'est trouvée pour ce correlationId, ignorer
        console.log(`[-] No pending promise found for correlationId: ${correlationId}`);
      }
    } catch (error) {
      console.error('[-] Error processing message:', error);
    }
  });
};

export function getConsumerStatus() {
  return kafkaService.isConsumerConnected;
}

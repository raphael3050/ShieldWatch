// consumer.js
import KafkaService from './kafka.js';

const kafkaService = new KafkaService();

export const initializeConsumer = async () => {
  await kafkaService.connectConsumer('responses');

  await kafkaService.runConsumer(async ({ topic, partition, message }) => {
    const receivedMessage = message.value.toString();
    console.log(`[+] Received message on topic ${topic}: ${receivedMessage}`);
    handleResponse(receivedMessage);
  });
};

const handleResponse = (message) => {
  console.log(`[+] Processing response: ${message}`);
};

export function getConsumerStatus() {
  return kafkaService.isConsumerConnected;
}


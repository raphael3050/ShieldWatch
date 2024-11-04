// producer.js
import KafkaService from "./kafka.js";

const kafkaService = new KafkaService();

export const initializeProducer = async () => {
  await kafkaService.connectProducer();
};

export const sendMessage = async (message) => {
  try {
    await kafkaService.sendMessage('responses', message);
  } catch (error) {
    console.error('[-] Error sending message:', error);
  }
};

export function getProducerStatus() {
    return kafkaService.isProducerConnected;
}


// producer.js
import kafkaService from "./kafka.js";
export const initializeProducer = async () => {
  await kafkaService.connectProducer();
};

export function getProducerStatus() {
    return kafkaService.isProducerConnected;
}


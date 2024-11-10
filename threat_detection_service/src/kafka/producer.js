// producer.js
import kafkaService from "./kafka.js";
import { v4 as uuidv4 } from 'uuid';

export const pendingResponses = {};

export const initializeProducer = async () => {
  await kafkaService.connectProducer();
  console.log("[+] Producer initialized.");
};

export const sendMessage = async (message) => {
  const correlationId = uuidv4();
  const topic = "events";  
  
  // Créer une promesse et l'associer à l'identifiant unique
  const responsePromise = new Promise((resolve, reject) => {
    pendingResponses[correlationId] = { resolve, reject };

    // Timeout au bout de 10 secondes si aucune réponse n'est reçue
    setTimeout(() => {
      if (pendingResponses[correlationId]) {
        delete pendingResponses[correlationId];
        reject(new Error("Timeout waiting for Kafka response"));
      }
    }, 10000);
  });

  // Envoyer le message avec le correlationId
  await kafkaService.sendMessage(topic, JSON.stringify({ correlationId, message }), correlationId);
  
  return responsePromise;
};

export function getProducerStatus() {
  return kafkaService.isProducerConnected;
};

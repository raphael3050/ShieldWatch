// kafka.js
import { Kafka } from 'kafkajs';


/**
 * Classe qui gère la connexion et la communication avec le service Kafka.
 * attributs:
 * - kafka: objet Kafka
 * - producer: objet Producer
 * - consumer: objet Consumer
 * - isConsumerConnected: booléen qui indique si le consumer est connecté
 * méthodes:
 * - connectConsumer(topic): connecte le consumer à un topic
 * - runConsumer(eachMessageHandler): lance le consumer
 * - get isConsumerConnected(): getter pour isConsumerConnected
 */
class KafkaService {
  #isConsumerConnected;

  constructor() {
    const KAFKA_BROKER = process.env.KAFKA_BROKER;
    if (!KAFKA_BROKER) {
      console.error('[-] Please set the KAFKA_BROKER environment variable in the docker-compose.yml file');
      process.exit(1);
    }

    this.kafka = new Kafka({
      clientId: 'response-service',
      brokers: [KAFKA_BROKER],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'incident-group' });
    this.#isConsumerConnected = false;
  }

  async connectConsumer(topic) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      console.log(`[+] Kafka consumer connected and subscribed to topic: ${topic}`);
      this.#isConsumerConnected = true;
    } catch (error) {
      this.#isConsumerConnected = false;
      console.error('[-] Failed to connect Kafka consumer', error);
    }
  }

  async runConsumer(eachMessageHandler) {
    try {
      await this.consumer.run({
        eachMessage: eachMessageHandler,
      });
    } catch (error) {
      console.error('[-] Failed to run consumer', error);
    }
  }

  get isConsumerConnected() {
    return this.#isConsumerConnected;
  }
}

export default KafkaService;

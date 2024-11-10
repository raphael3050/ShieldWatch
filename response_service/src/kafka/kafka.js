// kafka.js
import { Kafka } from 'kafkajs';

class KafkaService {
  #isProducerConnected;
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
    this.consumer = this.kafka.consumer({ groupId: 'response-group' });
    this.#isProducerConnected = false;
    this.#isConsumerConnected = false;
  }

  async connectProducer() {
    try {
      await this.producer.connect();
      this.#isProducerConnected = true;
      console.log('[+] Kafka producer connected successfully');
    } catch (error) {
      console.error('[-] Failed to connect Kafka producer', error);
      this.#isProducerConnected = false;
    }
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

  // Modification ici pour accepter un paramètre key (qui sera le correlationId)
  async sendMessage(topic, message, key) {
    if (!this.#isProducerConnected) {
      throw new Error('Producer is not connected to Kafka');
    }
    console.log(`[+] Sending message to topic ${topic}: ${message}`);
    await this.producer.send({
      topic,
      messages: [{ value: message, key }],  // Utilisation de key pour partitionner
    });
    console.log(`[+] Message sent to topic ${topic}: ${message}`);
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

  get isProducerConnected() {
    return this.#isProducerConnected;
  }

  get isConsumerConnected() {
    return this.#isConsumerConnected;
  }
}

const kafkaService = new KafkaService();
export default kafkaService;

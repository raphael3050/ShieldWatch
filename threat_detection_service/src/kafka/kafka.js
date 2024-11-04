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
      clientId: 'threat-detection-service',
      brokers: [KAFKA_BROKER],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'threat-detection-group' });
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

  async sendMessage(topic, message) {
    if (!this.#isProducerConnected) {
      throw new Error('Producer is not connected to Kafka');
    }
    await this.producer.send({
      topic,
      messages: [{ value: message }],
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

export default KafkaService;

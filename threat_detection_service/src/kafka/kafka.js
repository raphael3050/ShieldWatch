import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

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
    this.consumer = null; // il sera créé dynamiquement
    this.#isProducerConnected = false;
    this.#isConsumerConnected = false;
  }

  // Connecte le producteur à Kafka
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

  // Connecte le consommateur à Kafka avec un groupId unique pour chaque instance
  async connectConsumer(topic) {
    try {
      const groupId = `threat-detection-group-${uuidv4()}`; // Générer un groupId unique pour chaque instance
      
      // Assurer l'existence du topic avant de s'abonner
      //await this.ensureTopicExists(topic);

      this.consumer = this.kafka.consumer({ groupId });
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      console.log(`[+] Kafka consumer connected with groupId: ${groupId} and subscribed to topic: ${topic}`);
      this.#isConsumerConnected = true;
    } catch (error) {
      this.#isConsumerConnected = false;
      console.error('[-] Failed to connect Kafka consumer', error);
    }
  }

  // Envoie un message à Kafka avec un key (correlationId) pour partitionner les messages
  async sendMessage(topic, message, correlationId) {
    if (!this.#isProducerConnected) {
      throw new Error('Producer is not connected to Kafka');
    }
    await this.producer.send({
      topic,
      messages: [{ value: message, key: correlationId }],
    });
    console.log(`[+] Message sent to topic ${topic}: ${message}, with correlationId: ${correlationId}`);
  }

  // Exécute le consommateur pour traiter les messages
  async runConsumer(eachMessageHandler) {
    if (!this.consumer) {
      throw new Error('Consumer is not connected');
    }
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

// Singleton
const kafkaService = new KafkaService();

export default kafkaService;

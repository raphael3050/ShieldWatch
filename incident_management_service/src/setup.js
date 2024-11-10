// setup.js
import { initializeConsumer } from './kafka/consumer.js';

/**
 * Fonction qui configure le service.
 * Vérifie les variables d'environnement et initialise le service (consommateur Kafka).
 */
export function setupService() {

    // Check port env 
    if (!process.env.PORT) {
        console.error('[-] ERROR: Please set the PORT environment variable in the docker-compose.yml file');
        process.exit(1);
    }

    // Check logging service url env
    if (!process.env.LOGGING_SERVICE_URL) {
        console.error('[-] ERROR: Please set the LOGGING_SERVICE_URL environment variable in the docker-compose.yml file');
        process.exit(1);
    }
    if (!process.env.NOTIFY_SERVICE_URL) {
        console.error('[-] ERROR: Please set the NOTIFICATION_SERVICE_URL environment variable in the docker-compose.yml file');
        process.exit(1);
    }

    // Initialize the Kafka consumer and producer
    try {
        initializeConsumer();
    } catch (e) {
        console.error('[-] ERROR: Failed to initialize Kafka consumer', e);
    }

}

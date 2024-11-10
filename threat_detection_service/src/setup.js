// setup.js
import { connect } from './db/mongo.js';
import { initializeConsumer } from './kafka/consumer.js';
import { initializeProducer } from './kafka/producer.js';



function setupMongo() {
    // Vérification de la variable d'environnement MONGO_URI
    const MONGO_URI = process.env.MONGODB_URI
    if (!MONGO_URI) {
        console.error("[-] ERROR: MONGO_URI is required in the docker compose file");
        throw new Error("MONGO_URI is not defined");
    }
    try {
        // Connexion à la base de données
        connect(MONGO_URI);
    } catch (error) {
        console.error("[-] ERROR: Erreur lors de la connexion à la base de données: " + error);
        throw new Error("Error connecting to the mongo database");
    }
}

function checkPort() {
    // Vérification de la variable d'environnement PORT
    const PORT = process.env.PORT
    if (!PORT) {
        console.error("[-] ERROR: Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml");
        throw new Error("PORT is not defined");
    }
}


function setupKakfaConsumer() {
    try {
        initializeConsumer();
    } catch (error) {
        throw new Error("Error connecting to Kafka");
    }
}

function setupKakfaProducer() {
    try {
        initializeProducer();
    } catch (error) {
        throw new Error("Error connecting to Kafka");
    }
}

/**
 * Fonction qui configure le service.
 * Vérifie les variables d'environnement et initialise le service.
 */
export function setupService() {
    try {
        setupMongo();
        checkPort();
        setupKakfaConsumer();
        setupKakfaProducer();
        console.log("Service is ready to accept requests");
    } catch (error) {
        console.error("[-] ERROR: Error while setting up the service " + error);
        process.exit(1);
    }

}

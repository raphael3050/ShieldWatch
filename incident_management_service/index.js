import express from 'express';
import incident from './src/incident.js';
import consumeMessages from './src/kafka/consumer.js';  // Import de la fonction de consommation

// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the incident management service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/incident', incident);

// Démarrer le consommateur Kafka
const startConsumer = async () => {
    try {
        await consumeMessages();  // Appel de la fonction pour consommer les messages
        console.log('Le consommateur Kafka est prêt et en attente des messages...');
    } catch (err) {
        console.error('Erreur lors du démarrage du consommateur:', err);
    }
};

const PORT = process.env.PORT;
if (!PORT) {
    console.error('[-] Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml');
    process.exit(1);
}

// Lancer le serveur
app.listen(3000, () => {
    console.log("Server is running on port 3000");
    startConsumer();  // Appel à la fonction pour démarrer la consommation
});

import express from 'express';
import router from './src/router.js';
import {initializeProducer} from './src/kafka/producer.js';
import {initializeConsumer} from './src/kafka/consumer.js';

// Initialisation de l'application Express
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to the incident management service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/response', router);



const PORT = process.env.PORT;
if (!PORT) {
    console.error('[-] Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml');
    process.exit(1);
}

// Lancer le serveur
app.listen(PORT, () => {
    initializeConsumer();
    initializeProducer();
    console.log(`Server is running on port ${PORT}`);
});

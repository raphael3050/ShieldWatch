import express from 'express';
import incident from './src/incident.js';
import { setupService } from './src/setup.js';

// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send("Welcome to the incident management service ! The service is up and running. ✅");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/incident', incident);

// Configuration du service
setupService();

// Lancer le serveur
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`[+] Server is running on port ${PORT}`);
});

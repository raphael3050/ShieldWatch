import express from 'express';
import router from './src/routeur.js';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the auth service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/auth', router);


const PORT = process.env.PORT
if (!PORT) {
    console.error('[-] Definissez la variable d\'environnement PORT dans le fichier docker-compose.yml');
    process.exit(1);
}
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

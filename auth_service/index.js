import express from 'express';
import router from './src/routeur.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const corsOptions = {
    origin: true,     // Attention : à modifier en production
    credentials: true,     // Autorise les cookies
};


// Middleware pour parser le JSON
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
// Logg
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);
    next();
});

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

import express from 'express';
import router from './src/routeur.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupService } from './src/setup.js';


dotenv.config();
const app = express();

const corsOptions = {
    origin: true,          // Attention : à modifier en production
    credentials: true,     // Autorise les cookies dans les requêtes
};


// Middleware pour parser le JSON
app.use(express.json());
app.use(cors(corsOptions));

// Middleware pour parser les cookies
app.use(cookieParser());

// Logging de toutes les requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);
    next();
});

// Autres routes
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Authentification service ! This service is working correctly ✅');
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/auth', router);



const PORT = process.env.PORT
// Démarrer le serveur
app.listen(PORT, () => {
    setupService();
    console.log(`[+] Serveur démarré sur le port ${PORT}`);
});

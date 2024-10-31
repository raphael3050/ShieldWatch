import express from 'express';
import auth from './src/auth.js';
import log from './src/log.js';
import cors from 'cors';

// Initialisation de l'application Express
const app = express();
app.use(cors());
app.use(express.json());

// Logg des requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);
    next();
});

// Routeur pour les requêtes d'authentification
app.use('/auth', auth);

// Routeur pour les requêtes de log
app.use('/log', log);

// Récupération du port depuis la variable d'environnement
const PORT = process.env.PORT
if (!PORT) {
    console.error("[-] Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml");
    process.exit(1);
}

// Lancement du serveur
app.listen(PORT, () => {
    console.log("-----------------------------------------------------------");
    console.log(`The server is running on http://localhost:${PORT}`);
    console.log("-----------------------------------------------------------");
});

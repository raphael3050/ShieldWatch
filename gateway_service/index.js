//index.js
import express from 'express';
import auth from './src/auth.js';
import log from './src/log.js';
import monitor from './src/monitor.js';

import cors from 'cors';
import cookieParser from 'cookie-parser';

const corsOptions = {
    origin: true,       // Attention : à modifier en production pour limiter les sources autorisées
    credentials: true,  // Autorise les cookies
};

// Initialisation de l'application Express
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Logging des requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    console.log(req.headers);
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Gateway service ! This service is working correctly ✅');
});

// Routeur pour les requêtes d'authentification
app.use('/auth', auth);

// Routeur pour les requêtes de log
app.use('/log', log);

// Routeur pour les requêtes de monitoring
app.use('/monitor', monitor);


// Récupération du port depuis la variable d'environnement
const PORT = process.env.PORT
if (!PORT) {
    console.error("[-] Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml");
    process.exit(1);
}

// Lancement du serveur
app.listen(PORT, () => {
    console.log("-----------------------------------------------------------");
    console.log("[*] SHIELDWATCH");
    console.log("[*] All services are running, you can now send requests.");
    console.log(`[+] The server is running on http://localhost:${PORT}`);
    console.log("-----------------------------------------------------------");
});


export default app;
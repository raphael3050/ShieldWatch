import express from 'express';
import logging from './src/logging.js';
import { connect } from './src/db/mongo.js';

// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Connexion à MongoDB
const MONGO_URI = process.env.MONGODB_URI
if (!MONGO_URI) {
    console.error("MONGO_URI is required in the docker compose file");
    process.exit(1);
}else{
    connect(MONGO_URI);
}

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the logging service.");
});

app.use('/log', logging);

// Lancer le serveur
app.listen(3002, () => {
    console.log("Server is running on port 3000");
});

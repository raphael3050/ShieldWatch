import express from 'express';
import incident from './src/incident.js';



// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the threat detection service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/incident', incident);

// Lancer le serveur
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

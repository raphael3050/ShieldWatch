import express from 'express';
import notify from './src/notify.js';


// Initialisation de l'application Express
const app = express();
app.use(express.json());



// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the notify service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/notify', notify);

// Lancer le serveur
app.listen(3003, () => {
    console.log("Server is running on port 3003");
    console.log(`Notify endpoint available at http://localhost:3003`);
});

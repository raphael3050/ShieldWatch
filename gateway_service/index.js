import express from 'express';
import api from './src/api.js';


// Initialisation de l'application Express
const app = express();
app.use(express.json());



// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the notify service.");
});

app.use('/api', api);

// Lancer le serveur
app.listen(3000, () => {
    console.log("-----------------------------------------------------------");
    console.log("The server is running on http://localhost:3000");
    console.log("-----------------------------------------------------------");
});

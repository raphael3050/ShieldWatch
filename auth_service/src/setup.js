import mongoose from 'mongoose';
import User from './db/model/user.js';
import { connect } from './db/mongo.js';


function setupMongo() {
    // Vérification de la variable d'environnement MONGO_URI
    const MONGO_URI = process.env.MONGODB_URI
    if (!MONGO_URI) {
        console.error("[-] ERROR: MONGO_URI is required in the docker compose file");
        throw new Error("MONGO_URI is not defined");
    }
    try {
        // Connexion à la base de données
        connect(MONGO_URI);
    } catch (error) {
        console.error("[-] ERROR: Erreur lors de la connexion à la base de données: " + error);
        throw new Error("Error connecting to the mongo database");
    }
}



function checkPort() {
    // Vérification de la variable d'environnement PORT
    const PORT = process.env.PORT
    if (!PORT) {
        console.error("[-] ERROR: Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml");
        throw new Error("PORT is not defined");
    }
}


/**
 * Fonction qui configure le service.
 * Vérifie les variables d'environnement et initialise le service.
 */
export function setupService() {
    try {
        setupMongo();
        checkPort();
        // ************************* ATTENTION ******************************************
        // On ajoute par défaut un utilisateur admin avec un mot de passe 'admin'
        // Il ne faut évidemment pas faire ça en production
        // ************************* ATTENTION ******************************************
        User.initializeAdmin();
        console.log("Service is ready to accept requests");
    } catch (error) {
        console.error("[-] ERROR: Error while setting up the service " + error);
        process.exit(1);
    }

}

import mongoose from 'mongoose';
import Rule from './model/rule.js';
import {defaultRules} from './defaultRules.js';

let isMongoConnected = false;

async function insertDefaultRules() {
    try {
        // Vérifie si des règles existent déjà dans la collection
        const existingRules = await Rule.find();
        // Si aucune règle n'existe, insère les règles par défaut
        if (existingRules.length === 0) {
            await Rule.insertMany(defaultRules);
            console.log("[+] Règles par défaut insérées avec succès !");
        } else {
            console.log("[+] Les règles existent déjà dans la base de données.");
        }
    } catch (error) {
        console.error("[-] Erreur lors de l'insertion des règles par défaut :", error);
    }
}

// fonction pour se connecter à MongoDB
export const connect = async (uri) => {
    console.log("[+] Connecting to MongoDB...");
    try {
        await mongoose.connect(uri);
        console.log("[+] Connected to MongoDB");
        isMongoConnected = true;
        insertDefaultRules();
    } catch (err) {
        console.error("[-] Failed to connect to MongoDB", err);
    }
}

export const getMongoStatus = () => {
    return isMongoConnected;
}


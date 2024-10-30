import express from 'express';
import { getLogs, addLog } from './log.js';
import axios from 'axios';

var router = express.Router();

async function checkAuthentication(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token requis' });
    }

    try {
        //  vérification du token
        const response = await axios.get(`http://auth-service:3004/admin`, {
            headers: { Authorization: token },
        });

        if (response.status === 200) {
            // L'authentification a réussi
            next();
        }
    } catch (error) {
        res.status(403).json({ message: 'Accès refusé, vous devez être admin' });
    }
}

// Route pour obtenir tous les logs
router.get('/', checkAuthentication, async (req, res) => {
    console.log("[+] GET /log");
    const result = await getLogs();
    if (result.success) {
        res.status(200).json(result.logs);
    } else {
        res.status(500).json({ error: "Erreur lors de la récupération des logs" });
    }
});

// Route pour ajouter un log
router.post('/', async (req, res) => {
    console.log("[+] POST /log");
    console.log("[+] Adding a new log");
    const eventType = req.body.event;
    const description = req.body.description;
    const ipAdress = req.body.ip;
    const details = req.body.details;

    if (!eventType || !description || !ipAdress || !details) {
        return res.status(400).json({ error: "Les champs 'eventType', 'description', 'ipAdress' et 'details' sont requis" });
    }

    const result = await addLog({ eventType, description, ipAdress, details });
    if (result.success) {
        res.status(201).json(result.log);
    } else {
        res.status(500).json({ error: "Erreur lors de la création du log" });
    }
});

export default router;
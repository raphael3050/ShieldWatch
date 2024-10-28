import express from 'express';
import { getLogs, addLog } from './log.js';
var router = express.Router();

// Route pour obtenir tous les logs
router.get('/', async (req, res) => {
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
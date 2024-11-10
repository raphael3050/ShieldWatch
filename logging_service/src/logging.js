import express from 'express';
import { getLogs, addLog, deleteLogById, deleteAllLogs } from './log.js';
import axios from 'axios';

var router = express.Router();

async function checkAuthentication(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: 'Token requis' });
    }

    try {
        // vérification du cookie
        const response = await axios.post('http://auth-service:3002/auth/verify', {}, {
            headers: {
                Cookie: `token=${token}`
            }
        });


        if (response.status === 200) {
            // L'authentification a réussi
            next();
        }
    } catch (error) {
        console.error(error);
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

// Route pour supprimer un log par ID
router.delete('/:id', checkAuthentication, async (req, res) => {
    console.log(`[+] DELETE /log/${req.params.id}`);
    const result = await deleteLogById(req.params.id);
    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(404).json({ error: result.message || "Erreur lors de la suppression du log" });
    }
});

// Route pour supprimer tous les logs
router.delete('/', checkAuthentication, async (req, res) => {
    console.log("[+] DELETE /log (all logs)");
    const result = await deleteAllLogs();
    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ error: "Erreur lors de la suppression de tous les logs" });
    }
});

export default router;

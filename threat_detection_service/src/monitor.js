import express from 'express';
var router = express.Router();
import analyzeThreat  from './threatAnalyzer.js';
import isKafkaConnected from  './kafka/producer.js';
import isMongoConnected from './db/mongo.js';

router.get('/status', function (req, res) {
    console.log("[+] GET /monitor/status");
    // tester si kafka est connecté
    if (isKafkaConnected && isMongoConnected) {
        res.send("The service is connected to Kafka and MongoDB and ready to process requests");
    } else {
        res.status(500).send("The service is not connected to Kafka or MongoDB");
    }
});


router.post('/', async function (req, res) {
    console.log("[+] POST /monitor");
    try {
        const analysis_result = await analyzeThreat(req.url ,JSON.stringify(req.body), req.ip);
        res.send(analysis_result);
    } catch (error) {
        console.error("Erreur lors de l'analyse :", error);
        res.status(500).send("Erreur lors de l'analyse des données");
    }
});

export default router;
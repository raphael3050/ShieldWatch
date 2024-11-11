import express from 'express';
var router = express.Router();
import analyzeThreat  from './threatAnalyzer.js';
import { getProducerStatus } from './kafka/producer.js';
import { getConsumerStatus } from './kafka/consumer.js';

import isMongoConnected from './db/mongo.js';



router.get('/status', function (req, res) {
    // tester si kafka est connecté
    if (getConsumerStatus()&& getProducerStatus() && isMongoConnected) {
        res.send("The service is connected to Kafka and MongoDB and ready to process requests");
    } else {
        res.status(500).send("The service instance is not connected to Kafka or MongoDB");
    }
});


router.post('/', async function (req, res) {
    try {
        const analysis_result = await analyzeThreat(req.url ,JSON.stringify(req.body), req.ip);
        if (analysis_result === true) {
            res.status(403).send("[+] Threat detected and blocked ! youre ip is now blacklisted");
        }else if (analysis_result === false) {
            res.send("[+] Threat detected but not blocked");
        }else{
            res.send("[+] No threat detected");
        }
    } catch (error) {
        console.error("[-] ERROR: Erreur lors de l'analyse :", error);
        res.status(500).send("Erreur lors de l'analyse des données");
    }
});

export default router;
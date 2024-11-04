import express from 'express';
import { getProducerStatus } from './kafka/producer.js';
import { getConsumerStatus } from './kafka/consumer.js';
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        message: 'This is the API documentation for the response service.',
    });
});

router.get('/status', function (req, res) {
    console.log("[+] GET /response/status");
    // tester si kafka est connecté
    if (getConsumerStatus() && getProducerStatus()) {
        res.send("The service is connected to Kafka and ready to process events");
    } else {
        res.status(500).send("The service is not connected to Kafka");
    }
});


//export this router to use in our index.js
export default router;
import express from 'express';
var router = express.Router();
import { getConsumerStatus } from './kafka/consumer.js';

router.get('/status', function (req, res) {
    // tester si kafka est connecté
    if (getConsumerStatus()) {
        res.send("The service is connected to Kafka and ready to process requests");
    } else {
        res.status(500).send("The service is not connected to Kafka");
    }
});


//export this router to use in our index.js
export default router;
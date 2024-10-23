import express from 'express';
var router = express.Router();
import analyzeThreat  from './threatAnalyzer.js';

router.get('/', function (req, res) {
    res.json({
        message: 'This is the API documentation for the threat detection service.',
        endpoints: [
            { method: 'GET', path: '/graphql', description: 'GraphQL endpoint for querying and mutating data' },
            { method: 'GET', path: '/monitor', description: 'Monitoring endpoint for system health checks' },
        ],
    });
});


router.post('/', async function (req, res) {
    console.log("[+] POST /monitor");
    try {
        const analysis_result = await analyzeThreat(req.body.data);
        res.send(analysis_result);
    } catch (error) {
        console.error("Erreur lors de l'analyse :", error);
        res.status(500).send("Erreur lors de l'analyse des données");
    }
});

//export this router to use in our index.js
export default router;
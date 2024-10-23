import express from 'express';
var router = express.Router();


router.get('/', function (req, res) {
    res.json({
        message: 'This is the API documentation for the threat detection service.',
        endpoints: [
            { method: 'GET', path: '/graphql', description: 'GraphQL endpoint for querying and mutating data' },
            { method: 'GET', path: '/monitor', description: 'Monitoring endpoint for system health checks' },
        ],
    });
});



router.post('/', function (req, res) {
    console.log("[+] POST /tasks");
    console.log(req.body);
    // TODO: lancer l'analyse des menaces
});
//export this router to use in our index.js
export default router;
import express from 'express';
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        message: 'This is the API documentation for the incident management service.',
        endpoints: [
            { method: 'GET', path: '/monitor', description: 'Incidents endpoint.' },
        ],
    });
});


//export this router to use in our index.js
export default router;
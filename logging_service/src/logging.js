var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log("[+] GET /monitor");
    res.json(tasks);
});



router.post('/', function (req, res) {
    console.log("[+] POST /logging");
    const { event, action, response } = req.body;
    // Log the event securely
    log.saveLog({ event, action, response });
    res.status(201).send('Log recorded');
});
//export this router to use in our index.js
module.exports = router;
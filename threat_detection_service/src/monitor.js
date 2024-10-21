var express = require('express');
var router = express.Router();

const Todo = require('./todo.js');

var tasks = [];
var id_counter = 0;

router.get('/', function (req, res) {
    console.log("[+] GET /monitor");
    res.json(tasks);
});



router.post('/', function (req, res) {
    console.log("[+] POST /tasks");
    console.log(req.body);
    
    const description = req.body.description;
    const completed = req.body.completed;

    if (!description) {
        return res.status(400).send('Missing description');
    } else if (typeof completed !== 'boolean') {  // Vérifie que 'completed' est bien un booléen
        return res.status(400).send('Missing or invalid completed (must be a boolean)');
    } else {
        const todo = new Todo(id_counter++, description, completed);
        tasks.push(todo);
        res.send(todo);
    }
});
//export this router to use in our index.js
module.exports = router;
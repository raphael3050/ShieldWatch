var express = require('express');
var app = express();

var monitor = require('./src/monitor.js');

app.use(express.json());


app.get('/', function (req, res, next) {
    res.send("Welcome to the threat detection service. See /api for details about the API.");
});

app.use('/monitor', function (req, res, next) {
    console.log("A request for todos received at " + Date.now());
    next();
});
app.use('/monitor', monitor);

app.listen(3000);
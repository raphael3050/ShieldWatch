// index.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/log', (req, res) => {
    const { event, action, response } = req.body;
    // Log the event securely
    saveLog({ event, action, response });
    res.status(201).send('Log recorded');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

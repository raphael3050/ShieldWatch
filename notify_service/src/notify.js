import express from 'express';
var router = express.Router();
import axios from 'axios';



router.post('/slack', async function (req, res) {
    if (process.env.SLACK_WEBHOOK_URL === undefined) {
        console.error('The slack integration is not implemented yet. Please set the SLACK_WEBHOOK_URL environment variable.');
        return res.status(500).json({ error: 'The slack integration is not implemented yet :(' });
    } else {
        console.log("[+] POST /notify/slack");
        console.log(req.body);
        const { message } = req.body;

        if (!message) {
            console.log('Message is required');
            return res.status(400).json({ error: 'Message is required' });
        }

        try {
            await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
            res.status(200).json({ success: 'Notification envoyée à Slack' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification Slack:', error);
            res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification' });
        }
    }
});

//export this router to use in our index.js
export default router;
import axios from 'axios';


const LOGGING_SERVICE_URL = process.env.LOGGING_SERVICE_URL;
const NOTIFY_SERVICE_URL = process.env.NOTIFY_SERVICE_URL;

if (!LOGGING_SERVICE_URL) {
    console.error('[-] Please set the LOGGING_SERVICE_URL environment variable in the docker-compose.yml file');
    process.exit(1);
}
if (!NOTIFY_SERVICE_URL) {
    console.error('[-] Please set the NOTIFY_SERVICE_URL environment variable in the docker-compose.yml file');
    process.exit(1);
}


async function sendLog(log) {
    try {
        console.log("[+] Envoi du log au service de logging...");
        const response = await axios.post(LOGGING_SERVICE_URL, log);
        console.log("[+] Réponse du service de logging : ", response.status);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du log au service de logging:', error.message);
    }
}

async function sendNotification(notification) {
    try {
        console.log("[+] Envoi de la notification au service de notification...");
        const response = await axios.post(NOTIFY_SERVICE_URL, notification);
        console.log("[+] Réponse du service de notification : ", response.status);

    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification au service de notification:', error.message);
    }
}


// Fonction pour envoyer un message au service de logging
async function manageEvent(logData) {
    console.log("-------------------------------------------------------");
    console.log("[+] Gestion de l'événement");
    console.log(logData);
    console.log("-------------------------------------------------------");
    const message = JSON.parse(JSON.parse(logData).message);

    const threat = message.threat;
    try {
        const eventType = threat.action;
        const description = threat.description;
        const ipAdress = message.ip;
        const details = threat;

        // Object json contenant les informations sur l'évenement
        const log = {
            event: eventType,
            description: description,
            ip: ipAdress,
            details: details,
        };

        sendLog(log);

        const notification = {
            message: `Une menace provenant de l'adresse IP ${ipAdress} a été détectée : ${description}`
        };
        sendNotification(notification);
    } catch (error) {
        console.error('Erreur lors de la gestion de l\'evenement: ', error.message);
    }

}

export default manageEvent;
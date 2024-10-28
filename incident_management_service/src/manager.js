import axios from 'axios';

const LOGGING_SERVICE_URL = 'http://logging-service:3002/log'; // Adapter l'URL et le port du service de logging
const NOTIFICATION_SERVICE_URL = 'http://notify-service:3003/notify/slack'; // Adapter l'URL et le port du service de notification

// Fonction pour envoyer un message au service de logging
async function manageEvent(logData) {
    console.log("-------------------------------------------------------");
    console.log("[+] Gestion de l'événement");
    console.log(logData);
    console.log("-------------------------------------------------------");
    try {
        const eventType = logData.threat.action;
        const description = logData.threat.description;
        const ipAdress = logData.ip;
        const details = logData.threat;

        // Object json contenant les informations sur l'évenement
        const log = {
            event: eventType,
            description: description,
            ip: ipAdress,
            details: details,
        };
        console.log("[+] Envoi du log au service de logging...");
        const response = await axios.post(LOGGING_SERVICE_URL, log);
        console.log("[+] Réponse du service de logging : ", response.status);

        // Envoi d'une notification au service de notification
        console.log("[+] Envoi d'une notification au service de notification...");
        const notification = {
            message: `Une menace provenant de l'adresse IP ${ipAdress} a été détectée : ${description}`
        };
        const notificationResponse = await axios.post(NOTIFICATION_SERVICE_URL, notification);
        console.log("[+] Réponse du service de notification : ", notificationResponse.status);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du log au service de logging:', error.message);
    }
    
}

export default manageEvent;
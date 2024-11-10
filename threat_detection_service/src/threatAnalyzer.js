import Rule from './db/model/rule.js';
import { sendMessage } from './kafka/producer.js';


/**
 * Vérifie si une chaîne correspond à une règle via son pattern.
 * @param {string} input - La chaîne à analyser.
 * @returns {Promise<Object|null>} - La règle correspondante ou null si aucune règle ne correspond.
 */


function applyDecision(response){
  
}



const analyzeThreat = async (url, body, ipAdress) => {
  try {
    var isMenaceDetected = false;
    var threatSummary = [];
    console.log("-------------------------------------------------------");
    console.log(`[+] Analyse des menaces pour l'URL : ${url}`);
    console.log(`[+] Analyse des menaces pour l'IP : ${ipAdress}`);
    console.log(`[+] Analyse des menaces pour le body ${body}`);
    console.log("-------------------------------------------------------");

    const rules = await Rule.find();
    for (const rule of rules) {
      const regex = new RegExp(rule.pattern);
      switch (rule.scope) {
        case "URL":
          if (regex.test(url)) {
            console.log(`[+] Menace détectée : ${rule.name}`);
            threatSummary.push({ threat: rule, data: url, ip: ipAdress });
            isMenaceDetected = true;
          }
        case "BODY":
          if (regex.test(body)) {
            console.log(`[+] Menace détectée : ${rule.name}`);
            threatSummary.push({ threat: rule, data: body, ip: ipAdress });
            isMenaceDetected = true;
          }
        case "IP":
          if (regex.test(ipAdress)) {
            console.log(`[+] Menace détectée : ${rule.name}`);
            threatSummary.push({ threat: rule, ip: ipAdress });
            isMenaceDetected = true;
          }
      }
    }

    if (isMenaceDetected) {
      console.log("[+] Sending message to Kafka consumer (incident-management)...");
      for (const threat of threatSummary) {
        const response = await sendMessage(JSON.stringify(threat));
        // Analyser le contenu de la réponse
        if (response && response.action === 'BLOCK') {
          console.log("[+] Action BLOCK détectée dans la réponse Kafka.");
          return true; 
        }else if(response && response.action === 'ALLOW'){
          console.log("[+] Action ALLOW détectée dans la réponse Kafka.");
          return false;
        }
      }
    }else{
      return null;
    }
  } catch (error) {
    console.error("[-] ERROR: Erreur lors de l'analyse des menaces :", error);
    throw error;
  }
};

export default analyzeThreat;
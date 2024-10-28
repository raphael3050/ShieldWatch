import Rule from './db/model/rule.js';
import { sendMessage } from './kafka/producer.js';
/**
 * Vérifie si une chaîne correspond à une règle via son pattern.
 * @param {string} input - La chaîne à analyser.
 * @returns {Promise<Object|null>} - La règle correspondante ou null si aucune règle ne correspond.
 */
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
            // Créer un objet json contenant les informations sur la menace
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
          console.log(`[+] Testing IP : ${ipAdress}`);
          console.log(`[+] Testing regex : ${regex}`);
          console.log(`[+] Testing result : ${regex.test(ipAdress)}`);
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
        await sendMessage(JSON.stringify(threat));
      }
      return threatSummary;
    }else{
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de l'analyse des menaces :", error);
    throw new Error("Erreur dans l'analyse des menaces");
  }
};

export default analyzeThreat;
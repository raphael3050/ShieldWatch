import Rule from './db/model/rule.js';
import sendMessage from './kafka/producer.js';
/**
 * Vérifie si une chaîne correspond à une règle via son pattern.
 * @param {string} input - La chaîne à analyser.
 * @returns {Promise<Object|null>} - La règle correspondante ou null si aucune règle ne correspond.
 */
const analyzeThreat = async (input) => {
  try {
    const rules = await Rule.find();
    console.log("Analyzing input :", input);
    for (const rule of rules) {
      const regex = new RegExp(rule.pattern); // Convertit la chaîne en une regex
      console.log("Analyzing rule :", rule);
      if (regex.test(input)) {
        console.log(`Menace détectée : ${rule.name}`);
        console.log("[+] Sending message to Kafka consumer...");
        await sendMessage(JSON.stringify({ threat: rule.name, data: input }));
        return rule; 
      }
    }

    // Si aucune règle ne correspond, retourne null
    return null;
  } catch (error) {
    console.error("Erreur lors de l'analyse des menaces :", error);
    throw new Error("Erreur dans l'analyse des menaces");
  }
};

export default analyzeThreat;
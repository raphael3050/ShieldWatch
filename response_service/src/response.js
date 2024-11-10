import kafkaService from "./kafka/kafka.js";

export const handleThreatResponse = async (message) => {
    try {
        console.log(`[+] Processing threat...`);
        const parsedMessage = JSON.parse(message);
        // Effectuer un second JSON.parse sur `parsedMessage.message`
        const innerMessage = JSON.parse(parsedMessage.message);
        const promiseId = parsedMessage.correlationId;
        const action = innerMessage.threat.action;
        const ip = innerMessage.ip;
        switch (action) {
            case 'BLOCK':
                await handleBlockAction(ip, promiseId);
                break;
            case 'ALERT':
                await handleAllowAction(ip, promiseId);
                break;
            default:
                console.log(`[!] Unknown action: ${action}`);
        }
    } catch (error) {
        console.error(`[-] ERROR: Error handling response: ${error.message}`);
    }
};


const handleBlockAction = async (ip, correlationId) => {
    console.log(`[+] Blocking IP: ${ip}`);
    
    // Envoyer un message de réponse avec correlationId comme clé de partition
    await kafkaService.sendMessage('responses', JSON.stringify({ 
      correlationId: correlationId, 
      message: {
        action: 'BLOCK', 
        target: ip
      }
    }), correlationId);
  
    // Construire la mutation GraphQL pour ajouter une nouvelle règle
    const mutation = `
      mutation CreateRule($input: RuleInput!) {
        createRule(input: $input) {
          id
          name
          action
          description
          createdAt
          updatedAt
          pattern
        }
      }
    `;
  
    // Préparer les variables pour la mutation
    const variables = {
      input: {
        action: "BLOCK",
        description: "Block specific IP",
        pattern: `^${ip.replace(/\./g, '\\.')}$`, // Échapper les points pour le regex
        scope: "IP",
        name: `Block ${ip}`
      }
    };
  
    try {
      // Envoyer une requête POST à l'API GraphQL
      const response = await fetch('http://nginx:80/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: mutation,
          variables: variables
        })
      });
  
      // Traiter la réponse
      const result = await response.json();
  
      if (result.errors) {
        console.error('[-] GraphQL mutation error:', result.errors);
      } else {
        console.log('[+] Rule created successfully:', result.data.createRule);
      }
    } catch (error) {
      console.error('[-] Error sending GraphQL mutation:', error);
    }
  };
  

// Une alerte à déjà été envoyée par le service de gestion des menaces, on accepte simplement l'IP
const handleAllowAction = async (ip, correlationId) => {
    console.log(`[+] Allowing IP: ${ip}`);
    // Envoyer un message de réponse avec correlationId comme clé de partition
    await kafkaService.sendMessage('responses', JSON.stringify({ 
        correlationId: correlationId, 
        message:{
          action: 'ALLOW', 
          target: ip 
        }
        
    }), correlationId);
};
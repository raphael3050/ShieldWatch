import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/db/graphql/schema.js';
import { resolvers } from './src/db/graphql/resolvers.js';
import monitor from './src/monitor.js';
import { connect } from './src/db/mongo.js';
import { initializeConsumer } from './src/kafka/consumer.js';
import { initializeProducer } from './src/kafka/producer.js';

import cors from 'cors';

// Connexion à MongoDB
const MONGO_URI = process.env.MONGODB_URI
if (!MONGO_URI) {
    console.error("MONGO_URI is required in the docker compose file");
    process.exit(1);
} else {
    connect(MONGO_URI);
}

// Initialisation de l'application Express
const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true); // Attention ,c'est seulement pour pouvoir utilier des IP de tests avec X-Forwarded-For

// Création d'une instance d'Apollo Server pour graphQL
async function startApolloServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/graphql" });
}
startApolloServer();


// Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);
    next();
});

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the threat detection service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/monitor', monitor);

// Lancer le serveur
const PORT = process.env.PORT
if (!PORT) {
    console.error("[-] Définissez la variable d\'environnement PORT dans le fichier docker-compose.yml");
    process.exit(1);
}

app.listen(PORT, () => {
    // Connexion à Kafka
    initializeProducer();
    initializeConsumer();
    console.log("Server is running on port " + PORT);
    console.log("GraphQL endpoint: http://localhost:" + PORT + "/graphql");
});

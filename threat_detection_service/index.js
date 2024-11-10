import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/db/graphql/schema.js';
import { resolvers } from './src/db/graphql/resolvers.js';
import monitor from './src/monitor.js';
import {setupService} from './src/setup.js';
import cors from 'cors';

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


const PORT = process.env.PORT;
app.listen(PORT, () => {
    setupService();
    console.log("Server is running on port " + PORT);
    console.log("GraphQL endpoint: http://localhost:" + PORT + "/graphql");
});

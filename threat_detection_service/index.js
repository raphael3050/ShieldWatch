import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/db/graphql/schema.js';
import { resolvers } from './src/db/graphql/resolvers.js';
import monitor from './src/monitor.js';
import { connect } from './src/db/mongo.js';

// Connexion à MongoDB
const MONGO_URI = 'mongodb://localhost:27017/threat_detection';  
connect(MONGO_URI);

// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Création d'une instance d'Apollo Server
async function startApolloServer(){
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app , path: "/graphql"} );    
}
startApolloServer();

// Autres routes
app.get('/', (req, res) => {
    res.send("Welcome to the threat detection service.");
});

// Configuration du middleware pour le monitoring (POST des données)
app.use('/monitor', monitor);

// Lancer le serveur
app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(`GraphQL endpoint available at http://localhost:3000/graphql`);
});

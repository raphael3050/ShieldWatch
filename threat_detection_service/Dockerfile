# microserviceA/Dockerfile

# Utiliser une image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

EXPOSE 3001

# Commande pour démarrer l'application
CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /usr/src/app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]

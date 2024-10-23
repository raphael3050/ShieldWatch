# Étape 1 : Utiliser une image de base officielle de Node.js (version 18)
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste du projet dans le répertoire de travail
COPY . .

# Étape 6 : Exposer le port sur lequel ton microservice fonctionne (3000 par défaut)
EXPOSE 3000

# Étape 7 : Définir la commande pour démarrer le microservice
CMD ["node", "run", "start"]

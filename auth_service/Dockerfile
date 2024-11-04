FROM node:18-alpine

WORKDIR /usr/src/app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet dans le conteneur
COPY . .

CMD ["npm", "run","watch"]

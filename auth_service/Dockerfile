FROM node:18-alpine

WORKDIR /usr/src/app

# Installer curl pour le health check
RUN apk add --no-cache curl

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet dans le conteneur
COPY . .

CMD ["npm", "run","watch"]

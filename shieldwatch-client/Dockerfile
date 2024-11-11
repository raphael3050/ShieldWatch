# Étape 1 : Build de l'application
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet (y compris le middleware)
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2 : Créer l'image de production
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier tous les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/*.ts ./ 
COPY --from=builder /app/*.js ./ 

# Exposer le port utilisé par Next.js (par défaut 3000)
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

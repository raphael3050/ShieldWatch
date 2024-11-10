FROM node:18-alpine

WORKDIR /usr/src/app
# Installer curl pour le health check
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run","watch"]

# Node.js 22 LTS — Active LTS jusqu'en Avril 2027
FROM node:22.15.0-alpine

WORKDIR /app

# Copier package.json EN PREMIER pour optimiser le cache Docker
# Si seul le code change, npm install n'est pas réexécuté
COPY package*.json ./
RUN npm install

# Copier le reste du code (.dockerignore exclut node_modules et .env)
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
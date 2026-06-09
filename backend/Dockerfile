# Étape 1 — Build
FROM node:22.15.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Étape 2 — Production
FROM node:22.15.0-alpine

# Install Chromium
RUN apk add --no-cache chromium

ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && node dist/server.js"]
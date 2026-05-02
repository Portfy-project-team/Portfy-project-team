# Portfolio Backend

## Prérequis
- Node.js installé
- Docker Desktop installé et lancé

## Installation

1. Cloner le projet
git clone <lien-gitlab>
cd portfolio-backend

2. Installer les dépendances
npm install

3. Configurer les variables d'environnement
- Copier `.env.example` et renommer en `.env`
- Remplir les valeurs manquantes

4. Lancer la base de données
docker-compose up -d

5. Lancer la migration Prisma
npx prisma migrate dev

6. Vérifier les tables
npx prisma studio

7. Lancer le serveur
npm run dev


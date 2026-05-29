
# Portfy
 
## 📋 Prérequis
 
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclut Docker Compose)
- [Node.js](https://nodejs.org/) v22+
---
 
## ⚙️ Installation & Lancement
 
### 1. Cloner le projet
 
```bash
git clone <lien-gitlab>
cd portfy
```
 
### 2. Lancer tous les services
 
```bash
docker-compose up --build
```
 
En arrière-plan :
 
```bash
docker-compose up --build -d
```
 
### 3. Appliquer les migrations Prisma
 
```bash
docker exec -it portfy_backend npx prisma migrate deploy
```
 
---
 
## 🌐 Accès aux services
 
| Service     | URL                   |
|-------------|-----------------------|
| Frontend    | http://localhost      |
| Backend API | http://localhost:3000 |
| PostgreSQL  | localhost:5432        |
 
---
 
## 🛠️ Commandes utiles
 
```bash
# Voir les logs
docker-compose logs -f
 
# Logs d'un seul service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
 
# Arrêter les services
docker-compose down
 
# Arrêter ET supprimer les données
docker-compose down -v
 
# Reconstruire un seul service
docker-compose up --build backend
 
# Accéder au shell d'un conteneur
docker exec -it portfy_backend sh
docker exec -it portfy_db sh
```
 
---
 
## 🗄️ Base de données
 
```bash
# Ouvrir Prisma Studio → http://localhost:5555
docker exec -it portfy_backend npx prisma studio #Et après, accédez à http://localhost:5555 — ça va marcher ! 
 
# Créer une nouvelle migration
docker exec -it portfy_backend npx prisma migrate dev --name nom_de_la_migration
```
 
 
---
 
## ❓ Problèmes fréquents
 
**Le backend ne démarre pas ?**
→ Vérifie que les variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` sont bien remplies dans `.env`
 
**Port déjà utilisé ?**
→ Vérifie qu'aucun autre service n'utilise les ports `80`, `3000` ou `5432`
 
**Erreur de migration Prisma ?**
→ Essaie `docker-compose down -v` puis relance tout depuis le début
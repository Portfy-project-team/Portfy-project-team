# Portfy – Plateforme de Portfolios Numériques Adaptatifs et Certifiés

## 📖 Présentation

**Portfy** est une plateforme web conçue pour permettre aux étudiants de créer, gérer et valoriser leurs portfolios numériques de manière professionnelle, sécurisée et certifiée.

L'objectif principal est d'offrir aux étudiants un espace centralisé pour présenter leurs compétences, projets académiques, expériences et réalisations, tout en garantissant la crédibilité des informations grâce à un système de validation académique assuré par les enseignants et l'administration.

Ce projet a été réalisé dans le cadre du **Projet d’Intégration (PI) de la filière Génie Informatique – Année universitaire 2025/2026**.

---

## 🎯 Objectifs du projet

* Centraliser les réalisations académiques et professionnelles des étudiants.
* Générer automatiquement un portfolio professionnel.
* Valoriser les compétences techniques et comportementales.
* Mettre en place un système de validation académique des projets.
* Renforcer la crédibilité des portfolios auprès des recruteurs.
* Appliquer les bonnes pratiques DevSecOps dans le cycle de développement.

---

## 👥 Acteurs du système

### Étudiant

* Création et gestion du profil.
* Ajout de projets, compétences et expériences.
* Soumission des projets pour validation.
* Génération et personnalisation du portfolio.

### Professeur

* Consultation des projets soumis.
* Validation ou refus des projets académiques.
* Attribution de recommandations et commentaires.

### Administrateur

* Gestion des utilisateurs.
* Gestion des rôles et permissions.
* Supervision de la plateforme.

### Professionnel

* Consultation des portfolios publics.
* Commentaires et recommandations.
* Interaction avec les étudiants.

---

## ✨ Fonctionnalités principales

### 🔐 Authentification et sécurité

* Inscription et connexion sécurisées.
* Gestion des rôles (Étudiant, Professeur, Administrateur, Professionnel).
* Réinitialisation du mot de passe.
* Authentification basée sur JWT.

### 👤 Gestion du profil étudiant

* Informations personnelles.
* Parcours académique.
* Compétences techniques.
* Soft Skills.
* Expériences et réalisations.

### 📁 Gestion des projets

* Ajout et modification des projets.
* Téléversement de documents et preuves.
* Association de liens GitHub et YouTube.
* Suivi du statut de validation.

### ✅ Validation académique

* Soumission du projet.
* Vérification par un enseignant.
* Validation ou demande de correction.
* Publication dans le portfolio.

### 🌐 Génération automatique du portfolio

* Portfolio dynamique personnalisé.
* Portfolio public partageable.
* Mise en valeur des compétences et réalisations.

### 🔗 Intégration GitHub

* Liaison du compte GitHub.
* Synchronisation des dépôts publics.
* Analyse des contributions.
* Valorisation de l’activité de développement.

### 🔔 Notifications

* Validation ou refus de projets.
* Réception de commentaires.
* Réception de recommandations.
* Suivi des actions importantes.

---

## 🏗️ Architecture du projet

Le projet repose sur une architecture Client/Serveur moderne.

### Frontend

* Vue.js
* TypeScript
* Vite

### Backend

* NestJS
* TypeScript

### Base de données

* PostgreSQL

### ORM

* Prisma

### Infrastructure & DevOps

* Docker
* GitHub Actions
* SonarQube Cloud
* Trivy

---

## 🛠️ Technologies utilisées

| Catégorie           | Technologies             |
| ------------------- | ------------------------ |
| Frontend            | Vue.js, TypeScript, Vite |
| Backend             | NestJS, TypeScript       |
| Base de données     | PostgreSQL               |
| ORM                 | Prisma                   |
| Authentification    | JWT                      |
| Conteneurisation    | Docker                   |
| CI/CD               | GitHub Actions           |
| Qualité du code     | SonarQube                |
| Sécurité            | Trivy                    |
| Gestion de versions | Git & GitHub             |

---

## 🚀 Installation et exécution

### Prérequis

* Node.js
* PostgreSQL
* Docker (optionnel)
* Git

### Cloner le projet

```bash
git clone https://github.com/VOTRE-ORGANISATION/VOTRE-REPOSITORY.git
cd VOTRE-REPOSITORY
```

### Installation du Backend

```bash
cd backend

npm install

npx prisma generate

npm run start:dev
```

### Installation du Frontend

```bash
cd frontend

npm install

npm run dev
```

### Migration de la base de données

```bash
npx prisma migrate dev
```

---

## 🧪 Qualité et Sécurité

Dans une démarche DevSecOps, plusieurs outils ont été intégrés :

* Analyse statique du code avec SonarQube.
* Scan de vulnérabilités avec Trivy.
* Pipeline CI/CD automatisé.
* Utilisation de Docker pour la reproductibilité des environnements.
* Respect des bonnes pratiques de développement sécurisé.

---

## 📂 Structure du projet

```text
Portfy/
│
├── frontend/
│   ├── src/
│   └── public/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── tests/
│
├── .github/
│   └── workflows/
│
├── docker/
│
└── README.md
```

---

## 👨‍💻 Équipe du projet

Projet réalisé par les étudiants de première année Génie Informatique dans le cadre du Projet d’Intégration (PI).

**Année universitaire : 2025 – 2026**

**Encadrant : Pr. M. Ghailani**

---

## 📜 Licence

Ce projet est développé dans un cadre pédagogique et académique.

© 2026 – Équipe Portfy

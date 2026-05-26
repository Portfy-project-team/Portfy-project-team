/**
 * Mock - Projets de l'etudiant
 * Selon le cahier des charges objectifs 3 et 4
 */

import { STATUS } from '../constants/statuses.js'
import { PROJECT_TYPES } from '../constants/projectTypes.js'

export const mockProjects = [
  {
    id: 1,
    titre: 'API REST avec Node.js',
    description: 'Developpement d\'une API RESTful complete avec authentification JWT, validation des donnees et documentation Swagger. Le projet inclut la gestion des utilisateurs, des permissions et un systeme de notifications.',
    descriptionCourte: 'Developpement d\'une API RESTful complete avec authentification JWT et documentation Swagger.',
    type: PROJECT_TYPES.MODULE,
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    role: 'Lead developer',
    equipeSize: 3,
    duree: '2 mois',
    githubUrl: 'https://github.com/ahmed-alami/api-rest',
    demoUrl: 'https://youtube.com/watch?v=demo',
    encadrant: 'Pr. Benali',
    encadrantId: 2,
    status: STATUS.VALIDE,
    appreciation: 'Excellent travail sur l\'architecture de l\'API. La documentation est claire et les endpoints sont bien structures.',
    dateValidation: '2025-03-28T14:32:00Z',
    dateCreation: '2025-03-01T10:00:00Z',
    moisAffichage: 'Mars 2025'
  },
  {
    id: 2,
    titre: 'Systeme de gestion des notes',
    description: 'Application web de gestion des notes pour les enseignants avec tableau de bord analytique et generation de bulletins.',
    descriptionCourte: 'Application web de gestion des notes pour les enseignants avec tableau de bord analytique.',
    type: PROJECT_TYPES.INTEGRATION,
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    role: 'Full Stack Developer',
    equipeSize: 4,
    duree: '3 mois',
    githubUrl: 'https://github.com/ahmed-alami/notes-system',
    demoUrl: '',
    encadrant: 'Pr. Benali',
    encadrantId: 2,
    status: STATUS.CORRECTION,
    correctionMessage: 'Veuillez corriger la gestion des erreurs dans le module d\'authentification et ajouter des tests unitaires.',
    dateValidation: null,
    dateCreation: '2025-02-15T08:00:00Z',
    moisAffichage: 'Fevrier 2025'
  },
  {
    id: 3,
    titre: 'E-commerce Dashboard',
    description: 'Interface d\'administration pour une plateforme e-commerce avec gestion des produits, commandes et statistiques en temps reel.',
    descriptionCourte: 'Interface d\'administration pour une plateforme e-commerce avec gestion des produits et commandes.',
    type: PROJECT_TYPES.PERSONNEL,
    technologies: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    role: 'Lead developer',
    equipeSize: 1,
    duree: '1 mois',
    githubUrl: 'https://github.com/ahmed-alami/ecommerce-dashboard',
    demoUrl: 'https://demo.ahmed-alami.com',
    encadrant: null,
    encadrantId: null,
    status: STATUS.EN_ATTENTE,
    dateValidation: null,
    dateCreation: '2025-01-10T09:00:00Z',
    moisAffichage: 'Janvier 2025'
  },
  {
    id: 4,
    titre: 'Application de chat temps reel',
    description: 'Application de messagerie instantanee avec support des salons de discussion, partage de fichiers et notifications.',
    descriptionCourte: 'Application de messagerie instantanee avec support des salons de discussion.',
    type: PROJECT_TYPES.INTEGRATION,
    technologies: ['Socket.io', 'React', 'Node.js'],
    role: 'Full Stack Developer',
    equipeSize: 2,
    duree: '6 semaines',
    githubUrl: 'https://github.com/ahmed-alami/chat-app',
    demoUrl: '',
    encadrant: 'Pr. Idrissi',
    encadrantId: 3,
    status: STATUS.VALIDE,
    appreciation: 'Tres bon projet. Bonne maitrise des websockets.',
    dateValidation: '2024-12-20T16:00:00Z',
    dateCreation: '2024-11-05T10:00:00Z',
    moisAffichage: 'Decembre 2024'
  },
  {
    id: 5,
    titre: 'Portfolio personnel',
    description: 'Site web portfolio responsive presentant mes projets et competences.',
    descriptionCourte: 'Site web portfolio responsive presentant mes projets et competences.',
    type: PROJECT_TYPES.PERSONNEL,
    technologies: ['Next.js', 'Framer Motion', 'Tailwind'],
    role: 'Solo',
    equipeSize: 1,
    duree: '2 semaines',
    githubUrl: '',
    demoUrl: '',
    encadrant: null,
    encadrantId: null,
    status: STATUS.BROUILLON,
    dateValidation: null,
    dateCreation: '2024-11-01T10:00:00Z',
    moisAffichage: 'Novembre 2024'
  }
]

export default mockProjects
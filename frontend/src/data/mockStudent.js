/**
 * Mock - Donnees de l'etudiant connecte
 */

import { ROLES } from '../constants/roles.js'

export const mockStudent = {
  id: 1,
  prenom: 'Ahmed',
  nom: 'Alami',
  email: 'ahmed.alami@ensat.ac.ma',
  telephone: '+212 6 12 34 56 78',
  role: ROLES.ETUDIANT,
  avatar: null,
  initiales: 'AA',

  // Informations academiques
  etablissement: 'ENSA Tanger',
  filiere: 'Genie Informatique',
  anneeEtudes: '1ere annee',
  anneePromotion: '2028',
  ville: 'Tanger',
  pays: 'Maroc',

  // Bio
  bio: 'Passionne par le developpement web et les nouvelles technologies. Specialise en React, Node.js et architecture moderne.',
  titreProfessionnel: 'Developpeur Web Full Stack',

  // Score de credibilite (objectif 2)
  scoreCredibilite: 82,
  niveau: 'Avance',

  // Detail du score
  scoreDetail: {
    projets: { obtenu: 15, max: 20 },
    stages: { obtenu: 20, max: 20 },
    recommandations: { obtenu: 12, max: 15 },
    contributionsGit: { obtenu: 10, max: 15 },
    completudeProfile: { obtenu: 15, max: 15 }
  },

  // Liens professionnels
  linkedinUrl: 'https://linkedin.com/in/ahmed-alami',
  githubUrl: 'https://github.com/ahmed-alami',
  siteWebUrl: '',

  // Stats
  stats: {
    totalProjets: 5,
    projetsValides: 3,
    totalStages: 2,
    stagesValides: 1,
    totalBadges: 3,
    totalRecommandations: 8
  },

  // Preferences
  preferences: {
    theme: 'clair',
    langue: 'fr',
    notifications: {
      validationProjet: true,
      nouvellesRecommandations: true,
      commentairesRecus: true,
      rappelsCompletion: true
    }
  },

  // Portfolio
  portfolio: {
    objectif: 'WEB',
    template: 'MODERN',
    visibilite: 'PUBLIC',
    lienPublic: 'portfy.com/p/ahmed-alami',
    certifie: true
  },

  // Dates
  createdAt: '2024-09-15T10:30:00Z',
  updatedAt: '2025-03-28T14:32:00Z'
}

export default mockStudent
/**
 * Roles des utilisateurs dans Portfy
 * Source: Cahier des charges - 4 types d'utilisateurs
 */

export const ROLES = {
  ETUDIANT: 'ETUDIANT',
  PROFESSEUR: 'PROFESSEUR',
  ADMIN: 'ADMIN',
  PROFESSIONNEL: 'PROFESSIONNEL'
}

export const ROLE_LABELS = {
  [ROLES.ETUDIANT]: 'Etudiant',
  [ROLES.PROFESSEUR]: 'Professeur',
  [ROLES.ADMIN]: 'Administrateur',
  [ROLES.PROFESSIONNEL]: 'Professionnel'
}

export const ROLE_COLORS = {
  [ROLES.ETUDIANT]: { bg: '#FCE5E5', text: '#C42E2E' },
  [ROLES.PROFESSEUR]: { bg: '#FFF4E0', text: '#B7820F' },
  [ROLES.ADMIN]: { bg: '#0A2540', text: '#FFFFFF' },
  [ROLES.PROFESSIONNEL]: { bg: '#E6F1FB', text: '#185FA5' }
}
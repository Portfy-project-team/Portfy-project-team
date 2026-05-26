/**
 * Types de projets dans Portfy
 * Selon le cahier des charges objectif 3
 */

export const PROJECT_TYPES = {
  MODULE: 'MODULE',
  INTEGRATION: 'INTEGRATION',
  PERSONNEL: 'PERSONNEL',
  HACKATHON: 'HACKATHON',
  ASSOCIATIF: 'ASSOCIATIF'
}

export const PROJECT_TYPE_LABELS = {
  [PROJECT_TYPES.MODULE]: 'Projet de module',
  [PROJECT_TYPES.INTEGRATION]: 'Projet d\'integration',
  [PROJECT_TYPES.PERSONNEL]: 'Projet personnel',
  [PROJECT_TYPES.HACKATHON]: 'Hackathon',
  [PROJECT_TYPES.ASSOCIATIF]: 'Projet associatif'
}

export const ACTIVITY_TYPES = {
  HACKATHON: 'HACKATHON',
  CLUB: 'CLUB',
  EVENEMENT: 'EVENEMENT',
  COMPETITION: 'COMPETITION',
  ASSOCIATION: 'ASSOCIATION'
}

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.HACKATHON]: 'Hackathon',
  [ACTIVITY_TYPES.CLUB]: 'Club',
  [ACTIVITY_TYPES.EVENEMENT]: 'Evenement',
  [ACTIVITY_TYPES.COMPETITION]: 'Competition',
  [ACTIVITY_TYPES.ASSOCIATION]: 'Association'
}
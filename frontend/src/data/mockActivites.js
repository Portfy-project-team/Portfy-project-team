/**
 * Mock - Activites parascolaires
 * Selon le cahier des charges objectif 6
 */

import { STATUS } from '../constants/statuses.js'
import { ACTIVITY_TYPES } from '../constants/projectTypes.js'

export const mockActivites = [
  {
    id: 1,
    nom: 'Hackathon UMBP 2024',
    type: ACTIVITY_TYPES.HACKATHON,
    role: 'Participant - Equipe gagnante',
    organisation: 'UMBP',
    dateDebut: '2024-03-01',
    dateFin: '2024-03-03',
    periodeAffichage: 'Mars 2024',
    description: 'Hackathon de 48h sur l\'innovation dans l\'agritech. Notre equipe a remporte le premier prix avec une solution IoT.',
    attestationUrl: '/attestations/hackathon-umbp.pdf',
    status: STATUS.VALIDE
  },
  {
    id: 2,
    nom: 'Club Informatique ENSA',
    type: ACTIVITY_TYPES.CLUB,
    role: 'Vice-president',
    organisation: 'ENSA Tanger',
    dateDebut: '2023-09-01',
    dateFin: '2025-06-30',
    periodeAffichage: '2023 - 2025',
    description: 'Vice-president du club informatique de l\'ENSA Tanger. Organisation de workshops et evenements technologiques.',
    attestationUrl: '/attestations/club-info.pdf',
    status: STATUS.VALIDE
  },
  {
    id: 3,
    nom: 'Organisation Workshop DevOps',
    type: ACTIVITY_TYPES.EVENEMENT,
    role: 'Organisateur principal',
    organisation: 'Club Informatique',
    dateDebut: '2024-02-15',
    dateFin: '2024-02-17',
    periodeAffichage: 'Fevrier 2024',
    description: 'Organisation d\'un workshop de 3 jours sur le DevOps reunissant 80 participants.',
    attestationUrl: '/attestations/workshop-devops.pdf',
    status: STATUS.VALIDE
  },
  {
    id: 4,
    nom: 'Competition ACM ICPC',
    type: ACTIVITY_TYPES.COMPETITION,
    role: 'Participant',
    organisation: 'ACM',
    dateDebut: '2024-12-10',
    dateFin: '2024-12-12',
    periodeAffichage: 'Decembre 2024',
    description: 'Participation a la competition de programmation ACM ICPC regionale.',
    attestationUrl: '',
    status: STATUS.EN_ATTENTE
  },
  {
    id: 5,
    nom: 'Association Etudiante Solidaire',
    type: ACTIVITY_TYPES.ASSOCIATION,
    role: 'Membre actif',
    organisation: 'ENSA Tanger',
    dateDebut: '2024-01-15',
    dateFin: null,
    periodeAffichage: '2024 - Present',
    description: 'Membre actif de l\'association solidaire. Organisation d\'evenements caritatifs.',
    attestationUrl: '',
    status: STATUS.EN_ATTENTE
  }
]

export const mockActivitesStats = {
  total: 5,
  verifiees: 3,
  enAttente: 2
}

export default mockActivites
/**
 * Mock - Lettres de recommandation
 * Selon le cahier des charges objectif 7
 */

import { STATUS } from '../constants/statuses.js'

export const mockLettres = [
  {
    id: 1,
    auteur: 'Pr. Mohamed Benali',
    auteurInitiales: 'MB',
    auteurRole: 'Professeur',
    auteurTitre: 'ENSA Tanger - Genie Informatique',
    auteurId: 2,
    objet: 'Candidature double diplomation',
    contenu: 'Ahmed est un etudiant exceptionnel doue d\'une grande capacite d\'analyse. Je le recommande chaleureusement pour le programme de double diplomation. Son travail sur l\'API REST a demontre une comprehension approfondie des architectures backend modernes.',
    visibilite: 'PUBLIC',
    status: STATUS.VALIDE,
    pdfUrl: '/lettres/benali-doubdipl.pdf',
    dateCreation: '2025-03-10T10:00:00Z',
    dateValidation: '2025-03-15T14:00:00Z',
    moisAffichage: 'Mars 2025'
  },
  {
    id: 2,
    auteur: 'Pr. Fatima Idrissi',
    auteurInitiales: 'FI',
    auteurRole: 'Professeur',
    auteurTitre: 'ENSA Tanger - Directrice de departement',
    auteurId: 3,
    objet: 'Candidature Master',
    contenu: 'Excellente etudiante, motivee et engagee. Sa contribution au club informatique demontre un leadership remarquable. Je recommande sa candidature pour le programme de Master.',
    visibilite: 'PRIVE',
    status: STATUS.VALIDE,
    pdfUrl: '/lettres/idrissi-master.pdf',
    dateCreation: '2025-01-05T10:00:00Z',
    dateValidation: '2025-01-10T14:00:00Z',
    moisAffichage: 'Janvier 2025'
  },
  {
    id: 3,
    auteur: 'Pr. Hassan Berrada',
    auteurInitiales: 'HB',
    auteurRole: 'Professeur',
    auteurTitre: 'ENSA Tanger - Bases de donnees',
    auteurId: 4,
    objet: 'Stage de fin d\'etudes',
    contenu: null,
    visibilite: 'PRIVE',
    status: STATUS.EN_ATTENTE,
    pdfUrl: '',
    dateCreation: '2025-04-12T10:00:00Z',
    dateValidation: null,
    moisAffichage: 'Avril 2025'
  }
]

export const mockLettresStats = {
  total: 4,
  validees: 3,
  enAttente: 1
}

export default mockLettres
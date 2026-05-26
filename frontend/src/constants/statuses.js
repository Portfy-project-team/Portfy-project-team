/**
 * Statuts utilises dans toute l'application
 * Pour projets, stages, activites, lettres, etc.
 */

export const STATUS = {
  BROUILLON: 'BROUILLON',
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDE: 'VALIDE',
  REFUSE: 'REFUSE',
  CORRECTION: 'CORRECTION'
}

export const STATUS_LABELS = {
  [STATUS.BROUILLON]: 'Brouillon',
  [STATUS.EN_ATTENTE]: 'En attente',
  [STATUS.VALIDE]: 'Valide',
  [STATUS.REFUSE]: 'Refuse',
  [STATUS.CORRECTION]: 'Correction'
}

export const STATUS_COLORS = {
  [STATUS.BROUILLON]: { bg: '#E5E7EB', text: '#4B5563' },
  [STATUS.EN_ATTENTE]: { bg: '#FFF4D6', text: '#B7820F' },
  [STATUS.VALIDE]: { bg: '#D4F4E2', text: '#1F7A4D' },
  [STATUS.REFUSE]: { bg: '#FCE5E5', text: '#C42E2E' },
  [STATUS.CORRECTION]: { bg: '#FFE4D9', text: '#C2410C' }
}

export const STATUS_ICONS = {
  [STATUS.BROUILLON]: 'ti-file',
  [STATUS.EN_ATTENTE]: 'ti-clock',
  [STATUS.VALIDE]: 'ti-circle-check',
  [STATUS.REFUSE]: 'ti-x',
  [STATUS.CORRECTION]: 'ti-alert-triangle'
}
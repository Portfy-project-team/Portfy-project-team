/**
 * Niveaux de visibilite du portfolio
 * Selon le cahier des charges objectif 8
 */

export const VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVE: 'PRIVE',
  ENSEIGNANTS: 'ENSEIGNANTS',
  LIEN: 'LIEN'
}

export const VISIBILITY_LABELS = {
  [VISIBILITY.PUBLIC]: 'Public',
  [VISIBILITY.PRIVE]: 'Prive',
  [VISIBILITY.ENSEIGNANTS]: 'Enseignants seulement',
  [VISIBILITY.LIEN]: 'Via lien partage'
}

export const VISIBILITY_DESCRIPTIONS = {
  [VISIBILITY.PUBLIC]: 'Visible par tous les utilisateurs et indexe par les moteurs de recherche',
  [VISIBILITY.PRIVE]: 'Visible uniquement par vous',
  [VISIBILITY.ENSEIGNANTS]: 'Visible par les enseignants et professionnels de votre etablissement',
  [VISIBILITY.LIEN]: 'Accessible uniquement avec le lien partage'
}

export const VISIBILITY_ICONS = {
  [VISIBILITY.PUBLIC]: 'ti-world',
  [VISIBILITY.PRIVE]: 'ti-lock',
  [VISIBILITY.ENSEIGNANTS]: 'ti-school',
  [VISIBILITY.LIEN]: 'ti-link'
}
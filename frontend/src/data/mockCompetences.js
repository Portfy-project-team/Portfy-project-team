/**
 * Mock - Competences techniques, soft skills et langues
 * Selon le cahier des charges objectif 10
 */

export const CATEGORIES_COMPETENCES = {
  TECHNIQUE: 'TECHNIQUE',
  SOFT_SKILL: 'SOFT_SKILL',
  LANGUE: 'LANGUE'
}

export const CATEGORIE_LABELS = {
  [CATEGORIES_COMPETENCES.TECHNIQUE]: 'Technique',
  [CATEGORIES_COMPETENCES.SOFT_SKILL]: 'Soft Skill',
  [CATEGORIES_COMPETENCES.LANGUE]: 'Langue'
}

export const mockCompetences = [
  // Techniques
  { id: 1, nom: 'JavaScript', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 85, source: 'Projets academiques' },
  { id: 2, nom: 'React.js', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 80, source: 'Projets academiques' },
  { id: 3, nom: 'Node.js', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 75, source: 'Projets academiques' },
  { id: 4, nom: 'Python', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 70, source: 'Formations' },
  { id: 5, nom: 'SQL / PostgreSQL', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 75, source: 'Projets academiques' },
  { id: 6, nom: 'Docker', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 60, source: 'Certifications' },
  { id: 7, nom: 'Git / GitHub', categorie: CATEGORIES_COMPETENCES.TECHNIQUE, niveau: 85, source: 'Contributions' },

  // Soft Skills
  { id: 8, nom: 'Travail en equipe', categorie: CATEGORIES_COMPETENCES.SOFT_SKILL, niveau: 90, source: 'Projets' },
  { id: 9, nom: 'Communication', categorie: CATEGORIES_COMPETENCES.SOFT_SKILL, niveau: 85, source: 'Activites' },
  { id: 10, nom: 'Resolution de problemes', categorie: CATEGORIES_COMPETENCES.SOFT_SKILL, niveau: 80, source: 'Hackathons' },

  // Langues
  { id: 11, nom: 'Francais', categorie: CATEGORIES_COMPETENCES.LANGUE, niveau: 100, source: 'Natif' },
  { id: 12, nom: 'Anglais', categorie: CATEGORIES_COMPETENCES.LANGUE, niveau: 85, source: 'TOEFL' },
  { id: 13, nom: 'Arabe', categorie: CATEGORIES_COMPETENCES.LANGUE, niveau: 100, source: 'Natif' }
]

export const mockCompetencesStats = {
  techniques: 7,
  softSkills: 3,
  langues: 3,
  total: 13
}

export default mockCompetences
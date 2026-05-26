/**
 * Mock - Stages de l'etudiant
 * Selon le cahier des charges objectif 5
 */

import { STATUS } from '../constants/statuses.js'

export const mockStages = [
  {
    id: 1,
    entreprise: 'OCP Group',
    poste: 'Developpeur Full Stack Stagiaire',
    ville: 'Casablanca',
    pays: 'Maroc',
    dateDebut: '2024-07-01',
    dateFin: '2024-08-31',
    duree: '2 mois',
    periodeAffichage: 'Juillet 2024 - Aout 2024',
    missions: [
      'Developpement d\'une application interne de gestion des ressources',
      'Integration d\'APIs REST avec le systeme existant',
      'Mise en place de tests automatises'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    encadrantEntreprise: 'M. Hassan Benjelloun',
    encadrantEntrepriseEmail: 'h.benjelloun@ocpgroup.ma',
    encadrantAcademique: 'Pr. Benali',
    encadrantAcademiqueId: 2,
    status: STATUS.VALIDE,
    appreciation: 'Stagiaire serieux et engage. Excellent travail.',
    rapportPdfUrl: '/rapports/stage-ocp-2024.pdf',
    attestationUrl: '/attestations/stage-ocp-2024.pdf',
    dateValidation: '2024-09-15T10:00:00Z'
  },
  {
    id: 2,
    entreprise: 'Capgemini Morocco',
    poste: 'Stagiaire DevOps',
    ville: 'Rabat',
    pays: 'Maroc',
    dateDebut: '2025-01-15',
    dateFin: '2025-02-15',
    duree: '1 mois',
    periodeAffichage: 'Janvier 2025 - Fevrier 2025',
    missions: [
      'Configuration de pipelines CI/CD avec Jenkins',
      'Automatisation du deploiement avec Ansible',
      'Monitoring des applications avec Grafana'
    ],
    technologies: ['Jenkins', 'Docker', 'Kubernetes', 'Ansible'],
    encadrantEntreprise: 'Mme. Fatima Zahra',
    encadrantEntrepriseEmail: 'f.zahra@capgemini.com',
    encadrantAcademique: 'Pr. Idrissi',
    encadrantAcademiqueId: 3,
    status: STATUS.EN_ATTENTE,
    appreciation: null,
    rapportPdfUrl: '',
    attestationUrl: '',
    dateValidation: null
  }
]

export default mockStages
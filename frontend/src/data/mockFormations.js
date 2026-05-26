/**
 * Mock - Formations et certifications
 */

import { STATUS } from '../constants/statuses.js'

export const mockFormations = [
  {
    id: 1,
    titre: 'Full Stack Web Development',
    organisme: 'freeCodeCamp',
    type: 'Certification',
    description: 'Formation complete sur le developpement web moderne.',
    technologies: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
    progression: 100,
    dateDebut: '2024-09-01',
    dateFin: '2025-01-15',
    dateCertification: '2025-01-15',
    certificatUrl: '/certificats/fcc-fullstack.pdf',
    status: STATUS.VALIDE,
    icone: 'ti-certificate',
    couleur: 'gold'
  },
  {
    id: 2,
    titre: 'AWS Cloud Practitioner',
    organisme: 'Amazon Web Services',
    type: 'Certification',
    description: 'Certification fondamentale AWS sur les services cloud.',
    technologies: ['AWS', 'Cloud Computing', 'DevOps'],
    progression: 100,
    dateDebut: '2024-10-01',
    dateFin: '2024-12-15',
    dateCertification: '2024-12-15',
    certificatUrl: '/certificats/aws-cp.pdf',
    status: STATUS.VALIDE,
    icone: 'ti-cloud',
    couleur: 'blue'
  },
  {
    id: 3,
    titre: 'Machine Learning Specialization',
    organisme: 'Coursera - Stanford',
    type: 'MOOC',
    description: 'Specialisation en Machine Learning par Andrew Ng.',
    technologies: ['Python', 'TensorFlow', 'Machine Learning'],
    progression: 65,
    dateDebut: '2024-11-01',
    dateFin: null,
    dateCertification: null,
    certificatUrl: '',
    status: STATUS.EN_ATTENTE,
    icone: 'ti-brain',
    couleur: 'purple'
  },
  {
    id: 4,
    titre: 'Docker & Kubernetes Masterclass',
    organisme: 'Udemy',
    type: 'Cours',
    description: 'Maitrise complete de Docker et Kubernetes.',
    technologies: ['Docker', 'Kubernetes', 'CI/CD'],
    progression: 45,
    dateDebut: '2025-01-01',
    dateFin: null,
    dateCertification: null,
    certificatUrl: '',
    status: STATUS.EN_ATTENTE,
    icone: 'ti-server',
    couleur: 'green'
  },
  {
    id: 5,
    titre: 'Cybersecurity Fundamentals',
    organisme: 'IBM SkillsBuild',
    type: 'Certification',
    description: 'Fondamentaux de la cybersecurite.',
    technologies: ['Security', 'Networking', 'Ethical Hacking'],
    progression: 0,
    dateDebut: null,
    dateFin: null,
    dateCertification: null,
    certificatUrl: '',
    status: STATUS.BROUILLON,
    icone: 'ti-shield',
    couleur: 'red'
  }
]

export default mockFormations
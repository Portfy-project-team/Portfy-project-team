/**
 * Mock - Badges de competences (gamification)
 * Fonctionnalite optionnelle du cahier des charges
 */

export const mockBadges = {
  niveauActuel: 'Avance',
  niveauProgress: 60,
  prochainNiveau: 'Expert',
  badgesNecessaires: 2,

  obtenus: [
    {
      id: 1,
      nom: 'Web Developer',
      description: '3 projets web valides',
      icone: 'ti-code',
      gradient: 'linear-gradient(135deg, #FFF4E0, #E8A020)',
      couleurAccent: '#E8A020',
      dateObtention: '2025-03-12T10:00:00Z',
      dateAffichage: '12 Mars 2025'
    },
    {
      id: 2,
      nom: 'DevOps Beginner',
      description: 'Docker + CI/CD utilises',
      icone: 'ti-server',
      gradient: 'linear-gradient(135deg, #E1F5EE, #0F6E56)',
      couleurAccent: '#0F6E56',
      dateObtention: '2025-04-05T10:00:00Z',
      dateAffichage: '5 Avril 2025'
    },
    {
      id: 3,
      nom: 'Hackathon',
      description: 'Participation UMBP 2024',
      icone: 'ti-trophy',
      gradient: 'linear-gradient(135deg, #E6F1FB, #185FA5)',
      couleurAccent: '#185FA5',
      dateObtention: '2024-03-08T10:00:00Z',
      dateAffichage: '8 Mars 2024'
    }
  ],

  enCours: [
    {
      id: 4,
      nom: 'Full Stack',
      description: 'Frontend + Backend',
      icone: 'ti-stack',
      progression: 75,
      progressionLabel: '3 / 4 projets',
      objectif: 4,
      actuel: 3
    }
  ],

  aDebloquer: [
    {
      id: 5,
      nom: 'AI / Data',
      description: 'Projet IA',
      icone: 'ti-brain',
      condition: 'Realiser un projet en intelligence artificielle ou data science'
    },
    {
      id: 6,
      nom: 'Security Aware',
      description: 'Bonnes pratiques securite',
      icone: 'ti-shield',
      condition: 'Obtenir une certification en cybersecurite'
    },
    {
      id: 7,
      nom: 'Collaboration',
      description: 'Projets equipe',
      icone: 'ti-users',
      condition: 'Participer a 5 projets en equipe'
    },
    {
      id: 8,
      nom: 'Innovator',
      description: 'Projet innovant',
      icone: 'ti-rocket',
      condition: 'Realiser un projet original et innovant valide par un jury'
    }
  ]
}

export default mockBadges
// src/data/mockData.js

export const currentUser = {
  name: 'Insaf Hamdane',
  school: 'ENSA Tanger',
  initials: 'AA',
  score: 82
}

// ACTIVITES
export const activities = [
  {
    id: 1,
    title: 'Hackathon UMBP 2024',
    role: 'Participant - Equipe gagnante',
    type: 'Hackathon',
    typeClass: 'type-hackathon',
    organisation: 'UMBP',
    periode: 'Mars 2024',
    status: 'Verifiee',
    actions: ['Attestation', 'Modifier']
  },
  {
    id: 2,
    title: 'Club Informatique ENSA',
    role: 'Vice-president',
    type: 'Club',
    typeClass: 'type-club',
    organisation: 'ENSA Tanger',
    periode: '2023 - 2025',
    status: 'Verifiee',
    actions: ['Attestation', 'Modifier']
  },
  {
    id: 3,
    title: 'Workshop DevOps',
    role: 'Organisateur principal',
    type: 'Evenement',
    typeClass: 'type-event',
    organisation: 'Club Informatique',
    periode: 'Fevrier 2024',
    status: 'Verifiee',
    actions: ['Attestation', 'Modifier']
  },
  {
    id: 4,
    title: 'Competition ACM ICPC',
    role: 'Participant',
    type: 'Competition',
    typeClass: 'type-competition',
    organisation: 'ACM',
    periode: 'Decembre 2024',
    status: 'En attente',
    actions: ['Modifier']
  },
  {
    id: 5,
    title: 'Association Solidaire',
    role: 'Membre actif',
    type: 'Association',
    typeClass: 'type-association',
    organisation: 'ENSA Tanger',
    periode: '2024 - Present',
    status: 'En attente',
    actions: ['Modifier']
  }
]

// BADGES
export const obtainedBadges = [
  {
    title: 'Web Developer',
    subtitle: '3 projets web valides',
    date: '12 Mars 2025',
    color: 'gold',
    locked: false
  },
  {
    title: 'DevOps Beginner',
    subtitle: 'Docker + CI/CD',
    date: '5 Avril 2025',
    color: 'green',
    locked: false
  },
  {
    title: 'Hackathon',
    subtitle: 'UMBP 2024',
    date: '8 Mars 2024',
    color: 'blue',
    locked: false
  },
  {
    title: 'Full Stack',
    subtitle: 'Frontend + Backend',
    progress: '3/4 projets',
    color: 'gray',
    locked: true,
    progressValue: 75
  }
]

export const lockedBadges = [
  {
    title: 'AI / Data',
    subtitle: 'Projet IA'
  },
  {
    title: 'Security',
    subtitle: 'Bonnes pratiques'
  },
  {
    title: 'Collaboration',
    subtitle: 'Projets equipe'
  },
  {
    title: 'Innovator',
    subtitle: 'Projet innovant'
  }
]

// FAQ AIDE
export const helpCards = [
  {
    title: 'Guide de demarrage',
    description: 'Apprenez a utiliser Portfy pas a pas',
    color: 'cream'
  },
  {
    title: 'Nous contacter',
    description: 'Envoyez-nous un message direct',
    color: 'blue'
  },
  {
    title: 'Tutoriels video',
    description: 'Regardez nos tutoriels en video',
    color: 'green'
  }
]

export const questions = [
  {
    title: 'Comment ajouter un projet ?',
    description: 'Guide complet pour ajouter et soumettre un projet a validation'
  },
  {
    title: 'Comment fonctionne la validation ?',
    description: 'Le processus de validation par les enseignants explique'
  },
  {
    title: 'Comment exporter mon portfolio en PDF ?',
    description: 'Generez votre portfolio au format PDF en un clic'
  },
  {
    title: 'Comment connecter mon compte GitHub ?',
    description: 'Synchronisez vos contributions Git automatiquement'
  },
  {
    title: 'Comment calculer mon score de credibilite ?',
    description: 'Decouvrez les criteres qui composent votre score sur 100'
  }
]
// FORMATIONS
export const formations = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    provider: 'freeCodeCamp',
    status: 'Certifie',
    iconColor: 'cream',
    progress: 100,
    progressColor: 'green',
    label: 'Certification',
    date: 'Janvier 2025',
    tags: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
    links: ['Certificat', 'Voir']
  },
  {
    id: 2,
    title: 'AWS Cloud Practitioner',
    provider: 'Amazon Web Services',
    status: 'Certifie',
    iconColor: 'blue',
    progress: 100,
    progressColor: 'blue-green',
    label: 'Certification',
    date: 'Decembre 2024',
    tags: ['AWS', 'Cloud', 'DevOps'],
    links: ['Certificat', 'Voir']
  },
  {
    id: 3,
    title: 'Machine Learning',
    provider: 'Coursera - Stanford',
    status: 'En attente',
    iconColor: 'purple',
    progress: 65,
    progressColor: 'purple-orange',
    label: 'MOOC',
    date: 'En cours',
    tags: ['Python', 'TensorFlow'],
    links: ['Voir']
  },
  {
    id: 4,
    title: 'Cybersecurity',
    provider: 'IBM SkillsBuild',
    status: 'Brouillon',
    iconColor: 'pink',
    progress: 0,
    progressColor: 'gray',
    label: 'Certification',
    date: 'Planifie',
    tags: ['Security', 'Networking'],
    links: ['Voir']
  }
]
// DASHBOARD
export const dashboardStats = [
  {
    id: 1,
    title: 'Projets',
    value: 5,
    subtitle: '↑ +2 ce mois',
    color: 'cream',
    subtitleColor: 'green'
  },
  {
    id: 2,
    title: 'Valides',
    value: 3,
    subtitle: 'Sur 5 projets',
    color: 'green',
    subtitleColor: 'gray'
  },
  {
    id: 3,
    title: 'Stages',
    value: 2,
    subtitle: '1 en cours',
    color: 'blue',
    subtitleColor: 'gray'
  },
  {
    id: 4,
    title: 'Score',
    value: 82,
    unit: '/100',
    subtitle: 'Niveau Avance',
    color: 'yellow',
    subtitleColor: 'orange'
  }
]

export const scoreDetails = [
  {
    label: 'Projets',
    percent: 15,
    max: 20
  },
  {
    label: 'Stages',
    percent: 20,
    max: 20
  },
  {
    label: 'Recommandations',
    percent: 12,
    max: 15
  },
  {
    label: 'Git',
    percent: 10,
    max: 15
  },
  {
    label: 'Profil',
    percent: 15,
    max: 15
  }
]

export const recentActivities = [
  {
    id: 1,
    color: 'green',
    text: 'Projet API REST valide par Pr. Benali',
    time: 'Il y a 2 heures'
  },
  {
    id: 2,
    color: 'orange',
    text: 'Commentaire de Pr. Benali',
    time: 'Il y a 5 heures'
  },
  {
    id: 3,
    color: 'purple',
    text: 'Badge Web Developer obtenu',
    time: 'Hier'
  },
  {
    id: 4,
    color: 'blue',
    text: 'Stage OCP Group ajoute',
    time: 'Il y a 3 jours'
  }
]
// PROJECTS
export const projects = [
  {
    id: 1,
    title: 'API REST avec Node.js',
    type: 'Projet de module',
    description: "Developpement d'une API RESTful avec authentification JWT et documentation Swagger.",
    status: 'Valide',
    tags: ['Node.js', 'Express', 'MongoDB'],
    date: 'Mars 2025',
    supervisor: 'Pr. Benali'
  },
  {
    id: 2,
    title: 'Systeme de gestion des notes',
    type: "Projet d'integration",
    description: 'Application web de gestion des notes pour les enseignants.',
    status: 'Correction',
    correction: "Corriger l'authentification et ajouter des tests",
    tags: ['React', 'PostgreSQL'],
    date: 'Fevrier 2025',
    supervisor: 'Pr. Benali'
  },
  {
    id: 3,
    title: 'E-commerce Dashboard',
    type: 'Projet personnel',
    description: "Interface d'administration pour plateforme e-commerce.",
    status: 'En attente',
    tags: ['Next.js', 'Tailwind'],
    date: 'Janvier 2025',
    supervisor: ''
  },
  {
    id: 4,
    title: 'Application de chat temps reel',
    type: "Projet d'integration",
    description: 'Application de messagerie instantanee avec salons de discussion.',
    status: 'Valide',
    tags: ['Socket.io', 'React'],
    date: 'Decembre 2024',
    supervisor: 'Pr. Idrissi'
  }
]
// STAGES
export const stages = [
  {
    id: 1,
    company: 'OCP Group',
    position: 'Developpeur Full Stack Stagiaire',
    location: 'Casablanca, Maroc',
    period: 'Juillet 2024 a Aout 2024',
    duration: '2 mois',
    status: 'Valide',
    iconColor: 'blue',
    missions: [
      "Developpement d'une application de gestion des ressources",
      "Integration d'APIs REST avec systeme existant",
      'Mise en place de tests automatises'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    companySupervisor: 'M. Hassan Benjelloun',
    academicSupervisor: 'Pr. Benali',
    validationMessage: "Stage valide par l'institution"
  },
  {
    id: 2,
    company: 'Capgemini Morocco',
    position: 'Stagiaire DevOps',
    location: 'Rabat, Maroc',
    period: 'Janvier 2025 a Fevrier 2025',
    duration: '1 mois',
    status: 'En attente',
    iconColor: 'cream',
    missions: [
      'Configuration de pipelines CI/CD avec Jenkins',
      'Automatisation du deploiement avec Ansible',
      'Monitoring des applications avec Grafana'
    ],
    technologies: ['Jenkins', 'Docker', 'Kubernetes', 'Ansible'],
    companySupervisor: 'Mme. Fatima Zahra',
    academicSupervisor: 'Pr. Idrissi',
    validationMessage: ''
  }
]
// COMPETENCES
export const competenceGroups = [
  {
    id: 1,
    title: 'Techniques',
    subtitle: '7 competences',
    color: 'purple',
    skills: [
      { name: 'JavaScript', level: 85, category: 'Technique', source: 'Projets academiques' },
      { name: 'React.js', level: 80, category: 'Technique', source: 'Projets academiques' },
      { name: 'Node.js', level: 75, category: 'Technique', source: 'Projets academiques' },
      { name: 'Python', level: 70, category: 'Technique', source: 'Formations' },
      { name: 'SQL', level: 75, category: 'Technique', source: 'Projets academiques' }
    ]
  },
  {
    id: 2,
    title: 'Soft Skills',
    subtitle: '3 competences',
    color: 'green',
    skills: [
      { name: 'Travail en equipe', level: 90, category: 'Soft Skill', source: 'Projets' },
      { name: 'Communication', level: 85, category: 'Soft Skill', source: 'Activites' },
      { name: 'Resolution problemes', level: 80, category: 'Soft Skill', source: 'Stages' }
    ]
  },
  {
    id: 3,
    title: 'Langues',
    subtitle: '3 langues',
    color: 'orange',
    skills: [
      { name: 'Francais', level: 100, category: 'Langue', source: 'Certification' },
      { name: 'Anglais', level: 85, category: 'Langue', source: 'TOEFL' },
      { name: 'Arabe', level: 100, category: 'Langue', source: 'Langue maternelle' }
    ]
  }
]
// COMMENTAIRES
export const comments = [
  {
    id: 1,
    initials: 'MB',
    name: 'Pr. Mohamed Benali',
    role: 'Professeur',
    roleClass: 'role-prof',
    meta: "Projet: API REST avec Node.js - Aujourd'hui",
    text: "Excellent travail sur l'architecture de l'API. La documentation est claire et les endpoints sont bien structures. Je suggere d'ajouter des tests d'integration pour renforcer la robustesse du projet.",
    status: 'En attente',
    avatarColor: 'avatar-yellow'
  },
  {
    id: 2,
    initials: 'HB',
    name: 'M. Hassan Benjelloun',
    role: 'Professionnel',
    roleClass: 'role-pro',
    meta: 'Portfolio complet - Hier',
    text: 'Portfolio tres professionnel. Les projets presentes demontrent une bonne maitrise des technologies modernes. Continuez ainsi !',
    status: 'En attente',
    avatarColor: 'avatar-blue'
  },
  {
    id: 3,
    initials: 'FI',
    name: 'Fatima Zahra Idrissi',
    role: 'Etudiant',
    roleClass: 'role-student',
    meta: 'Projet: E-commerce Dashboard - Il y a 2 jours',
    text: "Super travail sur le projet e-commerce ! L'interface est vraiment intuitive.",
    status: 'En attente',
    avatarColor: 'avatar-pink'
  },
  {
    id: 4,
    initials: 'RI',
    name: 'Pr. Rachid Idrissi',
    role: 'Professeur',
    roleClass: 'role-prof',
    meta: 'Competence: DevOps - Il y a 3 jours',
    text: "Bonnes competences en DevOps. Je recommande d'approfondir Kubernetes pour completer votre profil.",
    status: 'Validee',
    avatarColor: 'avatar-purple'
  }
]

// RESEAU
export const networkStudents = [
  {
    id: 1,
    initials: 'FI',
    name: 'Fatima Zahra Idrissi',
    year: '2eme annee',
    field: 'Genie Informatique',
    school: 'ENSA Tanger',
    score: 92,
    level: 'Expert',
    levelClass: 'level-expert',
    badges: ['Full Stack', 'DevOps'],
    avatarColor: 'avatar-pink'
  },
  {
    id: 2,
    initials: 'MT',
    name: 'Mohamed Tazi',
    year: '1ere annee',
    field: 'Genie Informatique',
    school: 'ENSA Tanger',
    score: 78,
    level: 'Avance',
    levelClass: 'level-advanced',
    badges: ['Web Dev'],
    avatarColor: 'avatar-blue'
  },
  {
    id: 3,
    initials: 'YB',
    name: 'Youssef Bennani',
    year: '3eme annee',
    field: 'Genie Informatique',
    school: 'ENSA Tanger',
    score: 85,
    level: 'Avance',
    levelClass: 'level-advanced',
    badges: ['Hackathon', 'Full Stack'],
    avatarColor: 'avatar-yellow'
  },
  {
    id: 4,
    initials: 'SA',
    name: 'Sara El Amrani',
    year: '2eme annee',
    field: 'Genie Industriel',
    school: 'ENSA Tanger',
    score: 65,
    level: 'Inter.',
    levelClass: 'level-inter',
    badges: ['Data Analyst'],
    avatarColor: 'avatar-green'
  },
  {
    id: 5,
    initials: 'AR',
    name: 'Amine Rachidi',
    year: '1ere annee',
    field: 'Genie Informatique',
    school: 'ENSA Fes',
    score: 72,
    level: 'Avance',
    levelClass: 'level-advanced',
    badges: ['Web Dev'],
    avatarColor: 'avatar-purple'
  },
  {
    id: 6,
    initials: 'IB',
    name: 'Imane Berrada',
    year: '2eme annee',
    field: 'Genie Electrique',
    school: 'ENSA Marrakech',
    score: 58,
    level: 'Inter.',
    levelClass: 'level-inter',
    badges: ['IoT Developer'],
    avatarColor: 'avatar-sky'
  }
]
// HISTORIQUE
export const historyItems = [
  {
    id: 1,
    action: 'Validation projet',
    element: 'API REST avec Node.js',
    by: 'Pr. Benali',
    date: '28 Mars 2025 - 14:32',
    status: 'Valide',
    iconColor: 'green'
  },
  {
    id: 2,
    action: 'Demande correction',
    element: 'Systeme de gestion des notes',
    by: 'Pr. Benali',
    date: '25 Mars 2025 - 10:15',
    status: 'Correction',
    iconColor: 'orange'
  },
  {
    id: 3,
    action: 'Badge attribue',
    element: 'Web Developer',
    by: 'Systeme',
    date: '12 Mars 2025 - 09:00',
    status: 'Auto',
    iconColor: 'purple'
  },
  {
    id: 4,
    action: 'Validation stage',
    element: 'OCP Group - Casablanca',
    by: 'Pr. Idrissi',
    date: '8 Mars 2025 - 16:45',
    status: 'Valide',
    iconColor: 'blue'
  },
  {
    id: 5,
    action: 'Modification portfolio',
    element: 'Section A propos',
    by: 'Vous',
    date: '5 Mars 2025 - 11:20',
    status: 'Modifie',
    iconColor: 'yellow'
  },
  {
    id: 6,
    action: 'Refus attestation',
    element: 'Club Photo',
    by: 'Administration',
    date: '28 Fev 2025 - 14:00',
    status: 'Refuse',
    iconColor: 'pink'
  }
]

// LETTRES
export const recommendationLetters = [
  {
    id: 1,
    initials: 'MB',
    professor: 'Pr. Mohamed Benali',
    meta: 'ENSA Tanger - Genie Informatique',
    status: 'Validee',
    visibility: 'Publique',
    quote: "Ahmed est un etudiant exceptionnel doue d'une grande capacite d'analyse. Je le recommande chaleureusement pour le programme de double diplomation...",
    object: 'Candidature double diplomation',
    date: 'Mars 2025',
    avatarColor: 'yellow'
  },
  {
    id: 2,
    initials: 'FI',
    professor: 'Pr. Fatima Idrissi',
    meta: 'ENSA Tanger - Directrice de departement',
    status: 'Validee',
    visibility: 'Privee',
    quote: 'Excellente etudiante, motivee et engagee. Sa contribution au club informatique demontre un leadership remarquable...',
    object: 'Candidature Master',
    date: 'Janvier 2025',
    avatarColor: 'blue'
  },
  {
    id: 3,
    initials: 'HB',
    professor: 'Pr. Hassan Berrada',
    meta: 'ENSA Tanger - Bases de donnees',
    status: 'En attente',
    visibility: '',
    quote: '',
    object: '',
    date: '',
    requestText: 'Demande envoyee le 12 Avril 2025 - En attente de redaction',
    avatarColor: 'yellow'
  }
]
// PORTFOLIO
export const portfolioData = {
  objectives: ['Developpeur Web', 'DevOps', 'Data Science', 'Cybersecurite'],

  profile: {
    initials: 'IH',
    name: 'Insaf Hamdane',
    title: 'Developpeur Web Full Stack',
    school: 'ENSA Tanger - Genie Informatique',
    status: 'Certifie',
    about:
      'Passionne par le developpement web et les nouvelles technologies. Specialise en React, Node.js et architecture moderne.'
  },

  validatedProjects: [
    {
      id: 1,
      title: 'API REST avec Node.js',
      meta: 'Mars 2025 - Pr. Benali',
      tags: ['Node.js', 'Express']
    },
    {
      id: 2,
      title: 'Application de chat temps reel',
      meta: 'Decembre 2024',
      tags: ['React', 'Socket.io']
    }
  ],

  badges: [
    { label: 'Web Developer', color: 'yellow' },
    { label: 'DevOps', color: 'green' },
    { label: 'Hackathon', color: 'blue' }
  ],

  visibility: ['Public', 'Prive', 'Enseignants', 'Lien partage'],

  templates: ['Modern', 'Classic', 'Minimal'],

  publicLink: 'portfy.com/p/insaf-hamdane'
}
// NOTIFICATIONS
export const notifications = [
  {
    id: 1,
    title: 'Projet valide',
    message: 'Votre projet API REST a ete valide par Pr. Mohamed Benali',
    time: 'Il y a 2 heures',
    category: 'Projets',
    color: 'green',
    unread: true
  },
  {
    id: 2,
    title: 'Nouveau commentaire',
    message: 'Pr. Benali a laisse un commentaire sur votre portfolio',
    time: 'Il y a 5 heures',
    category: 'Commentaires',
    color: 'orange',
    unread: true
  },
  {
    id: 3,
    title: 'Nouveau badge debloque',
    message: 'Felicitations ! Vous avez obtenu le badge Web Developer',
    time: 'Hier',
    category: 'Badges',
    color: 'purple',
    unread: true
  },
  {
    id: 4,
    title: 'Stage valide',
    message: 'Votre stage chez OCP Group a ete valide par Pr. Idrissi',
    time: 'Il y a 3 jours',
    category: 'Projets',
    color: 'blue',
    unread: false
  },
  {
    id: 5,
    title: 'Correction demandee',
    message: 'Pr. Benali demande des corrections sur votre projet Systeme de notes',
    time: 'Il y a 5 jours',
    category: 'Projets',
    color: 'pink',
    unread: false
  },
  {
    id: 6,
    title: 'Nouvelle recommandation',
    message: 'M. Hassan Benjelloun a recommande votre portfolio',
    time: 'Il y a 1 semaine',
    category: 'Commentaires',
    color: 'blue',
    unread: false
  }
]

// PARAMETRES
export const userSettings = {
  personal: {
    initials: 'AA',
    firstName: 'Ahmed',
    lastName: 'Alami',
    email: 'ahmed@ensat.ac.ma',
    phone: '+212 6 12 34 56 78',
    bio: 'Passionne par le developpement web et les nouvelles technologies.',
    city: 'Tanger',
    country: 'Maroc'
  },

  academic: {
    school: 'ENSA Tanger',
    field: 'Genie Informatique',
    year: '1ere annee',
    graduationYear: '2028'
  },

  notificationPreferences: [
    { id: 1, label: 'Validation de projet', enabled: true },
    { id: 2, label: 'Nouvelles recommandations', enabled: true },
    { id: 3, label: 'Commentaires recus', enabled: true },
    { id: 4, label: 'Rappels de completion', enabled: true }
  ],

  appearance: {
    theme: 'Clair',
    language: 'Francais'
  }
}
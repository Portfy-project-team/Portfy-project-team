describe('E2E — Pages Student', () => {
  const fakeUser = {
    id: 1,
    firstName: 'Ahmed',
    lastName: 'Alami',
    role: 'student',
    email: 'ahmed@ensat.ac.ma',
  }

  const visitPage = (path) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token')
        win.localStorage.setItem('authToken', 'fake-token')
        win.localStorage.setItem('user', JSON.stringify(fakeUser))
        win.localStorage.setItem('authUser', JSON.stringify(fakeUser))

        cy.stub(win, 'alert').as('windowAlert')
        cy.stub(win, 'confirm').returns(true).as('windowConfirm')
        cy.stub(win, 'open').as('windowOpen')
      },
    })
  }

  beforeEach(() => {
    cy.viewport(1366, 768)
  })

  const studentPages = [
    {
      path: '/student/dashboard',
      pageClass: '.dashboard-page',
      title: 'Bonjour Ahmed',
    },
    {
      path: '/student/projects',
      pageClass: '.projects-page',
      title: 'Mes projets',
    },
    {
      path: '/student/stages',
      pageClass: '.stages-page',
      title: 'Mes stages',
    },
    {
      path: '/student/portfolio',
      pageClass: '.portfolio-page',
      title: 'Mon Portfolio',
    },
    {
      path: '/student/activites',
      pageClass: '.activities-page',
      title: 'Mes activites',
    },
    {
      path: '/student/formations',
      pageClass: '.formations-page',
      title: 'Mes formations',
    },
    {
      path: '/student/competences',
      pageClass: '.competences-page',
      title: 'Mes competences',
    },
    {
      path: '/student/lettres',
      pageClass: '.letters-page',
      title: 'Mes lettres',
    },
    {
      path: '/student/badges',
      pageClass: '.badges-page',
      title: 'Badges de competences',
    },
    {
      path: '/student/reseau',
      pageClass: '.network-page',
      title: 'Reseau etudiants',
    },
    {
      path: '/student/commentaires',
      pageClass: '.comments-page',
      title: 'Commentaires recus',
    },
    {
      path: '/student/historique',
      pageClass: '.history-page',
      title: 'Historique des validations',
    },
    {
      path: '/student/notifications',
      pageClass: '.notifications-page',
      title: 'Toutes les notifications',
    },
    {
      path: '/student/parametres',
      pageClass: '.settings-page',
      title: 'Parametres du compte',
    },
    {
      path: '/student/aide',
      pageClass: '.help-page',
      title: 'Comment pouvons-nous vous aider ?',
    },
  ]

  describe('Smoke test — affichage de toutes les pages', () => {
    studentPages.forEach((page) => {
      it(`affiche correctement ${page.path}`, () => {
        visitPage(page.path)

        cy.location('pathname').should('eq', page.path)
        cy.get('.student-layout').should('exist')
        cy.get('.sidebar').should('exist')
        cy.get(page.pageClass).should('exist')
        cy.contains(page.title).should('be.visible')
      })
    })
  })

  describe('Navigation Sidebar', () => {
    it('navigue entre les pages student depuis la sidebar', () => {
      visitPage('/student/dashboard')

      cy.contains('.nav-item', 'Projects').click()
      cy.location('pathname').should('eq', '/student/projects')
      cy.contains('Mes projets').should('be.visible')

      cy.contains('.nav-item', 'Stages').click()
      cy.location('pathname').should('eq', '/student/stages')
      cy.contains('Mes stages').should('be.visible')

      cy.contains('.nav-item', 'Portfolio').click()
      cy.location('pathname').should('eq', '/student/portfolio')
      cy.contains('Mon Portfolio').should('be.visible')

      cy.contains('.nav-item', 'Activités').click()
      cy.location('pathname').should('eq', '/student/activites')
      cy.contains('Mes activites').should('be.visible')

      cy.contains('.nav-item', 'Formations').click()
      cy.location('pathname').should('eq', '/student/formations')
      cy.contains('Mes formations').should('be.visible')

      cy.contains('.nav-item', 'Compétences').click()
      cy.location('pathname').should('eq', '/student/competences')
      cy.contains('Mes competences').should('be.visible')

      cy.contains('.nav-item', 'Lettres').click()
      cy.location('pathname').should('eq', '/student/lettres')
      cy.contains('Mes lettres').should('be.visible')

      cy.contains('.nav-item', 'Badges').click()
      cy.location('pathname').should('eq', '/student/badges')
      cy.contains('Badges de competences').should('be.visible')

      cy.contains('.nav-item', 'Réseau').click()
      cy.location('pathname').should('eq', '/student/reseau')
      cy.contains('Reseau etudiants').should('be.visible')

      cy.contains('.nav-item', 'Commentaires').click()
      cy.location('pathname').should('eq', '/student/commentaires')
      cy.contains('Commentaires recus').should('be.visible')

      cy.contains('.nav-item', 'Historique').click()
      cy.location('pathname').should('eq', '/student/historique')
      cy.contains('Historique des validations').should('be.visible')

      cy.contains('.nav-item', 'Notifications').click()
      cy.location('pathname').should('eq', '/student/notifications')
      cy.contains('Toutes les notifications').should('be.visible')

      cy.contains('.nav-item', 'Paramètres').click()
      cy.location('pathname').should('eq', '/student/parametres')
      cy.contains('Parametres du compte').should('be.visible')

      cy.contains('.nav-item', 'Aide & Support').click()
      cy.location('pathname').should('eq', '/student/aide')
      cy.contains('Comment pouvons-nous vous aider ?').should('be.visible')
    })

    it('ferme et ouvre la sidebar', () => {
      visitPage('/student/dashboard')

      cy.get('.sidebar').should('not.have.class', 'closed')
      cy.get('.toggle-btn').click()
      cy.get('.sidebar').should('have.class', 'closed')

      cy.get('.toggle-btn').click()
      cy.get('.sidebar').should('not.have.class', 'closed')
    })

    it('redirige vers login au clic sur Deconnexion', () => {
      visitPage('/student/dashboard')

      cy.contains('button', 'Déconnexion').click()
      cy.location('pathname').should('eq', '/login')
    })
  })

  describe('Dashboard', () => {
    it('affiche les statistiques et activites recentes', () => {
      visitPage('/student/dashboard')

      cy.contains('Bonjour Ahmed').should('be.visible')
      cy.contains('Score de credibilite').should('be.visible')
      cy.contains('Activite recente').should('be.visible')
      cy.get('.stat-card').should('have.length.at.least', 1)
    })
  })

  describe('Projects', () => {
    it('affiche la liste des projets et les filtres', () => {
      visitPage('/student/projects')

      cy.contains('Mes projets').should('be.visible')
      cy.get('.project-card').should('have.length.at.least', 1)
      cy.contains('.filter-btn', 'Tous').should('have.class', 'active')

      cy.contains('.filter-btn', 'En attente').click()
      cy.contains('.filter-btn', 'En attente').should('have.class', 'active')
    })

    it('ajoute un nouveau projet depuis le modal', () => {
      visitPage('/student/projects')

      cy.contains('button', 'Nouveau projet').click()
      cy.contains('Ajouter un projet').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="API"]').type('Projet E2E Cypress')
      cy.get('textarea').first().type('Description ajoutee avec Cypress E2E')
      cy.get('select').first().select('Projet personnel')
      cy.get('input[placeholder*="React"]').type('Vue, Cypress')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.project-card', 'Projet E2E Cypress').should('exist')
    })

    it('ouvre le modal de modification projet', () => {
      visitPage('/student/projects')

      cy.get('.project-card').first().within(() => {
        cy.contains('button', 'Modifier').click()
      })

      cy.contains('Modifier le projet').should('be.visible')
    })
  })

  describe('Stages', () => {
    it('affiche la liste des stages', () => {
      visitPage('/student/stages')

      cy.contains('Mes stages').should('be.visible')
      cy.get('.stage-card').should('have.length.at.least', 1)
    })

    it('ajoute un nouveau stage depuis le modal', () => {
      visitPage('/student/stages')

      cy.contains('button', 'Nouveau stage').click()
      cy.contains('Ajouter un stage').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="OCP"]').type('Google')
      cy.get('input[placeholder*="Developpeur"]').type('Software Engineer')
      cy.get('input[placeholder*="Casablanca"]').type('London')
      cy.get('input[placeholder*="2 mois"]').type('1 mois')
      cy.get('input[placeholder*="Juillet"]').type('Juin 2026')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.stage-card', 'Google').should('exist')
    })

    it('ouvre le modal de modification stage', () => {
      visitPage('/student/stages')

      cy.get('.stage-card').first().within(() => {
        cy.contains('button', 'Modifier').click()
      })

      cy.contains('Modifier le stage').should('be.visible')
    })
  })

  describe('Portfolio', () => {
    it('affiche le portfolio et change objectif/template', () => {
      visitPage('/student/portfolio')

      cy.contains('Mon Portfolio').should('be.visible')
      cy.contains('Objectif professionnel').should('be.visible')
      cy.contains('PROJETS VALIDES').should('be.visible')
      cy.contains('BADGES OBTENUS').should('be.visible')

      cy.contains('.objective-btn', 'Data Analyst').click()
      cy.contains('.objective-btn', 'Data Analyst').should('have.class', 'active')

      cy.contains('.template-btn', 'Creative').click()
      cy.contains('.template-btn', 'Creative').should('have.class', 'active')
    })

    it('ouvre apercu public dans un nouvel onglet', () => {
      visitPage('/student/portfolio')

      cy.contains('button', 'Apercu public').click()
      cy.get('@windowOpen').should('have.been.called')
    })
  })

  describe('Activites', () => {
    it('affiche la table des activites', () => {
      visitPage('/student/activites')

      cy.contains('Mes activites').should('be.visible')
      cy.get('.activities-table').should('exist')
      cy.get('.activities-table tbody tr').should('have.length.at.least', 1)
    })

    it('ajoute une nouvelle activite depuis le modal', () => {
      visitPage('/student/activites')

      cy.contains('button', 'Nouvelle activite').click()
      cy.contains('Nouvelle activite').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="Hackathon"]').type('Hackathon E2E')
      cy.get('input[placeholder*="Participant"]').type('Organisateur')
      cy.get('select').first().select('Hackathon')
      cy.get('input[placeholder*="ENSA"]').type('ENSA Tanger')
      cy.get('input[placeholder*="Mars"]').type('Mars 2026')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.activities-table', 'Hackathon E2E').should('exist')
    })
  })

  describe('Formations', () => {
    it('affiche les formations', () => {
      visitPage('/student/formations')

      cy.contains('Mes formations').should('be.visible')
      cy.get('.formation-card').should('have.length.at.least', 1)
    })

    it('ajoute une nouvelle formation depuis le modal', () => {
      visitPage('/student/formations')

      cy.contains('button', 'Nouvelle formation').click()
      cy.contains('Ajouter une formation').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="AWS"]').type('Formation Cypress')
      cy.get('input[placeholder*="Coursera"]').type('Udemy')
      cy.get('select').first().select('Certification')
      cy.get('input[type="number"]').clear().type('90')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.formation-card', 'Formation Cypress').should('exist')
    })

    it('ouvre le modal de modification formation', () => {
      visitPage('/student/formations')

      cy.get('.formation-card').first().within(() => {
        cy.contains('button', 'Modifier').click()
      })

      cy.contains('Modifier la formation').should('be.visible')
    })
  })

  describe('Competences', () => {
    it('affiche les groupes et filtres de competences', () => {
      visitPage('/student/competences')

      cy.contains('Mes competences').should('be.visible')
      cy.get('.group-card').should('have.length.at.least', 1)
      cy.get('.competences-table').should('exist')

      cy.contains('.filter-btn', 'Techniques').click()
      cy.contains('.filter-btn', 'Techniques').should('have.class', 'active')

      cy.contains('.filter-btn', 'Soft Skills').click()
      cy.contains('.filter-btn', 'Soft Skills').should('have.class', 'active')

      cy.contains('.filter-btn', 'Langues').click()
      cy.contains('.filter-btn', 'Langues').should('have.class', 'active')
    })

    it('ajoute une nouvelle competence depuis le modal', () => {
      visitPage('/student/competences')

      cy.contains('button', 'Ajouter une competence').click()
      cy.contains('Nouvelle competence').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="React"]').type('Cypress E2E')
      cy.get('select').first().select('Technique')
      cy.get('input[type="number"]').clear().type('80')
      cy.get('input[placeholder*="Projets"]').type('Projet test')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.competences-table', 'Cypress E2E').should('exist')
    })
  })

  describe('Lettres', () => {
    it('affiche les lettres et stats', () => {
      visitPage('/student/lettres')

      cy.contains('Mes lettres').should('be.visible')
      cy.get('.letter-card').should('have.length.at.least', 1)
      cy.get('.stat-card').should('have.length.at.least', 1)
    })

    it('demande une nouvelle lettre', () => {
      visitPage('/student/lettres')

      cy.contains('button', 'Demander une lettre').click()
      cy.contains('.modal-card h2', 'Demander une lettre').should('be.visible')

      cy.get('.submit-btn').should('be.disabled')

      cy.get('input[placeholder*="Pr."]').type('Pr. Cypress Test')
      cy.get('input[placeholder*="Candidature"]').type('Candidature Master')
      cy.get('select').first().select('Candidature Master')
      cy.get('textarea').type('Demande creee avec test E2E')

      cy.get('.submit-btn').should('not.be.disabled')
      cy.get('.submit-btn').click()

      cy.contains('.letter-card', 'Pr. Cypress Test').should('exist')
      cy.contains('.letter-card', 'En attente').should('exist')
    })
  })

  describe('Badges', () => {
    it('affiche badges obtenus et badges a debloquer', () => {
      visitPage('/student/badges')

      cy.contains('Badges de competences').should('be.visible')
      cy.contains('Niveau actuel').should('be.visible')
      cy.contains('Badges obtenus').should('be.visible')
      cy.contains('A debloquer').should('be.visible')
      cy.get('.badge-card').should('have.length.at.least', 1)
    })
  })

  describe('Reseau', () => {
    it('affiche le reseau etudiant', () => {
      visitPage('/student/reseau')

      cy.contains('Reseau etudiants').should('be.visible')
      cy.get('.network-table').should('exist')
      cy.get('.network-table tbody tr').should('have.length.at.least', 1)

      cy.get('input[placeholder*="Rechercher"]').type('Ahmed')
      cy.get('input[placeholder*="Rechercher"]').should('have.value', 'Ahmed')
    })

    it('ouvre le portfolio public depuis le reseau', () => {
      visitPage('/student/reseau')

      cy.get('.network-table tbody tr').first().within(() => {
        cy.contains('button', 'Voir portfolio').click()
      })

      cy.get('@windowOpen').should('have.been.called')
    })
  })

  describe('Commentaires', () => {
    it('affiche les commentaires en attente et publies', () => {
      visitPage('/student/commentaires')

      cy.contains('Commentaires recus').should('be.visible')
      cy.contains('En attente de validation').should('be.visible')
      cy.contains('Commentaires publies').should('be.visible')
      cy.get('.comment-card').should('have.length.at.least', 1)
    })

    it('accepte un commentaire en attente', () => {
      visitPage('/student/commentaires')

      cy.get('.comment-card').first().within(() => {
        cy.contains('button', 'Accepter').click()
      })

      cy.contains('Commentaires publies').should('be.visible')
      cy.contains('.status-badge', 'Validee').should('exist')
    })

    it('refuse un commentaire en attente', () => {
      visitPage('/student/commentaires')

      cy.get('.comment-card').first().within(() => {
        cy.contains('button', 'Refuser').click()
      })

      cy.contains('En attente de validation').should('be.visible')
    })
  })

  describe('Historique', () => {
    it('affiche historique et filtre les actions', () => {
      visitPage('/student/historique')

      cy.contains('Historique des validations').should('be.visible')
      cy.get('.history-table').should('exist')

      cy.contains('.filter-btn', 'Validations').click()
      cy.contains('.filter-btn', 'Validations').should('have.class', 'active')

      cy.contains('.filter-btn', 'Refus').click()
      cy.contains('.filter-btn', 'Refus').should('have.class', 'active')

      cy.contains('.filter-btn', 'Modifications').click()
      cy.contains('.filter-btn', 'Modifications').should('have.class', 'active')

      cy.contains('.filter-btn', 'Tout').click()
      cy.contains('.filter-btn', 'Tout').should('have.class', 'active')
    })
  })

  describe('Notifications', () => {
    it('affiche notifications et filtres', () => {
      visitPage('/student/notifications')

      cy.contains('Toutes les notifications').should('be.visible')
      cy.get('.notification-card').should('have.length.at.least', 1)

      cy.contains('.filter-btn', 'Non lues').click()
      cy.contains('.filter-btn', 'Non lues').should('have.class', 'active')

      cy.contains('.filter-btn', 'Projets').click()
      cy.contains('.filter-btn', 'Projets').should('have.class', 'active')

      cy.contains('.filter-btn', 'Toutes').click()
      cy.contains('.filter-btn', 'Toutes').should('have.class', 'active')
    })

    it('marque toutes les notifications comme lues', () => {
      visitPage('/student/notifications')

      cy.contains('button', 'Tout marquer lu').click()
      cy.contains('0 non lues').should('be.visible')
      cy.get('.unread-dot').should('not.exist')
    })
  })

  describe('Parametres', () => {
    it('affiche les sections de parametres', () => {
      visitPage('/student/parametres')

      cy.contains('Parametres du compte').should('be.visible')
      cy.contains('Informations personnelles').should('be.visible')
      cy.contains('Informations academiques').should('be.visible')
      cy.contains('Notifications').should('be.visible')
      cy.contains('Securite').should('be.visible')
      cy.contains('Apparence').should('be.visible')
      cy.contains('Zone de danger').should('be.visible')
    })

    it('enregistre les informations personnelles', () => {
      visitPage('/student/parametres')

      cy.get('input').eq(1).clear().type('Youssef')
      cy.get('input').eq(2).clear().type('Zailachi')
      cy.get('input[type="email"]').clear().type('youssef@test.com')

      cy.contains('button', 'Enregistrer les modifications').click()

      cy.contains('Modifications enregistrees avec succes.').should('be.visible')
    })

    it('ouvre et ferme le modal mot de passe', () => {
      visitPage('/student/parametres')

      cy.contains('button', 'Changer le mot de passe').click()
      cy.contains('.modal-card h3', 'Changer le mot de passe').should('be.visible')

      cy.get('.modal-card input[type="password"]').eq(0).type('ancien123')
      cy.get('.modal-card input[type="password"]').eq(1).type('nouveau123')
      cy.get('.modal-card input[type="password"]').eq(2).type('nouveau123')

      cy.get('.modal-card .submit-btn').click()
      cy.get('@windowAlert').should('have.been.calledWith', 'Mot de passe change avec succes.')
    })

    it('active 2FA et desactive portfolio', () => {
      visitPage('/student/parametres')

      cy.contains('button', 'Activer 2FA').click()
      cy.get('@windowAlert').should('have.been.calledWith', '2FA active avec succes.')
      cy.contains('button', 'Desactiver 2FA').should('exist')

      cy.contains('button', 'Desactiver le portfolio').click()
      cy.get('@windowConfirm').should('have.been.called')
      cy.get('@windowAlert').should('have.been.calledWith', 'Portfolio desactive.')
      cy.contains('button', 'Portfolio desactive').should('be.disabled')
    })
  })

  describe('Aide & Support', () => {
    it('affiche la page aide et la recherche', () => {
      visitPage('/student/aide')

      cy.contains('Comment pouvons-nous vous aider ?').should('be.visible')
      cy.contains('Questions frequentes').should('be.visible')
      cy.get('.help-card').should('have.length.at.least', 1)
      cy.get('.faq-item').should('have.length.at.least', 1)

      cy.get('input[placeholder*="Rechercher"]').type('portfolio')
      cy.get('input[placeholder*="Rechercher"]').should('have.value', 'portfolio')
    })
  })

  describe('Public Portfolio', () => {
    it('affiche le portfolio public Ahmed Alami', () => {
      visitPage('/portfolio/ahmed-alami')

      cy.get('.public-page').should('exist')
      cy.contains('A propos').should('be.visible')
      cy.contains('Projets valides').should('be.visible')
      cy.contains('Badges obtenus').should('be.visible')
    })
  })
})
describe('Espace Professor — E2E', () => {

  // ---------- Sidebar (présente sur toutes les pages) ----------
  describe('Navigation Sidebar', () => {
    beforeEach(() => cy.visit('/professor/portfolios-consultes'))

    it('navigue entre les pages via la sidebar', () => {
      cy.get('.nav-item').contains('Recommandations').click()
      cy.url().should('include', '/professor/recommandations')
      cy.get('.page-title').should('contain', 'Mes recommandations')

      cy.get('.nav-item').contains('Commentaires').click()
      cy.url().should('include', '/professor/commentaires')

      cy.get('.nav-item').contains('Paramètres').click()
      cy.url().should('include', '/professor/parametres')

      cy.get('.nav-item').contains('Aide & Support').click()
      cy.url().should('include', '/professor/aide')
    })

    it('déconnecte vers /login', () => {
      cy.get('.logout-btn').click()
      cy.url().should('include', '/login')
    })
  })

  // ---------- Portfolios consultés ----------
  describe('Portfolios consultés', () => {
    beforeEach(() => cy.visit('/professor/portfolios-consultes'))

    it('affiche les 6 portfolios et les stats', () => {
      cy.get('.portfolio-card').should('have.length', 6)
      cy.get('.stats-row .stat-value').first().should('contain', '6')
    })

    it('filtre par recherche', () => {
      cy.get('.search-box input').type('Sara')
      cy.get('.portfolio-card').should('have.length', 1)
      cy.get('.portfolio-card').should('contain', 'Sara Benali')
    })

    it('filtre par "Favoris"', () => {
      cy.contains('.filter-btn', 'Favoris').click()
      // 3 portfolios bookmarked dans les données (Sara, Leila)
      cy.get('.portfolio-card').each($c =>
        cy.wrap($c).find('.bookmark-btn').should('have.class', 'active')
      )
    })

    it('toggle un bookmark sans ouvrir le drawer', () => {
      cy.get('.portfolio-card').first().find('.bookmark-btn')
        .click()
        .should('have.class', 'active')
      cy.get('.drawer').should('not.exist')
    })

    it('ouvre le drawer de détail au clic sur une carte', () => {
      cy.get('.portfolio-card').first().click()
      cy.get('.drawer').should('be.visible')
      cy.get('.drawer-header h3').should('not.be.empty')
      cy.get('.close-btn').click()
      cy.get('.drawer').should('not.exist')
    })

    it('redirige vers recommandations depuis le drawer', () => {
      cy.get('.portfolio-card').first().click()
      cy.contains('.btn-primary', 'Rédiger une recommandation').click()
      cy.url().should('include', '/professor/recommandations')
    })

    it('affiche un état vide si aucun résultat', () => {
      cy.get('.search-box input').type('xxxxxx')
      cy.get('.empty-state').should('contain', 'Aucun portfolio')
    })
  })

  // ---------- Recommandations (CRUD) ----------
  describe('Recommandations', () => {
    beforeEach(() => cy.visit('/professor/recommandations'))

    it('affiche la liste initiale (5)', () => {
      cy.get('.reco-card').should('have.length', 5)
    })

    it('filtre par statut "En attente"', () => {
      cy.contains('.filter-btn', 'En attente').click()
      cy.get('.reco-card').should('have.length', 2) // Leila + Omar
    })

    it('crée une nouvelle recommandation', () => {
      cy.contains('.btn-primary', 'Ajouter une recommandation').click()
      cy.get('.modal').should('be.visible')
      cy.get('.modal-body input').type('Test Etudiant')
      cy.get('.modal-body textarea').type('Excellent travail de test.')
      cy.contains('.btn-primary', 'Publier').click()
      cy.get('.modal').should('not.exist')
      cy.get('.reco-card').should('have.length', 6)
      cy.get('.reco-card').first().should('contain', 'Test Etudiant')
    })

    it('modifie une recommandation existante', () => {
      cy.get('.reco-card').first().find('.action-btn.edit').click()
      cy.get('.modal').should('contain', 'Modifier')
      cy.get('.modal-body textarea').clear().type('Contenu modifié.')
      cy.contains('.btn-primary', 'Enregistrer').click()
      cy.get('.reco-card').first().should('contain', 'Contenu modifié')
    })

    it('supprime une recommandation', () => {
      cy.get('.reco-card').then($cards => {
        const before = $cards.length
        cy.get('.reco-card').first().find('.action-btn.delete').click()
        cy.get('.reco-card').should('have.length', before - 1)
      })
    })

    it('ferme le modal via Annuler', () => {
      cy.contains('.btn-primary', 'Ajouter une recommandation').click()
      cy.contains('.btn-secondary', 'Annuler').click()
      cy.get('.modal').should('not.exist')
    })
  })

  // ---------- Commentaires ----------
  describe('Commentaires', () => {
    beforeEach(() => cy.visit('/professor/commentaires'))

    it('affiche stats lus / non lus', () => {
      cy.get('.comment-card').should('have.length', 5)
      cy.get('.stats-row .stat-value').eq(1).should('contain', '3') // lus
      cy.get('.stats-row .stat-value').eq(2).should('contain', '2') // non lus
    })

    it('filtre les non lus', () => {
      cy.contains('.filter-btn', 'Non lus').click()
      cy.get('.comment-card').should('have.length', 2)
      cy.get('.comment-card').each($c =>
        cy.wrap($c).should('have.class', 'unread')
      )
    })

    it('marque un commentaire comme lu', () => {
      cy.contains('.filter-btn', 'Non lus').click()
      cy.get('.comment-card').first().find('.mark-read-btn').click()
      cy.get('.comment-card').should('have.length', 1) // disparaît du filtre
    })
  })

  // ---------- Paramètres ----------
  describe('Paramètres', () => {
    beforeEach(() => cy.visit('/professor/parametres'))

    it('pré-remplit le profil', () => {
      cy.get('input[type="email"]').should('have.value', 'ghailani@ensat.ma')
    })

    it('affiche les 5 sections de réglages', () => {
      cy.get('.settings-card').should('have.length', 5)
      cy.get('.settings-card.danger').should('contain', 'Zone dangereuse')
    })

    it('modifie un champ et bascule un toggle', () => {
      cy.get('input[type="text"]').first().clear().type('M. Test')
        .should('have.value', 'M. Test')
      cy.get('.toggle-input').last().check().should('be.checked')
    })
  })

  // ---------- Aide ----------
  describe('Aide & Support', () => {
    beforeEach(() => cy.visit('/professor/aide'))

    it('affiche les 4 cartes de contact rapide', () => {
      cy.get('.quick-link-card').should('have.length', 4)
    })

    it('déplie / replie une FAQ', () => {
      cy.get('.faq-content').should('not.exist')
      cy.get('.faq-header').first().click()
      cy.get('.faq-content').should('be.visible')
      cy.get('.faq-header').first().click()
      cy.get('.faq-content').should('not.exist')
    })

    it('filtre les FAQ par recherche', () => {
      cy.get('.search-box input').type('recommandation')
      cy.get('.faq-item').should('have.length.lessThan', 8)
    })

    it('remplit le formulaire de contact', () => {
      cy.get('.contact-form input').type('Bug affichage')
      cy.get('.contact-form textarea').type('Le drawer ne se ferme pas.')
        .should('have.value', 'Le drawer ne se ferme pas.')
    })
  })
})
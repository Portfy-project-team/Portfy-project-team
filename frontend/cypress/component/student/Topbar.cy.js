// ─────────────────────────────────────────────────────────────
//  TEST COMPOSANT — Topbar
//  cypress/component/student/Topbar.cy.js
// ─────────────────────────────────────────────────────────────
import Topbar from '@/components/student/Topbar.vue'

describe('Topbar.vue — Composant', () => {
  const userProfessor = {
    firstName: 'Ahmed',
    lastName: 'Benali',
    role: 'professor',
    avatar: null,
  }

  it("affiche le nom de l'utilisateur connecté", () => {
    cy.mount(Topbar, { props: { user: userProfessor } })

    cy.get('[data-cy="topbar-username"]')
      .should('be.visible')
      .and('contain', 'Ahmed')
  })

  it("affiche le rôle de l'utilisateur", () => {
    cy.mount(Topbar, { props: { user: userProfessor } })

    cy.get('[data-cy="topbar-role"]')
      .should('exist')
      .and('contain.text', 'Professeur')
  })

  it('émet un événement logout au clic sur le bouton Déconnexion', () => {
    const onLogout = cy.stub().as('logoutHandler')

    cy.mount(Topbar, {
      props: {
        user: userProfessor,
        onLogout,
      },
    })

    cy.get('[data-cy="topbar-logout"]').click()
    cy.get('@logoutHandler').should('have.been.calledOnce')
  })

  it('affiche un avatar par défaut si aucun avatar fourni', () => {
    cy.mount(Topbar, {
      props: {
        user: {
          ...userProfessor,
          avatar: null,
        },
      },
    })

    cy.get('[data-cy="topbar-avatar-default"]').should('exist')
  })

  it("affiche l'avatar personnalisé si fourni", () => {
    cy.mount(Topbar, {
      props: {
        user: {
          ...userProfessor,
          avatar: '/img/avatar.png',
        },
      },
    })

    cy.get('[data-cy="topbar-avatar-img"]')
      .should('have.attr', 'src', '/img/avatar.png')
  })
})
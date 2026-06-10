// ─────────────────────────────────────────────────────────────
//  TEST COMPOSANT — Sidebar (Professeur)
//  cypress/component/student/Sidebar.cy.js
// ─────────────────────────────────────────────────────────────
import Sidebar from '@/components/student/Sidebar.vue'

describe('Sidebar.vue — Composant', () => {
  const professorLinks = [
    { label: 'Dashboard', to: '/professor/dashboard', icon: 'home' },
    { label: 'Cours', to: '/professor/courses', icon: 'book' },
    { label: 'Étudiants', to: '/professor/students', icon: 'users' },
  ]

  it('se monte sans erreur', () => {
    cy.mount(Sidebar, {
      props: { links: professorLinks, role: 'professor' },
    })
    cy.get('[data-cy="sidebar"]').should('exist')
  })

  it('affiche tous les liens de navigation', () => {
    cy.mount(Sidebar, { props: { links: professorLinks, role: 'professor' } })
    cy.get('[data-cy^="sidebar-link-"]').should('have.length', professorLinks.length)
  })

  it('applique la classe active sur le bon lien', () => {
    cy.mount(Sidebar, {
      props: { links: professorLinks, role: 'professor', activeRoute: '/professor/dashboard' },
    })
    cy.get('[data-cy="sidebar-link-dashboard"]').should('have.class', 'active')
    cy.get('[data-cy="sidebar-link-courses"]').should('not.have.class', 'active')
  })

  it('émet un événement logout au clic sur Déconnexion', () => {
    const onLogout = cy.stub().as('logoutStub')
    cy.mount(Sidebar, {
      props: { links: professorLinks, role: 'professor', onLogout },
    })
    cy.get('[data-cy="sidebar-logout"]').click()
    cy.get('@logoutStub').should('have.been.calledOnce')
  })
})

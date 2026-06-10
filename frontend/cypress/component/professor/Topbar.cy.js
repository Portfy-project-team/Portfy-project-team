import Topbar from '@/components/professor/Topbar.vue'

describe('Topbar', () => {
  it('affiche le titre passé en prop', () => {
    cy.mount(Topbar, { props: { title: 'Recommandations' } })
    cy.get('.topbar-title').should('contain', 'Recommandations')
  })

  it('contient une barre de recherche et un avatar', () => {
    cy.mount(Topbar, { props: { title: 'Test' } })
    cy.get('.search-bar input').should('have.attr', 'placeholder', 'Rechercher')
    cy.get('.notif-btn').should('exist')
    cy.get('.topbar-avatar').should('contain', 'AA')
  })

  it('permet de taper dans la recherche', () => {
    cy.mount(Topbar, { props: { title: 'Test' } })
    cy.get('.search-bar input').type('Sara').should('have.value', 'Sara')
  })
})
/*import Sidebar from '@/components/professor/Sidebar.vue'

const routerStub = {
  install(app) {
    app.config.globalProperties.$router = { push: cy.stub().as('routerPush') }
    app.component('router-link', {
      props: ['to', 'activeClass'],
      template: '<a :href="to"><slot /></a>',
    })
  },
}

describe('Sidebar Professor', () => {
  it('affiche le profil M. Ghailani et les initiales', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.profile-name').should('contain', 'M. Ghailani')
    cy.get('.avatar').should('contain', 'MG')
    cy.get('.profile-role').should('contain', 'Professeur')
  })

  it('affiche le badge "Compte vérifié"', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.verified-badge').should('contain', 'Compte vérifié')
  })

  it('contient les 6 liens de navigation', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.nav-item').should('have.length', 6)
    cy.get('.nav-item').eq(0).should('contain', 'Dashboard')
    cy.get('.nav-item').eq(1).should('contain', 'Portfolios consultés')
    cy.get('.nav-item').eq(2).should('contain', 'Recommandations')
    cy.get('.nav-item').eq(3).should('contain', 'Commentaires')
    cy.get('.nav-item').eq(4).should('contain', 'Paramètres')
    cy.get('.nav-item').eq(5).should('contain', 'Aide & Support')
  })

  it('affiche le badge "3" sur Commentaires', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.nav-item').eq(3).find('.badge').should('contain', '3')
  })

  it('replie/déplie la sidebar via le toggle', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.sidebar').should('not.have.class', 'closed')
    cy.get('.toggle-btn').click()
    cy.get('.sidebar').should('have.class', 'closed')
    // une fois fermée, le profil disparaît
    cy.get('.sidebar-profile').should('not.exist')
    cy.get('.toggle-btn').click()
    cy.get('.sidebar').should('not.have.class', 'closed')
  })

  it('redirige vers /login au clic sur Déconnexion', () => {
    cy.mount(Sidebar, { global: { plugins: [routerStub] } })
    cy.get('.logout-btn').click()
    cy.get('@routerPush').should('have.been.calledWith', '/login')
  })
})*/
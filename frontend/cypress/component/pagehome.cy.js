import PageHome from '@/pages/PageHome.vue'

const routerStub = {
  install(app) {
    app.component('RouterLink', {
      props: ['to'],
      template: '<a :href="to"><slot /></a>',
    })
  },
}

describe('PageHome (composant)', () => {
  const mountPage = () => cy.mount(PageHome, { global: { plugins: [routerStub] } })

  it('rend la marque, le hero et le footer', () => {
    mountPage()
    cy.get('.brand-name').should('contain', 'Portfy')
    cy.get('.hero h1').should('contain', 'certifié')
    cy.get('.footer').should('contain', 'ENSA Tanger')
  })

  it('les liens pointent vers les bonnes routes', () => {
    mountPage()
    cy.get('.btn-register').should('have.attr', 'href', '/register')
    cy.get('.btn-primary').should('have.attr', 'href', '/register')
    cy.get('.btn-login').should('have.attr', 'href', '/login')
  })

  it('contient les 3 features et 3 liens footer', () => {
    mountPage()
    cy.get('.feature-item').should('have.length', 3)
    cy.get('.footer-links a').should('have.length', 3)
  })
})
describe('Page d\'accueil (Landing)', () => {
  beforeEach(() => cy.visit('/'))

  it('affiche la marque Portfy', () => {
    cy.get('.brand-name').should('contain', 'Portfy')
    cy.get('.brand-icon').should('exist')
  })

  it('affiche les boutons Connexion et S\'inscrire dans la navbar', () => {
    cy.get('.btn-login').should('contain', 'Connexion')
      .and('have.attr', 'href', '/login')
    cy.get('.btn-register').should('contain', "S'inscrire")
      .and('have.attr', 'href', '/register')
  })

  it('affiche le badge et le titre du hero', () => {
    cy.get('.badge').should('contain', 'Plateforme académique certifiée')
    cy.get('.hero h1').should('contain', 'certifié')
    cy.get('.hero h1 span').should('contain', 'certifié')
    cy.get('.hero p').should('not.be.empty')
  })

  it('affiche les actions du hero', () => {
    cy.get('.hero-actions .btn-primary')
      .should('contain', 'Commencer gratuitement')
      .and('have.attr', 'href', '/register')
    cy.get('.hero-actions .btn-secondary').should('contain', 'Voir la démo')
  })

  it('liste les 3 features', () => {
    cy.get('.feature-item').should('have.length', 3)
    cy.get('.features').should('contain', 'Validé par votre école')
    cy.get('.features').should('contain', 'GitHub')
    cy.get('.features').should('contain', 'Export PDF')
  })

  it('affiche le footer avec copyright et liens', () => {
    cy.get('.footer span').should('contain', '© 2026 Portfy')
    cy.get('.footer-links a').should('have.length', 3)
  })

  // ---- Navigation réelle ----
  it('redirige vers /login au clic sur Connexion', () => {
    cy.get('.btn-login').click()
    cy.url().should('include', '/login')
  })

  it('redirige vers /register au clic sur "Commencer gratuitement"', () => {
    cy.get('.hero-actions .btn-primary').click()
    cy.url().should('include', '/register')
  })

  // ---- Responsive ----
  it('s\'affiche correctement sur mobile', () => {
    cy.viewport('iphone-x')
    cy.get('.navbar').should('be.visible')
    cy.get('.hero h1').should('be.visible')
    cy.get('.features').should('be.visible')
  })
})
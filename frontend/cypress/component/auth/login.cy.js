import LoginForm from '@/components/auth/LoginForm.vue'

describe('LoginForm.vue - Component', () => {
  beforeEach(() => {
    cy.mount(LoginForm)
  })

  it('affiche le formulaire login', () => {
    cy.contains('Bon retour').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('button', 'Se connecter').should('be.visible')
  })

  it('affiche les erreurs si les champs sont vides', () => {
    cy.contains('button', 'Se connecter').click()

    cy.contains("L'adresse e-mail est requise.").should('be.visible')
    cy.contains('Le mot de passe est requis.').should('be.visible')
  })

  it('affiche erreur si email invalide', () => {
    cy.get('input[type="email"]').type('email-faux')
    cy.get('input[type="password"]').type('Password1!')

    cy.contains('button', 'Se connecter').click()

    cy.contains('Veuillez entrer une adresse e-mail valide.').should('be.visible')
  })

  it('affiche erreur si password court', () => {
    cy.get('input[type="email"]').type('test@gmail.com')
    cy.get('input[type="password"]').type('123')

    cy.contains('button', 'Se connecter').click()

    cy.contains('Le mot de passe doit comporter au moins 6 caractères.')
      .should('be.visible')
  })

  it('affiche et masque le mot de passe', () => {
    cy.get('input[autocomplete="current-password"]')
      .should('have.attr', 'type', 'password')

    cy.get('.toggle-password').click()

    cy.get('input[autocomplete="current-password"]')
      .should('have.attr', 'type', 'text')
  })
})
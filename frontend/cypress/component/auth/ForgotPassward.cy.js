import ForgotForm from '@/components/auth/ForgotForm.vue'

describe('ForgotForm.vue - Component', () => {
  beforeEach(() => {
    cy.mount(ForgotForm)
  })

  it('affiche le formulaire forgot password étape 1', () => {
    cy.contains('Retour à la connexion').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.contains('button', 'Envoyer le code').should('be.visible')
  })

  it('affiche erreur si email vide', () => {
    cy.contains('button', 'Envoyer le code').click()

    cy.contains('Email obligatoire').should('be.visible')
  })

  it('affiche erreur si email invalide', () => {
    cy.get('input[type="email"]').type('email-faux')

    cy.contains('button', 'Envoyer le code').click()

    cy.contains('Veuillez entrer un email valide').should('be.visible')
  })

  it('passe vers étape OTP si email valide', () => {
    cy.intercept('POST', '**/api/auth/forgot-password', {
      statusCode: 200,
      body: {
        message: 'Code envoyé',
      },
    }).as('forgotRequest')

    cy.get('input[type="email"]').type('test@gmail.com')
    cy.contains('button', 'Envoyer le code').click()

    cy.wait('@forgotRequest')

    cy.contains('Un code à 6 chiffres').should('be.visible')
    cy.get('.otp-input').should('have.length', 6)
  })

  it('affiche erreur si OTP incomplet', () => {
    goToOtpStep()

    cy.get('.otp-input').first().type('1')
    cy.contains('button', 'Vérifier le code').click()

    cy.contains('Veuillez entrer le code complet').should('be.visible')
  })
})

function goToOtpStep() {
  cy.intercept('POST', '**/api/auth/forgot-password', {
    statusCode: 200,
    body: {
      message: 'Code envoyé',
    },
  }).as('forgotRequest')

  cy.get('input[type="email"]').type('test@gmail.com')
  cy.contains('button', 'Envoyer le code').click()

  cy.wait('@forgotRequest')
}
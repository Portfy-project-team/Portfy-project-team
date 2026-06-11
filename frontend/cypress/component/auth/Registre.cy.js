import RegisterForm from '@/components/auth/RegisterForm.vue'

describe('RegisterForm.vue - Component', () => {
  beforeEach(() => {
    cy.mount(RegisterForm)
  })

  it('affiche le formulaire register étape 1', () => {
    cy.contains('Créez votre compte').should('be.visible')
    cy.contains('Rejoignez votre espace Portfy').should('be.visible')

    cy.get('input[placeholder="Votre nom"]').should('be.visible')
    cy.get('input[placeholder="Votre prénom"]').should('be.visible')
    cy.get('input[placeholder="votre.email@institution.ma"]').should('be.visible')
    cy.contains('button', 'Continuer').should('be.visible')
  })

  it('affiche erreurs si étape 1 est vide', () => {
    cy.contains('button', 'Continuer').click()

    cy.contains('Nom obligatoire').should('be.visible')
    cy.contains('Prénom obligatoire').should('be.visible')
    cy.contains('Email obligatoire').should('be.visible')
    cy.contains('Mot de passe obligatoire').should('be.visible')
    cy.contains('Confirmation obligatoire').should('be.visible')
    cy.contains('Choisissez un rôle').should('be.visible')
    cy.contains('Veuillez accepter les conditions').should('be.visible')
  })

  it('affiche erreur email invalide', () => {
    cy.get('input[placeholder="Votre nom"]').type('Zailachi')
    cy.get('input[placeholder="Votre prénom"]').type('Youssef')
    cy.get('input[placeholder="votre.email@institution.ma"]').type('email-faux')
    cy.get('input[placeholder="Mot de passe"]').type('Password1!')
    cy.get('input[placeholder="Confirmer le mot de passe"]').type('Password1!')
    cy.get('select').select('STUDENT')
    cy.get('#terms').check()

    cy.contains('button', 'Continuer').click()

    cy.contains('Email invalide').should('be.visible')
  })

  it('affiche erreur si mots de passe différents', () => {
    cy.get('input[placeholder="Votre nom"]').type('Zailachi')
    cy.get('input[placeholder="Votre prénom"]').type('Youssef')
    cy.get('input[placeholder="votre.email@institution.ma"]').type('test@gmail.com')
    cy.get('input[placeholder="Mot de passe"]').type('Password1!')
    cy.get('input[placeholder="Confirmer le mot de passe"]').type('Password2!')
    cy.get('select').select('STUDENT')
    cy.get('#terms').check()

    cy.contains('button', 'Continuer').click()

    cy.contains('Les mots de passe ne correspondent pas').should('be.visible')
  })

  it('passe vers étape 2 étudiant', () => {
    fillStep1Student()

    cy.contains('button', 'Continuer').click()

    cy.contains('Votre formation').should('be.visible')
    cy.contains('Type de formation').should('be.visible')
  })
})

function fillStep1Student() {
  cy.get('input[placeholder="Votre nom"]').type('Zailachi')
  cy.get('input[placeholder="Votre prénom"]').type('Youssef')
  cy.get('input[placeholder="votre.email@institution.ma"]').type('test@gmail.com')
  cy.get('input[placeholder="Mot de passe"]').type('Password1!')
  cy.get('input[placeholder="Confirmer le mot de passe"]').type('Password1!')
  cy.get('select').select('STUDENT')
  cy.get('#terms').check()
}
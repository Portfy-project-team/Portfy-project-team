describe('Auth Pages - E2E', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('affiche la page login', () => {
      cy.contains('Bon retour').should('be.visible')
      cy.contains('Se connecter').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
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

    it('connecte utilisateur avec succès', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          user: {
            id: 1,
            name: 'Youssef',
            email: 'test@gmail.com',
            role: 'STUDENT',
          },
        },
      }).as('loginRequest')

      cy.get('input[type="email"]').type('test@gmail.com')
      cy.get('input[type="password"]').type('Password1!')

      cy.contains('button', 'Se connecter').click()

      cy.wait('@loginRequest')
      cy.location('pathname').should('include', '/dashboard')
    })

    it('redirige vers register', () => {
      cy.contains('Créer un compte').click()
      cy.location('pathname').should('include', '/register')
    })

    it('redirige vers forgot password', () => {
      cy.contains('Mot de passe oublié ?').click()
      cy.location('pathname').should('include', '/forgot-password')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    it('affiche la page register', () => {
      cy.contains('Créez votre compte').should('be.visible')
      cy.contains('Continuer').should('be.visible')
      cy.get('input[placeholder="Votre nom"]').should('be.visible')
      cy.get('input[placeholder="Votre prénom"]').should('be.visible')
    })

    it('affiche les erreurs si formulaire vide', () => {
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
      fillRegisterStep1('email-faux')

      cy.contains('button', 'Continuer').click()

      cy.contains('Email invalide').should('be.visible')
    })

    it('passe vers étape 2 étudiant', () => {
      fillRegisterStep1()

      cy.contains('button', 'Continuer').click()

      cy.contains('Votre formation').should('be.visible')
      cy.contains('Type de formation').should('be.visible')
    })

    it('redirige vers login', () => {
      cy.contains('Connexion').click()
      cy.location('pathname').should('include', '/login')
    })
  })

  describe('Forgot Password Page', () => {
    beforeEach(() => {
      cy.visit('/forgot-password')
    })

    it('affiche la page forgot password', () => {
      cy.contains('Retour à la connexion').should('be.visible')
      cy.contains('Envoyer le code').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
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

    it('redirige vers login', () => {
      cy.contains('Retour à la connexion').click()
      cy.location('pathname').should('include', '/login')
    })
  })

  describe('Pending Validation Page', () => {
    beforeEach(() => {
      cy.visit('/pending-validation')
    })

    it('affiche la page compte en attente', () => {
      cy.contains('Compte en attente de validation').should('be.visible')
      cy.contains('Votre dossier a bien été reçu').should('be.visible')
      cy.contains('24 à 48h').should('be.visible')
    })

    it('redirige vers login', () => {
      cy.contains('Retour à la connexion').click()
      cy.location('pathname').should('include', '/login')
    })
  })
})

function fillRegisterStep1(email = 'test@gmail.com') {
  cy.get('input[placeholder="Votre nom"]').type('Zailachi')
  cy.get('input[placeholder="Votre prénom"]').type('Youssef')
  cy.get('input[placeholder="votre.email@institution.ma"]').type(email)
  cy.get('input[placeholder="Mot de passe"]').type('Password1!')
  cy.get('input[placeholder="Confirmer le mot de passe"]').type('Password1!')

  cy.get('select').first().select('STUDENT')
  cy.get('#terms').check()
}
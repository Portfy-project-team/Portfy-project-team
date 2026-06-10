// ─────────────────────────────────────────────────────────────
//  TESTS E2E — AUTHENTIFICATION (focus : Professeur)
//  cypress/e2e/auth/auth.cy.js
// ─────────────────────────────────────────────────────────────

describe('🔐 Authentification — Professeur', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  beforeEach(() => {
    cy.visit('/auth/login')
  })

  // ──────────────────────────────────────────────────────────
  //  1. AFFICHAGE DE LA PAGE DE LOGIN
  // ──────────────────────────────────────────────────────────
  describe('Page de connexion — UI', () => {
    it('affiche correctement le formulaire de connexion', () => {
      cy.get('[data-cy="login-email"]').should('be.visible')
      cy.get('[data-cy="login-password"]').should('be.visible')
      cy.get('[data-cy="login-submit"]').should('be.visible').and('not.be.disabled')
    })

    it('affiche un lien "Mot de passe oublié"', () => {
      cy.get('[data-cy="forgot-password-link"]').should('exist')
    })

    it('masque le mot de passe par défaut', () => {
      cy.get('[data-cy="login-password"]').should('have.attr', 'type', 'password')
    })

    it('permet de basculer la visibilité du mot de passe', () => {
      cy.get('[data-cy="toggle-password"]').click()
      cy.get('[data-cy="login-password"]').should('have.attr', 'type', 'text')
      cy.get('[data-cy="toggle-password"]').click()
      cy.get('[data-cy="login-password"]').should('have.attr', 'type', 'password')
    })
  })

  // ──────────────────────────────────────────────────────────
  //  2. CONNEXION RÉUSSIE — PROFESSEUR
  // ──────────────────────────────────────────────────────────
  describe('Connexion réussie', () => {
    it('connecte le professeur avec des identifiants valides', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token-professor',
          user: {
            id: 1,
            role: 'professor',
            firstName: users.professor.firstName,
            lastName: users.professor.lastName,
            email: users.professor.email,
          },
        },
      }).as('loginRequest')

      cy.loginUI(users.professor.email, users.professor.password)

      cy.wait('@loginRequest').its('request.body').should('deep.include', {
        email: users.professor.email,
        password: users.professor.password,
      })

      // Redirigé vers le dashboard professeur
      cy.url().should('include', '/professor/dashboard')
    })

    it('stocke le token dans le localStorage après connexion', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token', user: { role: 'professor' } },
      }).as('loginRequest')

      cy.loginUI(users.professor.email, users.professor.password)
      cy.wait('@loginRequest')

      cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('eq', 'fake-jwt-token')
    })

    it('affiche le nom du professeur dans le topbar après connexion', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          user: {
            role: 'professor',
            firstName: 'Ahmed',
            lastName: 'Benali',
          },
        },
      }).as('loginRequest')

      cy.loginUI(users.professor.email, users.professor.password)
      cy.wait('@loginRequest')

      cy.get('[data-cy="topbar-username"]')
        .should('be.visible')
        .and('contain', 'Ahmed')
    })
  })

  // ──────────────────────────────────────────────────────────
  //  3. CONNEXION ÉCHOUÉE — CAS D'ERREUR
  // ──────────────────────────────────────────────────────────
  describe('Connexion échouée', () => {
    it('affiche une erreur avec un mot de passe incorrect', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Identifiants incorrects' },
      }).as('loginFailed')

      cy.loginUI(users.professorInvalid.email, users.professorInvalid.password)
      cy.wait('@loginFailed')

      cy.get('[data-cy="login-error"]')
        .should('be.visible')
        .and('contain', 'Identifiants incorrects')

      // Reste sur la page de login
      cy.url().should('include', '/auth/login')
    })

    it("affiche une erreur si l'email est inconnu", () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 404,
        body: { message: 'Utilisateur introuvable' },
      }).as('loginNotFound')

      cy.loginUI(users.professorUnknown.email, users.professorUnknown.password)
      cy.wait('@loginNotFound')

      cy.get('[data-cy="login-error"]').should('be.visible')
      cy.url().should('include', '/auth/login')
    })

    it('affiche une erreur de validation si les champs sont vides', () => {
      cy.get('[data-cy="login-submit"]').click()

      cy.get('[data-cy="error-email"]').should('be.visible')
      cy.get('[data-cy="error-password"]').should('be.visible')

      // Pas d'appel API si validation front échoue
      cy.get('@loginRequest').should('not.exist')
    })

    it('affiche une erreur de format pour un email invalide', () => {
      cy.get('[data-cy="login-email"]').type('pasunemail')
      cy.get('[data-cy="login-submit"]').click()

      cy.get('[data-cy="error-email"]')
        .should('be.visible')
        .and('contain', 'email valide')
    })

    it('désactive le bouton pendant la requête en cours', () => {
      cy.intercept('POST', '**/auth/login', (req) => {
        req.reply({ delay: 1000, statusCode: 200, body: { token: 'tok', user: { role: 'professor' } } })
      }).as('loginSlow')

      cy.loginUI(users.professor.email, users.professor.password)

      cy.get('[data-cy="login-submit"]').should('be.disabled')
      cy.wait('@loginSlow')
    })
  })

  // ──────────────────────────────────────────────────────────
  //  4. DÉCONNEXION
  // ──────────────────────────────────────────────────────────
  describe('Déconnexion', () => {
    beforeEach(() => {
      // Setup : simuler une session professeur active
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token', user: { role: 'professor', firstName: 'Ahmed' } },
      }).as('loginRequest')

      cy.loginUI(users.professor.email, users.professor.password)
      cy.wait('@loginRequest')
      cy.url().should('include', '/professor/dashboard')
    })

    it('déconnecte et redirige vers la page de login', () => {
      cy.intercept('POST', '**/auth/logout', { statusCode: 200 }).as('logoutRequest')

      cy.logout()

      cy.url().should('include', '/auth/login')
    })

    it('supprime le token du localStorage après déconnexion', () => {
      cy.intercept('POST', '**/auth/logout', { statusCode: 200 }).as('logoutRequest')

      cy.get('[data-cy="topbar-logout"], [data-cy="sidebar-logout"]').first().click()

      cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('be.null')
    })

    it('ne permet pas de revenir au dashboard après déconnexion (route protégée)', () => {
      cy.intercept('POST', '**/auth/logout', { statusCode: 200 }).as('logoutRequest')

      cy.get('[data-cy="topbar-logout"], [data-cy="sidebar-logout"]').first().click()
      cy.url().should('include', '/auth/login')

      // Tentative de retour arrière ou accès direct
      cy.visit('/professor/dashboard')
      cy.url().should('include', '/auth/login')
    })
  })

  // ──────────────────────────────────────────────────────────
  //  5. PERSISTANCE DE SESSION
  // ──────────────────────────────────────────────────────────
  describe('Persistance de session', () => {
    it('redirige vers le dashboard si déjà connecté et visite /login', () => {
      // Simuler un token déjà présent
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
        win.localStorage.setItem(
          'user',
          JSON.stringify({ role: 'professor', firstName: 'Ahmed' })
        )
      })

      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: { role: 'professor', firstName: 'Ahmed' },
      }).as('meRequest')

      cy.visit('/auth/login')

      cy.url().should('include', '/professor/dashboard')
    })

    it('expire la session et redirige vers login si le token est invalide', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token')
      })

      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'Token expiré' },
      }).as('meExpired')

      cy.visit('/professor/dashboard')

      cy.url().should('include', '/auth/login')
    })
  })
})

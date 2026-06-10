// ─────────────────────────────────────────────────────────────
//  COMMANDES GLOBALES CYPRESS
//  cypress/support/commands.js
// ─────────────────────────────────────────────────────────────

// ── Authentification ──────────────────────────────────────────

/**
 * Connexion via l'interface utilisateur (formulaire)
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/auth/login')
  cy.get('[data-cy="login-email"]').clear().type(email)
  cy.get('[data-cy="login-password"]').clear().type(password)
  cy.get('[data-cy="login-submit"]').click()
})

/**
 * Connexion rapide via API (bypass UI — pour setup de tests)
 * @param {string} role  'professor' | 'admin' | 'student'
 */
Cypress.Commands.add('loginByRole', (role) => {
  const credentials = {
    professor: {
      email: Cypress.env('professor_email'),
      password: Cypress.env('professor_password'),
    },
    admin: {
      email: Cypress.env('admin_email'),
      password: Cypress.env('admin_password'),
    },
    student: {
      email: Cypress.env('student_email'),
      password: Cypress.env('student_password'),
    },
  }

  const { email, password } = credentials[role]

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      window.localStorage.setItem('token', response.body.token)
      window.localStorage.setItem('user', JSON.stringify(response.body.user))
    }
  })
})

/**
 * Déconnexion
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="topbar-logout"], [data-cy="sidebar-logout"]')
    .first()
    .click()
  cy.url().should('include', '/auth/login')
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.be.null
  })
})

/**
 * Vérifier qu'un utilisateur est connecté (token présent)
 */
Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage').invoke('getItem', 'token').should('exist')
})

/**
 * Vérifier qu'aucun utilisateur n'est connecté
 */
Cypress.Commands.add('assertLoggedOut', () => {
  cy.window().its('localStorage').invoke('getItem', 'token').should('be.null')
})

// ── Navigation ────────────────────────────────────────────────

/**
 * Naviguer vers le dashboard d'un rôle
 * @param {string} role  'professor' | 'admin' | 'student'
 */
Cypress.Commands.add('goToDashboard', (role) => {
  const routes = {
    professor: '/professor/dashboard',
    admin: '/admin/dashboard',
    student: '/student/dashboard',
  }
  cy.visit(routes[role])
})

// ── Utilitaires UI ────────────────────────────────────────────

/**
 * Attendre qu'un loader disparaisse
 */
Cypress.Commands.add('waitForLoader', () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 10000 }).should('not.exist')
})

/**
 * Vérifier un message de toast / notification
 * @param {string} type    'success' | 'error' | 'warning'
 * @param {string} text    Texte attendu (partiel)
 */
Cypress.Commands.add('assertToast', (type, text) => {
  cy.get(`[data-cy="toast-${type}"]`).should('be.visible').and('contain', text)
})
// ─────────────────────────────────────────────────────────────
//  TESTS E2E — PROFESSEUR (Dashboard, Navigation, Accès)
//  cypress/e2e/professor/professor.cy.js
// ─────────────────────────────────────────────────────────────

describe('👨‍🏫 Professeur — Dashboard & Navigation', () => {
  let professor
  let professorData

  before(() => {
    cy.fixture('users').then((u) => { professor = u.professor })
    cy.fixture('professors').then((p) => { professorData = p })
  })

  beforeEach(() => {
    // Connexion rapide sans passer par l'UI
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-professor',
        user: {
          id: 1,
          role: 'professor',
          firstName: professor.firstName,
          lastName: professor.lastName,
          email: professor.email,
        },
      },
    }).as('loginRequest')

    cy.intercept('GET', '**/professor/dashboard', {
      statusCode: 200,
      body: professorData.dashboard,
    }).as('dashboardData')

    cy.loginUI(professor.email, professor.password)
    cy.wait('@loginRequest')
  })

  // ──────────────────────────────────────────────────────────
  //  1. ACCÈS AU DASHBOARD
  // ──────────────────────────────────────────────────────────
  describe('Dashboard', () => {
    it('accède au dashboard professeur après connexion', () => {
      cy.url().should('include', '/professor/dashboard')
    })

    it('affiche les statistiques clés (StatCards)', () => {
      cy.wait('@dashboardData')

      cy.get('[data-cy="stat-card"]').should('have.length.at.least', 3)
      cy.get('[data-cy="stat-total-students"]')
        .should('be.visible')
        .and('contain', professorData.dashboard.totalStudents)
      cy.get('[data-cy="stat-total-courses"]')
        .should('be.visible')
        .and('contain', professorData.dashboard.totalCourses)
    })

    it('affiche le nom du professeur dans le topbar', () => {
      cy.get('[data-cy="topbar-username"]')
        .should('be.visible')
        .and('contain', professor.firstName)
    })
  })

  // ──────────────────────────────────────────────────────────
  //  2. SIDEBAR — NAVIGATION
  // ──────────────────────────────────────────────────────────
  describe('Sidebar — Navigation', () => {
    it('affiche les liens de navigation du professeur', () => {
      cy.get('[data-cy="sidebar"]').should('be.visible')
      cy.get('[data-cy="sidebar-link-dashboard"]').should('exist')
      cy.get('[data-cy="sidebar-link-courses"]').should('exist')
      cy.get('[data-cy="sidebar-link-students"]').should('exist')
    })

    it('met en surbrillance le lien actif', () => {
      cy.get('[data-cy="sidebar-link-dashboard"]')
        .should('have.class', 'active')
    })

    it('navigue vers la liste des cours via la sidebar', () => {
      cy.intercept('GET', '**/professor/courses', { statusCode: 200, body: [] }).as('courses')
      cy.get('[data-cy="sidebar-link-courses"]').click()
      cy.url().should('include', '/professor/courses')
    })
  })

  // ──────────────────────────────────────────────────────────
  //  3. CONTRÔLE D'ACCÈS — ROUTES PROTÉGÉES
  // ──────────────────────────────────────────────────────────
  describe("Contrôle d'accès", () => {
    it("bloque l'accès au dashboard admin pour un professeur", () => {
      cy.visit('/admin/dashboard')
      // Redirigé vers son propre espace ou une page 403
      cy.url().should('not.include', '/admin/dashboard')
    })

    it("bloque l'accès au dashboard étudiant pour un professeur", () => {
      cy.visit('/student/dashboard')
      cy.url().should('not.include', '/student/dashboard')
    })
  })
})
